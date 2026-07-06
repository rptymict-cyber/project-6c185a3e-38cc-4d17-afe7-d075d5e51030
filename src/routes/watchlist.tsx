import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { AppHeader } from "@/components/app-header";
import { CROPS } from "@/lib/mock/crops";
import { MARKETS } from "@/lib/mock/markets";
import { PriceBadge } from "@/components/price-badge";
import { Sparkline } from "@/components/sparkline";
import { SwipeReorderList } from "@/components/swipe-reorder-list";
import { useWatchlist } from "@/store/watchlist";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/watchlist")({
  component: WatchlistPage,
  head: () => ({
    meta: [
      { title: "즐겨찾기 — AGDICT" },
      { name: "description", content: "자주 보는 품목과 시장을 한 곳에서." },
    ],
  }),
});

function WatchlistPage() {
  const [tab, setTab] = useState<"crop" | "market">("crop");
  const cropIds = useWatchlist((s) => s.crops);
  const marketIds = useWatchlist((s) => s.markets);
  const removeCrop = useWatchlist((s) => s.removeCrop);
  const removeMarket = useWatchlist((s) => s.removeMarket);
  const setCropOrder = useWatchlist((s) => s.setCropOrder);
  const setMarketOrder = useWatchlist((s) => s.setMarketOrder);
  const navigate = useNavigate();

  const savedCrops = cropIds
    .map((id) => CROPS.find((c) => c.id === id))
    .filter(Boolean) as typeof CROPS;
  const savedMarkets = marketIds
    .map((id) => MARKETS.find((m) => m.id === id))
    .filter(Boolean) as typeof MARKETS;

  return (
    <AppShell
      header={
        <>
          <AppHeader title="즐겨찾기" />
          <div className="sticky top-[52px] z-20 flex border-b border-border bg-background">
            {(
              [
                { id: "crop", label: `품목 ${cropIds.length}` },
                { id: "market", label: `시장 ${marketIds.length}` },
              ] as const
            ).map((t) => {
              const active = t.id === tab;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "relative flex-1 py-3 text-[14px] font-semibold",
                    active ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {t.label}
                  {active && (
                    <span className="absolute inset-x-0 -bottom-px h-[2px] bg-[#3A8A3A]" />
                  )}
                </button>
              );
            })}
          </div>
        </>
      }
    >
      {tab === "crop" ? (
        savedCrops.length === 0 ? (
          <WatchEmpty />
        ) : (
          <SwipeReorderList
            items={savedCrops.map((c) => ({
              id: c.id,
              render: () => <CropRow crop={c} onOpen={() => navigate({ to: "/market/$crop", params: { crop: c.id } })} />,
            }))}
            onDelete={(id) => {
              removeCrop(id);
              toast("즐겨찾기에서 제거되었습니다");
            }}
            onReorder={(ids) => setCropOrder(ids)}
          />
        )
      ) : savedMarkets.length === 0 ? (
        <WatchEmpty />
      ) : (
        <SwipeReorderList
          items={savedMarkets.map((m) => ({
            id: m.id,
            render: () => (
              <MarketRow
                market={m}
                onOpen={() => navigate({ to: "/market", search: { tab: "market" } })}
              />
            ),
          }))}
          onDelete={(id) => {
            removeMarket(id);
            toast("즐겨찾기에서 제거되었습니다");
          }}
          onReorder={(ids) => setMarketOrder(ids)}
        />
      )}
    </AppShell>
  );
}

function CropRow({
  crop,
  onOpen,
}: {
  crop: (typeof CROPS)[number];
  onOpen: () => void;
}) {
  const changePct = ((crop.currentPrice - crop.prevPrice) / crop.prevPrice) * 100;
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full items-center gap-3 px-4 py-3 text-left"
    >
      <span className="text-2xl" aria-hidden>
        {crop.emoji}
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[15px] font-bold text-foreground">
          {crop.name}
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span className="font-data text-[15px] font-bold tabular-nums text-foreground">
            {crop.currentPrice.toLocaleString()}
          </span>
          <span className="text-[11px] text-muted-foreground">{crop.unit}</span>
          <PriceBadge changePct={changePct} />
        </div>
      </div>
      <div className="h-10 w-[80px] shrink-0">
        <Sparkline data={crop.spark} up={changePct >= 0} />
      </div>
    </button>
  );
}

function MarketRow({
  market,
  onOpen,
}: {
  market: (typeof MARKETS)[number];
  onOpen: () => void;
}) {
  const pct = ((market.avgKg - market.prevAvgKg) / market.prevAvgKg) * 100;
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full items-center gap-3 px-4 py-3 text-left"
    >
      <div className="min-w-0 flex-1">
        <div className="truncate text-[15px] font-semibold text-foreground">
          {market.name}
        </div>
        <div className="text-[11px] text-muted-foreground">{market.region}</div>
      </div>
      <div className="text-right">
        <div className="font-data text-[15px] font-bold tabular-nums">
          {market.avgKg.toLocaleString()}
        </div>
        <PriceBadge changePct={pct} />
      </div>
    </button>
  );
}

function WatchEmpty() {
  return (
    <div className="flex flex-col items-center px-6 pb-16 pt-24 text-center">
      <Star
        className="mb-5"
        size={48}
        color="#E9ECEF"
        fill="#E9ECEF"
        strokeWidth={1.5}
      />
      <h3 className="text-[16px] font-bold text-foreground">즐겨찾기가 없어요</h3>
      <p className="mt-2 text-[13px] text-muted-foreground">
        홈에서 작물 카드의 ★를 눌러 추가해보세요
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-[#3A8A3A] px-6 py-2.5 text-[14px] font-bold text-white"
      >
        홈으로 가기
      </Link>
    </div>
  );
}
