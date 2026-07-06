export type Category =
  | "fruit"
  | "vegetable"
  | "seasoning"
  | "root"
  | "tuber"
  | "mushroom"
  | "grain"
  | "legume";

export const CATEGORIES: { id: "all" | Category; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "fruit", label: "과실류" },
  { id: "vegetable", label: "채소류" },
  { id: "seasoning", label: "양념채소" },
  { id: "root", label: "근채류" },
  { id: "tuber", label: "서류" },
  { id: "mushroom", label: "버섯류" },
  { id: "grain", label: "곡류" },
  { id: "legume", label: "두류" },
];

export type Crop = {
  id: string;
  name: string;
  emoji: string;
  category: Category;
  unit: string; // e.g. "원/kg"
  currentPrice: number;
  prevPrice: number;
  volumeTon: number;
  updatedAt: string; // "오늘 17:18"
  spark: number[]; // 7 pts
  aiReady?: boolean;
  season?: boolean; // seasonal representative
  grades?: { top: number; mid: number; low: number };
};

// deterministic seeded generator
const seed = (n: number) => {
  let s = n;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

function makeSeries(base: number, len: number, seedNum: number, vol = 0.06) {
  const r = seed(seedNum);
  const out: number[] = [];
  let v = base;
  for (let i = 0; i < len; i++) {
    v = v * (1 + (r() - 0.5) * vol);
    out.push(Math.round(v));
  }
  return out;
}

export const CROPS: Crop[] = [
  {
    id: "apple",
    name: "사과",
    emoji: "🍎",
    category: "fruit",
    unit: "원/kg",
    currentPrice: 3240,
    prevPrice: 3168,
    volumeTon: 855.7,
    updatedAt: "오늘 17:18",
    spark: makeSeries(3200, 7, 11),
    aiReady: true,
    season: true,
    grades: { top: 3820, mid: 3240, low: 2740 },
  },
  {
    id: "pear",
    name: "배",
    emoji: "🍐",
    category: "fruit",
    unit: "원/kg",
    currentPrice: 4180,
    prevPrice: 4260,
    volumeTon: 412.3,
    updatedAt: "오늘 17:18",
    spark: makeSeries(4200, 7, 22),
    season: true,
    grades: { top: 4820, mid: 4180, low: 3540 },
  },
  {
    id: "grape",
    name: "포도",
    emoji: "🍇",
    category: "fruit",
    unit: "원/kg",
    currentPrice: 6720,
    prevPrice: 6540,
    volumeTon: 128.9,
    updatedAt: "오늘 16:52",
    spark: makeSeries(6600, 7, 33),
    aiReady: true,
    season: true,
  },
  {
    id: "cabbage",
    name: "배추",
    emoji: "🥬",
    category: "vegetable",
    unit: "원/kg",
    currentPrice: 1180,
    prevPrice: 1240,
    volumeTon: 1240.5,
    updatedAt: "오늘 17:05",
    spark: makeSeries(1200, 7, 44),
    aiReady: true,
    season: true,
    grades: { top: 1380, mid: 1180, low: 940 },
  },
  {
    id: "lettuce",
    name: "상추",
    emoji: "🥗",
    category: "vegetable",
    unit: "원/kg",
    currentPrice: 5240,
    prevPrice: 4980,
    volumeTon: 76.4,
    updatedAt: "오늘 17:10",
    spark: makeSeries(5100, 7, 55),
    season: true,
  },
  {
    id: "garlic",
    name: "마늘",
    emoji: "🧄",
    category: "seasoning",
    unit: "원/kg",
    currentPrice: 8420,
    prevPrice: 8380,
    volumeTon: 182.1,
    updatedAt: "오늘 17:12",
    spark: makeSeries(8400, 7, 66),
    aiReady: true,
  },
  {
    id: "onion",
    name: "양파",
    emoji: "🧅",
    category: "seasoning",
    unit: "원/kg",
    currentPrice: 1620,
    prevPrice: 1720,
    volumeTon: 640.8,
    updatedAt: "오늘 17:00",
    spark: makeSeries(1700, 7, 77),
    aiReady: true,
    season: true,
  },
  {
    id: "chili",
    name: "청양고추",
    emoji: "🌶️",
    category: "seasoning",
    unit: "원/kg",
    currentPrice: 9840,
    prevPrice: 10240,
    volumeTon: 42.6,
    updatedAt: "오늘 17:14",
    spark: makeSeries(10000, 7, 88),
    season: true,
  },
  {
    id: "radish",
    name: "무",
    emoji: "🥕",
    category: "root",
    unit: "원/kg",
    currentPrice: 980,
    prevPrice: 940,
    volumeTon: 720.3,
    updatedAt: "오늘 17:06",
    spark: makeSeries(960, 7, 99),
    season: true,
  },
  {
    id: "carrot",
    name: "당근",
    emoji: "🥕",
    category: "root",
    unit: "원/kg",
    currentPrice: 2140,
    prevPrice: 2080,
    volumeTon: 214.7,
    updatedAt: "오늘 17:08",
    spark: makeSeries(2100, 7, 111),
  },
  {
    id: "potato",
    name: "감자",
    emoji: "🥔",
    category: "tuber",
    unit: "원/kg",
    currentPrice: 2860,
    prevPrice: 2900,
    volumeTon: 448.2,
    updatedAt: "오늘 17:03",
    spark: makeSeries(2880, 7, 122),
    season: true,
  },
  {
    id: "sweetpotato",
    name: "고구마",
    emoji: "🍠",
    category: "tuber",
    unit: "원/kg",
    currentPrice: 3980,
    prevPrice: 3860,
    volumeTon: 186.5,
    updatedAt: "오늘 17:04",
    spark: makeSeries(3900, 7, 155),
  },
  {
    id: "shiitake",
    name: "표고버섯",
    emoji: "🍄",
    category: "mushroom",
    unit: "원/kg",
    currentPrice: 12400,
    prevPrice: 12200,
    volumeTon: 34.8,
    updatedAt: "오늘 17:15",
    spark: makeSeries(12300, 7, 133),
    season: true,
  },
  {
    id: "enoki",
    name: "팽이버섯",
    emoji: "🍄",
    category: "mushroom",
    unit: "원/kg",
    currentPrice: 3240,
    prevPrice: 3300,
    volumeTon: 58.9,
    updatedAt: "오늘 17:11",
    spark: makeSeries(3260, 7, 144),
  },
  {
    id: "rice",
    name: "쌀",
    emoji: "🌾",
    category: "grain",
    unit: "원/20kg",
    currentPrice: 52400,
    prevPrice: 52800,
    volumeTon: 2860.4,
    updatedAt: "오늘 17:20",
    spark: makeSeries(52600, 7, 166),
  },
  {
    id: "barley",
    name: "보리",
    emoji: "🌾",
    category: "grain",
    unit: "원/40kg",
    currentPrice: 68400,
    prevPrice: 67200,
    volumeTon: 342.7,
    updatedAt: "오늘 17:19",
    spark: makeSeries(68000, 7, 177),
  },
  {
    id: "soybean",
    name: "콩",
    emoji: "🫘",
    category: "legume",
    unit: "원/kg",
    currentPrice: 6820,
    prevPrice: 6740,
    volumeTon: 128.4,
    updatedAt: "오늘 17:16",
    spark: makeSeries(6800, 7, 188),
  },
  {
    id: "redbean",
    name: "팥",
    emoji: "🫘",
    category: "legume",
    unit: "원/kg",
    currentPrice: 12400,
    prevPrice: 12200,
    volumeTon: 46.2,
    updatedAt: "오늘 17:17",
    spark: makeSeries(12300, 7, 199),
  },
];


export function getCrop(id: string): Crop | undefined {
  return CROPS.find((c) => c.id === id);
}

export function seriesFor(cropId: string, period: "1w" | "1m" | "1y" | "3y") {
  const c = getCrop(cropId);
  if (!c) return [];
  const len = period === "1w" ? 7 : period === "1m" ? 30 : period === "1y" ? 52 : 156;
  const seedNum = c.id.split("").reduce((s, ch) => s + ch.charCodeAt(0), 0);
  const priceSeries = makeSeries(c.currentPrice, len, seedNum, period === "1w" ? 0.05 : 0.09);
  const volSeries = makeSeries(c.volumeTon * 10, len, seedNum + 7, 0.35);
  const today = new Date();
  return priceSeries.map((price, i) => {
    const d = new Date(today);
    const step = period === "1w" || period === "1m" ? 1 : period === "1y" ? 7 : 7;
    d.setDate(today.getDate() - (len - 1 - i) * step);
    const label =
      period === "1w" || period === "1m"
        ? `${d.getMonth() + 1}/${d.getDate()}`
        : `${String(d.getFullYear()).slice(2)}.${d.getMonth() + 1}`;
    const prev = i === 0 ? price : priceSeries[i - 1];
    return {
      date: d.toISOString().slice(0, 10),
      label,
      price,
      volume: Math.max(1, Math.round(volSeries[i] / 10)),
      change: price - prev,
      changePct: prev ? ((price - prev) / prev) * 100 : 0,
      grade:
        i % 3 === 0
          ? { top: Math.round(price * 1.15), mid: price, low: Math.round(price * 0.85) }
          : undefined,
    };
  });
}
