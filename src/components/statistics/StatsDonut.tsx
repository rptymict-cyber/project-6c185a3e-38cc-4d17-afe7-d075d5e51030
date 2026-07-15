import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { DONUT_COLORS } from "@/lib/mock/statistics-mock";

export function StatsDonut({
  title, data,
}: {
  title: string;
  data: { name: string; value: number }[];
}) {
  return (
    <div className="rounded-[12px] border border-[#E9ECEF] bg-white p-3">
      <h4 className="text-[13px] font-bold text-foreground">{title}</h4>
      <div className="mt-2 flex items-center gap-3">
        <div className="h-[120px] w-[120px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data} dataKey="value" nameKey="name"
                cx="50%" cy="50%" innerRadius={32} outerRadius={54}
                startAngle={90} endAngle={-270} stroke="#fff" strokeWidth={1}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="min-w-0 flex-1 space-y-1">
          {data.map((d, i) => (
            <li key={d.name} className="flex items-center justify-between gap-2 text-[12px]">
              <span className="inline-flex min-w-0 items-center gap-1.5">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                <span className="truncate text-[#495057]">{d.name}</span>
              </span>
              <span className="tabular-nums font-bold text-foreground">{d.value}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
