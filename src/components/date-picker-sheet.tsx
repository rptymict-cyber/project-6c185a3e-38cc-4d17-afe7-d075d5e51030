import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

/**
 * 프로젝트 공용 날짜 선택 시트.
 *
 * 규칙(AGENTS.md 참조):
 * 날짜를 선택하는 어떤 신규 기능을 만들든, 새 캘린더/날짜 그리드를 직접
 * 구현하지 말고 반드시 이 컴포넌트를 재사용한다. 옵션은 props로 확장한다.
 */
export interface DatePickerSheetProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  /** ISO date "YYYY-MM-DD" */
  selected: string;
  onConfirm: (iso: string, label: string) => void;
  /** 실제 거래 데이터 유무. 미지정 시 항상 true 로 간주 */
  hasDataFor?: (iso: string) => boolean;
}

const WEEK_KO = ["일", "월", "화", "수", "목", "금", "토"];

function toISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function fromISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

function humanLabel(iso: string, suffix?: string): string {
  const dt = fromISO(iso);
  const base = `${dt.getMonth() + 1}월 ${dt.getDate()}일 (${WEEK_KO[dt.getDay()]})`;
  return suffix ? `${base} · ${suffix}` : base;
}

function shortDate(iso: string): string {
  const dt = fromISO(iso);
  return `${dt.getMonth() + 1}/${dt.getDate()} (${WEEK_KO[dt.getDay()]})`;
}

/** 오늘·최근 거래일·전 거래일 계산. 일요일은 휴장으로 간주. */
function computeQuickDates(hasDataFor: (iso: string) => boolean) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = toISO(today);

  const findPrevTrading = (start: Date, skipSelf = false): string => {
    const d = new Date(start);
    if (skipSelf) d.setDate(d.getDate() - 1);
    for (let i = 0; i < 400; i++) {
      const iso = toISO(d);
      if (d.getDay() !== 0 && hasDataFor(iso)) return iso;
      d.setDate(d.getDate() - 1);
    }
    return toISO(start);
  };

  const recent = findPrevTrading(today, false);
  const prev = findPrevTrading(fromISO(recent), true);
  return { todayISO, recent, prev };
}

export function DatePickerSheet({
  open,
  onOpenChange,
  selected,
  onConfirm,
  hasDataFor,
}: DatePickerSheetProps) {
  const has = hasDataFor ?? (() => true);
  const [draft, setDraft] = useState<string>(selected);

  useEffect(() => {
    if (open) setDraft(selected);
  }, [open, selected]);

  const { todayISO, recent, prev } = useMemo(() => computeQuickDates(has), [has]);

  const commit = (iso: string, label: string) => {
    onConfirm(iso, label);
    onOpenChange(false);
  };

  const draftDate = draft ? fromISO(draft) : undefined;

  const quicks = [
    { key: "recent", iso: recent, title: "최근 거래일", sub: shortDate(recent) },
    { key: "today", iso: todayISO, title: "오늘", sub: shortDate(todayISO) },
    { key: "prev", iso: prev, title: "전 거래일", sub: shortDate(prev) },
  ];

  const isDisabled = (date: Date): boolean => {
    // 미래 날짜와 데이터 없는 날 비활성
    const dOnly = new Date(date);
    dOnly.setHours(0, 0, 0, 0);
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    if (dOnly.getTime() > t.getTime()) return true;
    return !has(toISO(dOnly));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl p-0">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5">
          <h2 className="text-[16px] font-bold text-foreground">날짜 선택</h2>
          <button
            aria-label="닫기"
            onClick={() => onOpenChange(false)}
            className="grid h-8 w-8 place-items-center rounded-full hover:bg-secondary"
          >
            <X className="h-4 w-4 text-[#495057]" />
          </button>
        </div>

        {/* Quick buttons — commit immediately */}
        <div className="grid grid-cols-3 gap-2 px-5 pt-4">
          {quicks.map((q) => {
            const active = selected === q.iso;
            return (
              <button
                key={q.key}
                onClick={() => commit(q.iso, humanLabel(q.iso, q.title))}
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

        {/* Calendar */}
        <div className="mt-3 flex justify-center px-2">
          <Calendar
            mode="single"
            selected={draftDate}
            onSelect={(d) => {
              if (d) setDraft(toISO(d));
            }}
            month={draftDate}
            disabled={isDisabled}
            modifiers={{
              hasData: (date: Date) => has(toISO(date)),
              sunday: (date: Date) => date.getDay() === 0,
            }}
            modifiersClassNames={{
              hasData:
                "after:pointer-events-none after:absolute after:bottom-1 after:left-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-[#3A8A3A]",
            }}
            classNames={{
              today:
                "bg-[#E7F5E7] text-[#1F5C1F] rounded-md data-[selected=true]:bg-transparent data-[selected=true]:text-inherit",
              weekday: "text-muted-foreground flex-1 select-none rounded-md text-[0.8rem] font-normal [&:first-child]:text-[#E03131]",
            }}
            className="p-3 pointer-events-auto [--cell-size:2.25rem]"
            classNamesOverride={undefined as never}
          />
        </div>

        {/* Note */}
        <p className="px-5 pt-2 text-[11.5px] leading-relaxed text-[#868E96]">
          점 표시는 경매 데이터가 있는 날입니다. 휴장일은 선택할 수 없습니다.
        </p>

        {/* Confirm button */}
        <div className="px-5 pb-6 pt-4">
          <button
            type="button"
            disabled={!draft || draft === selected ? false : false}
            onClick={() => draft && commit(draft, humanLabel(draft))}
            className="w-full rounded-[12px] bg-[#3A8A3A] py-3.5 text-[14.5px] font-bold text-white active:bg-[#2F6F2F]"
          >
            완료
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/** 시세용 기본 hasDataFor: 일요일 휴장, 그 외 모두 데이터 있음 (mock) */
export const defaultTradingDayFilter = (iso: string): boolean => {
  const d = fromISO(iso);
  return d.getDay() !== 0;
};

export { humanLabel as formatDateHumanLabel };
