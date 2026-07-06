import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Bell, TrendingDown, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/notifications")({
  component: NotificationsPage,
  head: () => ({
    meta: [
      { title: "알림 — AGDICT" },
      { name: "description", content: "관심 작물의 가격 변동과 시장 소식 알림." },
    ],
  }),
});

type Notif = {
  id: string;
  type: "up" | "down" | "info";
  title: string;
  body: string;
  time: string;
};

const NOTIFS: Notif[] = [
  {
    id: "1",
    type: "up",
    title: "양파 가격 급등",
    body: "가락시장 기준 전일대비 +12.4% 상승했어요.",
    time: "10분 전",
  },
  {
    id: "2",
    type: "down",
    title: "배추 가격 급락",
    body: "주요 도매시장 평균 -8.1% 하락했어요.",
    time: "1시간 전",
  },
  {
    id: "3",
    type: "info",
    title: "시세 데이터 업데이트",
    body: "2026.07.03 14:30 기준 최신 시세가 반영되었습니다.",
    time: "오늘 14:30",
  },
];

function NotificationsPage() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-background">
      <header className="sticky top-0 z-30 flex h-[52px] items-center gap-1 border-b border-[#E9ECEF] bg-background px-2">
        <Link
          to="/"
          aria-label="뒤로"
          className="grid h-9 w-9 place-items-center rounded-full text-foreground hover:bg-secondary"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <span className="ml-1 text-[15px] font-black tracking-tight text-foreground">
          알림
        </span>
      </header>

      <main className="flex-1 overflow-y-auto pb-8">
        {NOTIFS.length === 0 ? (
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
          <ul className="divide-y divide-border">
            {NOTIFS.map((n) => (
              <li key={n.id} className="flex items-start gap-3 px-4 py-4">
                <span
                  className={
                    "grid h-9 w-9 shrink-0 place-items-center rounded-full " +
                    (n.type === "up"
                      ? "bg-[#FFF5F5] text-[#E03131]"
                      : n.type === "down"
                        ? "bg-[#EDF2FF] text-[#1971C2]"
                        : "bg-[#F0F9F0] text-[#3A8A3A]")
                  }
                >
                  {n.type === "up" ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : n.type === "down" ? (
                    <TrendingDown className="h-4 w-4" />
                  ) : (
                    <Bell className="h-4 w-4" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-[14px] font-bold text-foreground">
                      {n.title}
                    </span>
                    <span className="shrink-0 text-[11px] text-muted-foreground">
                      {n.time}
                    </span>
                  </div>
                  <p className="mt-1 text-[13px] text-muted-foreground">
                    {n.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
