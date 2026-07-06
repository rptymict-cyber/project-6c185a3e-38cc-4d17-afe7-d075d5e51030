import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

export function TodayMarketBanner() {
  return (
    <Link
      to="/market"
      className="mx-4 mt-3 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#EAF7EA] to-[#F4FBEF] px-4 py-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition-transform active:scale-[0.99]"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-[13px] leading-tight">
          <span className="rounded-md bg-[#3A8A3A] px-1.5 py-0.5 text-[10px] font-bold text-white">
            TODAY
          </span>
          <span className="truncate font-semibold text-foreground">
            배추 도매가 <span className="text-[#E03131]">8.2%</span> 상승 · 거래량{" "}
            <span className="text-[#E03131]">14%</span> 증가
          </span>
        </div>
        <div className="mt-1 text-[11px] text-[#6C757D]">2026.07.03 14:30 기준</div>
      </div>
      <span className="text-2xl leading-none">🥬</span>
      <ChevronRight className="h-5 w-5 text-[#ADB5BD]" />
    </Link>
  );
}
