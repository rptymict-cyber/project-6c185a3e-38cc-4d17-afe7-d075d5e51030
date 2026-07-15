import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { Snapshot } from "@/lib/mock/statistics-mock";
import { cn } from "@/lib/utils";

function deltaClass(v: number) {
  if (v > 0) return "text-[#E03131]";
  if (v < 0) return "text-[#1971C2]";
  return "text-[#868E96]";
}
function fmt(v: number, sign = false) {
  const s = v.toLocaleString();
  return sign && v > 0 ? `+${s}` : s;
}

export function StatsSnapshotTable({ data }: { data: Snapshot }) {
  const [openMarkets, setOpenMarkets] = useState<Record<string, boolean>>({});
  const toggle = (k: string) => setOpenMarkets((m) => ({ ...m, [k]: !m[k] }));

  return (
    <div className="overflow-hidden rounded-[12px] border border-[#E9ECEF] bg-white">
      {/* header */}
      <div className="grid grid-cols-[1.4fr_1fr_1fr_0.9fr_0.8fr] items-center border-b border-[#E9ECEF] bg-[#F8F9FA] px-3 py-2 text-[11px] font-bold text-[#495057]">
        <span>시장</span>
        <span className="text-right">당일평균</span>
        <span className="text-right">전일대비</span>
        <span className="text-right">등락율</span>
        <span className="text-right">수량(t)</span>
      </div>
      {/* overall */}
      <div className="grid grid-cols-[1.4fr_1fr_1fr_0.9fr_0.8fr] items-center border-b border-[#E9ECEF] bg-[#EBF7EB] px-3 py-2.5 text-[12.5px] font-bold">
        <span>전체 평균</span>
        <span className="text-right tabular-nums">{fmt(data.overall.avg)}</span>
        <span className={cn("text-right tabular-nums", deltaClass(data.overall.delta))}>{fmt(data.overall.delta, true)}</span>
        <span className={cn("text-right tabular-nums", deltaClass(data.overall.delta))}>{data.overall.pct > 0 ? `+${data.overall.pct}%` : `${data.overall.pct}%`}</span>
        <span className="text-right tabular-nums">{data.overall.vol}</span>
      </div>

      {data.regions.map((rg) => (
        <div key={rg.region}>
          <div className="border-t border-[#F1F3F5] bg-[#FAFBFC] px-3 py-1.5 text-[11px] font-bold text-[#6C757D]">{rg.region}</div>
          {rg.markets.map((m) => {
            const key = `${rg.region}:${m.name}`;
            const open = openMarkets[key];
            return (
              <div key={key}>
                <button
                  type="button"
                  onClick={() => toggle(key)}
                  className="grid w-full grid-cols-[1.4fr_1fr_1fr_0.9fr_0.8fr] items-center border-t border-[#F1F3F5] px-3 py-2.5 text-[12.5px] active:bg-[#F8F9FA]"
                >
                  <span className="flex items-center gap-1 text-left font-semibold text-foreground">
                    {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                    {m.name}
                  </span>
                  <span className="text-right tabular-nums font-semibold">{fmt(m.avg)}</span>
                  <span className={cn("text-right tabular-nums", deltaClass(m.delta))}>{fmt(m.delta, true)}</span>
                  <span className={cn("text-right tabular-nums", deltaClass(m.delta))}>{m.pct > 0 ? `+${m.pct}%` : `${m.pct}%`}</span>
                  <span className="text-right tabular-nums">{m.vol}</span>
                </button>
                {open && m.companies.map((co) => (
                  <div key={co.name} className="grid grid-cols-[1.4fr_1fr_1fr_0.9fr_0.8fr] items-center border-t border-[#F1F3F5] bg-[#FCFCFD] px-3 py-2 pl-8 text-[12px]">
                    <span className="text-[#495057]">{co.name}</span>
                    <span className="text-right tabular-nums">{fmt(co.avg)}</span>
                    <span className={cn("text-right tabular-nums", deltaClass(co.delta))}>{fmt(co.delta, true)}</span>
                    <span className={cn("text-right tabular-nums", deltaClass(co.delta))}>{co.pct > 0 ? `+${co.pct}%` : `${co.pct}%`}</span>
                    <span className="text-right tabular-nums">{co.vol}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
