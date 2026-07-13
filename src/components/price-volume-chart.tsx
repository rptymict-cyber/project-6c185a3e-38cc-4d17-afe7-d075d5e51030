import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Customized,
  Line,
  ReferenceArea,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const RED = "#E03B3B";
const PINK = "#F3C6C6";
const TEAL = "#2E9E6B";
const GREY = "#CBD5E1";

export type ChartRow = {
  label: string;
  date: string;
  price: number | null;
  volume: number | null;
  forecast: number | null;
  isToday?: boolean;
};

interface Props {
  showForecast?: boolean;
  todayLabel?: string;
  lastLabel?: string;
  recommendLabel?: string;
  recommendPrice?: number;
  recommendDate?: string;
}

/**
 * Legacy row shape (older callers): { label, date, price, volume }.
 * Normalized to ChartRow so this single chart serves both new and old callers.
 */
type LegacyRow = { label: string; date: string; price: number; volume: number };

function normalize(rows: Array<ChartRow | LegacyRow> | undefined): ChartRow[] {
  if (!rows) return [];
  return rows.map((r) => ({
    label: r.label,
    date: r.date,
    price: (r as ChartRow).price ?? (r as LegacyRow).price ?? null,
    volume: (r as ChartRow).volume ?? (r as LegacyRow).volume ?? null,
    forecast: (r as ChartRow).forecast ?? null,
    isToday: (r as ChartRow).isToday,
  }));
}

export function PriceVolumeChart({
  data,
  showForecast = false,
  todayLabel,
  lastLabel,
  recommendLabel,
  recommendPrice,
  recommendDate,
}: Props & { data?: Array<ChartRow | LegacyRow> }) {
  const rows = normalize(data);
  const canRenderForecast =
    showForecast && !!todayLabel && !!lastLabel &&
    rows.some((r) => r.forecast != null);

  return (
    <div className="h-[240px] w-full px-1">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={rows}
          margin={{ top: 28, right: 8, left: 0, bottom: 4 }}
        >
          <CartesianGrid stroke="var(--color-chart-grid)" vertical={false} />

          {canRenderForecast && (
            <ReferenceArea
              yAxisId="price"
              x1={todayLabel}
              x2={lastLabel}
              fill={TEAL}
              fillOpacity={0.07}
              ifOverflow="extendDomain"
            />
          )}
          {canRenderForecast && (
            <ReferenceLine
              yAxisId="price"
              x={todayLabel}
              stroke={GREY}
              strokeDasharray="3 3"
              label={{
                value: "오늘",
                position: "top",
                fontSize: 10,
                fontWeight: 700,
                fill: "#64748B",
              }}
            />
          )}

          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "#868E96" }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
            minTickGap={40}
          />
          <YAxis
            yAxisId="price"
            orientation="left"
            tick={{ fontSize: 11, fill: "#868E96" }}
            axisLine={false}
            tickLine={false}
            width={48}
            tickFormatter={(v) => v.toLocaleString()}
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
            yAxisId="vol"
            dataKey="volume"
            fill={PINK}
            radius={[2, 2, 0, 0]}
            maxBarSize={14}
            isAnimationActive={false}
          />
          <Line
            yAxisId="price"
            type="monotone"
            dataKey="price"
            stroke={RED}
            strokeWidth={2.6}
            dot={false}
            activeDot={{ r: 4, fill: RED, stroke: "#fff", strokeWidth: 2 }}
            isAnimationActive={false}
            connectNulls={false}
          />
          {canRenderForecast && (
            <Line
              yAxisId="price"
              type="monotone"
              dataKey="forecast"
              stroke={TEAL}
              strokeWidth={2.6}
              strokeDasharray="6 4"
              dot={false}
              activeDot={{ r: 4, fill: TEAL, stroke: "#fff", strokeWidth: 2 }}
              isAnimationActive={false}
              connectNulls
            />
          )}

          {canRenderForecast &&
            recommendLabel &&
            typeof recommendPrice === "number" && (
              <>
                <ReferenceDot
                  yAxisId="price"
                  x={recommendLabel}
                  y={recommendPrice}
                  r={5.5}
                  fill={TEAL}
                  stroke="#fff"
                  strokeWidth={2}
                />
                <Customized
                  component={(props: any) => (
                    <RecommendBadge
                      {...props}
                      label={recommendLabel}
                      price={recommendPrice}
                      text="추천"
                    />
                  )}
                />
              </>
            )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

function RecommendBadge({
  xAxisMap,
  yAxisMap,
  label,
  price,
  text,
}: {
  xAxisMap?: Record<string, any>;
  yAxisMap?: Record<string, any>;
  label: string;
  price: number;
  text: string;
}) {
  if (!xAxisMap || !yAxisMap) return null;
  const xAxis = Object.values(xAxisMap)[0];
  const yAxis = yAxisMap["price"] ?? Object.values(yAxisMap)[0];
  if (!xAxis?.scale || !yAxis?.scale) return null;
  const xv = xAxis.scale(label);
  if (typeof xv !== "number" || Number.isNaN(xv)) return null;
  const bw =
    typeof xAxis.scale.bandwidth === "function" ? xAxis.scale.bandwidth() : 0;
  const cx = xv + bw / 2;
  const cy = yAxis.scale(price);
  if (typeof cy !== "number" || Number.isNaN(cy)) return null;

  const charW = 6.6;
  const padX = 9;
  const w = Math.round(text.length * charW + padX * 2);
  const h = 20;
  const bx = cx - w / 2;
  const by = cy - h - 14;

  return (
    <g style={{ pointerEvents: "none" }}>
      <rect x={bx} y={by} width={w} height={h} rx={10} ry={10} fill={TEAL} />
      <text
        x={cx}
        y={by + h / 2 + 3.6}
        textAnchor="middle"
        fontSize={11}
        fontWeight={800}
        fill="#fff"
      >
        {text}
      </text>
    </g>
  );
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload || payload.length === 0) return null;
  const p = payload[0].payload as ChartRow;
  const isForecast = p.price == null && p.forecast != null;
  return (
    <div className="rounded-[10px] border border-[#E9ECEF] bg-white px-3 py-2 shadow-md">
      {isForecast ? (
        <>
          <div className="text-[12px] font-bold text-[#2E9E6B]">
            {p.label} · AI 예측
          </div>
          <div className="mt-0.5 text-[12px] font-bold text-[#2E9E6B]">
            예상 평균가 {p.forecast!.toLocaleString()}원
          </div>
        </>
      ) : (
        <>
          <div className="text-[12px] font-bold text-foreground">{p.label}</div>
          {p.price != null && (
            <div className="mt-0.5 text-[12px] font-bold text-[#E03B3B]">
              평균가 {p.price.toLocaleString()}원
            </div>
          )}
          {p.volume != null && (
            <div className="text-[11.5px] text-[#495057]">
              거래량 {p.volume.toLocaleString()}t
            </div>
          )}
        </>
      )}
    </div>
  );
}
