import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ChevronRight, Sparkles } from "lucide-react";
import type { ChartRow } from "@/components/price-volume-chart";
import { PriceVolumeChart } from "@/components/price-volume-chart";
import { getCrop } from "@/lib/mock/crops";
import { useMarketFilter } from "@/store/market";
import { DataSourceNotice } from "@/components/home/DataSourceNotice";
import { cn } from "@/lib/utils";
import type { MarketDetailTab } from "./types";

type PeriodId = "today" | "1w" | "1m" | "3m" | "1y";
const PERIODS: { id: PeriodId; label: string }[] = [
  { id: "today", label: "당일" },
  { id: "1w", label: "1주" },
  { id: "1m", label: "1개월" },
  { id: "3m", label: "3개월" },
  { id: "1y", label: "1년" },
];

function todayIso() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

/** deterministic PRNG so charts don't drift between renders / SSR. */
function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

function buildRows(
  basePrice: number,
  baseVolTon: number,
  seed: number,
  period: PeriodId,
  refIso: string,
  showForecast: boolean,
): { rows: ChartRow[]; todayLabel?: string; lastLabel?: string } {
  const rng = seeded(seed);
  const wave = (i: number, vol: number) =>
    Math.round(basePrice * (1 + (rng() - 0.5) * vol));

  const ref = new Date(refIso);
  const rows: ChartRow[] = [];

  if (period === "today") {
    // 24 hourly points on ref date
    for (let h = 0; h < 24; h += 1) {
      rows.push({
        label: `${String(h).padStart(2, "0")}시`,
        date: refIso,
        price: wave(h, 0.03),
        volume: Math.max(1, Math.round(baseVolTon * (0.6 + rng() * 0.8))),
        forecast: null,
      });
    }
    return { rows };
  }

  const genDaily = (nBefore: number, nAfter: number) => {
    let todayLabel: string | undefined;
    for (let i = -nBefore; i <= nAfter; i += 1) {
      const d = new Date(ref);
      d.setDate(ref.getDate() + i);
      const label = `${d.getMonth() + 1}/${d.getDate()}`;
      const iso = d.toISOString().slice(0, 10);
      const isToday = i === 0;
      const isPast = i <= 0;
      const price = isPast ? wave(i, 0.06) : null;
      const volume = isPast
        ? Math.max(1, Math.round(baseVolTon * (0.6 + rng() * 0.8)))
        : null;
      // forecast trend: slight positive drift ± noise
      const forecast =
        !isPast || isToday
          ? Math.round(basePrice * (1 + i * 0.006 + (rng() - 0.5) * 0.04))
          : null;
      rows.push({
        label,
        date: iso,
        price,
        volume,
        forecast: showForecast ? forecast : null,
        isToday,
      });
      if (isToday) todayLabel = label;
    }
    return { todayLabel, lastLabel: rows[rows.length - 1]?.label };
  };

  if (period === "1w") {
    const forecastDays = showForecast ? 7 : 0;
    const { todayLabel, lastLabel } = genDaily(6, forecastDays);
    return { rows, todayLabel, lastLabel };
  }
  if (period === "1m") {
    const forecastDays = showForecast ? 30 : 0;
    const { todayLabel, lastLabel } = genDaily(29, forecastDays);
    return { rows, todayLabel, lastLabel };
  }
  if (period === "3m") {
    // 13 weekly buckets ending at ref
    for (let i = 12; i >= 0; i -= 1) {
      const d = new Date(ref);
      d.setDate(ref.getDate() - i * 7);
      const weekInMonth = Math.ceil(d.getDate() / 7);
      rows.push({
        label: `${d.getMonth() + 1}월${weekInMonth}주`,
        date: d.toISOString().slice(0, 10),
        price: wave(i, 0.08),
        volume: Math.max(1, Math.round(baseVolTon * 7 * (0.6 + rng() * 0.8))),
        forecast: null,
      });
    }
    return { rows };
  }
  // 1y — 12 monthly points
  for (let i = 11; i >= 0; i -= 1) {
    const d = new Date(ref);
    d.setMonth(ref.getMonth() - i, 1);
    rows.push({
      label: `${d.getMonth() + 1}월`,
      date: d.toISOString().slice(0, 10),
      price: wave(i, 0.12),
      volume: Math.max(1, Math.round(baseVolTon * 30 * (0.6 + rng() * 0.8))),
      forecast: null,
    });
  }
  return { rows };
}

export function MarketChartView({
  cropId,
  onJumpTab,
}: {
  cropId: string;
  onJumpTab: (t: MarketDetailTab) => void;
}) {
  const [period, setPeriod] = useState<PeriodId>("1w");
  const navigate = useNavigate();
  const filterDate = useMarketFilter((s) => s.date);
  const crop = getCrop(cropId);

  const refIso = filterDate || todayIso();
  const isToday = refIso === todayIso();
  const isPredictable = !!crop?.isPredictable;
  const showForecast =
    isPredictable && isToday && (period === "1w" || period === "1m");

  const seed = useMemo(
    () => cropId.split("").reduce((s, ch) => s + ch.charCodeAt(0), 0),
    [cropId],
  );

  const built = useMemo(() => {
    if (!crop) return { rows: [] as ChartRow[] };
    return buildRows(
      crop.currentPrice,
      crop.volumeTon,
      seed,
      period,
      refIso,
      showForecast,
    );
  }, [crop, seed, period, refIso, showForecast]);

  const { rows, todayLabel, lastLabel } = built;

  // 추천 = 예측 구간 중 가장 높은 예상가 (농민 관점 기본)
  const recommend = useMemo(() => {
    if (!showForecast) return undefined;
    const future = rows.filter((r) => r.price == null && r.forecast != null);
    if (future.length === 0) return undefined;
    let best = future[0];
    for (const r of future) if (r.forecast! > best.forecast!) best = r;
    return best;
  }, [rows, showForecast]);

  const todayPrice = rows.find((r) => r.isToday)?.price ?? crop?.currentPrice ?? 0;
  const recommendDiff = recommend ? recommend.forecast! - todayPrice : 0;

  const highPast = useMemo(() => {
    const pastPrices = rows.filter((r) => r.price != null).map((r) => r.price!);
    return pastPrices.length ? Math.max(...pastPrices) : 0;
  }, [rows]);
  const lowPast = useMemo(() => {
    const pastPrices = rows.filter((r) => r.price != null).map((r) => r.price!);
    return pastPrices.length ? Math.min(...pastPrices) : 0;
  }, [rows]);
  const volSum = useMemo(
    () => rows.reduce((s, r) => s + (r.volume ?? 0), 0),
    [rows],
  );

  return (
    <div className="px-4 pb-40 pt-3">
      <div className="rounded-[12px] border border-[#E9ECEF] bg-background p-3">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-[14px] font-bold">가격 추이</h3>
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[#E03B3B]" /> 평균가(원/kg)
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-sm bg-[#F3C6C6]" /> 거래량(t)
            </span>
            {showForecast && (
              <span className="flex items-center gap-1">
                <span className="inline-block h-0.5 w-3 border-t-2 border-dashed border-[#2E9E6B]" />
                예측
              </span>
            )}
          </div>
        </div>

        {!isToday && (
          <p className="mb-1 text-[11px] text-muted-foreground">
            {refIso.slice(5).replace("-", "월 ")}일 기준 실제 시세입니다.
          </p>
        )}

        <PriceVolumeChart
          data={rows}
          showForecast={showForecast}
          todayLabel={todayLabel}
          lastLabel={lastLabel}
          recommendLabel={recommend?.label}
          recommendPrice={recommend?.forecast ?? undefined}
          recommendDate={recommend?.label}
        />

        <div className="mt-2 flex flex-wrap gap-1.5">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={cn(
                "rounded-full px-3 py-1 text-[12px] font-semibold",
                period === p.id
                  ? "bg-[#2E9E6B] text-white"
                  : "bg-[#F1F3F5] text-muted-foreground",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* 리포트 유도 배너 (예측 가능 시에만) */}
      {showForecast && recommend && (
        <button
          type="button"
          onClick={() =>
            navigate({
              to: "/prediction",
              search: { cropId },
            })
          }
          className="mt-3 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-white shadow-[0_12px_30px_-14px_rgba(46,158,107,0.6)]"
          style={{
            background: "linear-gradient(160deg,#2E9E6B 0%,#1F7A50 100%)",
          }}
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/20">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[14px] font-black leading-tight">
              {recommend.label} 출하가 유리해요
            </span>
            <span className="mt-0.5 block text-[11.5px] font-semibold opacity-90">
              오늘보다 {recommendDiff >= 0 ? "+" : ""}
              {recommendDiff.toLocaleString()}원 · 자세한 예측은 리포트에서
            </span>
          </span>
          <span className="shrink-0 rounded-full bg-white px-3 py-1.5 text-[12px] font-bold text-[#1F7A50]">
            리포트 보기
          </span>
        </button>
      )}

      <button
        onClick={() => onJumpTab("auction")}
        className="mt-3 flex w-full items-center justify-between rounded-[12px] border border-[#E9ECEF] bg-background px-4 py-3.5 text-[14px] font-semibold text-foreground active:bg-secondary"
      >
        일별·시장별 시세 보기
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </button>

      <div className="mt-3 grid grid-cols-4 gap-2 rounded-[12px] border border-[#E9ECEF] bg-background p-3 text-center">
        <Stat label="최고 평균가" value={`${highPast.toLocaleString()}`} unit="원/kg" />
        <Stat label="최저 평균가" value={`${lowPast.toLocaleString()}`} unit="원/kg" />
        <Stat label="거래량 합" value={`${volSum.toLocaleString()}`} unit="t" />
        <Stat label="표본 수" value="732" unit="건" />
      </div>

      <p className="mt-2 text-[11px] text-muted-foreground">
        오늘 14:30 기준 · 총 10개 도매시장
      </p>

      <DataSourceNotice />
    </div>
  );
}

function Stat({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-data text-[14px] font-bold tabular-nums">
        {value}
        <span className="ml-0.5 text-[10px] font-medium text-muted-foreground">{unit}</span>
      </div>
    </div>
  );
}
