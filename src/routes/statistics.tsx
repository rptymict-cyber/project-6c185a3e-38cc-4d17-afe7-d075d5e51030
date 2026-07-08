import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, ChevronRight, Info, Search } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AppHeader } from "@/components/app-header";
import { getCrop } from "@/lib/mock/crops";
import { useRecentStats } from "@/store/recent-stats";
import { cn } from "@/lib/utils";
import { CropIcon } from "@/components/crop-icon";

export const Route = createFileRoute("/statistics")({
  component: StatisticsHome,
  head: () => ({
    meta: [
      { title: "농산물 통계 — AGDICT" },
      {
        name: "description",
        content: "작물을 선택해 시장별 평균가와 가격 흐름을 확인하세요.",
      },
    ],
  }),
});

const CROP_SELECT_SEARCH = {
  from: "statistics" as const,
  return: "/statistics" as const,
};

function StatisticsHome() {
  const recent = useRecentStats((s) => s.items);

  return (
    <AppShell
      header={
        <AppHeader
          title="농산물 통계"
          right={
            <>
              <Link
                to="/crop-select"
                search={CROP_SELECT_SEARCH}
                aria-label="검색"
                className="grid h-9 w-9 place-items-center rounded-full text-foreground hover:bg-secondary"
              >
                <Search className="h-5 w-5" />
              </Link>
              <Link
                to="/notifications"
                aria-label="알림"
                className="grid h-9 w-9 place-items-center rounded-full text-foreground hover:bg-secondary"
              >
                <Bell className="h-5 w-5" />
              </Link>
            </>
          }
        />
      }
    >
      <div className="px-4 pb-10 pt-4">
        {/* Search field → crop-select */}
        <Link
          to="/crop-select"
          search={CROP_SELECT_SEARCH}
          className="flex h-11 w-full items-center gap-2 rounded-full border border-[#E9ECEF] bg-[#F8F9FA] px-4 text-[13.5px] text-[#868E96] active:bg-[#F1F3F5]"
        >
          <Search className="h-4 w-4 text-[#ADB5BD]" />
          작물명 · 품종으로 검색
        </Link>

        {/* Recent stats */}
        {recent.length > 0 && (
          <section className="mt-6">
            <div className="mb-2 flex items-baseline justify-between">
              <h3 className="text-[14px] font-bold text-foreground">최근 본 통계</h3>
              <button
                onClick={() => useRecentStats.getState().clear()}
                className="text-[11.5px] font-semibold text-[#868E96]"
              >
                전체 지우기
              </button>
            </div>

            <ul className="overflow-hidden rounded-[12px] border border-[#E9ECEF] bg-white">
              {recent.map((r, i) => {
                const c = getCrop(r.varietyId);
                if (!c) return null;
                const delta = c.currentPrice - c.prevPrice;
                const pct = c.prevPrice > 0 ? (delta / c.prevPrice) * 100 : 0;
                const tone =
                  delta > 0 ? "text-[#E03131]" : delta < 0 ? "text-[#1971C2]" : "text-[#6C757D]";
                const arrow = delta > 0 ? "▲" : delta < 0 ? "▼" : "";
                return (
                  <li key={r.varietyId} className={cn(i > 0 && "border-t border-[#F1F3F5]")}>
                    <Link
                      to="/statistics/$variety"
                      params={{ variety: r.varietyId }}
                      className="flex items-center gap-3 px-3 py-3"
                    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#F1F3F5]">
                        <CropIcon name={c.name} size={24} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[13.5px] font-bold text-foreground">
                          {c.name}
                        </div>
                        <div className="mt-0.5 truncate text-[11px] text-[#868E96]">
                          {c.unit}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[13.5px] font-black tabular-nums text-foreground">
                          {c.currentPrice.toLocaleString()}원
                        </div>
                        <div className={cn("mt-0.5 text-[11px] font-semibold tabular-nums", tone)}>
                          {arrow} {Math.abs(pct).toFixed(1)}%
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-[#ADB5BD]" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* Main CTA — pick a crop */}
        <Link
          to="/crop-select"
          search={CROP_SELECT_SEARCH}
          className="mt-6 flex items-center gap-3 rounded-[16px] border border-[#D3EBD3] bg-[#F0F9F0] p-4 active:bg-[#E7F5E7]"
        >
          <div
            aria-hidden
            className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white text-[28px] leading-none"
          >
            📊
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[15px] font-black leading-snug text-[#1F5C1F]">
              작물 선택해서 통계 보기
            </div>
            <div className="mt-1 text-[12px] leading-relaxed text-[#3A8A3A]">
              가격 흐름 · 시장별 평균가 · 거래량
            </div>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-[#3A8A3A]" />
        </Link>

        {/* Info */}
        <section className="mt-6 rounded-[12px] border border-[#E9ECEF] bg-[#F8F9FA] p-3.5">
          <div className="mb-1.5 flex items-center gap-1.5 text-[12.5px] font-bold text-[#495057]">
            <Info className="h-3.5 w-3.5" /> 안내사항
          </div>
          <ul className="space-y-1 text-[11.5px] leading-relaxed text-[#6C757D]">
            <li>· 해당 통계는 도매시장에 반입된 가격 기준입니다.</li>
            <li>· 가격은 kg당 평균가격 기준으로 표시됩니다.</li>
            <li>· 통계는 매일 06시 기준으로 업데이트됩니다.</li>
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
