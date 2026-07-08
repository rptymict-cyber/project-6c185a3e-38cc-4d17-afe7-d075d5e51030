import { Check } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { MARKETS } from "@/lib/mock/markets";
import { cn } from "@/lib/utils";

export function MarketPickerSheet({
  open,
  onOpenChange,
  value,
  onChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="mx-auto max-w-[430px] rounded-t-2xl p-0"
      >
        <SheetHeader className="border-b border-[#E9ECEF] px-4 py-3.5 text-left">
          <SheetTitle className="text-[15px] font-bold text-foreground">
            도매시장 선택
          </SheetTitle>
        </SheetHeader>
        <div className="max-h-[60vh] overflow-y-auto px-4 py-3">
          <ul className="divide-y divide-[#F1F3F5] overflow-hidden rounded-xl border border-[#E9ECEF] bg-white">
            {MARKETS.map((m) => {
              const active = m.id === value;
              return (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(m.id);
                      onOpenChange(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 px-4 py-3 text-left active:bg-[#F8F9FA]",
                      active && "bg-[#F0F9F0]",
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <div
                        className={cn(
                          "text-[14px] font-semibold",
                          active ? "text-[#1F5C1F]" : "text-foreground",
                        )}
                      >
                        {m.name}
                      </div>
                      <div className="text-[11px] text-[#868E96]">
                        {m.region}
                      </div>
                    </div>
                    {active && <Check className="h-5 w-5 text-[#3A8A3A]" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </SheetContent>
    </Sheet>
  );
}
