import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const PRESETS = [5, 10, 15, 20, 30, 50, 100];

export function QuantityPickerSheet({
  open,
  onOpenChange,
  value,
  onChange,
  heading,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  value: number;
  onChange: (n: number) => void;
  heading: "출하량" | "매입량";
}) {
  const [n, setN] = useState<number>(value);

  const apply = () => {
    onChange(n);
    onOpenChange(false);
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(o) => {
        if (o) setN(value);
        onOpenChange(o);
      }}
    >
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
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              aria-label="감소"
              onClick={() => setN((v) => Math.max(1, v - 1))}
              className="grid h-11 w-11 place-items-center rounded-full border border-[#E9ECEF] bg-white text-foreground active:bg-[#F8F9FA]"
            >
              <Minus className="h-4 w-4" />
            </button>
            <div className="flex items-baseline gap-1">
              <input
                type="number"
                inputMode="numeric"
                min={1}
                value={n}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  setN(isNaN(v) ? 1 : Math.max(1, Math.min(9999, v)));
                }}
                className="w-24 border-0 bg-transparent text-center text-[28px] font-black tabular-nums text-foreground outline-none"
              />
              <span className="text-[14px] font-semibold text-[#495057]">
                상자
              </span>
            </div>
            <button
              type="button"
              aria-label="증가"
              onClick={() => setN((v) => Math.min(9999, v + 1))}
              className="grid h-11 w-11 place-items-center rounded-full border border-[#E9ECEF] bg-white text-foreground active:bg-[#F8F9FA]"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-4 gap-2">
            {PRESETS.map((p) => (
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
                {p}상자
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={apply}
            className="mt-5 grid h-11 w-full place-items-center rounded-xl bg-[#3A8A3A] text-[14px] font-bold text-white active:bg-[#2F6F2F]"
          >
            적용
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
