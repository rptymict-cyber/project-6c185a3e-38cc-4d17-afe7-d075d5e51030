import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";

export type RankingItem = {
  rank: number;
  cropId: string;
  name: string;
  emoji: string;
  meta: string; // "서울 가락시장 · 특 · 10kg망"
  price: number;
  unit: string; // "원/kg"
  changePct: number;
};

export function CropRankingRow({ item }: { item: RankingItem }) {
  const [starred, setStarred] = useState(false);
  const flat = Math.abs(item.changePct) < 0.05;
  const up = item.changePct > 0;
  const color = flat ? "text-[#6C757D]" : up ? "text-[#E03131]" : "text-[#1971C2]";
  const sign = flat ? "" : up ? "▲" : "▼";
  const rankColor = item.rank <= 3 ? "text-[#3A8A3A]" : "text-[#ADB5BD]";
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <span className={cn("w-4 text-center text-[14px] font-bold tabular-nums", rankColor)}>
        {item.rank}
      </span>
      <Link
        to="/market/$crop"
        params={{ crop: item.cropId }}
        className="flex flex-1 items-center gap-3 min-w-0"
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#F1F3F5] text-[20px]">
          {item.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[14px] font-bold text-foreground">{item.name}</div>
          <div className="truncate text-[11px] text-[#868E96]">{item.meta}</div>
        </div>
        <div className="text-right">
          <div className="text-[14px] font-bold tabular-nums text-foreground">
            {item.price.toLocaleString()}
            <span className="ml-0.5 text-[10px] font-medium text-[#6C757D]">{item.unit}</span>
          </div>
          <div className={cn("text-[12px] font-semibold tabular-nums", color)}>
            {sign} {Math.abs(item.changePct).toFixed(1)}%
          </div>
        </div>
      </Link>
      <button
        aria-label="관심 등록"
        onClick={() => {
          setStarred((s) => {
            if (!s) toast("관심 품목에 추가되었습니다 ★");
            return !s;
          });
        }}
        className="grid h-8 w-8 place-items-center rounded-full hover:bg-secondary"
      >
        <Star
          className={cn(
            "h-[18px] w-[18px]",
            starred ? "fill-[#F08C00] text-[#F08C00]" : "text-[#CED4DA]",
          )}
        />
      </button>
    </div>
  );
}
