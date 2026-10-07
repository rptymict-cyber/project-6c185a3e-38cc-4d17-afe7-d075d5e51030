import { MARKETS } from "@/lib/mock/markets";
import type {
  PredictableCrop,
  PredictionGrade,
  PredictionPoint,
  PredictionRangeDays,
  PricePrediction,
} from "./types";

export const PREDICTABLE_CROPS: PredictableCrop[] = [
  {
    id: "apple",
    name: "사과",
    categoryName: "과실류",
    varietyName: "사과(일반)",
    emoji: "🍎",
    marketId: "seoul-garak",
    marketName: "서울가락",
    unit: "10kg 기준",
    isPredictable: true,
    predictionStatus: "available",
  },
  {
    id: "cabbage",
    name: "배추",
    categoryName: "채소류",
    varietyName: "배추(일반)",
    emoji: "🥬",
    marketId: "seoul-garak",
    marketName: "서울가락",
    unit: "10kg 기준",
    isPredictable: true,
    predictionStatus: "available",
  },
  {
    id: "radish",
    name: "무",
    categoryName: "근채류",
    varietyName: "무(일반)",
    emoji: "🥕",
    marketId: "seoul-garak",
    marketName: "서울가락",
    unit: "20kg 기준",
    isPredictable: true,
    predictionStatus: "available",
  },
  {
    id: "onion",
    name: "양파",
    categoryName: "양념채소",
    varietyName: "양파(일반)",
    emoji: "🧅",
    marketId: "seoul-garak",
    marketName: "서울가락",
    unit: "15kg 기준",
    isPredictable: true,
    predictionStatus: "available",
  },
  {
    id: "garlic",
    name: "마늘",
    categoryName: "양념채소",
    varietyName: "깐마늘",
    emoji: "🧄",
    marketId: "seoul-garak",
    marketName: "서울가락",
    unit: "1kg 기준",
    isPredictable: true,
    predictionStatus: "available",
  },
];

export function isPredictableCropId(id: string | undefined | null): boolean {
  if (!id) return false;
  return PREDICTABLE_CROPS.some((c) => c.id === id);
}

export function getPredictableCrop(
  id: string | undefined | null,
): PredictableCrop | undefined {
  if (!id) return undefined;
  return PREDICTABLE_CROPS.find((c) => c.id === id);
}

const BASE_PRICE: Record<string, number> = {
  apple: 12840,
  cabbage: 5640,
  radish: 7220,
  onion: 8480,
  garlic: 7850,
};

const PREV_DELTA_PCT: Record<string, number> = {
  apple: -3.2,
  cabbage: 8.2,
  radish: 6.1,
  onion: -4.1,
  garlic: 3.0,
};

const GRADE_ADJ: Record<PredictionGrade, number> = {
  all: 1.0,
  "특": 1.06,
  "중": 1.0,
  "하": 0.9,
};

const DEFAULT_MARKET_ID = "seoul-garak";

function getMarket(marketId?: string) {
  return (
    MARKETS.find((m) => m.id === marketId) ??
    MARKETS.find((m) => m.id === DEFAULT_MARKET_ID) ??
    MARKETS[0]
  );
}

/** 시장별 가격 수준 배율: 전체 시장 평균 kg 단가 대비 해당 시장의 상대 수준 */
function marketPriceFactor(marketId?: string) {
  const mean =
    MARKETS.reduce((sum, m) => sum + m.avgKg, 0) / (MARKETS.length || 1);
  const m = getMarket(marketId);
  return mean > 0 ? m.avgKg / mean : 1;
}

/** 시장별 전일대비 추세(%): mock 시장 데이터의 avgKg / prevAvgKg 에서 산출 */
function marketTrendPct(marketId?: string) {
  const m = getMarket(marketId);
  if (!m.prevAvgKg) return 0;
  return ((m.avgKg - m.prevAvgKg) / m.prevAvgKg) * 100;
}

function hashId(id: string) {
  return id.split("").reduce((s, ch) => s + ch.charCodeAt(0), 0);
}

function formatDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function labelOf(d: Date) {
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

/** 품목 기본 등락률 + 시장 자체 추세를 합산한 전일대비(%) */
function cropPrevDeltaPct(cropId: string, marketId: string) {
  return (PREV_DELTA_PCT[cropId] ?? 0) + marketTrendPct(marketId) * 0.5;
}

function buildPoints(
  cropId: string,
  rangeDays: PredictionRangeDays,
  grade: PredictionGrade,
  marketId: string,
): { points: PredictionPoint[]; recommendedIdx: number } {
  const gradeMul = GRADE_ADJ[grade];
  const marketMul = marketPriceFactor(marketId);
  const base = (BASE_PRICE[cropId] ?? 5000) * gradeMul * marketMul;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const pastDays = 90; // 과거 최대 90일
  const points: PredictionPoint[] = [];

  // 결정적 곡선(랜덤 노이즈 없음): 같은 곡선을 탭 길이만큼 잘라 쓰므로 탭 간 일관
  const B = Math.round(base);
  const dir = ["apple", "garlic", "radish"].includes(cropId) ? 1 : -0.7;
  const neutralAt = (i: number) => {
    let r = dir * 0.0746 * Math.pow(i / 29, 1.15);
    if (i <= 8) r -= 0.0114 * Math.sin((Math.PI * i) / 8);
    r += 0.0067 * Math.sin(i * 0.9) + 0.0043 * Math.sin(i * 2.1);
    if (i > 29) r -= 0.0057 * (i - 29);
    return B * (1 + r);
  };
  const rawR = (i: number) =>
    0.0256 * Math.sin(i / 3.3 + 1) + 0.0128 * Math.sin(i / 1.4) - (i > -5 ? 0.0085 * (i + 5) : 0);
  const actualAt = (i: number) => B * (1 + rawR(i) - rawR(0));
  const bandW = (i: number) => B * (0.00284 + 0.0017 * i);
  const volAt = (i: number) => 0.3 + 0.45 * Math.abs(Math.sin(i * 1.7));

  for (let k = pastDays; k >= 1; k--) {
    const d = new Date(today);
    d.setDate(today.getDate() - k);
    points.push({
      date: formatDate(d),
      label: labelOf(d),
      actualPrice: Math.round(actualAt(-k)),
      volume: volAt(-k) * 100,
    });
  }

  points.push({
    date: formatDate(today),
    label: labelOf(today),
    actualPrice: B,
    predictedPrice: B,
    isToday: true,
  });

  let inflections = 0;
  for (let i = 1; i <= rangeDays; i++) {
    const n = neutralAt(i);
    const isInf =
      inflections < 4 &&
      i >= 2 &&
      i <= rangeDays - 2 &&
      (n - neutralAt(i - 1)) * (neutralAt(i + 1) - n) < 0 &&
      Math.abs(n - neutralAt(Math.max(0, i - 3))) > B * 0.0085;
    if (isInf) inflections++;
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    points.push({
      date: formatDate(d),
      label: labelOf(d),
      predictedPrice: Math.round(n),
      optimisticPrice: Math.round(n + bandW(i)),
      pessimisticPrice: Math.round(n - bandW(i) * 0.9),
      isInflection: isInf,
    });
  }

  const futureSlice = points.slice(pastDays + 1);
  const maxIdxInSlice = futureSlice.reduce(
    (acc, p, i) =>
      (p.predictedPrice ?? 0) > (futureSlice[acc].predictedPrice ?? 0)
        ? i
        : acc,
    0,
  );
  const recommendedIdx = pastDays + 1 + maxIdxInSlice;
  points[recommendedIdx].isRecommendedDate = true;

  return { points, recommendedIdx };
}

function toDateLabel(iso: string) {
  const [, month, date] = iso.split("-").map(Number);
  return `${month}월 ${date}일`;
}

export function buildMockPrediction(
  cropId: string,
  rangeDays: PredictionRangeDays,
  grade: PredictionGrade = "특",
  marketId: string = DEFAULT_MARKET_ID,
): PricePrediction | null {
  const crop = getPredictableCrop(cropId);
  if (!crop) return null;

  const market = getMarket(marketId);
  const gradeMul = GRADE_ADJ[grade];
  const marketMul = marketPriceFactor(market.id);
  const { points, recommendedIdx } = buildPoints(
    cropId,
    rangeDays,
    grade,
    market.id,
  );
  const currentPrice = Math.round(
    (BASE_PRICE[cropId] ?? 5000) * gradeMul * marketMul,
  );
  const previousChangeRate = cropPrevDeltaPct(cropId, market.id);
  const previousChangePrice = Math.round(
    (currentPrice * previousChangeRate) / (100 + previousChangeRate),
  );

  const futureSlice = points.slice(8);
  const maxPoint = futureSlice.reduce((a, b) =>
    (a.predictedPrice ?? 0) >= (b.predictedPrice ?? 0) ? a : b,
  );
  const minPoint = futureSlice.reduce((a, b) =>
    (a.predictedPrice ?? Infinity) <= (b.predictedPrice ?? Infinity) ? a : b,
  );

  const farmerExpected = maxPoint.predictedPrice ?? currentPrice;
  const farmerDiff = farmerExpected - currentPrice;
  const farmerRate = (farmerDiff / currentPrice) * 100;

  const wholesalerExpected = minPoint.predictedPrice ?? currentPrice;
  const wholesalerDiff = wholesalerExpected - currentPrice;
  const wholesalerRate = (wholesalerDiff / currentPrice) * 100;

  points.forEach((p, i) => {
    p.isRecommendedDate = i === recommendedIdx;
  });

  const updatedAt = (() => {
    const d = new Date();
    const h = 8 + ((hashId(cropId) + hashId(market.id)) % 12);
    const m = ((hashId(cropId) + hashId(market.id)) * 7) % 60;
    d.setHours(h, m, 0, 0);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  })();

  return {
    cropId: crop.id,
    cropName: crop.name,
    varietyName: crop.varietyName,
    emoji: crop.emoji,
    marketId: market.id,
    marketName: market.name,
    unit: crop.unit,
    currentPrice,
    currentDate: formatDate(new Date()),
    previousChangePrice,
    previousChangeRate,
    predictionRangeDays: rangeDays,
    confidenceScore:
      78 + (((hashId(cropId) + hashId(market.id)) % 10) as number),
    predictedPoints: points,
    farmerInsight: {
      viewpoint: "farmer",
      recommendationTitle: "AI 출하 추천",
      recommendationDate: toDateLabel(maxPoint.date),
      expectedPrice: farmerExpected,
      expectedDiffPrice: farmerDiff,
      expectedDiffRate: farmerRate,
      summary:
        farmerDiff >= 0
          ? "예측 구간 내 최고 예상가 시점에 출하하면 현재가보다 유리해요."
          : "예측 구간 내 상승 여지가 크지 않아 조기 출하를 검토하세요.",
      ctaLabel: "이 시점에 알림 받기",
    },
    wholesalerInsight: {
      viewpoint: "wholesaler",
      recommendationTitle: "AI 매입 추천",
      recommendationDate: toDateLabel(minPoint.date),
      expectedPrice: wholesalerExpected,
      expectedDiffPrice: wholesalerDiff,
      expectedDiffRate: wholesalerRate,
      summary:
        wholesalerDiff <= 0
          ? "예측 구간 내 최저 예상가 시점에 매입하면 절감 여지가 있어요."
          : "가격 상승세라 조기 매입이 유리할 수 있어요.",
      ctaLabel: "이 시점에 알림 받기",
    },
    factors: [
      {
        type: "positive",
        title: "최근 거래량 감소",
        description: "직전 3일 평균 거래량이 -12% 감소해 가격 지지 요인.",
      },
      {
        type: "positive",
        title: "주말 전 수요 증가",
        description: "요일별 패턴상 목·금 반입 대비 낙찰가 상승 경향.",
      },
      {
        type: "warning",
        title: "휴장 이후 반입량 증가 가능성",
        description: "다음 휴장일 이후 반입 급증 시 단기 하락 리스크.",
      },
    ],
    updatedAt,
    grade,
    gradeAvailable: false,
  };
}
