import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FavoriteCondition, FavoritePriceItem } from "./types";
import { favoriteKey } from "./favoriteKey";

type State = {
  items: FavoritePriceItem[];
  addFavorite: (item: Omit<FavoritePriceItem, "id" | "createdAt"> & { createdAt?: string }) => void;
  removeFavorite: (key: string) => void;
  toggleFavorite: (
    item: Omit<FavoritePriceItem, "id" | "createdAt"> & { createdAt?: string },
  ) => boolean; // true = added
  isFavorite: (c: FavoriteCondition) => boolean;
  getFavorites: () => FavoritePriceItem[];
};

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
              it.id === key ? { ...it, ...raw, id: key, createdAt: existing.createdAt } : it,
            ),
          });
        } else {
          set({ items: [...get().items, { ...raw, id: key, createdAt: now }] });
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
        set({ items: [...get().items, { ...raw, id: key, createdAt: now }] });
        return true;
      },
      isFavorite: (c) => {
        const key = favoriteKey(c);
        return get().items.some((it) => it.id === key);
      },
      getFavorites: () => get().items,
    }),
    { name: "agdict:favoritePriceItems" },
  ),
);
