import { TrendingDown, TrendingUp, Info, AlertTriangle } from "lucide-react";
import type { PredictionFactor } from "../types";

export function PredictionFactorList({
  factors,
}: {
  factors: PredictionFactor[];
}) {
  return (
    <div className="space-y-2">
      {factors.map((f, i) => (
        <div
          key={`${f.type}-${i}`}
          className="flex items-start gap-3 rounded-xl border border-[#E9ECEF] bg-white px-3 py-2.5"
        >
          <div
            className={
              f.type === "positive"
                ? "grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#FFF1F0] text-[#E03131]"
                : f.type === "negative"
                  ? "grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#E7F1FB] text-[#1971C2]"
                  : "grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#FFF7E0] text-[#B78900]"
            }
          >
            {f.type === "positive" ? (
              <TrendingUp className="h-4 w-4" />
            ) : f.type === "negative" ? (
              <TrendingDown className="h-4 w-4" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-semibold text-foreground">
              {f.title}
            </div>
            <div className="mt-0.5 text-[11.5px] leading-relaxed text-[#6C757D]">
              {f.description}
            </div>
          </div>
        </div>
      ))}
      <div className="flex items-start gap-1.5 rounded-xl bg-[#F8F9FA] px-3 py-2 text-[11px] leading-relaxed text-[#6C757D]">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span>
          AI 가격 예측은 최근 경매 데이터와 가격 흐름을 기반으로 한 참고
          정보입니다. 실제 거래 가격은 시장 상황에 따라 달라질 수 있습니다.
        </span>
      </div>
    </div>
  );
}
