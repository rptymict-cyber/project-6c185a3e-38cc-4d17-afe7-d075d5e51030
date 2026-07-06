import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import type { Item } from "@/lib/mock/items";
import { topVariety, itemTotalVolume, varietyInsight } from "@/lib/mock/items";
import { MarketSpark } from "./MarketSpark";
import { cn } from "@/lib/utils";

export function ItemRow({ item }: { item: Item }) {
  const top = topVariety(item);
  const totalVol = itemTotalVolume(item);
  const up = top.changePct > 0;
  const flat = Math.abs(top.changePct) < 0.05;
  const urgent = Math.abs(top.changePct) >= 5;
  const color = flat ? "#6C757D" : up ? "#E03131" : "#1971C2";

  // Route: if single variety, go straight to price detail. Otherwise variety list.
  const single = item.varieties.length === 1;
  const to = single ? "/price/$variety" : "/market/item/$item";
  const params = single
    ? { variety: item.varieties[0].id }
    : { item: item.id };

  return (
    <Link to={to} params={params} className="block">
      <div
        className={cn(
          "relative flex items-center gap-3 px-4 py-3.5 transition-colors active:bg-[#F8F9FA]",
        )}
        style={
          urgent
            ? {
                boxShadow: `inset 3px 0 0 ${color}`,
                backgroundImage: `linear-gradient(90deg, ${color}14 0%, transparent 55%)`,
              }
            : undefined
        }
      >
        <span className="text-[26px] leading-none" aria-hidden>
          {item.emoji}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-[15.5px] font-bold text-foreground">
              {item.name}
            </span>
            <span className="shrink-0 rounded-md bg-[#F8F9FA] px-1.5 py-0.5 text-[11px] font-semibold text-[#6C757D]">
              품종 {item.varieties.length}
            </span>
            {urgent && (
              <span
                className="shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold"
                style={{ color, backgroundColor: `${color}14` }}
              >
                {up ? "급등" : "급락"}
              </span>
            )}
          </div>
          <div className="mt-0.5 truncate text-[11.5px] text-[#6C757D]">
            오늘 {totalVol.toLocaleString()}톤 거래 · {varietyInsight(top)}
          </div>
        </div>

        <div className="shrink-0">
          <MarketSpark data={top.spark} up={up} />
        </div>

        <div className="min-w-0 shrink-0 text-right">
          <div className="truncate text-[10px] text-[#ADB5BD]">대표 · {top.name}</div>
          <div className="font-data text-[15px] font-bold tabular-nums text-foreground">
            {top.pricePerKg.toLocaleString()}
          </div>
          <div
            className="text-[11.5px] font-bold tabular-nums"
            style={{ color }}
          >
            {flat ? "— 0.0%" : `${up ? "▲ +" : "▼ "}${top.changePct.toFixed(1)}%`}
          </div>
        </div>

        <ChevronRight className="h-4 w-4 shrink-0 text-[#ADB5BD]" />
      </div>
    </Link>
  );
}
