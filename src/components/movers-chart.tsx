import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Crop } from "@/lib/mock/crops";

type Row = {
  name: string;
  changePct: number;
  volume: number;
};

function buildRows(crops: Crop[]): Row[] {
  return crops
    .map((c) => ({
      name: c.name,
      changePct: ((c.currentPrice - c.prevPrice) / c.prevPrice) * 100,
      volume: c.volumeTon,
    }))
    .sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct))
    .slice(0, 7);
}

export function MoversChart({ crops }: { crops: Crop[] }) {
  const rows = buildRows(crops);
  return (
    <div>
      <div className="mb-2 flex items-center gap-3 text-[10px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-sm bg-[#E03131]" /> 상승
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-sm bg-[#1971C2]" /> 하락
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-[2px] w-3 bg-[#ADB5BD]" /> 거래량(t)
        </span>
      </div>
      <div className="h-[180px] w-full">

        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={rows}
            margin={{ top: 8, right: 8, bottom: 4, left: -12 }}
          >
            <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: "#6C757D" }}
              tickLine={false}
              axisLine={{ stroke: "#E9ECEF" }}
              interval={0}
            />
            <YAxis
              yAxisId="pct"
              tick={{ fontSize: 10, fill: "#6C757D" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}%`}
              width={36}
            />
            <YAxis
              yAxisId="vol"
              orientation="right"
              tick={{ fontSize: 10, fill: "#ADB5BD" }}
              tickLine={false}
              axisLine={false}
              width={28}
            />
            <Tooltip
              cursor={{ fill: "rgba(0,0,0,0.04)" }}
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #E9ECEF",
                fontSize: 12,
              }}
              formatter={(value: number, key) =>
                key === "changePct"
                  ? [`${value.toFixed(2)}%`, "등락률"]
                  : [`${value.toLocaleString()}t`, "거래량"]
              }
            />
            <Bar yAxisId="pct" dataKey="changePct" radius={[4, 4, 0, 0]} maxBarSize={28}>
              {rows.map((r, i) => (
                <Cell key={i} fill={r.changePct >= 0 ? "#E03131" : "#1971C2"} />
              ))}
            </Bar>
            <Line
              yAxisId="vol"
              type="monotone"
              dataKey="volume"
              stroke="#ADB5BD"
              strokeWidth={2}
              dot={{ r: 3, fill: "#ADB5BD", strokeWidth: 0 }}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
