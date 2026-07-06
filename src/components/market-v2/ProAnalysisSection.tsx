import { useState } from "react";
import { cn } from "@/lib/utils";
import { ProAnalysisChart } from "./ProAnalysisChart";
import { getPriceSeries, type Period } from "@/lib/mock/market-analysis";
import { useMarketFilter } from "@/store/market";

type Tab = "overview" | "compare" | "company" | "origin" | "variety";
const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "종합" },
  { id: "compare", label: "시장비교" },
  { id: "company", label: "법인" },
  { id: "origin", label: "산지" },
  { id: "variety", label: "품종" },
];

const PERIODS: { id: Period; label: string }[] = [
  { id: "today", label: "오늘" },
  { id: "1w", label: "1주" },
  { id: "1m", label: "1달" },
  { id: "3m", label: "3달" },
  { id: "1y", label: "1년" },
];

export function ProAnalysisSection() {
  const [tab, setTab] = useState<Tab>("overview");
  const [period, setPeriod] = useState<Period>("1w");
  const f = useMarketFilter();

  const series = getPriceSeries({
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

      {/* Period chips */}
      <div className="no-scrollbar flex gap-1.5 overflow-x-auto px-4 pb-2 pt-3">
        {PERIODS.map((p) => {
          const active = p.id === period;
          return (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1 text-[12.5px] font-semibold",
                active ? "bg-[#D6F0D6] text-[#1F5C1F]" : "bg-[#F1F3F5] text-[#6C757D]",
              )}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {tab === "overview" ? (
        <div className="px-2 pb-3">
          <div className="flex items-center justify-end gap-3 px-3 pb-1 text-[11px] text-[#495057]">
            <span className="flex items-center gap-1">
              <span className="inline-block h-[2px] w-3 rounded bg-[#3A8A3A]" /> 가격
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-sm bg-[#B7E4B7]" /> 거래량
            </span>
          </div>
          <ProAnalysisChart data={series} />
        </div>
      ) : (
        <div className="py-10 text-center text-[13px] text-[#868E96]">
          {TABS.find((t) => t.id === tab)?.label} 뷰는 준비 중입니다
        </div>
      )}
    </section>
  );
}
