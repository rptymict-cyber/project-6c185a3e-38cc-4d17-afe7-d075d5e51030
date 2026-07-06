import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  ids: string[];
  selectedId: string | null;
  add: (id: string) => void;
  remove: (id: string) => void;
  toggle: (id: string) => boolean; // true = added
  select: (id: string | null) => void;
  has: (id: string) => boolean;
};

export const useInterests = create<State>()(
  persist(
    (set, get) => ({
      ids: ["apple", "cabbage", "onion"],
      selectedId: "apple",
      add: (id) => {
        if (get().ids.includes(id)) return;
        set({ ids: [...get().ids, id], selectedId: get().selectedId ?? id });
      },
      remove: (id) => {
        const next = get().ids.filter((x) => x !== id);
        set({
          ids: next,
          selectedId: get().selectedId === id ? (next[0] ?? null) : get().selectedId,
        });
      },
      toggle: (id) => {
        const has = get().ids.includes(id);
        if (has) get().remove(id);
        else get().add(id);
        return !has;
      },
      select: (id) => set({ selectedId: id }),
      has: (id) => get().ids.includes(id),
    }),
    { name: "agdict:interests" },
  ),
);
