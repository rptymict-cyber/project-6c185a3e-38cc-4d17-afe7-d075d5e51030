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

      {/* Data area — table only */}
      {visible.length === 0 ? (
        <EmptyRow />
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
