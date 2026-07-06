import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type TradingDay = {
  iso: string;
  label: string;
  weekday: string;
  hasData: boolean;
  disabled?: boolean;
};

const WEEK: TradingDay[] = [
  { iso: "2025-06-30", label: "6/30", weekday: "월", hasData: true },
  { iso: "2025-07-01", label: "7/1", weekday: "화", hasData: true },
  { iso: "2025-07-02", label: "7/2", weekday: "수", hasData: true },
  { iso: "2025-07-03", label: "7/3", weekday: "목", hasData: true },
  { iso: "2025-07-04", label: "7/4", weekday: "금", hasData: true },
  { iso: "2025-07-05", label: "7/5", weekday: "토", hasData: true },
  { iso: "2025-07-06", label: "7/6", weekday: "일", hasData: false, disabled: true },
];

const QUICKS = [
  { key: "recent", iso: "2025-07-05", title: "최근 거래일", sub: "7/5 (토)" },
  { key: "today", iso: "2025-07-06", title: "오늘", sub: "7/6 (월)" },
  { key: "prev", iso: "2025-07-04", title: "전 거래일", sub: "7/4 (금)" },
];

export function DateSheetLite({
  open,
  onOpenChange,
  selected,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  selected: string;
  onSelect: (iso: string, label: string) => void;
}) {
  const commit = (iso: string, label: string) => {
    onSelect(iso, label);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl p-0">
        <SheetHeader className="px-5 pt-5">
          <SheetTitle className="text-[16px] font-bold">조회 기준일 선택</SheetTitle>
        </SheetHeader>

        <div className="grid grid-cols-3 gap-2 px-5 pt-4">
          {QUICKS.map((q) => {
            const active = selected === q.iso && q.key === "recent";
            return (
              <button
                key={q.key}
                onClick={() => commit(q.iso, `${q.sub} · ${q.title}`)}
                className={cn(
                  "rounded-[10px] border px-2 py-2.5 text-center",
                  active ? "border-[#3A8A3A] bg-[#F0F9F0]" : "border-[#E9ECEF] bg-white",
                )}
              >
                <div
                  className={cn(
                    "text-[12px] font-semibold",
                    active ? "text-[#1F5C1F]" : "text-[#6C757D]",
                  )}
                >
                  {q.title}
                </div>
                <div className="mt-0.5 text-[13px] font-bold text-foreground">{q.sub}</div>
              </button>
            );
          })}
        </div>

        <div className="px-5 pt-5">
          <div className="mb-2 text-[12px] font-semibold text-[#6C757D]">이번 주</div>
          <div className="grid grid-cols-7 gap-1.5">
            {WEEK.map((d) => {
              const isSelected = d.iso === selected;
              return (
                <button
                  key={d.iso}
                  disabled={d.disabled}
                  onClick={() =>
                    commit(d.iso, `${d.label} (${d.weekday}) · 최근 거래일`)
                  }
                  className={cn(
                    "flex flex-col items-center justify-center rounded-[8px] py-2 text-[12px]",
                    d.disabled && "opacity-40",
                    isSelected ? "bg-[#3A8A3A] text-white" : "bg-[#F8F9FA] text-foreground",
                  )}
                >
                  <span className="text-[10px] opacity-80">{d.weekday}</span>
                  <span className="mt-0.5 font-bold">{d.label.split("/")[1]}</span>
                  <span
                    className={cn(
                      "mt-1 h-1 w-1 rounded-full",
                      d.hasData ? (isSelected ? "bg-white" : "bg-[#3A8A3A]") : "bg-transparent",
                    )}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <p className="px-5 pb-6 pt-4 text-[11.5px] leading-relaxed text-[#868E96]">
          점 표시는 경매 데이터가 있는 날입니다. 휴장일은 선택할 수 없습니다.
        </p>
      </SheetContent>
    </Sheet>
  );
}
