import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useMarketFilter } from "@/store/market";
import { listAuctions } from "@/lib/mock/auctions";

const PAGE_SIZE = 15;

export function AuctionHistoryTable() {
  const f = useMarketFilter();
  const rows = useMemo(
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
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const visible = rows.slice(0, page * PAGE_SIZE);

  return (
    <div className="px-2 pb-6 pt-3">
      <div className="overflow-x-auto rounded-[10px] border border-[#E9ECEF]">
        <table className="w-full min-w-[560px] text-[12px]">
          <thead>
            <tr className="bg-[#F8F9FA] text-[#6C757D]">
              <Th>시간</Th>
              <Th>도매시장</Th>
              <Th>도매법인</Th>
              <Th>출하지</Th>
              <Th className="text-right">수량</Th>
              <Th className="text-right">경락가</Th>
            </tr>
          </thead>
          <tbody>
            {visible.map((r) => {
              const mmdd = r.auctionDate.slice(5).replace("-", "/");
              return (
                <tr key={r.id} className="border-t border-[#F1F3F5] hover:bg-[#F8F9FA]">
                  <Td>
                    <Link
                      to="/market/auction/$id"
                      params={{ id: r.id }}
                      className="block whitespace-nowrap text-[#495057]"
                    >
                      {mmdd} {r.auctionClock}
                    </Link>
                  </Td>
                  <Td>{r.marketName}</Td>
                  <Td>{r.corporationName}</Td>
                  <Td>{r.origin}</Td>
                  <Td className="text-right">{r.count}</Td>
                  <Td className="text-right font-bold text-[#E03131]">
                    {r.price.toLocaleString()}
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
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

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`whitespace-nowrap px-3 py-2 text-left font-semibold ${className ?? ""}`}>
      {children}
    </th>
  );
}
function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={`whitespace-nowrap px-3 py-2.5 text-[#495057] ${className ?? ""}`}>
      {children}
    </td>
  );
}
