import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AppHeader } from "@/components/app-header";
import { DatePickerSheet } from "@/components/date-picker-sheet";
import { useStatistics } from "@/store/statistics";
import {
  CROPS, PERIODS, buildTrend, buildSnapshot, getOriginShare, getMarketShare,
} from "@/lib/mock/statistics-mock";
import { StatsCropSheet } from "@/components/statistics/StatsCropSheet";
import { StatsMarketSheet } from "@/components/statistics/StatsMarketSheet";
import { StatsTrendChart } from "@/components/statistics/StatsTrendChart";
import { StatsDonut } from "@/components/statistics/StatsDonut";
import { StatsSnapshotTable } from "@/components/statistics/StatsSnapshotTable";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/statistics/")({
  component: StatisticsPage,
  head: () => ({
    meta: [
      { title: "농산물 통계 — AGDICT" },
      { name: "description", content: "작물별 가격·거래량 추이와 시장별 시세를 확인하세요." },
    ],
  }),
});

function deltaClass(v: number) {
  if (v > 0) return "text-[#E03131]";
  if (v < 0) return "text-[#1971C2]";
  return "text-[#868E96]";
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  const wk = ["일","월","화","수","목","금","토"][dt.getDay()];
  return `${y}.${String(m).padStart(2,"0")}.${String(d).padStart(2,"0")} (${wk})`;
}

function StatisticsPage() {
  const { crop, markets, period, date, tab, setCrop, setMarkets, setPeriod, setDate, setTab } = useStatistics();
  const [cropOpen, setCropOpen] = useState(false);
  const [marketOpen, setMarketOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);

  const trend = useMemo(() => buildTrend(crop, markets, period), [crop, markets, period]);
  const snapshot = useMemo(() => buildSnapshot(crop, date), [crop, date]);
  const origin = useMemo(() => getOriginShare(crop), [crop]);
  const share = useMemo(() => getMarketShare(crop), [crop]);

  const cropDef = CROPS[crop];
  const marketLabel = markets.length === 1 ? markets[0] : `${markets[0]} 외 ${markets.length - 1}`;

  const avgAll = useMemo(() => {
    if (trend.length === 0) return 0;
    const first = markets[0];
    const sum = trend.reduce((s, p) => s + (typeof p[first] === "number" ? (p[first] as number) : 0), 0);
    return Math.round(sum / trend.length);
  }, [trend, markets]);
  const totalVol = useMemo(() => Math.round(trend.reduce((s, p) => s + p.volume, 0) * 10) / 10, [trend]);
  const currentPrice = trend.length ? (trend[trend.length - 1][markets[0]] as number) : 0;
  const prevPrice = trend.length > 1 ? (trend[trend.length - 2][markets[0]] as number) : currentPrice;
  const curDelta = currentPrice - prevPrice;
  const curPct = prevPrice > 0 ? Math.round((curDelta / prevPrice) * 1000) / 10 : 0;

  return (
    <AppShell
      header={<AppHeader title="통계" />}
    >
      {/* Filter bar */}
      <div className="sticky top-[52px] z-20 space-y-2 border-b border-[#E9ECEF] bg-white px-4 pb-2 pt-3">
        <button
          type="button"
          onClick={() => setCropOpen(true)}
          className="flex w-full items-center justify-between rounded-[10px] border border-[#E9ECEF] bg-white px-3 py-2.5 text-left active:bg-[#F8F9FA]"
        >
          <span className="flex items-center gap-2">
            <span className="text-[18px] leading-none">{cropDef.emoji}</span>
            <span className="text-[14px] font-bold text-foreground">{cropDef.name}</span>
          </span>
          <ChevronDown className="h-4 w-4 text-[#868E96]" />
        </button>

        {/* Tabs */}
        <div className="flex">
          {([
            { id: "trend", label: "가격·거래량 추이" },
            { id: "snapshot", label: "시장별 시세" },
          ] as const).map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "relative flex-1 pb-2 pt-1.5 text-[13.5px] font-semibold",
                  active ? "text-foreground" : "text-[#868E96]",
                )}
              >
                {t.label}
                {active && <span className="absolute inset-x-3 -bottom-[2px] h-[2px] rounded bg-[#3A8A3A]" />}
              </button>
            );
          })}
        </div>

        {/* Tab-specific filters */}
        {tab === "trend" ? (
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={() => setMarketOpen(true)}
              className="flex w-full items-center justify-between rounded-[10px] border border-[#E9ECEF] bg-white px-3 py-2 text-left active:bg-[#F8F9FA]"
            >
              <span className="text-[13.5px] font-semibold">{marketLabel}</span>
              <ChevronDown className="h-4 w-4 text-[#868E96]" />
            </button>
            <div className="flex gap-1 overflow-x-auto">
              {PERIODS.map((p) => {
                const active = p === period;
                return (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={cn(
                      "shrink-0 rounded-full px-3 py-1.5 text-[12.5px] font-semibold",
                      active ? "bg-[#3A8A3A] text-white" : "bg-[#F1F3F5] text-[#495057]",
                    )}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setDateOpen(true)}
            className="flex w-full items-center justify-between rounded-[10px] border border-[#E9ECEF] bg-white px-3 py-2 text-left active:bg-[#F8F9FA]"
          >
            <span className="text-[13.5px] font-semibold">{formatDate(date)}</span>
            <ChevronDown className="h-4 w-4 text-[#868E96]" />
          </button>
        )}
      </div>

      {/* Body */}
      <div className="px-4 pb-8 pt-4">
        {tab === "trend" ? (
          <>
            {/* KPI */}
            <div className="grid grid-cols-3 gap-2">
              <Kpi label={`기간 평균가${markets.length > 1 ? ` (${markets[0]})` : ""}`} value={`${avgAll.toLocaleString()}`} unit="원/kg" />
              <Kpi label="총 거래량" value={`${totalVol}`} unit="t" />
              <Kpi
                label={`현재가${markets.length > 1 ? ` (${markets[0]})` : ""}`}
                value={currentPrice.toLocaleString()}
                unit="원"
                extra={
                  <span className={cn("text-[11px] font-bold tabular-nums", deltaClass(curDelta))}>
                    {curDelta > 0 ? "▲" : curDelta < 0 ? "▼" : ""} {Math.abs(curPct)}%
                  </span>
                }
              />
            </div>

            {/* Combo chart */}
            <section className="mt-4 rounded-[12px] border border-[#E9ECEF] bg-white p-3">
              <StatsTrendChart points={trend} marketIds={markets} />
            </section>

            {/* Donuts */}
            <div className="mt-4 grid grid-cols-1 gap-3">
              <StatsDonut title="주산지 비율" data={origin} />
              <StatsDonut title="도매시장별 거래" data={share.map((s) => ({ name: s.name, value: s.value }))} />
            </div>
          </>
        ) : (
          <StatsSnapshotTable data={snapshot} />
        )}
      </div>

      <StatsCropSheet open={cropOpen} onOpenChange={setCropOpen} selected={crop} onSelect={setCrop} />
      <StatsMarketSheet open={marketOpen} onOpenChange={setMarketOpen} selected={markets} onConfirm={setMarkets} />
      <DatePickerSheet open={dateOpen} onOpenChange={setDateOpen} selected={date} onConfirm={setDate} />
    </AppShell>
  );
}

function Kpi({ label, value, unit, extra }: { label: string; value: string; unit?: string; extra?: React.ReactNode }) {
  return (
    <div className="rounded-[12px] border border-[#E9ECEF] bg-white p-3">
      <div className="truncate text-[10.5px] font-medium text-[#868E96]">{label}</div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-[16px] font-black tabular-nums text-foreground">{value}</span>
        {unit && <span className="text-[10.5px] font-medium text-[#868E96]">{unit}</span>}
      </div>
      {extra && <div className="mt-0.5">{extra}</div>}
    </div>
  );
}
