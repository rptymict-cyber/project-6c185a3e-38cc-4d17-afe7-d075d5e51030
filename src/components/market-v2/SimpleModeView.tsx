import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useMarketFilter } from "@/store/market";
import { listAuctions, summarize } from "@/lib/mock/auctions";
import { SimpleViewToggle } from "./SimpleViewToggle";
import { cn } from "@/lib/utils";

export function SimpleModeView() {
  const f = useMarketFilter();
  const setSimpleMode = useMarketFilter((s) => s.setSimpleMode);
  const setProTab = useMarketFilter((s) => s.setProTab);

  const rows = useMemo(
    () =>
      listAuctions({
        categoryLabel: f.categoryLabel,
        itemLabel: f.itemLabel,
        varietyLabel: f.varietyLabel,
        marketLabel: f.marketLabel,
        marketId: f.marketId,
        date: f.date,
      }),
    [f.categoryLabel, f.itemLabel, f.varietyLabel, f.marketLabel, f.marketId, f.date],
  );

  const summary = useMemo(() => summarize(rows), [rows]);
  const volumeTon = useMemo(
    () =>
      +(rows.reduce((s, r) => s + r.packageKg * r.count, 0) / 1000).toFixed(1),
    [rows],
  );
  const recent = rows.slice(0, 3);
  const dateLabel = f.date.replaceAll("-", ".");

  const goAllAuctions = () => {
    setProTab("auctions");
    setSimpleMode(false);
  };

  return (
    <section className="px-4 pb-8 pt-4">
      {/* Common header — matches table view */}
      <div>
        <div className="flex items-baseline gap-2">
          <h3 className="text-[15px] font-bold text-foreground">경매내역</h3>
          <span className="text-[15px] font-black text-[#3A8A3A]">
            총 {rows.length}건
          </span>
        </div>
        <div className="mt-1 text-[11.5px] text-[#868E96]">
          {dateLabel} 기준 · {f.marketLabel} · {f.corpLabel} 법인
        </div>
      </div>

      {/* Summary — same 3-cell layout as table view */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        <SummaryCell label="평균가" value={`${summary.avgPrice.toLocaleString()}원`} />
        <SummaryCell label="거래량" value={`${volumeTon}t`} />
        <SummaryCell label="kg당" value={`${summary.avgPricePerKg.toLocaleString()}원`} />
      </div>

      {/* View mode toggle — right-aligned chip */}
      <div className="mt-3 flex justify-end">
        <SimpleViewToggle
          value={f.simpleViewMode}
          onChange={f.setSimpleViewMode}
        />
      </div>

      {/* Recent 3 auctions */}
      <div className="mt-5 flex items-center justify-between">
        <h3 className="text-[13.5px] font-bold text-foreground">최근 경매 3건</h3>
        <button
          type="button"
          onClick={goAllAuctions}
          className="flex items-center gap-0.5 text-[12px] font-semibold text-[#3A8A3A]"
        >
          전체보기
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <ul className="mt-2 divide-y divide-[#F1F3F5] overflow-hidden rounded-[12px] border border-[#E9ECEF] bg-white">
        {recent.map((r) => {
          const mmdd = r.auctionDate.slice(5).replace("-", "/");
          return (
            <li key={r.id}>
              <Link
                to="/market/auction/$id"
                params={{ id: r.id }}
                className="flex items-center gap-3 px-3.5 py-3 active:bg-[#F8F9FA]"
              >
                <div className="w-[54px] shrink-0 text-[11px] leading-tight text-[#868E96]">
                  <div>{mmdd}</div>
                  <div>{r.auctionClock}</div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[15px] font-bold text-[#E03131]">
                      {r.price.toLocaleString()}원
                    </span>
                    <span className="text-[11.5px] text-[#868E96]">
                      수량 {r.count}건 · {r.packageLabel}
                    </span>
                  </div>
                  <div className="mt-0.5 truncate text-[11.5px] text-[#495057]">
                    {r.origin} · {r.corporationName}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-[#ADB5BD]" />
              </Link>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={goAllAuctions}
        className="mt-3 flex h-11 w-full items-center justify-center gap-1 rounded-[10px] border border-[#E9ECEF] bg-white text-[13px] font-semibold text-[#495057]"
      >
        경매내역 전체보기 ({rows.length}건)
        <ChevronRight className="h-4 w-4" />
      </button>
    </section>
  );
}

function SummaryCell({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "up" | "down";
}) {
  const color =
    tone === "up" ? "text-[#E03131]" : tone === "down" ? "text-[#1971C2]" : "text-foreground";
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-[10px] border border-[#E9ECEF] bg-white px-2 py-2.5">
      <span className="text-[10.5px] text-[#868E96]">{label}</span>
      <span className={cn("text-[13px] font-bold", color)}>{value}</span>
    </div>
  );
}
