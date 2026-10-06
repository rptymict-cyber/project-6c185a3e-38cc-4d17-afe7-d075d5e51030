import { useEffect, useState } from "react";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PredictionGrade, PredictionViewpoint } from "../types";
import { PredictionSheetFrame, SheetPrimaryButton } from "./PredictionSheetFrame";

const DISABLED_HINT = "작물과 도매시장을 먼저 선택해주세요";

interface ConditionCellProps {
  label: string;
  value: string;
  onClick: () => void;
  disabled?: boolean;
  placeholder?: boolean;
}

function ConditionCell({ label, value, onClick, disabled, placeholder }: ConditionCellProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-xl border border-[#E9ECEF] bg-white px-3 py-2.5 text-left active:bg-[#F8F9FA]",
        disabled && "cursor-not-allowed opacity-50 active:bg-white",
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="text-meta font-medium text-[#868E96]">{label}</div>
        <div
          className={cn(
            "mt-0.5 truncate text-body font-bold",
            placeholder || disabled ? "text-[#ADB5BD]" : "text-foreground",
          )}
        >
          {disabled ? "-" : value}
        </div>
        {disabled ? (
          <div className="mt-0.5 text-meta leading-snug text-[#868E96]">{DISABLED_HINT}</div>
        ) : null}
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

function GradeSheet({
  open,
  onOpenChange,
  value,
  onChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  value: PredictionGrade | null;
  onChange: (g: PredictionGrade) => void;
}) {
  const [draft, setDraft] = useState<PredictionGrade | null>(value);
  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);
  return (
    <PredictionSheetFrame
      open={open}
      onOpenChange={onOpenChange}
      title="등급 선택"
      footer={
        <SheetPrimaryButton
          disabled={!draft}
          onClick={() => {
            if (!draft) return;
            onChange(draft);
            onOpenChange(false);
          }}
        >
          적용하기
        </SheetPrimaryButton>
      }
    >
      <div className="px-4 py-3">
        <ul className="divide-y divide-[#F1F3F5] overflow-hidden rounded-xl border border-[#E9ECEF] bg-white">
          {GRADE_OPTIONS.map((o) => {
            const active = o.value === draft;
            return (
              <li key={o.value}>
                <button
                  type="button"
                  onClick={() => setDraft(o.value)}
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
    </PredictionSheetFrame>
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
  onReset,
}: {
  quantityLabel: string | null;
  quantityHeading: string;
  cropLabel: string | null;
  marketLabel: string | null;
  grade: PredictionGrade | null;
  onGradeChange: (g: PredictionGrade) => void;
  viewpoint: PredictionViewpoint;
  onViewpointChange: (v: PredictionViewpoint) => void;
  onQuantityClick: () => void;
  onCropClick: () => void;
  onMarketClick: () => void;
  onReset: () => void;
}) {
  const [gradeOpen, setGradeOpen] = useState(false);
  const locked = !cropLabel || !marketLabel;
  const gradeText = GRADE_OPTIONS.find((o) => o.value === grade)?.label;

  return (
    <div>
      {/* 1) 유형 */}
      <section>
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

      {/* 2) 작물 3) 도매시장 4) 출하량 5) 등급 */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <ConditionCell label="작물" value={cropLabel ?? "선택해주세요"} placeholder={!cropLabel} onClick={onCropClick} />
        <ConditionCell label="도매시장" value={marketLabel ?? "선택해주세요"} placeholder={!marketLabel} onClick={onMarketClick} />
        <ConditionCell
          label={quantityHeading}
          value={quantityLabel ?? "선택해주세요"}
          placeholder={!quantityLabel}
          disabled={locked}
          onClick={onQuantityClick}
        />
        <ConditionCell
          label="등급"
          value={gradeText ?? "선택해주세요"}
          placeholder={!gradeText}
          disabled={locked}
          onClick={() => setGradeOpen(true)}
        />
      </div>
      <p className="mt-2 text-meta leading-snug text-[#6C757D]">
        등급 선택은 아래 예측 차트·리포트 전체에 동일하게 적용됩니다
      </p>

      <GradeSheet open={gradeOpen} onOpenChange={setGradeOpen} value={grade} onChange={onGradeChange} />
    </div>
  );
}
