import { MapPin, Check } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85dvh] overflow-y-auto rounded-t-2xl p-0">
        <SheetHeader className="px-5 pt-5">
          <SheetTitle className="text-[16px] font-bold">시장 선택</SheetTitle>
        </SheetHeader>

        <div className="px-5 pt-3">
          <button
            onClick={() => toast("위치 권한을 확인 중이에요 (준비 중)")}
            className="flex w-full items-center justify-center gap-2 rounded-[12px] border-[1.5px] border-[#3A8A3A] bg-[#3A8A3A0D] py-3 text-[13.5px] font-bold text-[#3A8A3A]"
          >
            <MapPin className="h-4 w-4" />
            가장 가까운 도매시장 찾기
          </button>
        </div>

        <ul className="mt-3">
          {MARKETS.map((m) => {
            const itemCount = 60 + Math.round(m.volumeTon / 40);
            const active = m.id === marketId;
            return (
              <li key={m.id} className="border-b border-[#F1F3F5]">
                <button
                  onClick={() => pick(m.id, m.name)}
                  className="flex w-full items-center gap-3 px-5 py-3.5 text-left active:bg-[#F8F9FA]"
                >
                  <div className="min-w-0 flex-1">
                    <div className={cn("text-[15px] font-bold", active ? "text-[#1F5C1F]" : "text-foreground")}>
                      {m.name}
                    </div>
                    <div className="mt-0.5 text-[12px] text-[#6C757D]">
                      오늘 {itemCount}개 품목 · {m.volumeTon.toLocaleString()}톤
                    </div>
                  </div>
                  {active && <Check className="h-4 w-4 text-[#3A8A3A]" />}
                </button>
              </li>
            );
          })}
          <li className="border-b border-[#F1F3F5]">
            <button
              onClick={() => pick("all", "전체")}
              className={cn(
                "flex w-full items-center justify-between px-5 py-3.5 text-left text-[14px] font-semibold",
                marketId === "all" ? "text-[#1F5C1F]" : "text-foreground",
              )}
            >
              전체
              {marketId === "all" && <Check className="h-4 w-4 text-[#3A8A3A]" />}
            </button>
          </li>

        </ul>
        <div className="h-4" />
      </SheetContent>
    </Sheet>
  );
}
