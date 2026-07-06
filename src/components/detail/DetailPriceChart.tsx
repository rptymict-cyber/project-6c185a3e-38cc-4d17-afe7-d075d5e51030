import { Line, LineChart, ResponsiveContainer, ReferenceDot } from "recharts";
import type { DetailSeries } from "@/lib/mock/variety-detail";

export function DetailPriceChart({ series }: { series: DetailSeries }) {
  const data = series.points.map((p, i) => ({ ...p, i }));
  return (
    <div className="relative h-[230px] w-full">
      {/* Max / Min annotations */}
      <div className="pointer-events-none absolute left-2 top-1 z-10 flex items-center gap-1 text-[11px] font-semibold text-[#E03131]">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#E03131]" />
        최고 {series.max.price.toLocaleString()}원
      </div>
      <div className="pointer-events-none absolute bottom-1 left-2 z-10 flex items-center gap-1 text-[11px] font-semibold text-[#1971C2]">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#1971C2]" />
        최저 {series.min.price.toLocaleString()}원
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 24, right: 20, left: 12, bottom: 8 }}>
          <Line
            type="monotone"
            dataKey="price"
            stroke="#3A8A3A"
            strokeWidth={2.2}
            dot={false}
            isAnimationActive={false}
          />
          <ReferenceDot
            x={data[series.max.index].label}
            y={series.max.price}
            r={4}
            fill="#E03131"
            stroke="#fff"
            strokeWidth={1.5}
          />
          <ReferenceDot
            x={data[series.min.index].label}
            y={series.min.price}
            r={4}
            fill="#1971C2"
            stroke="#fff"
            strokeWidth={1.5}
          />
          <ReferenceDot
            x={data[data.length - 1].label}
            y={data[data.length - 1].price}
            r={5}
            fill="#3A8A3A"
            stroke="#fff"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
