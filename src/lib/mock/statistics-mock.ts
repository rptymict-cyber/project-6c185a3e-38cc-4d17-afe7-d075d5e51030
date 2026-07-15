// Deterministic mock data for the Statistics screen.
// Replace `buildSeries`, `buildGauges`, `getGradeAvg`, `getOriginShare`,
// `getMarketShare` with real API calls when backend lands. Frontend should
// keep consuming the same shapes.

import type { PeriodMode } from "@/store/statistics";

export type CropId =
  | "apple" | "pear" | "grape" | "citrus"
  | "cabbage" | "lettuce" | "napa"
  | "garlic" | "onion" | "chili"
  | "radish" | "carrot"
  | "potato" | "sweetpotato"
  | "shiitake" | "enoki"
  | "rice" | "barley"
  | "soybean" | "redbean";

export type CropDef = { id: CropId; name: string; emoji: string; group: string; base: number };

export const CROPS: Record<CropId, CropDef> = {
  apple:       { id: "apple",       name: "사과",     emoji: "🍎", group: "fruit",    base: 3280 },
  pear:        { id: "pear",        name: "배",       emoji: "🍐", group: "fruit",    base: 4180 },
  grape:       { id: "grape",       name: "포도",     emoji: "🍇", group: "fruit",    base: 5640 },
  citrus:      { id: "citrus",      name: "감귤",     emoji: "🍊", group: "fruit",    base: 6033 },
  cabbage:     { id: "cabbage",     name: "배추",     emoji: "🥬", group: "veg",      base: 720 },
  lettuce:     { id: "lettuce",     name: "상추",     emoji: "🥗", group: "veg",      base: 3600 },
  napa:        { id: "napa",        name: "얼갈이배추",emoji: "🥬", group: "veg",      base: 2100 },
  garlic:      { id: "garlic",      name: "마늘",     emoji: "🧄", group: "spice",    base: 7200 },
  onion:       { id: "onion",       name: "양파",     emoji: "🧅", group: "spice",    base: 1240 },
  chili:       { id: "chili",       name: "청양고추", emoji: "🌶️", group: "spice",    base: 8800 },
  radish:      { id: "radish",      name: "무",       emoji: "🥕", group: "root",     base: 1760 },
  carrot:      { id: "carrot",      name: "당근",     emoji: "🥕", group: "root",     base: 2450 },
  potato:      { id: "potato",      name: "감자",     emoji: "🥔", group: "tuber",    base: 2100 },
  sweetpotato: { id: "sweetpotato", name: "고구마",   emoji: "🍠", group: "tuber",    base: 3300 },
  shiitake:    { id: "shiitake",    name: "표고버섯", emoji: "🍄", group: "mushroom", base: 12800 },
  enoki:       { id: "enoki",       name: "팽이버섯", emoji: "🍄", group: "mushroom", base: 3200 },
  rice:        { id: "rice",        name: "쌀",       emoji: "🌾", group: "grain",    base: 2900 },
  barley:      { id: "barley",      name: "보리",     emoji: "🌾", group: "grain",    base: 1900 },
  soybean:     { id: "soybean",     name: "콩",       emoji: "🫘", group: "bean",     base: 5800 },
  redbean:     { id: "redbean",     name: "팥",       emoji: "🫘", group: "bean",     base: 7900 },
};

export const MARKET_OPTIONS = [
  { id: "전국",     label: "전국" },
  { id: "서울가락", label: "서울가락" },
  { id: "대구북부", label: "대구북부" },
  { id: "광주서부", label: "광주서부" },
  { id: "구리",     label: "구리" },
  { id: "부산엄궁", label: "부산엄궁" },
];

// ---------- Time series ----------

export type TrendPoint = { label: string; volume: number } & Record<string, number | string>;

function seed(str: string): number {
  let s = 0;
  for (const c of str) s = (s * 31 + c.charCodeAt(0)) >>> 0;
  return s;
}
function rand(str: string): number {
  const x = Math.sin(seed(str)) * 10000;
  return x - Math.floor(x); // 0..1
}

function labelsFor(mode: PeriodMode): string[] {
  if (mode === "day") {
    // 최근 12영업일 (mock: 7/1 ~ 7/15 중 12일)
    return ["7/1", "7/2", "7/3", "7/4", "7/7", "7/8", "7/9", "7/10", "7/11", "7/14", "7/15", "7/16"];
  }
  if (mode === "month") {
    return ["25.8","25.9","25.10","25.11","25.12","26.1","26.2","26.3","26.4","26.5","26.6","26.7"];
  }
  return ["2022","2023","2024","2025","2026"];
}

function marketBias(marketId: string): number {
  const table: Record<string, number> = {
    전국: 0, 서울가락: 0.04, 대구북부: -0.03, 광주서부: 0.02, 구리: 0.01, 부산엄궁: 0.015,
  };
  return 1 + (table[marketId] ?? 0);
}

export function buildSeries(cropId: CropId, marketIds: string[], mode: PeriodMode): TrendPoint[] {
  const base = CROPS[cropId].base;
  const labels = labelsFor(mode);
  const n = labels.length;
  return labels.map((label, i) => {
    const trend = ((i - n / 2) / n) * 0.10;
    const noise = (rand(cropId + mode + label) - 0.5) * 0.08;
    const point: TrendPoint = {
      label,
      volume: Math.round((55 + Math.cos(i * 0.9) * 20 + (rand(mode + label) - 0.5) * 14) * 10) / 10,
    };
    marketIds.forEach((m) => {
      const wave = Math.sin(i * 0.7 + seed(m) % 7) * 0.04;
      const price = base * marketBias(m) * (1 + wave + trend + noise * 0.4);
      point[m] = Math.round(price);
    });
    return point;
  });
}

// ---------- KPIs (period-driven comparisons) ----------

export type GaugeDatum = { base: number; delta: number; pct: number } | null;
export type Gauges = {
  prevXun: GaugeDatum;
  prevYear: GaugeDatum;
  normalYear: GaugeDatum;
};
export type Kpi = { label: string; base: number | null; delta: number | null; pct: number | null };

const KPI_LABELS: Record<PeriodMode, [string, string, string]> = {
  day:   ["전일 대비", "전주 동일 대비", "전년 동일 대비"],
  month: ["전월 대비", "전년 동월 대비", "평년 동월 대비"],
  year:  ["전년 대비", "전전년 대비",     "평년 대비"],
};

function makeKpi(current: number, basis: number | null, label: string): Kpi {
  if (basis == null || basis <= 0) return { label, base: null, delta: null, pct: null };
  const delta = current - basis;
  const pct = Math.round((delta / basis) * 1000) / 10;
  return { label, base: basis, delta, pct };
}

export function buildKpis(cropId: CropId, mode: PeriodMode): Kpi[] {
  const base = CROPS[cropId].base;
  const current = Math.round(base * (1 + (rand(cropId + mode + "cur") - 0.5) * 0.05));
  const seeds = ["k1", "k2", "k3"] as const;
  const labels = KPI_LABELS[mode];
  return seeds.map((s, i) => {
    const drift = (rand(cropId + mode + s) - 0.5) * (mode === "year" ? 0.35 : mode === "month" ? 0.25 : 0.12);
    const basis = Math.round(current * (1 + drift));
    return makeKpi(current, basis, labels[i]);
  });
}

// Kept for backward-compat with any legacy imports; delegates to buildKpis.
export function buildGauges(cropId: CropId): Gauges {
  const [a, b, c] = buildKpis(cropId, "day");
  const toDatum = (k: Kpi): GaugeDatum =>
    k.base == null || k.delta == null || k.pct == null ? null : { base: k.base, delta: k.delta, pct: k.pct };
  return { prevXun: toDatum(a), prevYear: toDatum(b), normalYear: toDatum(c) };
}

// ---------- Origin & market share (donut) ----------

const ORIGIN_TABLE: Record<string, { name: string; value: number }[]> = {
  apple:   [{ name: "경북", value: 62 }, { name: "충북", value: 14 }, { name: "전북", value: 10 }, { name: "강원", value: 8 }, { name: "기타", value: 6 }],
  pear:    [{ name: "전남", value: 34 }, { name: "충남", value: 22 }, { name: "경기", value: 18 }, { name: "울산", value: 14 }, { name: "기타", value: 12 }],
  grape:   [{ name: "경북", value: 45 }, { name: "충북", value: 20 }, { name: "충남", value: 12 }, { name: "경기", value: 12 }, { name: "기타", value: 11 }],
  citrus:  [{ name: "제주", value: 88 }, { name: "전남", value: 8 }, { name: "기타", value: 4 }],
  cabbage: [{ name: "강원", value: 42 }, { name: "전남", value: 22 }, { name: "충북", value: 14 }, { name: "경북", value: 12 }, { name: "기타", value: 10 }],
  garlic:  [{ name: "경남", value: 30 }, { name: "전남", value: 25 }, { name: "충남", value: 18 }, { name: "경북", value: 14 }, { name: "기타", value: 13 }],
  onion:   [{ name: "전남", value: 40 }, { name: "경남", value: 22 }, { name: "경북", value: 18 }, { name: "충남", value: 10 }, { name: "기타", value: 10 }],
  radish:  [{ name: "강원", value: 38 }, { name: "제주", value: 24 }, { name: "전남", value: 18 }, { name: "경기", value: 10 }, { name: "기타", value: 10 }],
};

const MARKET_SHARE_DEFAULT = [
  { name: "서울가락", value: 42 },
  { name: "대구북부", value: 18 },
  { name: "광주서부", value: 14 },
  { name: "구리",     value: 12 },
  { name: "부산엄궁", value: 9 },
  { name: "기타",     value: 5 },
];

export function getOriginShare(cropId: CropId) {
  return ORIGIN_TABLE[cropId] ?? [
    { name: "경상권", value: 42 },
    { name: "전라권", value: 28 },
    { name: "충청권", value: 18 },
    { name: "기타",   value: 12 },
  ];
}

export function getMarketShare(_cropId: CropId) {
  return MARKET_SHARE_DEFAULT;
}

// ---------- Grade average ----------

export type GradeRow = { grade: string; price: number; share: number };
const GRADE_MULTS: { grade: string; mult: number; share: number }[] = [
  { grade: "특",   mult: 1.20, share: 22 },
  { grade: "상",   mult: 1.05, share: 38 },
  { grade: "보통", mult: 0.92, share: 28 },
  { grade: "등외", mult: 0.72, share: 8 },
  { grade: "기타", mult: 0.85, share: 4 },
];

export function getGradeAvg(cropId: CropId): GradeRow[] {
  const base = CROPS[cropId].base;
  return GRADE_MULTS.map((g) => ({
    grade: g.grade,
    price: Math.round(base * g.mult),
    share: g.share,
  }));
}

export const DONUT_COLORS = ["#3A8A3A", "#63B375", "#A6D8A6", "#F4A261", "#E76F51", "#4C6EF5", "#868E96"];

// ---------- Series colors for chart legend ----------
export const SERIES_COLORS = ["#3A8A3A", "#1971C2", "#E76F51", "#7048E8", "#F59F00", "#12B886"];
