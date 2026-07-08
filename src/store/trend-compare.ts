import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Market comparison selection for the /statistics/$variety trend tab.
 * "all" is a synthetic entry meaning 전국 (all markets averaged) and always
 * stays present; user selections are appended after it, capped at 5 total.
 */
export const MAX_COMPARE = 5;

type State = {
  compareIds: string[];
  yearMode: boolean;
  addCompare: (id: string) => boolean; // true = added
  removeCompare: (id: string) => void;
  toggleCompare: (id: string) => "added" | "removed" | "limit";
  setYearMode: (v: boolean) => void;
  reset: () => void;
};

const DEFAULT_COMPARE = ["all", "seoul-garak", "seoul-gangseo"];

export const useTrendCompare = create<State>()(
  persist(
    (set, get) => ({
      compareIds: DEFAULT_COMPARE,
      yearMode: false,
      addCompare: (id) => {
        const ids = get().compareIds;
        if (ids.includes(id)) return false;
        if (ids.length >= MAX_COMPARE) return false;
        set({ compareIds: [...ids, id] });
        return true;
      },
      removeCompare: (id) => {
        if (id === "all") return; // 전국 is not removable
        set({ compareIds: get().compareIds.filter((x) => x !== id) });
      },
      toggleCompare: (id) => {
        const ids = get().compareIds;
        if (ids.includes(id)) {
          if (id === "all") return "removed"; // no-op guard
          set({ compareIds: ids.filter((x) => x !== id) });
          return "removed";
        }
        if (ids.length >= MAX_COMPARE) return "limit";
        set({ compareIds: [...ids, id] });
        return "added";
      },
      setYearMode: (yearMode) => set({ yearMode }),
      reset: () => set({ compareIds: DEFAULT_COMPARE, yearMode: false }),
    }),
    { name: "agdict:trend-compare", version: 2 },
  ),
);
