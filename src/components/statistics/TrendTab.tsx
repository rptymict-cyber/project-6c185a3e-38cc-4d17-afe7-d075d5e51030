import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ChevronRight, Plus, X } from "lucide-react";
import { MarketComparisonSheet } from "./MarketComparisonSheet";
import {
  TrendDualChart,
  type TrendChartPoint,
  type TrendChartSeries,
} from "./TrendDualChart";
import { Switch } from "@/components/ui/switch";
import {
  decodeSeriesId,
  getVarietyTrend,
  getYearComparisonTrend,
  SERIES_PALETTE,
  YEAR_PALETTE,
  type TrendPeriod,
} from "@/lib/mock/variety-trend";
import { useTrendCompare } from "@/store/trend-compare";
import { useMarketFilter } from "@/store/market";
import { cn } from "@/lib/utils";

const PERIODS: { id: TrendPeriod; label: string }[] = [
  { id: "1w", label: "1주" },
  { id: "1m", label: "1달" },
  { id: "3m", label: "3달" },
  { id: "1y", label: "1년" },
  { id: "5y", label: "5년" },
];

type ChartView = "both" | "price" | "volume";
const VIEW_OPTIONS: { id: ChartView; label: string }[] = [
  { id: "both", label: "가격+거래량" },
  { id: "price", label: "가격만" },
  { id: "volume", label: "거래량만" },
];

export function TrendTab({ varietyId }: { varietyId: string }) {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<TrendPeriod>("1w");
  const [chartView, setChartView] = useState<ChartView>("both");
  const [pickerOpen, setPickerOpen] = useState(false);
  const compareIds = useTrendCompare((s) => s.compareIds);
  const removeCompare = useTrendCompare((s) => s.removeCompare);
  const yearMode = useTrendCompare((s) => s.yearMode);
  const setYearMode = useTrendCompare((s) => s.setYearMode);
  const setSimpleMode = useMarketFilter((s) => s.setSimpleMode);

  // Base series (non-year mode).
  const baseSeries: TrendChartSeries[] = useMemo(
    () =>
      compareIds.map((id, i) => ({
        id,
        label: decodeSeriesId(id).label,
        color: SERIES_PALETTE[i % SERIES_PALETTE.length],
        disabled: yearMode,
      })),
    [compareIds, yearMode],
  );

  // Anchor market for year mode = first non-"all" selection, else "all".
  const anchorSeriesId = useMemo(
    () => compareIds.find((id) => id !== "all") ?? "all",
    [compareIds],
  );

  const points: TrendChartPoint[] = useMemo(() => {
    if (yearMode) {
      const { points: p, years } = getYearComparisonTrend({
        varietyId,
        marketId: anchorSeriesId,
        period,
      });
      return p.map((pt) => {
        const row: TrendChartPoint = { label: pt.label, volume: pt.totalVolumeTon };
        for (const y of years) row[y] = pt.prices[y];
        return row;
      });
    }
    const raw = getVarietyTrend({ varietyId, seriesIds: compareIds, period });
    return raw.map((pt) => {
      const row: TrendChartPoint = { label: pt.label, volume: pt.totalVolumeTon };
      for (const id of compareIds) row[id] = pt.prices[id];
      return row;
    });
  }, [varietyId, compareIds, period, yearMode, anchorSeriesId]);

  const yearSeries: TrendChartSeries[] = useMemo(
    () =>
      ["2022", "2023", "2024", "2025", "2026"].map((y) => ({
        id: y,
        label: `${y}년`,
        color: YEAR_PALETTE[y],
      })),
    [],
  );

  const chartSeries = yearMode ? yearSeries : baseSeries;

  // Period summary — 최고가/최저가/평균가/총 거래량 across the anchor series.
  const anchorKey = yearMode ? "2026" : (compareIds[0] ?? "all");
  const periodSummary = useMemo(() => {
    const prices: number[] = [];
    let vol = 0;
    for (const pt of points) {
      const v = pt[anchorKey];
      if (typeof v === "number") prices.push(v);
      vol += pt.volume;
    }
    if (prices.length === 0) {
      return { high: 0, low: 0, avg: 0, vol: 0 };
    }
    const high = Math.max(...prices);
    const low = Math.min(...prices);
    const avg = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
    return { high, low, avg, vol: Math.round(vol * 10) / 10 };
  }, [points, anchorKey]);

  return (
    <div className="pb-8">
      {/* Comparison chips */}
      <div className="mt-4 px-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {compareIds.map((id, i) => {
            const label = decodeSeriesId(id).label;
            const color = SERIES_PALETTE[i % SERIES_PALETTE.length];
            const dim = yearMode;
            const removable = id !== "all" && !dim;
            return (
              <span
                key={id}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-semibold",
                  dim
                    ? "border-[#E9ECEF] bg-[#F8F9FA] text-[#ADB5BD]"
                    : "border-[#E9ECEF] bg-white text-[#495057]",
                )}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: color, opacity: dim ? 0.4 : 1 }}
                />
                {label}
                {removable && (
                  <button
                    type="button"
                    onClick={() => removeCompare(id)}
                    aria-label={`${label} 제거`}
                    className="ml-0.5 grid h-4 w-4 place-items-center rounded-full text-[#868E96] hover:bg-[#F1F3F5]"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </span>
            );
          })}
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            disabled={yearMode}
            className={cn(
              "inline-flex items-center gap-1 rounded-full border border-dashed px-2.5 py-1 text-[12px] font-semibold",
              yearMode
                ? "border-[#E9ECEF] text-[#ADB5BD]"
                : "border-[#3A8A3A] text-[#3A8A3A]",
            )}
          >
            <Plus className="h-3 w-3" />
            시장 추가
          </button>
        </div>

        {yearMode && (
          <p className="mt-2 text-[11.5px] text-[#868E96]">
            연도 비교 중에는 시장 1개({decodeSeriesId(anchorSeriesId).label}) 기준으로 표시돼요
          </p>
        )}
      </div>

      {/* Period chips + year-mode toggle */}
      <div className="mt-4 flex items-center gap-2 px-4">
        <div className="no-scrollbar flex flex-1 gap-1.5 overflow-x-auto">
          {PERIODS.map((p) => {
            const active = p.id === period;
            return (
              <button
                key={p.id}
                type="button"
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
        <label className="flex shrink-0 items-center gap-1.5 text-[11.5px] font-semibold text-[#495057]">
          지난 5년
          <Switch
            checked={yearMode}
            onCheckedChange={setYearMode}
            className="data-[state=checked]:bg-[#3A8A3A]"
          />
        </label>
      </div>

      {/* Chart */}
      <div className="mt-4 px-2">
        <TrendDualChart points={points} series={chartSeries} unitLabel="원/kg" />
      </div>

      {/* Footer link */}
      <div className="mt-6 border-t border-[#F1F3F5]">
        <button
          type="button"
          onClick={() => {
            setSimpleMode(true);
            navigate({ to: "/market" });
          }}
          className="flex w-full items-center justify-center gap-1 py-4 text-[13px] font-semibold text-[#3A8A3A]"
        >
          이 품종 경매 내역 보기
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <MarketComparisonSheet open={pickerOpen} onOpenChange={setPickerOpen} />
    </div>
  );
}
