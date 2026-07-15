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

function seed(n: number) {
  let s = n;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
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

function buildPoints(
  cropId: string,
  rangeDays: PredictionRangeDays,
  grade: PredictionGrade,
): { points: PredictionPoint[]; recommendedIdx: number } {
  const rand = seed(hashId(cropId) + rangeDays);
  const gradeMul = GRADE_ADJ[grade];
  const base = (BASE_PRICE[cropId] ?? 5000) * gradeMul;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const pastDays = 7;
  const points: PredictionPoint[] = [];

  let actual = base * (1 - PREV_DELTA_PCT[cropId] / 100 / 4);
  for (let i = 0; i < pastDays; i++) {
    actual = actual * (1 + (rand() - 0.5) * 0.03);
    const d = new Date(today);
    d.setDate(today.getDate() - (pastDays - i));
    points.push({
      date: formatDate(d),
      label: labelOf(d),
      actualPrice: Math.round(actual),
    });
  }

  const todayPrice = Math.round(base);
  points.push({
    date: formatDate(today),
    label: labelOf(today),
    actualPrice: todayPrice,
    predictedPrice: todayPrice,
    isToday: true,
  });

  const trendUp = ["apple", "garlic", "radish"].includes(cropId);
  const targetChangePct = trendUp ? 0.05 : -0.04;
  const infA = Math.max(1, Math.round(rangeDays * 0.35));
  const infB = Math.max(infA + 1, Math.round(rangeDays * 0.78));
  for (let i = 1; i <= rangeDays; i++) {
    const t = i / rangeDays;
    const drift = 1 + targetChangePct * t + (rand() - 0.5) * 0.02;
    const mid = todayPrice * drift;
    const spread = mid * (0.008 + t * t * 0.075);
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    points.push({
      date: formatDate(d),
      label: labelOf(d),
      predictedPrice: Math.round(mid),
      optimisticPrice: Math.round(mid + spread),
      pessimisticPrice: Math.round(mid - spread),
      isInflection: i === infA || i === infB,
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
): PricePrediction | null {
  const crop = getPredictableCrop(cropId);
  if (!crop) return null;

  const gradeMul = GRADE_ADJ[grade];
  const { points, recommendedIdx } = buildPoints(cropId, rangeDays, grade);
  const currentPrice = Math.round((BASE_PRICE[cropId] ?? 5000) * gradeMul);
  const previousChangeRate = PREV_DELTA_PCT[cropId] ?? 0;
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
    const h = 8 + (hashId(cropId) % 12);
    const m = (hashId(cropId) * 7) % 60;
    d.setHours(h, m, 0, 0);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  })();

  return {
    cropId: crop.id,
    cropName: crop.name,
    varietyName: crop.varietyName,
    emoji: crop.emoji,
    marketId: crop.marketId,
    marketName: crop.marketName,
    unit: crop.unit,
    currentPrice,
    currentDate: formatDate(new Date()),
    previousChangePrice,
    previousChangeRate,
    predictionRangeDays: rangeDays,
    confidenceScore: 78 + ((hashId(cropId) % 10) as number),
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
