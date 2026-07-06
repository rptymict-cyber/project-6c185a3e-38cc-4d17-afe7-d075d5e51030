import { useState } from "react";
import { ArrowLeft, Bell, MoreHorizontal, Star } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function MarketCropDetailHeader({
  cropName,
  grade = "특",
  spec = "10kg망",
  pricePerKg = 2840,
  diff = 215,
  changePct = 8.2,
  baseMarket = "서울 가락시장",
  baseAt = "2026.07.03 14:30",
  onBack,
}: {
  cropName: string;
  grade?: string;
  spec?: string;
  pricePerKg?: number;
  diff?: number;
  changePct?: number;
  baseMarket?: string;
  baseAt?: string;
  onBack: () => void;
}) {
  const [unit, setUnit] = useState<"kg" | "mang">("kg");
  const [starred, setStarred] = useState(false);

  const displayPrice = unit === "kg" ? pricePerKg : pricePerKg * 10;
  const unitLabel = unit === "kg" ? "원/kg" : "원/10kg망";

  return (
    <>
      <header className="sticky top-0 z-30 flex h-[52px] items-center justify-between border-b border-[#E9ECEF] bg-background px-1">
        <button
          onClick={onBack}
          className="grid h-10 w-10 place-items-center rounded-full hover:bg-secondary"
          aria-label="뒤로"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-bold">{cropName}</span>
          <span className="rounded-md bg-[#F0F9F0] px-1.5 py-0.5 text-[10px] font-bold text-[#3A8A3A]">
            {grade} · {spec}
          </span>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => {
              setStarred((v) => !v);
              toast(starred ? "관심 품목에서 제거했어요" : "관심 품목에 추가했어요");
            }}
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-secondary"
            aria-label="관심"
          >
            <Star
              className={cn("h-5 w-5", starred && "fill-[#F59F00] text-[#F59F00]")}
            />
          </button>
          <button
            onClick={() => toast("알림 설정은 준비 중입니다")}
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-secondary"
            aria-label="알림"
          >
            <Bell className="h-5 w-5" />
          </button>
          <button
            onClick={() => toast("옵션은 준비 중입니다")}
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-secondary"
            aria-label="더보기"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* 가격 요약 */}
      <section className="px-4 pt-3 pb-3">
        <div className="flex items-end justify-between gap-2">
          <div>
            <div className="font-data text-[28px] font-black leading-none tabular-nums text-foreground">
              {displayPrice.toLocaleString()}
              <span className="ml-1 text-[13px] font-semibold text-muted-foreground">
                {unitLabel}
              </span>
            </div>
            <div className="mt-1.5 text-[12px] font-semibold text-[#E03131]">
              전주 대비 ▲ {diff.toLocaleString()}원 (+{changePct.toFixed(1)}%)
            </div>
          </div>
          <div className="flex rounded-full bg-[#F1F3F5] p-0.5 text-[11px] font-semibold">
            {(["kg", "mang"] as const).map((u) => (
              <button
                key={u}
                onClick={() => setUnit(u)}
                className={cn(
                  "rounded-full px-3 py-1",
                  unit === u ? "bg-[#3A8A3A] text-white" : "text-muted-foreground",
                )}
              >
                {u === "kg" ? "원/kg" : "원/망"}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-1.5 text-[11px] text-muted-foreground">
          {baseMarket} · {baseAt} 기준
        </div>
      </section>
    </>
  );
}
