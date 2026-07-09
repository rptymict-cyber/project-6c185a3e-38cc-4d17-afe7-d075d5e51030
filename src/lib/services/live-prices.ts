// Live prices service — mock 단계에서도 "정렬/집계는 서버 책임" 원칙을 반영.
// 컴포넌트는 sort/limit/offset만 넘기고, 이미 정렬된 결과를 그대로 렌더한다.

export type LivePriceRow = {
  id: string;
  name: string;
  market: string; // 대표 시장(참고용)
  unit: string; // 원 단위 표준거래단위
  pricePerKg: number; // kg당 평균가 (원/kg)
  changePct: number; // 전국 평균가 기준 등락률(%)
  volumeTon: number; // 전국 거래량 합계(t)
};

export type LiveSort = "up" | "down" | "vol";

// Deterministic mock pool (실제 API 교체 대상)
const POOL: LivePriceRow[] = [
  { id: "cabbage", name: "배추", market: "서울가락", unit: "10kg망", pricePerKg: 2840, changePct: 8.2, volumeTon: 328.4 },
  { id: "radish", name: "무", market: "대구북부", unit: "20kg박스", pricePerKg: 1760, changePct: 6.1, volumeTon: 245.2 },
  { id: "greenonion", name: "대파", market: "구리시장", unit: "1kg단", pricePerKg: 1980, changePct: 4.8, volumeTon: 186.7 },
  { id: "garlic", name: "마늘", market: "의성·안동", unit: "1kg", pricePerKg: 7850, changePct: 3.0, volumeTon: 112.3 },
  { id: "onion", name: "양파", market: "부산엄궁", unit: "15kg망", pricePerKg: 1120, changePct: -4.1, volumeTon: 198.7 },
  { id: "apple", name: "사과", market: "서울가락", unit: "10kg박스", pricePerKg: 3240, changePct: 1.8, volumeTon: 512.0 },
  { id: "pear", name: "배", market: "서울가락", unit: "15kg박스", pricePerKg: 4180, changePct: -1.9, volumeTon: 312.0 },
  { id: "cucumber", name: "오이", market: "서울강서", unit: "50개", pricePerKg: 2260, changePct: 5.4, volumeTon: 142.5 },
  { id: "tomato", name: "토마토", market: "서울가락", unit: "5kg박스", pricePerKg: 3020, changePct: -3.2, volumeTon: 168.9 },
  { id: "potato", name: "감자", market: "서울가락", unit: "20kg박스", pricePerKg: 1520, changePct: 2.4, volumeTon: 274.1 },
  { id: "chili", name: "고추", market: "서울가락", unit: "10kg박스", pricePerKg: 8420, changePct: 7.6, volumeTon: 88.4 },
  { id: "spinach", name: "시금치", market: "서울강서", unit: "4kg박스", pricePerKg: 3960, changePct: -5.8, volumeTon: 62.3 },
  { id: "carrot", name: "당근", market: "부산엄궁", unit: "20kg박스", pricePerKg: 1840, changePct: -2.7, volumeTon: 132.9 },
  { id: "grape", name: "포도", market: "서울가락", unit: "5kg박스", pricePerKg: 5620, changePct: 4.1, volumeTon: 96.8 },
  { id: "peach", name: "복숭아", market: "서울가락", unit: "4.5kg박스", pricePerKg: 6480, changePct: -6.5, volumeTon: 74.2 },
  { id: "watermelon", name: "수박", market: "서울가락", unit: "1개(8kg)", pricePerKg: 1980, changePct: 3.7, volumeTon: 220.5 },
  { id: "mandarin", name: "감귤", market: "서울가락", unit: "10kg박스", pricePerKg: 3080, changePct: -0.8, volumeTon: 158.2 },
  { id: "lettuce", name: "상추", market: "서울강서", unit: "2kg박스", pricePerKg: 4720, changePct: 6.8, volumeTon: 42.1 },
  { id: "pepper", name: "피망", market: "서울강서", unit: "5kg박스", pricePerKg: 5320, changePct: -3.6, volumeTon: 38.4 },
  { id: "sweetpotato", name: "고구마", market: "서울가락", unit: "10kg박스", pricePerKg: 2680, changePct: 1.2, volumeTon: 122.6 },
];

function sortPool(sort: LiveSort): LivePriceRow[] {
  const arr = [...POOL];
  if (sort === "up") return arr.sort((a, b) => b.changePct - a.changePct);
  if (sort === "down") return arr.sort((a, b) => a.changePct - b.changePct);
  return arr.sort((a, b) => b.volumeTon - a.volumeTon);
}

/**
 * mock: 서버 정렬/집계 결과를 반환한다고 가정.
 * 실제 API 교체 시 시그니처만 유지하면 컴포넌트 수정 없이 교체 가능.
 */
export function getLivePrices({
  sort,
  limit,
  offset = 0,
}: {
  sort: LiveSort;
  limit: number;
  offset?: number;
}): { rows: LivePriceRow[]; total: number } {
  const all = sortPool(sort);
  return { rows: all.slice(offset, offset + limit), total: all.length };
}

export const LIVE_SORT_META: Record<LiveSort, { label: string; hint: string }> = {
  up: { label: "상승률순", hint: "전국 평균가 기준 등락률" },
  down: { label: "하락률순", hint: "전국 평균가 기준 등락률" },
  vol: { label: "거래량순", hint: "전국 거래량 합계" },
};
