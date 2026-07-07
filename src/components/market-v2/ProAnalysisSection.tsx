import { useState } from "react";
import { cn } from "@/lib/utils";
import { PriceVolumeChart } from "./PriceVolumeChart";
import { AuctionHistoryTable } from "./AuctionHistoryTable";
import { ProMarketRankingTable } from "./ProMarketRankingTable";
import { GroupRankingTable } from "./GroupRankingTable";
import { getPriceVolumeSeries, type Period } from "@/lib/mock/market-analysis";
import { useMarketFilter } from "@/store/market";

type Tab = "chart" | "auctions" | "compare" | "company" | "origin" | "variety";
const TABS: { id: Tab; label: string }[] = [
  { id: "chart", label: "차트" },
  { id: "auctions", label: "경매내역" },
  { id: "compare", label: "시장비교" },
  { id: "company", label: "법인" },
  { id: "origin", label: "산지" },
  { id: "variety", label: "품종" },
];

const PERIODS: { id: Period; label: string }[] = [
  { id: "today", label: "오늘" },
  { id: "1w", label: "1주" },
  { id: "1m", label: "1개월" },
  { id: "3m", label: "3개월" },
  { id: "1y", label: "1년" },
];

export function ProAnalysisSection() {
  const [tab, setTab] = useState<Tab>("chart");
  const [period, setPeriod] = useState<Period>("1w");
  const f = useMarketFilter();

  const series = getPriceVolumeSeries({
    itemId: f.itemId,
    varietyId: f.varietyId,
    marketId: f.marketId,
    unit: f.unit,
    date: f.date,
    period,
  });

  return (
    <section className="mt-3 bg-white pt-1">
      {/* Underline tabs */}
      <div className="no-scrollbar flex overflow-x-auto border-b border-[#E9ECEF] px-2">
        {TABS.map((t) => {
          const active = t.id === tab;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "relative shrink-0 px-3 py-3 text-[13.5px] font-semibold",
                active ? "text-foreground" : "text-[#868E96]",
              )}
            >
              {t.label}
              {active && (
                <span className="absolute inset-x-2 -bottom-px h-[2px] rounded-full bg-[#3A8A3A]" />
              )}
            </button>
          );
        })}
      </div>

      {tab === "chart" && (
        <div className="px-3 pb-3 pt-3">
          <div className="no-scrollbar mb-3 flex gap-1.5 overflow-x-auto">
            {PERIODS.map((p) => {
              const active = p.id === period;
              return (
                <button
                  key={p.id}
                  onClick={() => setPeriod(p.id)}
                  className={cn(
                    "shrink-0 rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors",
                    active
                      ? "bg-[#1F5C1F] text-white"
                      : "bg-[#F1F3F5] text-[#6C757D]",
                  )}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
          <div className="rounded-[12px] border border-[#F1F3F5] bg-white p-2 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <PriceVolumeChart series={series} period={period} />
          </div>
        </div>
      )}
      {tab === "auctions" && <AuctionHistoryTable />}
      {tab !== "chart" && tab !== "auctions" && (
        <div className="py-10 text-center text-[13px] text-[#868E96]">
          {TABS.find((t) => t.id === tab)?.label} 뷰는 준비 중입니다
        </div>
      )}
    </section>
  );
}
