import { CATEGORIES } from "@/lib/mock/crops";
import type { Category } from "@/lib/mock/crops";
import { cn } from "@/lib/utils";

export function CategoryTabs({
  value,
  onChange,
}: {
  value: "all" | Category;
  onChange: (v: "all" | Category) => void;
}) {
  return (
    <div className="no-scrollbar sticky top-[52px] z-20 flex gap-1 overflow-x-auto border-b border-[#E9ECEF] bg-background px-2">
      {CATEGORIES.map((c) => {
        const active = c.id === value;
        return (
          <button
            key={c.id}
            onClick={() => onChange(c.id)}
            className={cn(
              "relative shrink-0 px-3 py-3 text-[14px] font-medium transition-colors",
              active ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {c.label}
            {active && (
              <span className="absolute inset-x-0 -bottom-px h-[2px] bg-[#3A8A3A]" />
            )}
          </button>
        );
      })}
    </div>
  );
}
