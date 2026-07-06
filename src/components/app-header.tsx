import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Bell, RefreshCw } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppDrawerTrigger } from "./app-drawer";
import { cn } from "@/lib/utils";

/**
 * Standard app header used on GNB pages:
 * - Left: hamburger drawer trigger
 * - Center: AGDICT β + today's date (small, below)
 * - Right: realtime indicator (red pulsing dot) + refresh + search
 */
export function AppHeader({
  title,
  showDate = true,
  right,
}: {
  title?: ReactNode;
  showDate?: boolean;
  right?: ReactNode;
}) {
  const [now, setNow] = useState<Date>(() => new Date());
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");
  const dateLabel = `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())}`;

  return (
    <header className="sticky top-0 z-30 flex h-[52px] items-center justify-between border-b border-[#E9ECEF] bg-background px-2">
      <div className="flex items-center">
        <AppDrawerTrigger />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 flex h-[52px] flex-col items-center justify-center">
        {title ? (
          <span className="text-[15px] font-black tracking-tight text-foreground">{title}</span>
        ) : (
          <>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-[16px] font-black tracking-tight text-foreground">AGDICT</span>
              <span className="rounded-md bg-[#F0F9F0] px-1 py-0.5 text-[10px] font-bold leading-none text-[#3A8A3A]">
                β
              </span>
            </div>
            {showDate && (
              <span className="mt-0.5 text-[10px] font-medium leading-none text-muted-foreground">
                {dateLabel}
              </span>
            )}
          </>
        )}
      </div>

      <div className="flex items-center gap-0.5">
        {right ?? (
          <>
            <span
              className="relative mr-1 grid h-9 w-4 place-items-center"
              aria-label="실시간"
              title="실시간"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#E03131] opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#E03131]" />
              </span>
            </span>
            <button
              aria-label="새로고침"
              onClick={() => {
                setSpinning(true);
                setNow(new Date());
                setTimeout(() => setSpinning(false), 700);
                toast("최신 시세로 업데이트했어요");
              }}
              className="grid h-9 w-9 place-items-center rounded-full text-foreground hover:bg-secondary"
            >
              <RefreshCw
                className={cn("h-5 w-5 transition-transform", spinning && "animate-spin")}
              />
            </button>
            <Link
              to="/notifications"
              aria-label="알림"
              className="grid h-9 w-9 place-items-center rounded-full text-foreground hover:bg-secondary"
            >
              <Bell className="h-5 w-5" />
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
