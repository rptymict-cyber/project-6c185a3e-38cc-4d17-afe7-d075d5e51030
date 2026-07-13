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

// 추천/최고/최저 라벨을 흰 배경 pill로 그리고, 추천 칩과 위치 충돌을 피한다.
interface LabelsOverlayProps {
  xAxisMap?: Record<string, any>;
  yAxisMap?: Record<string, any>;
  offset?: { top: number; left: number; width: number; height: number };
  recommendedLabel?: string;
  recommendedPrice?: number;
  maxLabel?: string;
  maxPrice?: number;
  minLabel?: string;
  minPrice?: number;
}

function LabelsOverlay({
  xAxisMap,
  yAxisMap,
  offset,
  recommendedLabel,
  recommendedPrice,
  maxLabel,
  maxPrice,
  minLabel,
  minPrice,
}: LabelsOverlayProps) {
  if (!xAxisMap || !yAxisMap || !offset) return null;
  const xAxis = xAxisMap["main"] ?? Object.values(xAxisMap)[0];
  const yAxis = yAxisMap["price"] ?? Object.values(yAxisMap)[0];
  if (!xAxis?.scale || !yAxis?.scale) return null;
  const xScale = xAxis.scale;
  const yScale = yAxis.scale;
  const bw = typeof xScale.bandwidth === "function" ? xScale.bandwidth() : 0;
  const centerX = (label: string): number | null => {
    const v = xScale(label);
    if (typeof v !== "number" || Number.isNaN(v)) return null;
    return v + bw / 2;
  };

  const pill = (
    key: string,
    cx: number,
    cy: number,
    text: string,
    color: string,
    placement: "top" | "bottom",
    filled: boolean,
  ) => {
    const padX = 8;
    const padY = 4;
    const fontSize = 10.5;
    const w = Math.round(text.length * 6.6 + padX * 2);
    const h = fontSize + padY * 2;
    const gap = 10;
    const y = placement === "top" ? cy - gap - h : cy + gap;
    const textY = y + h / 2 + fontSize / 2 - 2;
    return (
      <g key={key}>
        <rect
          x={cx - w / 2}
          y={y}
          width={w}
          height={h}
          rx={h / 2}
          ry={h / 2}
          fill={filled ? color : "#FFFFFF"}
          stroke={color}
          strokeWidth={1.2}
        />
        <text
          x={cx}
          y={textY}
          textAnchor="middle"
          fontSize={fontSize}
          fontWeight={800}
          fill={filled ? "#FFFFFF" : color}
        >
          {text}
        </text>
      </g>
    );
  };

  const nodes: React.ReactNode[] = [];

  // 추천 칩 (항상 top)
  let recCx: number | null = null;
  let recCy: number | null = null;
  if (recommendedLabel && typeof recommendedPrice === "number") {
    recCx = centerX(recommendedLabel);
    const yv = yScale(recommendedPrice);
    recCy = typeof yv === "number" && !Number.isNaN(yv) ? yv : null;
    if (recCx != null && recCy != null) {
      const md = recommendedLabel.replace(/-/g, "/");
      nodes.push(pill("rec", recCx, recCy, `추천 ${md}`, TEAL, "top", true));
    }
  }

  // 최고 pill — 추천일과 겹치면 아래로
  if (maxLabel && typeof maxPrice === "number") {
    const cx = centerX(maxLabel);
    const yv = yScale(maxPrice);
    const cy = typeof yv === "number" && !Number.isNaN(yv) ? yv : null;
    if (cx != null && cy != null) {
      const collide = maxLabel === recommendedLabel;
      nodes.push(
        pill(
          "max",
          cx,
          cy,
          `최고 ${maxPrice.toLocaleString()}`,
          RED,
          collide ? "bottom" : "top",
          false,
        ),
      );
    }
  }

  // 최저 pill — 추천일과 겹치면 위로
  if (minLabel && typeof minPrice === "number" && minLabel !== maxLabel) {
    const cx = centerX(minLabel);
    const yv = yScale(minPrice);
    const cy = typeof yv === "number" && !Number.isNaN(yv) ? yv : null;
    if (cx != null && cy != null) {
      const collide = minLabel === recommendedLabel;
      nodes.push(
        pill(
          "min",
          cx,
          cy,
          `최저 ${minPrice.toLocaleString()}`,
          BLUE,
          collide ? "top" : "bottom",
          false,
        ),
      );
    }
  }

  return <g style={{ pointerEvents: "none" }}>{nodes}</g>;
}


interface SelectedMarkerProps {
  xAxisMap?: Record<string, any>;
  yAxisMap?: Record<string, any>;
  offset?: { top: number; left: number; width: number; height: number };
  label: string;
  price: number;
}

function SelectedMarker({
  xAxisMap,
  yAxisMap,
  offset,
  label,
  price,
}: SelectedMarkerProps) {
  if (!xAxisMap || !yAxisMap || !offset) return null;
  const xAxis = xAxisMap["main"] ?? Object.values(xAxisMap)[0];
  const yAxis = yAxisMap["price"] ?? Object.values(yAxisMap)[0];
  if (!xAxis?.scale || !yAxis?.scale) return null;
  const xScale = xAxis.scale;
  const yScale = yAxis.scale;
  const xv = xScale(label);
  if (typeof xv !== "number" || Number.isNaN(xv)) return null;
  const bw = typeof xScale.bandwidth === "function" ? xScale.bandwidth() : 0;
  const cx = xv + bw / 2;
  const cy = yScale(price);
  if (typeof cy !== "number" || Number.isNaN(cy)) return null;

  const text = `${label} · ${price.toLocaleString()}원`;
  const w = Math.round(text.length * 6.6 + 16);
  const h = 22;
  const pinY = cy - 18;

  return (
    <g style={{ pointerEvents: "none" }}>
      <line
        x1={cx}
        x2={cx}
        y1={offset.top}
        y2={cy}
        stroke={TEAL}
        strokeWidth={1.25}
        strokeDasharray="4 3"
      />
      {/* 물방울 핀 */}
      <g transform={`translate(${cx}, ${pinY})`}>
        <rect
          x={-w / 2}
          y={-h}
          width={w}
          height={h}
          rx={11}
          ry={11}
          fill={TEAL}
        />
        <polygon
          points={`-6,0 6,0 0,7`}
          fill={TEAL}
        />
        <text
          x={0}
          y={-h / 2 + 4}
          textAnchor="middle"
          fontSize={11}
          fontWeight={800}
          fill="#fff"
        >
          {text}
        </text>
      </g>
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill={TEAL}
        stroke="#fff"
        strokeWidth={2}
      />
    </g>
  );
}

interface PredictionChartProps {
  points: PredictionPoint[];
  selectedIndex?: number;
  onSelectIndex?: (index: number) => void;
  viewpoint?: "farmer" | "wholesaler";
  currentPrice?: number;
  quantityBoxes?: number;
  baseUnitLabel?: string;
}

function PredictionChartBase({
  points,
  selectedIndex,
  onSelectIndex,
  viewpoint = "farmer",
  currentPrice,
  quantityBoxes,
  baseUnitLabel,
}: PredictionChartProps) {
  const todayIdx = points.findIndex((p) => p.isToday);
  const todayPoint = todayIdx >= 0 ? points[todayIdx] : undefined;
  const recommended = points.find((p) => p.isRecommendedDate);

  // Deterministic synthetic volume for past points only (mock lacks volume).
  const data = points.map((p, i) => {
    const isPast = todayIdx < 0 || i <= todayIdx;
    const seed = (i * 9301 + 49297) % 233280;
    const pastVolume =
      isPast && p.actualPrice !== undefined
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

  const selectedPoint =
    selectedIndex != null ? points[selectedIndex] : undefined;
  const selectedLabel = selectedPoint?.label;
  const selectedPrice = selectedPoint?.predictedPrice;
  const canRenderSelected =
    !!selectedLabel && typeof selectedPrice === "number";

  // Ticks: past start · past mid · today · forecast mid · recommended · selected · last forecast
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
    if (selectedLabel) t.push(selectedLabel);
    if (futureEnd >= 0 && points[futureEnd]) t.push(points[futureEnd].label);
    return Array.from(new Set(t));
  })();

  const isFarmer = viewpoint === "farmer";
  const showTopInfo =
    canRenderSelected && currentPrice != null && quantityBoxes != null;
  const priceDiff =
    showTopInfo && selectedPrice != null ? selectedPrice - currentPrice! : 0;
  const gain = showTopInfo ? (isFarmer ? priceDiff : -priceDiff) * quantityBoxes! : 0;
  const gainLabel = isFarmer ? "예상 추가수익" : "예상 절감";

  const handleChartClick = (e: any) => {
    if (!onSelectIndex) return;
    const idx = e?.activeTooltipIndex;
    if (typeof idx !== "number") return;
    const p = points[idx];
    if (!p) return;
    if (p.predictedPrice === undefined || p.isToday) return;
    onSelectIndex(idx);
  };

  return (
    <div className="w-full">
      {/* 좌측 상단 정보 (헤이딜러식) */}
      {showTopInfo && selectedPrice != null && (
        <div className="mb-2 flex items-baseline justify-between">
          <div>
            <div className="text-[11px] font-semibold text-[#495057]">
              {selectedLabel} {isFarmer ? "출하 시" : "매입 시"}
            </div>
            <div className="mt-0.5 flex items-baseline gap-1">
              <span className="text-[18px] font-black tabular-nums text-[#2E9E6B]">
                {selectedPrice.toLocaleString()}
              </span>
              <span className="text-[11px] font-semibold text-[#495057]">
                원{baseUnitLabel ? ` / ${baseUnitLabel}` : ""}
              </span>
            </div>
          </div>
          <div
            className={`rounded-full px-2 py-1 text-[11px] font-bold tabular-nums ${
              gain >= 0
                ? "bg-[#E7F5EC] text-[#1F5C1F]"
                : "bg-[#FFF5F5] text-[#E03131]"
            }`}
          >
            {gainLabel} {gain >= 0 ? "+" : "-"}
            {Math.abs(gain).toLocaleString()}원
          </div>
        </div>
      )}

      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 28, right: 12, left: 0, bottom: 4 }}
            onClick={handleChartClick}
          >
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
                const isSelected = payload.value === selectedLabel;
                return (
                  <text
                    x={x}
                    y={y + 10}
                    textAnchor="middle"
                    fontSize={10.5}
                    fontWeight={isSelected ? 800 : 400}
                    fill={isSelected ? TEAL : "#868E96"}
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
              dot={(dotProps: any) => {
                const { cx, cy, index, payload } = dotProps;
                if (
                  payload.predictedPrice === undefined ||
                  payload.isToday ||
                  typeof cx !== "number" ||
                  typeof cy !== "number"
                ) {
                  return <g key={`d-${index}`} />;
                }
                const isSelected = index === selectedIndex;
                return (
                  <circle
                    key={`d-${index}`}
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 5 : 3.5}
                    fill={TEAL}
                    stroke="#fff"
                    strokeWidth={1.5}
                    style={{ cursor: "pointer" }}
                    onClick={() => onSelectIndex?.(index)}
                  />
                );
              }}
              activeDot={{
                r: 6,
                fill: TEAL,
                stroke: "#fff",
                strokeWidth: 2,
                onClick: (_: any, e: any) => {
                  const idx = e?.index;
                  if (typeof idx === "number") onSelectIndex?.(idx);
                },
              }}
              isAnimationActive={false}
              connectNulls={false}
            />

            {maxPoint && (
              <ReferenceDot
                xAxisId="main"
                yAxisId="price"
                x={maxPoint.label}
                y={maxP}
                r={0}
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
                r={0}
                label={{
                  value: `최저 ${minP.toLocaleString()}`,
                  position: "bottom",
                  fill: BLUE,
                  fontSize: 10,
                  fontWeight: 800,
                }}
              />
            )}

            {canRenderSelected && (
              <Customized
                component={(props: any) => (
                  <SelectedMarker
                    {...props}
                    label={selectedLabel!}
                    price={selectedPrice!}
                  />
                )}
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
    </div>
  );
}

export const PredictionChart = memo(PredictionChartBase);

