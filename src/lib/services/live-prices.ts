// Live prices service — mock 단계에서도 "정렬/집계는 서버 책임" 원칙을 반영.
// 컴포넌트는 sort/limit/offset만 넘기고, 이미 정렬된 결과를 그대로 렌더한다.

import { getPriceBase } from "@/lib/mock/price-base";
import { basisDateIso, BASIS_UPDATED_TIME } from "@/lib/data-basis";
import { unitKgOf } from "@/lib/units";

export type LivePriceRow = {
  id: string;
  name: string;
  market: string; // 대표 시장(참고용)
  unit: string; // 원 단위 표준거래단위
  pricePerKg: number; // kg당 평균가 (원/kg)
  changePct: number; // 전국 평균가 기준 등락률(%)
  volumeTon: number; // 전국 거래량 합계(t)
};

export type LiveSort = "up" | "down" | "vol";

// Deterministic mock pool (실제 API 교체 대상)
// 표시명·kg 단가·등락률은 품목 기준값 SSOT(`@/lib/mock/price-base`)에서만 가져온다.
// → 홈 실시간시세와 시세조회메인(MKT-001)의 가격/등락률/표시명이 항상 일치한다.
type PoolSeed = { id: string; market: string; unit: string; volumeTon: number };

const POOL_SEED: PoolSeed[] = [
  { id: "cabbage", market: "서울가락", unit: "10kg망", volumeTon: 328.4 },
  { id: "radish", market: "대구북부", unit: "20kg박스", volumeTon: 245.2 },
  { id: "greenonion", market: "대전오정", unit: "1kg단", volumeTon: 186.7 },
  { id: "garlic", market: "서울가락", unit: "1kg", volumeTon: 112.3 },
  { id: "onion", market: "부산엄궁", unit: "15kg망", volumeTon: 198.7 },
  { id: "apple", market: "서울가락", unit: "10kg박스", volumeTon: 512.0 },
  { id: "pear", market: "서울가락", unit: "15kg박스", volumeTon: 312.0 },
  { id: "cucumber", market: "광주각화", unit: "10kg박스", volumeTon: 142.5 },
  { id: "tomato", market: "서울가락", unit: "5kg박스", volumeTon: 168.9 },
  { id: "potato", market: "서울가락", unit: "20kg박스", volumeTon: 274.1 },
  { id: "chili", market: "서울가락", unit: "10kg박스", volumeTon: 88.4 },
  { id: "spinach", market: "광주각화", unit: "4kg박스", volumeTon: 62.3 },
  { id: "carrot", market: "부산엄궁", unit: "20kg박스", volumeTon: 132.9 },
  { id: "grape", market: "서울가락", unit: "5kg박스", volumeTon: 96.8 },
  { id: "peach", market: "서울가락", unit: "4.5kg박스", volumeTon: 74.2 },
  { id: "watermelon", market: "서울가락", unit: "8kg박스", volumeTon: 220.5 },
  { id: "mandarin", market: "서울가락", unit: "10kg박스", volumeTon: 158.2 },
  { id: "lettuce", market: "광주각화", unit: "4kg박스", volumeTon: 42.1 },
  { id: "pepper", market: "광주각화", unit: "5kg박스", volumeTon: 38.4 },
  { id: "sweetpotato", market: "서울가락", unit: "10kg박스", volumeTon: 122.6 },
];

const POOL: LivePriceRow[] = POOL_SEED.map((seed) => {
  const base = getPriceBase(seed.id);
  return {
    id: seed.id,
    name: base.name,
    market: seed.market,
    unit: seed.unit,
    pricePerKg: base.basePricePerKg,
    changePct: base.changeRate,
    volumeTon: seed.volumeTon,
  };
});

// 정렬 결과는 정렬 기준별로 1회만 계산해서 캐시한다.
// (정렬 탭을 눌러도 목록 데이터를 새로 만들지 않고, 캐시된 정렬 결과를 재사용)
const SORTED_CACHE = new Map<LiveSort, LivePriceRow[]>();

function sortPool(sort: LiveSort): LivePriceRow[] {
  const cached = SORTED_CACHE.get(sort);
  if (cached) return cached;
  const arr = [...POOL];
  if (sort === "up") arr.sort((a, b) => b.changePct - a.changePct);
  else if (sort === "down") arr.sort((a, b) => a.changePct - b.changePct);
  else arr.sort((a, b) => b.volumeTon - a.volumeTon);
  SORTED_CACHE.set(sort, arr);
  return arr;
}

/**
 * mock: 서버 정렬/집계 결과를 반환한다고 가정.
 * 실제 API 교체 시 시그니처만 유지하면 컴포넌트 수정 없이 교체 가능.
 */
export function getLivePrices({
  sort,
  limit,
  offset = 0,
}: {
  sort: LiveSort;
  limit: number;
  offset?: number;
}): { rows: LivePriceRow[]; total: number } {
  const all = sortPool(sort);
  return { rows: all.slice(offset, offset + limit), total: all.length };
}

export const LIVE_SORT_META: Record<LiveSort, { label: string; hint: string }> = {
  up: { label: "상승률순", hint: "전국 평균가 기준 등락률" },
  down: { label: "하락률순", hint: "전국 평균가 기준 등락률" },
  vol: { label: "거래량순", hint: "전국 거래량 합계" },
};

/* -------------------------------------------------------------------------
 * 최근 거래 피드 (실시간 시세 화면)
 *
 * 기존 랭킹용 POOL/정렬 로직은 그대로 두고, 거래 시각을 가진 피드 전용
 * selector만 확장한다. 실제 API 교체 시 `buildTrades`만 응답 매핑으로
 * 바꾸면 되고 화면 코드는 수정하지 않는다. (random 미사용 — deterministic)
 * ---------------------------------------------------------------------- */

export type LiveTrade = {
  /** 거래 단건 키 */
  key: string;
  /** 품목 id (시세 화면 이동용) */
  id: string;
  name: string;
  market: string;
  /** 거래 단위 (예: 10kg망) */
  unit: string;
  /** 거래 단위 기준 거래 가격(원) */
  price: number;
  /** 거래 시각 (로컬 기준 "YYYY-MM-DDTHH:mm") */
  tradedAt: string;
  // 아래 값들은 다른 화면과의 호환을 위해 보존 (피드 UI에서는 표시하지 않음)
  pricePerKg: number;
  changePct: number;
  volumeTon: number;
};

const TRADES_PER_ITEM = 4;

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** 기준 거래 시각에서 n분 전 시각을 "YYYY-MM-DDTHH:mm"으로 */
function minutesBefore(minutes: number): string {
  const [y, m, d] = basisDateIso().split("-").map(Number);
  const [hh, mm] = BASIS_UPDATED_TIME.split(":").map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1, hh ?? 0, mm ?? 0);
  dt.setMinutes(dt.getMinutes() - minutes);
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
}

function buildTrades(): LiveTrade[] {
  const out: LiveTrade[] = [];
  for (const row of POOL) {
    const kg = unitKgOf(row.unit) || 1;
    const h = hash(row.id);
    for (let k = 0; k < TRADES_PER_ITEM; k++) {
      const offset = (h % 23) * 3 + k * 37 + (hash(row.id + k) % 11);
      const jitter = 1 + ((hash(row.id + ":" + k) % 7) - 3) / 100;
      const price = Math.round((row.pricePerKg * kg * jitter) / 10) * 10;
      out.push({
        key: `${row.id}-${k}`,
        id: row.id,
        name: row.name,
        market: row.market,
        unit: row.unit,
        price,
        tradedAt: minutesBefore(offset),
        pricePerKg: row.pricePerKg,
        changePct: row.changePct,
        volumeTon: row.volumeTon,
      });
    }
  }
  // 최신 거래순
  out.sort((a, b) => (a.tradedAt < b.tradedAt ? 1 : a.tradedAt > b.tradedAt ? -1 : 0));
  return out;
}

let TRADES_CACHE: LiveTrade[] | null = null;

function allTrades(): LiveTrade[] {
  if (!TRADES_CACHE) TRADES_CACHE = buildTrades();
  return TRADES_CACHE;
}

/**
 * 최근 거래 목록(최신순). 시장/품목 조건은 "전체"를 지원한다.
 * marketLabel / cropId 가 없으면 전체.
 */
export function getLiveTrades({
  marketLabel,
  cropId,
  limit,
  offset = 0,
}: {
  marketLabel?: string;
  cropId?: string;
  limit: number;
  offset?: number;
}): { rows: LiveTrade[]; total: number } {
  let all = allTrades();
  if (marketLabel) all = all.filter((t) => t.market === marketLabel);
  if (cropId) all = all.filter((t) => t.id === cropId);
  return { rows: all.slice(offset, offset + limit), total: all.length };
}

/** 오늘 거래는 HH:mm, 과거 날짜 거래는 MM.DD HH:mm */
export function formatTradedAt(tradedAt: string): string {
  const [date, time = ""] = tradedAt.split("T");
  if (date === basisDateIso()) return time;
  const [, m = "", d = ""] = (date ?? "").split("-");
  return `${m}.${d} ${time}`;
}
