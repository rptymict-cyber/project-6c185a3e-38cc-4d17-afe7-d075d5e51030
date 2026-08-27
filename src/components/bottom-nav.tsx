import { memo } from "react";
import { Link } from "@tanstack/react-router";
import { Home, LineChart, Star, BarChart3, Settings } from "lucide-react";
import type { ComponentType } from "react";
import { UnreadBadge } from "./notifications/UnreadBadge";

const tabs: {
  to: string;
  label: string;
  Icon: ComponentType<{ className?: string }>;
  /** 안 읽은 알림 배지 노출 여부 */
  showUnread?: boolean;
}[] = [
  { to: "/", label: "홈", Icon: Home },
  { to: "/market", label: "시세", Icon: LineChart },
  { to: "/watchlist", label: "즐겨찾기", Icon: Star },
  { to: "/statistics", label: "통계", Icon: BarChart3 },
  { to: "/settings", label: "설정", Icon: Settings },
];

function BottomNavBase() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 mx-auto flex w-full max-w-[430px] items-stretch border-t border-[#E8EEE8] bg-white pb-[env(safe-area-inset-bottom)]"
      aria-label="주요 메뉴"
    >
      {tabs.map(({ to, label, Icon, showUnread }) => (
        <Link
          key={to}
          to={to}
          activeOptions={{ exact: to === "/" }}
          className="group flex h-16 flex-1 flex-col items-center justify-center gap-1 px-0.5 text-[#9CA3AF] transition-colors data-[status=active]:text-primary"
        >
          <span className="relative grid place-items-center">
            <Icon className="h-6 w-6" />
            {showUnread && <UnreadBadge className="-right-2 -top-1" />}
          </span>
          <span className="w-full truncate text-center text-[12px] font-medium leading-none">
            {label}
          </span>
        </Link>
      ))}
    </nav>
  );
}

export const BottomNav = memo(BottomNavBase);
