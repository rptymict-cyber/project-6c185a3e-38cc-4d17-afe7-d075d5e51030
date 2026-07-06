import { cn } from "@/lib/utils";
import { PriceBadge } from "@/components/price-badge";
import { DataSourceNotice } from "@/components/home/DataSourceNotice";

const FILTERS = ["오늘", "도매시장", "법인", "등급", "규격", "더보기"];

const ROWS = [
  { time: "14:28", market: "서울 가락시장", corp: "대아청과", grade: "특", spec: "10kg망", qty: 320, price: 28600, kg: 2860, changePct: 1.4 },
  { time: "14:19", market: "서울 가락시장", corp: "동화청과", grade: "특", spec: "10kg망", qty: 300, price: 28200, kg: 2820, changePct: 0.7 },
  { time: "14:10", market: "서울 가락시장", corp: "한국청과", grade: "특", spec: "10kg망", qty: 280, price: 28000, kg: 2800, changePct: -0.4 },
  { time: "14:02", market: "서울 가락시장", corp: "서울청과", grade: "특", spec: "10kg망", qty: 310, price: 28400, kg: 2840, changePct: 0 },
  { time: "13:55", market: "서울 가락시장", corp: "대아청과", grade: "특", spec: "10kg망", qty: 280, price: 27800, kg: 2780, changePct: -1.1 },
];

export function MarketAuctionView() {
  const total = ROWS.reduce((s, r) => s + r.qty, 0);
  const avgPrice = Math.round(ROWS.reduce((s, r) => s + r.price, 0) / ROWS.length);
  const avgKg = Math.round(ROWS.reduce((s, r) => s + r.kg, 0) / ROWS.length);

  return (
    <div className="px-4 pt-3 pb-40">
      <div className="no-scrollbar mb-3 flex gap-1.5 overflow-x-auto">
        {FILTERS.map((f, i) => (
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

      <div className="mb-3 grid grid-cols-4 gap-2 rounded-[12px] border border-[#E9ECEF] bg-background p-3 text-center">
        <SummaryCell label="최근 낙찰가" value="2,860" unit="원/kg" />
        <SummaryCell label="최고가" value="3,160" unit="원/kg" />
        <SummaryCell label="최저가" value="2,420" unit="원/kg" />
        <SummaryCell label="누적 거래량" value="5,860" unit="망" sub="58,600kg" />
      </div>

      <h3 className="mb-2 text-[14px] font-bold">실시간 경매내역</h3>
      <ul className="space-y-2">
        {ROWS.map((r, i) => (
          <li key={i} className="rounded-[12px] border border-[#E9ECEF] bg-background p-3">
            <div className="flex items-center gap-2">
              <span className="font-data text-[13px] font-bold tabular-nums">{r.time}</span>
              <span className="rounded-md bg-[#F0F9F0] px-1.5 py-0.5 text-[10px] font-bold text-[#3A8A3A]">
                낙찰
              </span>
              <span className="ml-auto font-data text-[15px] font-bold tabular-nums">
                {r.price.toLocaleString()}원
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[12px] text-muted-foreground">
              <span className="truncate">
                {r.market} · {r.corp} · {r.grade} {r.spec} · {r.qty}망
              </span>
              <span className="flex items-center gap-1.5">
                <span className="font-data font-semibold text-foreground">
                  {r.kg.toLocaleString()}원/kg
                </span>
                <PriceBadge changePct={r.changePct} />
              </span>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4 rounded-[12px] bg-[#F8F9FA] p-3 text-[12px]">
        <div className="mb-1 font-bold text-foreground">시간대별 체결 흐름</div>
        <div className="flex items-end justify-between gap-1 h-16">
          {[8, 12, 14, 11, 16, 13, 10].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t bg-[#3A8A3A]/70"
              style={{ height: `${h * 5}%` }}
            />
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
          <span>총 수량 <b className="text-foreground">{total}망</b></span>
          <span>건당 <b className="text-foreground">{avgPrice.toLocaleString()}원</b></span>
          <span>kg당 <b className="text-foreground">{avgKg.toLocaleString()}원</b></span>
        </div>
      </div>

      <DataSourceNotice />
    </div>
  );
}

function SummaryCell({
  label,
  value,
  unit,
  sub,
}: {
  label: string;
  value: string;
  unit: string;
  sub?: string;
}) {
  return (
    <div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-data text-[13px] font-bold tabular-nums">
        {value}
        <span className="ml-0.5 text-[10px] font-medium text-muted-foreground">{unit}</span>
      </div>
      {sub && <div className="text-[10px] text-muted-foreground">{sub}</div>}
    </div>
  );
}
