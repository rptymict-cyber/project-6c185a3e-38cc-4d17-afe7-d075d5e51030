import { Link } from "@tanstack/react-router";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import type { Crop } from "@/lib/mock/crops";
import { CropIcon } from "@/components/crop-icon";

function changeInfo(c: Crop) {
  const pct = ((c.currentPrice - c.prevPrice) / c.prevPrice) * 100;
  const flat = Math.abs(pct) < 0.05;
  const up = pct > 0;
  const color = flat ? "#6C757D" : up ? "#E03131" : "#1971C2";
  const sign = flat ? "" : up ? "▲" : "▼";
  return { pct, color, sign };
}

export function CropPriceCard({ crop, grade = "특" }: { crop: Crop; grade?: string }) {
  const { pct, color, sign } = changeInfo(crop);
  const data = crop.spark.map((v, i) => ({ i, v }));
  const id = `spark-${crop.id}`;
  return (
    <Link
      to="/market/$crop"
      params={{ crop: crop.id }}
      className="block w-[168px] shrink-0 rounded-2xl bg-white p-3 shadow-[0_1px_4px_rgba(0,0,0,0.06)] ring-1 ring-[#F1F3F5]"
    >
      <div className="flex items-center gap-1.5">
        <CropIcon name={crop.name} size={22} />
        <span className="text-[14px] font-bold text-foreground">{crop.name}</span>
        <span className="rounded bg-[#F1F3F5] px-1 py-0.5 text-[10px] font-medium text-[#6C757D]">
          {grade}
        </span>
      </div>
      <div className="mt-1 text-[18px] font-bold tabular-nums leading-tight text-foreground">
        {crop.currentPrice.toLocaleString()}
        <span className="ml-0.5 text-[11px] font-medium text-[#6C757D]">원/kg</span>
      </div>
      <div className="mt-0.5 text-[12px] font-semibold tabular-nums" style={{ color }}>
        {sign} {Math.abs(pct).toFixed(1)}%
        <span className="ml-1 text-[10px] font-normal text-[#868E96]">(전일대비)</span>
      </div>
      <div className="mt-1 text-[11px] text-[#868E96]">
        거래량 {Math.round(crop.volumeTon).toLocaleString()}톤
      </div>
      <div className="mt-1 h-[40px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 2, bottom: 2, left: 0, right: 0 }}>
            <defs>
              <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.25} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke={color}
              strokeWidth={1.75}
              fill={`url(#${id})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Link>
  );
}
