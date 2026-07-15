import { useMemo } from "react";
import { buildMockPrediction, isPredictableCropId } from "./mockPredictionData";
import type {
  PredictionGrade,
  PredictionRangeDays,
  PricePrediction,
} from "./types";

export interface FetchPredictionParams {
  cropId: string;
  marketId?: string;
  unit?: string;
  rangeDays: PredictionRangeDays;
  grade?: PredictionGrade;
}

export async function fetchPricePrediction(
  params: FetchPredictionParams,
): Promise<PricePrediction | null> {
  if (!isPredictableCropId(params.cropId)) return null;
  return buildMockPrediction(
    params.cropId,
    params.rangeDays,
    params.grade ?? "특",
  );
}

export function usePrediction(
  cropId: string,
  rangeDays: PredictionRangeDays,
  grade: PredictionGrade = "특",
) {
  return useMemo(() => {
    if (!isPredictableCropId(cropId)) return null;
    return buildMockPrediction(cropId, rangeDays, grade);
  }, [cropId, rangeDays, grade]);
}
