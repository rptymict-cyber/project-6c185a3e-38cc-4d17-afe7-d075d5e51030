import { useState } from "react";
import { Search } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { DataSourceNotice } from "@/components/home/DataSourceNotice";
import { PredictableCropCards } from "@/components/home/PredictableCropCards";
import { MarketCropRow } from "./MarketCropRow";
import { MarketQuickMarketSection } from "./MarketQuickMarketSection";
import { MarketRecentAuctionSection } from "./MarketRecentAuctionSection";
import { TOP_CROPS } from "./types";

const SORTS = ["인기조회", "상승률", "하락률", "거래량", "가격변동"];

export function MarketListHome({
  onSelectCrop,
  onOpenAuction,
}: {
  onSelectCrop: (id: string) => void;
  onOpenAuction: () => void;
}) {
  const [sort, setSort] = useState("상승률");

  const sorted = [...TOP_CROPS].sort((a, b) => {
    if (sort === "상승률") return b.changePct - a.changePct;
    if (sort === "하락률") return a.changePct - b.changePct;
    if (sort === "거래량") return b.volumeTon - a.volumeTon;
    if (sort === "가격변동") return Math.abs(b.changePct) - Math.abs(a.changePct);
    return 0;
  });

  return (
    <div className="pb-6">
      {/* 검색바 */}
      <div className="px-4 pt-3">
        <Link
          to="/search"
          className="flex w-full items-center gap-2 rounded-[12px] bg-[#F1F3F5] px-4 py-3 text-left text-[13px] text-muted-foreground"
        >
          <Search className="h-4 w-4" />
          품목, 시장, 산지, 등급을 검색하세요
        </Link>
      </div>


      <PredictableCropCards />

      {/* 실시간 품목 시세 TOP */}
      <section className="mt-6 px-4">
        <h3 className="mb-2 text-[14px] font-bold text-foreground">실시간 품목 시세 TOP</h3>
        <div className="no-scrollbar mb-2 flex gap-1.5 overflow-x-auto">
          {SORTS.map((s) => {
            const active = s === sort;
            return (
              <button
                key={s}
                onClick={() => setSort(s)}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1 text-[12px] font-semibold",
                  active
                    ? "bg-[#3A8A3A] text-white"
                    : "bg-[#F1F3F5] text-muted-foreground",
                )}
              >
                {s}
              </button>
            );
          })}
        </div>
        <ul className="overflow-hidden rounded-[10px] bg-surface">
          {sorted.map((c, i) => (
            <MarketCropRow
              key={c.id}
              rank={i + 1}
              crop={c}
              onClick={() => onSelectCrop(c.id)}
            />
          ))}
        </ul>
        <button
          onClick={() => toast("더 많은 품목은 준비 중입니다")}
          className="mt-2 w-full rounded-[10px] border border-[#E9ECEF] bg-background py-2.5 text-[13px] font-semibold text-foreground active:bg-secondary"
        >
          더보기 ›
        </button>
      </section>

      <MarketQuickMarketSection />
      <MarketRecentAuctionSection onMore={onOpenAuction} />

      <DataSourceNotice />
    </div>
  );
}
