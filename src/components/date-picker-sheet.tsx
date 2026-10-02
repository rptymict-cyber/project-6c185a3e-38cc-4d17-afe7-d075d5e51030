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
  /** 미래 날짜 선택 허용 (예측 대상일 선택 등). 기본 false */
  allowFuture?: boolean;
  /** 선택 가능한 최소/최대 날짜 (ISO "YYYY-MM-DD") */
  minIso?: string;
  maxIso?: string;
  /** 시트 제목. 기본 "날짜 선택" */
  title?: string;
  /** "오늘" 바로가기 표시. 기본 true */
  showToday?: boolean;
  /** 날짜를 누르면 완료 버튼 없이 즉시 반영하고 닫기. 기본 false */
  confirmOnSelect?: boolean;
  /**
   * 기준일·비교일 2단계 선택 모드. 지정 시 탭 순환(기준→비교→기준...)으로
   * 두 날짜를 고르고 "확인"으로 반영한다. 확인 시 기준일이 늦으면 자동 교환.
   */
  pair?: {
    baseIso: string;
    compareIso: string;
    onConfirm: (baseIso: string, compareIso: string) => void;
  };
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

function shortMD(iso: string): string {
  if (!iso) return "-";
  const dt = fromISO(iso);
  return `${dt.getMonth() + 1}/${dt.getDate()}`;
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
  allowFuture = false,
  minIso,
  maxIso,
  title = "날짜 선택",
  showToday = true,
  confirmOnSelect = false,
  pair,
}: DatePickerSheetProps) {
  const has = hasDataFor ?? (() => true);
  const [draft, setDraft] = useState<string>(selected);
  const [month, setMonth] = useState<Date>(selected ? fromISO(selected) : new Date());

  const [pBase, setPBase] = useState(pair?.baseIso ?? "");
  const [pCmp, setPCmp] = useState(pair?.compareIso ?? "");
  const [nextTarget, setNextTarget] = useState<"base" | "compare">("base");

  useEffect(() => {
    if (open) {
      if (pair) {
        setPBase(pair.baseIso);
        setPCmp(pair.compareIso);
        setNextTarget("base");
      }
      setDraft(selected);
      setMonth(selected ? fromISO(selected) : new Date());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, selected]);

  const commit = (iso: string, label: string) => {
    onConfirm(iso, label);
    onOpenChange(false);
  };

  const todayStr = toISO(new Date());
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
    if (!allowFuture && dOnly.getTime() > t.getTime()) return true;
    const iso = toISO(dOnly);
    if (minIso && iso < minIso) return true;
    if (maxIso && iso > maxIso) return true;
    return !has(iso);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl p-0 [&>button:first-of-type]:hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5">
          <h2 className="text-subtitle font-bold text-foreground">{title}</h2>
          <button
            aria-label="닫기"
            onClick={() => onOpenChange(false)}
            className="grid h-11 w-11 place-items-center rounded-full hover:bg-secondary"
          >
            <X className="h-5 w-5 text-[#495057]" />
          </button>
        </div>

        {pair ? (
          <div className="mx-5 mt-2 flex items-center gap-4 rounded-xl bg-[#F8F9FA] px-3 py-2.5 text-caption">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#ADB5BD]" />
              <span className="text-[#868E96]">기준일:</span>
              <b className="font-bold text-foreground">
                {pBase === todayStr ? `오늘(${shortMD(pBase)})` : shortMD(pBase)}
              </b>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#2E9E6B]" />
              <span className="text-[#868E96]">비교일:</span>
              <b className="font-bold text-[#1F7A50]">{shortMD(pCmp)}</b>
            </span>
          </div>
        ) : null}

        {/* Today shortcut */}
        {showToday ? (
          <div className="flex items-center px-5 pt-3">
            <button
              type="button"
              onClick={goToday}
              className="inline-flex min-h-11 items-center text-body font-semibold text-primary underline underline-offset-4"
            >
              오늘
            </button>
          </div>
        ) : null}

        {/* Calendar */}
        <div className="mt-1 flex justify-center px-2">
          <Calendar
            mode="single"
            locale={ko}
            selected={pair ? undefined : draftDate}
            onDayClick={
              pair
                ? (d, m) => {
                    if (m.disabled) return;
                    const iso = toISO(d);
                    if (nextTarget === "base") {
                      setPBase(iso);
                      setNextTarget("compare");
                    } else {
                      setPCmp(iso);
                      setNextTarget("base");
                    }
                  }
                : undefined
            }
            components={
              pair
                ? {
                    DayButton: ({ day, modifiers, className: _c, ...props }) => {
                      const iso = toISO(day.date);
                      const isB = iso === pBase;
                      const isC = iso === pCmp;
                      const isT = iso === todayStr;
                      const tag = isB && isC ? "기준·비교" : isB ? "기준" : isC ? "비교" : "";
                      return (
                        <button
                          {...props}
                          type="button"
                          className={[
                            "relative flex aspect-square w-full flex-col items-center justify-center rounded-md text-sm",
                            modifiers.disabled ? "text-[#CED4DA]" : "text-foreground",
                            isC ? "bg-[#2E9E6B] font-bold text-white" : "",
                            isB && !isC ? "border border-[#ADB5BD] bg-white font-bold" : "",
                          ].join(" ")}
                        >
                          {tag ? (
                            <span
                              className={[
                                "absolute -top-1.5 whitespace-nowrap rounded px-0.5 text-[9px] font-bold leading-tight",
                                isC ? "bg-[#1F7A50] text-white" : "bg-[#495057] text-white",
                              ].join(" ")}
                            >
                              {tag}
                            </span>
                          ) : null}
                          <span>{day.date.getDate()}</span>
                          {isT ? (
                            <span className={["text-[9px] leading-none", isC ? "text-white" : "text-primary"].join(" ")}>
                              오늘
                            </span>
                          ) : null}
                        </button>
                      );
                    },
                  }
                : undefined
            }
            onSelect={(d) => {
              if (pair || !d) return;
              const iso = toISO(d);
              setDraft(iso);
              if (confirmOnSelect) commit(iso, humanLabel(iso));
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
        {confirmOnSelect && !pair ? <div className="pb-6" /> : (
        <div className="px-5 pb-6 pt-4">
          <button
            type="button"
            onClick={() => {
              if (pair) {
                const [b, c] = pBase <= pCmp ? [pBase, pCmp] : [pCmp, pBase];
                pair.onConfirm(b, c);
                onOpenChange(false);
                return;
              }
              if (draft) commit(draft, humanLabel(draft));
            }}
            className="flex h-14 w-full items-center justify-center rounded-[12px] bg-primary text-body font-bold text-primary-foreground active:opacity-90"
          >
            {pair ? "확인" : "완료"}
          </button>
        </div>
        )}
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
