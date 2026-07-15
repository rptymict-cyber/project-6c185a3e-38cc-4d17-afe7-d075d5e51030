import { create } from "zustand";
import type { CropId } from "@/lib/mock/statistics-mock";

export type PeriodMode = "day" | "month" | "year";

interface StatsState {
  crop: CropId;
  markets: string[]; // "전국" or individual market ids (multi)
  period: PeriodMode;
  setCrop: (c: CropId) => void;
  setMarkets: (m: string[]) => void;
  setPeriod: (p: PeriodMode) => void;
}

export const useStatistics = create<StatsState>((set) => ({
  crop: "cabbage",
  markets: ["전국"],
  period: "day",
  setCrop: (crop) => set({ crop }),
  setMarkets: (markets) => set({ markets: markets.length ? markets : ["전국"] }),
  setPeriod: (period) => set({ period }),
}));
