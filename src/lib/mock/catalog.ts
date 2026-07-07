/**
 * 부류/품목/품종 카탈로그 - 앱 전체의 단일 소스(SSOT).
 *
 * 다른 mock 파일(items.ts, crops.ts, taxonomy.ts 등)에도 유사한 데이터가 있으나,
 * 앞으로 신규 UI 및 마이그레이션 대상 화면은 반드시 이 파일과
 * `src/lib/catalog-service.ts`를 통해서만 데이터를 조회해야 한다.
 *
 * 컴포넌트에서 CATEGORIES / ITEMS 배열을 직접 import 해서 filter/find 하지 말고,
 * 반드시 catalog-service의 함수를 사용할 것.
 */

export interface Variety {
  id: string;
  name: string;
}

export type PredictionStatus = "active" | "preparing" | "none";

export interface Prediction {
  supported: boolean;
  status: PredictionStatus;
}

export interface Item {
  id: string;
  name: string;
  emoji: string;
  categoryId: string;
  varieties: Variety[];
  prediction: Prediction;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
}

export const CATEGORIES: Category[] = [
  { id: "fruit", name: "과실류", emoji: "🍎" },
  { id: "vegetable", name: "채소류", emoji: "🥬" },
  { id: "seasoning", name: "양념채소", emoji: "🧄" },
  { id: "root", name: "근채류", emoji: "🥕" },
  { id: "tuber", name: "서류", emoji: "🥔" },
  { id: "mushroom", name: "버섯류", emoji: "🍄" },
  { id: "grain", name: "곡류", emoji: "🌾" },
  { id: "legume", name: "두류", emoji: "🫘" },
];

const ACTIVE_IDS = new Set(["apple", "pear", "cabbage", "radish", "onion"]);
const PREPARING_IDS = new Set([
  "strawberry",
  "grape",
  "mandarin",
  "tomato",
  "chili",
  "garlic",
  "pumpkin",
  "cucumber",
  "paprika",
]);

function predictionFor(itemId: string): Prediction {
  if (ACTIVE_IDS.has(itemId)) return { supported: true, status: "active" };
  if (PREPARING_IDS.has(itemId)) return { supported: false, status: "preparing" };
  return { supported: false, status: "none" };
}

type RawItem = Omit<Item, "prediction">;

const RAW_ITEMS: RawItem[] = [
  // 과실류
  {
    id: "apple",
    name: "사과",
    emoji: "🍎",
    categoryId: "fruit",
    varieties: [
      { id: "busa", name: "부사" },
      { id: "hongro", name: "홍로" },
      { id: "tsugaru", name: "쓰가루" },
    ],
  },
  {
    id: "pear",
    name: "배",
    emoji: "🍐",
    categoryId: "fruit",
    varieties: [
      { id: "singo", name: "신고" },
      { id: "wonhwang", name: "원황" },
    ],
  },
  {
    id: "grape",
    name: "포도",
    emoji: "🍇",
    categoryId: "fruit",
    varieties: [
      { id: "shine", name: "샤인머스캣" },
      { id: "campbell", name: "캠벨얼리" },
      { id: "geobong", name: "거봉" },
    ],
  },
  {
    id: "peach",
    name: "복숭아",
    emoji: "🍑",
    categoryId: "fruit",
    varieties: [
      { id: "cheonhong", name: "천홍" },
      { id: "yumyeong", name: "유명" },
      { id: "cheondohong", name: "천도복숭아" },
    ],
  },
  {
    id: "watermelon",
    name: "수박",
    emoji: "🍉",
    categoryId: "fruit",
    varieties: [{ id: "watermelon", name: "일반수박" }],
  },
  {
    id: "mandarin",
    name: "감귤",
    emoji: "🍊",
    categoryId: "fruit",
    varieties: [{ id: "mandarin", name: "노지감귤" }],
  },
  {
    id: "strawberry",
    name: "딸기",
    emoji: "🍓",
    categoryId: "fruit",
    varieties: [
      { id: "seolhyang", name: "설향" },
      { id: "kingsberry", name: "킹스베리" },
    ],
  },
  // 채소류
  {
    id: "cabbage",
    name: "배추",
    emoji: "🥬",
    categoryId: "vegetable",
    varieties: [
      { id: "spring", name: "봄배추" },
      { id: "highland", name: "고랭지" },
      { id: "winter", name: "월동" },
      { id: "fall", name: "가을배추" },
    ],
  },
  {
    id: "lettuce",
    name: "상추",
    emoji: "🥗",
    categoryId: "vegetable",
    varieties: [
      { id: "green", name: "청상추" },
      { id: "red", name: "적상추" },
    ],
  },
  {
    id: "cucumber",
    name: "오이",
    emoji: "🥒",
    categoryId: "vegetable",
    varieties: [
      { id: "baekdadagi", name: "백다다기" },
      { id: "chwichung", name: "취청" },
      { id: "gasi", name: "가시" },
    ],
  },
  {
    id: "tomato",
    name: "토마토",
    emoji: "🍅",
    categoryId: "vegetable",
    varieties: [
      { id: "general", name: "일반토마토" },
      { id: "cherry", name: "방울토마토" },
    ],
  },
  {
    id: "paprika",
    name: "파프리카",
    emoji: "🫑",
    categoryId: "vegetable",
    varieties: [
      { id: "red", name: "적색" },
      { id: "yellow", name: "황색" },
    ],
  },
  {
    id: "pumpkin",
    name: "호박",
    emoji: "🎃",
    categoryId: "vegetable",
    varieties: [
      { id: "aehobak", name: "애호박" },
      { id: "danhobak", name: "단호박" },
    ],
  },
  // 양념채소
  {
    id: "garlic",
    name: "마늘",
    emoji: "🧄",
    categoryId: "seasoning",
    varieties: [
      { id: "nanji", name: "난지형" },
      { id: "hanji", name: "한지형" },
      { id: "kkan", name: "깐마늘" },
    ],
  },
  {
    id: "onion",
    name: "양파",
    emoji: "🧅",
    categoryId: "seasoning",
    varieties: [
      { id: "early", name: "조생종" },
      { id: "mid", name: "중만생종" },
    ],
  },
  {
    id: "chili",
    name: "고추",
    emoji: "🌶️",
    categoryId: "seasoning",
    varieties: [
      { id: "cheongyang", name: "청양" },
      { id: "hong", name: "홍고추" },
    ],
  },
  // 근채류
  {
    id: "radish",
    name: "무",
    emoji: "🥕",
    categoryId: "root",
    varieties: [
      { id: "spring", name: "봄무" },
      { id: "fall", name: "가을무" },
      { id: "winter", name: "월동무" },
    ],
  },
  {
    id: "carrot",
    name: "당근",
    emoji: "🥕",
    categoryId: "root",
    varieties: [
      { id: "spring", name: "봄당근" },
      { id: "fall", name: "가을당근" },
    ],
  },
  // 서류
  {
    id: "potato",
    name: "감자",
    emoji: "🥔",
    categoryId: "tuber",
    varieties: [
      { id: "sumi", name: "수미" },
      { id: "daeji", name: "대지" },
    ],
  },
  {
    id: "sweetpotato",
    name: "고구마",
    emoji: "🍠",
    categoryId: "tuber",
    varieties: [
      { id: "hobak", name: "호박고구마" },
      { id: "bam", name: "밤고구마" },
    ],
  },
  // 버섯류
  {
    id: "shiitake",
    name: "표고버섯",
    emoji: "🍄",
    categoryId: "mushroom",
    varieties: [
      { id: "fresh", name: "생표고" },
      { id: "dry", name: "건표고" },
    ],
  },
  {
    id: "enoki",
    name: "팽이버섯",
    emoji: "🍄",
    categoryId: "mushroom",
    varieties: [
      { id: "general", name: "일반" },
      { id: "premium", name: "특품" },
    ],
  },
  // 곡류
  {
    id: "rice",
    name: "쌀",
    emoji: "🌾",
    categoryId: "grain",
    varieties: [
      { id: "general", name: "일반계" },
      { id: "chal", name: "찰벼" },
    ],
  },
  {
    id: "barley",
    name: "보리",
    emoji: "🌾",
    categoryId: "grain",
    varieties: [
      { id: "gyeot", name: "겉보리" },
      { id: "ssal", name: "쌀보리" },
    ],
  },
  // 두류
  {
    id: "soybean",
    name: "콩",
    emoji: "🫘",
    categoryId: "legume",
    varieties: [
      { id: "baektae", name: "백태" },
      { id: "seoritae", name: "서리태" },
    ],
  },
  {
    id: "redbean",
    name: "팥",
    emoji: "🫘",
    categoryId: "legume",
    varieties: [{ id: "general", name: "일반팥" }],
  },
];

export const ITEMS: Item[] = RAW_ITEMS.map((it) => ({
  ...it,
  prediction: predictionFor(it.id),
}));
