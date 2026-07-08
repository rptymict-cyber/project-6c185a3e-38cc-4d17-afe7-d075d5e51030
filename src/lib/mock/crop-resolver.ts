/**
 * 통계/시세 mock 데이터에서 사용하는 subject(작물) 해석기.
 *
 * 통계 상세 화면의 route param(`variety`)는 다음 3가지 중 하나일 수 있다.
 *  1. CROPS mock의 crop id (예: "chili", "apple")
 *  2. catalog의 변종 id (예: "060010001")
 *  3. catalog의 품목 id (예: "06001")  ← "전체 품종" 선택 시
 *
 * 카탈로그에만 존재하고 CROPS mock에 없는 품목은
 * id 해시 기반으로 결정론적 fallback Crop을 생성한다.
 * 이렇게 하면 시장별 평균가 / 가격 추이 그래프가 모두 정상 렌더링된다.
 */
import type { Category, Crop, PredictionStatus } from "./crops";
import { getCrop as getCropMock } from "./crops";
import { CATEGORIES as CATALOG_CATEGORIES, ITEMS } from "./catalog";

export interface CropSubject {
  crop: Crop;
  categoryLabel: string;
  itemLabel: string;
  varietyLabel: string;
}

function hash(str: string): number {
  let s = 0;
  for (const ch of str) s = (s * 31 + ch.charCodeAt(0)) >>> 0;
  return s;
}

// 카탈로그 부류(예: "05") → CROPS의 Category enum 근사 매핑.
// 값이 없어도 렌더에는 영향이 거의 없으므로 fallback은 "vegetable".
function mapCatalogCategory(catalogCategoryId: string): Category {
  switch (catalogCategoryId) {
    case "01": // 미곡류
    case "02": // 맥류
    case "04": // 잡곡류
      return "grain";
    case "03": // 두류
      return "legume";
    case "05": // 서류
      return "tuber";
    case "06": // 과실류
    case "07": // 수실류
    case "08": // 과일과채류
      return "fruit";
    default:
      return "vegetable";
  }
}

function synthesizeCrop(
  id: string,
  name: string,
  categoryEnum: Category,
): Crop {
  const h = hash(id || name);
  const base = 1500 + (h % 9000); // 1,500 ~ 10,500원/kg
  const prevPct = ((h % 17) - 8) / 100; // -8% ~ +8%
  const prevPrice = Math.max(100, Math.round(base / (1 + prevPct)));
  const volumeTon = Math.round(((h % 400) + 20) * 10) / 10;
  return {
    id,
    name,
    emoji: "",
    category: categoryEnum,
    unit: "원/kg",
    currentPrice: base,
    prevPrice,
    volumeTon,
    updatedAt: "오늘 17:00",
    spark: [],
    isPredictable: false,
    predictionStatus: "unavailable" satisfies PredictionStatus,
    aiReady: false,
  };
}

/**
 * id를 해석해 Crop 및 라벨(부류/품목/품종)을 반환한다.
 * 어떤 id를 받아도 null을 반환하지 않고 synthesized Crop을 만든다.
 */
export function resolveCropSubject(id: string): CropSubject {
  // 1) CROPS mock 매칭
  const mockCrop = getCropMock(id);
  if (mockCrop) {
    return {
      crop: mockCrop,
      categoryLabel: mockCrop.category,
      itemLabel: mockCrop.name,
      varietyLabel: mockCrop.name,
    };
  }

  // 2) 카탈로그 variety 매칭
  for (const item of ITEMS) {
    const v = item.varieties.find((vv) => vv.id === id);
    if (v) {
      const cat = CATALOG_CATEGORIES.find((c) => c.id === item.categoryId);
      const catEnum = mapCatalogCategory(item.categoryId);
      return {
        crop: synthesizeCrop(id, v.name, catEnum),
        categoryLabel: cat?.name ?? "",
        itemLabel: item.name,
        varietyLabel: v.name,
      };
    }
  }

  // 3) 카탈로그 item 매칭 (전체 품종)
  const item = ITEMS.find((it) => it.id === id);
  if (item) {
    const cat = CATALOG_CATEGORIES.find((c) => c.id === item.categoryId);
    const catEnum = mapCatalogCategory(item.categoryId);
    return {
      crop: synthesizeCrop(id, item.name, catEnum),
      categoryLabel: cat?.name ?? "",
      itemLabel: item.name,
      varietyLabel: "전체 품종",
    };
  }

  // 4) 최종 fallback
  return {
    crop: synthesizeCrop(id, id, "vegetable"),
    categoryLabel: "",
    itemLabel: id,
    varietyLabel: id,
  };
}
