import { useEffect, useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { MARKET_OPTIONS } from "@/lib/mock/statistics-mock";
import { Check, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";


export function StatsMarketSheet({
  open, onOpenChange, selected, onConfirm,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  selected: string[];
  onConfirm: (m: string[]) => void;
}) {
  const [draft, setDraft] = useState<string[]>(selected);
  const [warn, setWarn] = useState(false);

  useEffect(() => { if (open) { setDraft(selected); setWarn(false); } }, [open, selected]);

  const toggle = (id: string) => {
    setWarn(false);
    if (id === "전국") { setDraft(["전국"]); return; }
    const has = draft.includes(id);
    let next = has ? draft.filter((m) => m !== id) : [...draft.filter((m) => m !== "전국"), id];
    if (!has && selected.includes("전국")) setWarn(true);
    if (next.length === 0) next = ["전국"];
    setDraft(next);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[80vh] rounded-t-2xl p-0">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <h3 className="text-[16px] font-black">시장 선택</h3>
          <button onClick={() => onOpenChange(false)} aria-label="닫기" className="p-1"><X className="h-5 w-5" /></button>
        </div>
        {warn && (
          <div className="mx-4 mb-2 flex items-center gap-2 rounded-[10px] bg-[#FFF4E6] px-3 py-2 text-[12px] text-[#B76E00]">
            <AlertTriangle className="h-4 w-4" />
            <span>전국과 개별 시장은 함께 선택할 수 없어요</span>
          </div>
        )}
        <ul className="px-2 pb-3">
          {MARKET_OPTIONS.map((m) => {
            const on = draft.includes(m.id);
            return (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => toggle(m.id)}
                  className="flex w-full items-center justify-between px-3 py-3 text-left active:bg-[#F8F9FA]"
                >
                  <span className="text-[14px] font-semibold text-foreground">{m.label}</span>
                  <span className={cn(
                    "grid h-5 w-5 place-items-center rounded-[6px] border",
                    on ? "border-[#3A8A3A] bg-[#3A8A3A] text-white" : "border-[#CED4DA] bg-white",
                  )}>
                    {on && <Check className="h-3.5 w-3.5" />}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="border-t border-[#E9ECEF] p-4">
          <button
            onClick={() => { onConfirm(draft); onOpenChange(false); }}
            className="w-full rounded-[12px] bg-[#3A8A3A] py-3 text-[14px] font-black text-white active:bg-[#2F6F2F]"
          >
            적용
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
