import { cn } from "@/lib/utils";

export type HomeCategory =
  | "all"
  | "vegetable"
  | "fruit"
  | "seasoning"
  | "grain"
  | "predict";

export const HOME_CATEGORIES: { id: HomeCategory; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "vegetable", label: "채소" },
  { id: "fruit", label: "과일" },
  { id: "seasoning", label: "양념채소" },
  { id: "grain", label: "곡물·특작" },
  { id: "predict", label: "예측가능" },
];

export function HomeCategoryTabs({
  value,
  onChange,
}: {
  value: HomeCategory;
  onChange: (v: HomeCategory) => void;
}) {
  return (
    <div className="no-scrollbar sticky top-[56px] z-20 flex gap-1 overflow-x-auto border-b border-[#E9ECEF] bg-background px-2">
      {HOME_CATEGORIES.map((c) => {
        const active = c.id === value;
        return (
          <button
            key={c.id}
            onClick={() => onChange(c.id)}
            className={cn(
              "relative shrink-0 px-3 py-3 text-[14px] transition-colors",
              active ? "font-bold text-foreground" : "font-medium text-[#6C757D]",
            )}
          >
            {c.label}
            {active && (
              <span className="absolute inset-x-2 -bottom-px h-[2px] rounded-full bg-[#3A8A3A]" />
            )}
          </button>
        );
      })}
    </div>
  );
}
