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
import type { PriceVolumeSeries } from "@/lib/mock/market-analysis";

type Period = "today" | "1w" | "1m" | "3m" | "1y";

const RED = "#E03131";
const PINK = "rgba(224,49,49,0.18)";

function xTickFilter(period: Period, points: number): (i: number) => boolean {
  if (period === "today") {
    const keep = new Set([0, 4, 8, 12, 16, 23]);
    return (i) => keep.has(i);
  }
  if (period === "3m") return (i) => i % 7 === 0 || i === points - 1;
  if (period === "1m") return (i) => i % 5 === 0 || i === points - 1;
  return () => true;
}

export function PriceVolumeChart({
  series,
  period,
}: {
  series: PriceVolumeSeries;
  period: Period;
}) {
  const data = series.points.map((p, i) => ({ ...p, i }));
  const keep = xTickFilter(period, data.length);

  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 12, right: 8, left: 0, bottom: 4 }}>
          <CartesianGrid stroke="#F1F3F5" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "#868E96" }}
            axisLine={false}
            tickLine={false}
            interval={0}
            tickFormatter={(v, i) => (keep(i) ? String(v) : "")}
          />
          <YAxis
            yAxisId="price"
            orientation="left"
            tick={{ fontSize: 11, fill: "#868E96" }}
            axisLine={false}
            tickLine={false}
            width={48}
            tickFormatter={(v: number) => v.toLocaleString()}
            domain={["auto", "auto"]}
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
            cursor={{ stroke: "#ADB5BD", strokeDasharray: "3 3" }}
            content={<CustomTooltip />}
          />
          <Bar
            yAxisId="vol"
            dataKey="volume"
            fill={PINK}
            radius={[2, 2, 0, 0]}
            barSize={period === "today" ? 6 : 8}
            isAnimationActive={false}
          />
          <Line
            yAxisId="price"
            type="monotone"
            dataKey="price"
            stroke={RED}
            strokeWidth={2.4}
            dot={false}
            activeDot={{ r: 4, fill: RED, stroke: "#fff", strokeWidth: 2 }}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload || payload.length === 0) return null;
  const pt = payload[0].payload;
  return (
    <div className="rounded-[10px] border border-[#E9ECEF] bg-white px-3 py-2 shadow-md">
      <div className="text-[12px] font-bold text-foreground">{pt.tooltipLabel}</div>
      <div className="mt-0.5 text-[11.5px] text-[#E03131]/70">
        거래량 : {pt.volume.toLocaleString()}
      </div>
      <div className="text-[12px] font-bold text-[#E03131]">
        가격 : {pt.price.toLocaleString()}원
      </div>
    </div>
  );
}
