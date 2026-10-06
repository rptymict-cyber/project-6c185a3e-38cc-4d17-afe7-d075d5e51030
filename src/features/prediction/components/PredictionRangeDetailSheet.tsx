import { PredictionSheetFrame, SheetPrimaryButton } from "./PredictionSheetFrame";
import type { PredictionPoint } from "../types";

export function PredictionRangeDetailSheet({
  open,
  onOpenChange,
  point,
  baseUnitLabel,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  point?: PredictionPoint;
  baseUnitLabel: string;
}) {
  const mid = point?.predictedPrice;
  const opt = point?.optimisticPrice;
  const pess = point?.pessimisticPrice;

  const has = mid != null && opt != null && pess != null;
  const spread = has ? (opt! - pess!) / 2 : 0;
  const likelyLow = has ? Math.round(mid! - spread * 0.55) : 0;
  const likelyHigh = has ? Math.round(mid! + spread * 0.55) : 0;

  return (
    <PredictionSheetFrame
      open={open}
      onOpenChange={onOpenChange}
      title="예측 범위 자세히"
      footer={<SheetPrimaryButton onClick={() => onOpenChange(false)}>확인</SheetPrimaryButton>}
    >
        <div className="px-4 py-4">
          <p className="text-caption leading-snug text-[#495057]">
            AI는 하나의 값이 아니라 가격이 들어올 <b>범위</b>를 예측합니다.
            확신하는 정도에 따라 범위의 넓이가 달라집니다.
          </p>

          {has && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-3 rounded-xl border border-[#E9ECEF] bg-white p-3">
                <span className="inline-block h-6 w-2 rounded-full bg-[#2E9E6B]" />
                <div className="flex-1">
                  <div className="text-caption font-bold text-foreground">
                    유력 범위
                  </div>
                  <div className="text-meta text-[#6C757D]">
                    가격이 이 안에 들 가능성 60%
                  </div>
                </div>
                <div className="text-right text-caption font-extrabold tabular-nums text-foreground">
                  {likelyLow.toLocaleString()} ~ {likelyHigh.toLocaleString()}
                  <div className="text-meta font-medium text-[#6C757D]">
                    원 / {baseUnitLabel}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-[#E9ECEF] bg-white p-3">
                <span className="inline-block h-6 w-2 rounded-full bg-[#2E9E6B]/40" />
                <div className="flex-1">
                  <div className="text-caption font-bold text-foreground">
                    최대 범위
                  </div>
                  <div className="text-meta text-[#6C757D]">
                    거의 대부분(90%)이 이 안에 듭니다
                  </div>
                </div>
                <div className="text-right text-caption font-extrabold tabular-nums text-foreground">
                  {pess!.toLocaleString()} ~ {opt!.toLocaleString()}
                  <div className="text-meta font-medium text-[#6C757D]">
                    원 / {baseUnitLabel}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-3 rounded-xl bg-[#F0F9F0] px-3 py-2.5 text-meta leading-snug text-[#2c6444]">
            📌 차트의 밴드는 낙관~비관 범위, 가운데 선은 예상 가격입니다. 예상 가격이 가장 가능성이 높습니다.
          </div>

        </div>
    </PredictionSheetFrame>
  );
}
