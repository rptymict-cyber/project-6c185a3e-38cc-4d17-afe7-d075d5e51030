import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PredictionRangeDays, PredictionViewpoint } from "./types";
import { isPredictableCropId, PREDICTABLE_CROPS } from "./mockPredictionData";
import {
  clampQuantity,
  QUANTITY_UNIT_DEFAULT,
  type QuantityUnit,
} from "./quantityUnits";

interface PredictionViewState {
  selectedCropId: string;
  selectedViewpoint: PredictionViewpoint;
  selectedRangeDays: PredictionRangeDays;
  quantityBoxes: number; // 현재 선택 단위 기준 수량 (필드명은 호환용)
  quantityUnit: QuantityUnit;
  marketId: string;
  setSelectedCropId: (id: string) => void;
  setSelectedViewpoint: (v: PredictionViewpoint) => void;
  setSelectedRangeDays: (d: PredictionRangeDays) => void;
  setQuantityBoxes: (n: number) => void;
  setQuantity: (value: number, unit: QuantityUnit) => void;
  setQuantityUnit: (u: QuantityUnit) => void;
  setMarketId: (id: string) => void;
}

const DEFAULT_CROP_ID = PREDICTABLE_CROPS[0].id; // 사과
const DEFAULT_UNIT: QuantityUnit = "kg";
const DEFAULT_QTY = QUANTITY_UNIT_DEFAULT[DEFAULT_UNIT];

export const usePredictionView = create<PredictionViewState>()(
  persist(
    (set, get) => ({
      selectedCropId: DEFAULT_CROP_ID,
      selectedViewpoint: "farmer",
      selectedRangeDays: 7,
      quantityBoxes: DEFAULT_QTY,
      quantityUnit: DEFAULT_UNIT,
      marketId: "seoul-garak",
      setSelectedCropId: (id) =>
        set({ selectedCropId: isPredictableCropId(id) ? id : DEFAULT_CROP_ID }),
      setSelectedViewpoint: (v) => set({ selectedViewpoint: v }),
      setSelectedRangeDays: (d) => set({ selectedRangeDays: d }),
      setQuantityBoxes: (n) => {
        const unit = get().quantityUnit;
        set({ quantityBoxes: clampQuantity(n, unit) });
      },
      setQuantity: (value, unit) =>
        set({ quantityUnit: unit, quantityBoxes: clampQuantity(value, unit) }),
      setQuantityUnit: (u) =>
        set({ quantityUnit: u, quantityBoxes: QUANTITY_UNIT_DEFAULT[u] }),
      setMarketId: (id) => set({ marketId: id }),
    }),
    {
      name: "agdict:aiPricePrediction",
      version: 3,
      migrate: (persisted: any, fromVersion) => {
        if (!persisted) return persisted;
        // v2 이하: 단위 개념 없음 → 상자로 간주
        if (fromVersion < 3) {
          persisted.quantityUnit = "box";
        }
        return persisted;
      },
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        if (!isPredictableCropId(state.selectedCropId)) {
          state.selectedCropId = DEFAULT_CROP_ID;
        }
        if (!state.quantityUnit) state.quantityUnit = DEFAULT_UNIT;
        if (!state.quantityBoxes || state.quantityBoxes < 1) {
          state.quantityBoxes = QUANTITY_UNIT_DEFAULT[state.quantityUnit];
        }
        if (!state.marketId) state.marketId = "seoul-garak";
      },
    },
  ),
);
