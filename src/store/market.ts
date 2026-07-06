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
  // ISO date string (yyyy-mm-dd). Default = most recent trading day.
  date: string;
  dateLabel: string; // human label e.g. "7월 5일 (토) · 최근 거래일"
  categoryId: string; // 부류 id (fruit / fruit-veg / vegetable ...)
  categoryLabel: string;
  itemId: string;
  itemLabel: string;
  varietyId: string;
  varietyLabel: string;
  marketId: string;
  marketLabel: string;
  unit: string; // e.g. "8kg 기준"
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
  setUnit: (u: string) => void;
  setSimpleMode: (v: boolean) => void;
};

export const useMarketFilter = create<MarketFilterState>()(
  persist(
    (set) => ({
      date: "2025-07-05",
      dateLabel: "7월 5일 (토) · 최근 거래일",
      categoryId: "fruit-veg",
      categoryLabel: "과채류",
      itemId: "eggplant",
      itemLabel: "가지",
      varietyId: "eggplant-normal",
      varietyLabel: "가지(일반)",
      marketId: "seoul-garak",
      marketLabel: "서울가락",
      unit: "8kg 기준",
      simpleMode: true,
      setDate: (date, dateLabel) => set({ date, dateLabel }),
      setItem: (p) => set(p),
      setMarket: (marketId, marketLabel) => set({ marketId, marketLabel }),
      setUnit: (unit) => set({ unit }),
      setSimpleMode: (simpleMode) => set({ simpleMode }),
    }),
    {
      name: "agdict:viewMode",
      // Persist only what needs to survive reloads; ok to persist all.
    },
  ),
);
