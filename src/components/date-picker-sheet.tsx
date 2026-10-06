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
    if (nextTarget === "base") {
      setPBase(iso);
      if (pCmp && pCmp <= iso) {
        setPCmp("");
        setWarn("기준일 뒤 날짜로 비교일을 다시 골라주세요");
      } else setWarn(null);
      setNextTarget("compare");
      return;
    }
    if (iso === pBase) {
      setWarn("기준일과 같은 날은 비교할 수 없어요");
      return;
    }
    if (pBase && iso < pBase) {
      setPBase(iso);
      setPCmp("");
      setWarn("더 이른 날짜를 기준일로 바꿨어요. 비교일을 골라주세요");
      return;
    }
    setPCmp(iso);
    setWarn(null);
  };

  const dayDiff = (a: string, b: string) =>
    Math.round((fromISO(b).getTime() - fromISO(a).getTime()) / 86400000);
  const addDays = (iso: string, n: number) => {
    const d = fromISO(iso);
    d.setDate(d.getDate() + n);
    return toISO(d);
  };
  const QUICK = [
    { label: "오늘", n: 0 },
    { label: "내일", n: 1 },
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
  const canConfirm = !!pBase && !!pCmp;

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
          <>
            <div className="mx-5 mt-2 flex items-stretch gap-1.5">
              <PairCard
                label="기준일"
                dot="#4B5563"
                iso={pBase}
                sub={pBase ? (pBase === todayStr ? "오늘" : `오늘로부터 +${dayDiff(todayStr, pBase)}일`) : ""}
                active={nextTarget === "base"}
                onClick={() => setNextTarget("base")}
              />
              <span className="self-center text-body font-bold text-[#ADB5BD]">~</span>
              <PairCard
                label="비교일"
                dot="#2E9E6B"
                iso={pCmp}
                sub={pCmp && pBase ? `기준일로부터 +${dayDiff(pBase, pCmp)}일` : ""}
                active={nextTarget === "compare"}
                onClick={() => setNextTarget("compare")}
              />
            </div>
            <div className="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto px-5">
              {QUICK.map((q) => {
                const iso = addDays(todayStr, q.n);
                const on = activeIso === iso;
                return (
                  <button
                    key={q.label}
                    type="button"
                    onClick={() => {
                      if (isDisabled(fromISO(iso))) return;
                      pickPair(iso);
                      setMonth(fromISO(iso));
                    }}
                    className={[
                      "min-h-9 shrink-0 rounded-full border px-3 text-caption font-semibold",
                      on ? "border-[#2E9E6B] bg-[#2E9E6B] text-white" : "border-[#E9ECEF] bg-white text-[#495057]",
                    ].join(" ")}
                  >
                    {q.label}
                  </button>
                );
              })}
            </div>
            <div
              className={[
                "mx-5 mt-3 rounded-lg px-3 py-2 text-caption",
                warn ? "bg-[#FFF4E6] font-semibold text-[#D9480F]" : "bg-[#F8F9FA] text-[#495057]",
              ].join(" ")}
            >
              {warn ? `⚠ ${warn}` : pairHint}
            </div>
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
                      const hasRange = !!pBase && !!pCmp && !modifiers.outside;
                      const inMid = hasRange && iso > pBase && iso < pCmp;
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
                                left: isB ? "50%" : 0,
                                right: isC ? "50%" : 0,
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

        {/* Confirm button */}
        {confirmOnSelect && !pair ? <div className="pb-6" /> : (
        <div className="px-5 pb-6 pt-2">
          {pair ? (
            <div className="mb-3 flex items-center justify-between gap-2 text-caption">
              <span className="text-[#495057]">
                기준 {shortMD(pBase)} ~ {pCmp ? `비교 ${shortMD(pCmp)}` : "비교일을 선택해 주세요"}
              </span>
              {pCmp && pBase ? (
                <b className="shrink-0 font-bold text-[#2E9E6B]">기준일보다 {dayDiff(pBase, pCmp)}일 뒤</b>
              ) : null}
            </div>
          ) : null}
          <button
            type="button"
            disabled={!!pair && !canConfirm}
            onClick={() => {
              if (pair) {
                if (!canConfirm) return;
                pair.onConfirm(pBase, pCmp);
                onOpenChange(false);
                return;
              }
              if (draft) commit(draft, humanLabel(draft));
            }}
            className="flex h-14 w-full items-center justify-center rounded-[12px] bg-primary text-body font-bold text-primary-foreground active:opacity-90 disabled:bg-[#CFD6DB]"
          >
            {pair ? "확인" : "완료"}
          </button>
          {pair ? (
            <p className="mt-2 text-center text-meta text-[#868E96]">
              오늘부터 2주(14일) 이내 날짜만 선택할 수 있어요
            </p>
          ) : null}
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
      className="flex min-h-[76px] min-w-0 flex-1 flex-col items-start rounded-xl border bg-white px-3 py-2 text-left"
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
        {active ? <span className="text-meta font-bold text-[#2E9E6B]">선택 중</span> : null}
      </span>
      <span className={["mt-1 text-body font-bold", iso ? "text-foreground" : "text-[#ADB5BD]"].join(" ")}>
        {iso ? humanLabel(iso) : "날짜 선택"}
      </span>
      <span className="mt-0.5 min-h-4 text-meta text-[#868E96]">{sub}</span>
    </button>
  );
}
