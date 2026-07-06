export type MarketAxis = "crop" | "market" | "origin" | "grade" | "auction";
export type MarketDetailTab = "chart" | "auction" | "compare" | "origin" | "grade";

export type TopCrop = {
  id: string;
  name: string;
  emoji: string;
  market: string;
  grade: string;
  spec: string;
  pricePerKg: number;
  changePct: number;
  volumeTon: number;
};

export const TOP_CROPS: TopCrop[] = [
  {
    id: "cabbage",
    name: "배추",
    emoji: "🥬",
    market: "서울 가락시장",
    grade: "특",
    spec: "10kg망",
    pricePerKg: 2840,
    changePct: 8.2,
    volumeTon: 328.4,
  },
  {
    id: "radish",
    name: "무",
    emoji: "🥕",
    market: "대구 북부시장",
    grade: "상",
    spec: "20kg박스",
    pricePerKg: 1760,
    changePct: 6.1,
    volumeTon: 245.2,
  },
  {
    id: "greenonion",
    name: "대파",
    emoji: "🌿",
    market: "구리시장",
    grade: "상",
    spec: "1kg단",
    pricePerKg: 1980,
    changePct: 4.8,
    volumeTon: 186.7,
  },
  {
    id: "garlic",
    name: "마늘",
    emoji: "🧄",
    market: "의성·안동",
    grade: "상",
    spec: "1kg",
    pricePerKg: 7850,
    changePct: 3.0,
    volumeTon: 112.3,
  },
  {
    id: "onion",
    name: "양파",
    emoji: "🧅",
    market: "부산 엄궁시장",
    grade: "상",
    spec: "15kg망",
    pricePerKg: 1120,
    changePct: -4.1,
    volumeTon: 198.7,
  },
];

export const MOVERS = [
  { id: "cabbage", name: "배추", emoji: "🥬", changePct: 8.2 },
  { id: "radish", name: "무", emoji: "🥕", changePct: 6.1 },
  { id: "onion", name: "양파", emoji: "🧅", changePct: -4.1 },
  { id: "greenonion", name: "대파", emoji: "🌿", changePct: 3.6 },
];

export const QUICK_MARKETS = [
  { id: "garak", name: "가락시장", emoji: "🏛️" },
  { id: "gangseo", name: "강서시장", emoji: "🏢" },
  { id: "daegu", name: "대구북부", emoji: "🏬" },
  { id: "busan", name: "부산엄궁", emoji: "🏯" },
  { id: "guri", name: "구리시장", emoji: "🏛️" },
];

export const RECENT_AUCTIONS = [
  { time: "14:28", crop: "배추", market: "서울가락", grade: "특", spec: "10kg망", pricePerKg: 2860 },
  { time: "14:19", crop: "배추", market: "서울가락", grade: "특", spec: "10kg망", pricePerKg: 2820 },
  { time: "14:10", crop: "배추", market: "서울가락", grade: "특", spec: "10kg망", pricePerKg: 2800 },
];
