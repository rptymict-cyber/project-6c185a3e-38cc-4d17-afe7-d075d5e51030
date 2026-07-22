import { MapPin, Check } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { MARKETS } from "@/lib/mock/markets";
import { useMarketFilter } from "@/store/market";
import { cn } from "@/lib/utils";

export function MarketSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { marketId, setMarket } = useMarketFilter();

  const pick = (id: string, label: string) => {
    setMarket(id, label);
    onOpenChange(false);
  };

  const options: { id: string; label: string }[] = [
    { id: "all", label: "전체" },
    ...MARKETS.map((m) => ({ id: m.id, label: m.name })),
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto rounded-t-2xl p-0">
        <div className="flex items-center justify-center px-4 pt-4 pb-2">
          <h3 className="text-[16px] font-black">도매시장 선택</h3>
        </div>

        <div className="px-4 pt-1 pb-2">
          <button
            onClick={() => toast("위치 권한을 확인 중이에요 (준비 중)")}
            className="flex w-full items-center justify-center gap-2 rounded-[12px] border-[1.5px] border-[#3A8A3A] bg-[#3A8A3A0D] py-3 text-[13.5px] font-bold text-[#3A8A3A]"
          >
            <MapPin className="h-4 w-4" />
            가장 가까운 도매시장 찾기
          </button>
        </div>

        <ul className="px-2 pb-3">
          {options.map((m) => {
            const on = m.id === marketId;
            return (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => pick(m.id, m.label)}
                  className="flex w-full items-center justify-between px-3 py-3 text-left active:bg-[#F8F9FA]"
                >
                  <span className="text-[14px] font-semibold text-foreground">{m.label}</span>
                  <span
                    className={cn(
                      "grid h-5 w-5 place-items-center rounded-[6px] border",
                      on ? "border-[#3A8A3A] bg-[#3A8A3A] text-white" : "border-[#CED4DA] bg-white",
                    )}
                  >
                    {on && <Check className="h-3.5 w-3.5" />}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </SheetContent>
    </Sheet>
  );
}
