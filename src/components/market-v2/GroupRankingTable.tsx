import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import {
  getCompanyRankings,
  getOriginRankings,
  getVarietyRankings,
  RANKING_SORT_LABEL,
  type GroupRankingRow,
  type RankingSort,
} from "@/lib/mock/market-analysis";
import { useMarketFilter } from "@/store/market";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const SORTS: RankingSort[] = ["price-desc", "price-asc", "volume-desc", "change-desc"];

type Scope = "company" | "origin" | "variety";

const CONFIG: Record<Scope, { title: string; colLabel: string }> = {
  company: { title: "법인별 시세", colLabel: "법인" },
  origin: { title: "산지별 시세", colLabel: "산지" },
  variety: { title: "품종별 시세", colLabel: "품종" },
};

export function GroupRankingTable({ scope }: { scope: Scope }) {
  const f = useMarketFilter();
  const [sort, setSort] = useState<RankingSort>("price-desc");
  const [open, setOpen] = useState(false);

  const args = { itemId: f.itemId, varietyId: f.varietyId, unit: f.unit, date: f.date, sort };
  const rows: GroupRankingRow[] =
    scope === "company" ? getCompanyRankings(args)
    : scope === "origin" ? getOriginRankings(args)
    : getVarietyRankings(args);

  const cfg = CONFIG[scope];

  return (
    <section className="mt-3 bg-white px-4 pb-6 pt-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[15px] font-bold text-foreground">{cfg.title}</h3>
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-0.5 rounded-md text-[12.5px] font-semibold text-foreground"
        >
          {RANKING_SORT_LABEL[sort]}
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="overflow-hidden rounded-[10px] border border-[#E9ECEF]">
        <table className="w-full table-fixed text-[11.5px]">
          <colgroup>
            <col className="w-[26%]" />
            <col className="w-[20%]" />
            <col className="w-[14%]" />
            <col className="w-[14%]" />
            <col className="w-[14%]" />
            <col className="w-[12%]" />
          </colgroup>
          <thead>
            <tr className="bg-[#F8F9FA] text-[#6C757D]">
              <th className="py-2 pl-2 text-left font-semibold">{cfg.colLabel}</th>
              <th className="py-2 text-right font-semibold">현재가</th>
              <th className="py-2 text-right font-semibold">전일</th>
              <th className="py-2 text-right font-semibold">전주</th>
              <th className="py-2 text-right font-semibold">거래량</th>
              <th className="py-2 pr-2 text-right font-semibold">점유율</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-[#F1F3F5]">
                <td className="py-2.5 pl-2 align-top">
                  <div className="font-semibold text-foreground">{r.name}</div>
                  {r.subLabel && (
                    <div className="mt-0.5 text-[10px] text-[#ADB5BD]">{r.subLabel}</div>
                  )}
                </td>
                <td className="py-2.5 text-right font-bold text-foreground">
                  {r.price.toLocaleString()}
                </td>
                <td className={cn("py-2.5 text-right font-semibold", colorOf(r.prevPct))}>
                  {fmt(r.prevPct)}
                </td>
                <td className={cn("py-2.5 text-right font-semibold", colorOf(r.weekPct))}>
                  {fmt(r.weekPct)}
                </td>
                <td className="py-2.5 text-right text-foreground">{r.volumeTon.toFixed(1)}t</td>
                <td className="py-2.5 pr-2 text-right text-[#495057]">{r.sharePct.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl p-0">
          <SheetHeader className="px-5 pt-5">
            <SheetTitle className="text-[16px] font-bold">정렬</SheetTitle>
          </SheetHeader>
          <ul className="px-2 pb-6 pt-2">
            {SORTS.map((s) => {
              const active = s === sort;
              return (
                <li key={s}>
                  <button
                    onClick={() => { setSort(s); setOpen(false); }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-[10px] px-3 py-3 text-left text-[14px]",
                      active ? "bg-[#F0F9F0] font-bold text-[#1F5C1F]" : "text-foreground",
                    )}
                  >
                    {RANKING_SORT_LABEL[s]}
                    {active && <Check className="h-4 w-4 text-[#3A8A3A]" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </SheetContent>
      </Sheet>
    </section>
  );
}

function fmt(v: number): string {
  if (v === 0) return "0%";
  return `${v > 0 ? "+" : ""}${v.toFixed(1)}%`;
}
function colorOf(v: number): string {
  if (v > 0) return "text-[#E03131]";
  if (v < 0) return "text-[#1971C2]";
  return "text-[#6C757D]";
}
