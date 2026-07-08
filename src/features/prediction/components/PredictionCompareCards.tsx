import { cn } from "@/lib/utils";
import type { PredictionViewpoint } from "../types";

interface Props {
  viewpoint: PredictionViewpoint;
  currentPrice: number;
  expectedPrice: number;
  baseUnitLabel: string; // "10kg"
  quantityBoxes: number;
  recommendationDate: string;
}

export function PredictionCompareCards({
  viewpoint,
  currentPrice,
  expectedPrice,
  baseUnitLabel,
  quantityBoxes,
  recommendationDate,
}: Props) {
  const isFarmer = viewpoint === "farmer";
  const title = isFarmer ? "출하 시점 비교" : "매입 시점 비교";
  const qtyLabel = isFarmer ? "출하량" : "매입량";
  const totalLabel = isFarmer ? "예상 매출" : "예상 금액";

  const currentTotal = currentPrice * quantityBoxes;
  const recTotal = expectedPrice * quantityBoxes;
  const diff = recTotal - currentTotal;

  // 농민에겐 매출 증가가, 도매상에겐 금액 감소가 이득
  const gain = isFarmer ? diff : -diff;
  const gainLabel = isFarmer ? "추가 수익" : "예상 절감";
  const gainSign = gain >= 0 ? "+" : "-";
  const gainColor = gain >= 0 ? "text-[#3A8A3A]" : "text-[#E03131]";

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
            <span className="text-[16px] font-black tabular-nums text-foreground">
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

        {/* 추천 시점 */}
        <div className="relative rounded-2xl border-2 border-[#3A8A3A] bg-[#F0F9F0] p-3">
          <span className="absolute right-2 top-2 rounded-full bg-[#3A8A3A] px-1.5 py-0.5 text-[9px] font-bold text-white">
            추천
          </span>
          <div className="text-[11px] font-semibold text-[#1F5C1F]">
            {recommendationDate} {isFarmer ? "출하 추천" : "매입 추천"}
          </div>
          <div className="mt-1.5 flex items-baseline gap-1">
            <span className="text-[16px] font-black tabular-nums text-[#1F5C1F]">
              {expectedPrice.toLocaleString()}
            </span>
            <span className="text-[11px] text-[#1F5C1F]/80">
              원/{baseUnitLabel}
            </span>
          </div>
          <div className="mt-2 text-[11.5px] text-[#1F5C1F]">
            {qtyLabel} {quantityBoxes}상자
          </div>
          <div className="mt-0.5 text-[11.5px] text-[#1F5C1F]">
            {totalLabel}{" "}
            <span className="font-bold tabular-nums">
              {recTotal.toLocaleString()}원
            </span>
          </div>
          <div className={cn("mt-1.5 text-[12px] font-bold tabular-nums", gainColor)}>
            {gainLabel} {gainSign}
            {Math.abs(gain).toLocaleString()}원
          </div>
        </div>
      </div>
    </section>
  );
}
