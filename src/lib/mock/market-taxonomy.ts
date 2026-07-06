// Category (부류) → Item (품목) → Variety (품종) drilldown used by
// the /market filter's 품목 bottom sheet. Purely for UI scaffolding.

export type Variety = { id: string; label: string };
export type Item = { id: string; label: string; varieties: Variety[] };
export type Category = { id: string; label: string; items: Item[] };

export const CATEGORIES: Category[] = [
  {
    id: "fruit",
    label: "과실류",
    items: [
      { id: "apple", label: "사과", varieties: [
        { id: "busa", label: "부사" },
        { id: "hongro", label: "홍로" },
      ] },
      { id: "pear", label: "배", varieties: [
        { id: "singo", label: "신고" },
      ] },
      { id: "grape", label: "포도", varieties: [
        { id: "shine", label: "샤인머스캣" },
        { id: "campbell", label: "캠벨얼리" },
      ] },
    ],
  },
  {
    id: "fruit-veg",
    label: "과채류",
    items: [
      { id: "eggplant", label: "가지", varieties: [
        { id: "eggplant-normal", label: "가지(일반)" },
        { id: "eggplant-long", label: "가지(장가지)" },
      ] },
      { id: "cucumber", label: "오이", varieties: [
        { id: "baekdadagi", label: "백다다기" },
        { id: "chwichung", label: "취청" },
      ] },
      { id: "tomato", label: "토마토", varieties: [
        { id: "tomato-normal", label: "일반토마토" },
        { id: "tomato-cherry", label: "방울토마토" },
      ] },
      { id: "watermelon", label: "수박", varieties: [
        { id: "watermelon", label: "일반수박" },
      ] },
    ],
  },
  {
    id: "vegetable",
    label: "채소류",
    items: [
      { id: "cabbage", label: "배추", varieties: [
        { id: "fall", label: "가을배추" },
        { id: "highland", label: "고랭지배추" },
      ] },
      { id: "lettuce", label: "상추", varieties: [
        { id: "green", label: "청상추" },
        { id: "red", label: "적상추" },
      ] },
    ],
  },
  {
    id: "seasoning",
    label: "양념채소",
    items: [
      { id: "garlic", label: "마늘", varieties: [
        { id: "nanji", label: "난지형" },
        { id: "hanji", label: "한지형" },
      ] },
      { id: "onion", label: "양파", varieties: [
        { id: "early", label: "조생종" },
        { id: "mid", label: "중만생종" },
      ] },
      { id: "chili", label: "고추", varieties: [
        { id: "cheongyang", label: "청양" },
        { id: "hong", label: "홍고추" },
      ] },
    ],
  },
  {
    id: "root",
    label: "근채류",
    items: [
      { id: "radish", label: "무", varieties: [
        { id: "spring", label: "봄무" },
        { id: "fall", label: "가을무" },
      ] },
      { id: "carrot", label: "당근", varieties: [
        { id: "carrot", label: "가을당근" },
      ] },
    ],
  },
];

export const UNITS = ["kg 기준", "1kg", "5kg", "8kg 기준", "10kg", "15kg", "20kg"];
