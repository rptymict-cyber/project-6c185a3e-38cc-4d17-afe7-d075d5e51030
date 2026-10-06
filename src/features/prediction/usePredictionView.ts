import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  PredictionGrade,
  PredictionRangeDays,
  PredictionViewpoint,
} from "./types";
import { isPredictableCropId, PREDICTABLE_CROPS } from "./mockPredictionData";
import { MARKETS } from "@/lib/mock/markets";
import {
  clampQuantity,
  convertQuantity,
  QUANTITY_UNIT_DEFAULT,
  type QuantityUnit,
} from "./quantityUnits";

interface PredictionViewState {
  selectedCropId: string;
  selectedViewpoint: PredictionViewpoint;
  selectedRangeDays: PredictionRangeDays;
  selectedGrade: PredictionGrade;
  quantityBoxes: number;
  quantityUnit: QuantityUnit;
  marketId: string;
  setSelectedCropId: (id: string) => void;
  setSelectedViewpoint: (v: PredictionViewpoint) => void;
  setSelectedRangeDays: (d: PredictionRangeDays) => void;
  setSelectedGrade: (g: PredictionGrade) => void;
  setQuantityBoxes: (n: number) => void;
  setQuantity: (value: number, unit: QuantityUnit) => void;
  setQuantityUnit: (u: QuantityUnit) => void;
  setMarketId: (id: string) => void;
  /** 조건 입력 여부 (예측 조건 초기화 시 false) */
  filled: { crop: boolean; market: boolean; quantity: boolean; grade: boolean };
  resetConditions: () => void;
}

const DEFAULT_CROP_ID = PREDICTABLE_CROPS[0].id;
const DEFAULT_UNIT: QuantityUnit = "kg";
const DEFAULT_QTY = QUANTITY_UNIT_DEFAULT[DEFAULT_UNIT];
const DEFAULT_GRADE: PredictionGrade = "특";

export const usePredictionView = create<PredictionViewState>()(
  persist(
    (set, get) => ({
      selectedCropId: DEFAULT_CROP_ID,
      selectedViewpoint: "farmer",
      selectedRangeDays: 7,
      selectedGrade: DEFAULT_GRADE,
      quantityBoxes: DEFAULT_QTY,
      quantityUnit: DEFAULT_UNIT,
      marketId: "seoul-garak",
      filled: { crop: true, market: true, quantity: true, grade: true },
      resetConditions: () =>
        set({
          selectedViewpoint: "farmer",
          filled: { crop: false, market: false, quantity: false, grade: false },
        }),
      setSelectedCropId: (id) =>
        set({
          selectedCropId: isPredictableCropId(id) ? id : DEFAULT_CROP_ID,
          filled: { ...get().filled, crop: true },
        }),
      setSelectedViewpoint: (v) => set({ selectedViewpoint: v }),
      setSelectedRangeDays: (d) => set({ selectedRangeDays: d }),
      setSelectedGrade: (g) =>
        set({ selectedGrade: g, filled: { ...get().filled, grade: true } }),
      setQuantityBoxes: (n) => {
        const unit = get().quantityUnit;
        set({ quantityBoxes: clampQuantity(n, unit) });
      },
      setQuantity: (value, unit) =>
        set({
          quantityUnit: unit,
          quantityBoxes: clampQuantity(value, unit),
          filled: { ...get().filled, quantity: true },
        }),
      setQuantityUnit: (u) => {
        const { quantityUnit, quantityBoxes } = get();
        set({
          quantityUnit: u,
          quantityBoxes: convertQuantity(quantityBoxes, quantityUnit, u),
        });
      },
      setMarketId: (id) =>
        set({ marketId: id, filled: { ...get().filled, market: true } }),
    }),
    {
      name: "agdict:aiPricePrediction",
      version: 4,
      migrate: (persisted: any, fromVersion) => {
        if (!persisted) return persisted;
        if (fromVersion < 3) {
          persisted.quantityUnit = "box";
        }
        if (fromVersion < 4) {
          persisted.selectedGrade = DEFAULT_GRADE;
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
        if (!state.marketId || !MARKETS.some((m) => m.id === state.marketId)) {
          state.marketId = "seoul-garak";
        }
        if (!state.selectedGrade) state.selectedGrade = DEFAULT_GRADE;
        if (!state.filled)
          state.filled = { crop: true, market: true, quantity: true, grade: true };
      },
    },
  ),
);
