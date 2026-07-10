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
        "text-[12px] font-bold tabular-nums",
        up ? "text-[#E03131]" : "text-[#1971C2]",
      )}
    >
      {up ? "▲" : "▼"} {Math.abs(changePct).toFixed(1)}%
    </span>
  );
}

export function PredictableCropCards() {
  return (
    <section className="mx-4 mt-4 rounded-2xl border border-[#E8EEE8] bg-white p-4 shadow-[0_4px_16px_rgba(15,23,42,0.04)]">
      {/* Section header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-[16px] font-bold text-[#111827]">AI 가격 예측</h3>
          <p className="mt-0.5 text-[13px] text-[#6B7280]">
            5개 품목의 예상 가격과 유리한 시점을 확인해보세요
          </p>
        </div>
        <Link
          to="/prediction"
          className="flex shrink-0 items-center gap-0.5 text-[13px] font-medium text-[#4B5563]"
        >
          더보기
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Horizontal scroll cards - compact */}
      <div className="no-scrollbar -mx-4 mt-3 flex gap-3 overflow-x-auto px-4 pb-1">
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
              className="flex w-[136px] min-w-[136px] items-center gap-2 rounded-2xl bg-[#F3F8F3] p-3 transition-colors active:bg-[#E8F1E8]"
            >
              <div className="shrink-0">
                <CropIcon name={crop.name} size={32} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-bold text-[#111827]">
                  {crop.name}
                </div>
                <div className="mt-0.5 whitespace-nowrap text-[12px] font-semibold tabular-nums text-[#374151]">
                  {h.price.toLocaleString()}
                  <span className="text-[10px] font-medium text-[#6B7280]">
                    원/{h.unitLabel}
                  </span>
                </div>
                <div className="mt-0.5">
                  <ChangeBadge changePct={h.changePct} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
