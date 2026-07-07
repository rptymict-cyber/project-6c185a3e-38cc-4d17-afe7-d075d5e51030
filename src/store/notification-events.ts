/**
 * 알림 이벤트(피드) 스토어.
 *
 * 규칙(rules)과 이벤트(events)는 분리된 개념이다.
 * 이벤트는 발생 시점의 조건을 스냅샷으로 저장하므로,
 * 원본 규칙이 삭제되어도 이벤트는 그대로 유지된다.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type NotificationKind =
  | "target"
  | "swingUp"
  | "swingDown"
  | "volumeSurge"
  | "auctionStart"
  | "system";

export interface NotificationContext {
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
}

export interface NotificationEvent {
  id: string;
  ruleId?: string;
  kind: NotificationKind;
  title: string;
  body: string;
  context?: NotificationContext;
  createdAt: string;
  read: boolean;
}

export type NotificationEventInput = Omit<
  NotificationEvent,
  "id" | "createdAt" | "read"
> &
  Partial<Pick<NotificationEvent, "id" | "createdAt" | "read">>;

function genId(): string {
  return `evt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/* ---------- Seed data (migrated from previous hardcoded notifications page) ---------- */

const nowIso = () => new Date().toISOString();
const minutesAgo = (m: number) =>
  new Date(Date.now() - m * 60 * 1000).toISOString();

const SEED_EVENTS: NotificationEvent[] = [
  {
    id: "seed_onion_swing",
    kind: "swingUp",
    title: "양파 가격 급등",
    body: "가락시장 기준 전일대비 +12.4% 상승했어요.",
    createdAt: minutesAgo(10),
    read: false,
    context: {
      categoryId: "seasoning",
      categoryLabel: "양념채소",
      itemId: "onion",
      itemLabel: "양파",
      varietyId: "mid",
      varietyLabel: "중만생종",
      marketId: "seoul-garak",
      marketLabel: "서울가락",
      corpId: "seoul-cheongkwa",
      corpLabel: "서울청과",
      unit: "1kg 기준",
    },
  },
  {
    id: "seed_cabbage_swing",
    kind: "swingDown",
    title: "배추 가격 급락",
    body: "주요 도매시장 평균 -8.1% 하락했어요.",
    createdAt: minutesAgo(60),
    read: false,
    context: {
      categoryId: "vegetable",
      categoryLabel: "채소류",
      itemId: "cabbage",
      itemLabel: "배추",
      varietyId: "fall",
      varietyLabel: "가을배추",
      marketId: "seoul-garak",
      marketLabel: "서울가락",
      corpId: "seoul-cheongkwa",
      corpLabel: "서울청과",
      unit: "10kg 기준",
    },
  },
  {
    id: "seed_system_update",
    kind: "system",
    title: "시세 데이터 업데이트",
    body: "2026.07.03 14:30 기준 최신 시세가 반영되었습니다.",
    createdAt: nowIso(),
    read: false,
  },
];

/* ---------- Store ---------- */

interface State {
  events: NotificationEvent[];
  _seeded: boolean;
  getAll: () => NotificationEvent[];
  add: (input: NotificationEventInput) => NotificationEvent;
  markRead: (id: string) => void;
  markAllRead: () => void;
  remove: (id: string) => void;
  unreadCount: () => number;
}

export const useNotificationEvents = create<State>()(
  persist(
    (set, get) => ({
      events: SEED_EVENTS,
      _seeded: true,

      getAll: () =>
        [...get().events].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),

      add: (input) => {
        const event: NotificationEvent = {
          ...input,
          id: input.id ?? genId(),
          createdAt: input.createdAt ?? nowIso(),
          read: input.read ?? false,
        };
        set((s) => ({ events: [event, ...s.events] }));
        return event;
      },

      markRead: (id) =>
        set((s) => ({
          events: s.events.map((e) => (e.id === id ? { ...e, read: true } : e)),
        })),

      markAllRead: () =>
        set((s) => ({ events: s.events.map((e) => ({ ...e, read: true })) })),

      remove: (id) =>
        set((s) => ({ events: s.events.filter((e) => e.id !== id) })),

      unreadCount: () => get().events.filter((e) => !e.read).length,
    }),
    {
      name: "agdict:notification-events",
      version: 1,
      partialize: (s) => ({ events: s.events, _seeded: s._seeded }),
      // Ensure existing installs still get the seed once
      migrate: (persisted: unknown) => {
        const p = persisted as Partial<State> | undefined;
        if (!p || !p._seeded) {
          return { events: SEED_EVENTS, _seeded: true } as Partial<State>;
        }
        return p as Partial<State>;
      },
    },
  ),
);
