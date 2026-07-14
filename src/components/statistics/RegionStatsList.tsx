import { useState } from "react";
import { ChevronDown, ChevronUp, ChevronRight, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RegionStats } from "@/lib/services/region-stats";
import { LoadMoreButton, LIST_PAGE_SIZE } from "@/components/common/LoadMoreButton";


type Sort = "price-desc" | "price-asc" | "volume-desc";

const SORT_OPTIONS: { id: Sort; label: string }[] = [
  { id: "price-desc", label: "높은 평균가순" },
  { id: "price-asc", label: "낮은 평균가순" },
  { id: "volume-desc", label: "거래량순" },
];

export function RegionStatsList({
  regions,
  selected,
  onSelect,
  onOpenTrend,
}: {
  regions: RegionStats[];
  selected: string | null;
  onSelect: (region: string | null) => void;
  onOpenTrend: (region: string) => void;
}) {
  const [sort, setSort] = useState<Sort>("price-desc");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [expandedMarket, setExpandedMarket] = useState<string | null>(null);
  const [visible, setVisible] = useState(LIST_PAGE_SIZE);

  const sorted = [...regions].sort((a, b) => {
    if (sort === "price-desc") return b.avgKg - a.avgKg;
    if (sort === "price-asc") return a.avgKg - b.avgKg;
    return b.volumeTon - a.volumeTon;
  });
  const shown = sorted.slice(0, visible);

  return (
    <div className="px-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[15px] font-bold">지역별 평균가 목록</div>
          <div className="mt-0.5 text-[11.5px] text-[#868E96]">시·도 {regions.length}곳</div>
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          className="rounded-[8px] border border-[#E9ECEF] bg-white px-2 py-1.5 text-[12px] font-semibold text-[#495057]"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.id} value={o.id}>{o.label}</option>
          ))}
        </select>
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-t-[12px] border border-b-0 border-[#E9ECEF] bg-[#F8F9FA] px-3 py-2 text-[10.5px] font-bold text-[#6C757D]">
        <span className="w-5">#</span>
        <span className="flex-1">지역</span>
        <span className="text-right">평균가</span>
        <span className="w-14 text-right">전일대비</span>
        <span className="w-14 text-right">거래량</span>
        <span className="w-4" />
      </div>
      <ul className="divide-y divide-[#F1F3F5] rounded-b-[12px] border border-[#E9ECEF] bg-white overflow-hidden">

        {shown.map((r, idx) => {
          const active = selected === r.region;
          const open = !!expanded[r.region] || active;
          return (
            <li key={r.region} className={cn(active && "bg-[#F5FBF5]")}>
              <button
                type="button"
                onClick={() => {
                  onSelect(active ? null : r.region);
                  setExpanded((p) => ({ ...p, [r.region]: !open }));
                }}
                className="flex w-full items-center gap-2 px-3 py-3 text-left"
                aria-pressed={active}
              >
                <span
                  className={cn(
                    "w-5 text-[12px] font-bold tabular-nums",
                    active ? "text-[#1F5C1F]" : "text-[#868E96]",
                  )}
                >
                  {idx + 1}
                </span>
                <span className="flex-1 text-[13.5px] font-bold text-foreground">
                  {r.region}
                </span>
                <span className="text-[13px] font-bold tabular-nums">
                  {r.avgKg.toLocaleString()}<span className="text-[10.5px] font-semibold text-[#868E96]">원</span>
                </span>
                <span
                  className={cn(
                    "w-14 text-right text-[11.5px] font-bold tabular-nums",
                    r.deltaAmount > 0 ? "text-[#E03131]" : r.deltaAmount < 0 ? "text-[#1971C2]" : "text-[#868E96]",
                  )}
                >
                  {r.deltaAmount > 0 ? "+" : ""}{r.deltaAmount.toLocaleString()}원
                </span>
                <span className="w-14 text-right text-[11px] text-[#868E96] tabular-nums">
                  {r.volumeTon.toFixed(1)}t
                </span>
                <span className="hidden xs:block text-[11px] text-[#ADB5BD]">
                  도매시장 {r.marketCount}곳
                </span>
                {open ? (
                  <ChevronUp className="h-4 w-4 text-[#868E96]" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-[#868E96]" />
                )}
              </button>
              {open && (
                <ul className="border-t border-[#F1F3F5] bg-[#FBFDFB] px-3 pb-2">
                  <li className="flex items-center gap-2 pt-2 pb-1 text-[10.5px] font-bold text-[#868E96]">
                    <span className="h-4 w-4" />
                    <span className="flex-1">도매시장</span>
                    <span className="text-right">평균가</span>
                    <span className="w-12 text-right">전일대비</span>
                    <span className="w-12 text-right">거래량</span>
                    <span className="w-3.5" />
                  </li>

                  {r.markets.map((m) => {
                    const mKey = `${r.region}::${m.id}`;
                    const mOpen = expandedMarket === mKey;
                    return (
                      <li key={m.id}>
                        <button
                          type="button"
                          onClick={() => setExpandedMarket(mOpen ? null : mKey)}
                          className="flex w-full items-center gap-2 py-2 text-left"
                          aria-expanded={mOpen}
                        >
                          <Store className="h-4 w-4 text-[#3A8A3A]" />
                          <span className="flex-1 text-[13px] font-semibold">{m.name}</span>
                          <span className="text-[13px] font-bold tabular-nums">
                            {m.avgKg.toLocaleString()}<span className="text-[10px] text-[#868E96]">원</span>
                          </span>
                          <span
                            className={cn(
                              "w-12 text-right text-[11.5px] font-bold tabular-nums",
                              m.deltaAmount > 0 ? "text-[#E03131]" : m.deltaAmount < 0 ? "text-[#1971C2]" : "text-[#868E96]",
                            )}
                          >
                            {m.deltaAmount > 0 ? "▲" : m.deltaAmount < 0 ? "▼" : ""}{Math.abs(m.deltaPct).toFixed(1)}%
                          </span>
                          <span className="w-12 text-right text-[11px] text-[#868E96] tabular-nums">
                            {m.volumeTon.toFixed(1)}t
                          </span>
                          {mOpen ? (
                            <ChevronUp className="h-3.5 w-3.5 text-[#868E96]" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5 text-[#868E96]" />
                          )}
                        </button>
                        {mOpen && m.companies.length > 0 && (
                          <div className="mb-1 rounded-[8px] bg-white px-2 py-2">
                            <div className="flex items-center gap-2 pb-1 text-[10.5px] font-bold text-[#868E96]">
                              <span className="h-3 w-3" />
                              <span className="flex-1">법인</span>
                              <span className="text-right">평균가</span>
                              <span className="w-12 text-right">전일대비</span>
                              <span className="w-12 text-right">거래량</span>
                            </div>
                            <ul className="divide-y divide-[#F1F3F5]">
                              {m.companies.map((co) => (
                                <li key={co.name} className="flex items-center gap-2 py-1.5">
                                  <span className="h-3 w-3 rounded-full bg-[#DEE7DE]" />
                                  <span className="flex-1 text-[12.5px] text-[#495057]">{co.name}</span>
                                  <span className="text-[12.5px] font-bold tabular-nums">
                                    {co.avgKg.toLocaleString()}<span className="text-[10px] text-[#868E96]">원</span>
                                  </span>
                                  <span
                                    className={cn(
                                      "w-12 text-right text-[11px] font-bold tabular-nums",
                                      co.deltaAmount > 0 ? "text-[#E03131]" : co.deltaAmount < 0 ? "text-[#1971C2]" : "text-[#868E96]",
                                    )}
                                  >
                                    {co.deltaAmount > 0 ? "▲" : co.deltaAmount < 0 ? "▼" : ""}{Math.abs(co.deltaPct).toFixed(1)}%
                                  </span>
                                  <span className="w-12 text-right text-[11px] text-[#868E96] tabular-nums">
                                    {co.volumeTon.toFixed(1)}t
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </li>
                    );
                  })}
                  <li className="pt-1">
                    <button
                      type="button"
                      onClick={() => onOpenTrend(r.region)}
                      className="flex w-full items-center justify-center gap-1 rounded-[8px] border border-[#3A8A3A] py-2 text-[12.5px] font-bold text-[#3A8A3A]"
                    >
                      {r.region} 가격 추이 보기
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </li>
                </ul>
              )}
            </li>
          );
        })}
      </ul>

      {sorted.length > visible && (
        <LoadMoreButton onClick={() => setVisible((v) => v + LIST_PAGE_SIZE)} />
      )}
    </div>
  );
}
