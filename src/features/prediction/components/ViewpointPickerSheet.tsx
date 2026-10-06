import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import type { PredictionViewpoint } from "../types";
import { cn } from "@/lib/utils";
import { PredictionSheetFrame, SheetPrimaryButton } from "./PredictionSheetFrame";

const OPTIONS: { id: PredictionViewpoint; label: string; sub: string }[] = [
  { id: "farmer", label: "농민", sub: "출하 시점 추천" },
  { id: "wholesaler", label: "도매상", sub: "매입 시점 추천" },
];

export function ViewpointPickerSheet({
  open,
  onOpenChange,
  value,
  onChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  value: PredictionViewpoint;
  onChange: (v: PredictionViewpoint) => void;
}) {
  const [draft, setDraft] = useState(value);
  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);
  return (
    <PredictionSheetFrame
      open={open}
      onOpenChange={onOpenChange}
      title="유형 선택"
      footer={
        <SheetPrimaryButton
          onClick={() => {
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
          {OPTIONS.map((o) => {
            const active = o.id === draft;
            return (
              <li key={o.id}>
                <button
                  type="button"
                  onClick={() => setDraft(o.id)}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-3 text-left active:bg-[#F8F9FA]",
                    active && "bg-[#F0F9F0]",
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className={cn("text-body font-semibold", active ? "text-[#1F5C1F]" : "text-foreground")}>
                      {o.label}
                    </div>
                    <div className="text-meta text-[#868E96]">{o.sub}</div>
                  </div>
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
