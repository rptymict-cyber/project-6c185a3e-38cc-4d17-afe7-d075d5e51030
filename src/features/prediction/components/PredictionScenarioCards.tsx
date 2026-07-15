import type { PredictionPoint } from "../types";

function fmtDiff(n: number) {
  if (n === 0) return "0";
  const sign = n > 0 ? "+" : "-";
  return `${sign}${Math.abs(n).toLocaleString()}`;
}

export function PredictionScenarioCards({
  point,
  baseUnitLabel,
  onOpenRangeDetail,
}: {
  point?: PredictionPoint;
  baseUnitLabel: string;
  onOpenRangeDetail: () => void;
}) {
  const mid = point?.predictedPrice;
  const opt = point?.optimisticPrice;
  const pess = point?.pessimisticPrice;

  if (mid == null || opt == null || pess == null) return null;

  const optDiff = opt - mid;
  const pessDiff = pess - mid;

  return (
    <section>
      <div className="grid grid-cols-3 gap-2">
        {/* 낙관 */}
        <div className="rounded-[13px] border border-[#E9ECEF] bg-white p-2.5 text-center">
          <div className="text-[11px] font-bold text-[#E8590C]">▲ 낙관</div>
          <div className="mt-1 flex items-baseline justify-center gap-0.5">
            <span className="text-[16px] font-black tabular-nums text-foreground">
              {opt.toLocaleString()}
            </span>
            <span className="text-[10px] font-semibold text-[#6C757D]">원</span>
          </div>
          <div className="mt-0.5 text-[10px] font-bold text-[#E8590C]">
            {fmtDiff(optDiff)}
          </div>
        </div>
        {/* 중립 */}
        <div className="relative rounded-[13px] border-2 border-[#2E9E6B] bg-[#F0F9F0] p-2.5 pt-3.5 text-center">
          <span className="absolute left-1/2 top-[-9px] -translate-x-1/2 whitespace-nowrap rounded-full bg-[#2E9E6B] px-2 py-[2px] text-[9.5px] font-extrabold text-white">
            가장 가능성 높음
          </span>
          <div className="text-[11px] font-bold text-[#1F5C1F]">● 중립</div>
          <div className="mt-1 flex items-baseline justify-center gap-0.5">
            <span className="text-[16px] font-black tabular-nums text-[#1F5C1F]">
              {mid.toLocaleString()}
            </span>
            <span className="text-[10px] font-semibold text-[#1F5C1F]/70">원</span>
          </div>
          <div className="mt-0.5 text-[10px] font-bold text-[#1F5C1F]">기준</div>
        </div>
        {/* 비관 */}
        <div className="rounded-[13px] border border-[#E9ECEF] bg-white p-2.5 text-center">
          <div className="text-[11px] font-bold text-[#1971C2]">▼ 비관</div>
          <div className="mt-1 flex items-baseline justify-center gap-0.5">
            <span className="text-[16px] font-black tabular-nums text-foreground">
              {pess.toLocaleString()}
            </span>
            <span className="text-[10px] font-semibold text-[#6C757D]">원</span>
          </div>
          <div className="mt-0.5 text-[10px] font-bold text-[#1971C2]">
            {fmtDiff(pessDiff)}
          </div>
        </div>
      </div>

      <div className="mt-2 rounded-xl bg-[#F0F9F0] px-3 py-2 text-[11px] leading-snug text-[#2c6444]">
        💡 추천일 시세는 보통 이 정도(중립), 잘 되면 낙관, 안 되면 비관까지
        움직일 수 있어요. 뒤로 갈수록 범위가 넓어지는 건 그만큼 예측이
        어렵다는 뜻이에요.
      </div>

      <div className="mt-1.5 text-center">
        <button
          type="button"
          onClick={onOpenRangeDetail}
          className="text-[11.5px] text-[#6C757D] underline underline-offset-2"
        >
          예측 범위 자세히 보기 ›
        </button>
      </div>

    </section>
  );
}
