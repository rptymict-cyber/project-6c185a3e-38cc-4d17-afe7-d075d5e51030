import { cn } from "@/lib/utils";
import type { PredictionViewpoint } from "../types";

interface Props {
  viewpoint: PredictionViewpoint;
  currentPrice: number;
  expectedPrice: number;
  baseUnitLabel: string; // "10kg"
  quantityBoxes: number;
  recommendationDate: string;
  isRecommendedSelection: boolean;
}

export function PredictionCompareCards({
  viewpoint,
  currentPrice,
  expectedPrice,
  baseUnitLabel,
  quantityBoxes,
  recommendationDate,
  isRecommendedSelection,
}: Props) {
  const isFarmer = viewpoint === "farmer";
  const title = isFarmer ? "출하 시점 비교" : "매입 시점 비교";
  const qtyLabel = isFarmer ? "출하량" : "매입량";
  const totalLabel = isFarmer ? "예상 매출" : "예상 금액";

  const currentTotal = currentPrice * quantityBoxes;
  const recTotal = expectedPrice * quantityBoxes;
  const diff = recTotal - currentTotal;

  // 농민=매출↑, 도매상=비용↓
  const gain = isFarmer ? diff : -diff;
  const isPositive = gain >= 0;
  const gainLabel = isFarmer ? "추가 수익" : "예상 절감";
  const tagText = isRecommendedSelection ? "추천" : "선택";
  const rightTitle = isRecommendedSelection
    ? `${recommendationDate} ${isFarmer ? "출하 추천" : "매입 추천"}`
    : `${recommendationDate} ${isFarmer ? "출하 시" : "매입 시"}`;

  const bannerGrad = isPositive
    ? "linear-gradient(135deg,#2E9E6B 0%,#1F7A50 100%)"
    : "linear-gradient(135deg,#E03131 0%,#B02525 100%)";

  return (
    <section>
      <h2 className="mb-2 text-[13px] font-bold text-foreground">{title}</h2>
      <div className="grid grid-cols-2 gap-2">
        {/* 현재 시점 */}
        <div className="rounded-2xl border border-[#E9ECEF] bg-white p-3">
          <div className="text-[11px] font-semibold text-[#868E96]">
            현재 시점 {isFarmer ? "출하" : "매입"}
          </div>
          <div className="mt-1.5 flex items-baseline gap-1">
            <span className="text-[18px] font-black tabular-nums text-foreground">
              {currentPrice.toLocaleString()}
            </span>
            <span className="text-[11px] text-[#6C757D]">원/{baseUnitLabel}</span>
          </div>
          <div className="mt-2 text-[11.5px] text-[#495057]">
            {qtyLabel} {quantityBoxes}상자
          </div>
          <div className="mt-0.5 text-[11.5px] text-[#495057]">
            {totalLabel}{" "}
            <span className="font-bold tabular-nums text-foreground">
              {currentTotal.toLocaleString()}원
            </span>
          </div>
        </div>

        {/* 선택/추천 시점 */}
        <div className="relative rounded-2xl border-2 border-[#2E9E6B] bg-[#EAF7F0] p-3">
          <span
            className={cn(
              "absolute right-2 top-2 rounded-full px-1.5 py-0.5 text-[9px] font-bold text-white",
              isRecommendedSelection ? "bg-[#2E9E6B]" : "bg-[#1F7A50]",
            )}
          >
            {tagText}
          </span>
          <div className="text-[11px] font-semibold text-[#145A3A]">
            {rightTitle}
          </div>
          <div className="mt-1.5 flex items-baseline gap-1">
            <span className="text-[18px] font-black tabular-nums text-[#145A3A]">
              {expectedPrice.toLocaleString()}
            </span>
            <span className="text-[11px] text-[#145A3A]/80">
              원/{baseUnitLabel}
            </span>
          </div>
          <div className="mt-2 text-[11.5px] text-[#145A3A]">
            {qtyLabel} {quantityBoxes}상자
          </div>
          <div className="mt-0.5 text-[11.5px] text-[#145A3A]">
            {totalLabel}{" "}
            <span className="font-bold tabular-nums">
              {recTotal.toLocaleString()}원
            </span>
          </div>
        </div>
      </div>

      {/* 강조 배너 — 추가 수익 / 예상 절감 */}
      <div
        className="mt-2 flex items-center justify-between rounded-2xl px-4 py-3 text-white shadow-[0_10px_28px_-14px_rgba(46,158,107,0.6)]"
        style={{ background: bannerGrad }}
      >
        <div>
          <div className="text-[11px] font-semibold opacity-90">
            {recommendationDate} {isFarmer ? "출하 시" : "매입 시"}
          </div>
          <div className="mt-0.5 text-[12px] font-bold opacity-95">
            {gainLabel}
          </div>
        </div>
        <div className="flex items-baseline gap-0.5">
          <span
            className="tabular-nums leading-none"
            style={{ fontSize: "22px", fontWeight: 900, letterSpacing: "-0.01em" }}
          >
            {isPositive ? "+" : "-"}
            {Math.abs(gain).toLocaleString()}
          </span>
          <span className="text-[13px] font-extrabold">원</span>
        </div>
      </div>
    </section>
  );
}
