import type {
  PredictableCrop,
  PredictionPoint,
  PredictionRangeDays,
  PricePrediction,
} from "./types";

/**
 * AI 가격 예측 지원 작물 (사과, 배추, 무, 양파, 마늘).
 * 카탈로그와 별개로, 예측 화면 내부에서 사용하는 슬림 데이터.
 */
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

/* --------------- deterministic mock generator --------------- */

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
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function buildPoints(
  cropId: string,
  rangeDays: PredictionRangeDays,
): { points: PredictionPoint[]; recommendedIdx: number } {
  const rand = seed(hashId(cropId) + rangeDays);
  const base = BASE_PRICE[cropId] ?? 5000;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 과거 7일 실제 + 오늘 + 미래 rangeDays 예측
  const pastDays = 7;
  const total = pastDays + 1 + rangeDays;
  const points: PredictionPoint[] = [];

  // 실제 가격: base 근처 완만한 흐름
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

  // 오늘
  const todayPrice = Math.round(base);
  points.push({
    date: formatDate(today),
    label: labelOf(today),
    actualPrice: todayPrice,
    predictedPrice: todayPrice,
    isToday: true,
  });

  // 예측 곡선: 매개 트렌드 방향 결정 (도매상은 저점, 농민은 고점)
  const trendUp = ["apple", "garlic", "radish"].includes(cropId);
  let predicted = todayPrice;
  const targetChangePct = trendUp ? 0.05 : -0.04;
  for (let i = 1; i <= rangeDays; i++) {
    const t = i / rangeDays;
    const drift = 1 + targetChangePct * t + (rand() - 0.5) * 0.02;
    predicted = todayPrice * drift;
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    points.push({
      date: formatDate(d),
      label: labelOf(d),
      predictedPrice: Math.round(predicted),
    });
  }

  // 추천일: 예측 구간 내에서 농민=max, 도매상=min (여기선 두 관점 공통으로 극값 표시)
  const futureSlice = points.slice(pastDays + 1);
  const maxIdxInSlice = futureSlice.reduce(
    (acc, p, i) => (p.predictedPrice! > futureSlice[acc].predictedPrice! ? i : acc),
    0,
  );
  const recommendedIdx = pastDays + 1 + maxIdxInSlice;
  points[recommendedIdx].isRecommendedDate = true;

  return { points, recommendedIdx };
}

function toDateLabel(iso: string) {
  const d = new Date(iso);
  const w = ["일", "월", "화", "수", "목", "금", "토"][d.getDay()];
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${w})`;
}

export function buildMockPrediction(
  cropId: string,
  rangeDays: PredictionRangeDays,
): PricePrediction | null {
  const crop = getPredictableCrop(cropId);
  if (!crop) return null;

  const { points, recommendedIdx } = buildPoints(cropId, rangeDays);
  const currentPrice = BASE_PRICE[cropId] ?? 5000;
  const previousChangeRate = PREV_DELTA_PCT[cropId] ?? 0;
  const previousChangePrice = Math.round(
    (currentPrice * previousChangeRate) / (100 + previousChangeRate),
  );

  // 농민: max 시점을 추천 판매일로
  const futureSlice = points.slice(8); // 과거7 + 오늘1 이후
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

  // recommendedIdx는 농민(max) 시점으로 유지
  points.forEach((p, i) => {
    p.isRecommendedDate = i === recommendedIdx;
  });

  const now = new Date();
  const updatedAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(
    2,
    "0",
  )}:${String(now.getMinutes()).padStart(2, "0")}`;

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
  };
}
