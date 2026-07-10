import { useState } from "react";
import { Search } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { DataSourceNotice } from "@/components/home/DataSourceNotice";
import { HomeAgriNewsSection } from "@/components/home/HomeAgriNewsSection";
import { PredictableCropCards } from "@/components/home/PredictableCropCards";
import { RealtimeSection } from "./RealtimeSection";
import {
  HomeFeatureCard,
  WholesaleMarketIllustration,
  ItemBasketIllustration,
  AIPredictionIllustration,
} from "@/components/home/HomeFeatureCard";
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
    <div className="min-h-full bg-white pb-6">
      {/* 검색바 */}
      <div className="px-4 pt-3">
        <Link
          to="/search"
          className="flex w-full items-center gap-2 rounded-[12px] border border-[#E8EEE8] bg-white px-4 py-3 text-left text-[13px] text-muted-foreground"
        >
          <Search className="h-4 w-4" />
          품목, 시장, 산지, 등급을 검색하세요
        </Link>
      </div>

      {/* AI 가격 예측 (compact) */}
      <PredictableCropCards />

      {/* 실시간 시세 */}
      <section className="mt-5 px-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-[18px] font-bold text-[#111827]">실시간 시세</h3>
          <button
            onClick={() => navigate({ to: "/live", search: { sort } })}
            className="text-[13px] font-medium text-[#4B5563]"
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

      {/* 오늘의 농산물 소식 */}
      <HomeAgriNewsSection />

      {/* 주요 진입 카드 */}
      <section className="mt-4 flex flex-col gap-3 px-4">
        <HomeFeatureCard
          eyebrow="전국 도매시장 시세를 확인하세요"
          title="도매시장별 조회"
          to="/market/wholesale"
          image={<WholesaleMarketIllustration />}
        />
        <HomeFeatureCard
          eyebrow="원하는 품목의 가격을 확인하세요"
          title="품목별 조회"
          to="/market/item"
          image={<ItemBasketIllustration />}
        />
        <HomeFeatureCard
          eyebrow="AI가 예측한 미래 시세를 확인하세요"
          title="AI 시세 예측"
          to="/prediction"
          image={<AIPredictionIllustration />}
        />
      </section>

      <DataSourceNotice />
    </div>
  );
}
