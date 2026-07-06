import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Theme = { id: string; label: string; emoji: string; pct: number };

const THEMES: Theme[] = [
  { id: "kimjang", label: "김장채소", emoji: "🥬", pct: 5.8 },
  { id: "spice", label: "양념채소", emoji: "🧄", pct: 3.1 },
  { id: "fruit", label: "제철과일", emoji: "🍎", pct: -2.4 },
  { id: "heat", label: "폭염영향 품목", emoji: "☀️", pct: 4.6 },
  { id: "holiday", label: "명절수요 품목", emoji: "🎁", pct: 2.9 },
];

export function AgricultureThemeSection() {
  return (
    <section className="mt-6">
      <div className="flex items-center justify-between px-4">
        <h2 className="text-[15px] font-bold text-foreground">지금 뜨는 농산물 테마</h2>
        <button className="flex items-center gap-0.5 text-[12px] text-[#868E96]">
          더보기 <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto px-4 pb-1">
        {THEMES.map((t) => {
          const up = t.pct > 0;
          const color = up ? "text-[#E03131]" : "text-[#1971C2]";
          const sign = up ? "+" : "";
          return (
            <div
              key={t.id}
              className="flex w-[104px] shrink-0 flex-col items-center gap-1 rounded-2xl bg-white p-3 shadow-[0_1px_4px_rgba(0,0,0,0.05)] ring-1 ring-[#F1F3F5]"
            >
              <span className="text-[26px] leading-none">{t.emoji}</span>
              <span className="text-[12px] font-semibold text-foreground">{t.label}</span>
              <span className={cn("text-[12px] font-bold tabular-nums", color)}>
                {sign}
                {t.pct.toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
