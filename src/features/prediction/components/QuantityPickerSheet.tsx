import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { QUANTITY_MAX, QUANTITY_UNIT_PRESETS, QUANTITY_UNIT_STEP, type QuantityUnit } from "../quantityUnits";
import { PredictionSheetFrame, SheetPrimaryButton } from "./PredictionSheetFrame";

/** 출하량(매입량) 시트 — 단위 kg 고정 */
export function QuantityPickerSheet({
  open,
  onOpenChange,
  value,
  unit,
  onChange,
  heading,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  value: number;
  unit: QuantityUnit;
  onChange: (value: number, unit: QuantityUnit) => void;
  heading: string;
  itemName?: string;
}) {
  const [text, setText] = useState<string>("");
  useEffect(() => {
    if (open) setText(unit === "kg" && value > 0 ? String(value) : "");
  }, [open, value, unit]);

  const n = parseInt(text, 10) || 0;
  const step = QUANTITY_UNIT_STEP.kg;
  const setN = (v: number) => setText(String(Math.max(0, Math.min(QUANTITY_MAX, v))));

  return (
    <PredictionSheetFrame
      open={open}
      onOpenChange={onOpenChange}
      title={`${heading} 선택`}
      footer={
        <SheetPrimaryButton
          disabled={n <= 0}
          onClick={() => {
            onChange(n, "kg");
            onOpenChange(false);
          }}
        >
          적용
        </SheetPrimaryButton>
      }
    >
      <div className="px-4 py-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={text}
            placeholder="직접 입력"
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
              setText(digits);
            }}
            className="h-14 min-w-0 flex-1 rounded-xl border border-[#E9ECEF] bg-white px-4 text-heading font-black tabular-nums text-foreground outline-none placeholder:text-body-lg placeholder:font-bold placeholder:text-[#ADB5BD] focus:border-[#3A8A3A]"
          />
          <span className="shrink-0 text-body font-bold text-foreground">kg</span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {QUANTITY_UNIT_PRESETS.kg.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setN(p)}
              className={cn(
                "h-9 rounded-full border text-caption font-semibold",
                n === p
                  ? "border-[#3A8A3A] bg-[#F0F9F0] text-[#1F5C1F]"
                  : "border-[#E9ECEF] bg-white text-[#495057]",
              )}
            >
              {p.toLocaleString()}kg
            </button>
          ))}
        </div>
      </div>
    </PredictionSheetFrame>
  );
}
