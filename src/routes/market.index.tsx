import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { AppHeader } from "@/components/app-header";
import { BottomNav } from "@/components/bottom-nav";
import { MarketSearchBar } from "@/components/market-v2/MarketSearchBar";
import { MarketFilterBar } from "@/components/market-v2/MarketFilterBar";
import { ProPriceHeadlineCard } from "@/components/market-v2/ProPriceHeadlineCard";
import { ProAnalysisSection } from "@/components/market-v2/ProAnalysisSection";
import { getMarketQuote } from "@/lib/mock/market-analysis";
import { useMarketFilter } from "@/store/market";

void BottomNav;

export const Route = createFileRoute("/market/")({
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
  const f = useMarketFilter();
  const quote = getMarketQuote({
    itemId: f.itemId,
    varietyId: f.varietyId,
    marketId: f.marketId,
    unit: f.unit,
    date: f.date,
  });

  return (
    <AppShell header={<AppHeader title="시세 조회" />}>
      <MarketSearchBar />
      <MarketFilterBar />

      {/* Common headline card */}
      <div className="px-4">
        <ProPriceHeadlineCard
          itemId={f.itemId}
          itemLabel={f.itemLabel}
          varietyLabel={f.varietyLabel}
          marketLabel={f.marketLabel}
          varietyId={f.varietyId}
          quote={quote}
        />
      </div>

      <ProAnalysisSection />
    </AppShell>
  );
}
