import { memo } from "react";
import {
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PredictionPoint } from "../types";

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ payload: PredictionPoint }>;
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-lg border border-[#E9ECEF] bg-white/95 px-2.5 py-1.5 text-[11px] shadow-sm">
      <div className="font-semibold text-foreground">{label}</div>
      {p.actualPrice !== undefined && (
        <div className="text-[#495057]">
          실제 {p.actualPrice.toLocaleString()}원
        </div>
      )}
      {p.predictedPrice !== undefined && !p.isToday && (
        <div className="text-[#2E9E6B]">
          예측 {p.predictedPrice.toLocaleString()}원
        </div>
      )}
    </div>
  );
}

function PredictionChartBase({
  points,
}: {
  points: PredictionPoint[];
}) {
  const todayPoint = points.find((p) => p.isToday);
  const recommended = points.find((p) => p.isRecommendedDate);

  const futurePrices = points
    .filter((p) => p.predictedPrice !== undefined && !p.isToday)
    .map((p) => p.predictedPrice!);
  const hasFuture = futurePrices.length > 0;
  const maxP = hasFuture ? Math.max(...futurePrices) : 0;
  const minP = hasFuture ? Math.min(...futurePrices) : 0;
  const avgP = hasFuture
    ? Math.round(futurePrices.reduce((s, v) => s + v, 0) / futurePrices.length)
    : 0;

  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={points}
          margin={{ top: 16, right: 56, left: 0, bottom: 4 }}
        >
          <CartesianGrid stroke="#F1F3F5" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: "#868E96" }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
            minTickGap={16}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#868E96" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => v.toLocaleString()}
            domain={["auto", "auto"]}
            width={44}
          />
          <Tooltip
            cursor={{ stroke: "#ADB5BD", strokeDasharray: "3 3" }}
            content={<CustomTooltip />}
          />
          {todayPoint && (
            <ReferenceLine
              x={todayPoint.label}
              stroke="#ADB5BD"
              strokeDasharray="3 3"
              label={{
                value: "오늘",
                position: "top",
                fill: "#495057",
                fontSize: 10,
              }}
            />
          )}
          {hasFuture && (
            <>
              <ReferenceLine
                y={maxP}
                stroke="#E03B3B"
                strokeDasharray="2 3"
                strokeOpacity={0.5}
                label={{
                  value: `최고 ${maxP.toLocaleString()}`,
                  position: "right",
                  fill: "#E03B3B",
                  fontSize: 10,
                  fontWeight: 700,
                }}
              />
              <ReferenceLine
                y={minP}
                stroke="#1971C2"
                strokeDasharray="2 3"
                strokeOpacity={0.5}
                label={{
                  value: `최저 ${minP.toLocaleString()}`,
                  position: "right",
                  fill: "#1971C2",
                  fontSize: 10,
                  fontWeight: 700,
                }}
              />
              <ReferenceLine
                y={avgP}
                stroke="#6C757D"
                strokeDasharray="2 3"
                strokeOpacity={0.5}
                label={{
                  value: `평균 ${avgP.toLocaleString()}`,
                  position: "right",
                  fill: "#6C757D",
                  fontSize: 10,
                  fontWeight: 700,
                }}
              />
            </>
          )}
          <Line
            type="monotone"
            dataKey="actualPrice"
            stroke="#E03B3B"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="predictedPrice"
            stroke="#2E9E6B"
            strokeWidth={2}
            strokeDasharray="5 4"
            dot={false}
            isAnimationActive={false}
            connectNulls={false}
          />
          {recommended && recommended.predictedPrice !== undefined && (
            <ReferenceDot
              x={recommended.label}
              y={recommended.predictedPrice}
              r={5}
              fill="#2E9E6B"
              stroke="#fff"
              strokeWidth={2}
              label={{
                value: "추천",
                position: "top",
                fill: "#2E9E6B",
                fontSize: 10,
                fontWeight: 700,
              }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
      <div className="mt-2 flex items-center justify-center gap-4 text-[11px] text-[#6C757D]">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 bg-[#E03B3B]" /> 실제 가격
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 border-t-2 border-dashed border-[#2E9E6B]" />{" "}
          예측 가격
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-[#2E9E6B]" />{" "}
          추천일
        </span>
      </div>
    </div>
  );
}

export const PredictionChart = memo(PredictionChartBase);

