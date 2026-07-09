import { useState } from "react";
import { Search } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { DataSourceNotice } from "@/components/home/DataSourceNotice";
import { PredictableCropCards } from "@/components/home/PredictableCropCards";
import { RealtimeSection } from "./RealtimeSection";
import { HomeMarketQuickSection } from "./HomeMarketQuickSection";
import { HomeItemQuickSection } from "./HomeItemQuickSection";
import type { LiveSort } from "@/lib/services/live-prices";

const HOME_LIMIT = 5;

export function MarketListHome({
  onSelectCrop,
}: {
  onSelectCrop: (id: string) => void;
}) {
  const navigate = useNavigate();
  const [sort, setSort] = useState<LiveSort>("up");

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

      {/* 실시간 시세 */}
      <section className="mt-6 px-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-[14px] font-bold text-foreground">실시간 시세</h3>
          <button
            onClick={() => navigate({ to: "/live", search: { sort } })}
            className="text-[12px] font-medium text-muted-foreground"
          >
            더보기 ›
          </button>
        </div>
        <RealtimeSection
          sort={sort}
          onSortChange={setSort}
          onSelect={onSelectCrop}
          limit={HOME_LIMIT}
        />
      </section>

      <HomeMarketQuickSection />
      <HomeItemQuickSection />

      <DataSourceNotice />
    </div>
  );
}
