import { create } from "zustand";
import { persist } from "zustand/middleware";

export type RecentStat = {
  varietyId: string;
  viewedAt: number; // epoch ms
};

type State = {
  items: RecentStat[];
  push: (varietyId: string) => void;
  clear: () => void;
};

const MAX = 10;

export const useRecentStats = create<State>()(
  persist(
    (set, get) => ({
      items: [],
      push: (varietyId) => {
        const rest = get().items.filter((r) => r.varietyId !== varietyId);
        set({ items: [{ varietyId, viewedAt: Date.now() }, ...rest].slice(0, MAX) });
      },
      clear: () => set({ items: [] }),
    }),
    { name: "agdict.recent-stats.v1" },
  ),
);
