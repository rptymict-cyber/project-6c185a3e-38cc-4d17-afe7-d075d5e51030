import { toast } from "sonner";
import { QUICK_MARKETS } from "./types";

export function MarketQuickMarketSection({
  onMoreClick,
}: {
  onMoreClick?: () => void;
}) {
  return (
    <section className="mt-6 px-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[14px] font-bold text-foreground">도매시장 빠른 조회</h3>
        <button
          onClick={() => {
            if (onMoreClick) {
              onMoreClick();
            } else {
              toast("도매시장별 조회는 준비 중입니다");
            }
          }}
          className="text-[12px] font-medium text-muted-foreground"
        >
          더보기 ›
        </button>
      </div>
      <div className="no-scrollbar flex gap-3 overflow-x-auto">
        {QUICK_MARKETS.map((m) => (
          <button
            key={m.id}
            onClick={() => toast(`${m.name} 기준으로 조회합니다.`)}
            className="flex shrink-0 flex-col items-center gap-1.5"
          >
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#F0F9F0] text-2xl">
              {m.emoji}
            </span>
            <span className="text-[11px] font-medium text-foreground">{m.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
