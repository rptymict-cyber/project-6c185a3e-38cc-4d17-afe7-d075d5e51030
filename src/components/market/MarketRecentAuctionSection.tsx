import { RECENT_AUCTIONS } from "./types";

export function MarketRecentAuctionSection({
  onMore,
}: {
  onMore: () => void;
}) {
  return (
    <section className="mt-6 px-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[14px] font-bold text-foreground">최근 경매 흐름</h3>
        <button
          onClick={onMore}
          className="text-[12px] font-medium text-muted-foreground"
        >
          더보기 ›
        </button>
      </div>
      <ul className="overflow-hidden rounded-[10px] bg-surface">
        {RECENT_AUCTIONS.map((a, i) => (
          <li
            key={i}
            className="flex items-center gap-3 border-t border-[#F1F3F5] px-3 py-2.5 first:border-t-0 text-[12px]"
          >
            <span className="font-data tabular-nums text-muted-foreground">{a.time}</span>
            <span className="min-w-0 flex-1 truncate text-foreground">
              {a.crop} · {a.market} · {a.grade} {a.spec}
            </span>
            <span className="font-data text-[13px] font-bold tabular-nums text-[#E03131]">
              {a.pricePerKg.toLocaleString()}원/kg
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
