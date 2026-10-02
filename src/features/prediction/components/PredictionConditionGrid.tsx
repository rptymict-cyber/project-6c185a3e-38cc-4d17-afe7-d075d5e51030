import { useState } from "react";
import { Check, ChevronRight } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { PredictionGrade, PredictionViewpoint } from "../types";

interface ConditionCellProps {
  label: string;
  value: string;
  onClick: () => void;
  accent?: "default" | "green";
}

function ConditionCell({ label, value, onClick, accent = "default" }: ConditionCellProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-xl border bg-white px-3 py-2.5 text-left active:bg-[#F8F9FA]",
        accent === "green"
          ? "border-[#3A8A3A]/40 bg-[#F0F9F0]"
          : "border-[#E9ECEF]",
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="text-meta font-medium text-[#868E96]">{label}</div>
        <div
          className={cn(
            "mt-0.5 truncate text-body font-bold",
            accent === "green" ? "text-[#1F5C1F]" : "text-foreground",
          )}
        >
          {value}
        </div>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-[#ADB5BD]" />
    </button>
  );
}

const GRADE_OPTIONS: { value: PredictionGrade; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "특", label: "상(특)" },
  { value: "중", label: "중" },
  { value: "하", label: "하" },
];

function GradeCell({
  value,
  onChange,
}: {
  value: PredictionGrade;
  onChange: (g: PredictionGrade) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = GRADE_OPTIONS.find((o) => o.value === value)?.label ?? "전체";
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-[#E9ECEF] bg-white px-3 py-2.5 text-left active:bg-[#F8F9FA]"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1 text-meta font-medium text-[#868E96]">
            등급
            <span className="rounded-full bg-[#FFE9E9] px-1.5 py-[1px] text-[10px] font-extrabold text-[#D33]">
              NEW
            </span>
          </div>
          <div className="mt-0.5 truncate text-body font-bold text-foreground">{current}</div>
        </div>
        <ChevronRight className="h-4 w-4 shrink-0 text-[#ADB5BD]" />
      </button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="mx-auto max-w-[430px] rounded-t-2xl p-0">
          <SheetHeader className="border-b border-[#E9ECEF] px-4 py-3.5 text-left">
            <SheetTitle className="text-body-lg font-bold text-foreground">등급 선택</SheetTitle>
          </SheetHeader>
          <div className="px-4 py-3">
            <ul className="divide-y divide-[#F1F3F5] overflow-hidden rounded-xl border border-[#E9ECEF] bg-white">
              {GRADE_OPTIONS.map((o) => {
                const active = o.value === value;
                return (
                  <li key={o.value}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange(o.value);
                        setOpen(false);
                      }}
                      className={cn(
                        "flex min-h-12 w-full items-center justify-between px-4 py-3 text-left active:bg-[#F8F9FA]",
                        active && "bg-[#F0F9F0]",
                      )}
                    >
                      <span className={cn("text-body font-semibold", active ? "text-[#1F5C1F]" : "text-foreground")}>
                        {o.label}
                      </span>
                      {active && <Check className="h-5 w-5 text-[#3A8A3A]" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

export function PredictionConditionGrid({
  quantityLabel,
  quantityHeading,
  cropLabel,
  marketLabel,
  grade,
  onGradeChange,
  viewpoint,
  onViewpointChange,
  onQuantityClick,
  onCropClick,
  onMarketClick,
}: {
  quantityLabel: string;
  quantityHeading: "출하량" | "매입량";
  cropLabel: string;
  marketLabel: string;
  grade: PredictionGrade;
  onGradeChange: (g: PredictionGrade) => void;
  viewpoint: PredictionViewpoint;
  onViewpointChange: (v: PredictionViewpoint) => void;
  onQuantityClick: () => void;
  onCropClick: () => void;
  onMarketClick: () => void;
}) {
  return (
    <div>
      <section className="rounded-2xl border-[1.5px] border-[#3A8A3A]/50 bg-[#F7FBF7] p-3">
        <h2 className="mb-2 text-caption font-bold text-[#1F5C1F]">조회 조건 선택</h2>
        <div className="grid grid-cols-2 gap-2">
          <ConditionCell
            label={quantityHeading}
            value={quantityLabel}
            onClick={onQuantityClick}
          />
          <ConditionCell label="작물" value={cropLabel} onClick={onCropClick} />
          <ConditionCell
            label="도매시장"
            value={marketLabel}
            onClick={onMarketClick}
          />
          <GradeCell value={grade} onChange={onGradeChange} />
        </div>
        <p className="mt-2 text-meta leading-snug text-[#6C757D]">
          등급 선택은 아래 예측 차트·리포트 전체에 동일하게 적용됩니다
        </p>
      </section>

      <section className="mt-3">
        <div className="mb-1.5 text-caption font-bold text-foreground">유형</div>
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-[#F1F3F5] p-1" role="tablist">
          {(
            [
              ["farmer", "농민"],
              ["wholesaler", "유통인"],
            ] as const
          ).map(([v, l]) => {
            const active = viewpoint === v;
            return (
              <button
                key={v}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onViewpointChange(v)}
                className={cn(
                  "h-9 rounded-lg text-caption font-semibold",
                  active ? "bg-white text-[#1F5C1F] shadow-sm" : "text-[#868E96]",
                )}
              >
                {l}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
