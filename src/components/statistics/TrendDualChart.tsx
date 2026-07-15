import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TooltipProps } from "recharts";
import { cn } from "@/lib/utils";

const VOLUME_BAR = "#A7B4E0";
const GRID = "#F1F3F5";
const AXIS_LABEL = "#ADB5BD";

export type TrendChartSeries = {
  id: string;
  label: string;
  color: string;
  disabled?: boolean;
};

export type TrendChartPoint = {
  label: string;
  volume: number;
} & Record<string, string | number>;

/**
 * Dual chart: multi-line price (kg avg) on top + total volume bars below,
 * sharing the same x-axis. Custom tooltip shows all series sorted price-desc.
 * `view` toggles which panels are visible.
 */
export function TrendDualChart({
  points,
  series,
  unitLabel = "원/kg",
  view = "both",
}: {
  points: TrendChartPoint[];
  series: TrendChartSeries[];
  unitLabel?: string;
  view?: "both" | "price" | "volume";
}) {
  const showPrice = view === "both" || view === "price";
  const showVolume = view === "both" || view === "volume";
  return (
    <div className="w-full">
      {showPrice && (
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={points} margin={{ top: 8, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid stroke={GRID} vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: AXIS_LABEL }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
              minTickGap={20}
            />
            <YAxis
              tick={{ fontSize: 11, fill: AXIS_LABEL }}
              axisLine={false}
              tickLine={false}
              width={44}
              tickFormatter={(v: number) => v.toLocaleString()}
            />
            <Tooltip
              cursor={{ stroke: "#3A8A3A", strokeWidth: 1.2, strokeDasharray: "3 3" }}
              content={<PriceTooltip series={series} points={points} unitLabel={unitLabel} />}
            />
            {series.map((s) => (
              <Line
                key={s.id}
                type="monotone"
                dataKey={s.id}
                stroke={s.color}
                strokeWidth={s.id === "all" || s.id === "2026" ? 2.4 : 1.8}
                strokeOpacity={s.disabled ? 0.25 : 1}
                dot={{ r: 2.6, strokeWidth: 0, fill: s.color }}
                activeDot={{ r: 3.8 }}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      )}

      {showVolume && (
      <div className="h-[80px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={points} margin={{ top: 4, right: 10, left: 0, bottom: 4 }}>
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: "#868E96" }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
              minTickGap={20}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#868E96" }}
              axisLine={false}
              tickLine={false}
              width={44}
              tickFormatter={(v: number) => `${v}t`}
            />
            <Tooltip
              cursor={{ fill: "#F1F3F5" }}
              contentStyle={{ borderRadius: 8, border: "1px solid #E9ECEF", fontSize: 11 }}
              formatter={(value: number) => [`${value}t`, "물량"]}
              labelFormatter={(l) => `${l}`}
            />
            <Bar dataKey="volume" fill="#CED4DA" radius={[2, 2, 0, 0]} barSize={8} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      )}

      {/* Legend */}
      <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 px-1">
        {series.map((s) => (
          <li
            key={s.id}
            className={cn(
              "inline-flex items-center gap-1.5 text-[11.5px]",
              s.disabled ? "text-[#ADB5BD]" : "text-[#495057]",
            )}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: s.color, opacity: s.disabled ? 0.4 : 1 }}
            />
            {s.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

function PriceTooltip({
  active,
  payload,
  label,
  series,
  points,
  unitLabel,
}: TooltipProps<number, string> & {
  series: TrendChartSeries[];
  points: TrendChartPoint[];
  unitLabel: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const rows = series
    .map((s) => {
      const entry = payload.find((p) => p.dataKey === s.id);
      const value = typeof entry?.value === "number" ? entry.value : undefined;
      return { s, value };
    })
    .filter((r): r is { s: TrendChartSeries; value: number } => typeof r.value === "number")
    .sort((a, b) => b.value - a.value);
  const point = points.find((p) => p.label === label);
  const volume = point?.volume;
  return (
    <div className="rounded-[10px] border border-[#E9ECEF] bg-white px-3 py-2 text-[11.5px] shadow-lg">
      <div className="mb-1 text-[10.5px] font-semibold text-[#868E96]">{label}</div>
      <ul className="space-y-0.5">
        {rows.map(({ s, value }) => (
          <li key={s.id} className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: s.color, opacity: s.disabled ? 0.4 : 1 }}
              />
              <span className={cn("font-semibold", s.disabled && "text-[#ADB5BD]")}>{s.label}</span>
            </span>
            <span className="font-bold tabular-nums text-foreground">
              {value.toLocaleString()}
              <span className="ml-0.5 text-[10px] font-medium text-[#868E96]">{unitLabel}</span>
            </span>
          </li>
        ))}
      </ul>
      {volume !== undefined && (
        <div className="mt-1.5 border-t border-[#F1F3F5] pt-1 text-[10.5px] text-[#6C757D]">
          총 물량 {volume}t
        </div>
      )}
    </div>
  );
}
