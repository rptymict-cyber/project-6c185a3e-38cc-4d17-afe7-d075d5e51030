import { createFileRoute, useRouter, notFound } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { DetailHeader } from "@/components/detail-header";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { MARKETS } from "@/lib/mock/markets";
import { ITEMS } from "@/lib/mock/items";
import { cn } from "@/lib/utils";
import { CropIcon } from "@/components/crop-icon";

export const Route = createFileRoute("/market/wholesale/$market")({
  loader: ({ params }) => {
    const market = MARKETS.find((m) => m.id === params.market);
    if (!market) throw notFound();
    return { market };
  },
  component: WholesaleDetailPage,
  notFoundComponent: () => (
    <div className="p-8 text-center text-muted-foreground">시장을 찾을 수 없어요.</div>
  ),
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "시장 — AGDICT" }, { name: "robots", content: "noindex" }] };
    }
    return {
      meta: [
        { title: `${loaderData.market.name} 시세 — AGDICT` },
        {
          name: "description",
          content: `${loaderData.market.name} 도매시장의 품목별 실시간 시세.`,
        },
      ],
    };
  },
});

// 시장별 크롭 칩 pool (mock: 상위 6개 품목)
const CROP_POOL = ITEMS.slice(0, 6);

// 법인별 mock 서브행: MARKETS의 companies 사용
function buildRows(cropId: string, market: (typeof MARKETS)[number]) {
  const item = ITEMS.find((i) => i.id === cropId) ?? ITEMS[0];
  const varieties = item.varieties;
  const total = varieties.reduce((s, v) => s + v.volumeTon, 0);
  const avg = Math.round(
    varieties.reduce((s, v) => s + v.pricePerKg * v.volumeTon, 0) / Math.max(1, total),
  );
  return {
    item,
    avg,
    total,
    rows: [
      { key: "all", label: "전체 평균", price: avg, changePct: varieties[0].changePct, volume: total, companies: [] },
      ...varieties.map((v) => ({
        key: v.id,
        label: `${item.name} · ${v.name}`,
        price: v.pricePerKg,
        changePct: v.changePct,
        volume: v.volumeTon,
        companies: market.companies.map((c, idx) => ({
          name: c.name,
          price: Math.round(v.pricePerKg * (1 + (idx - 1) * 0.03)),
          changePct: v.changePct + (idx - 1) * 0.4,
          volume: +(v.volumeTon / (market.companies.length + 0.5)).toFixed(1),
        })),
      })),
    ],
  };
}

function WholesaleDetailPage() {
  const { market } = Route.useLoaderData();
  const router = useRouter();
  const [selected, setSelected] = useState(CROP_POOL[0].id);
  const [expanded, setExpanded] = useState<string | null>(null);
  const data = buildRows(selected, market);

  return (
    <AppShell
      header={
        <DetailHeader
          title={market.name}
          onBack={() => router.history.back()}
          right={
            <span className="pr-2 text-[11px] text-[#6C757D]">07/03 07:00 기준</span>
          }
        />
      }
      bottom={
        <div className="fixed inset-x-0 bottom-[60px] z-30 mx-auto w-full max-w-[430px] border-t border-[#E9ECEF] bg-[#F8F9FA] px-4 py-2.5">
          <div className="flex items-center justify-between text-[12.5px]">
            <span className="text-[#6C757D]">
              {data.item.name} 총 거래량{" "}
              <span className="font-data font-bold tabular-nums text-foreground">
                {data.total.toLocaleString()}톤
              </span>
            </span>
            <span className="text-[#6C757D]">
              kg당 평균{" "}
              <span className="font-data font-bold tabular-nums text-foreground">
                {data.avg.toLocaleString()}원
              </span>
            </span>
          </div>
        </div>
      }
    >
      {/* 작물 칩 */}
      <div className="no-scrollbar flex gap-1.5 overflow-x-auto px-4 pb-1 pt-3">
        {CROP_POOL.map((c) => {
          const active = c.id === selected;
          return (
            <button
              key={c.id}
              onClick={() => {
                setSelected(c.id);
                setExpanded(null);
              }}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold",
                active ? "bg-[#3A8A3A] text-white" : "bg-[#F8F9FA] text-[#6C757D]",
              )}
            >
              <span className="inline-flex items-center gap-1">
                <CropIcon name={c.name} size={16} />
                {c.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* 테이블 */}
      <div className="mt-3 overflow-hidden border-y border-[#E9ECEF]">
        <div className="grid grid-cols-[1.6fr_1fr_1fr_0.9fr] bg-[#F8F9FA] px-3 py-2 text-[11px] font-bold text-[#6C757D]">
          <span>구분</span>
          <span className="text-right">평균가</span>
          <span className="text-right">전일대비</span>
          <span className="text-right">거래량</span>
        </div>
        {data.rows.map((r) => {
          const isAll = r.key === "all";
          const isOpen = expanded === r.key;
          const up = r.changePct > 0;
          const flat = Math.abs(r.changePct) < 0.05;
          const color = flat ? "#6C757D" : up ? "#E03131" : "#1971C2";
          return (
            <div key={r.key}>
              <button
                onClick={() => !isAll && setExpanded(isOpen ? null : r.key)}
                className={cn(
                  "grid w-full grid-cols-[1.6fr_1fr_1fr_0.9fr] items-center gap-1 px-3 py-3 text-left text-[13px] active:bg-[#F1F3F5]",
                  isAll && "bg-[#EBF6FD] font-bold",
                )}
              >
                <span className="flex items-center gap-1 truncate text-foreground">
                  {r.label}
                  {!isAll && (
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 shrink-0 text-[#ADB5BD] transition-transform",
                        isOpen && "rotate-180",
                      )}
                    />
                  )}
                </span>
                <span className="text-right font-data font-bold tabular-nums">
                  {r.price.toLocaleString()}
                </span>
                <span
                  className="text-right font-data font-bold tabular-nums"
                  style={{ color }}
                >
                  {flat ? "0.0%" : `${up ? "+" : ""}${r.changePct.toFixed(1)}%`}
                </span>
                <span className="text-right tabular-nums text-[#6C757D]">
                  {r.volume.toLocaleString()}t
                </span>
              </button>
              {!isAll && isOpen && (
                <div className="bg-[#F8F9FA]">
                  {r.companies.map((c) => {
                    const cUp = c.changePct > 0;
                    const cFlat = Math.abs(c.changePct) < 0.05;
                    const cColor = cFlat ? "#6C757D" : cUp ? "#E03131" : "#1971C2";
                    return (
                      <div
                        key={c.name}
                        className="grid grid-cols-[1.6fr_1fr_1fr_0.9fr] items-center gap-1 border-t border-[#E9ECEF] px-3 py-2.5 pl-6 text-[12.5px]"
                      >
                        <span className="truncate text-[#495057]">{c.name}</span>
                        <span className="text-right font-data font-bold tabular-nums">
                          {c.price.toLocaleString()}
                        </span>
                        <span
                          className="text-right font-data font-bold tabular-nums"
                          style={{ color: cColor }}
                        >
                          {cFlat ? "0.0%" : `${cUp ? "+" : ""}${c.changePct.toFixed(1)}%`}
                        </span>
                        <span className="text-right tabular-nums text-[#6C757D]">
                          {c.volume}t
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="h-16" />
    </AppShell>
  );
}
