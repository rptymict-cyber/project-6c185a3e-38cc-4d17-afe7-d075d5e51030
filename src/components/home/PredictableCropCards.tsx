import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { PREDICTABLE_CROPS } from "@/features/prediction/mockPredictionData";
import { cn } from "@/lib/utils";
import { CropIcon } from "@/components/crop-icon";

// 홈에 뿌릴 최소 시세 값 (예측 가능 5개 작물 전용)
const HOME_PRICE: Record<
  string,
  { price: number; changePct: number; unitLabel: string }
> = {
  apple: { price: 12840, changePct: -3.2, unitLabel: "10kg" },
  cabbage: { price: 5640, changePct: 8.2, unitLabel: "10kg" },
  radish: { price: 7220, changePct: 6.1, unitLabel: "20kg" },
  onion: { price: 8480, changePct: -4.1, unitLabel: "15kg" },
  chili: { price: 9840, changePct: -1.4, unitLabel: "1kg" },
};

function ChangeBadge({ changePct }: { changePct: number }) {
  const up = changePct > 0;
  return (
    <span
      className={cn(
        "inline-flex items-center text-[13px] font-bold tabular-nums",
        up ? "text-[#E03131]" : "text-[#1971C2]",
      )}
    >
      {up ? "▲" : "▼"} {Math.abs(changePct).toFixed(1)}%
    </span>
  );
}

export function PredictableCropCards() {
  return (
    <section className="mx-4 mt-6 rounded-2xl border border-[#EEF0F2] bg-white p-4">
      {/* Section header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-[16px] font-bold text-foreground">
            AI 가격 예측
          </h3>
          <p className="mt-0.5 text-[12px] text-[#6C757D]">
            5개 품목의 예상 가격과 유리한 시점을 확인해보세요
          </p>
        </div>
        <Link
          to="/prediction"
          className="flex shrink-0 items-center gap-0.5 text-[12px] font-semibold text-[#6C757D]"
        >
          더보기
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Horizontal scroll cards */}
      <div className="no-scrollbar -mx-4 mt-3 flex gap-[11px] overflow-x-auto px-4 pb-1">
        {PREDICTABLE_CROPS.map((crop) => {
          const h = HOME_PRICE[crop.id] ?? {
            price: 0,
            changePct: 0,
            unitLabel: "kg",
          };
          return (
            <Link
              key={crop.id}
              to="/prediction"
              search={{ cropId: crop.id, entrySource: "home" }}
              className="flex w-[150px] min-w-[150px] flex-col rounded-[14px] border border-[#EEF0F2] bg-white p-3.5 transition-colors active:bg-[#F8F9FA]"
            >
              <div className="mb-2.5 h-10 w-10">
                <CropIcon name={crop.name} size={40} />
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[15px] font-bold text-foreground">
                  {crop.name}
                </span>
                <span className="rounded bg-[#F1F3F5] px-1.5 py-0.5 text-[10px] font-medium text-[#868E96]">
                  {crop.categoryName}
                </span>
              </div>

              <div className="mt-2 whitespace-nowrap text-[16px] font-bold tabular-nums text-foreground">
                {h.price.toLocaleString()}원/{h.unitLabel}
              </div>

              <div className="mt-auto flex w-full items-center justify-between pt-2">
                <ChangeBadge changePct={h.changePct} />
                <span className="rounded-md bg-[#E6F5E9] px-1.5 py-0.5 text-[10px] font-semibold text-[#2F9E44]">
                  AI 가격 예측
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
