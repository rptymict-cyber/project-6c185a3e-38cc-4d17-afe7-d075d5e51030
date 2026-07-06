import { cn } from "@/lib/utils";

const OPTIONS: { id: "1w" | "1m" | "1y" | "3y"; label: string }[] = [
  { id: "1w", label: "1주" },
  { id: "1m", label: "1개월" },
  { id: "1y", label: "1년" },
  { id: "3y", label: "3년" },
];

export function PeriodChips({
  value,
  onChange,
}: {
  value: "1w" | "1m" | "1y" | "3y";
  onChange: (v: "1w" | "1m" | "1y" | "3y") => void;
}) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto px-4">
      {OPTIONS.map((o) => {
        const active = o.id === value;
        return (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors",
              active
                ? "bg-[#D6F0D6] text-[#1F5C1F]"
                : "bg-[#F1F3F5] text-muted-foreground",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
