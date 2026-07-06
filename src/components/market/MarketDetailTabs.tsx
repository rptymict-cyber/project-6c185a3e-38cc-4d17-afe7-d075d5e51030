import { cn } from "@/lib/utils";
import type { MarketDetailTab } from "./types";

const TABS: { id: MarketDetailTab; label: string }[] = [
  { id: "chart", label: "차트" },
  { id: "auction", label: "경매내역" },
  { id: "compare", label: "시장비교" },
  { id: "origin", label: "산지" },
  { id: "grade", label: "등급·규격" },
];

export function MarketDetailTabs({
  value,
  onChange,
}: {
  value: MarketDetailTab;
  onChange: (v: MarketDetailTab) => void;
}) {
  return (
    <div className="sticky top-[52px] z-20 border-b border-[#E9ECEF] bg-background">
      <div className="no-scrollbar flex overflow-x-auto">
        {TABS.map((t) => {
          const active = t.id === value;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className={cn(
                "relative shrink-0 px-4 py-3 text-[13px] font-semibold",
                active ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {t.label}
              {active && (
                <span className="absolute inset-x-2 -bottom-px h-[2px] rounded-full bg-[#3A8A3A]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
