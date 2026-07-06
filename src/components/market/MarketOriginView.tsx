import { cn } from "@/lib/utils";
import { PriceBadge } from "@/components/price-badge";
import { DataSourceNotice } from "@/components/home/DataSourceNotice";

const ORIGINS = [
  { rank: 1, name: "강원 평창", price: 3120, share: 26.1, volumeTon: 1042, changePct: 8.5, color: "#F59F00" },
  { rank: 2, name: "전남 해남", price: 2860, share: 21.8, volumeTon: 872, changePct: 6.7, color: "#40C057" },
  { rank: 3, name: "충북 괴산", price: 2740, share: 17.6, volumeTon: 703, changePct: -2.3, color: "#228BE6" },
  { rank: 4, name: "경기 포천", price: 2620, share: 14.2, volumeTon: 568, changePct: 1.2, color: "#E64980" },
  { rank: 5, name: "전북 고창", price: 2520, share: 10.3, volumeTon: 412, changePct: 0.8, color: "#7950F2" },
];

export function MarketOriginView() {
  return (
    <div className="px-4 pt-3 pb-40">
      <div className="no-scrollbar mb-3 flex gap-1.5 overflow-x-auto">
        {["이번 주", "주산지", "출하지", "거래량순"].map((f, i) => (
          <button
            key={f}
            className={cn(
              "shrink-0 rounded-full px-3 py-1 text-[12px] font-semibold",
              i === 0 ? "bg-[#3A8A3A] text-white" : "bg-[#F1F3F5] text-muted-foreground",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <h3 className="mb-2 text-[14px] font-bold">주산지 시세</h3>
      <ul className="mb-4 overflow-hidden rounded-[12px] border border-[#E9ECEF]">
        {ORIGINS.map((o, i) => (
          <li
            key={o.rank}
            className={cn(
              "grid grid-cols-[24px_1fr_auto] items-center gap-2 bg-background px-3 py-3",
              i > 0 && "border-t border-[#F1F3F5]",
            )}
          >
            <span className="text-center text-[13px] font-bold text-muted-foreground tabular-nums">
              {o.rank}
            </span>
            <div className="min-w-0">
              <div className="text-[14px] font-semibold text-foreground">{o.name}</div>
              <div className="text-[11px] text-muted-foreground">
                점유율 {o.share.toFixed(1)}% · {o.volumeTon.toLocaleString()}t
              </div>
            </div>
            <div className="text-right">
              <div className="font-data text-[14px] font-bold tabular-nums">
                {o.price.toLocaleString()}
                <span className="ml-0.5 text-[10px] font-medium text-muted-foreground">
                  원/kg
                </span>
              </div>
              <div className="mt-0.5 flex justify-end">
                <PriceBadge changePct={o.changePct} />
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="rounded-[12px] border border-[#E9ECEF] bg-background p-3">
        <div className="mb-2 text-[13px] font-bold">주산지 비중</div>
        <div className="flex h-3 overflow-hidden rounded-full">
          {ORIGINS.map((o) => (
            <div
              key={o.rank}
              style={{ width: `${o.share}%`, backgroundColor: o.color }}
            />
          ))}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px]">
          {ORIGINS.map((o) => (
            <div key={o.rank} className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span
                  className="h-2 w-2 rounded-sm"
                  style={{ backgroundColor: o.color }}
                />
                {o.name}
              </span>
              <span className="font-semibold tabular-nums text-foreground">
                {o.share.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 rounded-[12px] bg-[#F0F9F0] p-3 text-[12px] leading-relaxed text-[#1F5C1F]">
        같은 품목과 유사 규격 기준으로 비교됩니다.
        <br />
        일부 산지는 표본 수가 적어 변동률이 크게 보일 수 있습니다.
      </div>

      <DataSourceNotice />
    </div>
  );
}
