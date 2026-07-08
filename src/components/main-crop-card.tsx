import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Crop } from "@/lib/mock/crops";
import { MARKETS } from "@/lib/mock/markets";
import { PriceBadge } from "./price-badge";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// deterministic hourly intraday series 09:00 → 17:00
function intraday(crop: Crop) {
  const base = crop.currentPrice;
  const seed = crop.id
    .split("")
    .reduce((s, ch, i) => s + ch.charCodeAt(0) * (i + 1), 0);
  let x = seed;
  const rand = () => {
    x = (x * 9301 + 49297) % 233280;
    return x / 233280;
  };
  const hours = ["09", "10", "11", "12", "13", "14", "15", "16", "17"];
  // walk toward currentPrice
  const start = base * (0.94 + rand() * 0.06);
  const out: { time: string; price: number }[] = [];
  for (let i = 0; i < hours.length; i++) {
    const t = i / (hours.length - 1);
    const drift = start + (base - start) * t;
    const noise = (rand() - 0.5) * base * 0.02;
    const price = Math.max(1, Math.round(drift + noise));
    out.push({ time: `${hours[i]}:00`, price });
  }
  // ensure the last point exactly matches current
  out[out.length - 1].price = base;
  return out;
}

function pctChange(cur: number, prev: number) {
  if (!prev) return 0;
  return ((cur - prev) / prev) * 100;
}

export function MainCropCard({ crop }: { crop: Crop }) {
  const [marketId, setMarketId] = useState(MARKETS[0]?.id ?? "");
  const [open, setOpen] = useState(false);
  const market = MARKETS.find((m) => m.id === marketId) ?? MARKETS[0];

  const data = useMemo(() => intraday(crop), [crop]);

  const changePct = pctChange(crop.currentPrice, crop.prevPrice);
  const up = changePct >= 0;
  const lineColor = "#3A8A3A";

  // synth other timeframe deltas
  const weekPct = changePct * 1.6 - 0.4;
  const yearPct = changePct * -0.8 + 2.1;

  // real trade proxy (box price)
  const boxKg = crop.unit.includes("20kg") ? 20 : crop.unit.includes("40kg") ? 40 : 30;
  const boxPrice = crop.currentPrice * boxKg;

  const lastX = data[data.length - 1].time;

  return (
    <section className="rounded-[12px] bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="text-2xl" aria-hidden>
            {crop.emoji}
          </span>
          <div className="min-w-0">
            <div className="truncate text-[16px] font-bold text-foreground">
              {crop.name}
              <span className="ml-1 text-[12px] font-medium text-muted-foreground">
                후지 · 특
              </span>
            </div>
            <div className="text-[11px] text-muted-foreground">
              업데이트 {crop.updatedAt}
            </div>
          </div>
        </div>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-[#F8F9FA] px-2.5 py-1.5 text-[12px] font-semibold text-foreground">
              {market.name}
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-52 p-1">
            <div className="max-h-64 overflow-y-auto">
              {MARKETS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setMarketId(m.id);
                    setOpen(false);
                  }}
                  className={cn(
                    "block w-full rounded-md px-2 py-1.5 text-left text-[13px]",
                    m.id === marketId
                      ? "bg-[#F0F9F0] font-semibold text-[#3A8A3A]"
                      : "hover:bg-secondary",
                  )}
                >
                  <div>{m.name}</div>
                  <div className="text-[11px] text-muted-foreground">{m.region}</div>
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Price */}
      <div className="mt-3 flex items-end justify-between gap-2">
        <div className="min-w-0">
          <div className="font-data text-[28px] font-bold leading-none tabular-nums text-[#212529]">
            {crop.currentPrice.toLocaleString()}
            <span className="ml-1 text-[13px] font-medium text-muted-foreground">
              {crop.unit}
            </span>
          </div>
          <div className="mt-1.5 text-[12px] text-muted-foreground">
            실거래가{" "}
            <span className="font-semibold text-foreground">
              {boxPrice.toLocaleString()}원
            </span>{" "}
            / {boxKg}kg 상자
          </div>
        </div>
        <PriceBadge changePct={changePct} size="md" />
      </div>

      {/* Chart */}
      <div className="mt-3 h-[140px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
            <defs>
              <linearGradient id="mainArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={lineColor} stopOpacity={0.18} />
                <stop offset="100%" stopColor={lineColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: "#ADB5BD" }}
              axisLine={false}
              tickLine={false}
              interval={1}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#ADB5BD" }}
              axisLine={false}
              tickLine={false}
              width={40}
              domain={["dataMin - 20", "dataMax + 20"]}
              tickFormatter={(v) => v.toLocaleString()}
            />
            <Tooltip
              cursor={{ stroke: "#E9ECEF", strokeWidth: 1 }}
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #E9ECEF",
                fontSize: 12,
                padding: "6px 8px",
              }}
              formatter={(v: number) => [`${v.toLocaleString()}원/kg`, "가격"]}
              labelFormatter={(l) => `${l}`}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={lineColor}
              strokeWidth={2}
              fill="url(#mainArea)"
              activeDot={{
                r: 4,
                fill: lineColor,
                stroke: "#fff",
                strokeWidth: 2,
              }}
              dot={(props) => {
                const { cx, cy, payload, index } = props as {
                  cx: number;
                  cy: number;
                  payload: { time: string };
                  index: number;
                };
                if (payload.time === lastX) {
                  return (
                    <circle
                      key={`last-dot-${index}`}
                      cx={cx}
                      cy={cy}
                      r={4}
                      fill={lineColor}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  );
                }
                return <circle key={`dot-${index}`} cx={cx} cy={cy} r={0} fill="none" />;
              }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 3 delta row */}
      <div className="mt-2 grid grid-cols-3 gap-2 rounded-lg bg-[#F8F9FA] px-3 py-2.5">
        <DeltaCell label="전일대비" pct={changePct} />
        <DeltaCell label="전주대비" pct={weekPct} divider />
        <DeltaCell label="전년동기" pct={yearPct} />
      </div>

      {/* CTAs */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Link
          to="/market/$crop"
          params={{ crop: crop.id }}
          className="grid h-10 place-items-center rounded-lg border border-[#3A8A3A] text-[13px] font-semibold text-[#3A8A3A]"
        >
          경락가 조회
        </Link>
        <Link
          to="/prediction"
          search={{ cropId: crop.id, entrySource: "home" } as never}
          className="grid h-10 place-items-center rounded-lg bg-[#3A8A3A] text-[13px] font-semibold text-white"
        >
          AI 가격 예측 보기
        </Link>
      </div>
      {/* prevent unused var warning */}
      <span className="hidden">{up ? "" : ""}</span>
    </section>
  );
}

function DeltaCell({
  label,
  pct,
  divider,
}: {
  label: string;
  pct: number;
  divider?: boolean;
}) {
  const up = pct >= 0;
  const flat = Math.abs(pct) < 0.05;
  const color = flat ? "#6C757D" : up ? "#E03131" : "#1971C2";
  const sign = flat ? "" : up ? "▲ +" : "▼ ";
  return (
    <div
      className={cn(
        "flex flex-col items-center text-center",
        divider && "border-x border-[#E9ECEF]",
      )}
    >
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span
        className="mt-0.5 font-data text-[13px] font-bold tabular-nums"
        style={{ color }}
      >
        {sign}
        {Math.abs(pct).toFixed(1)}%
      </span>
    </div>
  );
}
