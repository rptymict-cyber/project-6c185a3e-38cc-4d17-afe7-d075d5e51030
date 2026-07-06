import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Check } from "lucide-react";
import type { MarketSortKey } from "@/store/market";
import { SORT_LABEL } from "@/store/market";
import { cn } from "@/lib/utils";

export function SortSheet({
  open,
  onOpenChange,
  value,
  onChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  value: MarketSortKey;
  onChange: (v: MarketSortKey) => void;
}) {
  const opts: MarketSortKey[] = ["volume", "change", "name"];
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl">
        <SheetHeader>
          <SheetTitle className="text-left text-[15px]">정렬</SheetTitle>
        </SheetHeader>
        <ul className="mt-2 divide-y divide-[#F1F3F5]">
          {opts.map((k) => {
            const active = k === value;
            return (
              <li key={k}>
                <button
                  onClick={() => {
                    onChange(k);
                    onOpenChange(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between py-3.5 text-[14px]",
                    active ? "font-semibold text-[#3A8A3A]" : "text-foreground",
                  )}
                >
                  {SORT_LABEL[k]}
                  {active && <Check className="h-4 w-4" />}
                </button>
              </li>
            );
          })}
        </ul>
      </SheetContent>
    </Sheet>
  );
}
