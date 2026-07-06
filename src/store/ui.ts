import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Category } from "@/lib/mock/crops";

type State = {
  category: "all" | Category;
  setCategory: (c: "all" | Category) => void;
  period: "1w" | "1m" | "1y" | "3y";
  setPeriod: (p: "1w" | "1m" | "1y" | "3y") => void;
};

export const useUi = create<State>()(
  persist(
    (set) => ({
      category: "all",
      setCategory: (category) => set({ category }),
      period: "1m",
      setPeriod: (period) => set({ period }),
    }),
    { name: "agdict:ui" },
  ),
);
