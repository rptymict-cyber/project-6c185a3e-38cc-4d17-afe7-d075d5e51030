import { CalendarCheck, TrendingDown, TrendingUp } from "lucide-react";
import type { PredictionInsight } from "../types";
import { cn } from "@/lib/utils";

export function PredictionInsightCard({
  insight,
  confidenceScore,
}: {
  insight: PredictionInsight;
  confidenceScore: number;
}) {
  const isFarmer = insight.viewpoint === "farmer";
  const up = insight.expectedDiffPrice >= 0;
  const diffColor = up ? "text-[#E03131]" : "text-[#1971C2]";
  const sign = up ? "+" : "";

  return (
    <section
      className={cn(
        "rounded-2xl px-4 py-4 text-white",
        isFarmer
          ? "bg-gradient-to-br from-[#3A8A3A] to-[#2F6F2F]"
          : "bg-gradient-to-br from-[#1971C2] to-[#155A9A]",
      )}
    >
      <div className="flex items-center gap-2 text-[12px] font-semibold opacity-95">
        <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5">
          {insight.recommendationTitle}
        </span>
        <span className="opacity-80">신뢰도 {confidenceScore}%</span>
      </div>

      <div className="mt-2 flex items-center gap-1.5 text-[16px] font-bold leading-snug">
        <CalendarCheck className="h-4 w-4" />
        {insight.recommendationDate} {isFarmer ? "출하가" : "매입이"} 유리해요
      </div>

      <div className="mt-3 flex items-end gap-1.5">
        <span className="text-[11px] opacity-80">
          예상 {isFarmer ? "판매가" : "매입가"}
        </span>
      </div>
      <div className="flex items-end gap-1.5">
        <span className="text-[26px] font-black leading-none tabular-nums">
          {insight.expectedPrice.toLocaleString()}
        </span>
        <span className="pb-0.5 text-[13px] font-semibold">원</span>
      </div>

      <div
        className={cn(
          "mt-1 inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[12px] font-bold tabular-nums",
          diffColor,
        )}
      >
        {up ? (
          <TrendingUp className="h-3.5 w-3.5" />
        ) : (
          <TrendingDown className="h-3.5 w-3.5" />
        )}
        {sign}
        {insight.expectedDiffPrice.toLocaleString()}원 ({sign}
        {insight.expectedDiffRate.toFixed(1)}%)
      </div>

      <p className="mt-3 text-[12px] leading-relaxed opacity-95">
        {insight.summary}
      </p>
    </section>
  );
}
