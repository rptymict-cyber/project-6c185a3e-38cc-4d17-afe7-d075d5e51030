import { convertAmount, type AmountUnit } from "@/lib/units";

/** 수량 단위는 공통 단위 SSOT의 AmountUnit과 동일하다 */
export type QuantityUnit = AmountUnit;

export const QUANTITY_UNITS: QuantityUnit[] = ["box", "kg", "ton", "ea"];

export const QUANTITY_UNIT_LABEL: Record<QuantityUnit, string> = {
  box: "상자",
  kg: "kg",
  ton: "톤",
  ea: "개",
};

export const QUANTITY_UNIT_PRESETS: Record<QuantityUnit, number[]> = {
  box: [5, 10, 15, 20, 30, 50, 100],
  kg: [10, 50, 100, 200, 500, 1000],
  ton: [1, 2, 5, 10, 20, 50],
  ea: [10, 50, 100, 300, 500, 1000],
};

export const QUANTITY_UNIT_STEP: Record<QuantityUnit, number> = {
  box: 1,
  kg: 10,
  ton: 1,
  ea: 10,
};

export const QUANTITY_UNIT_DEFAULT: Record<QuantityUnit, number> = {
  box: 15,
  kg: 100,
  ton: 2,
  ea: 100,
};

export const QUANTITY_MAX = 9999;

export function clampQuantity(value: number, unit: QuantityUnit): number {
  const step = QUANTITY_UNIT_STEP[unit];
  const n = Math.max(step, Math.min(QUANTITY_MAX, Math.round(value)));
  return isNaN(n) ? QUANTITY_UNIT_DEFAULT[unit] : n;
}

export function formatQuantity(value: number, unit: QuantityUnit): string {
  return `${value.toLocaleString()}${QUANTITY_UNIT_LABEL[unit]}`;
}

/**
 * 단위를 바꿀 때 기본값으로 리셋하지 말고 kg 기준으로 환산한다.
 * (상자당 kg은 품목 기본 거래단위 기준 — `@/lib/units`)
 */
export function convertQuantity(
  value: number,
  from: QuantityUnit,
  to: QuantityUnit,
  itemName?: string,
): number {
  return clampQuantity(convertAmount(value, from, to, itemName), to);
}
