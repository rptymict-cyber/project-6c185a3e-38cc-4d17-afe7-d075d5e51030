// 등급별 가격 SSOT.
// GRD-001(등급정보, /grades)이 사용하는 CROPS[].grades 를 그대로 재사용해서
// 다른 화면(시세상세의 등급/품종별 표 등)도 같은 등급 데이터를 참조하게 한다.
// GRD-001 의 데이터/로직은 변경하지 않는다.

import { CROPS } from "./crops";
import { getPriceBase } from "./price-base";

export type GradeKey = "top" | "mid" | "low";

/** grades 가 정의되지 않은 품목의 기본 등급 배율 (crop-resolver 와 동일 기준). */
const FALLBACK_RATIO: Record<GradeKey, number> = {
  top: 1.16,
  mid: 1,
  low: 0.84,
};

/** 등급 라벨 → 등급 키 매핑 (상품/중품/하품, 상/중/하, 특 등급 표기 포함). */
export function gradeKeyOf(label: string): GradeKey | null {
  const s = label.trim();
  if (/^(특|상품|상|특등급|1등급)$/.test(s)) return "top";
  if (/^(중품|중|2등급)$/.test(s)) return "mid";
  if (/^(하품|하|등외)$/.test(s)) return "low";
  return null;
}

/**
 * 품목/품종 식별자에 대한 등급별 kg당 가격.
 * 항상 상품 > 중품 > 하품 순서를 만족한다.
 */
export function getGradePricesPerKg(id: string): Record<GradeKey, number> {
  const crop = CROPS.find((c) => c.id === id || c.name === id);
  if (crop?.grades) {
    const { top, mid, low } = crop.grades;
    return { top, mid, low };
  }
  const base = getPriceBase(id).basePricePerKg;
  return {
    top: Math.round(base * FALLBACK_RATIO.top),
    mid: Math.round(base * FALLBACK_RATIO.mid),
    low: Math.round(base * FALLBACK_RATIO.low),
  };
}

/** 라벨로 등급 kg당 가격을 조회한다. 등급 라벨이 아니면 null. */
export function gradePricePerKgByLabel(id: string, label: string): number | null {
  const key = gradeKeyOf(label);
  if (!key) return null;
  return getGradePricesPerKg(id)[key];
}
