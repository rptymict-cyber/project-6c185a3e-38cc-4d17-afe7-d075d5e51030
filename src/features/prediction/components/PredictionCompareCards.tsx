import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { FullSelectCard } from "@/components/common/ConditionSelectCard";
import { toKg, unitKgOf, type AmountUnit } from "@/lib/units";
import { getWeatherForDate } from "@/lib/mock/weather";
import type { PredictionViewpoint } from "../types";

interface Props {
  viewpoint: PredictionViewpoint;
  currentPrice: number;
  baseUnitLabel: string; // "10kg"
  quantityBoxes: number;
  quantityUnitLabel?: string;
  quantityUnit?: AmountUnit;
  cropName: string;
  /** 사용자가 선택한 비교 날짜 (ISO). 없으면 선택 전 상태 */
  compareIso?: string;
  /** 비교 날짜 표시 라벨 (예: "9월 25일") */
  compareLabel: string;
  /** 비교 날짜 예상 가격. undefined면 예측값 없음 */
  comparePrice?: number;
  /** 선택 날짜가 AI 추천일과 동일한지 */
  isRecommendedSelection: boolean;
  onPickDate: () => void;
}

export function PredictionCompareCards({
  viewpoint,
  currentPrice,
  baseUnitLabel,
  quantityBoxes,
  quantityUnitLabel = "상자",
  quantityUnit = "box",
  cropName,
  compareIso,
  compareLabel,
  comparePrice,
  isRecommendedSelection,
  onPickDate,
}: Props) {
  const isFarmer = viewpoint === "farmer";
  const title = isFarmer ? "출하 시점 비교" : "매입 시점 비교";
  const action = isFarmer ? "출하" : "매입";
  const qtyLabel = isFarmer ? "출하량" : "매입량";
  const totalLabel = isFarmer ? "예상 판매금액" : "예상 금액";

  // 기준 단위 기준 환산 (기존 단위 환산 로직 재사용)
  const baseUnitKg = unitKgOf(baseUnitLabel) || 1;
  const baseUnitCount = toKg(quantityBoxes, quantityUnit, cropName) / baseUnitKg;
  const qtyText = `${quantityBoxes.toLocaleString()}${quantityUnitLabel}`;

  const hasPrice = comparePrice !== undefined && quantityBoxes > 0;
  const currentTotal = currentPrice * baseUnitCount;
  const compareTotal = hasPrice ? comparePrice! * baseUnitCount : undefined;
  const totalDiff =
    compareTotal !== undefined ? compareTotal - currentTotal : undefined;

  // 농민=판매금액↑, 도매상=매입비용↓ (물류비·수수료 미반영)
  const gain =
    totalDiff === undefined ? undefined : isFarmer ? totalDiff : -totalDiff;
  const isPositive = (gain ?? 0) >= 0;
  const bannerGrad = isPositive
    ? "linear-gradient(135deg,#2E9E6B 0%,#1F7A50 100%)"
    : "linear-gradient(135deg,#E03131 0%,#B02525 100%)";

  const weather = compareIso ? getWeatherForDate(compareIso) : undefined;
  const weatherNote =
    weather?.impact === "high"
      ? `${action} 작업에 주의가 필요합니다.`
      : weather?.impact === "warn"
        ? `${action} 작업 일정에 참고하세요.`
        : undefined;
  const precip = weather?.cause.steps[0]?.sm;

  return (
    <section>
      <h2 className="mb-2 text-body font-bold text-foreground">{title}</h2>

      {/* 사용자가 직접 선택하는 비교 날짜 */}
      <FullSelectCard
        icon={<Calendar className="h-4 w-4" />}
        label="비교 날짜"
        value={compareLabel}
        trigger="sheet"
        onClick={onPickDate}
      />

      {/* 금액 차이 배너 — 총 예상 판매금액 차이 (비용 미반영) */}
      {gain !== undefined ? (
        <div
          className="mt-2 flex items-center justify-between rounded-2xl px-4 py-3 text-white shadow-[0_10px_28px_-14px_rgba(46,158,107,0.6)]"
          style={{ background: bannerGrad }}
        >
          <div className="min-w-0">
            <div className="text-meta font-semibold opacity-90">
              {compareLabel} {action} 시
            </div>
            <div className="mt-0.5 text-caption font-bold opacity-95">
              오늘 {action} 대비 {totalLabel} 차이
            </div>
            <div className="mt-0.5 text-meta opacity-90">
              {qtyLabel} {qtyText} 기준
            </div>
          </div>
          <div className="flex shrink-0 items-baseline gap-0.5">
            <span
              className="tabular-nums leading-none"
              style={{
                fontSize: "22px",
                fontWeight: 900,
                letterSpacing: "-0.01em",
              }}
            >
              {isPositive ? "+" : "-"}
              {Math.round(Math.abs(gain)).toLocaleString()}
            </span>
            <span className="text-body font-extrabold">원</span>
          </div>
        </div>
      ) : (
        <div className="mt-2 rounded-2xl border border-[#E9ECEF] bg-[#F8F9FA] px-4 py-3 text-caption text-[#6C757D]">
          해당 날짜의 예측 시세가 없습니다.
        </div>
      )}

      <div className="mt-2 grid grid-cols-2 gap-2">
        {/* 오늘 출하 */}
        <div className="rounded-2xl border border-[#E9ECEF] bg-white p-3">
          <div className="text-meta font-semibold text-[#868E96]">
            오늘 {action}
          </div>
          <div className="mt-1.5 flex items-baseline gap-1">
            <span className="text-title font-black tabular-nums text-foreground">
              {currentPrice.toLocaleString()}
            </span>
            <span className="text-meta text-[#6C757D]">원/{baseUnitLabel}</span>
          </div>
          <div className="mt-2 text-meta text-[#495057]">
            {qtyLabel} {qtyText}
          </div>
          <div className="mt-0.5 text-meta text-[#495057]">
            {totalLabel}{" "}
            <span className="font-bold tabular-nums text-foreground">
              {Math.round(currentTotal).toLocaleString()}원
            </span>
          </div>
        </div>

        {/* 선택 날짜 출하 */}
        <div className="relative rounded-2xl border-2 border-[#2E9E6B] bg-[#EAF7F0] p-3">
          <span
            className={cn(
              "absolute right-2 top-2 rounded-full px-1.5 py-0.5 text-meta font-bold text-white",
              isRecommendedSelection ? "bg-[#2E9E6B]" : "bg-[#1F7A50]",
            )}
          >
            {isRecommendedSelection ? "추천" : "선택"}
          </span>
          <div className="text-meta font-semibold text-[#145A3A]">
            {compareLabel} {action}
          </div>
          {hasPrice ? (
            <>
              <div className="mt-1.5 flex items-baseline gap-1">
                <span className="text-title font-black tabular-nums text-[#145A3A]">
                  {comparePrice!.toLocaleString()}
                </span>
                <span className="text-meta text-[#145A3A]/80">
                  원/{baseUnitLabel}
                </span>
              </div>
              <div className="mt-2 text-meta text-[#145A3A]">
                {qtyLabel} {qtyText}
              </div>
              <div className="mt-0.5 text-meta text-[#145A3A]">
                {totalLabel}{" "}
                <span className="font-bold tabular-nums">
                  {Math.round(compareTotal!).toLocaleString()}원
                </span>
              </div>
            </>
          ) : (
            <p className="mt-2 text-meta leading-snug text-[#145A3A]">
              해당 날짜의 예측 시세가 없습니다.
            </p>
          )}
        </div>
      </div>

      {/* 선택 날짜 날씨 요약 (기존 안내 카드 스타일) */}
      <div className="mt-2 rounded-xl border border-[#E9ECEF] bg-white p-3">
        {weather ? (
          <div className="flex items-start gap-2">
            <span className="text-heading leading-none">{weather.icon}</span>
            <div className="min-w-0 flex-1">
              <div className="text-body font-bold text-foreground">
                {compareLabel} 예상 날씨
              </div>
              <p className="mt-1 text-meta leading-snug text-[#495057]">
                {weather.condition} · {weather.temp}°
                {precip ? ` · ${precip}` : ""}
              </p>
              {weatherNote ? (
                <p className="mt-1 text-meta font-semibold leading-snug text-[#E03B3B]">
                  {weatherNote}
                </p>
              ) : null}
            </div>
          </div>
        ) : (
          <p className="text-meta text-[#6C757D]">
            선택한 날짜의 날씨 정보가 없습니다.
          </p>
        )}
      </div>
    </section>
  );
}
