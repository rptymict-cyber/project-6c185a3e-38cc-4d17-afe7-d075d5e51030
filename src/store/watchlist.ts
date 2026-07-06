import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  crops: string[];
  markets: string[];
  toggleCrop: (id: string) => boolean; // returns new state (true = added)
  toggleMarket: (id: string) => boolean;
  removeCrop: (id: string) => void;
  removeMarket: (id: string) => void;
  setCropOrder: (ids: string[]) => void;
  setMarketOrder: (ids: string[]) => void;
};

export const useWatchlist = create<State>()(
  persist(
    (set, get) => ({
      crops: [],
      markets: [],
      toggleCrop: (id) => {
        const has = get().crops.includes(id);
        set({ crops: has ? get().crops.filter((c) => c !== id) : [...get().crops, id] });
        return !has;
      },
      toggleMarket: (id) => {
        const has = get().markets.includes(id);
        set({ markets: has ? get().markets.filter((c) => c !== id) : [...get().markets, id] });
        return !has;
      },
      removeCrop: (id) => set({ crops: get().crops.filter((c) => c !== id) }),
      removeMarket: (id) => set({ markets: get().markets.filter((c) => c !== id) }),
      setCropOrder: (ids) => set({ crops: ids }),
      setMarketOrder: (ids) => set({ markets: ids }),
    }),
    { name: "agdict:watchlist" },
  ),
);
