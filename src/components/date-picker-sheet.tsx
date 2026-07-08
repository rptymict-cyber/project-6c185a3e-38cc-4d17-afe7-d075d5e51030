import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { ko } from "date-fns/locale";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Calendar } from "@/components/ui/calendar";

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

function humanLabel(iso: string): string {
  const dt = fromISO(iso);
  return `${dt.getMonth() + 1}월 ${dt.getDate()}일 (${WEEK_KO[dt.getDay()]})`;
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
  const [month, setMonth] = useState<Date>(selected ? fromISO(selected) : new Date());

  useEffect(() => {
    if (open) {
      setDraft(selected);
      setMonth(selected ? fromISO(selected) : new Date());
    }
  }, [open, selected]);

  const commit = (iso: string, label: string) => {
    onConfirm(iso, label);
    onOpenChange(false);
  };

  const draftDate = draft ? fromISO(draft) : undefined;

  const goToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setMonth(today);
    setDraft(toISO(today));
  };

  const isDisabled = (date: Date): boolean => {
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

        {/* Today shortcut */}
        <div className="flex items-center px-5 pt-3">
          <button
            type="button"
            onClick={goToday}
            className="text-[13px] font-semibold text-primary underline underline-offset-4"
          >
            오늘
          </button>
        </div>

        {/* Calendar */}
        <div className="mt-1 flex justify-center px-2">
          <Calendar
            mode="single"
            locale={ko}
            selected={draftDate}
            onSelect={(d) => {
              if (d) setDraft(toISO(d));
            }}
            month={month}
            onMonthChange={setMonth}
            disabled={isDisabled}
            formatters={{
              formatCaption: (date) => `${date.getFullYear()}년 ${date.getMonth() + 1}월`,
              formatWeekdayName: (date) => WEEK_KO[date.getDay()],
            }}
            classNames={{
              today:
                "text-primary font-bold data-[selected=true]:text-primary-foreground",
              weekday:
                "text-muted-foreground flex-1 select-none rounded-md text-[0.8rem] font-normal [&:first-child]:text-[#E03131]",
            }}
            className="p-3 pointer-events-auto [--cell-size:2.5rem]"
          />
        </div>

        {/* Confirm button */}
        <div className="px-5 pb-6 pt-4">
          <button
            type="button"
            onClick={() => draft && commit(draft, humanLabel(draft))}
            className="w-full rounded-[12px] bg-primary py-3.5 text-[14.5px] font-bold text-primary-foreground active:opacity-90"
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
