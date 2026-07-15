import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="mx-auto max-w-[430px] rounded-t-2xl p-0"
      >
        <SheetHeader className="border-b border-[#E9ECEF] px-4 py-3.5 text-left">
          <SheetTitle className="text-[15px] font-bold text-foreground">
            예측 범위 자세히
          </SheetTitle>
        </SheetHeader>
        <div className="px-4 py-4">
          <p className="text-[12px] leading-snug text-[#495057]">
            AI는 하나의 값이 아니라 가격이 들어올 <b>범위</b>를 예측해요.
            확신하는 정도에 따라 범위 넓이가 달라집니다.
          </p>

          {has && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-3 rounded-xl border border-[#E9ECEF] bg-white p-3">
                <span className="inline-block h-6 w-2 rounded-full bg-[#2E9E6B]" />
                <div className="flex-1">
                  <div className="text-[12.5px] font-bold text-foreground">
                    유력 범위
                  </div>
                  <div className="text-[11px] text-[#6C757D]">
                    가격이 이 안에 들 가능성 60%
                  </div>
                </div>
                <div className="text-right text-[12.5px] font-extrabold tabular-nums text-foreground">
                  {likelyLow.toLocaleString()} ~ {likelyHigh.toLocaleString()}
                  <div className="text-[10px] font-medium text-[#6C757D]">
                    원 / {baseUnitLabel}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-[#E9ECEF] bg-white p-3">
                <span className="inline-block h-6 w-2 rounded-full bg-[#2E9E6B]/40" />
                <div className="flex-1">
                  <div className="text-[12.5px] font-bold text-foreground">
                    최대 범위
                  </div>
                  <div className="text-[11px] text-[#6C757D]">
                    거의 대부분(90%) 이 안
                  </div>
                </div>
                <div className="text-right text-[12.5px] font-extrabold tabular-nums text-foreground">
                  {pess!.toLocaleString()} ~ {opt!.toLocaleString()}
                  <div className="text-[10px] font-medium text-[#6C757D]">
                    원 / {baseUnitLabel}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-3 rounded-xl bg-[#F0F9F0] px-3 py-2.5 text-[11.5px] leading-snug text-[#2c6444]">
            📌 화면의 낙관·중립·비관은 이 범위를 알기 쉽게 3갈래로 나눈
            거예요. 중립이 가장 가능성 높은 값입니다.
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="mt-4 grid h-11 w-full place-items-center rounded-xl bg-[#2E9E6B] text-[14px] font-bold text-white active:bg-[#1F7A50]"
          >
            확인
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
