import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Bell, ChevronDown, Clock, Star, TrendingDown, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { MarketQuote } from "@/lib/mock/market-analysis";
import { useAlerts } from "@/store/alerts";
import { useMarketFilter } from "@/store/market";
import { useFavoritePriceStore } from "@/features/favorites/favoriteStore";
import { fromMarketQuote } from "@/features/favorites/favoriteMappers";
import { favoriteKey } from "@/features/favorites/favoriteKey";
import { getCrop } from "@/lib/mock/crops";
import { CropIcon } from "@/components/crop-icon";
import { UnitSheet } from "./UnitSheet";
import { countAuctions } from "@/lib/mock/auctions";


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
  const up = quote.prevPct > 0;
  const flat = quote.prevPct === 0;
  const changeColor = flat ? "text-[#6C757D]" : up ? "text-[#E03131]" : "text-[#1971C2]";
  const [unitOpen, setUnitOpen] = useState(false);
  const marketId = useMarketFilter((s) => s.marketId);
  const corpId = useMarketFilter((s) => s.corpId);
  const corpLabel = useMarketFilter((s) => s.corpLabel);
  const categoryLabel = useMarketFilter((s) => s.categoryLabel);
  const date = useMarketFilter((s) => s.date);
  const auctionCount = countAuctions({
    categoryLabel,
    itemLabel,
    varietyLabel,
    marketLabel,
    marketId,
    date,
  });
  const favKey = favoriteKey({
    cropId: itemId,
    varietyId,
    marketId,
    corporationId: corpId === "all" ? undefined : corpId,
    unit: quote.unit,
  });
  const isFav = useFavoritePriceStore((s) => s.items.some((it) => it.id === favKey));
  const toggleFavorite = useFavoritePriceStore((s) => s.toggleFavorite);
  const navigate = useNavigate();
  const hasAlert = useAlerts((s) => s.hasAnyFor(varietyId, marketId));
  const existingRule = useAlerts((s) => s.getByKey(varietyId, marketId));

  const marketCondLabel = marketId === "all" ? "전체시장" : marketLabel;
  const corpCondLabel = corpId === "all" ? "전체법인" : corpLabel;

  return (
    <>
      <div className="mt-4 rounded-[14px] border border-[#E9ECEF] bg-white p-4">
        {/* Header row: crop icon + item·variety (large) — right: ★ / 🔔 only */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[12px] bg-[#F0F9F0]">
              <CropIcon name={itemLabel} size={28} />
            </div>
            <div className="min-w-0">
              <div className="truncate text-[16px] font-black leading-tight text-foreground">
                {itemLabel} · {varietyLabel}
              </div>
              <div className="mt-1 truncate text-[12px] font-medium text-[#868E96]">
                {marketCondLabel} · {corpCondLabel}
              </div>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-0.5">
            <button
              type="button"
              onClick={() => {
                const crop = getCrop(itemId);
                const added = toggleFavorite(
                  fromMarketQuote({
                    itemId,
                    itemName: itemLabel,
                    emoji: "🌾",
                    varietyId,
                    varietyName: varietyLabel,
                    marketId,
                    marketName: marketLabel,
                    corporationId: corpId === "all" ? undefined : corpId,
                    corporationName: corpLabel,
                    unit: quote.unit,
                    quote,
                    isPredictable: Boolean(
                      crop?.isPredictable && crop.predictionStatus === "available",
                    ),
                  }),
                );
                toast(added ? "즐겨찾기에 추가했어요" : "즐겨찾기에서 제거했어요");
              }}
              aria-label="즐겨찾기"
              className="grid h-9 w-9 place-items-center rounded-full text-[#495057] active:bg-[#F1F3F5]"
            >
              <Star
                className={cn("h-[18px] w-[18px]", isFav && "fill-[#F59F00] text-[#F59F00]")}
              />
            </button>
            <button
              type="button"
              onClick={() => {
                if (existingRule) {
                  navigate({
                    to: "/notifications/settings/$ruleId",
                    params: { ruleId: existingRule.id },
                  });
                } else {
                  navigate({
                    to: "/notifications/settings/new",
                    search: { varietyId, marketId },
                  });
                }
              }}
              aria-label="알림 설정"
              className="grid h-9 w-9 place-items-center rounded-full text-[#495057] active:bg-[#F1F3F5]"
            >
              <Bell className={cn("h-[18px] w-[18px]", hasAlert && "text-[#3A8A3A]")} />
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-end justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-[30px] font-black leading-none tracking-tight text-foreground">
              {quote.price.toLocaleString()}
            </span>
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
          <Stat label="경매" value={`${auctionCount}건`} tone="neutral" />
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
