import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { PriceVolumeChart } from "@/components/price-volume-chart";
import { seriesFor } from "@/lib/mock/crops";
import { DataSourceNotice } from "@/components/home/DataSourceNotice";
import { cn } from "@/lib/utils";
import type { MarketDetailTab } from "./types";

const PERIODS = [
  { id: "1d", label: "1일" },
  { id: "1w", label: "1주" },
  { id: "1m", label: "1개월" },
  { id: "3m", label: "3개월" },
  { id: "1y", label: "1년" },
  { id: "5y", label: "5년" },
] as const;

export function MarketChartView({
  cropId,
  onJumpTab,
}: {
  cropId: string;
  onJumpTab: (t: MarketDetailTab) => void;
}) {
  const [period, setPeriod] = useState<(typeof PERIODS)[number]["id"]>("1w");
  const seriesPeriod = period === "3m" || period === "1m" ? "1m" : period === "1y" ? "1y" : period === "5y" ? "3y" : "1w";
  const data = seriesFor(cropId, seriesPeriod);

  const high = data.reduce((a, b) => (b.price > a.price ? b : a), data[0]);
  const low = data.reduce((a, b) => (b.price < a.price ? b : a), data[0]);
  const volSum = data.reduce((s, r) => s + r.volume, 0);

  return (
    <div className="px-4 pt-3 pb-40">
      <div className="rounded-[12px] border border-[#E9ECEF] bg-background p-3">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-[14px] font-bold">가격 추이</h3>
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[#3A8A3A]" /> 평균가(원/kg)
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[#ADB5BD]" /> 거래량(톤)
            </span>
          </div>
        </div>
        <PriceVolumeChart data={data} />
        <div className="mt-2 flex flex-wrap gap-1.5">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={cn(
                "rounded-full px-3 py-1 text-[12px] font-semibold",
                period === p.id
                  ? "bg-[#3A8A3A] text-white"
                  : "bg-[#F1F3F5] text-muted-foreground",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => onJumpTab("auction")}
        className="mt-3 flex w-full items-center justify-between rounded-[12px] border border-[#E9ECEF] bg-background px-4 py-3.5 text-[14px] font-semibold text-foreground active:bg-secondary"
      >
        일별·시장별 시세 보기
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </button>

      <div className="mt-3 grid grid-cols-4 gap-2 rounded-[12px] border border-[#E9ECEF] bg-background p-3 text-center">
        <Stat label="최고가" value={`${high.price.toLocaleString()}`} unit="원/kg" />
        <Stat label="최저가" value={`${low.price.toLocaleString()}`} unit="원/kg" />
        <Stat label="거래량" value={`${volSum.toLocaleString()}`} unit="톤" />
        <Stat label="표본 수" value="732" unit="건" />
      </div>

      <p className="mt-2 text-[11px] text-muted-foreground">
        오늘 14:30 기준 · 총 10개 도매시장
      </p>

      <DataSourceNotice />
    </div>
  );
}

function Stat({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-data text-[14px] font-bold tabular-nums">
        {value}
        <span className="ml-0.5 text-[10px] font-medium text-muted-foreground">{unit}</span>
      </div>
    </div>
  );
}
