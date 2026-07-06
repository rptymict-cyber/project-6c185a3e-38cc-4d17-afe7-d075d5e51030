import { Link } from "@tanstack/react-router";
import { Bell, MoreHorizontal, Search } from "lucide-react";

export function HomeSearchHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-[56px] items-center gap-2 border-b border-[#E9ECEF] bg-background px-3">
      <Link
        to="/search"
        className="group flex h-10 flex-1 items-center gap-2 rounded-full bg-[#F1F3F5] px-4 text-[13px] text-[#868E96] transition-colors hover:bg-[#E9ECEF]"
        aria-label="검색"
      >
        <Search className="h-4 w-4 text-[#868E96]" />
        <span className="truncate">품목, 시장, 산지를 검색하세요</span>
      </Link>
      <button
        aria-label="알림"
        className="relative grid h-10 w-10 place-items-center rounded-full text-foreground hover:bg-secondary"
      >
        <Bell className="h-[22px] w-[22px]" />
        <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#E03131]" />
      </button>
      <Link
        to="/settings"
        aria-label="더보기"
        className="grid h-10 w-10 place-items-center rounded-full text-foreground hover:bg-secondary"
      >
        <MoreHorizontal className="h-[22px] w-[22px]" />
      </Link>
    </header>
  );
}
