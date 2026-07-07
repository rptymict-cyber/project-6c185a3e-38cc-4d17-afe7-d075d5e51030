import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronDown, ChevronRight, TrendingUp, BarChart3, ArrowUpDown, Sparkles } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { AppHeader } from "@/components/app-header";
import { DateSheetLite } from "@/components/date-sheet-lite";
import { CATEGORIES, CROPS, getCrop } from "@/lib/mock/crops";
import { useRecentStats } from "@/store/recent-stats";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/statistics")({
  component: StatisticsHome,
  head: () => ({
    meta: [
      { title: "통계 — AGDICT" },
      { name: "description", content: "품목과 품종을 선택해 시장별 평균가격과 거래량을 비교하세요." },
    ],
  }),
});

function formatKoreanDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
  const wd = ["일", "월", "화", "수", "목", "금", "토"][dt.getDay()];
  return `${y}년 ${m}월 ${d}일 (${wd})`;
}

function categoryLabelOf(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

function StatisticsHome() {
  const navigate = useNavigate();
  const [date, setDate] = useState("2025-07-05");
  const [dateOpen, setDateOpen] = useState(false);
  const recent = useRecentStats((s) => s.items);

  return (
    <AppShell header={<AppHeader title="통계" />}>
      <div className="px-4 pb-8 pt-4">
        {/* Date picker */}
        <button
          onClick={() => setDateOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#E9ECEF] bg-white px-3 py-1.5 text-[13px] font-semibold text-foreground"
        >
          {formatKoreanDate(date)}
          <ChevronDown className="h-3.5 w-3.5 text-[#6C757D]" />
        </button>

        {/* Intro card */}
        <div className="mt-4 overflow-hidden rounded-[14px] border border-[#D3EBD3] bg-[#F0F9F0] p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h2 className="text-[16px] font-black leading-snug text-[#1F5C1F]">
                시장별 평균가격과
                <br />
                거래량을 한눈에 비교해 보세요
              </h2>
              <p className="mt-1.5 text-[12px] leading-relaxed text-[#3A8A3A]">
                품목과 품종을 선택하면
                <br />
                시장별 통계를 확인할 수 있어요.
              </p>
              <button
                onClick={() => navigate({ to: "/statistics/select" })}
                className="mt-3 inline-flex items-center gap-1 rounded-[10px] bg-[#3A8A3A] px-4 py-2 text-[13px] font-bold text-white shadow-sm"
              >
                품목 선택하기
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div aria-hidden className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-white/60 text-[42px] leading-none">
              📊
            </div>
          </div>
        </div>

        {/* Recent */}
        <section className="mt-7">
          <div className="mb-2 flex items-baseline justify-between">
            <h3 className="text-[14px] font-bold text-foreground">최근 본 통계</h3>
            {recent.length > 0 && (
              <button
                onClick={() => useRecentStats.getState().clear()}
                className="text-[11.5px] font-semibold text-[#868E96]"
              >
                전체 지우기
              </button>
            )}
          </div>

          {recent.length === 0 ? (
            <div className="rounded-[10px] border border-dashed border-[#E9ECEF] bg-white px-3 py-6 text-center text-[12.5px] text-[#868E96]">
              아직 조회한 통계가 없어요
            </div>
          ) : (
            <ul className="overflow-hidden rounded-[10px] border border-[#E9ECEF] bg-white">
              {recent.map((r, i) => {
                const c = getCrop(r.varietyId);
                if (!c) return null;
                const viewedISO = new Date(r.viewedAt).toISOString().slice(0, 10).replace(/-/g, ".");
                return (
                  <li key={r.varietyId} className={cn(i > 0 && "border-t border-[#F1F3F5]")}>
                    <Link
                      to="/statistics/$variety"
                      params={{ variety: r.varietyId }}
                      className="flex items-center gap-3 px-3 py-2.5"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#F1F3F5] text-[18px]">
                        {c.emoji}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[13.5px] font-bold text-foreground">
                          {c.name}
                        </div>
                        <div className="truncate text-[11px] text-[#868E96]">
                          {categoryLabelOf(c.category)}
                        </div>
                      </div>
                      <div className="text-[11.5px] tabular-nums text-[#868E96]">
                        {viewedISO}
                      </div>
                      <ChevronRight className="h-4 w-4 text-[#ADB5BD]" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Quick stats */}
        <section className="mt-7">
          <h3 className="mb-2 text-[14px] font-bold text-foreground">빠른 통계</h3>
          <div className="grid grid-cols-3 gap-2">
            <QuickCard
              tone="green"
              icon={<Sparkles className="h-4 w-4" />}
              title="시세 예측 가능"
              subtitle="품목"
              onClick={() => navigate({ to: "/statistics/select" })}
            />
            <QuickCard
              tone="blue"
              icon={<BarChart3 className="h-4 w-4" />}
              title="거래량 많은"
              subtitle="품목"
              onClick={() => navigate({ to: "/statistics/select" })}
            />
            <QuickCard
              tone="rose"
              icon={<ArrowUpDown className="h-4 w-4" />}
              title="가격 변동 큰"
              subtitle="품목"
              onClick={() => navigate({ to: "/statistics/select" })}
            />
          </div>
        </section>

        <p className="mt-8 text-center text-[11px] text-[#868E96]">
          데이터 제공: KAMIS 농산물유통정보
        </p>
      </div>

      <DateSheetLite
        open={dateOpen}
        onOpenChange={setDateOpen}
        selected={date}
        onSelect={(iso) => setDate(iso)}
      />
    </AppShell>
  );
}

function QuickCard({
  tone,
  icon,
  title,
  subtitle,
  onClick,
}: {
  tone: "green" | "blue" | "rose";
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  const toneCls =
    tone === "green"
      ? "bg-[#F0F9F0] text-[#3A8A3A]"
      : tone === "blue"
        ? "bg-[#EAF3FB] text-[#1971C2]"
        : "bg-[#FDECEC] text-[#E03131]";
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-start gap-2 rounded-[12px] border border-[#E9ECEF] bg-white p-3 text-left",
      )}
    >
      <span className={cn("grid h-8 w-8 place-items-center rounded-full", toneCls)}>
        {icon}
      </span>
      <div>
        <div className="text-[12.5px] font-bold leading-tight text-foreground">{title}</div>
        <div className="text-[11.5px] text-[#868E96]">{subtitle}</div>
      </div>
    </button>
  );
}

// Fallback in case unused
void TrendingUp;
