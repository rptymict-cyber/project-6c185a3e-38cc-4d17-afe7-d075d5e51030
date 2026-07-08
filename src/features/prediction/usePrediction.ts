import { useMemo } from "react";
import { buildMockPrediction, isPredictableCropId } from "./mockPredictionData";
import type { PredictionRangeDays, PricePrediction } from "./types";

export interface FetchPredictionParams {
  cropId: string;
  marketId?: string;
  unit?: string;
  rangeDays: PredictionRangeDays;
}

/**
 * 나중에 실제 API로 교체 지점. 지금은 mock 반환.
 */
export async function fetchPricePrediction(
  params: FetchPredictionParams,
): Promise<PricePrediction | null> {
  if (!isPredictableCropId(params.cropId)) return null;
  return buildMockPrediction(params.cropId, params.rangeDays);
}

/**
 * 화면용 hook. mock 단계라 동기적으로 계산해 반환한다.
 * API 전환 시 useQuery 등으로 감싸면 된다.
 */
export function usePrediction(cropId: string, rangeDays: PredictionRangeDays) {
  return useMemo(() => {
    if (!isPredictableCropId(cropId)) return null;
    return buildMockPrediction(cropId, rangeDays);
  }, [cropId, rangeDays]);
}
