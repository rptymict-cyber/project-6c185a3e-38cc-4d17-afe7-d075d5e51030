import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PredictionRangeDays, PredictionViewpoint } from "./types";
import { isPredictableCropId, PREDICTABLE_CROPS } from "./mockPredictionData";

interface PredictionViewState {
  selectedCropId: string;
  selectedViewpoint: PredictionViewpoint;
  selectedRangeDays: PredictionRangeDays;
  quantityBoxes: number;
  marketId: string;
  setSelectedCropId: (id: string) => void;
  setSelectedViewpoint: (v: PredictionViewpoint) => void;
  setSelectedRangeDays: (d: PredictionRangeDays) => void;
  setQuantityBoxes: (n: number) => void;
  setMarketId: (id: string) => void;
}

const DEFAULT_CROP_ID = PREDICTABLE_CROPS[0].id; // 사과

export const usePredictionView = create<PredictionViewState>()(
  persist(
    (set) => ({
      selectedCropId: DEFAULT_CROP_ID,
      selectedViewpoint: "farmer",
      selectedRangeDays: 7,
      quantityBoxes: 15,
      marketId: "seoul-garak",
      setSelectedCropId: (id) =>
        set({ selectedCropId: isPredictableCropId(id) ? id : DEFAULT_CROP_ID }),
      setSelectedViewpoint: (v) => set({ selectedViewpoint: v }),
      setSelectedRangeDays: (d) => set({ selectedRangeDays: d }),
      setQuantityBoxes: (n) =>
        set({ quantityBoxes: Math.max(1, Math.min(9999, Math.round(n))) }),
      setMarketId: (id) => set({ marketId: id }),
    }),
    {
      name: "agdict:aiPricePrediction",
      version: 2,
      onRehydrateStorage: () => (state) => {
        if (state && !isPredictableCropId(state.selectedCropId)) {
          state.selectedCropId = DEFAULT_CROP_ID;
        }
        if (state && (!state.quantityBoxes || state.quantityBoxes < 1)) {
          state.quantityBoxes = 15;
        }
        if (state && !state.marketId) {
          state.marketId = "seoul-garak";
        }
      },
    },
  ),
);
