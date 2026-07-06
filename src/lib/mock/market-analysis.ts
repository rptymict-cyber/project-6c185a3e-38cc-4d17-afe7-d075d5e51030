// Mock data provider for the /market pro-mode analysis view.
// Deterministic based on (item, variety, market, unit, date) so re-selection
// produces stable numbers for MVP.

import { MARKETS } from "./markets";

export type Period = "today" | "1w" | "1m" | "3m" | "1y";

export type MarketQuote = {
  price: number; // in the selected unit
  unit: string;
  prevPct: number;
  weekPct: number;
  yearPct: number;
  volumeTon: number;
  boxes: number;
  updatedAt: string; // "2026.07.05 23:15"
  requestedDate: string; // yyyy-mm-dd user picked
  effectiveDate: string; // yyyy-mm-dd actually shown (may differ if holiday)
  effectiveLabel: string; // "7월 5일(토) 경매 기준"
  fallbackNote?: string; // "7/6(일) 휴장으로 직전 거래일 표시"
};

export type SeriesPoint = {
  label: string;
  tooltipLabel: string;
  date: string;
  price: number;
  volume: number;
};
export type PriceVolumeSeries = {
  points: SeriesPoint[];
  min: number;
  max: number;
  avg: number;
};

export type MarketRankingRow = {
  marketId: string;
  marketName: string;
  price: number;
  prevPct: number;
  weekPct: number;
  volumeTon: number;
  sharePct: number;
  effectiveDate: string; // yyyy-mm-dd
  differentDate: boolean; // true when this market's data is on a different day
  differentDateLabel?: string; // e.g. "7/4 기준"
};

// -- utils ------------------------------------------------------------------

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function seeded(n: number) {
  let s = n || 1;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const HOLIDAYS = new Set(["2025-07-06"]); // 일요일 예시(휴장)

function prevTradingDay(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  for (let i = 0; i < 10; i++) {
    d.setDate(d.getDate() - 1);
    const s = d.toISOString().slice(0, 10);
    const dow = d.getDay();
    if (dow === 0) continue;
    if (HOLIDAYS.has(s)) continue;
    return s;
  }
  return iso;
}

function isTradingDay(iso: string): boolean {
  const d = new Date(iso + "T00:00:00");
  if (d.getDay() === 0) return false;
  if (HOLIDAYS.has(iso)) return false;
  return true;
}

function formatEffectiveLabel(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  const dow = ["일", "월", "화", "수", "목", "금", "토"][d.getDay()];
  return `${d.getMonth() + 1}월 ${d.getDate()}일(${dow}) 경매 기준`;
}

function formatHolidayLabel(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  const dow = ["일", "월", "화", "수", "목", "금", "토"][d.getDay()];
  return `${d.getMonth() + 1}/${d.getDate()}(${dow}) 휴장으로 직전 거래일 표시`;
}

function unitMultiplier(unit: string): number {
  // Base price is per kg; convert to selected unit.
  const m = unit.match(/(\d+(?:\.\d+)?)\s*kg/);
  if (m) return parseFloat(m[1]);
  return 1;
}

// -- quote ------------------------------------------------------------------

export function getMarketQuote(p: {
  itemId: string;
  varietyId: string;
  marketId: string;
  unit: string;
  date: string;
}): MarketQuote {
  const requested = p.date;
  const holiday = !isTradingDay(requested);
  const effective = holiday ? prevTradingDay(requested) : requested;

  const rand = seeded(hash(`${p.itemId}|${p.varietyId}|${p.marketId}|${effective}`));
  const basePerKg = 700 + Math.round(rand() * 1600); // 700 ~ 2300 per kg
  const mult = unitMultiplier(p.unit);
  const price = Math.round((basePerKg * mult) / 10) * 10;

  const prevPct = +(rand() * -14 + 3).toFixed(1); // often negative
  const weekPct = +(rand() * 12 - 2).toFixed(1);
  const yearPct = +(rand() * 24 - 4).toFixed(1);
  const volumeTon = +(15 + rand() * 40).toFixed(1);
  const boxes = Math.round(2500 + rand() * 3000);

  const d = new Date(effective + "T23:15:00");
  const updatedAt = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")} 23:15`;

  return {
    price,
    unit: p.unit,
    prevPct,
    weekPct,
    yearPct,
    volumeTon,
    boxes,
    updatedAt,
    requestedDate: requested,
    effectiveDate: effective,
    effectiveLabel: formatEffectiveLabel(effective),
    fallbackNote: holiday ? formatHolidayLabel(requested) : undefined,
  };
}

// -- series -----------------------------------------------------------------

const PERIOD_DAYS: Record<Period, number> = {
  today: 1,
  "1w": 7,
  "1m": 30,
  "3m": 90,
  "1y": 12,
};

export function getPriceSeries(p: {
  itemId: string;
  varietyId: string;
  marketId: string;
  unit: string;
  date: string;
  period: Period;
}): SeriesPoint[] {
  const rand = seeded(hash(`series|${p.itemId}|${p.varietyId}|${p.marketId}|${p.period}`));
  const mult = unitMultiplier(p.unit);
  const base = (700 + rand() * 1600) * mult;

  const points = PERIOD_DAYS[p.period];
  const out: SeriesPoint[] = [];
  const endDate = new Date(p.date + "T00:00:00");

  for (let i = points - 1; i >= 0; i--) {
    const d = new Date(endDate);
    if (p.period === "1y") d.setMonth(d.getMonth() - i);
    else d.setDate(d.getDate() - i);

    const drift = 1 + (rand() - 0.5) * 0.08;
    const price = Math.round((base * drift) / 10) * 10;
    const volume = +(20 + rand() * 40).toFixed(1);
    const label =
      p.period === "1y"
        ? `${d.getMonth() + 1}월`
        : `${d.getMonth() + 1}/${d.getDate()}`;
    out.push({
      label,
      date: d.toISOString().slice(0, 10),
      price,
      volume,
    });
  }
  return out;
}

// -- market rankings --------------------------------------------------------

export type RankingSort = "price-desc" | "price-asc" | "volume-desc" | "change-desc";

export const RANKING_SORT_LABEL: Record<RankingSort, string> = {
  "price-desc": "높은 가격순",
  "price-asc": "낮은 가격순",
  "volume-desc": "거래량순",
  "change-desc": "등락률순",
};

export function getMarketRankings(p: {
  itemId: string;
  varietyId: string;
  unit: string;
  date: string;
  sort: RankingSort;
}): MarketRankingRow[] {
  const mult = unitMultiplier(p.unit);
  const rows: MarketRankingRow[] = MARKETS.map((m) => {
    const rand = seeded(hash(`${p.itemId}|${p.varietyId}|${m.id}|${p.date}`));
    const basePerKg = 700 + Math.round(rand() * 1600);
    const price = Math.round((basePerKg * mult) / 10) * 10;
    const prevPct = +(rand() * -14 + 3).toFixed(1);
    const weekPct = +(rand() * 12 - 2).toFixed(1);
    const volumeTon = +(10 + rand() * 40).toFixed(1);
    // 30% chance market data is on an earlier day
    const different = rand() > 0.7 && !!p.date;
    let effectiveDate = p.date;
    let differentDateLabel: string | undefined;
    if (different) {
      effectiveDate = prevTradingDay(p.date);
      const d = new Date(effectiveDate + "T00:00:00");
      differentDateLabel = `${d.getMonth() + 1}/${d.getDate()} 기준`;
    }
    return {
      marketId: m.id,
      marketName: m.name,
      price,
      prevPct,
      weekPct,
      volumeTon,
      sharePct: 0,
      effectiveDate,
      differentDate: different,
      differentDateLabel,
    };
  });

  const total = rows.reduce((s, r) => s + r.volumeTon, 0);
  rows.forEach((r) => (r.sharePct = +((r.volumeTon / total) * 100).toFixed(1)));

  const sorters: Record<RankingSort, (a: MarketRankingRow, b: MarketRankingRow) => number> = {
    "price-desc": (a, b) => b.price - a.price,
    "price-asc": (a, b) => a.price - b.price,
    "volume-desc": (a, b) => b.volumeTon - a.volumeTon,
    "change-desc": (a, b) => b.prevPct - a.prevPct,
  };
  rows.sort(sorters[p.sort]);
  return rows;
}
