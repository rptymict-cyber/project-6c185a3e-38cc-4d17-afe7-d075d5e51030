import { createFileRoute, useRouter, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ITEMS } from "@/lib/mock/items";
import type { Item, Variety } from "@/lib/mock/items";

export const Route = createFileRoute("/price/$variety")({
  loader: ({ params }) => {
    let found: { item: Item; variety: Variety } | null = null;
    for (const item of ITEMS) {
      const v = item.varieties.find((x) => x.id === params.variety);
      if (v) {
        found = { item, variety: v };
        break;
      }
    }
    if (!found) throw notFound();
    return found;
  },
  component: PriceDetailPage,
  notFoundComponent: () => (
    <div className="p-8 text-center text-muted-foreground">품종을 찾을 수 없어요.</div>
  ),
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "품종 시세 — AGDICT" }, { name: "robots", content: "noindex" }] };
    }
    return {
      meta: [
        { title: `${loaderData.item.name} ${loaderData.variety.name} 시세 — AGDICT` },
        {
          name: "description",
          content: `${loaderData.item.name} ${loaderData.variety.name}의 kg당 실시간 시세와 등락률.`,
        },
      ],
    };
  },
});

function PriceDetailPage() {
  const { item, variety } = Route.useLoaderData();
  const router = useRouter();
  const up = variety.changePct > 0;
  const flat = Math.abs(variety.changePct) < 0.05;
  const color = flat ? "#6C757D" : up ? "#E03131" : "#1971C2";

  return (
    <AppShell
      header={
        <header className="sticky top-0 z-30 flex h-[52px] items-center gap-2 border-b border-[#E9ECEF] bg-background px-2">
          <button
            aria-label="뒤로"
            onClick={() => router.history.back()}
            className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="flex-1 truncate text-[17px] font-bold">
            {item.emoji} {item.name} · {variety.name}
          </span>
        </header>
      }
    >
      <div className="px-4 pt-4">
        <div className="rounded-[12px] bg-[#F8F9FA] p-4">
          <div className="text-[12px] text-[#6C757D]">kg당 평균가</div>
          <div className="mt-1 font-data text-[28px] font-bold tabular-nums text-foreground">
            {variety.pricePerKg.toLocaleString()}원
          </div>
          <div className="mt-1 text-[13px] font-bold tabular-nums" style={{ color }}>
            {flat
              ? "— 0.0%"
              : `${up ? "▲ +" : "▼ "}${variety.changePct.toFixed(1)}% (전일대비)`}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-[12px]">
            <div className="rounded-lg bg-white p-3">
              <div className="text-[#6C757D]">오늘 거래량</div>
              <div className="mt-1 font-data text-[15px] font-bold tabular-nums">
                {variety.volumeTon.toLocaleString()}톤
              </div>
            </div>
            <div className="rounded-lg bg-white p-3">
              <div className="text-[#6C757D]">거래량 변화</div>
              <div className="mt-1 font-data text-[15px] font-bold tabular-nums">
                {variety.volumePctChange > 0 ? "+" : ""}
                {variety.volumePctChange}%
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-[12px] text-[#6C757D]">
          상세 그래프·경매내역은 준비 중이에요.
        </div>
      </div>
    </AppShell>
  );
}
