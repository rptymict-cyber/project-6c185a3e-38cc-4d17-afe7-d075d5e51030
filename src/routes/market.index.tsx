import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { AppHeader } from "@/components/app-header";
import { MarketListHome } from "@/components/market/MarketListHome";
import { MarketCropDetailHeader } from "@/components/market/MarketCropDetailHeader";
import { MarketDetailTabs } from "@/components/market/MarketDetailTabs";
import { MarketChartView } from "@/components/market/MarketChartView";
import { MarketAuctionView } from "@/components/market/MarketAuctionView";
import { MarketCompareView } from "@/components/market/MarketCompareView";
import { MarketOriginView } from "@/components/market/MarketOriginView";
import { MarketGradeSpecView } from "@/components/market/MarketGradeSpecView";
import { MarketStickyActions } from "@/components/market/MarketStickyActions";
import { TOP_CROPS, type MarketDetailTab } from "@/components/market/types";

export const Route = createFileRoute("/market/")({
  validateSearch: (s: Record<string, unknown>) => ({
    crop: (s.crop as string | undefined) || undefined,
    tab: (s.tab as MarketDetailTab | undefined) || undefined,
  }),
  component: MarketPage,
  head: () => ({
    meta: [
      { title: "시세 — AGDICT" },
      { name: "description", content: "품목별·도매시장별 농산물 시세를 한눈에 확인하세요." },
    ],
  }),
});

function MarketPage() {
  const { crop, tab } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [detailTab, setDetailTab] = useState<MarketDetailTab>(tab ?? "chart");

  const selected = crop
    ? TOP_CROPS.find((c) => c.id === crop) ?? {
        id: crop,
        name: "배추",
        emoji: "🥬",
        market: "서울 가락시장",
        grade: "특",
        spec: "10kg망",
        pricePerKg: 2840,
        changePct: 8.2,
        volumeTon: 328.4,
      }
    : null;

  if (!selected) {
    return (
      <AppShell
        header={
          <>
            <AppHeader title="시세" />
            <div className="border-b border-[#F1F3F5] bg-background px-4 py-1.5 text-[11px] text-muted-foreground">
              기준일 2026.07.03 14:30 업데이트
            </div>
          </>
        }
      >
        <MarketListHome
          onSelectCrop={(id) => {
            setDetailTab("chart");
            navigate({ search: { crop: id, tab: "chart" } });
          }}
          onOpenAuction={() => {
            setDetailTab("auction");
            navigate({ search: { crop: "cabbage", tab: "auction" } });
          }}
        />
      </AppShell>
    );
  }

  const goBack = () => navigate({ search: { crop: undefined, tab: undefined } });

  return (
    <AppShell
      header={
        <>
          <MarketCropDetailHeader
            cropName={selected.name}
            grade={selected.grade}
            spec={selected.spec}
            pricePerKg={selected.pricePerKg}
            diff={215}
            changePct={selected.changePct}
            baseMarket={selected.market}
            onBack={goBack}
          />
          <MarketDetailTabs value={detailTab} onChange={setDetailTab} />
        </>
      }
    >
      {detailTab === "chart" && (
        <MarketChartView cropId={selected.id} onJumpTab={setDetailTab} />
      )}
      {detailTab === "auction" && <MarketAuctionView />}
      {detailTab === "compare" && <MarketCompareView />}
      {detailTab === "origin" && <MarketOriginView />}
      {detailTab === "grade" && <MarketGradeSpecView />}

      <MarketStickyActions cropId={selected.id} />
    </AppShell>
  );
}
