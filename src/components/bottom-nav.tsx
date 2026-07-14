import { memo } from "react";
import { Link } from "@tanstack/react-router";
import { Home, LineChart, Star, BarChart3, Settings } from "lucide-react";
import type { ComponentType } from "react";

const tabs: { to: string; label: string; Icon: ComponentType<{ className?: string }> }[] = [
  { to: "/", label: "홈", Icon: Home },
  { to: "/market", label: "시세", Icon: LineChart },
  { to: "/watchlist", label: "즐겨찾기", Icon: Star },
  { to: "/statistics", label: "통계", Icon: BarChart3 },
  { to: "/settings", label: "설정", Icon: Settings },
];

function BottomNavBase() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 mx-auto flex h-[60px] w-full max-w-[430px] items-stretch border-t border-[#E8EEE8] bg-white"
      aria-label="주요 메뉴"
    >
      {tabs.map(({ to, label, Icon }) => (
        <Link
          key={to}
          to={to}
          activeOptions={{ exact: to === "/" }}
          className="group flex min-h-11 flex-1 flex-col items-center justify-center gap-1 text-[10px] text-[#9CA3AF] transition-colors data-[status=active]:text-primary"
        >
          <Icon className="h-5 w-5" />
          <span className="font-medium">{label}</span>
        </Link>
      ))}
    </nav>
  );
}

export const BottomNav = memo(BottomNavBase);

