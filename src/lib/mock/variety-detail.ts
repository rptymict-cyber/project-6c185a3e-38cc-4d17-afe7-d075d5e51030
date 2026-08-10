// Extra mock helpers for the 품목 상세 페이지.
// Uses the same deterministic seeding conventions as market-analysis.ts.

import { MARKETS } from "./markets";
import { getPriceBase } from "./price-base";

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}
function seeded(seed: number) {
  let s = seed || 1;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}
function unitKg(unit: string): number {
  const m = unit.match(/(\d+(?:\.\d+)?)\s*kg/);
  return m ? parseFloat(m[1]) : 1;
}

// -- price series with min/max annotations ---------------------------------

export type DetailPeriod = "today" | "1w" | "1m" | "3m" | "1y" | "all";

const PERIOD_POINTS: Record<DetailPeriod, number> = {
  today: 12,
  "1w": 7,
  "1m": 30,
  "3m": 90,
  "1y": 12,
  all: 24,
};

export type DetailSeriesPoint = { label: string; date: string; price: number };
export type DetailSeries = {
  points: DetailSeriesPoint[];
  max: { price: number; index: number };
  min: { price: number; index: number };
  end: DetailSeriesPoint;
};

export function getDetailSeries(p: {
  varietyId: string;
  marketId: string;
  unit: string;
  period: DetailPeriod;
}): DetailSeries {
  const rand = seeded(hash(`detail|${p.varietyId}|${p.marketId}|${p.period}`));
  const priceBase = getPriceBase(p.varietyId);
  const base = priceBase.basePricePerKg * unitKg(p.unit);
  // 최고/최저는 기준값의 등락률 폭으로 계산한다.
  const swing = Math.max(0.04, Math.min(0.2, Math.abs(priceBase.changeRate) / 100 * 2));
  const n = PERIOD_POINTS[p.period];
  const now = new Date();
  const points: DetailSeriesPoint[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    if (p.period === "1y" || p.period === "all") d.setMonth(d.getMonth() - i);
    else if (p.period === "today") d.setHours(d.getHours() - i);
    else d.setDate(d.getDate() - i);
    const price = Math.round((base * (1 + (rand() - 0.5) * 2 * swing)) / 10) * 10;
    const label =
      p.period === "today"
        ? `${String(d.getHours()).padStart(2, "0")}시`
        : p.period === "1y" || p.period === "all"
          ? `${d.getMonth() + 1}월`
          : `${d.getMonth() + 1}/${d.getDate()}`;
    points.push({ label, date: d.toISOString().slice(0, 10), price });
  }
  let maxI = 0;
  let minI = 0;
  points.forEach((pt, i) => {
    if (pt.price > points[maxI].price) maxI = i;
    if (pt.price < points[minI].price) minI = i;
  });
  return {
    points,
    max: { price: points[maxI].price, index: maxI },
    min: { price: points[minI].price, index: minI },
    end: points[points.length - 1],
  };
}

// -- breakdown tables -------------------------------------------------------

export type MarketCompareRow = {
  marketId: string;
  marketName: string;
  price: number;
  prevPct: number;
  volumeTon: number;
  sharePct: number;
};

export function getMarketCompare(p: { varietyId: string; unit: string }): MarketCompareRow[] {
  const kg = unitKg(p.unit);
  const rows = MARKETS.map((m) => {
    const r = seeded(hash(`cmp|${p.varietyId}|${m.id}`));
    const pb = getPriceBase(p.varietyId);
    const perKg = Math.round(pb.basePricePerKg * (1 + (r() - 0.5) * 0.16));
    return {
      marketId: m.id,
      marketName: m.name,
      price: Math.round((perKg * kg) / 10) * 10,
      prevPct: pb.changeRate,
      volumeTon: +(10 + r() * 40).toFixed(1),
      sharePct: 0,
    };
  });
  const total = rows.reduce((s, r) => s + r.volumeTon, 0);
  rows.forEach((r) => (r.sharePct = +((r.volumeTon / total) * 100).toFixed(1)));
  rows.sort((a, b) => b.price - a.price);
  return rows;
}

export type CompanyRow = {
  name: string;
  avgPrice: number;
  prevPct: number;
  count: number;
};

export function getCompanyBreakdown(p: {
  varietyId: string;
  marketId: string;
  unit: string;
}): CompanyRow[] {
  const kg = unitKg(p.unit);
  const names: Record<string, string[]> = {
    "seoul-garak": ["서울청과㈜", "중앙청과㈜", "동화청과㈜", "농협가락㈜"],
    "daejeon-ojeong": ["오정청과㈜", "대전중앙청과㈜"],
    "busan-eomgung": ["엄궁청과㈜"],
    "daegu-bugbu": ["북부청과㈜", "대구농협㈜"],
    "gwangju-gakhwa": ["각화청과㈜"],
  };
  const list = names[p.marketId] ?? ["서울청과㈜", "중앙청과㈜"];
  return list
    .map((name) => {
      const r = seeded(hash(`co|${p.varietyId}|${p.marketId}|${name}`));
      const pb = getPriceBase(p.varietyId);
      const perKg = Math.round(pb.basePricePerKg * (1 + (r() - 0.5) * 0.12));
      return {
        name,
        avgPrice: Math.round((perKg * kg) / 10) * 10,
        prevPct: pb.changeRate,
        count: 10 + Math.floor(r() * 80),
      };
    })
    .sort((a, b) => b.count - a.count);
}

export type OriginRow = {
  region: string;
  avgPrice: number;
  count: number;
  sharePct: number;
};

export function getOriginBreakdown(p: {
  varietyId: string;
  marketId: string;
  unit: string;
}): OriginRow[] {
  const kg = unitKg(p.unit);
  const regions = ["경기 여주시", "경기 이천시", "경기 안성시", "강원 춘천시", "전남 나주시"];
  const rows = regions.map((region) => {
    const r = seeded(hash(`or|${p.varietyId}|${p.marketId}|${region}`));
    const perKg = Math.round(getPriceBase(p.varietyId).basePricePerKg * (1 + (r() - 0.5) * 0.12));
    return {
      region,
      avgPrice: Math.round((perKg * kg) / 10) * 10,
      count: 3 + Math.floor(r() * 70),
      sharePct: 0,
    };
  });
  const total = rows.reduce((s, r) => s + r.count, 0);
  rows.forEach((r) => (r.sharePct = +((r.count / total) * 100).toFixed(0)));
  rows.sort((a, b) => b.count - a.count);
  return rows;
}

export type VarietyRow = {
  name: string;
  pricePerKg: number;
  prevPct: number;
  volumeTon: number;
  current: boolean;
};

export function getVarietyBreakdown(p: {
  itemLabel: string;
  currentVarietyLabel: string;
}): VarietyRow[] {
  // Fabricate sibling varieties around current one
  const siblings = [p.currentVarietyLabel, "미니가지", "장가지"].slice(0, 3);
  const seen = new Set<string>();
  const unique = siblings.filter((s) => (seen.has(s) ? false : (seen.add(s), true)));
  return unique
    .map((name) => {
      const r = seeded(hash(`var|${p.itemLabel}|${name}`));
      return {
        name,
        pricePerKg: Math.round(getPriceBase(p.itemLabel).basePricePerKg * (1 + (r() - 0.5) * 0.16)),
        prevPct: getPriceBase(p.itemLabel).changeRate,
        volumeTon: +(1 + r() * 35).toFixed(1),
        current: name === p.currentVarietyLabel,
      };
    })
    .sort((a, b) => Number(b.current) - Number(a.current));
}
