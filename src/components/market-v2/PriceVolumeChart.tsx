import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Customized,
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
const TEAL = "#2E9E6B";

const BAR_SIZE_BY_PERIOD: Record<Period, number> = {
  today: 6,
  "1w": 12,
  "1m": 4,
  "3m": 7,
  "1y": 8,
};

export type PredictionInput = {
  /** future points appended after `todayLabel`; label used as X axis tick */
  points: { label: string; tooltipLabel?: string; price: number }[];
  /** index (in prediction points) of recommended day; renders dot marker */
  recommendedIdx?: number;
  /** badge text drawn above the recommended dot, e.g. "추천 7/16" */
  recommendedBadge?: string;
};

function ForecastBackground({
  xAxisMap,
  offset,
  todayLabel,
  lastForecastLabel,
}: {
  xAxisMap?: Record<string, any>;
  offset?: { top: number; left: number; width: number; height: number };
  todayLabel: string;
  lastForecastLabel: string;
}) {
  if (!xAxisMap || !offset) return null;
  const xAxis = xAxisMap["main"] ?? Object.values(xAxisMap)[0];
  if (!xAxis?.scale) return null;
  const scale = xAxis.scale;
  const centerOf = (label: string): number | null => {
    const v = scale(label);
    if (typeof v !== "number" || Number.isNaN(v)) return null;
    const bw = typeof scale.bandwidth === "function" ? scale.bandwidth() : 0;
    return v + bw / 2;
  };
  const xToday = centerOf(todayLabel);
  const xEnd = centerOf(lastForecastLabel);
  if (xToday == null || xEnd == null) return null;
  const top = offset.top;
  const bottom = offset.top + offset.height;
  const right = Math.max(xToday, xEnd);
  const left = Math.min(xToday, xEnd);
  return (
    <g style={{ pointerEvents: "none" }}>
      <rect
        x={left}
        y={top}
        width={Math.max(0, right - left)}
        height={Math.max(0, bottom - top)}
        fill="#2E9E6B"
        fillOpacity={0.15}
      />
    </g>
  );
}

function TodayAxis({
  xAxisMap,
  offset,
  todayLabel,
}: {
  xAxisMap?: Record<string, any>;
  offset?: { top: number; left: number; width: number; height: number };
  todayLabel: string;
}) {
  if (!xAxisMap || !offset) return null;
  const xAxis = xAxisMap["main"] ?? Object.values(xAxisMap)[0];
  if (!xAxis?.scale) return null;
  const scale = xAxis.scale;
  const v = scale(todayLabel);
  if (typeof v !== "number" || Number.isNaN(v)) return null;
  const bw = typeof scale.bandwidth === "function" ? scale.bandwidth() : 0;
  const xToday = v + bw / 2;
  const top = offset.top;
  const bottom = offset.top + offset.height;
  return (
    <g style={{ pointerEvents: "none" }}>
      <line
        x1={xToday}
        x2={xToday}
        y1={top}
        y2={bottom}
        stroke="#64748B"
        strokeWidth={1.25}
        strokeDasharray="4 3"
      />
      <rect
        x={xToday - 16}
        y={top - 16}
        width={32}
        height={14}
        rx={7}
        ry={7}
        fill="#64748B"
      />
      <text
        x={xToday}
        y={top - 6}
        textAnchor="middle"
        fontSize={10}
        fontWeight={800}
        fill="#fff"
      >
        오늘
      </text>
    </g>
  );
}


export function PriceVolumeChart({
  series,
  period,
  prediction,
  ticks,
}: {
  series: PriceVolumeSeries;
  period: Period;
  prediction?: PredictionInput;
  /** explicit list of X-axis labels to render (max 5-6). */
  ticks?: string[];
}) {
  const historyLen = series.points.length;
  const lastHistory = series.points[historyLen - 1];

  // Merge forecast into the last history point so the dashed line begins where
  // the solid line ends without introducing a duplicate X-axis label.
  const historyData = series.points.map((p, i) => ({
    ...p,
    i,
    forecast:
      prediction && i === historyLen - 1 ? p.price : (undefined as number | undefined),
    isForecast: false,
  }));

  const predictionData = prediction
    ? prediction.points.map((p, k) => ({
        label: p.label,
        tooltipLabel: p.tooltipLabel ?? p.label,
        price: undefined as number | undefined,
        volume: undefined as number | undefined,
        forecast: p.price,
        i: historyLen + k,
        isForecast: true,
      }))
    : [];

  const data = [...historyData, ...predictionData];
  const todayLabel = lastHistory?.label;
  const lastForecastLabel = prediction?.points[prediction.points.length - 1]?.label;
  const canRenderForecast = !!prediction && !!todayLabel && !!lastForecastLabel;

  // Build the explicit tick list. Prefer caller-supplied ticks; fall back to a
  // sensible default that never exceeds ~6 labels.
  const computedTicks: string[] = (() => {
    if (ticks && ticks.length > 0) return ticks;
    if (period === "today") {
      return ["00시", "06시", "12시", "18시", "23시"].filter((l) =>
        data.some((d) => d.label === l),
      );
    }
    const hist = historyData.map((d) => d.label);
    const fcst = predictionData.map((d) => d.label);
    const t: string[] = [];
    if (hist.length) t.push(hist[0]);
    if (hist.length > 2) t.push(hist[Math.floor(hist.length / 2)]);
    if (hist.length > 1) t.push(hist[hist.length - 1]);
    if (fcst.length > 1) t.push(fcst[Math.floor(fcst.length / 2)]);
    if (fcst.length) t.push(fcst[fcst.length - 1]);
    return Array.from(new Set(t));
  })();

  const recommended =
    prediction && prediction.recommendedIdx != null
      ? prediction.points[prediction.recommendedIdx]
      : undefined;

  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 36, right: 12, left: 0, bottom: 4 }}>
          <CartesianGrid stroke="#F1F3F5" vertical={false} />
          {canRenderForecast && (
            <Customized
              component={(props: any) => (
                <ForecastBackground
                  {...props}
                  todayLabel={todayLabel!}
                  lastForecastLabel={lastForecastLabel!}
                />
              )}
            />
          )}


          <XAxis
            xAxisId="main"
            dataKey="label"
            tick={{ fontSize: 11, fill: "#868E96" }}
            axisLine={false}
            tickLine={false}
            ticks={computedTicks}
            interval={0}
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
          <Tooltip cursor={false} content={<CustomTooltip />} />

          <Bar
            xAxisId="main"
            yAxisId="vol"
            dataKey="volume"
            fill={PINK}
            radius={[2, 2, 0, 0]}
            barSize={BAR_SIZE_BY_PERIOD[period]}
            isAnimationActive={false}
          />
          <Line
            xAxisId="main"
            yAxisId="price"
            type="monotone"
            dataKey="price"
            stroke={RED}
            strokeWidth={2.4}
            dot={false}
            activeDot={{ r: 4, fill: RED, stroke: "#fff", strokeWidth: 2 }}
            isAnimationActive={false}
            connectNulls={false}
          />

          {prediction && (
            <Line
              xAxisId="main"
              yAxisId="price"
              type="monotone"
              dataKey="forecast"
              stroke={TEAL}
              strokeWidth={2.4}
              strokeDasharray="5 4"
              dot={(props: any) => {
                if (!recommended) return <g key={props.index} />;
                if (props.payload?.label === recommended.label) {
                  const badge = prediction?.recommendedBadge ?? `추천 ${recommended.label}`;
                  const charW = 7.2;
                  const padX = 8;
                  const w = Math.round(badge.length * charW + padX * 2);
                  const h = 20;
                  const bx = props.cx - w / 2;
                  const by = props.cy - h - 12;
                  return (
                    <g key={props.index}>
                      <rect
                        x={bx}
                        y={by}
                        width={w}
                        height={h}
                        rx={10}
                        ry={10}
                        fill={TEAL}
                      />
                      <text
                        x={props.cx}
                        y={by + h / 2 + 3.5}
                        textAnchor="middle"
                        fontSize={10.5}
                        fontWeight={800}
                        fill="#fff"
                      >
                        {badge}
                      </text>
                      <circle
                        cx={props.cx}
                        cy={props.cy}
                        r={5}
                        fill={TEAL}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    </g>
                  );
                }
                return <g key={props.index} />;
              }}
              activeDot={{ r: 4, fill: TEAL, stroke: "#fff", strokeWidth: 2 }}
              isAnimationActive={false}
              connectNulls={false}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload || payload.length === 0) return null;
  const pt = payload[0].payload;
  const isForecast = pt.isForecast;
  return (
    <div className="rounded-[10px] border border-[#E9ECEF] bg-white px-3 py-2 shadow-md">
      {isForecast ? (
        <>
          <div className="text-[12px] font-bold text-[#2E9E6B]">
            {pt.tooltipLabel} · AI 예측
          </div>
          <div className="mt-0.5 text-[12px] font-bold text-[#2E9E6B]">
            예상 평균가 {pt.forecast?.toLocaleString()}원
          </div>
        </>
      ) : (
        <>
          <div className="text-[12px] font-bold text-foreground">{pt.tooltipLabel}</div>
          <div className="mt-0.5 text-[12px] font-bold text-[#E03131]">
            평균가 {pt.price.toLocaleString()}원
          </div>
          <div className="text-[11.5px] text-[#495057]">
            거래량 {pt.volume.toLocaleString()}t
          </div>
        </>
      )}
    </div>
  );
}
