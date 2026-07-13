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

type Row = { label: string; date: string; price: number; volume: number };

export function PriceVolumeChart({ data }: { data: Row[] }) {
  return (
    <div className="h-[240px] w-full px-2">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 12, right: 8, left: 0, bottom: 4 }}>
          <CartesianGrid stroke="var(--color-chart-grid)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
            minTickGap={20}
          />
          <YAxis
            yAxisId="price"
            orientation="left"
            tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
            axisLine={false}
            tickLine={false}
            width={44}
            tickFormatter={(v) => v.toLocaleString()}
          />
          <YAxis
            yAxisId="vol"
            orientation="right"
            tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
            axisLine={false}
            tickLine={false}
            width={32}
          />
          <Tooltip
            cursor={{ stroke: "var(--color-chart-grid)", strokeDasharray: "3 3" }}
            contentStyle={{
              borderRadius: 10,
              border: "1px solid var(--color-border)",
              fontSize: 12,
            }}
            itemSorter={(item) => (item.dataKey === "price" ? 0 : 1)}
            formatter={(value: number, name) => {
              if (name === "price") return [`${value.toLocaleString()}원`, "평균가"];
              return [`${value.toLocaleString()}t`, "거래량"];
            }}
            labelFormatter={(l) => `${l}`}
          />

          <Bar
            yAxisId="vol"
            dataKey="volume"
            fill="var(--color-chart-volume)"
            radius={[2, 2, 0, 0]}
            barSize={6}
          />
          <Line
            yAxisId="price"
            type="monotone"
            dataKey="price"
            stroke="var(--color-chart-price)"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
