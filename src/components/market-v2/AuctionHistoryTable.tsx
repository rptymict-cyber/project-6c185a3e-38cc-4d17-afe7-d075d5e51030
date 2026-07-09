import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useMarketFilter } from "@/store/market";
import { listAuctions, type AuctionRecord } from "@/lib/mock/auctions";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 20;



export function AuctionHistoryTable() {
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

  const [view, setView] = useState<ViewMode>("list");
  const [page, setPage] = useState(1);

  const summary = useMemo(() => {
    if (all.length === 0) {
      return { avg: 0, avgPerKg: 0, volumeTon: 0 };
    }
    const avg = Math.round(
      all.reduce((s: number, r: AuctionRecord) => s + r.price, 0) / all.length,
    );
    const avgPerKg = Math.round(
      all.reduce((s: number, r: AuctionRecord) => s + r.pricePerKg, 0) / all.length,
    );
    const volumeTon = +(
      all.reduce((s: number, r: AuctionRecord) => s + r.packageKg * r.count, 0) / 1000
    ).toFixed(1);
    return { avg, avgPerKg, volumeTon };
  }, [all]);

  const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const visible = all.slice(0, page * PAGE_SIZE);

  const dateLabel = f.date.replaceAll("-", ".");

  return (
    <div className="px-4 pb-8 pt-4">
      {/* Common header */}
      <div>
        <div className="flex items-baseline gap-2">
          <h3 className="text-[15px] font-bold text-foreground">경매내역</h3>
          <span className="text-[15px] font-black text-[#3A8A3A]">
            총 {all.length}건
          </span>
        </div>
        <div className="mt-1 text-[11.5px] text-[#868E96]">
          {dateLabel} 기준 · {f.marketLabel} · {f.corpLabel} 법인
        </div>
      </div>

      {/* Summary box — shown in both list and table view */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        <SummaryCell label="평균가" value={`${summary.avg.toLocaleString()}원`} />
        <SummaryCell label="거래량" value={`${summary.volumeTon}t`} />
        <SummaryCell label="kg당" value={`${summary.avgPerKg.toLocaleString()}원`} />
      </div>

      {/* View toggle */}
      <div className="mt-3 flex items-center justify-end">
        <div className="inline-flex overflow-hidden rounded-[10px] border border-[#E9ECEF] bg-white">
          <ToggleBtn active={view === "list"} onClick={() => setView("list")}>
            <LayoutList className="h-3.5 w-3.5" /> 리스트
          </ToggleBtn>
          <ToggleBtn active={view === "table"} onClick={() => setView("table")}>
            <TableIcon className="h-3.5 w-3.5" /> 표
          </ToggleBtn>
        </div>
      </div>

      {/* Data area */}
      {visible.length === 0 ? (
        <EmptyRow />
      ) : view === "list" ? (
        <div className="mt-3 space-y-2">
          {visible.map((r: AuctionRecord) => (
            <AuctionListItem key={r.id} r={r} />
          ))}
        </div>
      ) : (
        <AuctionTable rows={visible} />
      )}

      {page < totalPages && (
        <button
          onClick={() => setPage((p) => p + 1)}
          className="mt-3 flex h-11 w-full items-center justify-center gap-1 rounded-[10px] border border-[#E9ECEF] bg-white text-[13px] font-semibold text-[#495057]"
        >
          더 불러오기 ({page}/{totalPages} 페이지)
        </button>
      )}
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
        "flex items-center gap-1 px-3 py-1.5 text-[12px] font-semibold",
        active ? "bg-[#1F5C1F] text-white" : "bg-white text-[#495057]",
      )}
    >
      {children}
    </button>
  );
}

function AuctionListItem({ r }: { r: AuctionRecord }) {
  const mmdd = r.auctionDate.slice(5).replace("-", "/");
  const path = `${r.category} / ${r.cropName} / ${r.varietyName}`;
  return (
    <Link
      to="/market/auction/$id"
      params={{ id: r.id }}
      className="block rounded-[12px] border border-[#E9ECEF] bg-white p-4 active:bg-[#F8F9FA]"
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          {/* Row 1: path + time */}
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-[13px] font-bold text-[#212529]">
              {path}
            </span>
            <span className="shrink-0 text-[12px] text-[#868E96]">
              {mmdd} {r.auctionClock}
            </span>
          </div>
          {/* Row 2: price + meta */}
          <div className="mt-1.5 flex flex-wrap items-center gap-x-1 gap-y-0.5">
            <span className="text-[15px] font-bold text-[#E03131]">
              {r.price.toLocaleString()}원
            </span>
            <span className="text-[11.5px] text-[#868E96]">
              · 수량 {r.count}건 · 규격 {r.packageLabel} · 출하지 {r.origin}
            </span>
          </div>
          {/* Row 3: corporation */}
          <div className="mt-0.5 text-[11.5px] text-[#868E96]">
            법인 {r.corporationName}
          </div>
        </div>
        <ChevronRight className="h-4 w-4 shrink-0 text-[#ADB5BD]" />
      </div>
    </Link>
  );
}

function AuctionTable({ rows }: { rows: AuctionRecord[] }) {
  return (
    <div className="mt-3 overflow-x-auto rounded-[12px] border border-[#E9ECEF] bg-white">
      <table className="w-full min-w-[640px] border-collapse text-[11.5px]">
        <thead>
          <tr className="bg-[#F8F9FA] text-[#495057]">
            <Th>번호</Th>
            <Th>시간</Th>
            <Th>품종</Th>
            <Th>출하지</Th>
            <Th className="text-right">가격</Th>
            <Th className="text-right">수량</Th>
            <Th>규격</Th>
            <Th>법인</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id} className="border-t border-[#F1F3F5]">
              <Td>{i + 1}</Td>
              <Td className="whitespace-nowrap">
                {r.auctionDate.slice(5).replace("-", "/")} {r.auctionClock}
              </Td>
              <Td>
                <Link
                  to="/market/auction/$id"
                  params={{ id: r.id }}
                  className="text-[#1F5C1F] underline-offset-2 hover:underline"
                >
                  {r.varietyName}
                </Link>
              </Td>
              <Td>{r.origin}</Td>
              <Td className="whitespace-nowrap text-right font-bold text-[#E03131]">
                {r.price.toLocaleString()}
              </Td>
              <Td className="text-right">{r.count}</Td>
              <Td>{r.packageLabel}</Td>
              <Td className="whitespace-nowrap">{r.corporationName}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={cn(
        "whitespace-nowrap px-2.5 py-2 text-left text-[11px] font-semibold",
        className,
      )}
    >
      {children}
    </th>
  );
}
function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={cn("px-2.5 py-2 text-[#212529]", className)}>{children}</td>;
}

function SummaryCell({
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
    <div className="flex flex-col items-center gap-0.5 rounded-[10px] border border-[#E9ECEF] bg-white px-2 py-2.5">
      <span className="text-[10.5px] text-[#868E96]">{label}</span>
      <span className={cn("text-[13px] font-bold", color)}>{value}</span>
    </div>
  );
}

function EmptyRow() {
  return (
    <div className="mt-4 flex flex-col items-center gap-2 py-14 text-center">
      <span className="text-3xl">📭</span>
      <span className="text-[13px] text-[#6C757D]">해당 조건의 경매 결과가 없어요</span>
    </div>
  );
}
