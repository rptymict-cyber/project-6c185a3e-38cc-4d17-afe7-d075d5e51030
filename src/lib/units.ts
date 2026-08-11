/**
 * 단위(kg / 상자 / 10kg …) SSOT.
 *
 * 앱의 모든 화면은 "kg"을 기준 단위로 삼고, 화면별로 별도 환산식을 만들지 말고
 * 이 파일의 상수/함수만 사용한다.
 *
 *  - 가격: 기준 kg 단가(`price-base.ts`) × 거래단위 kg  (toUnitPrice)
 *  - 수량: 사용자가 단위를 바꾸면 기본값으로 리셋하지 않고 kg 기준으로 환산
 */

import { unitKgOf } from "@/lib/mock/price-base";

export { unitKgOf };

/** 기준 단위 */
export const BASE_UNIT = "kg" as const;

/** 시세 조회·즐겨찾기 등에서 공통으로 제공하는 거래단위 선택지 */
export const UNIT_OPTIONS = [
  "1kg 기준",
  "2kg 기준",
  "4kg 기준",
  "5kg 기준",
  "8kg 기준",
  "10kg 기준",
  "15kg 기준",
  "20kg 기준",
] as const;

/** 선택지에 없는 품목 기본단위의 폴백 (시세 조회 기본값과 동일) */
export const FALLBACK_UNIT = "10kg 기준";

/** 품목명별 기본 거래단위 (= 상자당 kg 정의) */
export const DEFAULT_UNIT_BY_ITEM: Record<string, string> = {
  배추: "10kg 기준",
  무: "20kg 기준",
  당근: "20kg 기준",
  감자: "20kg 기준",
  고구마: "10kg 기준",
  마늘: "1kg 기준",
  양파: "15kg 기준",
  대파: "1kg 기준",
  청양고추: "10kg 기준",
  상추: "4kg 기준",
  시금치: "4kg 기준",
  깻잎: "2kg 기준",
  오이: "10kg 기준",
  토마토: "5kg 기준",
  파프리카: "5kg 기준",
  가지: "5kg 기준",
  딸기: "2kg 기준",
  참외: "10kg 기준",
  수박: "8kg 기준",
  복숭아: "4.5kg 기준",
  포도: "5kg 기준",
  배: "15kg 기준",
  사과: "10kg 기준",
  단감: "10kg 기준",
  표고버섯: "4kg 기준",
  팽이버섯: "1kg 기준",
  쌀: "20kg 기준",
};

/** 품목의 기본 거래단위 라벨 */
export function defaultUnitFor(itemName?: string): string {
  if (!itemName) return FALLBACK_UNIT;
  return DEFAULT_UNIT_BY_ITEM[itemName] ?? FALLBACK_UNIT;
}

/** 품목의 "상자당 kg" (기본 거래단위 기준) */
export function boxKgOf(itemName?: string): number {
  return unitKgOf(defaultUnitFor(itemName));
}

/** "10kg 기준" 같은 라벨이 kg 기준 몇 배인지 */
export function unitMultiplier(unit: string): number {
  return unitKgOf(unit);
}

// ---------------------------------------------------------------------------
// 수량 단위 (예측 수량 시트 등)
// ---------------------------------------------------------------------------

export type AmountUnit = "box" | "kg" | "ton" | "ea";

/** 낱개(개) 1개의 무게 기본값 — 미정의 품목은 1kg */
const EA_KG_BY_ITEM: Record<string, number> = {
  수박: 8,
  배추: 2.5,
  무: 1.5,
  단감: 0.25,
  사과: 0.3,
  배: 0.5,
};

export function eaKgOf(itemName?: string): number {
  if (!itemName) return 1;
  return EA_KG_BY_ITEM[itemName] ?? 1;
}

/** 수량 단위 1단위가 몇 kg인지 */
export function kgPerAmountUnit(unit: AmountUnit, itemName?: string): number {
  switch (unit) {
    case "kg":
      return 1;
    case "ton":
      return 1000;
    case "box":
      return boxKgOf(itemName);
    case "ea":
      return eaKgOf(itemName);
  }
}

/** 수량을 kg으로 환산 */
export function toKg(value: number, unit: AmountUnit, itemName?: string): number {
  return value * kgPerAmountUnit(unit, itemName);
}

/** 단위 변경 시 같은 물량을 유지하도록 환산 (기본값 리셋 금지) */
export function convertAmount(
  value: number,
  from: AmountUnit,
  to: AmountUnit,
  itemName?: string,
): number {
  if (from === to) return value;
  const kg = toKg(value, from, itemName);
  const next = kg / kgPerAmountUnit(to, itemName);
  return next >= 10 ? Math.round(next) : Math.round(next * 10) / 10;
}
