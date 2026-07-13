import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceArea,
  ReferenceLine,
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
const TEAL_BG = "rgba(46,158,107,0.05)";

export type PredictionInput = {
  /** future points appended after `todayLabel`; label used as X axis tick */
  points: { label: string; price: number }[];
  /** index (in prediction points) of recommended day; renders dot marker */
  recommendedIdx?: number;
};

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
  prediction,
}: {
  series: PriceVolumeSeries;
  period: Period;
  prediction?: PredictionInput;
}) {
  const historyLen = series.points.length;
  const lastHistory = series.points[historyLen - 1];

  // Combined data: history has price+volume; prediction has forecast only.
  const historyData = series.points.map((p, i) => ({
    ...p,
    i,
    forecast: undefined as number | undefined,
    isForecast: false,
  }));

  const predictionData = prediction
    ? prediction.points.map((p, k) => ({
        label: p.label,
        tooltipLabel: p.label,
        price: undefined as number | undefined,
        volume: undefined as number | undefined,
        forecast: p.price,
        i: historyLen + k,
        isForecast: true,
      }))
    : [];

  // Bridge point: duplicate the last history point into the forecast series so
  // the dashed line starts exactly where the solid line ends (no gap).
  const bridge =
    prediction && lastHistory
      ? [
          {
            label: lastHistory.label,
            tooltipLabel: (lastHistory as any).tooltipLabel ?? lastHistory.label,
            price: undefined,
            volume: undefined,
            forecast: lastHistory.price,
            i: historyLen - 1,
            isForecast: true,
          } as (typeof predictionData)[number],
        ]
      : [];

  const data = [...historyData, ...bridge, ...predictionData];
  const keep = xTickFilter(period, historyLen);
  const todayLabel = lastHistory?.label;
  const forecastStartLabel = prediction?.points[0]?.label;
  const forecastEndLabel = prediction?.points[prediction.points.length - 1]?.label;

  const recommended =
    prediction && prediction.recommendedIdx != null
      ? prediction.points[prediction.recommendedIdx]
      : undefined;

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
            tickFormatter={(v, i) => {
              if (i < historyLen) return keep(i) ? String(v) : "";
              // forecast ticks: show first + last only
              if (v === forecastStartLabel || v === forecastEndLabel) return String(v);
              return "";
            }}
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

          {/* Forecast background band */}
          {prediction && forecastStartLabel && forecastEndLabel && (
            <ReferenceArea
              yAxisId="price"
              x1={forecastStartLabel}
              x2={forecastEndLabel}
              fill={TEAL}
              fillOpacity={0.05}
              stroke="none"
            />
          )}

          {/* Today vertical reference */}
          {prediction && todayLabel && (
            <ReferenceLine
              yAxisId="price"
              x={todayLabel}
              stroke="#ADB5BD"
              strokeDasharray="3 3"
              label={{
                value: "오늘",
                position: "top",
                fontSize: 10,
                fill: "#6C757D",
              }}
            />
          )}

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
            connectNulls={false}
          />

          {prediction && (
            <Line
              yAxisId="price"
              type="monotone"
              dataKey="forecast"
              stroke={TEAL}
              strokeWidth={2.4}
              strokeDasharray="5 4"
              dot={(props: any) => {
                if (!recommended) return <g key={props.index} />;
                if (props.payload?.label === recommended.label) {
                  return (
                    <circle
                      key={props.index}
                      cx={props.cx}
                      cy={props.cy}
                      r={4.5}
                      fill={TEAL}
                      stroke="#fff"
                      strokeWidth={2}
                    />
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
