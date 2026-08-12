import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronRight, MapPin } from "lucide-react";
import { toast } from "sonner";
import {
  marketsByRegion,
  nearestMarket,
  DEFAULT_MARKET,
} from "@/lib/mock/markets";
import { useLocation } from "@/store/location";

export function MarketsPanel() {
  const regions = marketsByRegion();
  const navigate = useNavigate();
  const granted = useLocation((s) => s.granted);
  const request = useLocation((s) => s.request);
  const pending = useLocation((s) => s.pending);
  const isFallback = granted !== true;

  const findNearest = async () => {
    const ok = await request();
    if (!ok) {
      toast(
        `위치 권한이 없어 기본 시장(${DEFAULT_MARKET.name}) 기준으로 보여드려요.`,
      );
      navigate({
        to: "/market/wholesale/$market",
        params: { market: DEFAULT_MARKET.id },
      });
      return;
    }
    const c = useLocation.getState().coords;
    if (!c) {
      toast(
        `현재 위치를 확인할 수 없어 기본 시장(${DEFAULT_MARKET.name}) 기준으로 보여드려요.`,
      );
      navigate({
        to: "/market/wholesale/$market",
        params: { market: DEFAULT_MARKET.id },
      });
      return;
    }
    const m = nearestMarket(c.lat, c.lng);
    toast(`가장 가까운 도매시장: ${m.name}`);
    navigate({ to: "/market/wholesale/$market", params: { market: m.id } });
  };

  return (
    <div className="pb-4">
      <div className="px-4 pt-4">
        <button
          onClick={findNearest}
          disabled={pending}
          className="flex w-full items-center justify-center gap-2 rounded-[12px] py-3 text-[13.5px] font-bold text-[#3A8A3A] disabled:opacity-60"
          style={{
            border: "1.5px solid #3A8A3A",
            backgroundColor: "#3A8A3A0D",
          }}
        >
          <MapPin className="h-4 w-4" />
          가장 가까운 도매시장 찾기
        </button>
        {isFallback ? (
          <p className="mt-2 text-center text-[11.5px] text-[#6C757D]">
            위치 권한이 없어 기본 시장 <b className="font-semibold text-[#495057]">{DEFAULT_MARKET.name}</b> 기준으로
            보여드려요. 권한을 허용하면 가까운 시장으로 전환돼요.
          </p>
        ) : null}
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
