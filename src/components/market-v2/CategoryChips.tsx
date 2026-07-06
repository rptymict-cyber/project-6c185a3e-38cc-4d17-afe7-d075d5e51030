import { cn } from "@/lib/utils";
import { ITEM_CATEGORIES } from "@/lib/mock/items";

export function CategoryChips({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="no-scrollbar flex gap-1.5 overflow-x-auto px-4 pb-1 pt-3">
      {ITEM_CATEGORIES.map((c) => {
        const active = c.id === value;
        return (
          <button
            key={c.id}
            onClick={() => onChange(c.id)}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors",
              active ? "bg-[#3A8A3A] text-white" : "bg-[#F8F9FA] text-[#6C757D]",
            )}
          >
            {c.label}
          </button>
        );
      })}
    </div>
  );
}
