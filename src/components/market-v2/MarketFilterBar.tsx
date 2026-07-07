import { useState, type ReactNode } from "react";
import { Building2, Calendar, ChevronDown, Sprout, Store } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useMarketFilter } from "@/store/market";
import { DateSheet } from "./DateSheet";
import { CropSheet } from "./CropSheet";
import { MarketSheet } from "./MarketSheet";
import { CorporationSheet } from "./CorporationSheet";
import { cn } from "@/lib/utils";

function formatDate(iso: string): string {
  // "2025-07-05" -> "2025.07.05"
  if (!iso) return "";
  return iso.replaceAll("-", ".");
}

export function MarketFilterBar() {
  const f = useMarketFilter();
  const [dateOpen, setDateOpen] = useState(false);
  const [cropOpen, setCropOpen] = useState(false);
  const [marketOpen, setMarketOpen] = useState(false);
  const [corpOpen, setCorpOpen] = useState(false);

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
        <SelectorCard
          icon={<Sprout className="h-3.5 w-3.5" />}
          label="작물"
          value={f.varietyLabel}
          onClick={() => setCropOpen(true)}
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

      {/* Simple-mode toggle row (below filters, above headline card) */}
      <div className="mt-3 flex items-center justify-between px-1">
        <span className="text-[13.5px] font-semibold text-foreground">간편 모드</span>
        <Switch
          checked={f.simpleMode}
          onCheckedChange={(v) => f.setSimpleMode(v)}
          className="data-[state=checked]:bg-[#3A8A3A]"
          aria-label="간편 모드"
        />
      </div>

      <DateSheet open={dateOpen} onOpenChange={setDateOpen} />
      <CropSheet open={cropOpen} onOpenChange={setCropOpen} />
      <MarketSheet open={marketOpen} onOpenChange={setMarketOpen} />
      <CorporationSheet open={corpOpen} onOpenChange={setCorpOpen} />
    </div>
  );
}

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
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-16 flex-col items-start gap-1 rounded-[12px] border border-[#E9ECEF] bg-white px-3 py-2.5 text-left",
        "active:bg-[#F8F9FA]",
      )}
    >
      <span className="flex items-center gap-1 text-[11px] font-medium text-[#868E96]">
        {icon}
        {label}
      </span>
      <span className="flex w-full items-center justify-between">
        <span className="truncate text-[14px] font-bold text-foreground">{value}</span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[#ADB5BD]" />
      </span>
    </button>
  );
}
