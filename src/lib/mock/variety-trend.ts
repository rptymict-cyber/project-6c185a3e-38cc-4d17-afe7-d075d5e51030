import { type Crop } from "./crops";
import { resolveRealCrop } from "./crop-resolver";
import { MARKETS } from "./markets";

export type TrendPeriod = "1w" | "2w" | "1m" | "3m" | "1y" | "5y";

export const PERIOD_LEN: Record<TrendPeriod, number> = {
  "1w": 7,
  "2w": 14,
  "1m": 30,
  "3m": 12, // weekly points
  "1y": 12, // monthly points
  "5y": 20, // quarterly points
};

export const PERIOD_STEP_DAYS: Record<TrendPeriod, number> = {
  "1w": 1,
  "2w": 1,
  "1m": 1,
  "3m": 7,
  "1y": 30,
  "5y": 90,
};

export type CompareSeriesId = string; // "all" | marketId | `${marketId}:${company}`

export type TrendPoint = {
  dateISO: string;
  label: string;
  prices: Record<CompareSeriesId, number>; // won/kg per series
  totalVolumeTon: number;
};

export type YearTrendPoint = {
  label: string; // day/week position within the comparison window
  prices: Record<string, number>; // year "2022" ... "2026" → won/kg
  totalVolumeTon: number;
};

// -----------------------------------------------------------------------------
// helpers
// -----------------------------------------------------------------------------

function hash(str: string): number {
  let s = 0;
  for (const ch of str) s = (s * 31 + ch.charCodeAt(0)) >>> 0;
  return s;
}

function seededRandom(seedNum: number): () => number {
  let s = seedNum || 1;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function unitKgOf(unit: string): number {
  const m = unit.match(/(\d+(?:\.\d+)?)\s*kg/);
  return m ? parseFloat(m[1]) : 1;
}

function seriesFor(base: number, len: number, seed: number, vol: number): number[] {
  const rnd = seededRandom(seed);
  let v = base;
  const out: number[] = [];
  for (let i = 0; i < len; i++) {
    v = v * (1 + (rnd() - 0.5) * vol);
    out.push(Math.max(30, Math.round(v)));
  }
  return out;
}

function marketFactor(marketId: string): number {
  const m = MARKETS.find((x) => x.id === marketId);
  return m ? m.avgKg / 3200 : 1;
}

function companyFactor(marketId: string, companyName: string): number {
  const m = MARKETS.find((x) => x.id === marketId);
  const c = m?.companies.find((co) => co.name === companyName);
  return c && m ? c.avgKg / m.avgKg : 1;
}

function labelForOffset(period: TrendPeriod, iso: string): string {
  const d = new Date(iso);
  const m = d.getMonth() + 1;
  const day = d.getDate();
  if (period === "1w" || period === "2w" || period === "1m") return `${m}/${day}`;
  if (period === "3m") return `${m}/${day}`;
  if (period === "1y") return `${m}월`;
  return `${String(d.getFullYear()).slice(2)}.${m}`;
}

// -----------------------------------------------------------------------------
// public API
// -----------------------------------------------------------------------------

export function decodeSeriesId(id: CompareSeriesId): {
  kind: "all" | "market" | "company";
  marketId?: string;
  companyName?: string;
  label: string;
} {
  if (id === "all") return { kind: "all", label: "전국" };
  if (id.includes(":")) {
    const [marketId, companyName] = id.split(":");
    const m = MARKETS.find((x) => x.id === marketId);
    return {
      kind: "company",
      marketId,
      companyName,
      label: `${m?.name ?? marketId} · ${companyName}`,
    };
  }
  const m = MARKETS.find((x) => x.id === id);
  return { kind: "market", marketId: id, label: m?.name ?? id };
}

const REFERENCE_END = "2025-07-05";

function backDates(period: TrendPeriod, endISO: string): string[] {
  const len = PERIOD_LEN[period];
  const step = PERIOD_STEP_DAYS[period];
  const end = new Date(endISO);
  const dates: string[] = [];
  for (let i = len - 1; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(end.getDate() - i * step);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

function baseSeriesForSeriesId(
  crop: Crop,
  seriesId: CompareSeriesId,
  period: TrendPeriod,
  extraSeed = 0,
): number[] {
  const kgUnit = unitKgOf(crop.unit);
  const cropPerKg = crop.currentPrice / kgUnit;
  const dec = decodeSeriesId(seriesId);
  const factor =
    dec.kind === "all"
      ? 1
      : dec.kind === "market"
        ? marketFactor(dec.marketId!)
        : marketFactor(dec.marketId!) * companyFactor(dec.marketId!, dec.companyName!);
  const base = cropPerKg * factor;
  const len = PERIOD_LEN[period];
  const seed = hash(`${crop.id}:${seriesId}:${period}:${extraSeed}`);
  const spread = period === "1w" ? 0.05 : period === "2w" ? 0.055 : period === "1m" ? 0.06 : period === "3m" ? 0.08 : period === "1y" ? 0.1 : 0.14;
  return seriesFor(base, len, seed, spread);
}

export function getVarietyTrend(params: {
  varietyId: string;
  seriesIds: CompareSeriesId[];
  period: TrendPeriod;
}): TrendPoint[] {
  const crop = resolveCropSubject(params.varietyId).crop;
  if (!crop) return [];
  const dates = backDates(params.period, REFERENCE_END);
  const perSeries: Record<string, number[]> = {};
  for (const id of params.seriesIds) {
    perSeries[id] = baseSeriesForSeriesId(crop, id, params.period);
  }
  // Volume series (aggregate) — deterministic per crop/period.
  const volumes = seriesFor(
    crop.volumeTon * 10,
    dates.length,
    hash(`${crop.id}:vol:${params.period}`),
    0.35,
  );

  return dates.map((iso, i) => {
    const prices: Record<string, number> = {};
    for (const id of params.seriesIds) prices[id] = perSeries[id][i];
    return {
      dateISO: iso,
      label: labelForOffset(params.period, iso),
      prices,
      totalVolumeTon: Math.max(1, Math.round(volumes[i] / 10)),
    };
  });
}

/**
 * Year-over-year comparison: same period window ending on the reference date
 * for the last 5 years, keyed by 4-digit year.
 */
export function getYearComparisonTrend(params: {
  varietyId: string;
  marketId: CompareSeriesId; // one series only
  period: TrendPeriod;
}): { points: YearTrendPoint[]; years: string[] } {
  const crop = resolveCropSubject(params.varietyId).crop;
  const years = ["2022", "2023", "2024", "2025", "2026"];
  if (!crop) return { points: [], years };
  const len = PERIOD_LEN[params.period];
  const step = PERIOD_STEP_DAYS[params.period];

  // Position labels are month/day pattern common across years (based on 2025).
  const anchor = new Date(REFERENCE_END);
  const labels: string[] = [];
  for (let i = len - 1; i >= 0; i--) {
    const d = new Date(anchor);
    d.setDate(anchor.getDate() - i * step);
    labels.push(`${d.getMonth() + 1}/${d.getDate()}`);
  }

  const perYear: Record<string, number[]> = {};
  for (const y of years) {
    perYear[y] = baseSeriesForSeriesId(crop, params.marketId, params.period, hash(y));
  }
  const volumes = seriesFor(
    crop.volumeTon * 10,
    len,
    hash(`${crop.id}:yvol:${params.period}`),
    0.3,
  );

  const points: YearTrendPoint[] = labels.map((label, i) => {
    const prices: Record<string, number> = {};
    for (const y of years) prices[y] = perYear[y][i];
    return { label, prices, totalVolumeTon: Math.max(1, Math.round(volumes[i] / 10)) };
  });
  return { points, years };
}

// -----------------------------------------------------------------------------
// palettes
// -----------------------------------------------------------------------------

export const SERIES_PALETTE = [
  "#3A8A3A", // green-600 — always 전국 (first)
  "#1971C2", // blue
  "#F08C00", // orange
  "#7048E8", // purple
  "#099268", // teal
];

export const YEAR_PALETTE: Record<string, string> = {
  "2022": "#CED4DA",
  "2023": "#8CE99A",
  "2024": "#69DB7C",
  "2025": "#40C057",
  "2026": "#1F5C1F",
};
