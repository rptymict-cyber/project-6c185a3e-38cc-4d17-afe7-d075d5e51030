import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Calendar as CalendarIcon,
  ChevronRight,
  Layers,
  Leaf,
  Sprout,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AppHeader } from "@/components/app-header";
import { DatePickerSheet, defaultTradingDayFilter } from "@/components/date-picker-sheet";
import { useRecentStats } from "@/store/recent-stats";
import { useCropSelection } from "@/store/cropSelection";
import { getCategoryById, getItemById } from "@/lib/catalog-service";
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
        content: "조회 날짜와 작물을 선택해 시장별 평균가와 가격 흐름을 확인하세요.",
      },
    ],
  }),
});

const CROP_SELECT_SEARCH = {
  from: "statistics" as const,
  return: "/statistics" as const,
};

function formatKoreanDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
  const wd = ["일", "월", "화", "수", "목", "금", "토"][dt.getDay()];
  return `${y}년 ${m}월 ${d}일 (${wd})`;
}

function StatisticsHome() {
  const navigate = useNavigate();
  const recent = useRecentStats((s) => s.items);
  const committed = useCropSelection((s) => s.committed);

  const category = committed.categoryId
    ? getCategoryById(committed.categoryId)
    : undefined;
  const item = committed.itemId ? getItemById(committed.itemId) : undefined;
  const varietyName =
    !item
      ? undefined
      : !committed.varietyId || committed.varietyId === "ALL"
        ? "전체 품종"
        : item.varieties.find((v) => v.id === committed.varietyId)?.name;

  const [date, setDate] = useState("2025-07-05");
  const [dateOpen, setDateOpen] = useState(false);

  const canView = Boolean(item && varietyName);

  const handleViewStats = () => {
    if (!canView || !item) return;
    const target =
      !committed.varietyId || committed.varietyId === "ALL"
        ? item.id
        : (committed.varietyId as string);
    navigate({ to: "/statistics/$variety", params: { variety: target } });
  };

  return (
    <AppShell
      header={<AppHeader title="농산물 통계" />}
    >
      <div className="px-4 pb-24 pt-4">
        {/* 메인 카드 */}
        <section className="rounded-[14px] border border-[#E9ECEF] bg-white p-4">
          <h2 className="text-[16px] font-black text-foreground">농산물 가격 통계</h2>
          <p className="mt-1 text-[12.5px] text-[#6C757D]">
            원하는 조건을 선택하고 통계를 확인해보세요.
          </p>

          <div className="mt-4 flex flex-col gap-2">
            <FieldButton
              icon={<CalendarIcon className="h-3.5 w-3.5" />}
              label="조회 날짜"
              value={formatKoreanDate(date)}
              onClick={() => setDateOpen(true)}
            />
            <CropFieldLink
              icon={<Sprout className="h-3.5 w-3.5" />}
              label="작물"
              value={
                item
                  ? [category?.name, item.name, varietyName].filter(Boolean).join(" > ")
                  : undefined
              }
              placeholder="작물 선택"
            />
          </div>

          <button
            type="button"
            onClick={handleViewStats}
            disabled={!canView}
            className={cn(
              "mt-4 flex w-full items-center justify-center rounded-[12px] py-3 text-[14px] font-black transition-colors",
              canView
                ? "bg-[#3A8A3A] text-white active:bg-[#2F6F2F]"
                : "bg-[#E9ECEF] text-[#ADB5BD]",
            )}
          >
            통계 보기
          </button>
        </section>

        {/* 안내사항 */}
        <section className="mt-4 rounded-[12px] border border-[#E9ECEF] bg-[#F8F9FA] p-3">
          <div className="text-[12px] font-bold text-[#495057]">안내사항</div>
          <ul className="mt-1.5 space-y-1 text-[11.5px] leading-relaxed text-[#6C757D]">
            <li>· 해당 통계는 도매시장 반입 가격 기준입니다.</li>
            <li>· 가격은 선택 단위 기준 평균가격입니다.</li>
            <li>· 통계는 데이터 제공 시점에 따라 지연될 수 있습니다.</li>
          </ul>
        </section>

        {/* 최근 본 통계 */}
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
                          {subject.itemLabel}
                        </div>
                        <div className="mt-0.5 truncate text-[11px] text-[#868E96]">
                          {subject.varietyLabel}
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

      <DatePickerSheet
        open={dateOpen}
        onOpenChange={setDateOpen}
        selected={date}
        onConfirm={(iso) => setDate(iso)}
        hasDataFor={defaultTradingDayFilter}
      />
    </AppShell>
  );
}

function FieldButton({
  icon,
  label,
  value,
  placeholder,
  onClick,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  placeholder?: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex w-full items-center gap-3 rounded-[12px] border border-[#E9ECEF] bg-white px-3 py-3 text-left",
        disabled ? "opacity-60" : "active:bg-[#F8F9FA]",
      )}
    >
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#F1F3F5] text-[#495057]">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-medium text-[#868E96]">{label}</span>
        <span
          className={cn(
            "block truncate text-[14px] font-bold",
            value ? "text-foreground" : "text-[#ADB5BD]",
          )}
        >
          {value ?? placeholder ?? "선택"}
        </span>
      </span>
      <ChevronRight className="h-4 w-4 shrink-0 text-[#ADB5BD]" />
    </button>
  );
}

function CropFieldLink(props: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
}) {
  const { icon, label, value, placeholder, disabled } = props;
  if (disabled) {
    return (
      <FieldButton
        icon={icon}
        label={label}
        value={value}
        placeholder={placeholder}
        disabled
      />
    );
  }
  return (
    <Link
      to="/crop-select"
      search={CROP_SELECT_SEARCH}
      className="flex w-full items-center gap-3 rounded-[12px] border border-[#E9ECEF] bg-white px-3 py-3 text-left active:bg-[#F8F9FA]"
    >
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#F1F3F5] text-[#495057]">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-medium text-[#868E96]">{label}</span>
        <span
          className={cn(
            "block truncate text-[14px] font-bold",
            value ? "text-foreground" : "text-[#ADB5BD]",
          )}
        >
          {value ?? placeholder ?? "선택"}
        </span>
      </span>
      <ChevronRight className="h-4 w-4 shrink-0 text-[#ADB5BD]" />
    </Link>
  );
}
