import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Customized,
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


function MinMaxPills({
  formattedGraphicalItems,
  points,
  recommendedLabel,
}: {
  formattedGraphicalItems?: any[];
  points: { label: string; value: number }[];
  recommendedLabel?: string;
}) {
  if (!formattedGraphicalItems || points.length === 0) return null;
  // Build a label → {x,y} map by merging both price + forecast Line items.
  const coord = new Map<string, { x: number; y: number }>();
  for (const item of formattedGraphicalItems) {
    const pts = item?.props?.points as
      | { x: number; y: number; payload?: { label?: string } }[]
      | undefined;
    if (!pts) continue;
    for (const p of pts) {
      const label = p?.payload?.label;
      if (!label || typeof p.x !== "number" || typeof p.y !== "number") continue;
      if (!coord.has(label)) coord.set(label, { x: p.x, y: p.y });
    }
  }
  if (coord.size === 0) return null;

  let maxP = points[0];
  let minP = points[0];
  for (const p of points) {
    if (p.value > maxP.value) maxP = p;
    if (p.value < minP.value) minP = p;
  }

  const pill = (
    key: string,
    x: number,
    y: number,
    text: string,
    color: string,
    below: boolean,
  ) => {
    const w = Math.round(text.length * 6.5 + 14);
    const h = 16;
    const yy = below ? y + 14 : y - 22;
    return (
      <g key={key}>
        <rect
          x={x - w / 2}
          y={yy}
          width={w}
          height={h}
          rx={8}
          ry={8}
          fill="#fff"
          stroke={color}
          strokeWidth={1}
        />
        <text
          x={x}
          y={yy + h / 2 + 3.5}
          textAnchor="middle"
          fontSize={9.5}
          fontWeight={800}
          fill={color}
        >
          {text}
        </text>
      </g>
    );
  };

  const maxC = coord.get(maxP.label);
  const minC = coord.get(minP.label);
  const maxNearRec = recommendedLabel != null && maxP.label === recommendedLabel;

  return (
    <g style={{ pointerEvents: "none" }}>
      {maxC && pill("max", maxC.x, maxC.y, `최고 ${maxP.value.toLocaleString()}`, "#E03131", maxNearRec)}
      {minC && pill("min", minC.x, minC.y, `최저 ${minP.value.toLocaleString()}`, "#1971C2", true)}
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
  const todayIndex = historyLen - 1;
  const lastIndex = data.length - 1;
  const todayLabel = lastHistory?.label;
  const lastForecastLabel = prediction?.points[prediction.points.length - 1]?.label;
  const canRenderForecast = !!prediction && !!todayLabel && !!lastForecastLabel;

  // Use numeric X coordinates so forecast references always resolve reliably.
  const tickIndices: number[] = (() => {
    if (ticks && ticks.length > 0) {
      return Array.from(
        new Set(
          ticks
            .map((label) => data.findIndex((point) => point.label === label))
            .filter((index) => index >= 0),
        ),
      ).sort((a, b) => a - b);
    }

    const indices = new Set<number>();
    if (data.length > 0) indices.add(0);
    if (historyLen > 2) indices.add(Math.floor((historyLen - 1) / 2));
    if (todayIndex >= 0) indices.add(todayIndex);
    if (lastIndex > todayIndex) {
      indices.add(Math.floor((todayIndex + lastIndex) / 2));
      indices.add(lastIndex);
    }
    return Array.from(indices).sort((a, b) => a - b);
  })();

  const recommended =
    prediction && prediction.recommendedIdx != null
      ? prediction.points[prediction.recommendedIdx]
      : undefined;

  const pillPoints = [
    ...series.points.map((p) => ({ label: p.label, value: p.price })),
    ...(prediction?.points.map((p) => ({ label: p.label, value: p.price })) ?? []),
  ];



  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 36, right: 12, left: 0, bottom: 4 }}>
          <CartesianGrid stroke="#F1F3F5" vertical={false} />

          <XAxis
            xAxisId="main"
            dataKey="i"
            type="number"
            domain={[0, Math.max(0, lastIndex)]}
            ticks={tickIndices}
            tickFormatter={(index: number) => data[index]?.label ?? ""}
            tick={{ fontSize: 11, fill: "#868E96" }}
            axisLine={false}
            tickLine={false}
            interval={0}
            allowDecimals={false}
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

          {canRenderForecast && (
            <ReferenceArea
              xAxisId="main"
              yAxisId="price"
              x1={todayIndex}
              x2={lastIndex}
              fill={TEAL}
              fillOpacity={0.08}
              stroke="none"
              ifOverflow="extendDomain"
            />
          )}
          {canRenderForecast && (
            <ReferenceLine
              xAxisId="main"
              yAxisId="price"
              x={todayIndex}
              stroke="#64748B"
              strokeDasharray="4 3"
              strokeWidth={1.25}
              label={{
                value: "오늘",
                position: "top",
                fill: "#64748B",
                fontSize: 10,
                fontWeight: 800,
              }}
            />
          )}

          <Tooltip
            cursor={false}
            labelFormatter={(index) => {
              const point = data[Number(index)];
              return point?.tooltipLabel ?? point?.label ?? "";
            }}
            content={<CustomTooltip />}
          />


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
                  const badge = prediction?.recommendedBadge ?? "추천";
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



          <Customized
            component={(props: any) => (
              <MinMaxPills
                {...props}
                points={pillPoints}
                recommendedLabel={recommended?.label}
              />
            )}
          />

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
