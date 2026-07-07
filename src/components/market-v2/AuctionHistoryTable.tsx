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
      return { avg: 0, max: 0, min: 0, volumeTon: 0 };
    }
    const prices = all.map((r) => r.price);
    const avg = Math.round(prices.reduce((s, v) => s + v, 0) / prices.length);
    const max = Math.max(...prices);
    const min = Math.min(...prices);
    const volumeTon = +(
      all.reduce((s, r) => s + r.packageKg * r.count, 0) / 1000
    ).toFixed(1);
    return { avg, max, min, volumeTon };
  }, [all]);

  const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const visible = all.slice(0, page * PAGE_SIZE);

  const dateLabel = f.date.replaceAll("-", ".");

  return (
    <div className="px-4 pb-8 pt-4">
      {/* Summary header */}
      <div>
        <div className="flex items-baseline gap-2">
          <h3 className="text-[15px] font-bold text-foreground">경매내역</h3>
          <span className="text-[15px] font-black text-[#3A8A3A]">
            총 {all.length}건
          </span>
        </div>
        <div className="mt-1 text-[11.5px] text-[#868E96]">
          {dateLabel} 기준 · {f.marketLabel} · {f.corpLabel} 법인 · {f.unit.replace(" 기준", "")} 기준
        </div>
      </div>

      {/* 4 stat grid */}
      <div className="mt-3 grid grid-cols-4 gap-2">
        <SummaryCell label="평균가" value={`${summary.avg.toLocaleString()}원`} />
        <SummaryCell label="최고가" value={`${summary.max.toLocaleString()}원`} tone="up" />
        <SummaryCell label="최저가" value={`${summary.min.toLocaleString()}원`} tone="down" />
        <SummaryCell label="총 거래량" value={`${summary.volumeTon}t`} />
      </div>

      {/* Card list */}
      {visible.length === 0 ? (
        <EmptyRow />
      ) : (
        <ul className="mt-3 divide-y divide-[#F1F3F5] overflow-hidden rounded-[12px] border border-[#E9ECEF] bg-white">
          {visible.map((r) => (
            <AuctionListItem key={r.id} r={r} />
          ))}
        </ul>
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

function AuctionListItem({ r }: { r: AuctionRecord }) {
  const mmdd = r.auctionDate.slice(5).replace("-", "/");
  return (
    <li>
      <Link
        to="/market/auction/$id"
        params={{ id: r.id }}
        className="flex items-center gap-3 px-3.5 py-3 active:bg-[#F8F9FA]"
      >
        <div className="w-[54px] shrink-0 text-[11px] leading-tight text-[#868E96]">
          <div>{mmdd}</div>
          <div>{r.auctionClock}</div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-[15px] font-bold text-[#E03131]">
              {r.price.toLocaleString()}원
            </span>
            <span className="text-[11.5px] text-[#868E96]">
              수량 {r.count}건 · {r.packageLabel}
            </span>
          </div>
          <div className="mt-0.5 truncate text-[11.5px] text-[#495057]">
            {r.origin} · {r.corporationName}
          </div>
        </div>
        <ChevronRight className="h-4 w-4 shrink-0 text-[#ADB5BD]" />
      </Link>
    </li>
  );
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
      <span className={cn("text-[12.5px] font-bold", color)}>{value}</span>
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

function EmptyRow() {
  return (
    <div className="mt-4 flex flex-col items-center gap-2 py-14 text-center">
      <span className="text-3xl">📭</span>
      <span className="text-[13px] text-[#6C757D]">해당 조건의 경매 결과가 없어요</span>
    </div>
  );
}
