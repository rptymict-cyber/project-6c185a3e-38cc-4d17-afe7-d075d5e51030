import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { getLivePrices, LIVE_SORT_META, type LiveSort } from "@/lib/services/live-prices";
import { LivePriceHeader, LivePriceRowItem } from "./LivePriceRow";

const SORT_ORDER: LiveSort[] = ["up", "down", "vol"];

export function RealtimeSection({
  sort,
  onSortChange,
  onSelect,
  limit,
  showHeaderRow = true,
}: {
  sort: LiveSort;
  onSortChange: (s: LiveSort) => void;
  onSelect: (id: string) => void;
  limit: number;
  showHeaderRow?: boolean;
}) {
  const { rows } = useMemo(() => getLivePrices({ sort, limit }), [sort, limit]);
  const hint = LIVE_SORT_META[sort].hint;

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
                "shrink-0 rounded-full px-3 py-1 text-[12px] font-semibold",
                active ? "bg-[#3A8A3A] text-white" : "bg-[#F1F3F5] text-muted-foreground",
              )}
            >
              {LIVE_SORT_META[s].label}
            </button>
          );
        })}
      </div>
      <p className="mt-1.5 text-[10.5px] text-muted-foreground">{hint}</p>

      <div className="mt-2 overflow-hidden rounded-[10px] bg-[#FAFBFA]">
        {showHeaderRow && <LivePriceHeader />}
        <ul>
          {rows.map((row, i) => (
            <LivePriceRowItem key={row.id} rank={i + 1} row={row} onClick={() => onSelect(row.id)} />
          ))}
        </ul>
      </div>
    </div>
  );
}
