import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { SeriesPoint } from "@/lib/mock/market-analysis";

export function ProAnalysisChart({ data }: { data: SeriesPoint[] }) {
  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
          <CartesianGrid stroke="#F1F3F5" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "#868E96" }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
            minTickGap={16}
          />
          <YAxis
            yAxisId="price"
            orientation="left"
            tick={{ fontSize: 11, fill: "#868E96" }}
            axisLine={false}
            tickLine={false}
            width={48}
            tickFormatter={(v: number) => v.toLocaleString()}
          />
          <YAxis
            yAxisId="vol"
            orientation="right"
            tick={{ fontSize: 11, fill: "#868E96" }}
            axisLine={false}
            tickLine={false}
            width={30}
          />
          <Tooltip
            cursor={{ stroke: "#DEE2E6", strokeDasharray: "3 3" }}
            contentStyle={{
              borderRadius: 10,
              border: "1px solid #E9ECEF",
              fontSize: 12,
            }}
            formatter={(value: number, name) => {
              if (name === "price") return [`${value.toLocaleString()}원`, "가격"];
              return [`${value.toLocaleString()}t`, "거래량"];
            }}
            labelFormatter={(l) => `날짜 ${l}`}
          />
          <Bar
            yAxisId="vol"
            dataKey="volume"
            fill="#B7E4B7"
            radius={[2, 2, 0, 0]}
            barSize={8}
          />
          <Line
            yAxisId="price"
            type="monotone"
            dataKey="price"
            stroke="#3A8A3A"
            strokeWidth={2.2}
            dot={false}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
