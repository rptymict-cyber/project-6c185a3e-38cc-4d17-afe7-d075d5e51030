import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, ChevronDown } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { AppHeader } from "@/components/app-header";
import { DateSheetLite } from "@/components/date-sheet-lite";
import { Sparkline } from "@/components/sparkline";
import {
  getCategorySummaries,
  getRanking,
  type RankMode,
} from "@/lib/mock/statistics";
import type { Category } from "@/lib/mock/crops";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/statistics")({
  component: StatsPage,
  head: () => ({
    meta: [
      { title: "통계 — AGDICT" },
      { name: "description", content: "선택 거래일의 급상승·급하락·거래량 랭킹과 분류별 동향." },
    ],
  }),
});

const RANK_TABS: { id: RankMode; label: string }[] = [
  { id: "up", label: "급상승" },
  { id: "down", label: "급하락" },
  { id: "volume", label: "거래량" },
];

function StatsPage() {
  const [date, setDate] = useState("2025-07-05");
  const [dateLabel, setDateLabel] = useState("7/5 (토) · 최근 거래일");
  const [dateOpen, setDateOpen] = useState(false);
  const [mode, setMode] = useState<RankMode>("up");
  const [category, setCategory] = useState<Category | "all">("all");
  const rankingRef = useRef<HTMLDivElement | null>(null);

  const rows = useMemo(() => getRanking(date, mode, category), [date, mode, category]);
  const summaries = useMemo(() => getCategorySummaries(date), [date]);

  return (
    <AppShell header={<AppHeader title="통계" />}>
      <div className="px-4 pb-6 pt-4">
        {/* Date button */}
        <button
          onClick={() => setDateOpen(true)}
          className="flex w-full items-center gap-2 rounded-[10px] border border-[#B7E1B7] bg-[#F0F9F0] px-3 py-2.5 text-left"
        >
          <Calendar className="h-4 w-4 text-[#3A8A3A]" />
          <span className="text-[10px] font-semibold text-[#3A8A3A]">조회 날짜</span>
          <span className="ml-1 flex-1 text-[13.5px] font-bold text-foreground">{dateLabel}</span>
          <ChevronDown className="h-4 w-4 text-[#6C757D]" />
        </button>

        {/* Category filter indicator */}
        {category !== "all" && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[12px] text-[#6C757D]">
              부류 필터:
              <span className="ml-1 font-bold text-foreground">
                {summaries.find((s) => s.id === category)?.label}
              </span>
            </span>
            <button
              onClick={() => setCategory("all")}
              className="rounded-full bg-[#F1F3F5] px-2.5 py-1 text-[11px] font-semibold text-[#495057]"
            >
              해제
            </button>
          </div>
        )}

        {/* Ranking segment tabs */}
        <div ref={rankingRef} className="mt-5 flex gap-1.5">
          {RANK_TABS.map((t) => {
            const active = t.id === mode;
            return (
              <button
                key={t.id}
                onClick={() => setMode(t.id)}
                className={cn(
                  "flex-1 rounded-[10px] py-2 text-[13px] font-bold transition-colors",
                  active ? "bg-[#3A8A3A] text-white" : "bg-[#F1F3F5] text-[#495057]",
                )}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Ranking list */}
        <ul className="mt-3 overflow-hidden rounded-[10px] bg-white">
          {rows.map((r, i) => {
            const up = r.changePct > 0.05;
            const down = r.changePct < -0.05;
            const color = up ? "text-[#E03131]" : down ? "text-[#1971C2]" : "text-[#6C757D]";
            const sign = up ? "▲" : down ? "▼" : "";
            const rankColor = i < 3 ? "text-[#3A8A3A]" : "text-[#ADB5BD]";
            return (
              <li
                key={r.id}
                className={cn(
                  "border-[#F1F3F5]",
                  i > 0 && "border-t",
                )}
              >
                <Link
                  to="/statistics/$variety"
                  params={{ variety: r.id }}
                  className="flex items-center gap-3 px-4 py-3"
                >
                  <span
                    className={cn(
                      "w-4 text-center text-[14px] font-bold tabular-nums",
                      rankColor,
                    )}
                  >
                    {i + 1}
                  </span>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#F1F3F5] text-[20px]">
                    {r.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[14px] font-bold text-foreground">{r.name}</div>
                    <div className="truncate text-[11px] text-[#868E96]">
                      {r.categoryLabel} · {r.representativeMarket}
                    </div>
                  </div>
                  <div className="h-8 w-14 shrink-0">
                    <Sparkline data={r.spark} up={up} />
                  </div>
                  <div className="w-[74px] text-right">
                    {mode === "volume" ? (
                      <>
                        <div className="text-[13.5px] font-bold tabular-nums text-foreground">
                          {r.volumeTon.toLocaleString()}
                          <span className="ml-0.5 text-[10px] font-medium text-[#6C757D]">t</span>
                        </div>
                        <div className={cn("text-[11.5px] font-semibold tabular-nums", color)}>
                          {sign} {Math.abs(r.changePct).toFixed(1)}%
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-[13.5px] font-bold tabular-nums text-foreground">
                          {r.currentPrice.toLocaleString()}
                          <span className="ml-0.5 text-[10px] font-medium text-[#6C757D]">
                            {r.unit.replace("원/", "/")}
                          </span>
                        </div>
                        <div className={cn("text-[12px] font-bold tabular-nums", color)}>
                          {sign} {Math.abs(r.changePct).toFixed(1)}%
                        </div>
                      </>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
          {rows.length === 0 && (
            <li className="px-4 py-8 text-center text-[13px] text-[#868E96]">
              해당 조건의 데이터가 없어요
            </li>
          )}
        </ul>

        {/* Category summary grid */}
        <h2 className="mt-8 mb-2 px-1 text-[14px] font-bold text-foreground">분류별 동향</h2>
        <div className="grid grid-cols-2 gap-2">
          {summaries.map((s) => {
            const up = s.avgChangePct > 0.05;
            const down = s.avgChangePct < -0.05;
            const color = up ? "text-[#E03131]" : down ? "text-[#1971C2]" : "text-[#6C757D]";
            const sign = up ? "▲" : down ? "▼" : "";
            const active = category === s.id;
            return (
              <button
                key={s.id}
                onClick={() => {
                  setCategory(active ? "all" : s.id);
                  requestAnimationFrame(() => {
                    rankingRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  });
                }}
                className={cn(
                  "rounded-[10px] border bg-white p-3 text-left transition-colors",
                  active ? "border-[#3A8A3A] bg-[#F0F9F0]" : "border-[#E9ECEF]",
                )}
              >
                <div className="flex items-baseline justify-between">
                  <span className="text-[13px] font-bold text-foreground">{s.label}</span>
                  <span className={cn("text-[13px] font-bold tabular-nums", color)}>
                    {sign} {Math.abs(s.avgChangePct).toFixed(1)}%
                  </span>
                </div>
                <div className="mt-1.5 text-[11px] text-[#6C757D]">
                  <span className="text-[#E03131]">상승 {s.upCount}</span>
                  <span className="mx-1">·</span>
                  <span className="text-[#1971C2]">하락 {s.downCount}</span>
                  <span className="mx-1 text-[#CED4DA]">/</span>
                  <span>{s.count}개 품종</span>
                </div>
              </button>
            );
          })}
        </div>

        <p className="mt-6 text-center text-[11px] text-[#868E96]">
          데이터 제공: KAMIS 농산물유통정보
        </p>
      </div>

      <DateSheetLite
        open={dateOpen}
        onOpenChange={setDateOpen}
        selected={date}
        onSelect={(iso, label) => {
          setDate(iso);
          setDateLabel(label);
        }}
      />
    </AppShell>
  );
}
