import { List, Table2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SimpleViewMode } from "@/store/market";

export function SimpleViewToggle({
  value,
  onChange,
  className,
}: {
  value: SimpleViewMode;
  onChange: (v: SimpleViewMode) => void;
  className?: string;
}) {
  const tabs: { id: SimpleViewMode; label: string; icon: typeof List }[] = [
    { id: "list", label: "리스트", icon: List },
    { id: "table", label: "표", icon: Table2 },
  ];

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      {tabs.map((t) => {
        const active = t.id === value;
        const Icon = t.icon;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={cn(
              "inline-flex h-8 items-center gap-1 rounded-[8px] border px-2.5 text-[12.5px] font-semibold transition-colors",
              active
                ? "border-[#3A8A3A] bg-[#3A8A3A] text-white"
                : "border-[#E9ECEF] bg-white text-[#495057]",
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
