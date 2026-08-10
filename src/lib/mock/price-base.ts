/**
 * 품목별 기준 kg 단가 SSOT (mock).
 *
 * 시세조회(MKT-001), 시세상세(MKT-002), 경매내역(AUC-001) 등 모든 시세 화면은
 * 가격/등락률을 각자 만들지 말고 이 파일의 기준값에서 "환산만" 한다.
 *
 *  - basePricePerKg : kg당 기준 단가(원)
 *  - changeRate     : 전일대비 등락률(%) — 모든 화면이 동일 값을 사용
 *
 * 실제 API 연동 시 이 파일만 교체하면 전 화면이 함께 바뀐다.
 */

export type PriceBase = {
  /** 안정적인 식별자(영문 crop id 또는 카탈로그 품목 id) */
  cropId: string;
  /** 품목명(한국어) */
  name: string;
  basePricePerKg: number;
  changeRate: number;
};

/** 영문 crop id ↔ 품목명 매핑 (CROPS mock 진입용) */
const NAME_BY_CROP_ID: Record<string, string> = {
  apple: "사과",
  pear: "배",
  grape: "포도",
  cabbage: "배추",
  lettuce: "상추",
  garlic: "마늘",
  onion: "양파",
  chili: "청양고추",
  radish: "무",
  carrot: "당근",
  potato: "감자",
  sweetpotato: "고구마",
  shiitake: "표고버섯",
  enoki: "팽이버섯",
  rice: "쌀",
  barley: "보리",
  soybean: "콩",
  redbean: "팥",
};

const CROP_ID_BY_NAME: Record<string, string> = Object.fromEntries(
  Object.entries(NAME_BY_CROP_ID).map(([id, name]) => [name, id]),
);

/** 품목명 기준 기준 단가 표 (kg당, 전일대비 %) */
const BASE_TABLE: Record<string, { basePricePerKg: number; changeRate: number }> = {
  사과: { basePricePerKg: 3240, changeRate: 2.3 },
  배: { basePricePerKg: 4180, changeRate: -1.9 },
  포도: { basePricePerKg: 6720, changeRate: 2.8 },
  배추: { basePricePerKg: 1180, changeRate: -4.8 },
  상추: { basePricePerKg: 5240, changeRate: 5.2 },
  마늘: { basePricePerKg: 8420, changeRate: 0.5 },
  양파: { basePricePerKg: 1620, changeRate: -5.8 },
  청양고추: { basePricePerKg: 9840, changeRate: -3.9 },
  무: { basePricePerKg: 980, changeRate: 4.3 },
  당근: { basePricePerKg: 2140, changeRate: 2.9 },
  감자: { basePricePerKg: 2860, changeRate: -1.4 },
  고구마: { basePricePerKg: 3980, changeRate: 3.1 },
  표고버섯: { basePricePerKg: 12400, changeRate: 1.6 },
  팽이버섯: { basePricePerKg: 3240, changeRate: -1.8 },
  쌀: { basePricePerKg: 2620, changeRate: -0.8 },
  보리: { basePricePerKg: 1710, changeRate: 1.8 },
  콩: { basePricePerKg: 6820, changeRate: 1.2 },
  팥: { basePricePerKg: 12400, changeRate: 1.6 },
  가지: { basePricePerKg: 2480, changeRate: -2.6 },
  오이: { basePricePerKg: 2180, changeRate: 3.4 },
  토마토: { basePricePerKg: 2960, changeRate: -2.1 },
  대파: { basePricePerKg: 1980, changeRate: 4.8 },
  파프리카: { basePricePerKg: 4620, changeRate: -1.2 },
  딸기: { basePricePerKg: 12800, changeRate: 2.2 },
  참외: { basePricePerKg: 4380, changeRate: -0.9 },
  수박: { basePricePerKg: 1740, changeRate: 3.7 },
  복숭아: { basePricePerKg: 5240, changeRate: -1.6 },
  단감: { basePricePerKg: 3120, changeRate: 1.1 },
  시금치: { basePricePerKg: 4180, changeRate: 6.2 },
  깻잎: { basePricePerKg: 7240, changeRate: -2.4 },
};

// -- deterministic fallback --------------------------------------------------

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function seeded(seed: number) {
  let s = seed || 1;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function fallbackBase(name: string): { basePricePerKg: number; changeRate: number } {
  const r = seeded(hash(`price-base|${name}`));
  return {
    basePricePerKg: 700 + Math.round(r() * 1600),
    changeRate: +(r() * 16 - 8).toFixed(1),
  };
}

// -- resolution -------------------------------------------------------------

/** "0601" / "060101" / "cabbage" / "배추" 어떤 키가 와도 품목명으로 정규화 */
function normalizeName(key: string, itemNameLookup?: (itemId: string) => string | undefined): string {
  if (!key) return "기타";
  if (NAME_BY_CROP_ID[key]) return NAME_BY_CROP_ID[key];
  if (BASE_TABLE[key]) return key;
  const digits = key.match(/^(\d{4})/);
  if (digits && itemNameLookup) {
    const name = itemNameLookup(digits[1]);
    if (name) return name;
  }
  return key;
}

let itemNameResolver: ((itemId: string) => string | undefined) | undefined;

/**
 * 카탈로그 품목 id → 품목명 해석기 등록. (순환 import 방지를 위한 주입 방식)
 */
export function registerItemNameResolver(fn: (itemId: string) => string | undefined) {
  itemNameResolver = fn;
}

/** 어떤 키(crop id / 품목 id / 품종 id / 품목명)로도 동일한 기준값을 반환 */
export function getPriceBase(key: string): PriceBase {
  const name = normalizeName(key, itemNameResolver);
  const entry = BASE_TABLE[name] ?? fallbackBase(name);
  return {
    cropId: CROP_ID_BY_NAME[name] ?? name,
    name,
    basePricePerKg: entry.basePricePerKg,
    changeRate: entry.changeRate,
  };
}

/** 기준 kg 단가 */
export function basePricePerKg(key: string): number {
  return getPriceBase(key).basePricePerKg;
}

/** 전일대비 등락률(%) — 화면별로 따로 만들지 말고 이 값만 사용 */
export function baseChangeRate(key: string): number {
  return getPriceBase(key).changeRate;
}

/** "10kg 기준", "원/kg", "8kg" 등에서 kg 수를 추출 */
export function unitKgOf(unit: string): number {
  const m = unit.match(/(\d+(?:\.\d+)?)\s*kg/i);
  return m ? parseFloat(m[1]) : 1;
}

/** 기준 kg 단가 → 거래단위 가격 (10원 단위 반올림) */
export function toUnitPrice(perKg: number, unit: string): number {
  return Math.round((perKg * unitKgOf(unit)) / 10) * 10;
}

/** 등락률로부터 전일 가격 역산 */
export function prevPriceFrom(price: number, changeRate: number): number {
  return Math.round(price / (1 + changeRate / 100));
}
