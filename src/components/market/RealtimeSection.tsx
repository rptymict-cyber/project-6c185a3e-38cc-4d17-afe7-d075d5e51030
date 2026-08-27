import { useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  getLivePrices,
  LIVE_SORT_META,
  type LiveSort,
  type LivePriceRow,
} from "@/lib/services/live-prices";
import {
  LivePriceHeader,
  LivePriceRowCompact,
  LivePriceRowItem,
} from "./LivePriceRow";

const SORT_ORDER: LiveSort[] = ["up", "down", "vol"];

export function RealtimeSection({
  sort,
  onSortChange,
  onSelect,
  limit,
  showHeaderRow = true,
  variant = "default",
}: {
  sort: LiveSort;
  onSortChange: (s: LiveSort) => void;
  onSelect: (row: LivePriceRow) => void;
  limit: number;
  showHeaderRow?: boolean;
  /** "home"은 홈 전용 compact 레이아웃(헤더행 없음) */
  variant?: "default" | "home";
}) {
  const { rows } = useMemo(() => getLivePrices({ sort, limit }), [sort, limit]);
  const hint = LIVE_SORT_META[sort].hint;
  const isHome = variant === "home";
  const Row = isHome ? LivePriceRowCompact : LivePriceRowItem;

  return (
    <div>
      <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
        {SORT_ORDER.map((s) => {
          const active = s === sort;
          return (
            <button
              key={s}
              onClick={() => onSortChange(s)}
              className={cn(
                "inline-flex h-11 shrink-0 items-center rounded-full px-3.5 text-caption font-semibold",
                active ? "bg-[#3A8A3A] text-white" : "bg-[#F1F3F5] text-muted-foreground",
              )}
            >
              {LIVE_SORT_META[s].label}
            </button>
          );
        })}
      </div>
      <p className="mt-1.5 text-meta text-muted-foreground">{hint}</p>

      <div className="mt-2 overflow-hidden rounded-[10px] bg-[#FAFBFA]">
        {!isHome && showHeaderRow && <LivePriceHeader />}
        <ul>
          {rows.map((row, i) => (
            <Row key={row.id} rank={i + 1} row={row} onClick={onSelect} />
          ))}
        </ul>
      </div>
    </div>
  );
}
