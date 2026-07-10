import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AppHeader } from "@/components/app-header";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { MARKETS } from "@/lib/mock/markets";
import { ITEMS } from "@/lib/mock/items";
import { CropIcon } from "@/components/crop-icon";
import { cn } from "@/lib/utils";

const DEFAULT_MARKET = "seoul-garak";

type WholesaleSearch = { m?: string };

export const Route = createFileRoute("/market/wholesale/")({
  validateSearch: (raw: Record<string, unknown>): WholesaleSearch => ({
    m: typeof raw.m === "string" ? raw.m : undefined,
  }),
  head: () => ({
    meta: [
      { title: "도매시장별 조회 — AGDICT" },
      {
        name: "description",
        content: "선택한 도매시장의 품목별 시세를 확인하세요.",
      },
    ],
  }),
  component: WholesaleBrowsePage,
});


function WholesaleBrowsePage() {
  const { m } = Route.useSearch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const market =
    MARKETS.find((x) => x.id === m) ??
    MARKETS.find((x) => x.id === DEFAULT_MARKET) ??
    MARKETS[0];

  // 시장별 품목 리스트 (mock) — 시장 오프셋으로 결정론적 가격
  const items = useMemo(() => {
    const offset = MARKETS.findIndex((x) => x.id === market.id);
    return ITEMS.map((it, i) => {
      const base = it.varieties[0]?.pricePerKg ?? 3000;
      const change = it.varieties[0]?.changePct ?? 0;
      const factor = 1 + ((offset + i) % 7) * 0.012;
      return {
        id: it.id,
        name: it.name,
        priceKg: Math.round(base * factor),
        changePct: +(change + ((offset - 1) * 0.3)).toFixed(1),
      };
    });
  }, [market.id]);

  const grouped = useMemo(() => {
    return MARKETS.reduce<Record<string, typeof MARKETS>>((acc, x) => {
      (acc[x.region] = acc[x.region] || []).push(x);
      return acc;
    }, {});
  }, []);

  const selectMarket = (id: string) => {
    setOpen(false);
    navigate({
      to: "/market/wholesale",
      search: { m: id },
      replace: true,
    });
  };

  return (
    <AppShell
      header={
        <AppHeader
          title="도매시장별 조회"
          showRefresh={false}
          showBell={false}
          showSearch
        />
      }
    >
      <div className="px-4 pb-8 pt-3">
        {/* 선택 시장 드롭다운 */}
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-[12px] border border-[#E9ECEF] bg-white px-4 py-3.5 text-left active:bg-[#F8F9FA]"
            >
              <div className="min-w-0">
                <div className="text-[11px] font-semibold text-[#3A8A3A]">
                  선택된 도매시장
                </div>
                <div className="mt-0.5 text-[16px] font-bold text-foreground">
                  {market.name}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {market.region}
                </div>
              </div>
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            </button>
          </DrawerTrigger>
          <DrawerContent className="mx-auto max-h-[80vh] max-w-[430px] bg-background">
            <div className="mx-auto mt-2 h-1 w-8 rounded-full bg-[#E9ECEF]" />
            <div className="px-4 pb-3 pt-3">
              <h3 className="text-center text-[15px] font-bold text-foreground">
                도매시장 선택
              </h3>
            </div>
            <div className="overflow-y-auto px-4 pb-6">
              {Object.entries(grouped).map(([region, list]) => (
                <section key={region} className="mb-4">
                  <h4 className="mb-1.5 px-1 text-[12px] font-bold text-muted-foreground">
                    {region}
                  </h4>
                  <ul className="overflow-hidden rounded-[10px] bg-surface">
                    {list.map((x) => {
                      const active = x.id === market.id;
                      return (
                        <li key={x.id}>
                          <button
                            type="button"
                            onClick={() => selectMarket(x.id)}
                            className={cn(
                              "flex w-full items-center justify-between border-t border-[#F1F3F5] px-3 py-3 text-left first:border-t-0",
                              active && "bg-[#F0F9F0]",
                            )}
                          >
                            <div>
                              <div
                                className={cn(
                                  "text-[14px] font-semibold text-foreground",
                                  active && "text-[#3A8A3A]",
                                )}
                              >
                                {x.name}
                              </div>
                              <div className="text-[11px] text-muted-foreground">
                                {x.region}
                              </div>
                            </div>
                            {active && (
                              <Check className="h-4 w-4 text-[#3A8A3A]" />
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          </DrawerContent>
        </Drawer>

        {/* 품목 리스트 */}
        <h3 className="mb-2 mt-6 px-1 text-[12px] font-bold text-muted-foreground">
          {market.name} 거래 품목
        </h3>
        <ul className="overflow-hidden rounded-[10px] bg-surface">
          {items.map((it, idx) => {
            const up = it.changePct >= 0;
            return (
              <li key={it.id}>
                <Link
                  to="/market/wholesale/$market"
                  params={{ market: market.id }}
                  className={cn(
                    "flex items-center gap-3 border-t border-[#F1F3F5] px-3 py-3.5",
                    idx === 0 && "border-t-0",
                  )}
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#F0F9F0]">
                    <CropIcon name={it.name} size={24} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[14px] font-semibold text-foreground">
                      {it.name}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      kg당 평균
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-data text-[14px] font-bold tabular-nums text-foreground">
                      {it.priceKg.toLocaleString()}원
                    </div>
                    <div
                      className={cn(
                        "text-[11px] font-semibold tabular-nums",
                        up ? "text-[#DC2626]" : "text-[#2563EB]",
                      )}
                    >
                      {up ? "▲" : "▼"} {Math.abs(it.changePct).toFixed(1)}%
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </AppShell>
  );
}
