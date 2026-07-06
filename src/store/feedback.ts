import { create } from "zustand";
import { persist } from "zustand/middleware";

export type FeedbackItem = {
  id: string;
  rating: number;
  text: string;
  createdAt: string;
};

type State = {
  items: FeedbackItem[];
  add: (rating: number, text: string) => void;
};

export const useFeedback = create<State>()(
  persist(
    (set, get) => ({
      items: [
        {
          id: "seed-1",
          rating: 5,
          text: "그래프가 한눈에 들어와서 아침에 시세 확인하기 편해요.",
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
        {
          id: "seed-2",
          rating: 4,
          text: "즐겨찾기 순서 바꾸는 기능이 있으면 좋겠습니다.",
          createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
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
    { name: "agdict:feedback" },
  ),
);
