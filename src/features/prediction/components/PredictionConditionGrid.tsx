import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConditionCellProps {
  label: string;
  value: string;
  onClick: () => void;
  accent?: "default" | "green";
}

function ConditionCell({ label, value, onClick, accent = "default" }: ConditionCellProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-xl border bg-white px-3 py-2.5 text-left active:bg-[#F8F9FA]",
        accent === "green"
          ? "border-[#3A8A3A]/40 bg-[#F0F9F0]"
          : "border-[#E9ECEF]",
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="text-[11px] font-medium text-[#868E96]">{label}</div>
        <div
          className={cn(
            "mt-0.5 truncate text-[14px] font-bold",
            accent === "green" ? "text-[#1F5C1F]" : "text-foreground",
          )}
        >
          {value}
        </div>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-[#ADB5BD]" />
    </button>
  );
}

export function PredictionConditionGrid({
  quantityLabel,
  quantityHeading,
  cropLabel,
  marketLabel,
  viewpointLabel,
  onQuantityClick,
  onCropClick,
  onMarketClick,
  onViewpointClick,
}: {
  quantityLabel: string;
  quantityHeading: "출하량" | "매입량";
  cropLabel: string;
  marketLabel: string;
  viewpointLabel: string;
  onQuantityClick: () => void;
  onCropClick: () => void;
  onMarketClick: () => void;
  onViewpointClick: () => void;
}) {
  return (
    <section className="grid grid-cols-2 gap-2">
      <ConditionCell
        label={quantityHeading}
        value={quantityLabel}
        onClick={onQuantityClick}
      />
      <ConditionCell label="작물" value={cropLabel} onClick={onCropClick} />
      <ConditionCell
        label="도매시장"
        value={marketLabel}
        onClick={onMarketClick}
      />
      <ConditionCell
        label="유형"
        value={viewpointLabel}
        onClick={onViewpointClick}
        accent="green"
      />
    </section>
  );
}
