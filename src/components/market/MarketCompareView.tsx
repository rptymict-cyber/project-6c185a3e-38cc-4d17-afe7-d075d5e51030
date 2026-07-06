import { cn } from "@/lib/utils";
import { PriceBadge } from "@/components/price-badge";
import { DataSourceNotice } from "@/components/home/DataSourceNotice";

const MARKETS = [
  { rank: 1, name: "대구 북부시장", price: 3120, changePct: 9.1, volumeTon: 318 },
  { rank: 2, name: "서울 가락시장", price: 2840, changePct: 8.2, volumeTon: 295.6, current: true },
  { rank: 3, name: "부산 엄궁시장", price: 2720, changePct: 7.4, volumeTon: 210 },
  { rank: 4, name: "대전 오정시장", price: 2620, changePct: 6.5, volumeTon: 182 },
  { rank: 5, name: "광주 서부시장", price: 2560, changePct: 6.1, volumeTon: 158 },
  { rank: 6, name: "안양 농수산물시장", price: 2400, changePct: 4.3, volumeTon: 140 },
];

export function MarketCompareView() {
  const prices = MARKETS.map((m) => m.price);
  const avg = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
  const spread = Math.max(...prices) - Math.min(...prices);
  const top = MARKETS[0];

  return (
    <div className="px-4 pt-3 pb-40">
      <div className="no-scrollbar mb-3 flex gap-1.5 overflow-x-auto">
        {["오늘", "10개 시장", "가격순", "카드/표"].map((f, i) => (
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

      <div className="mb-3 grid grid-cols-3 gap-2 rounded-[12px] border border-[#E9ECEF] bg-background p-3 text-center">
        <Cell label="최고 시장" value={top.name} />
        <Cell label="평균 가격" value={`${avg.toLocaleString()}원/kg`} />
        <Cell label="가격 편차" value={`${spread.toLocaleString()}원/kg`} />
      </div>

      <ul className="space-y-2">
        {MARKETS.map((m) => (
          <li
            key={m.rank}
            className={cn(
              "flex items-center gap-3 rounded-[12px] border bg-background px-3 py-3",
              m.current ? "border-[#3A8A3A] bg-[#F0F9F0]" : "border-[#E9ECEF]",
            )}
          >
            <span className="w-5 text-center text-[13px] font-bold text-muted-foreground tabular-nums">
              {m.rank}
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[14px] font-semibold text-foreground">
                {m.name}
                {m.current && (
                  <span className="ml-1.5 text-[10px] font-bold text-[#3A8A3A]">현재 기준</span>
                )}
              </div>
              <div className="text-[11px] text-muted-foreground">
                거래량 {m.volumeTon.toLocaleString()}t
              </div>
            </div>
            <div className="text-right">
              <div className="font-data text-[15px] font-bold tabular-nums">
                {m.price.toLocaleString()}
                <span className="ml-0.5 text-[10px] font-medium text-muted-foreground">
                  원/kg
                </span>
              </div>
              <div className="mt-0.5 flex justify-end">
                <PriceBadge changePct={m.changePct} />
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4 rounded-[12px] bg-[#F8F9FA] p-3 text-[12px]">
        <div className="mb-2 font-bold text-foreground">시장별 가격 흐름 (1주)</div>
        <div className="flex items-end justify-between h-24 gap-1">
          {[65, 70, 72, 75, 74, 78, 82].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
              <div className="w-full rounded-t bg-[#3A8A3A]" style={{ height: `${h}%` }} />
              <div className="w-full rounded-t bg-[#E03131]" style={{ height: `${h - 8}%` }} />
              <div className="w-full rounded-t bg-[#1971C2]" style={{ height: `${h - 15}%` }} />
            </div>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-3 text-[10px]">
          <Legend color="#3A8A3A" label="서울 가락" />
          <Legend color="#E03131" label="대구 북부" />
          <Legend color="#1971C2" label="부산 엄궁" />
        </div>
      </div>

      <DataSourceNotice />
    </div>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-[13px] font-bold tabular-nums text-foreground">{value}</div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1 text-muted-foreground">
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}
