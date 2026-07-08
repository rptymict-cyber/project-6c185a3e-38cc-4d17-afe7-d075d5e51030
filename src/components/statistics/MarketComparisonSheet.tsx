import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { MARKETS } from "@/lib/mock/markets";
import { MAX_COMPARE, useTrendCompare } from "@/store/trend-compare";
import { cn } from "@/lib/utils";

export function MarketComparisonSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const compareIds = useTrendCompare((s) => s.compareIds);
  const toggle = useTrendCompare((s) => s.toggleCompare);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const regions = Array.from(
    MARKETS.reduce((map, m) => {
      if (!map.has(m.region)) map.set(m.region, []);
      map.get(m.region)!.push(m);
      return map;
    }, new Map<string, typeof MARKETS>()),
  );

  const handleToggle = (id: string) => {
    const result = toggle(id);
    if (result === "limit") {
      toast(`최대 ${MAX_COMPARE}개까지 비교할 수 있어요`);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="flex max-h-[85dvh] flex-col rounded-t-2xl p-0">
        <SheetHeader className="shrink-0 px-5 pt-5">
          <SheetTitle className="text-[16px] font-bold">시장 추가</SheetTitle>
        </SheetHeader>

        <div className="shrink-0 mt-2 px-5 text-[11.5px] text-[#6C757D]">
          현재 {compareIds.length}/{MAX_COMPARE}개 선택됨
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">

        <ul className="px-2 pb-4 pt-2">
          {/* 전국 always-on row */}
          <li className="flex items-center gap-3 rounded-[10px] px-3 py-3">
            <Checkbox checked disabled />
            <span className="flex-1 text-[14px] font-bold text-foreground">전국</span>
            <span className="text-[11px] text-[#ADB5BD]">기본</span>
          </li>

          {regions.map(([region, markets]) => (
            <li key={region} className="mt-1">
              <div className="rounded bg-[#F8F9FA] px-3 py-1.5 text-[11px] font-semibold text-[#6C757D]">
                {region}
              </div>
              <ul>
                {markets.map((m) => {
                  const marketChecked = compareIds.includes(m.id);
                  const open = !!expanded[m.id];
                  return (
                    <li key={m.id}>
                      <div className="flex items-center gap-2 px-3 py-2.5">
                        <button
                          type="button"
                          onClick={() => setExpanded((p) => ({ ...p, [m.id]: !p[m.id] }))}
                          aria-label={open ? "접기" : "펼치기"}
                          className="grid h-6 w-6 place-items-center rounded hover:bg-[#F1F3F5]"
                        >
                          {open ? (
                            <ChevronDown className="h-3.5 w-3.5 text-[#495057]" />
                          ) : (
                            <ChevronRight className="h-3.5 w-3.5 text-[#495057]" />
                          )}
                        </button>
                        <Checkbox
                          checked={marketChecked}
                          onCheckedChange={() => handleToggle(m.id)}
                        />
                        <button
                          type="button"
                          onClick={() => handleToggle(m.id)}
                          className="flex flex-1 items-center justify-between text-left"
                        >
                          <span
                            className={cn(
                              "text-[14px]",
                              marketChecked ? "font-bold text-[#1F5C1F]" : "font-semibold text-foreground",
                            )}
                          >
                            {m.name}
                          </span>
                          <span className="text-[11.5px] text-[#868E96] tabular-nums">
                            {m.volumeTon.toLocaleString()}t
                          </span>
                        </button>
                      </div>

                      {open && (
                        <ul className="pb-1 pl-11">
                          {m.companies.map((co) => {
                            const cid = `${m.id}:${co.name}`;
                            const checked = compareIds.includes(cid);
                            return (
                              <li
                                key={cid}
                                className="flex items-center gap-2 py-2 pr-3"
                              >
                                <Checkbox
                                  checked={checked}
                                  onCheckedChange={() => handleToggle(cid)}
                                />
                                <button
                                  type="button"
                                  onClick={() => handleToggle(cid)}
                                  className="flex flex-1 items-center justify-between text-left"
                                >
                                  <span
                                    className={cn(
                                      "text-[13px]",
                                      checked ? "font-bold text-[#1F5C1F]" : "text-[#495057]",
                                    )}
                                  >
                                    {co.name}
                                  </span>
                                  <span className="text-[11px] text-[#ADB5BD] tabular-nums">
                                    {co.volumeTon.toLocaleString()}t
                                  </span>
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>

          <p className="px-5 pb-6 text-[11px] text-[#868E96]">
            전국은 모든 시장의 평균입니다.
          </p>
        </div>

        <div className="shrink-0 border-t border-[#E9ECEF] bg-white px-5 py-3">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex w-full items-center justify-center rounded-[12px] bg-[#3A8A3A] py-3 text-[14px] font-black text-white active:bg-[#2F6F2F]"
          >
            완료
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
