import { Link } from "@tanstack/react-router";
import { Bell, MoreHorizontal, Search } from "lucide-react";
import { UnreadBadge } from "@/components/notifications/UnreadBadge";

export function HomeSearchHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-[56px] items-center gap-2 border-b border-[#E9ECEF] bg-background px-3">
      <Link
        to="/search"
        className="group flex h-11 flex-1 items-center gap-2 rounded-full bg-[#F1F3F5] px-4 text-body text-[#868E96] transition-colors hover:bg-[#E9ECEF]"
        aria-label="검색"
      >
        <Search className="h-4 w-4 text-[#868E96]" />
        <span className="truncate">품목, 시장, 산지를 검색하세요</span>
      </Link>
      <Link
        to="/notifications"
        aria-label="알림"
        className="relative grid h-11 w-11 place-items-center rounded-full text-foreground hover:bg-secondary"
      >
        <Bell className="h-[22px] w-[22px]" />
        <UnreadBadge className="right-1.5 top-1.5" />
      </Link>

      <Link
        to="/settings"
        aria-label="더보기"
        className="grid h-11 w-11 place-items-center rounded-full text-foreground hover:bg-secondary"
      >
        <MoreHorizontal className="h-[22px] w-[22px]" />
      </Link>
    </header>
  );
}
