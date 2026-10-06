import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { MARKETS } from "@/lib/mock/markets";
import { cn } from "@/lib/utils";
import { PredictionSheetFrame } from "./PredictionSheetFrame";

const MAX = 2;

/** 비교할 도매시장 선택 (최대 2곳, 체크 방식) */
export function CompareMarketsSheet({
  open,
  onOpenChange,
  value,
  onChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  value: string[];
  onChange: (ids: string[]) => void;
}) {
  const [draft, setDraft] = useState<string[]>(value);
  const [limitHit, setLimitHit] = useState(false);
  useEffect(() => {
    if (open) {
      setDraft(value);
      setLimitHit(false);
    }
  }, [open, value]);

  const toggle = (id: string) => {
    if (draft.includes(id)) {
      setDraft(draft.filter((d) => d !== id));
      setLimitHit(false);
      return;
    }
    if (draft.length >= MAX) {
      setLimitHit(true);
      return;
    }
    setDraft([...draft, id]);
  };

  return (
    <PredictionSheetFrame
      open={open}
      onOpenChange={onOpenChange}
      title="비교할 도매시장 선택"
      footer={
        <div className="grid grid-cols-[1fr_2fr] gap-2">
          <button
            type="button"
            onClick={() => {
              onChange([]);
              onOpenChange(false);
            }}
            className="grid h-12 place-items-center rounded-xl border border-[#DEE2E6] bg-white text-body font-bold text-[#495057] active:bg-[#F8F9FA]"
          >
            선택 안 함
          </button>
          <button
            type="button"
            onClick={() => {
              onChange(draft);
              onOpenChange(false);
            }}
            className="grid h-12 place-items-center rounded-xl bg-[#3A8A3A] text-body font-bold text-white active:bg-[#2F6F2F]"
          >
            확인
          </button>
        </div>
      }
    >
      <div className="px-4 py-3">
        <p className={cn("mb-2 text-meta", limitHit ? "font-bold text-[#E8590C]" : "text-[#868E96]")}>
          최대 2곳까지 선택할 수 있어요
        </p>
        <ul className="divide-y divide-[#F1F3F5] overflow-hidden rounded-xl border border-[#E9ECEF] bg-white">
          {MARKETS.map((m) => {
            const on = draft.includes(m.id);
            const blocked = !on && draft.length >= MAX;
            return (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => toggle(m.id)}
                  aria-pressed={on}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-3 text-left active:bg-[#F8F9FA]",
                    on && "bg-[#F0F9F0]",
                    blocked && "opacity-50",
                  )}
                >
                  <span
                    className={cn(
                      "grid h-5 w-5 shrink-0 place-items-center rounded-md border",
                      on ? "border-[#3A8A3A] bg-[#3A8A3A] text-white" : "border-[#CED4DA] bg-white",
                    )}
                  >
                    {on && <Check className="h-3.5 w-3.5" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className={cn("text-body font-semibold", on ? "text-[#1F5C1F]" : "text-foreground")}>
                      {m.name}
                    </div>
                    <div className="text-meta text-[#868E96]">{m.region}</div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </PredictionSheetFrame>
  );
}
