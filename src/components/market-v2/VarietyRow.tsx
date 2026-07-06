import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import type { Variety } from "@/lib/mock/items";
import { varietyInsight } from "@/lib/mock/items";
import { MarketSpark } from "./MarketSpark";
import { cn } from "@/lib/utils";

export function VarietyRow({
  variety,
  itemName,
  cropId,
}: {
  variety: Variety;
  itemName: string;
  cropId: string;
}) {
  const up = variety.changePct > 0;
  const flat = Math.abs(variety.changePct) < 0.05;
  const urgent = Math.abs(variety.changePct) >= 5;
  const color = flat ? "#6C757D" : up ? "#E03131" : "#1971C2";

  return (
    <Link to="/market/$crop" params={{ crop: cropId }} className="block">
      <div
        className={cn("relative flex items-center gap-3 px-4 py-3.5 active:bg-[#F8F9FA]")}
        style={
          urgent
            ? {
                boxShadow: `inset 3px 0 0 ${color}`,
                backgroundImage: `linear-gradient(90deg, ${color}14 0%, transparent 55%)`,
              }
            : undefined
        }
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-[14.5px] font-bold text-foreground">
              {itemName} · {variety.name}
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
            {varietyInsight(variety)} · {variety.volumeTon.toLocaleString()}톤
          </div>
        </div>

        <div className="shrink-0">
          <MarketSpark data={variety.spark} up={up} />
        </div>

        <div className="shrink-0 text-right">
          <div className="font-data text-[15px] font-bold tabular-nums text-foreground">
            {variety.pricePerKg.toLocaleString()}
          </div>
          <div className="text-[11.5px] font-bold tabular-nums" style={{ color }}>
            {flat ? "— 0.0%" : `${up ? "▲ +" : "▼ "}${variety.changePct.toFixed(1)}%`}
          </div>
        </div>

        <ChevronRight className="h-4 w-4 shrink-0 text-[#ADB5BD]" />
      </div>
    </Link>
  );
}
