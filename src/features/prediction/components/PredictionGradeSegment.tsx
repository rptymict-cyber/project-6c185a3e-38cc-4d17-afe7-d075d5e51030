import { cn } from "@/lib/utils";
import type { PredictionGrade } from "../types";

const OPTIONS: { value: PredictionGrade; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "특", label: "상(특)" },
  { value: "중", label: "중" },
  { value: "하", label: "하" },
];

export function PredictionGradeSegment({
  value,
  onChange,
}: {
  value: PredictionGrade;
  onChange: (g: PredictionGrade) => void;
}) {
  return (
    <section>
      <div className="mb-1.5 flex items-center gap-1.5">
        <span className="text-[12px] font-bold text-foreground">등급</span>
        <span className="rounded-full bg-[#FFE9E9] px-1.5 py-[1px] text-[9.5px] font-extrabold text-[#D33]">
          NEW
        </span>
      </div>
      <div className="grid grid-cols-4 gap-1 rounded-xl bg-[#F1F3F5] p-1">
        {OPTIONS.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              className={cn(
                "h-8 rounded-lg text-[12px] font-semibold transition-colors",
                active
                  ? "bg-white text-[#1F5C1F] shadow-sm"
                  : "text-[#868E96]",
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
      <p className="mt-1.5 text-[11px] leading-snug text-[#adb5bd]">
        ※ 시세는 출하량 단위(10kg) 기준 표시 · aT 규격 혼재분은 kg 환산 처리.
        등급은 연동 확정 시 활성화(베타).
      </p>
    </section>
  );
}
