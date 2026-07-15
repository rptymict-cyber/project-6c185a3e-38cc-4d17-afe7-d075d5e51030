export type QuantityUnit = "box" | "kg" | "ton" | "ea";

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
