import { create } from "zustand";
import { persist } from "zustand/middleware";
import { todayIso } from "@/lib/date";


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

export type ProTab = "chart" | "auctions" | "compare" | "company" | "origin" | "variety";
export type SimpleViewMode = "table" | "list";

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
  simpleViewMode: SimpleViewMode;
  proTab: ProTab;
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
  setSimpleViewMode: (v: SimpleViewMode) => void;
  setProTab: (t: ProTab) => void;
};

const WEEKDAY = ["일", "월", "화", "수", "목", "금", "토"];
function todayLabel(): string {

  const d = new Date();
  return `${d.getMonth() + 1}/${d.getDate()} (${WEEKDAY[d.getDay()]}) · 오늘`;
}

export const useMarketFilter = create<MarketFilterState>()(
  persist(
    (set) => ({
      date: todayIso(),
      dateLabel: todayLabel(),
      categoryId: "06",
      categoryLabel: "과실류",
      itemId: "0601",
      itemLabel: "사과",
      varietyId: "0601:ALL",
      varietyLabel: "전체 품종",
      marketId: "all",
      marketLabel: "전체",
      corpId: "all",
      corpLabel: "전체",
      unit: "10kg 기준",
      simpleMode: false,
      simpleViewMode: "table",
      proTab: "chart",
      setDate: (date, dateLabel) => set({ date, dateLabel }),
      setItem: (p) => set(p),
      setMarket: (marketId, marketLabel) =>
        set({ marketId, marketLabel, corpId: "all", corpLabel: "전체" }),
      setCorp: (corpId, corpLabel) => set({ corpId, corpLabel }),
      setUnit: (unit) => set({ unit }),
      setSimpleMode: (simpleMode) => set({ simpleMode }),
      toggleSimpleMode: () => set((s) => ({ simpleMode: !s.simpleMode })),
      setSimpleViewMode: (simpleViewMode) => set({ simpleViewMode }),
      setProTab: (proTab) => set({ proTab }),
    }),
    {
      // Bumped name to reset persisted filter after default overhaul (task 4).
      name: "agdict:marketFilter:v2",
      // Do not persist date so every session opens on today.
      partialize: (s) => {
        const { date: _d, dateLabel: _dl, ...rest } = s;
        void _d;
        void _dl;
        return rest;
      },
    },

  ),
);

