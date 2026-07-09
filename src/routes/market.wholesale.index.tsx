import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { DetailHeader } from "@/components/detail-header";
import { MARKETS } from "@/lib/mock/markets";
import { useHomeFixed } from "@/store/homeFixedItems";
import { Check, Plus } from "lucide-react";

export const Route = createFileRoute("/market/wholesale/")({
  head: () => ({
    meta: [
      { title: "도매시장별 조회 — AGDICT" },
      { name: "description", content: "전국 도매시장 목록에서 원하는 시장을 선택하세요." },
    ],
  }),
  component: WholesaleIndexPage,
});

function WholesaleIndexPage() {
  const fixed = useHomeFixed((s) => s.markets);
  const addMarket = useHomeFixed((s) => s.addMarket);
  const removeMarket = useHomeFixed((s) => s.removeMarket);

  const grouped = MARKETS.reduce<Record<string, typeof MARKETS>>((acc, m) => {
    (acc[m.region] = acc[m.region] || []).push(m);
    return acc;
  }, {});

  return (
    <AppShell
      header={<DetailHeader title="도매시장별 조회" onBack={() => history.back()} />}
    >
      <div className="px-4 pb-8 pt-3">
        <p className="mb-3 text-[12px] text-muted-foreground">
          홈에 고정하려면 오른쪽 + 버튼을 눌러 추가하세요.
        </p>
        {Object.entries(grouped).map(([region, list]) => (
          <section key={region} className="mb-5">
            <h3 className="mb-2 text-[13px] font-bold text-foreground">{region}</h3>
            <ul className="overflow-hidden rounded-[10px] bg-surface">
              {list.map((m) => {
                const isFixed = fixed.includes(m.id);
                return (
                  <li
                    key={m.id}
                    className="flex items-center gap-2 border-t border-[#F1F3F5] px-3 py-3 first:border-t-0"
                  >
                    <Link
                      to="/market/wholesale/$market"
                      params={{ market: m.id }}
                      className="min-w-0 flex-1"
                    >
                      <div className="text-[14px] font-semibold text-foreground">{m.name}</div>
                      <div className="text-[11px] text-muted-foreground">{m.region}</div>
                    </Link>
                    <button
                      onClick={() => (isFixed ? removeMarket(m.id) : addMarket(m.id))}
                      className={
                        "grid h-8 w-8 place-items-center rounded-full " +
                        (isFixed ? "bg-[#3A8A3A] text-white" : "bg-[#F1F3F5] text-muted-foreground")
                      }
                      aria-label={isFixed ? "홈에서 제거" : "홈에 추가"}
                    >
                      {isFixed ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </AppShell>
  );
}
