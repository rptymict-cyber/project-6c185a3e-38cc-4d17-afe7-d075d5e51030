import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  Info,
  Layers,
  Package,
  Search,
  Sprout,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { AppHeader } from "@/components/app-header";
import { DateSheetLite } from "@/components/date-sheet-lite";
import { getCrop } from "@/lib/mock/crops";
import {
  getCategoryById,
  getItemById,
} from "@/lib/catalog-service";
import { useCropSelection } from "@/store/cropSelection";
import { useRecentStats } from "@/store/recent-stats";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/statistics")({
  component: StatisticsHome,
  head: () => ({
    meta: [
      { title: "통계 — AGDICT" },
      {
        name: "description",
        content: "원하는 조건을 선택하고 시장별 평균가격과 거래량을 확인하세요.",
      },
    ],
  }),
});

function fmtDateDot(iso: string): string {
  return iso.replaceAll("-", ".");
}

function StatisticsHome() {
  const navigate = useNavigate();
  const recent = useRecentStats((s) => s.items);

  const [date, setDate] = useState("2025-07-05");
  const [dateOpen, setDateOpen] = useState(false);

  // 작물 선택은 /crop-select 페이지가 유일한 진입점.
  // 화면은 committed 값만 구독한다.
  const committed = useCropSelection((s) => s.committed);
  const category = committed.categoryId
    ? getCategoryById(committed.categoryId)
    : undefined;
  const item = committed.itemId ? getItemById(committed.itemId) : undefined;
  const varietyName = (() => {
    if (!committed.varietyId || !item) return undefined;
    if (committed.varietyId === "ALL") return "전체 품종";
    return item.varieties.find((v) => v.id === committed.varietyId)?.name;
  })();

  const canSubmit = Boolean(item && committed.varietyId);

  const submit = () => {
    if (!canSubmit || !item) {
      toast("조회 날짜와 부류/품목/품종을 모두 선택해 주세요.");
      return;
    }
    useRecentStats.getState().push(item.id);
    navigate({ to: "/statistics/$variety", params: { variety: item.id } });
  };

  // /crop-select 로 이동시키는 공통 링크 프롭
  const cropSelectSearch = {
    from: "statistics" as const,
    return: "/statistics" as const,
  };

  return (
    <AppShell
      header={
        <AppHeader
          title="통계"
          right={
            <Link
              to="/search"
              aria-label="검색"
              className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary"
            >
              <Search className="h-5 w-5 text-[#495057]" />
            </Link>
          }
        />
      }
    >
      <div className="px-4 pb-10 pt-4">
        {/* Intro */}
        <section className="overflow-hidden rounded-[16px] border border-[#D3EBD3] bg-[#F0F9F0] p-4">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <h2 className="text-[17px] font-black leading-snug text-[#1F5C1F]">
                농산물 가격 통계
              </h2>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#3A8A3A]">
                원하는 조건을 선택하고
                <br />
                시장별 평균가격과 거래량을 확인해 보세요.
              </p>
            </div>
            <div
              aria-hidden
              className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white/70 text-[36px] leading-none"
            >
              📊
            </div>
          </div>
        </section>

        {/* Condition cards */}
        <section className="mt-4 rounded-[16px] border border-[#E9ECEF] bg-white p-3">
          <div className="grid grid-cols-2 gap-2">
            <SelectCard
              icon={<Calendar className="h-4 w-4" />}
              label="조회 날짜"
              value={fmtDateDot(date)}
              filled
              onClick={() => setDateOpen(true)}
            />
            <CropSelectCard
              icon={<Layers className="h-4 w-4" />}
              label="부류"
              value={category?.name ?? "선택"}
              filled={!!category}
              search={cropSelectSearch}
            />
            <CropSelectCard
              icon={<Package className="h-4 w-4" />}
              label="품목"
              value={item?.name ?? "선택"}
              filled={!!item}
              search={cropSelectSearch}
            />
            <CropSelectCard
              icon={<Sprout className="h-4 w-4" />}
              label="품종"
              value={varietyName ?? "선택"}
              filled={!!varietyName}
              search={cropSelectSearch}
            />
          </div>

          <button
            type="button"
            onClick={submit}
            disabled={!canSubmit}
            className={cn(
              "mt-3 flex w-full items-center justify-center rounded-[12px] py-3.5 text-[14.5px] font-bold text-white transition-colors",
              canSubmit ? "bg-[#E03131] active:bg-[#C92A2A]" : "bg-[#CED4DA]",
            )}
          >
            통계 보기
          </button>
        </section>

        {/* Recent */}
        <section className="mt-6">
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
                const viewedISO = new Date(r.viewedAt)
                  .toISOString()
                  .slice(0, 10)
                  .replace(/-/g, ".");
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
                          {viewedISO}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-[#ADB5BD]" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

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

      {/* Date sheet */}
      <DateSheetLite
        open={dateOpen}
        onOpenChange={setDateOpen}
        selected={date}
        onSelect={(iso) => setDate(iso)}
      />
    </AppShell>
  );
}

function SelectCard({
  icon,
  label,
  value,
  filled,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  filled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2.5 rounded-[12px] border border-[#E9ECEF] bg-white px-3 py-3 text-left active:bg-[#F8F9FA]"
    >
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#F1F3F5] text-[#495057]">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[11px] font-semibold text-[#868E96]">{label}</div>
        <div
          className={cn(
            "mt-0.5 truncate text-[13.5px] font-bold",
            filled ? "text-[#E03131]" : "text-[#ADB5BD]",
          )}
        >
          {value}
        </div>
      </div>
      <ChevronDown className="h-4 w-4 shrink-0 text-[#ADB5BD]" />
    </button>
  );
}

function CropSelectCard({
  icon,
  label,
  value,
  filled,
  search,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  filled: boolean;
  search: { from: string; return: string };
}) {
  return (
    <Link
      to="/crop-select"
      search={search}
      className="flex items-center gap-2.5 rounded-[12px] border border-[#E9ECEF] bg-white px-3 py-3 text-left active:bg-[#F8F9FA]"
    >
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#F1F3F5] text-[#495057]">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[11px] font-semibold text-[#868E96]">{label}</div>
        <div
          className={cn(
            "mt-0.5 truncate text-[13.5px] font-bold",
            filled ? "text-[#E03131]" : "text-[#ADB5BD]",
          )}
        >
          {value}
        </div>
      </div>
      <ChevronDown className="h-4 w-4 shrink-0 text-[#ADB5BD]" />
    </Link>
  );
}
