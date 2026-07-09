import { useMemo } from "react";
import type { VarietyMarketAverages } from "@/lib/mock/variety-market-averages";

type Row = { id: string; name: string; volumeTon: number; pct: number };

export function VolumeByMarketTab({ data }: { data: VarietyMarketAverages }) {
  const { rows, totalVol, marketCount, topName } = useMemo(() => {
    const all = data.regions.flatMap((g) => g.markets);
    const total = all.reduce((s, m) => s + m.volumeTon, 0);
    const sorted = [...all].sort((a, b) => b.volumeTon - a.volumeTon);
    const top = sorted.slice(0, 5);
    const rest = sorted.slice(5);
    const restSum = rest.reduce((s, m) => s + m.volumeTon, 0);

    const rows: Row[] = top.map((m) => ({
      id: m.id,
      name: m.name,
      volumeTon: m.volumeTon,
      pct: total > 0 ? (m.volumeTon / total) * 100 : 0,
    }));
    if (restSum > 0) {
      rows.push({
        id: "__etc",
        name: "기타",
        volumeTon: Math.round(restSum * 10) / 10,
        pct: total > 0 ? (restSum / total) * 100 : 0,
      });
    }
    return {
      rows,
      totalVol: Math.round(total * 10) / 10,
      marketCount: all.length,
      topName: sorted[0]?.name ?? "-",
    };
  }, [data]);

  const maxVol = rows.reduce((m, r) => Math.max(m, r.volumeTon), 0);

  return (
    <div className="pb-8">
      <div className="px-4 pt-4">
        <h2 className="text-[15px] font-bold text-foreground">시장별 거래량</h2>
        <p className="mt-1 text-[11.5px] text-[#868E96]">선택한 날짜의 총 거래량 기준</p>
      </div>

      {/* Summary cards */}
      <div className="mt-3 grid grid-cols-3 gap-2 px-4">
        <SummaryCard label="총 거래량" value={`${totalVol.toFixed(1)}t`} />
        <SummaryCard label="거래 시장 수" value={`${marketCount}곳`} />
        <SummaryCard label="최대 거래 시장" value={topName} small />
      </div>

      {/* Bar list */}
      <div className="mx-4 mt-3 overflow-hidden rounded-[10px] border border-[#E9ECEF] bg-white">
        {rows.map((r, i) => (
          <div
            key={r.id}
            className={i > 0 ? "border-t border-[#F1F3F5] px-3 py-2.5" : "px-3 py-2.5"}
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className="truncate text-[13px] font-bold text-foreground">{r.name}</span>
              <span className="shrink-0 text-[12px] tabular-nums text-[#495057]">
                <span className="font-bold text-foreground">{r.volumeTon.toFixed(1)}t</span>
                <span className="ml-1.5 text-[#868E96]">{r.pct.toFixed(1)}%</span>
              </span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#F1F3F5]">
              <div
                className={r.id === "__etc" ? "h-full bg-[#ADB5BD]" : "h-full bg-[#3A8A3A]"}
                style={{ width: maxVol > 0 ? `${(r.volumeTon / maxVol) * 100}%` : "0%" }}
              />
            </div>
          </div>
        ))}
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
