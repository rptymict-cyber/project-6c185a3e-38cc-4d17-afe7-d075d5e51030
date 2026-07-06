import { useState } from "react";
import { cn } from "@/lib/utils";
import { PriceBadge } from "@/components/price-badge";
import { DataSourceNotice } from "@/components/home/DataSourceNotice";

const GRADES = [
  { name: "특", price: 3120, changePct: 8.2, volumeTon: 228.4, color: "#E03131" },
  { name: "상", price: 2840, changePct: 6.1, volumeTon: 295.6, color: "#3A8A3A" },
  { name: "중", price: 2410, changePct: -1.3, volumeTon: 221.8, color: "#1971C2" },
];

const SPECS = [
  { name: "10kg망", price: 2840, changePct: 8.2 },
  { name: "8kg", price: 2680, changePct: 6.4 },
  { name: "원단위", price: 2520, changePct: 5.1 },
];

const VARIETIES = [
  { name: "배추(일반)", price: 2840, changePct: 8.2 },
  { name: "얼갈이배추", price: 2420, changePct: 6.8 },
  { name: "봄배추", price: 2760, changePct: 7.3 },
  { name: "저장배추", price: 2380, changePct: -2.1 },
];

export function MarketGradeSpecView() {
  const [mode, setMode] = useState<"grade" | "variety">("grade");

  return (
    <div className="px-4 pt-3 pb-40">
      <div className="mb-3 flex rounded-full bg-[#F1F3F5] p-0.5 text-[12px] font-semibold">
        {(["grade", "variety"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              "flex-1 rounded-full py-1.5",
              mode === m ? "bg-[#3A8A3A] text-white" : "text-muted-foreground",
            )}
          >
            {m === "grade" ? "등급 비교" : "품종 비교"}
          </button>
        ))}
      </div>

      {mode === "grade" ? (
        <>
          <h3 className="mb-2 text-[14px] font-bold">등급별 평균 시세</h3>
          <div className="mb-4 grid grid-cols-3 gap-2">
            {GRADES.map((g) => (
              <div
                key={g.name}
                className="rounded-[12px] border border-[#E9ECEF] bg-background p-3 text-center"
              >
                <div
                  className="mx-auto grid h-8 w-8 place-items-center rounded-full text-[13px] font-bold text-white"
                  style={{ backgroundColor: g.color }}
                >
                  {g.name}
                </div>
                <div className="mt-2 font-data text-[15px] font-bold tabular-nums">
                  {g.price.toLocaleString()}
                </div>
                <div className="text-[10px] text-muted-foreground">원/kg</div>
                <div className="mt-1 flex justify-center">
                  <PriceBadge changePct={g.changePct} />
                </div>
                <div className="mt-1 text-[10px] text-muted-foreground">
                  거래량 {g.volumeTon.toFixed(1)}t
                </div>
              </div>
            ))}
          </div>

          <h3 className="mb-2 text-[14px] font-bold">규격별 비교</h3>
          <div className="mb-4 grid grid-cols-3 gap-2">
            {SPECS.map((s) => (
              <div
                key={s.name}
                className="rounded-[12px] border border-[#E9ECEF] bg-background p-3 text-center"
              >
                <div className="text-[12px] font-semibold text-foreground">{s.name}</div>
                <div className="mt-1 font-data text-[14px] font-bold tabular-nums">
                  {s.price.toLocaleString()}
                  <span className="ml-0.5 text-[10px] font-medium text-muted-foreground">
                    원/kg
                  </span>
                </div>
                <div className="mt-1 flex justify-center">
                  <PriceBadge changePct={s.changePct} />
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <h3 className="mb-2 text-[14px] font-bold">품종별 비교</h3>
          <div className="grid grid-cols-2 gap-2">
            {VARIETIES.map((v) => (
              <div
                key={v.name}
                className="rounded-[12px] border border-[#E9ECEF] bg-background p-3"
              >
                <div className="text-[13px] font-semibold text-foreground">{v.name}</div>
                <div className="mt-1 font-data text-[15px] font-bold tabular-nums">
                  {v.price.toLocaleString()}
                  <span className="ml-0.5 text-[10px] font-medium text-muted-foreground">
                    원/kg
                  </span>
                </div>
                <div className="mt-1 flex">
                  <PriceBadge changePct={v.changePct} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="mt-4 rounded-[12px] bg-[#F0F9F0] p-3 text-[12px] leading-relaxed text-[#1F5C1F]">
        같은 등급과 유사 규격 기준으로 비교됩니다.
        <br />
        일부 품종은 표본 수가 적어 변동률이 크게 보일 수 있습니다.
      </div>

      <DataSourceNotice />
    </div>
  );
}
