import { memo } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Customized,
  Line,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PredictionPoint } from "../types";

const RED = "#E03B3B";
const PINK = "rgba(224,59,59,0.20)";
const TEAL = "#2E9E6B";
const BLUE = "#1971C2";
const GREY = "#94A3B8";

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ payload: PredictionPoint & { pastVolume?: number } }>;
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const p = payload[0].payload;
  const isForecast = p.predictedPrice !== undefined && !p.isToday && p.actualPrice === undefined;
  return (
    <div className="rounded-[10px] border border-[#E9ECEF] bg-white px-3 py-2 shadow-md">
      <div className={`text-[12px] font-bold ${isForecast ? "text-[#2E9E6B]" : "text-foreground"}`}>
        {label}
        {isForecast ? " · AI 예측" : ""}
      </div>
      {p.actualPrice !== undefined && (
        <div className="mt-0.5 text-[12px] font-bold text-[#E03B3B]">
          평균가 {p.actualPrice.toLocaleString()}원
        </div>
      )}
      {p.pastVolume !== undefined && p.actualPrice !== undefined && (
        <div className="text-[11.5px] text-[#495057]">
          거래량 {p.pastVolume.toLocaleString()}t
        </div>
      )}
      {isForecast && p.predictedPrice !== undefined && (
        <div className="mt-0.5 text-[12px] font-bold text-[#2E9E6B]">
          예상 평균가 {p.predictedPrice.toLocaleString()}원
        </div>
      )}
    </div>
  );
}

function ForecastOverlay({
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
  const left = Math.min(xToday, xEnd);
  const right = Math.max(xToday, xEnd);
  return (
    <g style={{ pointerEvents: "none" }}>
      <rect
        x={left}
        y={top}
        width={Math.max(0, right - left)}
        height={Math.max(0, bottom - top)}
        fill={TEAL}
        fillOpacity={0.07}
      />
      <line
        x1={xToday}
        x2={xToday}
        y1={top}
        y2={bottom}
        stroke={GREY}
        strokeWidth={1}
        strokeDasharray="3 3"
      />
      <text
        x={xToday}
        y={top - 4}
        textAnchor="middle"
        fontSize={10}
        fontWeight={700}
        fill="#64748B"
      >
        오늘
      </text>
    </g>
  );
}

function PredictionChartBase({ points }: { points: PredictionPoint[] }) {
  const todayIdx = points.findIndex((p) => p.isToday);
  const todayPoint = todayIdx >= 0 ? points[todayIdx] : undefined;
  const recommended = points.find((p) => p.isRecommendedDate);

  // Deterministic synthetic volume for past points only (mock lacks volume).
  const data = points.map((p, i) => {
    const isPast = todayIdx < 0 || i <= todayIdx;
    const seed = (i * 9301 + 49297) % 233280;
    const pastVolume = isPast && p.actualPrice !== undefined
      ? Math.round(120 + (seed / 233280) * 220)
      : undefined;
    return { ...p, pastVolume };
  });

  const futurePrices = points
    .filter((p) => p.predictedPrice !== undefined && !p.isToday)
    .map((p) => p.predictedPrice!);
  const hasFuture = futurePrices.length > 0;
  const maxP = hasFuture ? Math.max(...futurePrices) : 0;
  const minP = hasFuture ? Math.min(...futurePrices) : 0;
  const maxPoint = hasFuture
    ? points.find((p) => p.predictedPrice === maxP && !p.isToday)
    : undefined;
  const minPoint = hasFuture
    ? points.find((p) => p.predictedPrice === minP && !p.isToday)
    : undefined;

  const todayLabel = todayPoint?.label;
  const lastForecastLabel = points[points.length - 1]?.label;
  const canRenderForecast = !!todayLabel && !!lastForecastLabel && hasFuture;

  // Build explicit sparse tick list — past start, past mid, today, forecast
  // mid, recommended, last forecast — deduped.
  const ticks: string[] = (() => {
    const t: string[] = [];
    if (points.length) t.push(points[0].label);
    const pastEndIdx = todayIdx >= 0 ? todayIdx : points.length - 1;
    if (pastEndIdx >= 2) t.push(points[Math.floor(pastEndIdx / 2)].label);
    if (todayPoint) t.push(todayPoint.label);
    const futureStart = pastEndIdx + 1;
    const futureEnd = points.length - 1;
    if (futureEnd > futureStart) {
      const mid = Math.floor((futureStart + futureEnd) / 2);
      t.push(points[mid].label);
    }
    if (recommended) t.push(recommended.label);
    if (futureEnd >= 0 && points[futureEnd]) t.push(points[futureEnd].label);
    return Array.from(new Set(t));
  })();

  const recommendedLabel = recommended?.label;

  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 28, right: 12, left: 0, bottom: 4 }}>
          <CartesianGrid stroke="#F1F3F5" vertical={false} />
          {canRenderForecast && (
            <Customized
              component={(props: any) => (
                <ForecastOverlay
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
            tick={(props: any) => {
              const { x, y, payload } = props;
              const isRecommended = payload.value === recommendedLabel;
              return (
                <text
                  x={x}
                  y={y + 10}
                  textAnchor="middle"
                  fontSize={10.5}
                  fontWeight={isRecommended ? 800 : 400}
                  fill={isRecommended ? TEAL : "#868E96"}
                >
                  {payload.value}
                </text>
              );
            }}
            axisLine={false}
            tickLine={false}
            ticks={ticks}
            interval={0}
          />
          <YAxis
            yAxisId="price"
            tick={{ fontSize: 10, fill: "#868E96" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => v.toLocaleString()}
            domain={["auto", "auto"]}
            width={44}
          />
          <YAxis
            yAxisId="vol"
            orientation="right"
            tick={{ fontSize: 10, fill: "#868E96" }}
            axisLine={false}
            tickLine={false}
            width={28}
          />
          <Tooltip cursor={false} content={<CustomTooltip />} />

          <Bar
            xAxisId="main"
            yAxisId="vol"
            dataKey="pastVolume"
            fill={PINK}
            radius={[2, 2, 0, 0]}
            barSize={8}
            isAnimationActive={false}
          />
          <Line
            xAxisId="main"
            yAxisId="price"
            type="monotone"
            dataKey="actualPrice"
            stroke={RED}
            strokeWidth={2.4}
            dot={false}
            activeDot={{ r: 4, fill: RED, stroke: "#fff", strokeWidth: 2 }}
            isAnimationActive={false}
            connectNulls={false}
          />
          <Line
            xAxisId="main"
            yAxisId="price"
            type="monotone"
            dataKey="predictedPrice"
            stroke={TEAL}
            strokeWidth={2.4}
            strokeDasharray="5 4"
            dot={false}
            activeDot={{ r: 4, fill: TEAL, stroke: "#fff", strokeWidth: 2 }}
            isAnimationActive={false}
            connectNulls={false}
          />

          {maxPoint && (
            <ReferenceDot
              xAxisId="main"
              yAxisId="price"
              x={maxPoint.label}
              y={maxP}
              r={3}
              fill={RED}
              stroke="#fff"
              strokeWidth={1.5}
              label={{
                value: `최고 ${maxP.toLocaleString()}`,
                position: "top",
                fill: RED,
                fontSize: 10,
                fontWeight: 800,
              }}
            />
          )}
          {minPoint && minPoint.label !== maxPoint?.label && (
            <ReferenceDot
              xAxisId="main"
              yAxisId="price"
              x={minPoint.label}
              y={minP}
              r={3}
              fill={BLUE}
              stroke="#fff"
              strokeWidth={1.5}
              label={{
                value: `최저 ${minP.toLocaleString()}`,
                position: "bottom",
                fill: BLUE,
                fontSize: 10,
                fontWeight: 800,
              }}
            />
          )}

          {recommended && recommended.predictedPrice !== undefined && (
            <ReferenceDot
              xAxisId="main"
              yAxisId="price"
              x={recommended.label}
              y={recommended.predictedPrice}
              r={5}
              fill={TEAL}
              stroke="#fff"
              strokeWidth={2}
              label={{
                value: `추천 ${recommended.label}`,
                position: "top",
                fill: "#fff",
                fontSize: 10,
                fontWeight: 800,
                offset: 12,
              }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
      <div className="mt-2 flex items-center justify-center gap-4 text-[11px] text-[#6C757D]">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 bg-[#E03B3B]" /> 실제 평균가
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 border-t-2 border-dashed border-[#2E9E6B]" />{" "}
          AI 예측
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2 w-3 rounded-sm bg-[rgba(224,59,59,0.35)]" />{" "}
          거래량
        </span>
      </div>
    </div>
  );
}

export const PredictionChart = memo(PredictionChartBase);
