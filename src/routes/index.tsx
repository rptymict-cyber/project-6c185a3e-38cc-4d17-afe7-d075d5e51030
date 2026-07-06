import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { HomeSearchHeader } from "@/components/home/HomeSearchHeader";
import {
  HomeCategoryTabs,
  type HomeCategory,
} from "@/components/home/HomeCategoryTabs";
import { TodayMarketBanner } from "@/components/home/TodayMarketBanner";
import { TodayPriceBoard } from "@/components/home/TodayPriceBoard";
import { RealtimeCropRanking } from "@/components/home/RealtimeCropRanking";
import { AgricultureThemeSection } from "@/components/home/AgricultureThemeSection";
import { MarketHotSection } from "@/components/home/MarketHotSection";
import { PredictablePriceCTA } from "@/components/home/PredictablePriceCTA";
import { DataSourceNotice } from "@/components/home/DataSourceNotice";
import { CROPS, type Crop } from "@/lib/mock/crops";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AGDICT — 오늘의 농산물 시세" },
      {
        name: "description",
        content:
          "실시간 농산물 도매 시세를 한눈에. 품목·시장·산지별 가격 흐름과 급등락 랭킹을 모바일에서 바로 확인하세요.",
      },
      { property: "og:title", content: "AGDICT — 오늘의 농산물 시세" },
      {
        property: "og:description",
        content:
          "실시간 농산물 도매 시세를 한눈에. 품목·시장·산지별 가격 흐름과 급등락 랭킹을 모바일에서 바로 확인하세요.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Home,
});

function pickBoard(category: HomeCategory): Crop[] {
  const byId = (id: string) => CROPS.find((c) => c.id === id)!;
  if (category === "vegetable")
    return ["cabbage", "lettuce", "radish", "potato"].map(byId);
  if (category === "fruit") return ["apple", "pear", "grape", "cabbage"].map(byId);
  if (category === "seasoning")
    return ["onion", "garlic", "chili", "cabbage"].map(byId);
  if (category === "grain") return ["rice", "barley", "soybean", "redbean"].map(byId);
  if (category === "predict") return CROPS.filter((c) => c.aiReady).slice(0, 4);
  return ["cabbage", "apple", "onion", "radish"].map(byId);
}

function Home() {
  const [category, setCategory] = useState<HomeCategory>("all");
  const board = pickBoard(category);

  return (
    <AppShell
      header={
        <>
          <HomeSearchHeader />
          <HomeCategoryTabs value={category} onChange={setCategory} />
        </>
      }
    >
      <TodayMarketBanner />
      <TodayPriceBoard crops={board} />
      <RealtimeCropRanking />
      <AgricultureThemeSection />
      <MarketHotSection />
      <PredictablePriceCTA />
      <DataSourceNotice />
    </AppShell>
  );
}
