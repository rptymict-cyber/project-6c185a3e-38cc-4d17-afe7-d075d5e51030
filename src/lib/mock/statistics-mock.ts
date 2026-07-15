// Deterministic mock data for the Statistics screen.
// Not a real API — replace producers when backend lands.

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

export const CROP_GROUPS: { id: string; label: string; crops: CropId[] }[] = [
  { id: "fruit",   label: "과실류",   crops: ["apple", "pear", "grape", "citrus"] },
  { id: "veg",     label: "채소류",   crops: ["cabbage", "lettuce", "napa"] },
  { id: "spice",   label: "양념채소", crops: ["garlic", "onion", "chili"] },
  { id: "root",    label: "근채류",   crops: ["radish", "carrot"] },
  { id: "tuber",   label: "서류",     crops: ["potato", "sweetpotato"] },
  { id: "mushroom",label: "버섯류",   crops: ["shiitake", "enoki"] },
  { id: "grain",   label: "곡류",     crops: ["rice", "barley"] },
  { id: "bean",    label: "두류",     crops: ["soybean", "redbean"] },
];

export const CROPS: Record<CropId, CropDef> = {
  apple:       { id: "apple",       name: "사과",     emoji: "🍎", group: "fruit",    base: 3280 },
  pear:        { id: "pear",        name: "배",       emoji: "🍐", group: "fruit",    base: 4180 },
  grape:       { id: "grape",       name: "포도",     emoji: "🍇", group: "fruit",    base: 5640 },
  citrus:      { id: "citrus",      name: "감귤",     emoji: "🍊", group: "fruit",    base: 6033 },
  cabbage:     { id: "cabbage",     name: "배추",     emoji: "🥬", group: "veg",      base: 1180 },
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
  { id: "서울강서", label: "서울강서" },
  { id: "부산엄궁", label: "부산엄궁" },
  { id: "대구북부", label: "대구북부" },
  { id: "광주서부", label: "광주서부" },
];

export type Period = "1주" | "1개월" | "3개월" | "1년" | "5년";
export const PERIODS: Period[] = ["1주", "1개월", "3개월", "1년", "5년"];

// ---------- Time series ----------

export type TrendPoint = { label: string; volume: number } & Record<string, number | string>;

function labelsFor(period: Period): string[] {
  switch (period) {
    case "1주":
      return ["6/30", "7/1", "7/2", "7/3", "7/4", "7/5", "7/6"];
    case "1개월": {
      const days = ["6/6","6/8","6/10","6/12","6/14","6/16","6/18","6/20","6/22","6/24","6/26","6/28","7/2","7/4","7/6"];
      return days;
    }
    case "3개월":
      return ["4월 1주","4월 2주","4월 3주","4월 4주","5월 1주","5월 2주","5월 3주","5월 4주","6월 1주","6월 2주","6월 3주","7월 1주"];
    case "1년":
      return ["25.8","25.9","25.10","25.11","25.12","26.1","26.2","26.3","26.4","26.5","26.6","26.7"];
    case "5년":
      return ["2022","2023","2024","2025","2026"];
  }
}

function marketBias(marketId: string, idx: number): number {
  // "전국" is baseline; individual markets get small deterministic offsets.
  const table: Record<string, number> = {
    전국: 0, 서울가락: 0.03, 서울강서: -0.02, 부산엄궁: 0.015, 대구북부: -0.035, 광주서부: 0.02,
  };
  return 1 + (table[marketId] ?? 0) + idx * 0.005;
}

export function buildTrend(cropId: CropId, marketIds: string[], period: Period): TrendPoint[] {
  const base = CROPS[cropId].base;
  const labels = labelsFor(period);
  const n = labels.length;
  return labels.map((label, i) => {
    const trend = (i - n / 2) / n * 0.08; // gentle drift
    const point: TrendPoint = {
      label,
      volume: Math.round((55 + Math.cos(i * 0.9) * 22 + Math.sin(i * 0.3) * 6) * 10) / 10,
    };
    marketIds.forEach((m, idx) => {
      const wave = Math.sin(i * 0.7 + idx) * 0.06;
      const price = base * marketBias(m, idx) * (1 + wave + trend);
      point[m] = Math.round(price);
    });
    return point;
  });
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
  { name: "서울가락", value: 42, vol: 31.5, amt: 21.1 },
  { name: "서울강서", value: 21, vol: 15.8, amt: 10.5 },
  { name: "부산엄궁", value: 14, vol: 10.5, amt: 7.0 },
  { name: "대구북부", value: 12, vol: 9.0, amt: 6.0 },
  { name: "광주서부", value: 11, vol: 8.2, amt: 5.5 },
];

export function getOriginShare(cropId: CropId) {
  return ORIGIN_TABLE[cropId] ?? [
    { name: "경상권", value: 42 },
    { name: "전라권", value: 28 },
    { name: "충청권", value: 18 },
    { name: "기타", value: 12 },
  ];
}

export function getMarketShare(_cropId: CropId) {
  return MARKET_SHARE_DEFAULT;
}

export const DONUT_COLORS = ["#3A8A3A", "#63B375", "#A6D8A6", "#F4A261", "#E76F51", "#4C6EF5", "#868E96"];

// ---------- Snapshot table ----------

export type CompanyRow = { name: string; avg: number; delta: number; pct: number; vol: number };
export type MarketRow  = { name: string; avg: number; delta: number; pct: number; vol: number; companies: CompanyRow[] };
export type RegionRow  = { region: string; markets: MarketRow[] };
export type Snapshot   = { date: string; overall: { avg: number; delta: number; pct: number; vol: number }; regions: RegionRow[] };

const SNAPSHOT_LAYOUT: { region: string; markets: { name: string; companies: string[]; bias: number; volShare: number }[] }[] = [
  { region: "서울",   markets: [
    { name: "서울가락", companies: ["서울청과", "농협가락", "중앙청과", "동화청과", "한국청과"], bias:  0.112, volShare: 0.223 },
    { name: "서울강서", companies: ["강서청과", "농협강서", "동부청과"], bias: -0.018, volShare: 0.153 },
  ]},
  { region: "부산",   markets: [
    { name: "부산엄궁", companies: ["엄궁청과", "부산농협", "동아청과"], bias:  0.028, volShare: 0.117 },
  ]},
  { region: "대구",   markets: [
    { name: "대구북부", companies: ["대구청과", "북부농협", "영남청과"], bias: -0.041, volShare: 0.109 },
  ]},
  { region: "광주",   markets: [
    { name: "광주서부", companies: ["광주청과", "서부농협"], bias:  0.021, volShare: 0.098 },
  ]},
  { region: "대전",   markets: [
    { name: "대전오정", companies: ["대전청과", "오정농협"], bias: -0.007, volShare: 0.086 },
  ]},
  { region: "인천",   markets: [
    { name: "인천삼산", companies: ["삼산청과", "인천농협"], bias:  0.009, volShare: 0.074 },
  ]},
];

function jitter(seed: string): number {
  let s = 0;
  for (const c of seed) s = (s * 31 + c.charCodeAt(0)) >>> 0;
  const x = Math.sin(s) * 10000;
  return (x - Math.floor(x) - 0.5) * 2; // -1..1
}

export function buildSnapshot(cropId: CropId, date: string): Snapshot {
  const base = CROPS[cropId].base;
  const totalVol = 75;
  const regions: RegionRow[] = SNAPSHOT_LAYOUT.map((rg) => {
    const markets: MarketRow[] = rg.markets.map((m) => {
      const avg = Math.round(base * (1 + m.bias + jitter(cropId + m.name + date) * 0.02));
      const prev = Math.round(avg / (1 + (m.bias * 0.5 + jitter(cropId + m.name + "p") * 0.06)));
      const delta = avg - prev;
      const pct = Math.round((delta / prev) * 1000) / 10;
      const vol = Math.round(totalVol * m.volShare * 10) / 10;
      const companies: CompanyRow[] = m.companies.map((co) => {
        const cAvg = Math.round(avg * (1 + jitter(cropId + m.name + co) * 0.03));
        const cPrev = Math.round(cAvg / (1 + jitter(cropId + m.name + co + "p") * 0.06));
        const cDelta = cAvg - cPrev;
        const cPct = Math.round((cDelta / cPrev) * 1000) / 10;
        const cVol = Math.round((vol / m.companies.length) * (0.7 + Math.abs(jitter(co + m.name)) * 0.5) * 10) / 10;
        return { name: co, avg: cAvg, delta: cDelta, pct: cPct, vol: cVol };
      });
      return { name: m.name, avg, delta, pct, vol, companies };
    });
    return { region: rg.region, markets };
  });

  // overall = volume-weighted
  const all = regions.flatMap((r) => r.markets);
  const totV = all.reduce((s, m) => s + m.vol, 0);
  const overallAvg = Math.round(all.reduce((s, m) => s + m.avg * m.vol, 0) / totV);
  const overallPrev = Math.round(all.reduce((s, m) => s + (m.avg - m.delta) * m.vol, 0) / totV);
  const overallDelta = overallAvg - overallPrev;
  const overallPct = Math.round((overallDelta / overallPrev) * 1000) / 10;

  return {
    date,
    overall: { avg: overallAvg, delta: overallDelta, pct: overallPct, vol: Math.round(totV * 10) / 10 },
    regions,
  };
}

// ---------- Series colors for chart legend ----------
export const SERIES_COLORS = ["#3A8A3A", "#1971C2", "#E76F51", "#7048E8", "#F59F00", "#12B886"];
