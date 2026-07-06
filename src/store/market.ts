import { create } from "zustand";
import { persist } from "zustand/middleware";

export type MarketSegment = "items" | "markets";
export type MarketSortKey = "volume" | "change" | "name";

// Legacy state kept for other pages that still import useMarketStore.
type LegacyState = {
  segment: MarketSegment;
  category: string;
  sort: MarketSortKey;
  setSegment: (s: MarketSegment) => void;
  setCategory: (c: string) => void;
  setSort: (s: MarketSortKey) => void;
};

export const useMarketStore = create<LegacyState>((set) => ({
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

// ---------------------------------------------------------------------------
// New filter store used by /market top area.
// ---------------------------------------------------------------------------

export type MarketFilterState = {
  date: string;
  dateLabel: string;
  categoryId: string;
  categoryLabel: string;
  itemId: string;
  itemLabel: string;
  varietyId: string;
  varietyLabel: string;
  marketId: string;
  marketLabel: string;
  corpId: string;
  corpLabel: string;
  unit: string;
  simpleMode: boolean;
  setDate: (iso: string, label: string) => void;
  setItem: (p: {
    categoryId: string;
    categoryLabel: string;
    itemId: string;
    itemLabel: string;
    varietyId: string;
    varietyLabel: string;
  }) => void;
  setMarket: (id: string, label: string) => void;
  setCorp: (id: string, label: string) => void;
  setUnit: (u: string) => void;
  setSimpleMode: (v: boolean) => void;
  toggleSimpleMode: () => void;
};

export const useMarketFilter = create<MarketFilterState>()(
  persist(
    (set) => ({
      date: "2025-07-05",
      dateLabel: "7/5 (토) · 최근 거래일",
      categoryId: "fruit-veg",
      categoryLabel: "과채류",
      itemId: "tomato",
      itemLabel: "토마토",
      varietyId: "tomato-cherry",
      varietyLabel: "방울토마토",
      marketId: "seoul-garak",
      marketLabel: "서울가락",
      corpId: "all",
      corpLabel: "전체",
      unit: "8kg 기준",
      simpleMode: true,
      setDate: (date, dateLabel) => set({ date, dateLabel }),
      setItem: (p) => set(p),
      setMarket: (marketId, marketLabel) =>
        set({ marketId, marketLabel, corpId: "all", corpLabel: "전체" }),
      setCorp: (corpId, corpLabel) => set({ corpId, corpLabel }),
      setUnit: (unit) => set({ unit }),
      setSimpleMode: (simpleMode) => set({ simpleMode }),
      toggleSimpleMode: () => set((s) => ({ simpleMode: !s.simpleMode })),
    }),
    {
      name: "agdict:viewMode",
      // Persist only what needs to survive reloads; ok to persist all.
    },
  ),
);
