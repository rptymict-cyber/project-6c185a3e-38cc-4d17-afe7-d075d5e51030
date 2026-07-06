import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { AppHeader } from "@/components/app-header";
import { BottomNav } from "@/components/bottom-nav";
import { MarketSearchBar } from "@/components/market-v2/MarketSearchBar";
import { SegmentTabs } from "@/components/market-v2/SegmentTabs";
import { ItemsPanel } from "@/components/market-v2/ItemsPanel";
import { MarketsPanel } from "@/components/market-v2/MarketsPanel";
import { useMarketStore } from "@/store/market";

void BottomNav;

export const Route = createFileRoute("/market/")({
  // Accept any legacy search params silently so old links don't 404.
  validateSearch: () => ({}),
  component: MarketPage,
  head: () => ({
    meta: [
      { title: "시세 — AGDICT" },
      {
        name: "description",
        content: "품목별·도매시장별 농산물 시세를 한눈에 확인하세요.",
      },
    ],
  }),
});

function MarketPage() {
  const segment = useMarketStore((s) => s.segment);
  const setSegment = useMarketStore((s) => s.setSegment);

  return (
    <AppShell header={<AppHeader title="농산물 시세 조회" />}>
      <MarketSearchBar />
      <SegmentTabs value={segment} onChange={setSegment} />
      {segment === "items" ? <ItemsPanel /> : <MarketsPanel />}
    </AppShell>
  );
}

