import { useMemo, useState } from "react";
import { Calendar, X, ChevronRight, ChevronDown, ChevronUp, Map as MapIcon, List as ListIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CompactSelectCard } from "@/components/common/ConditionSelectCard";
import { DatePickerSheet, defaultTradingDayFilter } from "@/components/date-picker-sheet";
import { getVarietyMarketAverages } from "@/lib/mock/variety-market-averages";
import { computeRegionStats, pickTopRegion } from "@/lib/services/region-stats";
import { KoreaRegionMap } from "./KoreaRegionMap";
import { RegionStatsList } from "./RegionStatsList";

type View = "map" | "list";

export function RegionalStatsTab({
  varietyId,
  date,
  onDateChange,
  selectedRegion,
  onSelectRegion,
  onOpenTrend,
}: {
  varietyId: string;
  date: string;
  onDateChange: (iso: string) => void;
  selectedRegion: string | null;
  onSelectRegion: (r: string | null) => void;
  onOpenTrend: (region: string) => void;
}) {
  const [view, setView] = useState<View>("map");
  const [dateOpen, setDateOpen] = useState(false);

  const data = useMemo(
    () => getVarietyMarketAverages({ varietyId, date }),
    [varietyId, date],
  );
  const regions = useMemo(() => computeRegionStats(data), [data]);
  const top = useMemo(() => pickTopRegion(regions), [regions]);

  const selectedStats = selectedRegion
    ? regions.find((r) => r.region === selectedRegion) ?? null
    : null;

  // KPI: 지역 선택 상태면 지역 KPI, 아니면 전국.
  const kpi = selectedStats
    ? {
        headerA: `${selectedStats.region} 대표 평균`,
        avg: selectedStats.avgKg,
        deltaAmount: selectedStats.deltaAmount,
        deltaPct: selectedStats.deltaPct,
        volumeTon: selectedStats.volumeTon,
        headerC: "지역 거래량",
      }
    : {
        headerA: "전국 가중 평균",
        avg: data.overall.avgKg,
        deltaAmount: data.overall.deltaAmount,
        deltaPct: data.overall.deltaPct,
        volumeTon: data.overall.volumeTon,
        headerC: "총 거래량",
      };

  return (
    <div className="pb-6">
      {/* Date */}
      <div className="px-4 pt-4">
        <CompactSelectCard
          icon={<Calendar className="h-3.5 w-3.5" />}
          label="조회 날짜"
          value={date.replaceAll("-", ".")}
          onClick={() => setDateOpen(true)}
        />
        {data.differentFromRequest && (
          <div className="mt-2 rounded-[8px] bg-[#F0F9F0] px-3 py-2 text-[11.5px] font-semibold text-[#1F5C1F]">
            {data.requestedDateLabel} 휴장으로 직전 거래일({data.effectiveDateLabel}) 표시
          </div>
        )}
      </div>

      {/* KPI cards */}
      <div className="mt-3 grid grid-cols-3 gap-2 px-4">
        <KpiCard label={kpi.headerA} value={`${kpi.avg.toLocaleString()}원`} />
        {selectedStats ? (
          <KpiCard
            label="전일 대비"
            value={`${kpi.deltaAmount > 0 ? "+" : ""}${kpi.deltaAmount.toLocaleString()}원`}
            sub={`${Math.abs(kpi.deltaPct).toFixed(2)}%`}
            tone={kpi.deltaAmount > 0 ? "up" : kpi.deltaAmount < 0 ? "down" : "flat"}
          />
        ) : (
          <KpiCard
            label="최고 평균 지역"
            value={top ? top.region.replace(/(특별시|광역시|특별자치도|특별자치시|도)$/, "") : "-"}
            tone="flat"
          />
        )}
        <KpiCard
          label={kpi.headerC}
          value={`${kpi.volumeTon.toFixed(1)}t`}
        />
      </div>
      <p className="mt-2 px-4 text-[11px] text-[#868E96]">
        ⓘ 지역 대표값은 도매시장 거래량 가중 평균입니다.
      </p>

      {/* Section header + view toggle */}
      <div className="mt-4 flex items-center justify-between px-4">
        <div className="text-[15px] font-bold">
          {view === "map" ? "전국 지역별 평균가" : "지역별 평균가 목록"}
        </div>
        <div className="inline-flex rounded-[10px] border border-[#E9ECEF] bg-white p-1">
          <ToggleBtn active={view === "map"} onClick={() => setView("map")}>
            <MapIcon className="h-3.5 w-3.5" />지도
          </ToggleBtn>
          <ToggleBtn active={view === "list"} onClick={() => setView("list")}>
            <ListIcon className="h-3.5 w-3.5" />목록
          </ToggleBtn>
        </div>
      </div>

      {view === "map" ? (
        <div className="mt-2 mx-4 rounded-[12px] border border-[#E9ECEF] bg-white p-2">
          <KoreaRegionMap
            regions={regions}
            selected={selectedRegion}
            onSelect={onSelectRegion}
          />
        </div>
      ) : (
        <div className="mt-3">
          <RegionStatsList
            regions={regions}
            selected={selectedRegion}
            onSelect={onSelectRegion}
            onOpenTrend={onOpenTrend}
          />
        </div>
      )}

      {/* Selected region detail panel (map view only) */}
      {view === "map" && selectedStats && (
        <div className="mt-3 mx-4 rounded-[12px] border border-[#E9ECEF] bg-white p-3">
          <div className="flex items-center justify-between">
            <div className="text-[14px] font-bold">{selectedStats.region} 도매시장 통계</div>
            <button
              type="button"
              onClick={() => onSelectRegion(null)}
              className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#868E96]"
            >
              지역 해제 <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="mt-2 text-[11.5px] text-[#868E96]">
            도매시장 {selectedStats.marketCount}곳 · 높은 평균가순
          </div>
          <ul className="mt-2 divide-y divide-[#F1F3F5]">
            {[...selectedStats.markets]
              .sort((a, b) => b.avgKg - a.avgKg)
              .map((m) => (
                <li key={m.id} className="flex items-center gap-2 py-2.5">
                  <span className="grid h-6 w-6 place-items-center rounded bg-[#EAF7EA] text-[#3A8A3A]">🏪</span>
                  <span className="flex-1 text-[13.5px] font-semibold">{m.name}</span>
                  <span className="text-[13.5px] font-bold tabular-nums">
                    {m.avgKg.toLocaleString()}<span className="text-[10.5px] font-semibold text-[#868E96]">원</span>
                  </span>
                  <span
                    className={cn(
                      "w-14 text-right text-[11.5px] font-bold tabular-nums",
                      m.deltaAmount > 0 ? "text-[#E03131]" : m.deltaAmount < 0 ? "text-[#1971C2]" : "text-[#868E96]",
                    )}
                  >
                    {m.deltaAmount > 0 ? "▲" : m.deltaAmount < 0 ? "▼" : ""}{Math.abs(m.deltaPct).toFixed(1)}%
                  </span>
                  <span className="w-12 text-right text-[11.5px] text-[#868E96] tabular-nums">
                    {m.volumeTon.toFixed(1)}t
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-[#CED4DA]" />
                </li>
              ))}
          </ul>
          <button
            type="button"
            onClick={() => onOpenTrend(selectedStats.region)}
            className="mt-2 flex w-full items-center justify-center gap-1 rounded-[10px] border border-[#3A8A3A] py-3 text-[13px] font-bold text-[#3A8A3A]"
          >
            {selectedStats.region} 가격 추이 보기
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Empty-data selection */}
      {selectedRegion && !selectedStats && (
        <div className="mt-3 mx-4 rounded-[12px] border border-dashed border-[#E9ECEF] bg-[#F8F9FA] p-4 text-center">
          <div className="text-[13.5px] font-bold">{selectedRegion}</div>
          <p className="mt-1 text-[12px] text-[#6C757D]">
            선택한 날짜에 제공되는 도매시장 데이터가 없어요.
            <br />다른 지역 또는 날짜를 선택해주세요.
          </p>
          <button
            type="button"
            onClick={() => onSelectRegion(null)}
            className="mt-3 text-[12px] font-semibold text-[#3A8A3A]"
          >
            선택 해제
          </button>
        </div>
      )}

      <DatePickerSheet
        open={dateOpen}
        onOpenChange={setDateOpen}
        selected={date}
        onConfirm={onDateChange}
        hasDataFor={defaultTradingDayFilter}
      />
    </div>
  );
}

function KpiCard({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "up" | "down" | "flat";
}) {
  const color =
    tone === "up" ? "text-[#E03131]" : tone === "down" ? "text-[#1971C2]" : "text-[#1F5C1F]";
  return (
    <div className="rounded-[10px] border border-[#E9ECEF] bg-white px-2 py-2">
      <div className="text-[10.5px] font-semibold text-[#6C757D]">{label}</div>
      <div className={cn("mt-1 text-[13px] font-black tabular-nums leading-tight", color)}>
        {value}
      </div>
      {sub && <div className="mt-0.5 text-[10px] text-[#868E96]">{sub}</div>}
    </div>
  );
}

function ToggleBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 rounded-[8px] px-2.5 py-1 text-[12px] font-bold",
        active ? "bg-[#EAF7EA] text-[#1F5C1F] border border-[#3A8A3A]" : "text-[#868E96]",
      )}
    >
      {children}
    </button>
  );
}
