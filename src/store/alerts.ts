import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ---------- New rule schema ---------- */

export interface PriceAlertRule {
  id: string;
  varietyId: string;
  varietyLabel: string;
  itemLabel: string;
  categoryId: string;
  categoryLabel: string;
  marketId: string;
  marketLabel: string;
  corpId: string;
  corpLabel: string;
  unit: string; // 예: "8kg 기준"
  targetAbove: number | null;
  targetBelow: number | null;
  swingUp: boolean;
  swingDown: boolean;
  swingThreshold: number; // 기본값 5
  volumeSurge: boolean;
  volumeThreshold: number; // 기본값 30
  auctionStart: boolean;
  enabled: boolean; // 마스터 on/off
  order: number;
  createdAt: string;
}

export type PriceAlertRuleInput =
  | (Omit<PriceAlertRule, "id" | "order" | "createdAt"> &
      Partial<Pick<PriceAlertRule, "id" | "order" | "createdAt">>);

/* ---------- Legacy shape (kept for untouched callers) ---------- */

export type PriceAlerts = {
  target: boolean;
  swing: boolean;
  auctionStart: boolean;
};

const LEGACY_DEFAULT: PriceAlerts = {
  target: false,
  swing: false,
  auctionStart: false,
};

/* ---------- Store ---------- */

type State = {
  rules: PriceAlertRule[];
  // legacy keyed store, kept for old files that will be migrated next prompt
  byKey: Record<string, PriceAlerts>;

  // new rule API
  getAll: () => PriceAlertRule[];
  getByKey: (varietyId: string, marketId: string) => PriceAlertRule | undefined;
  upsert: (rule: PriceAlertRuleInput) => PriceAlertRule;
  remove: (id: string) => void;
  setEnabled: (id: string, enabled: boolean) => void;
  reorder: (ids: string[]) => void;
  hasAnyFor: (varietyId: string, marketId: string) => boolean;

  // legacy API (do not use in new code)
  getFor: (varietyId: string, marketId: string) => PriceAlerts;
  setFor: (
    varietyId: string,
    marketId: string,
    patch: Partial<PriceAlerts>,
  ) => void;
};

function genId(): string {
  return `alert_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export const useAlerts = create<State>()(
  persist(
    (set, get) => ({
      rules: [],
      byKey: {},

      getAll: () =>
        [...get().rules].sort((a, b) => a.order - b.order),

      getByKey: (varietyId, marketId) =>
        get().rules.find(
          (r) => r.varietyId === varietyId && r.marketId === marketId,
        ),

      upsert: (input) => {
        const existing =
          input.id != null ? get().rules.find((r) => r.id === input.id) : undefined;
        let next: PriceAlertRule;
        if (existing) {
          next = { ...existing, ...input, id: existing.id };
          set((s) => ({
            rules: s.rules.map((r) => (r.id === existing.id ? next : r)),
          }));
        } else {
          const maxOrder = get().rules.reduce(
            (m, r) => Math.max(m, r.order),
            -1,
          );
          next = {
            ...input,
            id: input.id ?? genId(),
            order: input.order ?? maxOrder + 1,
            createdAt: input.createdAt ?? new Date().toISOString(),
          } as PriceAlertRule;
          set((s) => ({ rules: [...s.rules, next] }));
        }
        return next;
      },

      remove: (id) =>
        set((s) => ({ rules: s.rules.filter((r) => r.id !== id) })),

      setEnabled: (id, enabled) =>
        set((s) => ({
          rules: s.rules.map((r) => (r.id === id ? { ...r, enabled } : r)),
        })),

      reorder: (ids) =>
        set((s) => {
          const orderMap = new Map(ids.map((id, i) => [id, i]));
          return {
            rules: s.rules.map((r) =>
              orderMap.has(r.id) ? { ...r, order: orderMap.get(r.id)! } : r,
            ),
          };
        }),

      hasAnyFor: (v, m) => {
        // new rules
        const rule = get().rules.find(
          (r) => r.varietyId === v && r.marketId === m && r.enabled,
        );
        if (rule) return true;
        // legacy fallback
        const a = get().byKey[`${v}|${m}`];
        return !!a && (a.target || a.swing || a.auctionStart);
      },

      /* --- legacy --- */
      getFor: (v, m) => get().byKey[`${v}|${m}`] ?? LEGACY_DEFAULT,
      setFor: (v, m, patch) =>
        set((s) => {
          const key = `${v}|${m}`;
          return {
            byKey: {
              ...s.byKey,
              [key]: { ...(s.byKey[key] ?? LEGACY_DEFAULT), ...patch },
            },
          };
        }),
    }),
    {
      name: "agdict:alerts",
      partialize: (s) => ({ rules: s.rules, byKey: s.byKey }),
    },
  ),
);
