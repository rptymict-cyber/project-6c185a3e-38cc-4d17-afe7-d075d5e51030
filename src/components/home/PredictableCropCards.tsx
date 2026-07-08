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
        "inline-flex items-center text-[11px] font-bold tabular-nums",
        up ? "text-[#E03131]" : "text-[#1971C2]",
      )}
    >
      {up ? "▲" : "▼"} {Math.abs(changePct).toFixed(1)}%
    </span>
  );
}

export function PredictableCropCards() {
  return (
    <section className="mt-6">
      {/* Section header */}
      <div className="flex items-end justify-between px-4">
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
          className="flex items-center gap-0.5 text-[12px] font-semibold text-[#3A8A3A]"
        >
          전체보기
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Horizontal scroll cards */}
      <div className="no-scrollbar mt-3 flex gap-2.5 overflow-x-auto px-4 pb-1">
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
              className="flex min-w-[140px] max-w-[140px] flex-col rounded-[12px] border border-[#E9ECEF] bg-white p-3.5 transition-colors active:bg-[#F8F9FA]"
            >
              <CropIcon name={crop.name} size={32} />

              <div className="mt-2 flex items-center gap-1.5">
                <span className="text-[14px] font-bold text-foreground">
                  {crop.name}
                </span>
                <span className="shrink-0 rounded-md bg-[#F1F3F5] px-1.5 py-0.5 text-[10px] font-semibold text-[#6C757D]">
                  {crop.categoryName}
                </span>
              </div>

              <div className="mt-1.5 text-[12px] font-medium text-[#6C757D]">
                {h.price.toLocaleString()}원/{h.unitLabel}
              </div>

              <div className="mt-2 flex items-center justify-between">
                <ChangeBadge changePct={h.changePct} />
                <span className="shrink-0 rounded-full bg-[#F0F9F0] px-2 py-0.5 text-[10px] font-bold text-[#3A8A3A]">
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

