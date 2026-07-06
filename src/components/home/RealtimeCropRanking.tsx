import { Link } from "@tanstack/react-router";
import { HelpCircle, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CROPS } from "@/lib/mock/crops";
import { CropRankingRow, type RankingItem } from "./CropRankingRow";
import { cn } from "@/lib/utils";

type FilterId = "popular" | "up" | "down" | "volume" | "change";

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "popular", label: "인기조회" },
  { id: "up", label: "상승률" },
  { id: "down", label: "하락률" },
  { id: "volume", label: "거래량" },
  { id: "change", label: "가격변동" },
];

const MARKETS = [
  "서울 가락시장 · 특 · 10kg망",
  "대구 북부시장 · 상 · 20kg박스",
  "구리시장 · 상 · 1kg단",
  "의성·안동 · 상 · 1kg",
  "부산 엄궁시장 · 상 · 15kg망",
  "서울 강서시장 · 상 · 10kg박스",
  "광주 각화시장 · 상 · 5kg박스",
  "인천 삼산시장 · 상 · 10kg망",
];

export function RealtimeCropRanking() {
  const [filter, setFilter] = useState<FilterId>("up");

  const items: RankingItem[] = useMemo(() => {
    const rows = CROPS.map((c, i) => {
      const pct = ((c.currentPrice - c.prevPrice) / c.prevPrice) * 100;
      return {
        cropId: c.id,
        name: c.name,
        emoji: c.emoji,
        price: c.currentPrice,
        unit: c.unit,
        changePct: pct,
        volume: c.volumeTon,
        meta: MARKETS[i % MARKETS.length],
      };
    });
    const sorted = [...rows];
    if (filter === "up") sorted.sort((a, b) => b.changePct - a.changePct);
    else if (filter === "down") sorted.sort((a, b) => a.changePct - b.changePct);
    else if (filter === "volume") sorted.sort((a, b) => b.volume - a.volume);
    else if (filter === "change")
      sorted.sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct));
    return sorted.slice(0, 5).map((r, idx) => ({ ...r, rank: idx + 1 }));
  }, [filter]);

  return (
    <section className="mt-6">
      <div className="flex items-center justify-between px-4">
        <h2 className="flex items-center gap-1 text-[15px] font-bold text-foreground">
          실시간 시세 랭킹
          <HelpCircle className="h-3.5 w-3.5 text-[#ADB5BD]" />
        </h2>
        <div className="flex items-center gap-1 text-[11px] text-[#868E96]">
          <span>2026.07.03 14:30 기준</span>
          <button
            aria-label="새로고침"
            onClick={() => toast("최신 시세로 업데이트했어요")}
            className="grid h-7 w-7 place-items-center rounded-full hover:bg-secondary"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="no-scrollbar mt-2 flex gap-1.5 overflow-x-auto px-4 pb-1">
        {FILTERS.map((f) => {
          const active = f.id === filter;
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors",
                active
                  ? "bg-[#3A8A3A] text-white"
                  : "bg-[#F1F3F5] text-[#495057] hover:bg-[#E9ECEF]",
              )}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="mt-1 divide-y divide-[#F1F3F5]">
        {items.map((item) => (
          <CropRankingRow key={item.cropId} item={item} />
        ))}
      </div>

      <div className="px-4 pt-2">
        <Link
          to="/market"
          className="flex h-11 items-center justify-center rounded-xl border border-[#E9ECEF] text-[13px] font-semibold text-[#495057]"
        >
          더보기 ›
        </Link>
      </div>
    </section>
  );
}
