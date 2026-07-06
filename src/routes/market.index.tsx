import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { AppHeader } from "@/components/app-header";
import { BottomNav } from "@/components/bottom-nav";
import { MarketSearchBar } from "@/components/market-v2/MarketSearchBar";
import { MarketFilterBar } from "@/components/market-v2/MarketFilterBar";
import { ProPriceHeadlineCard } from "@/components/market-v2/ProPriceHeadlineCard";
import { ProAnalysisSection } from "@/components/market-v2/ProAnalysisSection";
import { ProMarketRankingTable } from "@/components/market-v2/ProMarketRankingTable";
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

  return (
    <AppShell header={<AppHeader title="농산물 시세 조회" />}>
      <MarketSearchBar />
      <MarketFilterBar />

      <div className="mt-4 border-t-8 border-[#F1F3F5]">
        {f.simpleMode ? <SimpleModePlaceholder /> : <ProModeView />}
      </div>
    </AppShell>
  );
}

function SimpleModePlaceholder() {
  return (
    <div className="px-4 py-10 text-center">
      <div className="text-[13px] font-semibold text-[#3A8A3A]">간편 모드</div>
      <div className="mt-2 text-[13px] text-[#6C757D]">
        선택한 조건의 시세가 이곳에 표시됩니다.
      </div>
    </div>
  );
}

function ProModeView() {
  const f = useMarketFilter();
  const quote = getMarketQuote({
    itemId: f.itemId,
    varietyId: f.varietyId,
    marketId: f.marketId,
    unit: f.unit,
    date: f.date,
  });
  return (
    <div className="bg-[#F1F3F5] pb-6">
      <ProPriceHeadlineCard
        itemId={f.itemId}
        itemLabel={f.itemLabel}
        varietyLabel={f.varietyLabel}
        marketLabel={f.marketLabel}
        cropId={f.itemId}
        quote={quote}
      />
      <ProAnalysisSection />
      <ProMarketRankingTable />
    </div>
  );
}
