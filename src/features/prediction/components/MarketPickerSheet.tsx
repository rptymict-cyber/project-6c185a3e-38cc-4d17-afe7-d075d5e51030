import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { MARKETS } from "@/lib/mock/markets";
import { cn } from "@/lib/utils";
import { PredictionSheetFrame, SheetPrimaryButton } from "./PredictionSheetFrame";

export function MarketPickerSheet({
  open,
  onOpenChange,
  value,
  onChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  value: string | null;
  onChange: (id: string) => void;
}) {
  const [draft, setDraft] = useState<string | null>(value);
  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  return (
    <PredictionSheetFrame
      open={open}
      onOpenChange={onOpenChange}
      title="도매시장 선택"
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
          {MARKETS.map((m) => {
            const active = m.id === draft;
            return (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => setDraft(m.id)}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-3 text-left active:bg-[#F8F9FA]",
                    active && "bg-[#F0F9F0]",
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className={cn("text-body font-semibold", active ? "text-[#1F5C1F]" : "text-foreground")}>
                      {m.name}
                    </div>
                    <div className="text-meta text-[#868E96]">{m.region}</div>
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
