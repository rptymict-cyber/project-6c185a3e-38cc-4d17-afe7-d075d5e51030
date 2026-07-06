import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SavedQuery = {
  id: string;
  cropId: string; // linked to CROPS for emoji fallback
  emoji: string;
  category: string; // 부류 label, e.g. "가지"
  varietyName: string; // 품종, e.g. "가지(일반)"
  marketId: string;
  marketName: string; // "서울가락"
  corporation: string; // "서울청과(주)"
  origin: string; // "경기 이천시"
  unitLabel: string; // "8kg"
  price: number;
  perKg: number;
  changePct: number;
  lastAuctionAt: string; // "2026.07.05 23:15"
  updatedAt: number; // epoch ms
  hasAlert: boolean;
  aiReady: boolean;
};

const now = Date.now();

const SEED: SavedQuery[] = [
  {
    id: "q-eggplant",
    cropId: "chili",
    emoji: "🍆",
    category: "가지",
    varietyName: "가지(일반)",
    marketId: "seoul-garak",
    marketName: "서울가락",
    corporation: "서울청과(주)",
    origin: "경기 이천시",
    unitLabel: "8kg",
    price: 6500,
    perKg: 812,
    changePct: 5.4,
    lastAuctionAt: "2026.07.05 23:15",
    updatedAt: now - 60_000,
    hasAlert: true,
    aiReady: true,
  },
  {
    id: "q-mandarin",
    cropId: "grape",
    emoji: "🍊",
    category: "감귤",
    varietyName: "하우스감귤",
    marketId: "seoul-garak",
    marketName: "제주 서귀포시",
    corporation: "서귀포농협",
    origin: "제주 서귀포시",
    unitLabel: "3kg",
    price: 9800,
    perKg: 3267,
    changePct: -1.2,
    lastAuctionAt: "2026.07.05 23:40",
    updatedAt: now - 3 * 60_000,
    hasAlert: true,
    aiReady: true,
  },
  {
    id: "q-tomato",
    cropId: "apple",
    emoji: "🍅",
    category: "토마토",
    varietyName: "토마토(일반)",
    marketId: "seoul-garak",
    marketName: "서울가락",
    corporation: "동화청과(주)",
    origin: "충남 논산시",
    unitLabel: "5kg",
    price: 12300,
    perKg: 2460,
    changePct: 3.1,
    lastAuctionAt: "2026.07.05 21:30",
    updatedAt: now - 5 * 60_000,
    hasAlert: false,
    aiReady: true,
  },
  {
    id: "q-daepa",
    cropId: "lettuce",
    emoji: "🌱",
    category: "대파",
    varietyName: "대파(일반)",
    marketId: "busan-eomgung",
    marketName: "부산엄궁",
    corporation: "대아청과(주)",
    origin: "경남 진주시",
    unitLabel: "1kg",
    price: 2150,
    perKg: 2150,
    changePct: -0.6,
    lastAuctionAt: "2026.07.05 20:55",
    updatedAt: now - 7 * 60_000,
    hasAlert: false,
    aiReady: false,
  },
];

type State = {
  items: SavedQuery[];
  hydrated: boolean;
  remove: (id: string) => void;
  removeMany: (ids: string[]) => void;
  reorder: (ids: string[]) => void;
  refresh: (id: string) => void;
  seedIfEmpty: () => void;
};

export const useSavedQueries = create<State>()(
  persist(
    (set, get) => ({
      items: SEED,
      hydrated: false,
      remove: (id) => set({ items: get().items.filter((q) => q.id !== id) }),
      removeMany: (ids) => {
        const s = new Set(ids);
        set({ items: get().items.filter((q) => !s.has(q.id)) });
      },
      reorder: (ids) => {
        const map = new Map(get().items.map((q) => [q.id, q]));
        const next: SavedQuery[] = [];
        ids.forEach((id) => {
          const it = map.get(id);
          if (it) next.push(it);
        });
        // append any not in list
        get().items.forEach((q) => {
          if (!ids.includes(q.id)) next.push(q);
        });
        set({ items: next });
      },
      refresh: (id) =>
        set({
          items: get().items.map((q) =>
            q.id === id ? { ...q, updatedAt: Date.now() } : q,
          ),
        }),
      seedIfEmpty: () => {
        if (get().items.length === 0) set({ items: SEED });
      },
    }),
    { name: "agdict:saved-queries:v1" },
  ),
);

export function timeAgo(ts: number): string {
  const diff = Math.max(0, Date.now() - ts);
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "방금 전";
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  const d = Math.floor(h / 24);
  return `${d}일 전`;
}
