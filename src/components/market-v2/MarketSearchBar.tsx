import { Search } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function MarketSearchBar() {
  return (
    <div className="px-4 pt-3">
      <Link
        to="/search"
        className="flex w-full items-center gap-2.5 rounded-[12px] bg-[#F8F9FA] px-[15px] py-[13px] text-left"
      >
        <Search className="h-[18px] w-[18px] text-[#ADB5BD]" />
        <span className="text-[13.5px] text-[#ADB5BD]">작물명·품종으로 검색</span>
      </Link>
    </div>
  );
}
