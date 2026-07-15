export type PredictionStatus = "available" | "unavailable" | "comingSoon";

export type PredictionViewpoint = "farmer" | "wholesaler";
export type PredictionRangeDays = 7 | 10 | 14 | 30;
export type PredictionGrade = "all" | "특" | "중" | "하";

export interface PredictableCrop {
  id: string;
  name: string;
  categoryName: string;
  varietyName: string;
  emoji: string;
  marketId: string;
  marketName: string;
  unit: string;
  isPredictable: true;
  predictionStatus: "available";
}

export interface PredictionPoint {
  date: string;
  label: string;
  actualPrice?: number;
  predictedPrice?: number;
  optimisticPrice?: number;
  pessimisticPrice?: number;
  volume?: number;
  isToday?: boolean;
  isRecommendedDate?: boolean;
  isInflection?: boolean;
}

export interface PredictionInsight {
  viewpoint: PredictionViewpoint;
  recommendationTitle: string;
  recommendationDate: string;
  expectedPrice: number;
  expectedDiffPrice: number;
  expectedDiffRate: number;
  summary: string;
  ctaLabel: string;
}

export type PredictionFactorType = "positive" | "negative" | "warning";

export interface PredictionFactor {
  type: PredictionFactorType;
  title: string;
  description: string;
}

export interface PricePrediction {
  cropId: string;
  cropName: string;
  varietyName: string;
  emoji: string;
  marketId: string;
  marketName: string;
  unit: string;
  currentPrice: number;
  currentDate: string;
  previousChangePrice: number;
  previousChangeRate: number;
  predictionRangeDays: PredictionRangeDays;
  confidenceScore: number;
  predictedPoints: PredictionPoint[];
  farmerInsight: PredictionInsight;
  wholesalerInsight: PredictionInsight;
  factors: PredictionFactor[];
  updatedAt: string;
  grade: PredictionGrade;
  gradeAvailable: boolean;
}
