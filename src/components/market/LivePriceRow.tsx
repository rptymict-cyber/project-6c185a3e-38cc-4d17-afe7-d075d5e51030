import { CropIcon } from "@/components/crop-icon";
import { PriceBadge } from "@/components/price-badge";
import type { LivePriceRow } from "@/lib/services/live-prices";

// 헤더와 행이 반드시 같은 그리드를 쓰도록 상수로 공유 → 열이 정확히 정렬됨
const GRID =
  "grid grid-cols-[16px_28px_1fr_84px_64px_52px] items-center gap-2 px-3";

/**
 * 순위 · 아이콘 · 품목명(+시장·단위) · 현재가 · 등락률 · 거래량
 * 헤더(LivePriceHeader)와 행(LivePriceRowItem)이 동일 GRID를 공유.
 */
export function LivePriceRowItem({
  rank,
  row,
  onClick,
}: {
  rank: number;
  row: LivePriceRow;
  onClick: () => void;
}) {
  return (
    <li className="border-t border-[#F1F3F5] first:border-t-0">
      <button
        onClick={onClick}
        className={`${GRID} w-full py-2.5 text-left active:bg-secondary`}
      >
        <span className="text-center text-[12px] font-bold tabular-nums text-[#3A8A3A]">
          {rank}
        </span>
        <CropIcon name={row.name} size={28} />
        <div className="min-w-0">
          <div className="truncate text-[14px] font-semibold text-foreground">
            {row.name}
          </div>
          <div className="mt-0.5 truncate text-[10.5px] text-muted-foreground">
            {row.market} · {row.unit}
          </div>
        </div>
        <div className="text-right font-data text-[14px] font-bold tabular-nums text-foreground">
          {row.pricePerKg.toLocaleString()}
          <span className="ml-0.5 text-[10px] font-medium text-muted-foreground">
            원/kg
          </span>
        </div>
        <div className="text-right">
          <PriceBadge changePct={row.changePct} />
        </div>
        <div className="text-right text-[11px] tabular-nums text-muted-foreground">
          {row.volumeTon.toFixed(1)}t
        </div>
      </button>
    </li>
  );
}

export function LivePriceHeader() {
  return (
    <div
      className={`${GRID} border-b border-[#F1F3F5] bg-[#FAFBFC] py-1.5 text-[10.5px] font-semibold text-muted-foreground`}
    >
      <span></span>
      <span className="col-span-2">품목</span>
      <span className="text-right">현재가</span>
      <span className="text-right">등락률</span>
      <span className="text-right">거래량</span>
    </div>
  );
}
