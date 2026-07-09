/**
 * 통계 화면에서 사용하는 subject(작물) 해석기.
 *
 * 통계 상세 화면의 route param(`variety`)는 다음 중 하나:
 *  1. catalog의 품종 id (6자리, 예: "060101")
 *  2. catalog의 품목 id (4자리, 예: "0601")  ← "전체 품종" 선택 시
 *  3. CROPS mock의 crop id (예: "apple", "potato") — 레거시 진입
 *
 * 통계 상세는 catalog에 있는 모든 부류/품목/품종을 진입 가능하게 유지한다.
 * CROPS에 존재하는 일부 mock id로 fallback하지 않고, 현재 route param과 catalog 라벨을
 * seed로 사용해 해당 작물 전용 deterministic mock 데이터를 만든다.
 */
import type { Category, Crop } from "./crops";
import { getCrop as getCropMock } from "./crops";
import { CATEGORIES as CATALOG_CATEGORIES, ITEMS } from "./catalog";

function hash(str: string): number {
  let s = 0;
  for (const ch of str) s = (s * 31 + ch.charCodeAt(0)) >>> 0;
  return s;
}

function seededRandom(seedNum: number): () => number {
  let s = seedNum || 1;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function makeSeries(base: number, len: number, seedNum: number, vol = 0.06): number[] {
  const rnd = seededRandom(seedNum);
  const out: number[] = [];
  let v = base;
  for (let i = 0; i < len; i++) {
    v = v * (1 + (rnd() - 0.5) * vol);
    out.push(Math.max(30, Math.round(v)));
  }
  return out;
}

/**
 * 입력 id(품종 id / 품목 id / 레거시 CROPS id) → 통계 mock의 canonical crop id.
 * 매핑 실패 시 null.
 */
export function resolveStatisticsCropId(inputId: string): string | null {
  if (!inputId) return null;

  // catalog 품목 id (4자리)
  if (ITEMS.some((item) => item.id === inputId)) return inputId;

  // catalog 품종 id (6자리)
  if (inputId.length === 6) {
    const itemId = inputId.slice(0, 4);
    const item = ITEMS.find((it) => it.id === itemId);
    if (item?.varieties.some((v) => v.id === inputId)) return inputId;
  }

  // 레거시: CROPS id 직접 매칭
  if (getCropMock(inputId)) return inputId;

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
 * 현재 route param으로 해석한 catalog 작물 전용 deterministic mock Crop 반환.
 * catalog에 없는 레거시 CROPS id는 기존 mock을 그대로 반환한다.
 * 매칭 실패 시에도 다른 작물로 fallback하지 않고 input id 자체의 mock을 만든다.
 */
export function resolveRealCrop(id: string): Crop {
  const catalog = resolveCatalogSelection(id);
  if (catalog) return buildCatalogCrop(id, catalog);

  const legacy = getCropMock(id);
  if (legacy) return legacy;

  return buildFallbackCrop(id);
}

// -----------------------------------------------------------------------------
// 라벨 해석 (부류/품목/품종). 데이터 없음 화면에서도 표시가 필요하므로
// synthesize 하지 않고 카탈로그에서 안전하게 조회만 한다.
// -----------------------------------------------------------------------------

export interface CropSubject {
  /** 현재 route param으로 만든 통계용 deterministic mock crop. */
  crop: Crop;
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

function resolveCatalogSelection(id: string): {
  categoryLabel: string;
  itemLabel: string;
  varietyLabel: string;
  categoryId: string;
  itemId: string;
  varietyId?: string;
  seedId: string;
} | null {
  if (id.length === 6) {
    const itemId = id.slice(0, 4);
    const item = ITEMS.find((it) => it.id === itemId);
    const variety = item?.varieties.find((v) => v.id === id);
    if (item && variety) {
      const category = CATALOG_CATEGORIES.find((c) => c.id === item.categoryId);
      return {
        categoryLabel: category?.name ?? "",
        itemLabel: item.name,
        varietyLabel: variety.name,
        categoryId: item.categoryId,
        itemId: item.id,
        varietyId: variety.id,
        seedId: `${item.categoryId}:${item.id}:${variety.id}`,
      };
    }
  }

  const item = ITEMS.find((it) => it.id === id);
  if (item) {
    const category = CATALOG_CATEGORIES.find((c) => c.id === item.categoryId);
    return {
      categoryLabel: category?.name ?? "",
      itemLabel: item.name,
      varietyLabel: "전체 품종",
      categoryId: item.categoryId,
      itemId: item.id,
      seedId: `${item.categoryId}:${item.id}:ALL`,
    };
  }

  return null;
}

function buildCatalogCrop(
  routeId: string,
  selection: NonNullable<ReturnType<typeof resolveCatalogSelection>>,
): Crop {
  const seed = hash(`statistics:${selection.seedId}:${routeId}`);
  const category = mapCatalogCategory(selection.categoryId);
  const baselineByCategory: Record<Category, number> = {
    fruit: 3600,
    vegetable: 1800,
    seasoning: 4200,
    root: 1600,
    tuber: 2400,
    mushroom: 5200,
    grain: 2800,
    legume: 5400,
  };
  const base = baselineByCategory[category];
  const priceFactor = 0.65 + (seed % 180) / 100;
  const currentPrice = Math.max(120, Math.round((base * priceFactor) / 10) * 10);
  const prevShift = ((hash(`${selection.seedId}:prev`) % 17) - 8) / 100;
  const prevPrice = Math.max(100, Math.round((currentPrice / (1 + prevShift)) / 10) * 10);
  const volumeBase = category === "grain" ? 900 : category === "vegetable" ? 520 : 180;
  const volumeTon = Math.round((volumeBase * (0.35 + (hash(`${selection.seedId}:vol`) % 180) / 100)) * 10) / 10;
  const minute = 3 + (seed % 55);
  const spark = makeSeries(currentPrice, 7, seed + 17, 0.08);

  return {
    id: routeId,
    name: selection.itemLabel,
    emoji: "",
    category,
    unit: "원/kg",
    currentPrice,
    prevPrice,
    volumeTon,
    updatedAt: `오늘 17:${String(minute).padStart(2, "0")}`,
    spark,
    isPredictable: false,
    predictionStatus: "unavailable",
    aiReady: false,
    grades: {
      top: Math.round(currentPrice * 1.16),
      mid: currentPrice,
      low: Math.round(currentPrice * 0.84),
    },
  };
}

function buildFallbackCrop(id: string): Crop {
  const seed = hash(`statistics:unknown:${id}`);
  const currentPrice = Math.max(120, Math.round((900 + (seed % 7000)) / 10) * 10);
  const prevPrice = Math.max(100, Math.round((currentPrice * (0.94 + (seed % 13) / 100)) / 10) * 10);
  return {
    id,
    name: id,
    emoji: "",
    category: "vegetable",
    unit: "원/kg",
    currentPrice,
    prevPrice,
    volumeTon: Math.round((30 + (seed % 500)) * 10) / 10,
    updatedAt: "오늘 17:18",
    spark: makeSeries(currentPrice, 7, seed + 31, 0.08),
    isPredictable: false,
    predictionStatus: "unavailable",
    aiReady: false,
  };
}

export function resolveCropSubject(id: string): CropSubject {
  const crop = resolveRealCrop(id);
  const catalog = resolveCatalogSelection(id);
  if (catalog) {
    return {
      crop,
      categoryLabel: catalog.categoryLabel,
      itemLabel: catalog.itemLabel,
      varietyLabel: catalog.varietyLabel,
    };
  }

  // 레거시 CROPS id
  const legacy = getCropMock(id);
  if (legacy) {
    return {
      crop: legacy,
      categoryLabel: legacy.category,
      itemLabel: legacy.name,
      varietyLabel: legacy.name,
    };
  }

  // 아무 것도 매칭 안 됨 — 다른 작물로 fallback하지 않고 id 자체를 표시한다.
  return {
    crop,
    categoryLabel: "",
    itemLabel: id,
    varietyLabel: "",
  };
}
