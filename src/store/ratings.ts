import { create } from "zustand";
import { persist } from "zustand/middleware";

export type RatingItem = {
  id: string;
  rating: number;
  text: string;
  createdAt: string;
};

type State = {
  items: RatingItem[];
  add: (rating: number, text: string) => void;
};

export const useRatings = create<State>()(
  persist(
    (set, get) => ({
      items: [
        {
          id: "seed-r1",
          rating: 5,
          text: "매일 아침 시세 확인용으로 최고에요!",
          createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        },
        {
          id: "seed-r2",
          rating: 4,
          text: "그래프가 직관적이라 좋아요",
          createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
        },
      ],
      add: (rating, text) =>
        set({
          items: [
            {
              id: crypto.randomUUID(),
              rating,
              text,
              createdAt: new Date().toISOString(),
            },
            ...get().items,
          ],
        }),
    }),
    { name: "agdict:ratings" },
  ),
);
