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
import { todayIso } from "@/lib/date";
import { useMemo, useState } from "react";



const PERIODS: { id: Period; label: string }[] = [
  { id: "today", label: "당일" },
  { id: "1w", label: "1주" },
  { id: "1m", label: "1개월" },
  { id: "3m", label: "3개월" },
  { id: "1y", label: "1년" },
];

function getLocalTodayISO() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function ProAnalysisSection() {
  const f = useMarketFilter();
  const tab = f.proTab;
  const setTab = f.setProTab;
  const [period, setPeriod] = useState<Period>("today");

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
  const isPredictable = !!getItemById(f.itemId)?.prediction.supported;
  const isTodayQuery = f.date === getLocalTodayISO();
  const showForecast =
    isTodayQuery &&
    (period === "1w" || period === "1m") &&
    isPredictable &&
    series.points.length > 0;

  const prediction: PredictionInput | undefined = useMemo(() => {
    if (!showForecast) return undefined;
    const last = series.points[series.points.length - 1];
    const days = period === "1w" ? 7 : 30;
    const drift = last.price * 0.01;
    const baseDate = new Date(last.date + "T00:00:00");
    const points: { label: string; tooltipLabel: string; price: number }[] = [];
    for (let k = 1; k <= days; k++) {
      const wave = Math.sin(k * 0.9) * (last.price * 0.015);
      const p = Math.round(last.price + drift * k + wave);
      const d = new Date(baseDate);
      d.setDate(d.getDate() + k);
      const label = `${d.getMonth() + 1}/${d.getDate()}`;
      points.push({ label, tooltipLabel: label, price: p });
    }
    let recIdx = 0;
    points.forEach((p, i) => {
      if (p.price > points[recIdx].price) recIdx = i;
    });
    return {
      points,
      recommendedIdx: recIdx,
      recommendedBadge: `추천 ${points[recIdx].label}`,
    };
  }, [showForecast, series, period]);

  const recommended = prediction?.points[prediction.recommendedIdx ?? 0];
  const recommendedDateText = useMemo(() => {
    if (!prediction || !recommended) return "";
    const last = series.points[series.points.length - 1];
    const baseDate = new Date(last.date + "T00:00:00");
    const k = (prediction.recommendedIdx ?? 0) + 1;
    const d = new Date(baseDate);
    d.setDate(d.getDate() + k);
    return `${d.getMonth() + 1}월 ${d.getDate()}일`;
  }, [prediction, recommended, series]);
  const recommendedDelta = recommended
    ? recommended.price - series.points[series.points.length - 1].price
    : 0;

  // Explicit X-axis tick labels per period.
  const ticks = useMemo(() => {
    const hist = series.points.map((p) => p.label);
    if (period === "today") {
      return ["00시", "04시", "08시", "12시", "16시", "20시"].filter((l) =>
        hist.includes(l),
      );
    }
    if (period === "1y") {
      return hist; // all 12 months
    }
    // When forecast is on, mix history + forecast labels around today/recommended.
    if (prediction && (period === "1w" || period === "1m")) {
      const fcst = prediction.points.map((p) => p.label);
      const todayLabel = hist[hist.length - 1];
      const recLabel =
        prediction.recommendedIdx != null
          ? prediction.points[prediction.recommendedIdx]?.label
          : undefined;
      const lastFcst = fcst[fcst.length - 1];
      const midFcst = fcst[Math.floor(fcst.length / 2)];
      const firstHist = hist[0];
      const midHist = hist[Math.floor(hist.length / 2)];
      const raw = [firstHist, midHist, todayLabel, midFcst, recLabel, lastFcst].filter(
        (v): v is string => !!v,
      );
      return Array.from(new Set(raw)).slice(0, 7);
    }
    // 1m / 3m without forecast: sample up to 6 evenly spaced history labels
    const max = 6;
    if (hist.length <= max) return hist;
    const step = (hist.length - 1) / (max - 1);
    const seen = new Set<number>();
    const out: string[] = [];
    for (let i = 0; i < max; i++) {
      const idx = i === max - 1 ? hist.length - 1 : Math.round(i * step);
      if (!seen.has(idx)) {
        seen.add(idx);
        out.push(hist[idx]);
      }
    }
    return out;
  }, [series, period, prediction]);


  // Bottom notice text
  const noticeText = (() => {
    if (period === "today") {
      if (isTodayQuery) return "오늘 시간대별 경매 데이터를 제공합니다.";
      const d = new Date(f.date + "T00:00:00");
      return `${d.getMonth() + 1}월 ${d.getDate()}일 시간대별 경매 데이터를 제공합니다.`;
    }
    if (showForecast && period === "1w")
      return "차트는 경매일 기준 · 오늘 이후 7일은 AI 예측입니다.";
    if (showForecast && period === "1m")
      return "차트는 경매일 기준 · 오늘 이후 30일은 AI 예측입니다.";
    return "차트는 경매일 기준이며, 선택한 기간의 데이터를 제공합니다.";
  })();

  return (
    <section className="mt-3 bg-white pt-1">
      {/* Tab bar */}
      <div className="flex items-center border-b border-[#E9ECEF]">
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
          <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 px-1 text-[11px] text-[#495057]">
            <span className="flex items-center gap-1">
              <span className="inline-block h-[2px] w-3 rounded-full bg-[#E03131]" />
              평균가(원/{unitLabel})
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-3 rounded-sm bg-[#E03131]/20" />
              거래량
            </span>
            {showForecast && (
              <span className="flex items-center gap-1">
                <span
                  className="inline-block h-[2px] w-4"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, #2E9E6B 0 4px, transparent 4px 8px, #2E9E6B 8px 12px, transparent 12px 16px)",
                  }}
                />
                예측
              </span>
            )}
          </div>

          <div className="rounded-[12px] border border-[#F1F3F5] bg-white p-2 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <PriceVolumeChart series={series} period={period} prediction={prediction} ticks={ticks} />
          </div>

          <p className="mt-3 px-1 text-[11px] text-[#868E96]">
            {showForecast ? (
              <>
                차트는 경매일 기준 ·{" "}
                <span className="font-bold text-[#2E9E6B]">
                  {period === "1w"
                    ? "오늘 이후 7일은 AI 예측입니다."
                    : "오늘 이후 30일은 AI 예측입니다."}
                </span>
              </>
            ) : (
              noticeText
            )}
          </p>

          {/* AI prediction recommendation card */}
          {showForecast && prediction && recommended && (
            <div
              className="mt-3 rounded-[14px] px-[15px] py-[14px] text-white shadow-[0_2px_10px_rgba(46,158,107,0.28)]"
              style={{
                backgroundImage:
                  "linear-gradient(160deg, #2E9E6B 0%, #1F7A50 100%)",
              }}
            >
              <div className="flex items-start gap-3">
                <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-[#FFE9A3]" />
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-extrabold leading-tight">
                    {recommendedDateText} 출하를 추천해요
                  </div>
                  <div className="mt-1 text-[11.5px] leading-snug text-white/90">
                    예상가 {recommended.price.toLocaleString()}원/{unitLabel} ·{" "}
                    {recommendedDelta > 0
                      ? `오늘보다 ${recommendedDelta.toLocaleString()}원 높아요`
                      : recommendedDelta < 0
                        ? `오늘보다 ${Math.abs(recommendedDelta).toLocaleString()}원 낮아요`
                        : "오늘과 같아요"}
                  </div>
                </div>
              </div>
              <Link
                to="/prediction"
                className="mt-3 flex w-full items-center justify-center gap-0.5 whitespace-nowrap rounded-[10px] bg-white px-[13px] py-[9px] text-[12.5px] font-extrabold text-[#1F7A50]"
              >
                AI 예측 보기
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
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
