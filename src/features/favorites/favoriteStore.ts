import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FavoriteCondition, FavoritePriceItem } from "./types";
import { favoriteKey } from "./favoriteKey";

type State = {
  items: FavoritePriceItem[];
  addFavorite: (
    item: Omit<FavoritePriceItem, "id" | "createdAt"> & { createdAt?: string },
  ) => void;
  removeFavorite: (key: string) => void;
  toggleFavorite: (
    item: Omit<FavoritePriceItem, "id" | "createdAt"> & { createdAt?: string },
  ) => boolean; // true = added
  isFavorite: (c: FavoriteCondition) => boolean;
  getFavorites: () => FavoritePriceItem[];
  /** 사용자가 지정한 수동 순서. ids 배열 순서대로 order 값을 부여. */
  setOrder: (ids: string[]) => void;
};

function nextOrderValue(items: FavoritePriceItem[]): number {
  // 새 항목은 목록의 맨 앞(최근 등록)이 오도록 최소 order - 1 을 부여.
  const orders = items
    .map((it) => it.order)
    .filter((o): o is number => typeof o === "number");
  if (orders.length === 0) return 0;
  return Math.min(...orders) - 1;
}

export const useFavoritePriceStore = create<State>()(
  persist(
    (set, get) => ({
      items: [],
      addFavorite: (raw) => {
        const key = favoriteKey(raw);
        const now = raw.createdAt ?? new Date().toISOString();
        const existing = get().items.find((it) => it.id === key);
        if (existing) {
          set({
            items: get().items.map((it) =>
              it.id === key
                ? { ...it, ...raw, id: key, createdAt: existing.createdAt, order: existing.order }
                : it,
            ),
          });
        } else {
          const order = nextOrderValue(get().items);
          set({
            items: [...get().items, { ...raw, id: key, createdAt: now, order }],
          });
        }
      },
      removeFavorite: (key) =>
        set({ items: get().items.filter((it) => it.id !== key) }),
      toggleFavorite: (raw) => {
        const key = favoriteKey(raw);
        const has = get().items.some((it) => it.id === key);
        if (has) {
          set({ items: get().items.filter((it) => it.id !== key) });
          return false;
        }
        const now = raw.createdAt ?? new Date().toISOString();
        const order = nextOrderValue(get().items);
        set({
          items: [...get().items, { ...raw, id: key, createdAt: now, order }],
        });
        return true;
      },
      isFavorite: (c) => {
        const key = favoriteKey(c);
        return get().items.some((it) => it.id === key);
      },
      getFavorites: () => get().items,
      setOrder: (ids) => {
        const map = new Map(ids.map((id, idx) => [id, idx] as const));
        set({
          items: get().items.map((it) =>
            map.has(it.id) ? { ...it, order: map.get(it.id)! } : it,
          ),
        });
      },
    }),
    { name: "agdict:favoritePriceItems" },
  ),
);
