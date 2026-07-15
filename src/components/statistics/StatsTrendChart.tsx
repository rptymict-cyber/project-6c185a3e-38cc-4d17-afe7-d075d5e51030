import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { TooltipProps } from "recharts";
import { type TrendPoint } from "@/lib/mock/statistics-mock";

const VOLUME_BAR = "#A7B4E0";
const PRICE_COLORS = ["#3A8A3A", "#2F80ED", "#E8892B", "#9B59B6", "#16A085"];
const GRID = "#F1F3F5";
const AXIS_LABEL = "#ADB5BD";

export function StatsTrendChart({
  points, marketIds,
}: {
  points: TrendPoint[];
  marketIds: string[];
}) {
  const series = marketIds.map((id, i) => ({ id, color: PRICE_COLORS[i % PRICE_COLORS.length] }));
  return (
    <div className="w-full">
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={points} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid stroke={GRID} vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: AXIS_LABEL }} axisLine={false} tickLine={false} interval="preserveStartEnd" minTickGap={16} />
            <YAxis yAxisId="p" tick={{ fontSize: 10, fill: AXIS_LABEL }} axisLine={false} tickLine={false} width={44}
                   tickFormatter={(v: number) => v >= 1000 ? `${Math.round(v / 100) / 10}k` : String(v)} />
            <YAxis yAxisId="v" orientation="right" tick={{ fontSize: 10, fill: AXIS_LABEL }} axisLine={false} tickLine={false} width={30}
                   tickFormatter={(v: number) => `${v}t`} />
            <Tooltip content={<TrendTooltip series={series} />} cursor={{ stroke: "#3A8A3A", strokeDasharray: "3 3" }} />
            <Bar yAxisId="v" dataKey="volume" fill={VOLUME_BAR} barSize={10} radius={[2, 2, 0, 0]} name="거래량" />
            {series.map((s) => (
              <Line key={s.id} yAxisId="p" type="monotone" dataKey={s.id} stroke={s.color} strokeWidth={2.4}
                    dot={{ r: 2.6, strokeWidth: 0, fill: s.color }} activeDot={{ r: 3.8 }} name={s.id} isAnimationActive={false} />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-1 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 px-2">
        <li className="inline-flex items-center gap-1.5 text-[11px] text-[#495057]">
          <span className="h-2.5 w-2.5 rounded-[2px]" style={{ background: VOLUME_BAR }} />
          거래량
        </li>
        {series.map((s) => (
          <li key={s.id} className="inline-flex items-center gap-1.5 text-[11px] text-[#495057]">
            <span className="h-[2.5px] w-3.5 rounded-full" style={{ background: s.color }} />
            {s.id}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TrendTooltip({ active, payload, label, series }: TooltipProps<number, string> & {
  series: { id: string; color: string }[];
}) {
  if (!active || !payload?.length) return null;
  const vol = payload.find((p) => p.dataKey === "volume")?.value as number | undefined;
  const rows = series
    .map((s) => ({ s, v: payload.find((p) => p.dataKey === s.id)?.value as number | undefined }))
    .filter((r): r is { s: { id: string; color: string }; v: number } => typeof r.v === "number")
    .sort((a, b) => b.v - a.v);
  return (
    <div className="rounded-[10px] border border-[#E9ECEF] bg-white px-3 py-2 text-[11.5px] shadow-lg">
      <div className="mb-1 text-[10.5px] font-semibold text-[#868E96]">{label}</div>
      <ul className="space-y-0.5">
        {rows.map(({ s, v }) => (
          <li key={s.id} className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
              <span className="font-semibold">{s.id}</span>
            </span>
            <span className="tabular-nums font-bold">{v.toLocaleString()}<span className="ml-0.5 text-[10px] font-medium text-[#868E96]">원/kg</span></span>
          </li>
        ))}
      </ul>
      {typeof vol === "number" && (
        <div className="mt-1.5 border-t border-[#F1F3F5] pt-1 text-[10.5px]">
          <span className="inline-flex items-center gap-1.5 font-medium" style={{ color: VOLUME_BAR }}>
            <span className="h-2 w-2 rounded-sm" style={{ background: VOLUME_BAR }} />
            거래량 {vol}t
          </span>
        </div>
      )}
    </div>
  );
}
