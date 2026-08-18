// Live prices service — mock 단계에서도 "정렬/집계는 서버 책임" 원칙을 반영.
// 컴포넌트는 sort/limit/offset만 넘기고, 이미 정렬된 결과를 그대로 렌더한다.

import { getPriceBase } from "@/lib/mock/price-base";

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
