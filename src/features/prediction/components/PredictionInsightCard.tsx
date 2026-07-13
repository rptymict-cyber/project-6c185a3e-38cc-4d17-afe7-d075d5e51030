import { ChevronRight, Sparkles, TrendingDown, TrendingUp } from "lucide-react";
import type { PredictionViewpoint } from "../types";
import { cn } from "@/lib/utils";

interface Props {
  viewpoint: PredictionViewpoint;
  recommendationDate: string; // 표시용 짧은 라벨 (예: "7/19")
  expectedPrice: number;
  currentPrice: number;
  baseUnitLabel: string; // "10kg"
  quantityBoxes: number;
  isPositiveForUser: boolean;
  cropName: string;
  onDetailClick: () => void;
}

export function PredictionInsightCard({
  viewpoint,
  recommendationDate,
  expectedPrice,
  currentPrice,
  baseUnitLabel,
  quantityBoxes,
  isPositiveForUser,
  cropName,
  onDetailClick,
}: Props) {
  const isFarmer = viewpoint === "farmer";
  const diffPrice = expectedPrice - currentPrice;
  const diffAbs = Math.abs(diffPrice);
  const priceHigher = diffPrice > 0;
  const priceLower = diffPrice < 0;

  const totalRevenue = expectedPrice * quantityBoxes;
  const totalDiff = diffPrice * quantityBoxes;
  // 관점별 이득: 농민=매출↑, 도매상=비용↓
  const gain = isFarmer ? totalDiff : -totalDiff;
  const gainAbs = Math.abs(gain);

  const badge = isFarmer
    ? isPositiveForUser
      ? "AI 출하 추천"
      : "AI 출하 안내"
    : isPositiveForUser
      ? "AI 매입 추천"
      : "AI 매입 안내";

  const action = isFarmer ? "출하" : "매입";
  const headline = isPositiveForUser
    ? `${action}에 유리해요`
    : priceHigher || priceLower
      ? `${action} 시점을 검토하세요`
      : `${action} 참고`;

  const gainLabel = isFarmer ? "예상 추가 수익" : "예상 절감액";
  const revenueLabel = isFarmer ? "예상 매출" : "예상 매입액";

  return (
    <section
      className="relative overflow-hidden rounded-3xl px-5 pb-4 pt-5 text-white shadow-[0_16px_40px_-16px_rgba(46,158,107,0.55)]"
      style={{
        background:
          "linear-gradient(145deg, #2E9E6B 0%, #1F7A50 55%, #145A3A 100%)",
      }}
    >
      {/* Decorative glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-30 blur-2xl"
        style={{ background: "radial-gradient(circle,#7EE2B2,transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle,#A6F0CB,transparent 70%)" }}
      />

      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-bold backdrop-blur">
            <Sparkles className="h-3 w-3" />
            {badge}
          </span>
          <span className="text-[10.5px] font-semibold uppercase tracking-wider text-white/70">
            {"\n"}
          </span>
        </div>

        {/* 큰 날짜 헤드라인 */}
        <div className="mt-3 flex items-end gap-2">
          <span
            className="tabular-nums leading-none text-white"
            style={{
              fontSize: "38px",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              textShadow: "0 2px 12px rgba(0,0,0,0.15)",
            }}
          >
            {recommendationDate}
          </span>
          <span className="pb-1 text-[15px] font-extrabold leading-tight text-white">
            {headline}
          </span>
        </div>

        <div className="mt-1 flex items-center gap-1.5">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[11.5px] font-bold tabular-nums",
              priceHigher
                ? "text-[#E03131]"
                : priceLower
                  ? "text-[#1971C2]"
                  : "text-[#495057]",
            )}
          >
            {priceHigher ? (
              <TrendingUp className="h-3 w-3" />
            ) : priceLower ? (
              <TrendingDown className="h-3 w-3" />
            ) : null}
            오늘 대비 {priceHigher ? "+" : priceLower ? "-" : ""}
            {diffAbs.toLocaleString()}원
          </span>
        </div>

        {/* KPI 3개 */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-white/12 px-2.5 py-2 backdrop-blur-sm">
            <div className="text-[10px] font-semibold text-white/75">
              예상 평균가
            </div>
            <div className="mt-1 flex items-baseline whitespace-nowrap">
              <span
                className="font-black tabular-nums leading-none"
                style={{ fontSize: "clamp(13px, 3.8vw, 16px)" }}
              >
                {formatFullWon(expectedPrice)}
              </span>
            </div>
            <div className="mt-0.5 text-[9.5px] text-white/60">
              / {baseUnitLabel}
            </div>
          </div>

          <div className="rounded-xl bg-white/12 px-2.5 py-2 backdrop-blur-sm">
            <div className="text-[10px] font-semibold text-white/75">
              {revenueLabel}
            </div>
            <div className="mt-1 flex items-baseline whitespace-nowrap">
              <span
                className="font-black tabular-nums leading-none"
                style={{ fontSize: "clamp(13px, 3.8vw, 16px)" }}
              >
                {formatFullWon(totalRevenue)}
              </span>
            </div>
            <div className="mt-0.5 text-[9.5px] text-white/60">
              {quantityBoxes}상자
            </div>
          </div>

          <div
            className={cn(
              "rounded-xl px-2.5 py-2",
              gain >= 0
                ? "bg-white text-[#1F5C1F]"
                : "bg-white text-[#B02525]",
            )}
          >
            <div className="text-[10px] font-bold opacity-80">{gainLabel}</div>
            <div className="mt-1 flex items-baseline whitespace-nowrap">
              <span
                className="font-black tabular-nums leading-none"
                style={{ fontSize: "clamp(13px, 3.8vw, 16px)" }}
              >
                {gain === 0
                  ? "0원"
                  : `${gain > 0 ? "+" : "-"}${formatFullWon(gainAbs)}`}
              </span>
            </div>
            <div className="mt-0.5 text-[9.5px] opacity-70">
              오늘 대비
            </div>
          </div>
        </div>

        {/* 결합 CTA */}
        <button
          type="button"
          onClick={onDetailClick}
          className="mt-4 flex w-full items-center justify-between rounded-2xl bg-white/15 px-3.5 py-2.5 text-[12.5px] font-bold text-white backdrop-blur-sm transition-colors active:bg-white/25"
        >
          <span>시세 상세 보기</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}

function formatFullWon(v: number): string {
  return `${Math.round(v).toLocaleString("ko-KR")}원`;
}
