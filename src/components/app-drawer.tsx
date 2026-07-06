import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Menu,
  Package,
  Store,
  MapPin,
  Sparkles,
  Star,
  BarChart2,
  Award,
  
  ChevronRight,
} from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { ComponentType } from "react";

type Item = {
  to: string;
  search?: Record<string, string>;
  label: string;
  description?: string;
  Icon: ComponentType<{ className?: string }>;
  badge?: string;
};

const items: Item[] = [
  {
    to: "/market",
    search: { tab: "crop" },
    label: "품목별",
    description: "작물별 시세 목록",
    Icon: Package,
  },
  {
    to: "/market",
    search: { tab: "market" },
    label: "도매시장별",
    description: "지역·시장별 평균가",
    Icon: Store,
  },
  {
    to: "/market",
    search: { tab: "origin" },
    label: "주산지 정보",
    description: "월별 주요 산지 비중",
    Icon: MapPin,
  },
  {
    to: "/prediction",
    label: "예측",
    description: "가격 AI 예측",
    Icon: Sparkles,
    badge: "Beta",
  },
  {
    to: "/watchlist",
    label: "즐겨찾기",
    description: "저장한 품목과 시장",
    Icon: Star,
  },
  {
    to: "/compare",
    label: "시장별 비교",
    description: "여러 시장을 한눈에 비교",
    Icon: BarChart2,
  },
  {
    to: "/grades",
    label: "등급 정보",
    description: "상·중·하 등급별 시세",
    Icon: Award,
  },
];

export function AppDrawerTrigger() {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          aria-label="메뉴 열기"
          className="grid h-9 w-9 place-items-center rounded-full text-foreground hover:bg-secondary"
        >
          <Menu className="h-5 w-5" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex w-[280px] max-w-[85vw] flex-col bg-background p-0"
      >
        <SheetHeader className="flex-row items-center justify-between space-y-0 border-b border-border px-4 py-3">
          <SheetTitle className="flex items-center gap-1.5 text-[15px] font-black">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-primary text-[13px] font-black text-primary-foreground">
              A
            </span>
            AGDICT
          </SheetTitle>
        </SheetHeader>
        <nav className="flex-1 overflow-y-auto px-2 py-3">
          <ul className="grid gap-0.5">
            {items.map((it) => (
              <li key={`${it.to}-${it.label}`}>
                <SheetClose asChild>
                  <Link
                    to={it.to}
                    search={it.search as never}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-secondary"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-surface text-primary">
                      <it.Icon className="h-4.5 w-4.5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5">
                        <span className="text-[14px] font-semibold text-foreground">
                          {it.label}
                        </span>
                        {it.badge && (
                          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                            {it.badge}
                          </span>
                        )}
                      </span>
                      {it.description && (
                        <span className="block text-[11px] text-muted-foreground">
                          {it.description}
                        </span>
                      )}
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </Link>
                </SheetClose>
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t border-border px-4 py-3 text-[11px] text-muted-foreground">
          데이터 제공: KAMIS 농산물유통정보
        </div>
      </SheetContent>
    </Sheet>
  );
}
