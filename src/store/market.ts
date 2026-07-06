import { create } from "zustand";

export type MarketSegment = "items" | "markets";
export type MarketSortKey = "volume" | "change" | "name";

type State = {
  segment: MarketSegment;
  category: string; // "all" | ItemCategory
  sort: MarketSortKey;
  setSegment: (s: MarketSegment) => void;
  setCategory: (c: string) => void;
  setSort: (s: MarketSortKey) => void;
};

export const useMarketStore = create<State>((set) => ({
  segment: "items",
  category: "all",
  sort: "volume",
  setSegment: (segment) => set({ segment }),
  setCategory: (category) => set({ category }),
  setSort: (sort) => set({ sort }),
}));

export const SORT_LABEL: Record<MarketSortKey, string> = {
  volume: "거래량순",
  change: "등락률순",
  name: "가나다순",
};
