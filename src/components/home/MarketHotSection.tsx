import { useState } from "react";
import { cn } from "@/lib/utils";

type MarketTop = {
  id: string;
  name: string;
  items: { name: string; pct: number }[];
};

const MARKETS: MarketTop[] = [
  {
    id: "garak",
    name: "가락시장",
    items: [
      { name: "배추", pct: 8.2 },
      { name: "무", pct: 6.1 },
      { name: "대파", pct: 4.8 },
    ],
  },
  {
    id: "gangseo",
    name: "강서시장",
    items: [
      { name: "방울토마토", pct: 7.3 },
      { name: "애호박", pct: 5.6 },
      { name: "감자", pct: 4.2 },
    ],
  },
  {
    id: "daegu",
    name: "대구북부시장",
    items: [
      { name: "양파", pct: 5.1 },
      { name: "마늘", pct: 3.8 },
      { name: "고구마", pct: 2.9 },
    ],
  },
  {
    id: "busan",
    name: "부산엄궁시장",
    items: [
      { name: "양배추", pct: 6.2 },
      { name: "당근", pct: 4.7 },
      { name: "상추", pct: 3.9 },
    ],
  },
  {
    id: "guri",
    name: "구리시장",
    items: [
      { name: "오이", pct: 5.4 },
      { name: "가지", pct: 3.5 },
      { name: "부추", pct: 2.6 },
    ],
  },
];

export function MarketHotSection() {
  const [active, setActive] = useState("garak");
  const current = MARKETS.find((m) => m.id === active) ?? MARKETS[0];
  return (
    <section className="mt-6">
      <h2 className="px-4 text-[15px] font-bold text-foreground">도매시장별 오늘의 품목</h2>

      <div className="no-scrollbar mt-2 flex gap-1.5 overflow-x-auto px-4 pb-1">
        {MARKETS.map((m) => {
          const on = m.id === active;
          return (
            <button
              key={m.id}
              onClick={() => setActive(m.id)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors",
                on
                  ? "bg-[#EAF7EA] text-[#2F6E2F] ring-1 ring-[#3A8A3A]"
                  : "bg-[#F1F3F5] text-[#495057]",
              )}
            >
              {m.name}
            </button>
          );
        })}
      </div>

      <div className="mt-2 px-4">
        <div className="rounded-2xl bg-white p-3 shadow-[0_1px_4px_rgba(0,0,0,0.05)] ring-1 ring-[#F1F3F5]">
          <div className="mb-1.5 text-[12px] font-semibold text-[#495057]">{current.name}</div>
          <ul className="space-y-1.5">
            {current.items.map((it, i) => (
              <li key={it.name} className="flex items-center gap-3 text-[13px]">
                <span className="w-4 text-center font-bold text-[#3A8A3A] tabular-nums">
                  {i + 1}
                </span>
                <span className="flex-1 text-foreground">{it.name}</span>
                <span className="font-bold tabular-nums text-[#E03131]">
                  +{it.pct.toFixed(1)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
