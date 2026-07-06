import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { getCrop } from "@/lib/mock/crops";

export const Route = createFileRoute("/statistics/$variety")({
  component: VarietyStatsPage,
  head: () => ({
    meta: [{ title: "품종 통계 — AGDICT" }],
  }),
});

function VarietyStatsPage() {
  const { variety } = Route.useParams();
  const crop = getCrop(variety);

  return (
    <AppShell
      header={
        <header className="sticky top-0 z-30 flex h-[52px] items-center border-b border-[#E9ECEF] bg-background px-2">
          <Link
            to="/statistics"
            aria-label="뒤로가기"
            className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <span className="ml-1 text-[15px] font-black tracking-tight text-foreground">
            품종 통계
          </span>
        </header>
      }
    >
      <div className="px-4 pt-6 pb-10">
        {crop ? (
          <>
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-[#F1F3F5] text-[28px]">
                {crop.emoji}
              </span>
              <div>
                <div className="text-[18px] font-bold text-foreground">{crop.name}</div>
                <div className="text-[12px] text-[#868E96]">품종 통계 상세</div>
              </div>
            </div>
            <div className="mt-8 rounded-[10px] border border-dashed border-[#CED4DA] bg-white p-6 text-center text-[13px] text-[#6C757D]">
              품종별 통계 상세는 곧 제공됩니다.
            </div>
          </>
        ) : (
          <div className="text-center text-[13px] text-[#6C757D]">품종을 찾을 수 없어요</div>
        )}
      </div>
    </AppShell>
  );
}
