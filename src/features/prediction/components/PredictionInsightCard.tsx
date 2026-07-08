import { CalendarCheck, TrendingDown, TrendingUp } from "lucide-react";
import type { PredictionViewpoint } from "../types";
import { cn } from "@/lib/utils";

interface Props {
  viewpoint: PredictionViewpoint;
  recommendationDate: string;
  expectedPrice: number;
  currentPrice: number;
  baseUnitLabel: string; // e.g. "10kg"
  quantityBoxes: number;
  isPositiveForUser: boolean; // 농민=상승/도매상=하락 시 true
}

export function PredictionInsightCard({
  viewpoint,
  recommendationDate,
  expectedPrice,
  currentPrice,
  baseUnitLabel,
  quantityBoxes,
  isPositiveForUser,
}: Props) {
  const isFarmer = viewpoint === "farmer";
  const diffPrice = expectedPrice - currentPrice; // 음수 가능
  const diffAbs = Math.abs(diffPrice);
  const priceHigher = diffPrice > 0;
  const priceLower = diffPrice < 0;

  const totalDiff = diffPrice * quantityBoxes;
  const totalDiffAbs = Math.abs(totalDiff);

  // 배지 및 문구 분기
  let badge: string;
  let headline: string;
  let compareLine: string;
  let totalLine: string | null;
  let summary: string;

  if (isFarmer) {
    // 농민: 추천일 가격이 오늘보다 높으면 순수 추천, 낮으면 안내로 톤 조정
    if (isPositiveForUser && priceHigher) {
      badge = "AI 출하 추천";
      headline = `${recommendationDate} 출하가 유리해요`;
      compareLine = `오늘보다 ${diffAbs.toLocaleString()}원 높음`;
      totalLine = `${quantityBoxes}상자 기준 예상 추가 수익 +${totalDiffAbs.toLocaleString()}원`;
      summary =
        "가격 상승 흐름이 있어 추천일 출하 시 매출이 개선될 수 있어요.";
    } else if (priceLower) {
      badge = "AI 출하 안내";
      headline = `${recommendationDate} 이전 출하 검토`;
      compareLine = `오늘보다 ${diffAbs.toLocaleString()}원 낮을 수 있음`;
      totalLine = `${quantityBoxes}상자 기준 예상 매출 감소 -${totalDiffAbs.toLocaleString()}원`;
      summary =
        "예측 구간 내 상승 여지가 크지 않아 조기 출하를 검토해보세요.";
    } else {
      badge = "AI 출하 안내";
      headline = `${recommendationDate} 출하 참고`;
      compareLine = "오늘과 비슷한 수준";
      totalLine = null;
      summary = "예측 구간 내 큰 가격 변동이 감지되지 않았어요.";
    }
  } else {
    // 도매상: 추천일 가격이 오늘보다 낮으면 순수 추천
    if (isPositiveForUser && priceLower) {
      badge = "AI 매입 추천";
      headline = `${recommendationDate} 매입이 유리해요`;
      compareLine = `오늘보다 ${diffAbs.toLocaleString()}원 낮음`;
      totalLine = `${quantityBoxes}상자 기준 예상 절감액 ${totalDiffAbs.toLocaleString()}원`;
      summary =
        "단기 가격 하락 구간으로 필요한 물량 확보에 유리할 수 있어요.";
    } else if (priceHigher) {
      badge = "AI 매입 안내";
      headline = "가격 상승 가능성이 있어 조기 매입을 검토하세요";
      compareLine = `오늘보다 ${diffAbs.toLocaleString()}원 높을 수 있음`;
      totalLine = `${quantityBoxes}상자 기준 예상 추가 비용 +${totalDiffAbs.toLocaleString()}원`;
      summary = "추가 상승 전 필요한 물량을 먼저 확보하는 전략입니다.";
    } else {
      badge = "AI 매입 안내";
      headline = `${recommendationDate} 매입 참고`;
      compareLine = "오늘과 비슷한 수준";
      totalLine = null;
      summary = "예측 구간 내 큰 가격 변동이 감지되지 않았어요.";
    }
  }

  const diffColor = priceHigher
    ? "text-[#E03131]"
    : priceLower
      ? "text-[#1971C2]"
      : "text-[#495057]";

  return (
    <section
      className={cn(
        "rounded-2xl px-4 py-4 text-white",
        isFarmer
          ? "bg-gradient-to-br from-[#3A8A3A] to-[#2F6F2F]"
          : "bg-gradient-to-br from-[#1971C2] to-[#155A9A]",
      )}
    >
      <div className="flex items-center gap-2 text-[12px] font-semibold">
        <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5">
          {badge}
        </span>
      </div>

      <div className="mt-2 flex items-start gap-1.5 text-[16px] font-bold leading-snug">
        <CalendarCheck className="mt-0.5 h-4 w-4 shrink-0" />
        <span>{headline}</span>
      </div>

      <div className="mt-3 text-[11px] opacity-90">
        예상 {isFarmer ? "판매가" : "매입가"}
      </div>
      <div className="flex items-end gap-1.5">
        <span className="text-[26px] font-black leading-none tabular-nums">
          {expectedPrice.toLocaleString()}
        </span>
        <span className="pb-0.5 text-[13px] font-semibold">원</span>
        <span className="pb-0.5 text-[11.5px] opacity-80">
          / {baseUnitLabel}
        </span>
      </div>

      <div
        className={cn(
          "mt-2 inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[12px] font-bold tabular-nums",
          diffColor,
        )}
      >
        {priceHigher ? (
          <TrendingUp className="h-3.5 w-3.5" />
        ) : priceLower ? (
          <TrendingDown className="h-3.5 w-3.5" />
        ) : null}
        {compareLine}
      </div>

      {totalLine && (
        <div className="mt-2 rounded-lg bg-white/15 px-2.5 py-1.5 text-[12px] font-semibold">
          {totalLine}
        </div>
      )}

      <p className="mt-3 text-[12px] leading-relaxed opacity-95">{summary}</p>
    </section>
  );
}
