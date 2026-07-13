import { Link } from "@tanstack/react-router";
import { Sparkles, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { PriceVolumeChart, type PredictionInput } from "./PriceVolumeChart";
import { AuctionHistoryTable } from "./AuctionHistoryTable";
import { ProMarketRankingTable } from "./ProMarketRankingTable";
import { GroupRankingTable } from "./GroupRankingTable";
import { getPriceVolumeSeries, type Period } from "@/lib/mock/market-analysis";
import { useMarketFilter, type ProTab } from "@/store/market";
import { getItemById } from "@/lib/catalog-service";
import { useMemo, useState } from "react";


const PERIODS: { id: Period; label: string }[] = [
  { id: "today", label: "오늘" },
  { id: "1w", label: "1주" },
  { id: "1m", label: "1개월" },
  { id: "3m", label: "3개월" },
  { id: "1y", label: "1년" },
];

export function ProAnalysisSection() {
  const f = useMarketFilter();
  const tab = f.proTab;
  const setTab = f.setProTab;
  const [period, setPeriod] = useState<Period>("1w");

  const TABS: { id: ProTab; label: string }[] = [
    { id: "chart", label: "차트" },
    { id: "auctions", label: "경매내역" },
    { id: "compare", label: "시장비교" },
    { id: "company", label: "법인" },
    { id: "origin", label: "산지" },
    { id: "variety", label: "품종" },
  ];

  const series = getPriceVolumeSeries({
    itemId: f.itemId,
    varietyId: f.varietyId,
    marketId: f.marketId,
    unit: f.unit,
    date: f.date,
    period,
  });

  const unitLabel = f.unit.replace(" 기준", "");

  // Task 3: prediction extension — only for predictable items in the catalog
  const isPredictable = !!getItemById(f.itemId)?.prediction.supported;
  const prediction: PredictionInput | undefined = useMemo(() => {
    if (!isPredictable || series.points.length === 0) return undefined;
    const last = series.points[series.points.length - 1];
    const days = period === "today" ? 6 : period === "1w" ? 5 : period === "1m" ? 7 : 7;
    // seeded-ish forecast: gentle drift + small noise around last price
    const drift = last.price * 0.01;
    const points: { label: string; price: number }[] = [];
    for (let k = 1; k <= days; k++) {
      const wave = Math.sin(k * 0.9) * (last.price * 0.015);
      const p = Math.round(last.price + drift * k + wave);
      points.push({ label: `+${k}일`, price: p });
    }
    // pick recommended = highest predicted point
    let recIdx = 0;
    points.forEach((p, i) => {
      if (p.price > points[recIdx].price) recIdx = i;
    });
    return { points, recommendedIdx: recIdx };
  }, [isPredictable, series, period]);

  const recommended = prediction?.points[prediction.recommendedIdx ?? 0];
  const recommendedDelta = recommended
    ? recommended.price - series.points[series.points.length - 1].price
    : 0;


  return (
    <section className="mt-3 bg-white pt-1">
      {/* Tab bar with right-side view segment */}
      <div className="flex items-center border-b border-[#E9ECEF] pr-3">
        <div className="no-scrollbar flex flex-1 overflow-x-auto px-2">
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
        <ViewSegment
          value={tab === "auctions" ? "list" : "chart"}
          onChange={(v) => setTab(v === "list" ? "auctions" : "chart")}
        />
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

          {/* Period summary */}
          <div className="mb-3 grid grid-cols-3 gap-2">
            <PeriodStat label="최고가" value={`${series.max.toLocaleString()}원`} tone="up" />
            <PeriodStat label="최저가" value={`${series.min.toLocaleString()}원`} tone="down" />
            <PeriodStat label="평균가" value={`${series.avg.toLocaleString()}원`} tone="neutral" />
          </div>

          {/* Legend */}
          <div className="mb-2 flex items-center gap-3 px-1 text-[11px] text-[#495057]">
            <span className="flex items-center gap-1">
              <span className="inline-block h-[2px] w-3 rounded-full bg-[#E03131]" />
              평균가(원/{unitLabel})
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-3 rounded-sm bg-[#E03131]/20" />
              거래량
            </span>
          </div>

          <div className="rounded-[12px] border border-[#F1F3F5] bg-white p-2 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <PriceVolumeChart series={series} period={period} />
          </div>

          <p className="mt-3 px-1 text-[11px] text-[#868E96]">
            차트는 경매일 기준이며, 선택한 기간의 데이터를 제공합니다.
          </p>
        </div>
      )}

      {tab === "auctions" && <AuctionHistoryTable />}
      {tab === "compare" && <ProMarketRankingTable />}
      {tab === "company" && <GroupRankingTable scope="company" />}
      {tab === "origin" && <GroupRankingTable scope="origin" />}
      {tab === "variety" && <GroupRankingTable scope="variety" />}
    </section>
  );
}

function PeriodStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "up" | "down" | "neutral";
}) {
  const color =
    tone === "up" ? "text-[#E03131]" : tone === "down" ? "text-[#1971C2]" : "text-foreground";
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-[10px] border border-[#E9ECEF] bg-white px-2 py-2.5">
      <span className="text-[10.5px] text-[#868E96]">{label}</span>
      <span className={cn("text-[13px] font-bold", color)}>{value}</span>
    </div>
  );
}

function ViewSegment({
  value,
  onChange,
}: {
  value: "chart" | "list";
  onChange: (v: "chart" | "list") => void;
}) {
  const opts: { id: "chart" | "list"; label: string }[] = [
    { id: "chart", label: "차트보기" },
    { id: "list", label: "목록보기" },
  ];
  return (
    <div className="ml-2 inline-flex shrink-0 rounded-[8px] bg-[#EDEFF2] p-0.5">
      {opts.map((o) => {
        const active = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={cn(
              "rounded-[6px] px-2.5 py-1 text-[12px] font-bold transition-colors",
              active ? "bg-white text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.08)]" : "text-[#6C757D]",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
