import { create } from "zustand";
import { persist } from "zustand/middleware";

export type FeedbackKind = "sentiment" | "rating" | "message";

export type FeedbackItem = {
  id: string;
  kind: FeedbackKind;
  /** 1~5 감정 등급 (매우나쁨=1 … 매우만족=5). message-only 항목은 null. */
  rating: number | null;
  /** 선택한 칩 코드/라벨 목록 */
  tags: string[];
  /** 자유입력 텍스트 */
  text: string;
  createdAt: string;
};

type State = {
  items: FeedbackItem[];
  add: (input: {
    kind?: FeedbackKind;
    rating: number | null;
    tags?: string[];
    text?: string;
  }) => void;
};

export const useFeedback = create<State>()(
  persist(
    (set, get) => ({
      items: [
        {
          id: "seed-1",
          kind: "sentiment",
          rating: 5,
          tags: ["시세가 정확해요"],
          text: "그래프가 한눈에 들어와서 아침에 시세 확인하기 편해요.",
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
        {
          id: "seed-2",
          kind: "sentiment",
          rating: 4,
          tags: [],
          text: "즐겨찾기 순서 바꾸는 기능이 있으면 좋겠습니다.",
          createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        },
      ],
      add: ({ kind = "sentiment", rating, tags = [], text = "" }) =>
        set({
          items: [
            {
              id: crypto.randomUUID(),
              kind,
              rating,
              tags,
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
