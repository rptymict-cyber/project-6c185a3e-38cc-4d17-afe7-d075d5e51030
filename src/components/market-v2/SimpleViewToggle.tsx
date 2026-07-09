import { cn } from "@/lib/utils";
import type { SimpleViewMode } from "@/store/market";

export function SimpleViewToggle({
  value,
  onChange,
}: {
  value: SimpleViewMode;
  onChange: (v: SimpleViewMode) => void;
}) {
  const tabs: { id: SimpleViewMode; label: string }[] = [
    { id: "table", label: "표형" },
    { id: "list", label: "리스트형" },
  ];

  return (
    <div className="px-4 pt-3">
      <div className="relative grid grid-cols-2 rounded-[11px] bg-[#F8F9FA] p-1">
        {tabs.map((t) => {
          const active = t.id === value;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              className={cn(
                "relative z-10 rounded-[9px] py-2 text-[13.5px] font-semibold transition-colors",
                active ? "text-foreground" : "text-muted-foreground",
              )}
              style={
                active
                  ? {
                      backgroundColor: "#FFFFFF",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                    }
                  : undefined
              }
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
