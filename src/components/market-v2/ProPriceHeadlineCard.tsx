import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bell, ChevronDown, ChevronRight, Clock, Star, TrendingDown, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { MarketQuote } from "@/lib/mock/market-analysis";
import { useWatchlist } from "@/store/watchlist";
import { UnitSheet } from "./UnitSheet";

const EMOJI: Record<string, string> = {
  eggplant: "🍆",
  cucumber: "🥒",
  tomato: "🍅",
  watermelon: "🍉",
  apple: "🍎",
  pear: "🍐",
  grape: "🍇",
  cabbage: "🥬",
  lettuce: "🥗",
  garlic: "🧄",
  onion: "🧅",
  chili: "🌶️",
  radish: "🥕",
  carrot: "🥕",
};

export function ProPriceHeadlineCard({
  itemId,
  itemLabel,
  varietyId,
  varietyLabel,
  marketLabel,
  quote,
}: {
  itemId: string;
  itemLabel: string;
  varietyId: string;
  varietyLabel: string;
  marketLabel: string;
  quote: MarketQuote;
}) {
  const emoji = EMOJI[itemId] ?? "🌾";
  const up = quote.prevPct > 0;
  const flat = quote.prevPct === 0;
  const changeColor = flat ? "text-[#6C757D]" : up ? "text-[#E03131]" : "text-[#1971C2]";
  const [unitOpen, setUnitOpen] = useState(false);
  const isFav = useWatchlist((s) => s.crops.includes(itemId));
  const toggleCrop = useWatchlist((s) => s.toggleCrop);

  return (
    <>
      <div className="mt-4 rounded-[14px] border border-[#E9ECEF] bg-white p-4">
        {/* Title row with actions */}
        <div className="flex items-center justify-between gap-2">
          <span className="min-w-0 truncate text-[12.5px] text-[#495057]">
            <span className="mr-1">{emoji}</span>
            {itemLabel} · {varietyLabel} · {marketLabel}
          </span>
          <div className="flex shrink-0 items-center gap-0.5">
            <button
              type="button"
              onClick={() => {
                const added = toggleCrop(itemId);
                toast(added ? "즐겨찾기에 추가했어요" : "즐겨찾기에서 제거했어요");
              }}
              aria-label="즐겨찾기"
              className="grid h-8 w-8 place-items-center rounded-full text-[#495057] active:bg-[#F1F3F5]"
            >
              <Star
                className={cn("h-4 w-4", isFav && "fill-[#F59F00] text-[#F59F00]")}
              />
            </button>
            <Link
              to="/price/$variety/alert"
              params={{ variety: varietyId }}
              aria-label="알림 설정"
              className="grid h-8 w-8 place-items-center rounded-full text-[#495057] active:bg-[#F1F3F5]"
            >
              <Bell className="h-4 w-4" />
            </Link>
            <Link
              to="/price/$variety"
              params={{ variety: varietyId }}
              aria-label="상세 보기"
              className="grid h-8 w-8 place-items-center rounded-full text-[#ADB5BD] active:bg-[#F1F3F5]"
            >
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-2 flex items-end justify-between">
          <div className="flex items-baseline gap-1">
            <Link
              to="/price/$variety"
              params={{ variety: varietyId }}
              className="text-[30px] font-black leading-none tracking-tight text-foreground"
            >
              {quote.price.toLocaleString()}
            </Link>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setUnitOpen(true);
              }}
              className="ml-0.5 flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[13px] font-semibold text-[#495057] active:bg-[#F1F3F5]"
              aria-label="단위 변경"
            >
              원/{quote.unit.replace(" 기준", "")}
              <ChevronDown className="h-3 w-3 opacity-70" />
            </button>
          </div>
          <div className={cn("flex flex-col items-end leading-tight", changeColor)}>
            <span className="flex items-center gap-0.5 text-[15px] font-bold">
              {up ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              {up ? "+" : ""}{quote.prevPct.toFixed(1)}%
            </span>
            <span className="mt-0.5 text-[11px] font-medium text-[#868E96]">전일 대비</span>
          </div>
        </div>

        {/* Effective date badge */}
        <div className="mt-3 flex items-center gap-1 rounded-[8px] bg-[#F0F9F0] px-2.5 py-1.5 text-[11.5px] font-medium text-[#1F5C1F]">
          <Clock className="h-3 w-3" />
          {quote.effectiveLabel}
          {quote.fallbackNote && <span className="opacity-80"> · {quote.fallbackNote}</span>}
        </div>

        {/* 4 stat grid */}
        <div className="mt-3 grid grid-cols-4 gap-1 rounded-[10px] bg-[#F8F9FA] px-1 py-2.5">
          <Stat label="전일 대비" value={fmtPct(quote.prevPct)} tone={toneOf(quote.prevPct)} />
          <Stat label="전주 대비" value={fmtPct(quote.weekPct)} tone={toneOf(quote.weekPct)} />
          <Stat label="전년 동기" value={fmtPct(quote.yearPct)} tone={toneOf(quote.yearPct)} />
          <Stat label="경매" value={`${quote.boxes > 0 ? Math.round(quote.volumeTon * 1.6) : 0}건`} tone="neutral" />
        </div>

        {/* Footer */}
        <div className="mt-3 flex items-center justify-between border-t border-[#F1F3F5] pt-2.5 text-[11px] text-[#868E96]">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {quote.updatedAt} 업데이트
          </span>
          <span>반입량 {quote.boxes.toLocaleString()}상자</span>
        </div>
      </div>

      <UnitSheet open={unitOpen} onOpenChange={setUnitOpen} />
    </>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: "up" | "down" | "neutral" }) {
  const color = tone === "up" ? "text-[#E03131]" : tone === "down" ? "text-[#1971C2]" : "text-foreground";
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-[10.5px] text-[#868E96]">{label}</span>
      <span className={cn("text-[13px] font-bold", color)}>{value}</span>
    </div>
  );
}

function fmtPct(v: number): string {
  if (v === 0) return "0%";
  return `${v > 0 ? "+" : ""}${v.toFixed(1)}%`;
}
function toneOf(v: number): "up" | "down" | "neutral" {
  if (v > 0) return "up";
  if (v < 0) return "down";
  return "neutral";
}
