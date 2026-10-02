import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { DetailHeader } from "@/components/detail-header";
import { useBackTo } from "@/hooks/useBackTo";
import { MarketSheet } from "@/components/market-v2/MarketSheet";
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
  const goBack = useBackTo("/market");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const market =
    MARKETS.find((x) => x.id === m) ??
    MARKETS.find((x) => x.id === DEFAULT_MARKET) ??
    MARKETS[0];

  // 시장별 품목 리스트 (mock) — 시장 오프셋으로 결정론적 가격, 가격 높은 순 정렬(순위 표시)
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
    }).sort((a, b) => b.priceKg - a.priceKg);
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
    <AppShell screenId="MKT-005_도매시장목록"
      header={
        <DetailHeader title="도매시장별 조회" onBack={goBack} />
      }
    >
      <div className="px-4 pb-8 pt-3">
        {/* 선택 시장 드롭다운 */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-between rounded-[12px] border border-[#E9ECEF] bg-white px-4 py-3.5 text-left active:bg-[#F8F9FA]"
        >
          <div className="min-w-0">
            <div className="text-meta font-semibold text-[#3A8A3A]">도매시장</div>
            <div className="mt-0.5 text-subtitle font-bold text-foreground">{market.name}</div>
            <div className="text-meta text-muted-foreground">{market.region}</div>
          </div>
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        </button>
        <MarketSheet
          open={open}
          onOpenChange={setOpen}
          value={market.id}
          onSelect={(id) => selectMarket(id)}
          includeAll={false}
        />

        {/* 품목 리스트 */}
        <h3 className="mb-2 mt-6 px-1 text-caption font-bold text-muted-foreground">
          {market.name} 거래 품목 <span className="font-semibold">(높은 가격순)</span>
        </h3>
        <ul className="overflow-hidden rounded-[10px] bg-surface">
          <li className="grid grid-cols-[28px_1fr_auto] items-center gap-3 border-b border-[#F1F3F5] bg-[#FAFBFC] px-3 py-1.5 text-meta font-semibold text-muted-foreground">
            <span />
            <span>품목</span>
            <span className="text-right">현재가</span>
          </li>
          {items.map((it, idx) => {
            const up = it.changePct >= 0;
            return (
              <li key={it.id}>
                <Link
                  to="/market/wholesale/$market"
                  params={{ market: market.id }}
                  className="flex items-center gap-3 border-t border-[#F1F3F5] px-3 py-3.5"
                >
                  <span className="w-7 shrink-0 text-center text-caption font-bold tabular-nums text-[#3A8A3A]">
                    {idx + 1}
                  </span>
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#F0F9F0]">
                    <CropIcon name={it.name} size={28} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-body font-semibold text-foreground">
                      {it.name}
                    </div>
                    <div className="text-meta text-muted-foreground">
                      kg당 평균
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-data text-body font-bold tabular-nums text-foreground">
                      {it.priceKg.toLocaleString()}원
                    </div>
                    <div
                      className={cn(
                        "text-meta font-semibold tabular-nums",
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
