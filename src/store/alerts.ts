import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PriceAlerts = {
  target: boolean; // 목표가 도달
  swing: boolean; // 급등락
  auctionStart: boolean; // 경매 시작
};

type State = {
  // keyed by `${varietyId}|${marketId}`
  byKey: Record<string, PriceAlerts>;
  getFor: (varietyId: string, marketId: string) => PriceAlerts;
  setFor: (varietyId: string, marketId: string, patch: Partial<PriceAlerts>) => void;
  hasAnyFor: (varietyId: string, marketId: string) => boolean;
};

const DEFAULT: PriceAlerts = { target: false, swing: false, auctionStart: false };

export const useAlerts = create<State>()(
  persist(
    (set, get) => ({
      byKey: {},
      getFor: (v, m) => get().byKey[`${v}|${m}`] ?? DEFAULT,
      setFor: (v, m, patch) =>
        set((s) => {
          const key = `${v}|${m}`;
          return { byKey: { ...s.byKey, [key]: { ...(s.byKey[key] ?? DEFAULT), ...patch } } };
        }),
      hasAnyFor: (v, m) => {
        const a = get().byKey[`${v}|${m}`];
        return !!a && (a.target || a.swing || a.auctionStart);
      },
    }),
    { name: "agdict:alerts" },
  ),
);
