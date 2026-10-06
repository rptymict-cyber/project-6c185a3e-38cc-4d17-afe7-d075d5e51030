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
  const [nextTarget, setNextTarget] = useState<"base" | "compare">("compare");
  const [warn, setWarn] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      if (pair) {
        setPBase(pair.baseIso);
        setPCmp(pair.compareIso);
        setNextTarget("compare");
        setWarn(null);
        setMonth(pair.compareIso ? fromISO(pair.compareIso) : new Date());
        return;
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

  /** 기준일·비교일 선택 규칙 (pair 모드) */
  const pickPair = (iso: string) => {
    const other = nextTarget === "base" ? pCmp : pBase;
    if (iso === other) {
      setWarn("같은 날짜는 두 번 선택할 수 없어요");
      return;
    }
    if (nextTarget === "base") {
      setPBase(iso);
      setNextTarget("compare");
    } else {
      setPCmp(iso);
    }
    setWarn(null);
  };

  const dayDiff = (a: string, b: string) =>
    Math.round((fromISO(b).getTime() - fromISO(a).getTime()) / 86400000);
  const addDays = (iso: string, n: number) => {
    const d = fromISO(iso);
    d.setDate(d.getDate() + n);
    return toISO(d);
  };
  // 기준일 선택 중: 오늘 하나 / 비교일 선택 중: 기준일로부터 +1·+3·+7·+14일
  const QUICK =
    nextTarget === "base"
      ? [{ label: "오늘", n: 0 }]
      : [
          { label: "1일 뒤", n: 1 },
          { label: "3일 뒤", n: 3 },
          { label: "1주 뒤", n: 7 },
          { label: "2주 뒤", n: 14 },
        ];
  const activeIso = nextTarget === "base" ? pBase : pCmp;
  const pairHint = warn
    ? null
    : nextTarget === "base"
      ? "기준일로 쓸 날짜를 선택하세요"
      : pCmp
        ? "다른 날짜를 누르면 비교일이 바뀝니다"
        : "비교할 날짜를 선택하세요";
  const canConfirm = !!pBase && !!pCmp && pBase !== pCmp;
  const pLo = pBase && pCmp ? (pBase < pCmp ? pBase : pCmp) : "";
  const pHi = pBase && pCmp ? (pBase < pCmp ? pCmp : pBase) : "";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="flex max-h-[92dvh] flex-col rounded-t-2xl p-0 [&>button:first-of-type]:hidden">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between px-5 pt-5">
          <h2 className="text-subtitle font-bold text-foreground">{title}</h2>
          <button
            aria-label="닫기"
            onClick={() => onOpenChange(false)}
            className="grid h-11 w-11 place-items-center rounded-full hover:bg-secondary"
          >
            <X className="h-5 w-5 text-[#495057]" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
        {pair ? (
          <>
            <div className="mx-5 mt-2 flex items-stretch gap-1.5">
              <PairCard
                label="날짜 1"
                dot="#4B5563"
                iso={pBase}
                sub={pBase ? (pBase === todayStr ? "오늘" : `오늘로부터 +${dayDiff(todayStr, pBase)}일`) : ""}
                active={nextTarget === "base"}
                onClick={() => setNextTarget("base")}
              />
              <span className="self-center text-body font-bold text-[#ADB5BD]">·</span>
              <PairCard
                label="날짜 2"
                dot="#2E9E6B"
                iso={pCmp}
                sub={pCmp ? (pCmp === todayStr ? "오늘" : `오늘로부터 +${dayDiff(todayStr, pCmp)}일`) : ""}
                active={nextTarget === "compare"}
                onClick={() => setNextTarget("compare")}
              />
            </div>
            {warn ? (
              <div className="mx-5 mt-3 rounded-lg bg-[#FFF4E6] px-3 py-2 text-caption font-semibold text-[#D9480F]">
                ⚠ {warn}
              </div>
            ) : null}
          </>
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
                    if (m.disabled || m.outside) return;
                    pickPair(toISO(d));
                  }
                : undefined
            }
            components={
              pair
                ? {
                    DayButton: ({ day, modifiers, className: _c, ...props }) => {
                      const iso = toISO(day.date);
                      const off = !!modifiers.disabled || !!modifiers.outside;
                      const isB = !off && iso === pBase;
                      const isC = !off && iso === pCmp;
                      const isT = iso === todayStr && !modifiers.outside;
                      const hasRange = !!pLo && !!pHi && pLo !== pHi && !modifiers.outside;
                      const inMid = hasRange && iso > pLo && iso < pHi;
                      const sun = day.date.getDay() === 0;
                      return (
                        <button
                          {...props}
                          type="button"
                          disabled={off}
                          className="relative flex h-full w-full items-center justify-center text-base"
                        >
                          {hasRange && (inMid || isB || isC) ? (
                            <span
                              aria-hidden
                              className="absolute inset-y-[3px]"
                              style={{
                                background: "rgba(46,158,107,0.13)",
                                left: iso === pLo ? "50%" : 0,
                                right: iso === pHi ? "50%" : 0,
                              }}
                            />
                          ) : null}
                          <span
                            className="relative flex h-10 w-10 flex-col items-center justify-center rounded-full"
                            style={{
                              background: isB ? "#4B5563" : isC ? "#2E9E6B" : undefined,
                              color: isB || isC ? "#fff" : off ? "#CED4DA" : sun ? "#E03131" : "#212529",
                              fontWeight: isB || isC ? 700 : 500,
                            }}
                          >
                            <span className="leading-none">{day.date.getDate()}</span>
                            {isT ? (
                              <span
                                className="mt-0.5 h-1 w-1 rounded-full"
                                style={{ background: isB || isC ? "#fff" : "#2E9E6B" }}
                              />
                            ) : null}
                          </span>
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
            startMonth={pair && minIso ? fromISO(minIso) : undefined}
            endMonth={pair && maxIso ? fromISO(maxIso) : undefined}
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
            className="w-full p-2 pointer-events-auto [--cell-size:clamp(2.75rem,12.5vw,3.25rem)]"
          />
        </div>

        </div>

        {/* Confirm button */}
        {confirmOnSelect && !pair ? <div className="pb-6" /> : (
        <div className="shrink-0 border-t border-[#F1F3F5] px-5 pb-[calc(16px+env(safe-area-inset-bottom))] pt-2">
          {pair ? (
            <p className="mb-2 text-center text-meta text-[#868E96]">
              서로 다른 날짜 2개를 골라주세요
            </p>
          ) : null}
          <button
            type="button"
            disabled={!!pair && !canConfirm}
            onClick={() => {
              if (pair) {
                if (!canConfirm) return;
                pair.onConfirm(pLo, pHi);
                onOpenChange(false);
                return;
              }
              if (draft) commit(draft, humanLabel(draft));
            }}
            className="flex h-14 w-full items-center justify-center rounded-[12px] bg-primary text-body font-bold text-primary-foreground active:opacity-90 disabled:bg-[#CFD6DB]"
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

function PairCard({
  label,
  dot,
  iso,
  sub,
  active,
  onClick,
}: {
  label: string;
  dot: string;
  iso: string;
  sub: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-w-0 flex-1 flex-col items-start gap-1 rounded-xl border bg-white px-3 py-2.5 text-left"
      style={
        active
          ? { borderColor: "#2E9E6B", borderWidth: 2, boxShadow: "0 0 0 3px rgba(46,158,107,0.15)" }
          : { borderColor: "#E9ECEF", borderWidth: 1 }
      }
    >
      <span className="flex w-full items-center justify-between gap-1 text-meta font-semibold text-[#495057]">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full" style={{ background: dot }} />
          {label}
        </span>
      </span>
      <span className={["text-body font-bold leading-tight", iso ? "text-foreground" : "text-[#ADB5BD]"].join(" ")}>
        {iso ? humanLabel(iso) : "날짜 선택"}
      </span>
    </button>
  );
}
