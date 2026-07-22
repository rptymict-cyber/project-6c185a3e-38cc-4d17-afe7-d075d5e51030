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
  garlic: { price: 7850, changePct: 3.0, unitLabel: "1kg" },
};

function ChangeBadge({ changePct }: { changePct: number }) {
  const up = changePct >= 0;
  return (
    <span
      className={cn(
        "inline-flex whitespace-nowrap rounded-[6px] px-[7px] py-[2px] text-[11px] font-extrabold tabular-nums",
        up ? "bg-[#FDECEC] text-[#E03B3B]" : "bg-[#EAF0FE] text-[#2563EB]",
      )}
    >
      {up ? "↑ 예측 상승" : "↓ 예측 하락"} {Math.abs(changePct).toFixed(1)}%
    </span>
  );
}

export function PredictableCropCards() {
  return (
    <section className="mt-5 px-4">
      {/* Section header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-[18px] font-bold text-[#111827]">AI 시세 예측</h3>
            <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
              Beta
            </span>
          </div>
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
              className="flex w-[112px] min-w-[112px] flex-col items-start gap-1 rounded-[10px] bg-[#F5FAF6] px-2 py-2.5 transition-colors active:bg-[#E8F1E8]"
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
