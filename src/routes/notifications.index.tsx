import { useMemo } from "react";
import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { Bell, Info, Settings, TrendingDown, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { DetailHeader } from "@/components/detail-header";
import {
  useNotificationEvents,
  type NotificationEvent,
  type NotificationKind,
} from "@/store/notification-events";
import { useMarketFilter } from "@/store/market";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notifications/")({
  component: NotificationsPage,
  head: () => ({
    meta: [
      { title: "알림 — AGDICT" },
      { name: "description", content: "관심 작물의 가격 변동과 시장 소식 알림." },
    ],
  }),
});

function NotificationsPage() {
  const router = useRouter();
  const navigate = useNavigate();

  const events = useNotificationEvents((s) => s.events);
  const markRead = useNotificationEvents((s) => s.markRead);

  const setItem = useMarketFilter((s) => s.setItem);
  const setMarket = useMarketFilter((s) => s.setMarket);
  const setCorp = useMarketFilter((s) => s.setCorp);
  const setUnit = useMarketFilter((s) => s.setUnit);

  const sorted = useMemo(
    () =>
      [...events].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [events],
  );

  const groups = useMemo(() => groupByDay(sorted), [sorted]);

  const handleClick = (e: NotificationEvent) => {
    // 1) 읽음 처리
    markRead(e.id);
    // 2) context 없으면 이동 없음 (system 등)
    if (!e.context) return;
    const c = e.context;
    // 3) 전역 필터를 알림 조건과 완전히 일치시킴 (순서 준수)
    setItem({
      categoryId: c.categoryId,
      categoryLabel: c.categoryLabel,
      itemId: c.itemId,
      itemLabel: c.itemLabel,
      varietyId: c.varietyId,
      varietyLabel: c.varietyLabel,
    });
    setMarket(c.marketId, c.marketLabel);
    setCorp(c.corpId, c.corpLabel);
    setUnit(c.unit);
    // 4) 상세로 이동
    navigate({ to: "/price/$variety", params: { variety: c.varietyId } });
  };

  return (
    <AppShell
      header={
        <DetailHeader
          title="알림"
          onBack={() => router.history.back()}
          right={
            <Link
              to="/notifications/settings"
              aria-label="알림 설정"
              className="grid h-9 w-9 place-items-center rounded-full text-[#495057] hover:bg-secondary"
            >
              <Settings className="h-5 w-5" />
            </Link>
          }
        />
      }
    >
      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-[#F1F3F5]">
            <Bell className="h-7 w-7 text-[#ADB5BD]" />
          </div>
          <p className="mt-4 text-[15px] font-bold text-foreground">
            새 알림이 없어요
          </p>
          <p className="mt-1 text-[12px] text-muted-foreground">
            관심 작물을 등록하면 가격 변동 알림을 받을 수 있어요
          </p>
        </div>
      ) : (
        <div className="pb-8">
          {groups.map((g) => (
            <section key={g.label}>
              <h2 className="px-4 pb-1.5 pt-4 text-[12px] font-bold text-[#868E96]">
                {g.label}
              </h2>
              <ul className="divide-y divide-border bg-white">
                {g.items.map((n) => {
                  const style = kindStyle(n.kind);
                  return (
                    <li key={n.id}>
                      <button
                        type="button"
                        onClick={() => handleClick(n)}
                        className={cn(
                          "flex w-full items-start gap-3 px-4 py-4 text-left active:bg-[#F8F9FA]",
                          !n.context && "cursor-default",
                        )}
                      >
                        <div className="relative shrink-0">
                          {!n.read && (
                            <span className="absolute -left-1.5 top-3.5 h-1.5 w-1.5 rounded-full bg-[#E03131]" />
                          )}
                          <span
                            className={cn(
                              "grid h-9 w-9 place-items-center rounded-full",
                              style.bg,
                              style.fg,
                            )}
                          >
                            {style.icon}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={cn(
                                "truncate text-[14px] text-foreground",
                                n.read ? "font-semibold" : "font-bold",
                              )}
                            >
                              {n.title}
                            </span>
                            <span className="shrink-0 text-[11px] text-muted-foreground">
                              {formatRelative(n.createdAt)}
                            </span>
                          </div>
                          <p className="mt-1 text-[13px] text-muted-foreground">
                            {n.body}
                          </p>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </AppShell>
  );
}

/* ---------- helpers ---------- */

function kindStyle(kind: NotificationKind) {
  switch (kind) {
    case "target":
    case "swingUp":
    case "volumeSurge":
      return {
        bg: "bg-[#FFF5F5]",
        fg: "text-[#E03131]",
        icon: <TrendingUp className="h-4 w-4" />,
      };
    case "swingDown":
      return {
        bg: "bg-[#EDF2FF]",
        fg: "text-[#1971C2]",
        icon: <TrendingDown className="h-4 w-4" />,
      };
    case "auctionStart":
      return {
        bg: "bg-[#F0F9F0]",
        fg: "text-[#3A8A3A]",
        icon: <Bell className="h-4 w-4" />,
      };
    case "system":
    default:
      return {
        bg: "bg-[#F1F3F5]",
        fg: "text-[#6C757D]",
        icon: <Info className="h-4 w-4" />,
      };
  }
}

function startOfDay(d: Date): number {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c.getTime();
}

function groupByDay(events: NotificationEvent[]) {
  const today = startOfDay(new Date());
  const yesterday = today - 24 * 60 * 60 * 1000;
  const groups: { label: string; items: NotificationEvent[] }[] = [
    { label: "오늘", items: [] },
    { label: "어제", items: [] },
    { label: "이전", items: [] },
  ];
  for (const e of events) {
    const t = startOfDay(new Date(e.createdAt));
    if (t === today) groups[0].items.push(e);
    else if (t === yesterday) groups[1].items.push(e);
    else groups[2].items.push(e);
  }
  return groups.filter((g) => g.items.length > 0);
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "방금";
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}일 전`;
  const dt = new Date(iso);
  return `${dt.getMonth() + 1}/${dt.getDate()}`;
}
