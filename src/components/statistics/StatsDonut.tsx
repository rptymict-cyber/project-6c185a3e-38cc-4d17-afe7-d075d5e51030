import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Sector } from "recharts";
import { DONUT_COLORS } from "@/lib/mock/statistics-mock";

/** 상위 5 + 기타 형태로 정규화. */
function topN(data: { name: string; value: number }[], n = 5) {
  const sorted = [...data].sort((a, b) => b.value - a.value);
  if (sorted.length <= n) return sorted;
  const head = sorted.slice(0, n);
  const rest = sorted.slice(n).reduce((s, d) => s + d.value, 0);
  if (rest > 0) head.push({ name: "기타", value: Math.round(rest * 10) / 10 });
  return head;
}

export function StatsDonut({
  title,
  data,
}: {
  title: string;
  data: { name: string; value: number }[];
}) {
  const items = topN(data);
  const [active, setActive] = useState<number | null>(null);
  const total = items.reduce((s, d) => s + d.value, 0);

  return (
    <div className="rounded-[12px] border border-[#E9ECEF] bg-white p-3">
      <h4 className="text-[13px] font-bold text-foreground">{title}</h4>
      <div className="mt-2 flex items-center gap-3">
        <div className="relative h-[130px] w-[130px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={items}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={36}
                outerRadius={58}
                startAngle={90}
                endAngle={-270}
                stroke="#fff"
                strokeWidth={1}
                activeIndex={active ?? -1}
                activeShape={(props: unknown) => {
                  const p = props as {
                    cx: number; cy: number; innerRadius: number; outerRadius: number;
                    startAngle: number; endAngle: number; fill: string;
                  };
                  return (
                    <Sector
                      cx={p.cx}
                      cy={p.cy}
                      innerRadius={p.innerRadius}
                      outerRadius={p.outerRadius + 4}
                      startAngle={p.startAngle}
                      endAngle={p.endAngle}
                      fill={p.fill}
                    />
                  );
                }}
                onMouseEnter={(_, i) => setActive(i)}
                onMouseLeave={() => setActive(null)}
              >
                {items.map((_, i) => (
                  <Cell
                    key={i}
                    fill={DONUT_COLORS[i % DONUT_COLORS.length]}
                    opacity={active == null || active === i ? 1 : 0.35}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* 중앙 라벨 */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            {active != null ? (
              <>
                <div className="max-w-[80px] truncate text-[11px] font-semibold text-[#495057]">
                  {items[active].name}
                </div>
                <div className="text-[15px] font-black tabular-nums text-foreground">
                  {Math.round((items[active].value / total) * 1000) / 10}%
                </div>
              </>
            ) : (
              <>
                <div className="text-[10px] text-[#868E96]">합계</div>
                <div className="text-[13px] font-bold text-[#495057]">100%</div>
              </>
            )}
          </div>
        </div>
        <ul className="min-w-0 flex-1 space-y-1">
          {items.map((d, i) => (
            <li
              key={d.name}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              className="flex items-center justify-between gap-2 text-[12px]"
              style={{ opacity: active == null || active === i ? 1 : 0.5 }}
            >
              <span className="inline-flex min-w-0 items-center gap-1.5">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }}
                />
                <span className="truncate text-[#495057]">{d.name}</span>
              </span>
              <span className="tabular-nums font-bold text-foreground">
                {Math.round((d.value / total) * 1000) / 10}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
