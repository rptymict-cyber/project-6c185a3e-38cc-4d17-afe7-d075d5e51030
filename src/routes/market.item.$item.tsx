import { createFileRoute, useRouter, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { VarietyRow } from "@/components/market-v2/VarietyRow";
import {
  getItem,
  itemAvgKg,
  itemTotalVolume,
  ITEM_CATEGORIES,
} from "@/lib/mock/items";
import { CropIcon } from "@/components/crop-icon";

export const Route = createFileRoute("/market/item/$item")({
  loader: ({ params }) => {
    const item = getItem(params.item);
    if (!item) throw notFound();
    return { item };
  },
  component: ItemVarietiesPage,
  notFoundComponent: () => (
    <div className="p-8 text-center text-muted-foreground">품목을 찾을 수 없어요.</div>
  ),
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "품목 — AGDICT" }, { name: "robots", content: "noindex" }] };
    }
    return {
      meta: [
        { title: `${loaderData.item.name} 품종별 시세 — AGDICT` },
        {
          name: "description",
          content: `${loaderData.item.name}의 품종별 실시간 시세와 등락률을 확인하세요.`,
        },
      ],
    };
  },
});

function ItemVarietiesPage() {
  const { item } = Route.useLoaderData();
  const router = useRouter();
  const total = itemTotalVolume(item);
  const avg = itemAvgKg(item);
  const catLabel = ITEM_CATEGORIES.find((c) => c.id === item.category)?.label ?? "";
  const sorted = [...item.varieties].sort((a, b) => b.volumeTon - a.volumeTon);

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
          <div className="flex min-w-0 flex-1 items-center gap-1.5">
            <CropIcon name={item.name} size={22} />
            <span className="truncate text-[17px] font-bold">
              {item.name}
            </span>
            <span
              className="shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold"
              style={{ color: "#3A8A3A", backgroundColor: "#3A8A3A1A" }}
            >
              {catLabel}
            </span>
          </div>
          <span className="shrink-0 pr-2 text-[11px] text-[#6C757D]">07/03 07:00 기준</span>
        </header>
      }
    >
      <div className="px-4 pt-3">
        <div className="grid grid-cols-3 rounded-[12px] bg-[#F8F9FA] px-2 py-3">
          {[
            { label: "오늘 총 거래량", value: `${total.toLocaleString()}t` },
            { label: "kg당 평균가", value: `${avg.toLocaleString()}원` },
            { label: "거래 품종", value: `${item.varieties.length}개` },
          ].map((k, i) => (
            <div
              key={k.label}
              className={i > 0 ? "border-l border-[#E9ECEF] px-2 text-center" : "px-2 text-center"}
            >
              <div className="text-[10.5px] font-semibold text-[#6C757D]">{k.label}</div>
              <div className="mt-1 font-data text-[14px] font-bold tabular-nums text-foreground">
                {k.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 px-4 pb-1">
        <span className="text-[12px] text-[#6C757D]">
          품종 {item.varieties.length} · 거래량순
        </span>
      </div>
      <ul className="divide-y divide-[#F1F3F5] border-y border-[#F1F3F5]">
        {sorted.map((v) => (
          <li key={v.id}>
            <VarietyRow variety={v} itemName={item.name} cropId={item.cropId} />
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
