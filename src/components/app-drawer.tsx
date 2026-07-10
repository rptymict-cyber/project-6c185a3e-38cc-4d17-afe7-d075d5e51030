import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Menu,
  ChevronRight,
  Sparkles,
  Activity,
  Store,
  Package,
  LineChart,
  Newspaper,
  Star,
  BarChart3,
  Scale,
  Settings,
  Bell,
  Info,
} from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type Item = {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
};

// 더보기 메뉴는 단일 리스트 구조.
const MENU: Item[] = [
  { label: "AI 시세 예측", to: "/prediction", icon: Sparkles, badge: "Beta" },
  { label: "실시간 시세", to: "/live", icon: Activity },
  { label: "도매시장별 조회", to: "/market/wholesale", icon: Store },
  { label: "품목별 조회", to: "/market/item", icon: Package },
  { label: "시세 조회", to: "/market", icon: LineChart },
  { label: "시장별 가격 비교", to: "/market-compare", icon: Scale },
  { label: "즐겨찾기", to: "/watchlist", icon: Star },
  { label: "통계", to: "/statistics", icon: BarChart3 },
  { label: "설정", to: "/settings", icon: Settings },
  { label: "알림 설정", to: "/notifications/settings", icon: Bell },
  { label: "데이터 기준 안내", to: "/data-guide", icon: Info },
];

export function AppDrawerTrigger() {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          aria-label="더보기"
          className="grid h-9 w-9 place-items-center rounded-full text-foreground hover:bg-secondary"
        >
          <Menu className="h-5 w-5" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex w-[300px] max-w-[85vw] flex-col bg-background p-0"
      >
        <SheetHeader className="flex-row items-center justify-between space-y-0 border-b border-border px-4 py-3">
          <SheetTitle className="text-[15px] font-black text-foreground">
            더보기
          </SheetTitle>
        </SheetHeader>
        <nav className="flex-1 overflow-y-auto py-2">
          <ul>
            {MENU.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <SheetClose asChild>
                    <Link
                      to={item.to}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-secondary"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#F1F3F5] text-[#495057]">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[14px] font-semibold text-foreground">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className="h-4 w-4 shrink-0 text-[#ADB5BD]" />
                    </Link>
                  </SheetClose>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="border-t border-border px-4 py-3 text-[11px] text-muted-foreground">
          데이터 제공: KAMIS 농산물유통정보
        </div>
      </SheetContent>
    </Sheet>
  );
}
