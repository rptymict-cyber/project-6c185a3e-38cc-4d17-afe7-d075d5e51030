import { useState, type ReactNode } from "react";
import { Calendar, ChevronDown, MapPin, Package, Ruler, Sprout, Store } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { useMarketFilter } from "@/store/market";
import { DateSheet } from "./DateSheet";
import { ItemSheet } from "./ItemSheet";
import { MarketSheet } from "./MarketSheet";
import { UnitSheet } from "./UnitSheet";
import { cn } from "@/lib/utils";

export function MarketFilterBar() {
  const f = useMarketFilter();
  const [dateOpen, setDateOpen] = useState(false);
  const [itemOpen, setItemOpen] = useState(false);
  const [varietyOpen, setVarietyOpen] = useState(false);
  const [marketOpen, setMarketOpen] = useState(false);
  const [unitOpen, setUnitOpen] = useState(false);

  return (
    <div className="px-4 pt-3">
      {/* Row 2: date + simple mode */}
      <div className="mt-3 flex items-center justify-between gap-2">
        <button
          onClick={() => setDateOpen(true)}
          className="flex items-center gap-1.5 rounded-[10px] border border-[#B7E4B7] bg-[#F0F9F0] px-3 py-2 text-[13px] font-semibold text-[#1F5C1F]"
        >
          <Calendar className="h-3.5 w-3.5" />
          {f.dateLabel}
          <ChevronDown className="h-3.5 w-3.5 opacity-70" />
        </button>

        <label className="flex items-center gap-2">
          <span className="text-[12.5px] font-semibold text-[#495057]">간편 모드</span>
          <Switch
            checked={f.simpleMode}
            onCheckedChange={(v) => f.setSimpleMode(v)}
            className="data-[state=checked]:bg-[#3A8A3A]"
          />
        </label>
      </div>

      {/* Row 3: 2x2 selector grid */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <SelectorCard
          icon={<Sprout className="h-3.5 w-3.5" />}
          label={`품목 (${f.categoryLabel})`}
          value={f.itemLabel}
          onClick={() => setItemOpen(true)}
        />
        <SelectorCard
          icon={<Package className="h-3.5 w-3.5" />}
          label="품종"
          value={f.varietyLabel}
          onClick={() => setVarietyOpen(true)}
        />
        <SelectorCard
          icon={<Store className="h-3.5 w-3.5" />}
          label="도매시장"
          value={f.marketLabel}
          onClick={() => setMarketOpen(true)}
        />
        <SelectorCard
          icon={<Ruler className="h-3.5 w-3.5" />}
          label="단위"
          value={f.unit}
          onClick={() => setUnitOpen(true)}
        />
      </div>

      {/* Row 4: nearest market CTA */}
      <button
        onClick={() => toast("위치 권한을 확인 중이에요 (준비 중)")}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-[12px] border-[1.5px] border-[#3A8A3A] bg-white py-3 text-[13.5px] font-bold text-[#3A8A3A]"
      >
        <MapPin className="h-4 w-4" />
        가장 가까운 도매시장 찾기
      </button>

      <DateSheet open={dateOpen} onOpenChange={setDateOpen} />
      <ItemSheet open={itemOpen} onOpenChange={setItemOpen} />
      <ItemSheet open={varietyOpen} onOpenChange={setVarietyOpen} />
      <MarketSheet open={marketOpen} onOpenChange={setMarketOpen} />
      <UnitSheet open={unitOpen} onOpenChange={setUnitOpen} />
    </div>
  );
}

function SelectorCard({
  icon, label, value, onClick,
}: { icon: ReactNode; label: string; value: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-start gap-1 rounded-[12px] border border-[#E9ECEF] bg-white px-3 py-2.5 text-left",
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
