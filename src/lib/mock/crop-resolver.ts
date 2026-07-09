/**
 * 통계 화면에서 사용하는 subject(작물) 해석기.
 *
 * 통계 상세 화면의 route param(`variety`)는 다음 중 하나:
 *  1. CROPS mock의 crop id (예: "apple", "potato") — 레거시 진입
 *  2. catalog의 변종 id (6자리, 예: "060101")
 *  3. catalog의 품목 id (4자리, 예: "0601")  ← "전체 품종" 선택 시
 *
 * 카탈로그의 모든 부류/품목/품종은 UI에서 선택 가능하다.
 * 하지만 실제 통계 mock 데이터는 CROPS에 정의된 소수의 작물에 대해서만 존재하며,
 * 여기서는 명시적 매핑 테이블(STATISTICS_CROP_ID_BY_ITEM)을 통해서만 매칭한다.
 *
 * 매핑되지 않는 작물은 절대 다른 작물 데이터로 fallback하지 않는다.
 * (예: 카사바 → 사과 매칭 금지)
 */
import type { Category, Crop } from "./crops";
import { CROPS, getCrop as getCropMock } from "./crops";
import { CATEGORIES as CATALOG_CATEGORIES, ITEMS } from "./catalog";

// -----------------------------------------------------------------------------
// 통계 mock 데이터가 존재하는 catalog 품목 id → CROPS crop id 매핑.
// 이 표가 유일한 진실의 원천(SSOT)이다.
// 새로운 통계 데이터가 추가되면 여기에 항목을 추가한다.
// -----------------------------------------------------------------------------
const STATISTICS_CROP_ID_BY_ITEM: Record<string, string> = {
  // 미곡류
  "0103": "rice",       // 쌀
  // 맥류
  "0201": "barley",     // 보리
  // 두류
  "0301": "soybean",    // 콩
  "0302": "redbean",    // 팥
  // 서류
  "0501": "potato",     // 감자
  "0502": "sweetpotato",// 고구마
  // 과실류
  "0601": "apple",      // 사과
  "0602": "pear",       // 배
  "0603": "grape",      // 포도
  // 엽경채류
  "1001": "cabbage",    // 배추
  "1005": "lettuce",    // 상추
  // 근채류
  "1101": "radish",     // 무
  "1103": "carrot",     // 당근
  // 조미채소류
  "1201": "onion",      // 양파
  "1205": "chili",      // 풋고추(청양 등)
  "1209": "garlic",     // 마늘
  // 버섯류
  "1704": "shiitake",   // 표고버섯
  "1705": "enoki",      // 팽이버섯
};

/**
 * 입력 id(품종 id / 품목 id / 레거시 CROPS id) → 통계 mock의 canonical crop id.
 * 매핑 실패 시 null.
 */
export function resolveStatisticsCropId(inputId: string): string | null {
  if (!inputId) return null;

  // 1) 레거시: CROPS id 직접 매칭
  if (getCropMock(inputId)) return inputId;

  // 2) 카탈로그 품목 id (4자리)
  if (STATISTICS_CROP_ID_BY_ITEM[inputId]) {
    return STATISTICS_CROP_ID_BY_ITEM[inputId];
  }

  // 3) 카탈로그 품종 id (6자리) → 앞 4자리를 품목 id 로 취급
  if (inputId.length === 6) {
    const itemId = inputId.slice(0, 4);
    if (STATISTICS_CROP_ID_BY_ITEM[itemId]) {
      return STATISTICS_CROP_ID_BY_ITEM[itemId];
    }
  }

  return null;
}

/**
 * 통계 mock 데이터가 실제로 존재하는지 여부.
 * UI에서 "데이터 없음" 상태를 결정할 때 사용한다.
 */
export function hasRealStatisticsData(id: string): boolean {
  return resolveStatisticsCropId(id) !== null;
}

/**
 * canonical CROPS 객체 반환. 매핑 실패 시 null — 절대 fallback 금지.
 */
export function resolveRealCrop(id: string): Crop | null {
  const cropId = resolveStatisticsCropId(id);
  if (!cropId) return null;
  return getCropMock(cropId) ?? null;
}

// -----------------------------------------------------------------------------
// 라벨 해석 (부류/품목/품종). 데이터 없음 화면에서도 표시가 필요하므로
// synthesize 하지 않고 카탈로그에서 안전하게 조회만 한다.
// -----------------------------------------------------------------------------

export interface CropSubject {
  /** 실제 통계 데이터가 있는 경우에만 CROPS crop. 없으면 null. */
  crop: Crop | null;
  categoryLabel: string;
  itemLabel: string;
  varietyLabel: string;
}

function mapCatalogCategory(catalogCategoryId: string): Category {
  switch (catalogCategoryId) {
    case "01":
    case "02":
    case "04":
      return "grain";
    case "03":
      return "legume";
    case "05":
      return "tuber";
    case "06":
    case "07":
    case "08":
      return "fruit";
    case "17":
      return "mushroom";
    case "11":
      return "root";
    case "12":
      return "seasoning";
    default:
      return "vegetable";
  }
}

export function resolveCropSubject(id: string): CropSubject {
  const crop = resolveRealCrop(id);

  // 1) 카탈로그 품종 id (6자리)
  if (id.length === 6) {
    for (const item of ITEMS) {
      const v = item.varieties.find((vv) => vv.id === id);
      if (v) {
        const cat = CATALOG_CATEGORIES.find((c) => c.id === item.categoryId);
        return {
          crop,
          categoryLabel: cat?.name ?? "",
          itemLabel: item.name,
          varietyLabel: v.name,
        };
      }
    }
  }

  // 2) 카탈로그 품목 id (4자리, "전체 품종")
  const item = ITEMS.find((it) => it.id === id);
  if (item) {
    const cat = CATALOG_CATEGORIES.find((c) => c.id === item.categoryId);
    return {
      crop,
      categoryLabel: cat?.name ?? "",
      itemLabel: item.name,
      varietyLabel: "전체 품종",
    };
  }

  // 3) 레거시 CROPS id
  if (crop) {
    return {
      crop,
      categoryLabel: crop.category,
      itemLabel: crop.name,
      varietyLabel: crop.name,
    };
  }

  // 4) 아무 것도 매칭 안 됨 — 안전한 빈 라벨.
  //    mapCatalogCategory는 미래 유지보수용으로 남겨둔다.
  void mapCatalogCategory;
  void CROPS;
  return {
    crop: null,
    categoryLabel: "",
    itemLabel: id,
    varietyLabel: "",
  };
}
