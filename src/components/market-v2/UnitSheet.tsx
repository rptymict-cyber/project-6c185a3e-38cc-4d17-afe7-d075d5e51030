import { Check } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { UNITS } from "@/lib/mock/market-taxonomy";
import { useMarketFilter } from "@/store/market";
import { cn } from "@/lib/utils";

export function UnitSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { unit, setUnit } = useMarketFilter();
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl p-0">
        <SheetHeader className="px-5 pt-5">
          <SheetTitle className="text-[16px] font-bold">단위 선택</SheetTitle>
        </SheetHeader>
        <ul className="px-2 pb-6 pt-2">
          {UNITS.map((u) => {
            const active = u === unit;
            return (
              <li key={u}>
                <button
                  onClick={() => {
                    setUnit(u);
                    onOpenChange(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-[10px] px-3 py-3 text-left text-[14px]",
                    active ? "bg-[#F0F9F0] font-bold text-[#1F5C1F]" : "text-foreground",
                  )}
                >
                  {u}
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
