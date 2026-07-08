import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PredictionRangeDays, PredictionViewpoint } from "./types";
import { isPredictableCropId, PREDICTABLE_CROPS } from "./mockPredictionData";

interface PredictionViewState {
  selectedCropId: string;
  selectedViewpoint: PredictionViewpoint;
  selectedRangeDays: PredictionRangeDays;
  setSelectedCropId: (id: string) => void;
  setSelectedViewpoint: (v: PredictionViewpoint) => void;
  setSelectedRangeDays: (d: PredictionRangeDays) => void;
}

const DEFAULT_CROP_ID = PREDICTABLE_CROPS[0].id; // 사과

export const usePredictionView = create<PredictionViewState>()(
  persist(
    (set) => ({
      selectedCropId: DEFAULT_CROP_ID,
      selectedViewpoint: "farmer",
      selectedRangeDays: 7,
      setSelectedCropId: (id) =>
        set({ selectedCropId: isPredictableCropId(id) ? id : DEFAULT_CROP_ID }),
      setSelectedViewpoint: (v) => set({ selectedViewpoint: v }),
      setSelectedRangeDays: (d) => set({ selectedRangeDays: d }),
    }),
    {
      name: "agdict:aiPricePrediction",
      version: 1,
      // 저장된 작물이 예측 가능 목록에서 빠지면 fallback
      onRehydrateStorage: () => (state) => {
        if (state && !isPredictableCropId(state.selectedCropId)) {
          state.selectedCropId = DEFAULT_CROP_ID;
        }
      },
    },
  ),
);
