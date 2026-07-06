import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { List, Table as TableIcon, ChevronDown } from "lucide-react";
import { useMarketFilter } from "@/store/market";
import {
  applySecondaryFilters,
  countBy,
  listAuctions,
  summarize,
  type AuctionRecord,
} from "@/lib/mock/auctions";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 20;

export function SimpleModeView() {
  const f = useMarketFilter();

  const all = useMemo(
    () =>
      listAuctions({
        categoryLabel: f.categoryLabel,
        itemLabel: f.itemLabel,
        varietyLabel: f.varietyLabel,
        marketLabel: f.marketLabel,
        marketId: f.marketId,
        date: f.date,
      }),
    [f.categoryLabel, f.itemLabel, f.varietyLabel, f.marketLabel, f.marketId, f.date],
  );

  const [origin, setOrigin] = useState("all");
  const [pkg, setPkg] = useState("all");
  const [view, setView] = useState<"list" | "table">("list");
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () => applySecondaryFilters(all, origin, pkg),
    [all, origin, pkg],
  );

  const originCounts = useMemo(() => countBy(all, (r) => r.origin), [all]);
  const packageCounts = useMemo(() => countBy(all, (r) => r.packageLabel), [all]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice(0, page * PAGE_SIZE);

  const summary = useMemo(() => summarize(filtered), [filtered]);

  return (
    <div className="bg-white pb-[100px]">
      {/* Summary bar */}
      <div className="border-b border-[#F1F3F5] px-4 py-3 text-center text-[12.5px] leading-relaxed text-[#495057]">
        <div>
          <span className="font-bold text-[#3A8A3A]">{all.length}건</span>
          {"  "}분류: {f.categoryLabel} → {f.itemLabel} → {f.varietyLabel}
        </div>
        <div className="mt-0.5">도매시장/법인: {f.marketLabel} → {f.corpLabel}</div>
      </div>

      {/* Secondary filter chips */}
      <div className="no-scrollbar flex gap-1.5 overflow-x-auto px-4 py-2.5">
        <FilterChip
          label="출하지 전체"
          active={origin === "all"}
          onClick={() => setOrigin("all")}
        />
        {Object.entries(originCounts)
          .sort((a, b) => b[1] - a[1])
          .map(([k, n]) => (
            <FilterChip
              key={k}
              label={`${k} (${n})`}
              active={origin === k}
              onClick={() => {
                setOrigin(k);
                setPage(1);
              }}
            />
          ))}
      </div>
      <div className="no-scrollbar flex gap-1.5 overflow-x-auto px-4 pb-2">
        <FilterChip
          label="규격 전체"
          active={pkg === "all"}
          onClick={() => setPkg("all")}
        />
        {Object.entries(packageCounts)
          .sort((a, b) => b[1] - a[1])
          .map(([k, n]) => (
            <FilterChip
              key={k}
              label={`${k} (${n})`}
              active={pkg === k}
              onClick={() => {
                setPkg(k);
                setPage(1);
              }}
            />
          ))}
      </div>

      {/* View toggle */}
      <div className="flex items-center justify-end px-4 py-2">
        <div className="inline-flex overflow-hidden rounded-[8px] border border-[#E9ECEF]">
          <button
            onClick={() => setView("list")}
            className={cn(
              "flex items-center gap-1 px-2.5 py-1.5 text-[12px] font-semibold",
              view === "list" ? "bg-[#3A8A3A] text-white" : "bg-white text-[#495057]",
            )}
          >
            <List className="h-3.5 w-3.5" /> 리스트
          </button>
          <button
            onClick={() => setView("table")}
            className={cn(
              "flex items-center gap-1 border-l border-[#E9ECEF] px-2.5 py-1.5 text-[12px] font-semibold",
              view === "table" ? "bg-[#3A8A3A] text-white" : "bg-white text-[#495057]",
            )}
          >
            <TableIcon className="h-3.5 w-3.5" /> 표
          </button>
        </div>
      </div>

      {view === "list" ? (
        <AuctionList records={visible} />
      ) : (
        <AuctionTable records={visible} />
      )}

      {/* Pagination */}
      <div className="flex justify-center px-4 pt-3">
        {page < totalPages ? (
          <button
            onClick={() => setPage((p) => p + 1)}
            className="inline-flex items-center gap-1 rounded-full bg-[#3A8A3A] px-5 py-2.5 text-[13px] font-bold text-white shadow-sm"
          >
            <ChevronDown className="h-4 w-4" />
            더 불러오기 ({page}/{totalPages} 페이지)
          </button>
        ) : (
          <span className="text-[12px] text-[#868E96]">마지막 페이지입니다</span>
        )}
      </div>

      {/* Fixed bottom summary bar */}
      <SimpleModeSummaryBar summary={summary} />
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full px-3 py-1.5 text-[12px] font-semibold",
        active ? "bg-[#3A8A3A] text-white" : "bg-[#F1F3F5] text-[#495057]",
      )}
    >
      {label}
    </button>
  );
}

function AuctionList({ records }: { records: AuctionRecord[] }) {
  if (records.length === 0) {
    return <EmptyRow />;
  }
  return (
    <ul className="divide-y divide-[#F1F3F5] border-y border-[#F1F3F5]">
      {records.map((r) => (
        <li key={r.id}>
          <Link
            to="/market/auction/$id"
            params={{ id: r.id }}
            className="block px-4 py-3 active:bg-[#F8F9FA]"
          >
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold text-foreground">
                {r.category} / {r.cropName} / {r.varietyName}
              </span>
              <span className="shrink-0 text-[11px] text-[#868E96]">
                {r.auctionDate.slice(5).replace("-", "/")} {r.auctionClock}
              </span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[12px] text-[#495057]">
              <span className="font-bold text-[#E03131]">
                {r.price.toLocaleString()}원
              </span>
              <span className="text-[#DEE2E6]">·</span>
              <span>수량 {r.count}건</span>
              <span className="text-[#DEE2E6]">·</span>
              <span>규격 {r.packageLabel}</span>
              <span className="text-[#DEE2E6]">·</span>
              <span>출하지 {r.origin}</span>
              <span className="text-[#DEE2E6]">·</span>
              <span>법인 {r.corporationName}</span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function AuctionTable({ records }: { records: AuctionRecord[] }) {
  if (records.length === 0) {
    return <EmptyRow />;
  }
  return (
    <div className="overflow-x-auto border-y border-[#F1F3F5]">
      <table className="w-full min-w-[560px] text-[11.5px]">
        <thead>
          <tr className="bg-[#F8F9FA] text-[#6C757D]">
            <th className="py-2 pl-3 pr-2 text-left font-semibold">#</th>
            <th className="py-2 pr-2 text-left font-semibold">시간 ↓</th>
            <th className="py-2 pr-2 text-left font-semibold">품종</th>
            <th className="py-2 pr-2 text-left font-semibold">출하지</th>
            <th className="py-2 pr-2 text-left font-semibold">규격</th>
            <th className="py-2 pr-2 text-right font-semibold">건수</th>
            <th className="py-2 pr-3 text-right font-semibold">경락가</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r, i) => (
            <tr key={r.id} className="border-t border-[#F1F3F5]">
              <td className="py-2 pl-3 pr-2 text-[#868E96]">{i + 1}</td>
              <td className="py-2 pr-2 text-[#495057]">
                {r.auctionDate.slice(5).replace("-", "/")} {r.auctionClock}
              </td>
              <td className="py-2 pr-2 font-semibold text-foreground">
                <Link to="/market/auction/$id" params={{ id: r.id }} className="hover:underline">
                  {r.varietyName}
                </Link>
              </td>
              <td className="py-2 pr-2 text-foreground">{r.origin}</td>
              <td className="py-2 pr-2 text-foreground">{r.packageLabel}</td>
              <td className="py-2 pr-2 text-right text-foreground">{r.count}</td>
              <td className="py-2 pr-3 text-right font-bold text-[#E03131]">
                {r.price.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmptyRow() {
  return (
    <div className="flex flex-col items-center gap-2 py-14 text-center">
      <span className="text-3xl">📭</span>
      <span className="text-[13px] text-[#6C757D]">해당 조건의 경매 결과가 없어요</span>
    </div>
  );
}

function SimpleModeSummaryBar({
  summary,
}: {
  summary: { totalCount: number; avgPrice: number; avgPricePerKg: number };
}) {
  return (
    <div
      className="fixed inset-x-0 z-30 mx-auto max-w-[430px]"
      style={{
        bottom: `calc(60px + env(safe-area-inset-bottom))`,
      }}
    >
      <div className="mx-3 mb-2 grid grid-cols-3 rounded-[12px] bg-[#212529] px-3 py-2.5 text-white shadow-lg">
        <SummaryCell label="총 수량" value={`${summary.totalCount.toLocaleString()}건`} />
        <SummaryCell label="건당 평균가" value={`${summary.avgPrice.toLocaleString()}원`} />
        <SummaryCell label="kg당 평균가" value={`${summary.avgPricePerKg.toLocaleString()}원`} />
      </div>
    </div>
  );
}

function SummaryCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 border-r border-white/10 last:border-r-0">
      <span className="text-[10.5px] text-white/60">{label}</span>
      <span className="text-[12.5px] font-bold text-white">{value}</span>
    </div>
  );
}
