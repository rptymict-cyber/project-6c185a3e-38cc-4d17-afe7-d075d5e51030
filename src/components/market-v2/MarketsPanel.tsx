import { Link } from "@tanstack/react-router";
import { ChevronRight, MapPin } from "lucide-react";
import { toast } from "sonner";
import { marketsByRegion } from "@/lib/mock/markets";

export function MarketsPanel() {
  const regions = marketsByRegion();

  return (
    <div className="pb-4">
      <div className="px-4 pt-4">
        <button
          onClick={() => toast("위치 권한을 확인 중이에요 (준비 중)")}
          className="flex w-full items-center justify-center gap-2 rounded-[12px] py-3 text-[13.5px] font-bold text-[#3A8A3A]"
          style={{
            border: "1.5px solid #3A8A3A",
            backgroundColor: "#3A8A3A0D",
          }}
        >
          <MapPin className="h-4 w-4" />
          가장 가까운 도매시장 찾기
        </button>
      </div>

      <div className="mt-3">
        {regions.map(([region, list]) => (
          <section key={region}>
            <h3 className="bg-[#F8F9FA] px-4 py-2 text-[12px] font-bold text-[#6C757D]">
              {region}
            </h3>
            <ul>
              {list.map((m) => {
                const itemCount = 60 + Math.round(m.volumeTon / 40);
                return (
                  <li key={m.id} className="border-b border-[#F1F3F5]">
                    <Link
                      to="/market/wholesale/$market"
                      params={{ market: m.id }}
                      className="flex items-center gap-3 px-4 py-3.5 active:bg-[#F8F9FA]"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-[15.5px] font-bold text-foreground">
                          {m.name}
                        </div>
                        <div className="mt-0.5 text-[12px] text-[#6C757D]">
                          오늘 거래 {itemCount}개 품목 · {m.volumeTon.toLocaleString()}톤
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-[#ADB5BD]" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
