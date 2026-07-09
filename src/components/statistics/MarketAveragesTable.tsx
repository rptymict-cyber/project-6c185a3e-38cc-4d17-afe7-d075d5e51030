import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { MarketAverage, VarietyMarketAverages } from "@/lib/mock/variety-market-averages";
import { cn } from "@/lib/utils";

export function MarketAveragesTable({
  data,
}: {
  data: VarietyMarketAverages;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const toggle = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="mx-4 mt-3 overflow-hidden rounded-[10px] border border-[#E9ECEF] bg-white">
      <table className="w-full table-fixed text-[11.5px]">
        <colgroup>
          <col className="w-[30%]" />
          <col className="w-[19%]" />
          <col className="w-[17%]" />
          <col className="w-[16%]" />
          <col className="w-[18%]" />
        </colgroup>
        <thead>
          <tr className="bg-[#F8F9FA] text-[#6C757D]">
            <th className="py-2 pl-2 text-left font-semibold">시장</th>
            <th className="py-2 text-right font-semibold">kg당 평균가</th>
            <th className="py-2 text-right font-semibold">전일대비</th>
            <th className="py-2 text-right font-semibold">등락률</th>
            <th className="py-2 pr-2 text-right font-semibold">수량(톤)</th>
          </tr>
        </thead>
        <tbody>
          {/* Overall row */}
          <tr className="border-t border-[#F1F3F5] bg-[#F0F9F0]">
            <td className="py-2.5 pl-2 font-bold text-[#1F5C1F]">전체 평균</td>
            <td className="py-2.5 text-right font-bold text-foreground">
              {data.overall.avgKg.toLocaleString()}
            </td>
            <td className={cn("py-2.5 text-right font-bold", amountColor(data.overall.deltaAmount))}>
              {fmtAmount(data.overall.deltaAmount)}
            </td>
            <td className={cn("py-2.5 text-right font-bold", amountColor(data.overall.deltaAmount))}>
              {fmtPct(data.overall.deltaPct)}
            </td>
            <td className="py-2.5 pr-2 text-right font-bold text-foreground">
              {data.overall.volumeTon.toFixed(1)}
            </td>
          </tr>

          {data.regions.map((group) => (
            <RegionRows
              key={group.region}
              region={group.region}
              markets={[...group.markets].sort((a, b) => b.avgKg - a.avgKg)}
              expanded={expanded}
              onToggle={toggle}
            />
          ))}

        </tbody>
      </table>
    </div>
  );
}

function RegionRows({
  region,
  markets,
  expanded,
  onToggle,
}: {
  region: string;
  markets: MarketAverage[];
  expanded: Record<string, boolean>;
  onToggle: (id: string) => void;
}) {
  return (
    <>
      <tr className="border-t border-[#E9ECEF] bg-[#F8F9FA]">
        <td
          colSpan={5}
          className="px-2 py-1.5 text-[11px] font-semibold text-[#6C757D]"
        >
          {region}
        </td>
      </tr>
      {markets.map((m) => {
        const open = !!expanded[m.id];
        return (
          <MarketRowGroup
            key={m.id}
            market={m}
            open={open}
            onToggle={() => onToggle(m.id)}
          />
        );
      })}
    </>
  );
}

function MarketRowGroup({
  market,
  open,
  onToggle,
}: {
  market: MarketAverage;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <tr
        className="cursor-pointer border-t border-[#F1F3F5] hover:bg-[#F8F9FA]"
        onClick={onToggle}
      >
        <td className="py-2.5 pl-1 align-middle">
          <div className="flex items-center gap-0.5">
            <span
              aria-label={open ? "접기" : "펼치기"}
              className="grid h-6 w-6 place-items-center rounded"
            >
              {open ? (
                <ChevronDown className="h-3.5 w-3.5 text-[#495057]" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-[#495057]" />
              )}
            </span>
            <span className="font-bold text-foreground">{market.name}</span>
          </div>
        </td>
        <td className="py-2.5 text-right font-bold text-foreground">
          {market.avgKg.toLocaleString()}
        </td>
        <td className={cn("py-2.5 text-right font-semibold", amountColor(market.deltaAmount))}>
          {fmtAmount(market.deltaAmount)}
        </td>
        <td className={cn("py-2.5 text-right font-semibold", amountColor(market.deltaAmount))}>
          {fmtPct(market.deltaPct)}
        </td>
        <td className="py-2.5 pr-2 text-right text-foreground">
          {market.volumeTon.toFixed(1)}
        </td>
      </tr>
      {open &&
        market.companies.map((c) => (
          <tr key={c.name} className="border-t border-[#F8F9FA] bg-[#FBFCFD]">
            <td className="py-2 pl-8 text-[11px] text-[#6C757D]">
              └ {c.name}
            </td>
            <td className="py-2 text-right text-[11px] text-[#495057]">
              {c.avgKg.toLocaleString()}
            </td>
            <td className={cn("py-2 text-right text-[11px] font-semibold", amountColor(c.deltaAmount))}>
              {fmtAmount(c.deltaAmount)}
            </td>
            <td className={cn("py-2 text-right text-[11px] font-semibold", amountColor(c.deltaAmount))}>
              {fmtPct(c.deltaPct)}
            </td>
            <td className="py-2 pr-2 text-right text-[11px] text-[#6C757D]">
              {c.volumeTon.toFixed(1)}
            </td>
          </tr>
        ))}
    </>
  );
}


function fmtAmount(v: number): string {
  if (v === 0) return "0";
  return `${v > 0 ? "+" : ""}${v.toLocaleString()}`;
}
function fmtPct(v: number): string {
  if (Math.abs(v) < 0.05) return "0%";
  return `${v > 0 ? "+" : ""}${v.toFixed(1)}%`;
}
function amountColor(v: number): string {
  if (v > 0) return "text-[#E03131]";
  if (v < 0) return "text-[#1971C2]";
  return "text-[#6C757D]";
}
