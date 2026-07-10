import { Check } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { getCorporations } from "@/lib/mock/corporations";
import { useMarketFilter } from "@/store/market";
import { cn } from "@/lib/utils";

export function CorporationSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { marketId, marketLabel, corpId, setCorp } = useMarketFilter();
  const corps = getCorporations(marketId);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[75dvh] overflow-y-auto rounded-t-2xl p-0">
        <SheetHeader className="px-5 pt-5">
          <SheetTitle className="text-[16px] font-bold">법인 선택</SheetTitle>
        </SheetHeader>
        <div className="px-5 pt-1 text-[12px] text-[#6C757D]">{marketLabel} 소속</div>
        <ul className="px-2 pb-6 pt-2">
          {corps.map((c) => {
            const active = c.id === corpId;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => {
                    setCorp(c.id, c.label);
                    onOpenChange(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-[10px] px-3 py-3 text-left text-[14px]",
                    active ? "bg-[#F0F9F0] font-bold text-[#1F5C1F]" : "text-foreground",
                  )}
                >
                  {c.label}
                  {active && <Check className="h-4 w-4 text-[#3A8A3A]" />}
                </button>
              </li>
            );
          })}
        </ul>
      </SheetContent>
    </Sheet>
  );
}
