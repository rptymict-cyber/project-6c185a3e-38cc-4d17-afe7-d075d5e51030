import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { getMarketVolumeStats } from "@/lib/services/market-volume-stats";

// 브랜드 그린 계열 그라데이션 + 기타는 회색
const SLICE_COLORS = ["#2F7A2F", "#3A8A3A", "#5AA85A", "#82C182", "#B4DDB4"];
const ETC_COLOR = "#CED4DA";

export function VolumeByMarketTab({
  varietyId,
  date,
}: {
  varietyId: string;
  date: string;
}) {
  const stats = useMemo(
    () => getMarketVolumeStats({ variety: varietyId, date }),
    [varietyId, date],
  );

  const chartData = stats.breakdown.map((b, i) => ({
    name: b.market,
    value: b.volume,
    color: b.id === "__etc" ? ETC_COLOR : SLICE_COLORS[i % SLICE_COLORS.length],
  }));

  return (
    <div className="pb-8">
      <div className="px-4 pt-4">
        <h2 className="text-[15px] font-bold text-foreground">시장별 거래량</h2>
        <p className="mt-1 text-[11.5px] text-[#868E96]">선택한 날짜의 총 거래량 기준</p>
      </div>

      {/* Summary cards */}
      <div className="mt-3 grid grid-cols-3 gap-2 px-4">
        <SummaryCard label="총 거래량" value={`${stats.total.toFixed(1)}t`} />
        <SummaryCard label="거래 시장 수" value={`${stats.marketCount}곳`} />
        <SummaryCard label="최대 거래 시장" value={stats.topMarket} small />
      </div>

      {/* Donut */}
      <div className="mx-4 mt-3 rounded-[10px] border border-[#E9ECEF] bg-white px-3 py-4">
        <div className="relative mx-auto h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={62}
                outerRadius={92}
                stroke="#fff"
                strokeWidth={2}
                isAnimationActive={false}
              >
                {chartData.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-[20px] font-black tabular-nums text-foreground">
              {stats.total.toFixed(1)}t
            </div>
            <div className="mt-0.5 text-[11px] text-[#868E96]">총 거래량</div>
          </div>
        </div>

        {/* Legend list */}
        <ul className="mt-4 divide-y divide-[#F1F3F5]">
          {stats.breakdown.map((b, i) => {
            const color =
              b.id === "__etc" ? ETC_COLOR : SLICE_COLORS[i % SLICE_COLORS.length];
            return (
              <li
                key={b.id}
                className="flex items-center justify-between gap-2 py-2"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-sm"
                    style={{ backgroundColor: color }}
                  />
                  <span className="truncate text-[13px] font-bold text-foreground">
                    {b.market}
                  </span>
                </div>
                <span className="shrink-0 text-[12px] tabular-nums text-[#495057]">
                  <span className="font-bold text-foreground">
                    {b.volume.toFixed(1)}t
                  </span>
                  <span className="ml-1.5 text-[#868E96]">
                    {(b.ratio * 100).toFixed(1)}%
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-4 mx-4 rounded-[10px] border border-[#E9ECEF] bg-[#F8F9FA] px-3 py-2.5 text-[11.5px] text-[#6C757D]">
        시장별 거래량은 선택 날짜의 시장별 반입 물량으로 계산됩니다.
      </div>
    </div>
  );
}

function SummaryCard({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div className="rounded-[10px] border border-[#E9ECEF] bg-white px-2 py-2">
      <div className="text-[10.5px] font-semibold text-[#6C757D]">{label}</div>
      <div
        className={
          small
            ? "mt-1 truncate text-[12px] font-black tabular-nums leading-tight text-foreground"
            : "mt-1 text-[13px] font-black tabular-nums leading-tight text-foreground"
        }
      >
        {value}
      </div>
    </div>
  );
}
