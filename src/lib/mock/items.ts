// Items (품목) + Varieties (품종) seed for the redesigned /market page.
// This is intentionally decoupled from src/lib/mock/crops.ts so that
// varieties can be modeled without touching the existing detail page data.

export type ItemCategory =
  | "fruit"
  | "vegetable"
  | "seasoning"
  | "root"
  | "tuber"
  | "mushroom";

export const ITEM_CATEGORIES: { id: "all" | ItemCategory; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "fruit", label: "과실류" },
  { id: "vegetable", label: "채소류" },
  { id: "seasoning", label: "양념채소" },
  { id: "root", label: "근채류" },
  { id: "tuber", label: "서류" },
  { id: "mushroom", label: "버섯류" },
];

export type Variety = {
  id: string;
  name: string;
  pricePerKg: number;
  changePct: number;
  volumeTon: number;
  volumePctChange: number; // vs 전일
  spark: number[]; // 7d closing prices
};

export type Item = {
  id: string; // route param, also used as detail cropId fallback
  cropId: string; // routed to /market/$crop
  name: string;
  emoji: string;
  category: ItemCategory;
  varieties: Variety[];
};

// Deterministic seeded RNG
function seeded(n: number) {
  let s = n;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function makeSpark(base: number, seed: number, drift = 0, vol = 0.05): number[] {
  const r = seeded(seed);
  const out: number[] = [];
  let v = base * (1 - drift / 2);
  for (let i = 0; i < 7; i++) {
    v = v * (1 + (r() - 0.5) * vol) * (1 + drift / 14);
    out.push(Math.round(v));
  }
  return out;
}

type VSeed = {
  id: string;
  name: string;
  price: number;
  changePct: number;
  volumeTon: number;
  volumeChange?: number;
  drift?: number; // spark drift for trend
  seed: number;
};

function buildVarieties(seeds: VSeed[]): Variety[] {
  return seeds.map((v) => ({
    id: v.id,
    name: v.name,
    pricePerKg: v.price,
    changePct: v.changePct,
    volumeTon: v.volumeTon,
    volumePctChange: v.volumeChange ?? 0,
    spark: makeSpark(v.price, v.seed, v.drift ?? v.changePct / 100),
  }));
}

export const ITEMS: Item[] = [
  {
    id: "apple",
    cropId: "apple",
    name: "사과",
    emoji: "🍎",
    category: "fruit",
    varieties: buildVarieties([
      { id: "busa", name: "부사", price: 3240, changePct: 1.8, volumeTon: 512, seed: 101 },
      { id: "hongro", name: "홍로", price: 3480, changePct: 6.4, volumeTon: 218, drift: 0.08, seed: 102 },
      { id: "tsugaru", name: "쓰가루", price: 2980, changePct: -1.2, volumeTon: 126, seed: 103 },
    ]),
  },
  {
    id: "pear",
    cropId: "pear",
    name: "배",
    emoji: "🍐",
    category: "fruit",
    varieties: buildVarieties([
      { id: "singo", name: "신고", price: 4180, changePct: -1.9, volumeTon: 312, seed: 111 },
      { id: "wonhwang", name: "원황", price: 4620, changePct: 2.1, volumeTon: 96, seed: 112 },
    ]),
  },
  {
    id: "grape",
    cropId: "grape",
    name: "포도",
    emoji: "🍇",
    category: "fruit",
    varieties: buildVarieties([
      { id: "shine", name: "샤인머스캣", price: 8920, changePct: 5.6, volumeTon: 84, drift: 0.06, seed: 121 },
      { id: "campbell", name: "캠벨얼리", price: 5240, changePct: 2.0, volumeTon: 42, seed: 122 },
      { id: "geobong", name: "거봉", price: 6780, changePct: -0.6, volumeTon: 22, seed: 123 },
    ]),
  },
  {
    id: "peach",
    cropId: "peach",
    name: "복숭아",
    emoji: "🍑",
    category: "fruit",
    varieties: buildVarieties([
      { id: "cheonhong", name: "천홍", price: 6420, changePct: 3.4, volumeTon: 148, seed: 131 },
      { id: "yumyeong", name: "유명", price: 5820, changePct: -2.1, volumeTon: 92, seed: 132 },
      { id: "cheondohong", name: "천도복숭아", price: 7240, changePct: 1.6, volumeTon: 68, seed: 133 },
    ]),
  },
  {
    id: "watermelon",
    cropId: "watermelon",
    name: "수박",
    emoji: "🍉",
    category: "fruit",
    varieties: buildVarieties([
      { id: "watermelon", name: "일반수박", price: 1840, changePct: -3.6, volumeTon: 486, volumeChange: 62, seed: 141 },
    ]),
  },
  {
    id: "mandarin",
    cropId: "mandarin",
    name: "감귤",
    emoji: "🍊",
    category: "fruit",
    varieties: buildVarieties([
      { id: "mandarin", name: "노지감귤", price: 3480, changePct: 0.4, volumeTon: 218, seed: 151 },
    ]),
  },
  {
    id: "cabbage",
    cropId: "cabbage",
    name: "배추",
    emoji: "🥬",
    category: "vegetable",
    varieties: buildVarieties([
      { id: "cabbage", name: "가을배추", price: 1180, changePct: -5.8, volumeTon: 1240, drift: -0.07, seed: 161 },
    ]),
  },
  {
    id: "lettuce",
    cropId: "lettuce",
    name: "상추",
    emoji: "🥗",
    category: "vegetable",
    varieties: buildVarieties([
      { id: "green", name: "청상추", price: 5240, changePct: 5.2, volumeTon: 48, drift: 0.06, seed: 171 },
      { id: "red", name: "적상추", price: 5580, changePct: 3.4, volumeTon: 28, seed: 172 },
    ]),
  },
  {
    id: "cucumber",
    cropId: "cucumber",
    name: "오이",
    emoji: "🥒",
    category: "vegetable",
    varieties: buildVarieties([
      { id: "baekdadagi", name: "백다다기", price: 2380, changePct: 8.4, volumeTon: 186, drift: 0.09, volumeChange: 55, seed: 181 },
      { id: "chwichung", name: "취청", price: 2640, changePct: 4.2, volumeTon: 92, seed: 182 },
      { id: "gasi", name: "가시", price: 2980, changePct: 1.2, volumeTon: 34, seed: 183 },
    ]),
  },
  {
    id: "garlic",
    cropId: "garlic",
    name: "마늘",
    emoji: "🧄",
    category: "seasoning",
    varieties: buildVarieties([
      { id: "nanji", name: "난지형", price: 8420, changePct: 0.5, volumeTon: 128, seed: 201 },
      { id: "hanji", name: "한지형", price: 9240, changePct: 1.8, volumeTon: 42, seed: 202 },
      { id: "kkan", name: "깐마늘", price: 11800, changePct: -0.4, volumeTon: 24, seed: 203 },
    ]),
  },
  {
    id: "onion",
    cropId: "onion",
    name: "양파",
    emoji: "🧅",
    category: "seasoning",
    varieties: buildVarieties([
      { id: "early", name: "조생종", price: 1420, changePct: -6.2, volumeTon: 268, drift: -0.08, seed: 211 },
      { id: "mid", name: "중만생종", price: 1720, changePct: -3.8, volumeTon: 396, seed: 212 },
    ]),
  },
  {
    id: "chili",
    cropId: "chili",
    name: "고추",
    emoji: "🌶️",
    category: "seasoning",
    varieties: buildVarieties([
      { id: "cheongyang", name: "청양", price: 9840, changePct: 12.4, volumeTon: 42, drift: 0.12, seed: 221 },
      { id: "hong", name: "홍고추", price: 11240, changePct: 6.8, volumeTon: 28, drift: 0.07, seed: 222 },
    ]),
  },
  {
    id: "radish",
    cropId: "radish",
    name: "무",
    emoji: "🥕",
    category: "root",
    varieties: buildVarieties([
      { id: "spring", name: "봄무", price: 1120, changePct: 4.2, volumeTon: 186, seed: 231 },
      { id: "fall", name: "가을무", price: 980, changePct: 4.4, volumeTon: 428, seed: 232 },
      { id: "winter", name: "월동무", price: 1040, changePct: 2.1, volumeTon: 106, seed: 233 },
    ]),
  },
  {
    id: "carrot",
    cropId: "carrot",
    name: "당근",
    emoji: "🥕",
    category: "root",
    varieties: buildVarieties([
      { id: "carrot", name: "가을당근", price: 2140, changePct: 2.9, volumeTon: 214, seed: 241 },
    ]),
  },
  {
    id: "potato",
    cropId: "potato",
    name: "감자",
    emoji: "🥔",
    category: "tuber",
    varieties: buildVarieties([
      { id: "sumi", name: "수미", price: 2860, changePct: -1.4, volumeTon: 328, seed: 251 },
      { id: "daeji", name: "대지", price: 3140, changePct: 0.8, volumeTon: 120, seed: 252 },
    ]),
  },
  {
    id: "sweetpotato",
    cropId: "sweetpotato",
    name: "고구마",
    emoji: "🍠",
    category: "tuber",
    varieties: buildVarieties([
      { id: "hobak", name: "호박고구마", price: 4180, changePct: 3.1, volumeTon: 124, seed: 261 },
      { id: "bam", name: "밤고구마", price: 3820, changePct: 1.4, volumeTon: 62, seed: 262 },
    ]),
  },
  {
    id: "shiitake",
    cropId: "shiitake",
    name: "표고버섯",
    emoji: "🍄",
    category: "mushroom",
    varieties: buildVarieties([
      { id: "fresh", name: "생표고", price: 12400, changePct: 1.6, volumeTon: 28, seed: 271 },
      { id: "dry", name: "건표고", price: 42000, changePct: 0.4, volumeTon: 6, seed: 272 },
    ]),
  },
];

export function getItem(id: string): Item | undefined {
  return ITEMS.find((i) => i.id === id);
}

/** Representative variety = highest volume in the item. */
export function topVariety(item: Item): Variety {
  return item.varieties.reduce((a, b) => (a.volumeTon >= b.volumeTon ? a : b));
}

/** Weighted avg kg price across varieties. */
export function itemAvgKg(item: Item): number {
  const totalVol = item.varieties.reduce((s, v) => s + v.volumeTon, 0);
  if (totalVol === 0) return 0;
  const w = item.varieties.reduce((s, v) => s + v.pricePerKg * v.volumeTon, 0);
  return Math.round(w / totalVol);
}

export function itemTotalVolume(item: Item): number {
  return item.varieties.reduce((s, v) => s + v.volumeTon, 0);
}

export function varietyInsight(v: Variety): string {
  const s = v.spark;
  if (s.length >= 3) {
    const last3 = s.slice(-3);
    const up3 = last3[2] > last3[1] && last3[1] > last3[0];
    const down3 = last3[2] < last3[1] && last3[1] < last3[0];
    if (up3) return "3일 연속 상승 중 📈";
    if (down3) return "3일 연속 하락 중 📉";
  }
  const min = Math.min(...s);
  if (v.pricePerKg <= min * 1.03) return "이번 주 최저가 근접";
  if (v.volumePctChange >= 50) return "거래량 급증";
  return `오늘 ${Math.round(v.volumeTon)}톤 거래`;
}
