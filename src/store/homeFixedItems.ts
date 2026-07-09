// 홈에 고정할 도매시장/품목 목록. 사용자가 추가/삭제/재구성 가능.
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const HOME_FIXED_MAX = 6;

type State = {
  markets: string[]; // market id list
  items: string[]; // item id list
};

type Actions = {
  setMarkets: (ids: string[]) => void;
  addMarket: (id: string) => void;
  removeMarket: (id: string) => void;
  setItems: (ids: string[]) => void;
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
};

const DEFAULT_MARKETS = ["seoul-garak", "seoul-gangseo", "daegu-bugbu", "busan-eomgung"];
const DEFAULT_ITEMS = ["cabbage", "radish", "onion", "garlic", "apple", "pear"];

export const useHomeFixed = create<State & Actions>()(
  persist(
    (set) => ({
      markets: DEFAULT_MARKETS,
      items: DEFAULT_ITEMS,
      setMarkets: (ids) => set({ markets: ids.slice(0, HOME_FIXED_MAX) }),
      addMarket: (id) =>
        set((s) =>
          s.markets.includes(id) || s.markets.length >= HOME_FIXED_MAX
            ? s
            : { markets: [...s.markets, id] },
        ),
      removeMarket: (id) => set((s) => ({ markets: s.markets.filter((x) => x !== id) })),
      setItems: (ids) => set({ items: ids.slice(0, HOME_FIXED_MAX) }),
      addItem: (id) =>
        set((s) =>
          s.items.includes(id) || s.items.length >= HOME_FIXED_MAX
            ? s
            : { items: [...s.items, id] },
        ),
      removeItem: (id) => set((s) => ({ items: s.items.filter((x) => x !== id) })),
    }),
    {
      name: "agdict:homeFixed",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
);
