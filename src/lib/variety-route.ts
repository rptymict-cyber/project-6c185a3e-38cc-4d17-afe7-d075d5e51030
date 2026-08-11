/**
 * `/price/$variety` 라우트 파라미터 해석기.
 *
 * 홈 실시간 시세·실시간 목록·시장 목록 등 화면마다 넘기는 식별값이 다르다.
 *  - 카탈로그 품종 id ("060101"), 카탈로그 품목 id ("0601")
 *  - crop id ("cabbage"), items.ts 품종 id ("busa")
 *  - 품목명 ("배추")
 *
 * 어떤 값이 와도 동일한 부류/품목/품종/기본단위로 정규화해서
 * 시세 상세 화면이 클릭한 품목 데이터를 그대로 표시하게 한다.
 */
import { CATEGORIES, ITEMS as CATALOG_ITEMS } from "@/lib/mock/catalog";
import { ITEMS as MARKET_ITEMS } from "@/lib/mock/items";
import { getPriceBase } from "@/lib/mock/price-base";

export type VarietySelection = {
  categoryId: string;
  categoryLabel: string;
  itemId: string;
  itemLabel: string;
  varietyId: string;
  varietyLabel: string;
  /** 품목에 자연스러운 기본 거래단위 */
  unit: string;
};

/** 품목명별 기본 거래단위 — 공통 단위 SSOT(`@/lib/units`)에서 가져온다 */
const DEFAULT_UNIT_BY_NAME = DEFAULT_UNIT_BY_ITEM;


const FALLBACK_UNIT = "10kg 기준";

function categoryLabelOf(categoryId: string): string {
  return CATEGORIES.find((c) => c.id === categoryId)?.name ?? "";
}

/** 파라미터에서 품목명(한국어)과 품종명(있으면)을 추출 */
function namesFromParam(param: string): { itemName: string; varietyName?: string } {
  // 1) 카탈로그 품종 id
  for (const item of CATALOG_ITEMS) {
    const v = item.varieties.find((x) => x.id === param);
    if (v) return { itemName: item.name, varietyName: v.name };
  }
  // 2) 카탈로그 품목 id (또는 "0601:ALL" 형태)
  const itemIdPart = param.split(":")[0];
  const catalogItem = CATALOG_ITEMS.find((i) => i.id === itemIdPart);
  if (catalogItem) return { itemName: catalogItem.name };

  // 3) items.ts 품목/crop id
  const marketItem = MARKET_ITEMS.find((i) => i.id === param || i.cropId === param);
  if (marketItem) return { itemName: marketItem.name };

  // 4) items.ts 품종 id
  for (const item of MARKET_ITEMS) {
    const v = item.varieties.find((x) => x.id === param);
    if (v) return { itemName: item.name, varietyName: v.name };
  }

  // 5) crop id / 품목명 → 기준값 테이블로 정규화
  return { itemName: getPriceBase(param).name };
}

export function resolveVarietySelection(param: string): VarietySelection {
  const { itemName, varietyName } = namesFromParam(param);
  const catalogItem = CATALOG_ITEMS.find((i) => i.name === itemName);

  const itemId = catalogItem?.id ?? param;
  const categoryId = catalogItem?.categoryId ?? "";
  const matchedVariety = varietyName
    ? catalogItem?.varieties.find((v) => v.name === varietyName)
    : undefined;

  return {
    categoryId,
    categoryLabel: categoryLabelOf(categoryId),
    itemId,
    itemLabel: itemName,
    varietyId: matchedVariety?.id ?? param,
    varietyLabel: matchedVariety?.name ?? varietyName ?? "전체 품종",
    unit: DEFAULT_UNIT_BY_NAME[itemName] ?? FALLBACK_UNIT,
  };
}
