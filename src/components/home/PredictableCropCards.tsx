import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CalendarDays, ChevronRight } from "lucide-react";
import { basisDateIso } from "@/lib/data-basis";
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
        "inline-flex max-w-full whitespace-nowrap rounded-[6px] px-1.5 py-[2px] text-[11px] font-semibold tabular-nums",
        up ? "bg-[#FDECEC] text-[#E03B3B]" : "bg-[#EAF0FE] text-[#2563EB]",
      )}
      aria-label={`전일 대비 ${up ? "상승" : "하락"} ${Math.abs(changePct).toFixed(1)}퍼센트`}
    >
      <span aria-hidden="true">
        전일 대비 {up ? "↑" : "↓"} {Math.abs(changePct).toFixed(1)}%
      </span>
    </span>
  );
}

function basisLabel(): string {
  const [, m, d] = basisDateIso().split("-").map(Number);
  return `${m}월 ${d}일 평균가`;
}

export function PredictableCropCards() {
  const [basis, setBasis] = useState("");
  useEffect(() => setBasis(basisLabel()), []);
  return (
    <section className="mt-5 px-4">
      {/* Section header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-title font-bold text-[#111827]">AI 시세 예측</h3>
            <span className="rounded bg-primary/10 px-1.5 py-0.5 text-meta font-bold text-primary">
              Beta
            </span>
          </div>
          <p className="mt-0.5 text-body text-[#6B7280]">
            5개 품목의 최근 평균가와 AI 전망을 확인해보세요
          </p>
          <p className="mt-1 flex min-h-[18px] items-center gap-1 text-caption font-medium text-[#6B7280]">
            <CalendarDays className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            {basis}
          </p>
        </div>
        <Link
          to="/prediction"
          className="flex h-11 shrink-0 items-center gap-0.5 pl-2 text-body font-medium text-[#4B5563]"
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
              className="flex min-h-[160px] w-[124px] min-w-[124px] flex-col items-start overflow-hidden rounded-[10px] bg-[#F5FAF6] px-3 pb-3 pt-3.5 transition-colors active:bg-[#E8F1E8]"
            >
              <CropIcon name={crop.name} size={24} />
              <div className="mt-2 w-full truncate text-[15px] font-bold leading-tight text-[#111827]">
                {crop.name}
              </div>
              <div className="mt-2 w-full">
                <div className="whitespace-nowrap text-[19px] font-bold tabular-nums leading-tight text-primary">
                  {h.price.toLocaleString()}
                  <span className="text-[13px] font-bold">원</span>
                </div>
                <div className="mt-1 truncate text-[12px] font-medium leading-tight text-[#6B7280]">
                  / {h.unitLabel}
                </div>
              </div>
              <div className="mt-auto w-full pt-3">
                <ChangeBadge changePct={h.changePct} />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
