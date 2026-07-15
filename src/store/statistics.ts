import { create } from "zustand";
import type { CropId, Period } from "@/lib/mock/statistics-mock";

export type StatsTab = "trend" | "snapshot";

interface StatsState {
  crop: CropId;
  markets: string[]; // "전국" or individual market ids
  period: Period;
  date: string; // YYYY-MM-DD
  tab: StatsTab;
  setCrop: (c: CropId) => void;
  setMarkets: (m: string[]) => void;
  setPeriod: (p: Period) => void;
  setDate: (d: string) => void;
  setTab: (t: StatsTab) => void;
}

export const useStatistics = create<StatsState>((set) => ({
  crop: "apple",
  markets: ["전국"],
  period: "1주",
  date: "2026-07-06",
  tab: "trend",
  setCrop: (crop) => set({ crop }),
  setMarkets: (markets) => set({ markets: markets.length ? markets : ["전국"] }),
  setPeriod: (period) => set({ period }),
  setDate: (date) => set({ date }),
  setTab: (tab) => set({ tab }),
}));
