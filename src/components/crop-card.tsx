import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import type { Crop } from "@/lib/mock/crops";
import { CATEGORIES } from "@/lib/mock/crops";
import { useFavoritePriceStore } from "@/features/favorites/favoriteStore";
import { fromCrop } from "@/features/favorites/favoriteMappers";
import { favoriteKey } from "@/features/favorites/favoriteKey";
import { Sparkline } from "./sparkline";
import { PriceBadge } from "./price-badge";
import { StarToggle } from "./star-toggle";
import { cn } from "@/lib/utils";

function insightFor(crop: Crop, changePct: number) {
  const spark = crop.spark;
  const trendUp = spark.length >= 3 && spark[spark.length - 1] > spark[spark.length - 2] && spark[spark.length - 2] > spark[spark.length - 3];
  const trendDown = spark.length >= 3 && spark[spark.length - 1] < spark[spark.length - 2] && spark[spark.length - 2] < spark[spark.length - 3];
  const min = Math.min(...spark);
  const near = crop.currentPrice <= min * 1.03;
  if (trendUp && changePct > 0.5) return { text: "📈 3일 연속 상승 중", color: "#E03131" };
  if (trendDown && changePct < -0.5) return { text: "📉 하락 추세 이어짐", color: "#1971C2" };
  if (near) return { text: "📉 이번 주 최저가 근접", color: "#1971C2" };
  return { text: "→ 보합세 유지 중", color: "#6C757D" };
}

export function CropCard({ crop }: { crop: Crop }) {
  const favItem = fromCrop(crop);
  const favId = favoriteKey(favItem);
  const watched = useFavoritePriceStore((s) => s.items.some((it) => it.id === favId));
  const toggleFavorite = useFavoritePriceStore((s) => s.toggleFavorite);
  const changePct = ((crop.currentPrice - crop.prevPrice) / crop.prevPrice) * 100;
  const catLabel = CATEGORIES.find((c) => c.id === crop.category)?.label ?? "";
  const insight = insightFor(crop, changePct);

  const urgent = Math.abs(changePct) >= 5;
  const urgentUp = urgent && changePct > 0;
  const urgentDown = urgent && changePct < 0;

  return (
    <Link
      to="/market/$crop"
      params={{ crop: crop.id }}
      className={cn(
        "block overflow-hidden rounded-[12px] bg-white px-4 py-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.05)] transition-colors active:bg-secondary",
        urgentUp && "bg-[#FFFAFA]",
        urgentDown && "bg-[#F8FAFF]",
      )}
      style={
        urgent
          ? {
              boxShadow: `inset 3px 0 0 ${urgentUp ? "#E03131" : "#1971C2"}, 0 1px 4px rgba(0,0,0,0.05)`,
            }
          : undefined
      }
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="text-2xl" aria-hidden>
            {crop.emoji}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="truncate text-[15px] font-bold text-foreground">
                {crop.name}
              </span>
              <span className="shrink-0 rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                {catLabel}
              </span>
              {crop.aiReady && (
                <span className="shrink-0 rounded-md bg-[#F0F9F0] px-1.5 py-0.5 text-[10px] font-semibold text-[#3A8A3A]">
                  예측 가능
                </span>
              )}
            </div>
            <div className="mt-0.5 text-[11px] text-[#ADB5BD]">
              업데이트 {crop.updatedAt}
            </div>
          </div>
        </div>
        <StarToggle
          active={watched}
          onClick={() => {
            const added = toggleFavorite(favItem);
            toast(added ? "즐겨찾기에 추가되었습니다 ★" : "즐겨찾기에서 제거되었습니다");
          }}
        />
      </div>

      <div className="mt-2.5 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <div className="font-data text-[24px] font-bold leading-none tabular-nums text-foreground">
            {crop.currentPrice.toLocaleString()}
            <span className="ml-1 text-[12px] font-medium text-muted-foreground">
              {crop.unit}
            </span>
          </div>
        </div>
        <div className="h-10 w-[90px] shrink-0">
          <Sparkline data={crop.spark} up={changePct >= 0} />
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <PriceBadge changePct={changePct} />
          <span className="text-[11px] text-[#6C757D]">
            거래량 {crop.volumeTon.toLocaleString()}t
          </span>
        </div>
        <span className="text-[11px] font-medium" style={{ color: insight.color }}>
          {insight.text}
        </span>
      </div>
    </Link>
  );
}
