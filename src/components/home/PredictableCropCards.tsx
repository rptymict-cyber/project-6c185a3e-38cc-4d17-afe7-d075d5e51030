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
    <section className="mt-5 px-4">
      {/* Section header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-[18px] font-bold text-[#111827]">AI 시세 예측</h3>
          <p className="mt-0.5 text-[13px] text-[#6B7280]">
            5개 품목의 예상 시세와 유리한 시점을 확인해보세요
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

      {/* Horizontal scroll cards - mini (4 visible + peek) */}
      <div className="no-scrollbar -mx-4 mt-3 flex gap-1.5 overflow-x-auto px-4 pb-1">
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
              className="flex w-[84px] min-w-[84px] flex-col items-start gap-1 rounded-[10px] bg-[#F5FAF6] px-2 py-2.5 transition-colors active:bg-[#E8F1E8]"
            >
              <CropIcon name={crop.name} size={24} />
              <div className="text-[12px] font-bold leading-tight text-[#111827]">
                {crop.name}
              </div>
              <div className="whitespace-nowrap text-[10px] font-semibold tabular-nums leading-tight text-[#6B7280]">
                {h.price.toLocaleString()}원/{h.unitLabel}
              </div>
              <ChangeBadge changePct={h.changePct} />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
