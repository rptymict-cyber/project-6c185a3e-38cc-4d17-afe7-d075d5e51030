import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ChevronRight, Plus, X } from "lucide-react";
import { MarketComparisonSheet } from "./MarketComparisonSheet";
import {
  TrendDualChart,
  type TrendChartPoint,
  type TrendChartSeries,
} from "./TrendDualChart";
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
import { getCrop } from "@/lib/mock/crops";
import { cn } from "@/lib/utils";

const PERIODS: { id: TrendPeriod; label: string }[] = [
  { id: "1w", label: "일주일" },
  { id: "2w", label: "보름" },
  { id: "5y-w", label: "주간 5년" },
  { id: "5y-y", label: "연간 5년" },
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
  const hasTrendData = points.length > 0;

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

      {/* View segmented control */}
      <div className="mt-3 px-4">
        <div className="inline-flex w-full rounded-[10px] border border-[#E9ECEF] bg-[#F8F9FA] p-1">
          {VIEW_OPTIONS.map((opt) => {
            const active = opt.id === chartView;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setChartView(opt.id)}
                className={cn(
                  "flex-1 rounded-[8px] px-2 py-1.5 text-[12px] font-semibold transition-colors",
                  active
                    ? "bg-white text-foreground shadow-sm"
                    : "text-[#868E96] hover:text-[#495057]",
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart */}
      {hasTrendData ? (
        <>
          <div className="mt-3 px-2">
            <ChartRangeHeader
              firstLabel={points[0]?.label}
              lastLabel={points[points.length - 1]?.label}
              unitLabel={priceUnitLabel(varietyId)}
            />
            <TrendDualChart points={points} series={chartSeries} unitLabel={priceUnitLabel(varietyId)} view={chartView} />
          </div>

          {/* Hint */}
          <p className="mt-2 px-4 text-[11px] text-[#868E96]">
            그래프를 누르면 날짜별 상세 정보가 나옵니다
          </p>

          {/* Period summary */}
          <div className="mt-4 px-4">
            <div className="rounded-[12px] border border-[#E9ECEF] bg-white p-3">
              <div className="mb-2 text-[12px] font-bold text-foreground">선택 기간 요약</div>
              <div className="grid grid-cols-4 gap-2">
                <SummaryStat label="최고가" value={`${periodSummary.high.toLocaleString()}원`} tone="up" />
                <SummaryStat label="최저가" value={`${periodSummary.low.toLocaleString()}원`} tone="down" />
                <SummaryStat label="평균가" value={`${periodSummary.avg.toLocaleString()}원`} />
                <SummaryStat label="총 거래량" value={`${periodSummary.vol.toFixed(1)}t`} />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="mx-4 mt-4 rounded-[12px] border border-dashed border-[#E9ECEF] bg-[#F8F9FA] px-4 py-10 text-center">
          <div className="text-[13.5px] font-bold text-foreground">
            선택한 조건의 가격 추이 데이터가 없습니다
          </div>
          <p className="mt-2 text-[12px] leading-relaxed text-[#6C757D]">
            데이터가 제공되는 품목부터 순차적으로 확인할 수 있습니다.
          </p>
        </div>
      )}

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

function SummaryStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "up" | "down";
}) {
  const color =
    tone === "up" ? "text-[#E03131]" : tone === "down" ? "text-[#1971C2]" : "text-foreground";
  return (
    <div>
      <div className="text-[10.5px] font-semibold text-[#6C757D]">{label}</div>
      <div className={cn("mt-0.5 text-[12.5px] font-black tabular-nums leading-tight", color)}>
        {value}
      </div>
    </div>
  );
}

function priceUnitLabel(varietyId: string): string {
  const c = getCrop(varietyId);
  const m = c?.unit.match(/(\d+(?:\.\d+)?\s*kg)/i);
  return m ? `원/${m[1].replace(/\s+/g, "")}` : "원/kg";
}

function ChartRangeHeader({
  firstLabel,
  lastLabel,
  unitLabel,
}: {
  firstLabel?: string;
  lastLabel?: string;
  unitLabel: string;
}) {
  if (!firstLabel || !lastLabel) return null;
  return (
    <div className="mb-1 flex items-baseline justify-between px-2">
      <span className="text-[11.5px] font-semibold text-[#495057]">
        {firstLabel} ~ {lastLabel}
      </span>
      <span className="text-[11px] text-[#868E96]">평균가({unitLabel})</span>
    </div>
  );
}
