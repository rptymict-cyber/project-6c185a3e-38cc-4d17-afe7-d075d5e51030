import { createFileRoute } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { BottomNav } from "@/components/bottom-nav";
import { MarketSearchBar } from "@/components/market-v2/MarketSearchBar";
import { SegmentTabs } from "@/components/market-v2/SegmentTabs";
import { ItemsPanel } from "@/components/market-v2/ItemsPanel";
import { MarketsPanel } from "@/components/market-v2/MarketsPanel";
import { MarketQuickMarketSection } from "@/components/market/MarketQuickMarketSection";
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
    <AppShell
      header={
        <header className="sticky top-0 z-30 flex h-[52px] items-center justify-between border-b border-[#E9ECEF] bg-background px-4">
          <span className="text-[20px] font-bold text-foreground">시세</span>
          <button
            aria-label="알림"
            onClick={() => toast("알림은 준비 중이에요")}
            className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary"
          >
            <Bell className="h-5 w-5" />
          </button>
        </header>
      }
    >
      <MarketSearchBar />
      <SegmentTabs value={segment} onChange={setSegment} />
      {segment === "items" ? <ItemsPanel /> : <MarketsPanel />}
    </AppShell>
  );
}
