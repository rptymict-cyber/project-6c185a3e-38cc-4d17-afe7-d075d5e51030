import { useState, type ReactNode } from "react";
import { Building2, Calendar, ChevronDown, Sprout, Store } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { useMarketFilter } from "@/store/market";
import { useCropSelection } from "@/store/cropSelection";
import { getCategoryById, getItemById } from "@/lib/catalog-service";
import { DatePickerSheet, defaultTradingDayFilter } from "@/components/date-picker-sheet";
import { MarketSheet } from "./MarketSheet";
import { CorporationSheet } from "./CorporationSheet";
import { cn } from "@/lib/utils";

function formatDate(iso: string): string {
  // "2025-07-05" -> "2025.07.05"
  if (!iso) return "";
  return iso.replaceAll("-", ".");
}

/**
 * 작물(부류/품목/품종) 선택은 반드시 /crop-select 페이지로 이동한다.
 * 여기서는 committed 값을 읽어 라벨만 표시한다.
 * 커밋 값이 없으면 legacy `useMarketFilter.varietyLabel`로 폴백.
 */
function useCropLabel(fallback: string): string {
  const committed = useCropSelection((s) => s.committed);
  if (!committed.itemId) return fallback;
  const item = getItemById(committed.itemId);
  if (!item) return fallback;
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

export function MarketFilterBar() {
  const f = useMarketFilter();
  const [dateOpen, setDateOpen] = useState(false);
  const [marketOpen, setMarketOpen] = useState(false);
  const [corpOpen, setCorpOpen] = useState(false);
  const cropLabel = useCropLabel(f.varietyLabel);

  return (
    <div className="px-4 pt-3">
      {/* 2x2 selector grid: 날짜 / 작물 / 도매시장 / 도매법인 */}
      <div className="grid grid-cols-2 gap-2">
        <SelectorCard
          icon={<Calendar className="h-3.5 w-3.5" />}
          label="조회 날짜"
          value={formatDate(f.date)}
          onClick={() => setDateOpen(true)}
        />
        <SelectorLink
          icon={<Sprout className="h-3.5 w-3.5" />}
          label="작물"
          value={cropLabel}
          to="/crop-select"
          search={{ from: "market", return: "/market" }}
        />
        <SelectorCard
          icon={<Store className="h-3.5 w-3.5" />}
          label="도매시장"
          value={f.marketLabel}
          onClick={() => setMarketOpen(true)}
        />
        <SelectorCard
          icon={<Building2 className="h-3.5 w-3.5" />}
          label="도매법인"
          value={f.corpLabel}
          onClick={() => setCorpOpen(true)}
        />
      </div>




      <DatePickerSheet
        open={dateOpen}
        onOpenChange={setDateOpen}
        selected={f.date}
        onConfirm={(iso, label) => f.setDate(iso, label)}
        hasDataFor={defaultTradingDayFilter}
      />
      <MarketSheet open={marketOpen} onOpenChange={setMarketOpen} />
      <CorporationSheet open={corpOpen} onOpenChange={setCorpOpen} />
    </div>
  );
}

const CARD_CLASS = cn(
  "flex min-h-16 flex-col items-start gap-1 rounded-[12px] border border-[#E9ECEF] bg-white px-3 py-2.5 text-left",
  "active:bg-[#F8F9FA]",
);

function SelectorCard({
  icon,
  label,
  value,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className={CARD_CLASS}>
      <CardInner icon={icon} label={label} value={value} />
    </button>
  );
}

function SelectorLink({
  icon,
  label,
  value,
  to,
  search,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  to: "/crop-select";
  search: { from: string; return: string };
}) {
  return (
    <Link to={to} search={search} className={CARD_CLASS}>
      <CardInner icon={icon} label={label} value={value} />
    </Link>
  );
}

function CardInner({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <>
      <span className="flex items-center gap-1 text-[11px] font-medium text-[#868E96]">
        {icon}
        {label}
      </span>
      <span className="flex w-full items-center justify-between">
        <span className="truncate text-[14px] font-bold text-foreground">{value}</span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[#ADB5BD]" />
      </span>
    </>
  );
}
