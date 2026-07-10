import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AppHeader } from "@/components/app-header";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { ITEMS, ITEM_CATEGORIES } from "@/lib/mock/items";
import { MARKETS } from "@/lib/mock/markets";
import { CropIcon } from "@/components/crop-icon";
import { cn } from "@/lib/utils";

const DEFAULT_ITEM = "apple";

type ItemSearch = { item?: string };

export const Route = createFileRoute("/market/item/")({
  validateSearch: (raw: Record<string, unknown>): ItemSearch => ({
    item: typeof raw.item === "string" ? raw.item : undefined,
  }),
  head: () => ({
    meta: [
      { title: "품목별 조회 — AGDICT" },
      {
        name: "description",
        content: "선택한 품목의 시장·품종별 시세를 확인하세요.",
      },
    ],
  }),
  component: ItemBrowsePage,
});

function ItemBrowsePage() {
  const { item: itemParam } = Route.useSearch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const item =
    ITEMS.find((x) => x.id === itemParam) ??
    ITEMS.find((x) => x.id === DEFAULT_ITEM) ??
    ITEMS[0];

  // 시장별 시세 (mock) — 품목 인덱스로 결정론적 오프셋
  const marketRows = useMemo(() => {
    const itemIdx = ITEMS.findIndex((x) => x.id === item.id);
    const base = item.varieties[0]?.pricePerKg ?? 3000;
    const change = item.varieties[0]?.changePct ?? 0;
    return MARKETS.map((mk, i) => {
      const factor = 1 + (((itemIdx + i) % 7) - 3) * 0.015;
      return {
        id: mk.id,
        name: mk.name,
        region: mk.region,
        priceKg: Math.round(base * factor),
        changePct: +(change + (i - 2) * 0.4).toFixed(1),
      };
    });
  }, [item.id]);

  const grouped = useMemo(() => {
    const cats = ITEM_CATEGORIES.filter((c) => c.id !== "all");
    return cats.map((c) => ({
      cat: c,
      list: ITEMS.filter((it) => it.category === c.id),
    }));
  }, []);

  const selectItem = (id: string) => {
    setOpen(false);
    navigate({
      to: "/market/item",
      search: { item: id },
      replace: true,
    });
  };

  return (
    <AppShell
      header={<AppHeader title="품목별 조회" showRefresh={false} showBell={false} showSearch />}
    >
      <div className="px-4 pb-8 pt-3">
        {/* 선택 품목 드롭다운 */}
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-[12px] border border-[#E9ECEF] bg-white px-4 py-3.5 text-left active:bg-[#F8F9FA]"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#F0F9F0]">
                  <CropIcon name={item.name} size={26} />
                </span>
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold text-[#3A8A3A]">
                    선택된 품목
                  </div>
                  <div className="mt-0.5 text-[16px] font-bold text-foreground">
                    {item.name}
                  </div>
                </div>
              </div>
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            </button>
          </DrawerTrigger>
          <DrawerContent className="mx-auto max-h-[80vh] max-w-[430px] bg-background">
            <div className="mx-auto mt-2 h-1 w-8 rounded-full bg-[#E9ECEF]" />
            <div className="px-4 pb-3 pt-3">
              <h3 className="text-center text-[15px] font-bold text-foreground">
                품목 선택
              </h3>
            </div>
            <div className="overflow-y-auto px-4 pb-6">
              {grouped.map(({ cat, list }) =>
                list.length === 0 ? null : (
                  <section key={cat.id} className="mb-4">
                    <h4 className="mb-1.5 px-1 text-[12px] font-bold text-muted-foreground">
                      {cat.label}
                    </h4>
                    <ul className="overflow-hidden rounded-[10px] bg-surface">
                      {list.map((x) => {
                        const active = x.id === item.id;
                        return (
                          <li key={x.id}>
                            <button
                              type="button"
                              onClick={() => selectItem(x.id)}
                              className={cn(
                                "flex w-full items-center gap-3 border-t border-[#F1F3F5] px-3 py-3 text-left first:border-t-0",
                                active && "bg-[#F0F9F0]",
                              )}
                            >
                              <span className="grid h-9 w-9 place-items-center rounded-lg bg-white">
                                <CropIcon name={x.name} size={22} />
                              </span>
                              <span
                                className={cn(
                                  "flex-1 text-[14px] font-semibold text-foreground",
                                  active && "text-[#3A8A3A]",
                                )}
                              >
                                {x.name}
                              </span>
                              {active && (
                                <Check className="h-4 w-4 text-[#3A8A3A]" />
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                ),
              )}
            </div>
          </DrawerContent>
        </Drawer>

        {/* 시장별 시세 리스트 */}
        <h3 className="mb-2 mt-6 px-1 text-[12px] font-bold text-muted-foreground">
          {item.name} 도매시장별 시세
        </h3>
        <ul className="overflow-hidden rounded-[10px] bg-surface">
          {marketRows.map((r, idx) => {
            const up = r.changePct >= 0;
            return (
              <li key={r.id}>
                <Link
                  to="/market/wholesale/$market"
                  params={{ market: r.id }}
                  className={cn(
                    "flex items-center gap-3 border-t border-[#F1F3F5] px-3 py-3.5",
                    idx === 0 && "border-t-0",
                  )}
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#F0F9F0] text-lg">
                    🏛️
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[14px] font-semibold text-foreground">
                      {r.name}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {r.region}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-data text-[14px] font-bold tabular-nums text-foreground">
                      {r.priceKg.toLocaleString()}원
                    </div>
                    <div
                      className={cn(
                        "text-[11px] font-semibold tabular-nums",
                        up ? "text-[#DC2626]" : "text-[#2563EB]",
                      )}
                    >
                      {up ? "▲" : "▼"} {Math.abs(r.changePct).toFixed(1)}%
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
