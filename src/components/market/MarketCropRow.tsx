import { PriceBadge } from "@/components/price-badge";
import type { TopCrop } from "./types";

export function MarketCropRow({
  rank,
  crop,
  onClick,
}: {
  rank: number;
  crop: TopCrop;
  onClick: () => void;
}) {
  return (
    <li className="border-t border-[#F1F3F5] first:border-t-0">
      <button
        onClick={onClick}
        className="flex w-full items-center gap-3 px-3 py-3 text-left active:bg-secondary"
      >
        <span className="w-5 text-center text-[13px] font-bold text-[#3A8A3A] tabular-nums">
          {rank}
        </span>
        <span className="text-2xl" aria-hidden>
          {crop.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-semibold text-foreground">{crop.name}</div>
          <div className="mt-0.5 truncate text-[11px] text-muted-foreground">
            {crop.market} · {crop.grade} · {crop.spec}
          </div>
        </div>
        <div className="text-right">
          <div className="font-data text-[15px] font-bold tabular-nums text-foreground">
            {crop.pricePerKg.toLocaleString()}
            <span className="ml-0.5 text-[11px] font-medium text-muted-foreground">원/kg</span>
          </div>
          <div className="mt-0.5 flex items-center justify-end gap-1.5">
            <PriceBadge changePct={crop.changePct} />
            <span className="text-[11px] text-muted-foreground">
              {crop.volumeTon.toFixed(1)}t
            </span>
          </div>
        </div>
      </button>
    </li>
  );
}