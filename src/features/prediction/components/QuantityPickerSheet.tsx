import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  clampQuantity,
  formatQuantity,
  QUANTITY_MAX,
  QUANTITY_UNITS,
  QUANTITY_UNIT_DEFAULT,
  QUANTITY_UNIT_LABEL,
  QUANTITY_UNIT_PRESETS,
  QUANTITY_UNIT_STEP,
  type QuantityUnit,
} from "../quantityUnits";

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
  heading: "출하량" | "매입량";
}) {
  const [n, setN] = useState<number>(value);
  const [u, setU] = useState<QuantityUnit>(unit);

  useEffect(() => {
    if (open) {
      setN(value);
      setU(unit);
    }
  }, [open, value, unit]);

  const step = QUANTITY_UNIT_STEP[u];
  const presets = QUANTITY_UNIT_PRESETS[u];
  const unitLabel = QUANTITY_UNIT_LABEL[u];

  const handleUnitChange = (next: QuantityUnit) => {
    if (next === u) return;
    setU(next);
    setN(QUANTITY_UNIT_DEFAULT[next]);
  };

  const apply = () => {
    onChange(clampQuantity(n, u), u);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="mx-auto max-w-[430px] rounded-t-2xl p-0"
      >
        <SheetHeader className="border-b border-[#E9ECEF] px-4 py-3.5 text-left">
          <SheetTitle className="text-[15px] font-bold text-foreground">
            {heading} 선택
          </SheetTitle>
        </SheetHeader>
        <div className="px-4 py-4">
          {/* 단위 세그먼트 */}
          <div className="mb-4 grid grid-cols-4 gap-1 rounded-full bg-[#F1F3F5] p-1">
            {QUANTITY_UNITS.map((opt) => {
              const active = opt === u;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleUnitChange(opt)}
                  className={cn(
                    "h-8 rounded-full text-[12px] font-semibold transition-colors",
                    active
                      ? "bg-white text-[#1F5C1F] shadow-sm"
                      : "text-[#6C757D]",
                  )}
                >
                  {QUANTITY_UNIT_LABEL[opt]}
                </button>
              );
            })}
          </div>

          {/* 카운터 */}
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              aria-label="감소"
              onClick={() => setN((v) => Math.max(step, v - step))}
              className="grid h-11 w-11 place-items-center rounded-full border border-[#E9ECEF] bg-white text-foreground active:bg-[#F8F9FA]"
            >
              <Minus className="h-4 w-4" />
            </button>
            <div className="flex items-baseline gap-1">
              <input
                type="number"
                inputMode="numeric"
                min={step}
                value={n}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  setN(isNaN(v) ? step : Math.max(1, Math.min(QUANTITY_MAX, v)));
                }}
                onBlur={() => setN((v) => clampQuantity(v, u))}
                className="w-28 border-0 bg-transparent text-center text-[30px] font-black tabular-nums text-foreground outline-none"
              />
              <span className="text-[14px] font-semibold text-[#495057]">
                {unitLabel}
              </span>
            </div>
            <button
              type="button"
              aria-label="증가"
              onClick={() => setN((v) => Math.min(QUANTITY_MAX, v + step))}
              className="grid h-11 w-11 place-items-center rounded-full border border-[#E9ECEF] bg-white text-foreground active:bg-[#F8F9FA]"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* 프리셋 */}
          <div className="mt-4 grid grid-cols-4 gap-2">
            {presets.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setN(p)}
                className={cn(
                  "h-9 rounded-full border text-[12px] font-semibold",
                  n === p
                    ? "border-[#3A8A3A] bg-[#F0F9F0] text-[#1F5C1F]"
                    : "border-[#E9ECEF] bg-white text-[#495057]",
                )}
              >
                {formatQuantity(p, u)}
              </button>
            ))}
          </div>

          <div className="mt-5 rounded-xl bg-[#F0F9F0] px-3 py-2.5 text-[11px] leading-snug text-[#2c6444]">
            ⚖️ <b>단위 환산 안내</b> · aT 경락 데이터는 상자·망·포대 등 규격이
            혼재하고 kg이 미표기된 경우가 많아, 1kg 기준으로 환산해 시세를
            계산해요. (선택 단위 기준 총액도 함께 표시)
          </div>

          <button
            type="button"
            onClick={apply}
            className="mt-3 grid h-11 w-full place-items-center rounded-xl bg-[#3A8A3A] text-[14px] font-bold text-white active:bg-[#2F6F2F]"
          >
            적용
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
