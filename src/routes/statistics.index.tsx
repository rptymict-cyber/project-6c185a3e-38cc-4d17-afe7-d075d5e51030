import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, ChevronDown, ChevronRight, Sprout } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AppHeader } from "@/components/app-header";
import { useRecentStats } from "@/store/recent-stats";
import { useCropSelection } from "@/store/cropSelection";
import {
  getCategoryById,
  getItemById,
} from "@/lib/catalog-service";
import { resolveCropSubject } from "@/lib/mock/crop-resolver";
import { cn } from "@/lib/utils";
import { CropIcon } from "@/components/crop-icon";

export const Route = createFileRoute("/statistics/")({
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

function useCommittedCropLabel(): string | null {
  const committed = useCropSelection((s) => s.committed);
  if (!committed.itemId) return null;
  const item = getItemById(committed.itemId);
  if (!item) return null;
  const category = committed.categoryId
    ? getCategoryById(committed.categoryId)
    : undefined;
  const varietyName =
    !committed.varietyId || committed.varietyId === "ALL"
      ? "전체 품종"
      : (item.varieties.find((v) => v.id === committed.varietyId)?.name ??
        "전체 품종");
  return `${category?.name ? category.name + " · " : ""}${item.name} · ${varietyName}`;
}

function StatisticsHome() {
  const recent = useRecentStats((s) => s.items);
  const cropLabel = useCommittedCropLabel();

  return (
    <AppShell
      header={
        <AppHeader
          title="농산물 통계"
          right={
            <Link
              to="/notifications"
              aria-label="알림"
              className="grid h-9 w-9 place-items-center rounded-full text-foreground hover:bg-secondary"
            >
              <Bell className="h-5 w-5" />
            </Link>
          }
        />
      }
    >
      <div className="px-4 pb-10 pt-4">
        {/* 작물 선택 버튼 — 시세 탭의 필터 카드와 동일한 스타일, 한 행 전체 너비 */}
        <Link
          to="/crop-select"
          search={CROP_SELECT_SEARCH}
          className="flex min-h-16 w-full flex-col items-start gap-1 rounded-[12px] border border-[#E9ECEF] bg-white px-3 py-2.5 text-left active:bg-[#F8F9FA]"
        >
          <span className="flex items-center gap-1 text-[11px] font-medium text-[#868E96]">
            <Sprout className="h-3.5 w-3.5" />
            작물
          </span>
          <span className="flex w-full items-center justify-between">
            <span className="truncate text-[14px] font-bold text-foreground">
              {cropLabel ?? "작물 선택"}
            </span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[#ADB5BD]" />
          </span>
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
                const subject = resolveCropSubject(r.varietyId);
                const c = subject.crop;
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
                          {subject.itemLabel !== subject.varietyLabel
                            ? `${subject.itemLabel} · ${subject.varietyLabel}`
                            : c.unit}
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
      </div>
    </AppShell>
  );
}
