import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useMemo, useState, type ReactNode } from "react";
import { ChevronDown, Sprout, Store } from "lucide-react";
import { applyMarketSelection } from "@/lib/goto-market";
import { AppShell } from "@/components/app-shell";
import { AppHeader } from "@/components/app-header";
import { getLiveTrades, type LiveTrade } from "@/lib/services/live-prices";
import { LiveTradeRowItem } from "@/components/market/LivePriceRow";
import { MarketSheet } from "@/components/market-v2/MarketSheet";
import { LoadMoreButton, LIST_PAGE_SIZE } from "@/components/common/LoadMoreButton";
import { useCropSelection } from "@/store/cropSelection";
import { getItemById } from "@/lib/catalog-service";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/live")({
  head: () => ({
    meta: [
      { title: "실시간 시세 — AGDICT" },
      {
        name: "description",
        content:
          "전국 도매시장에서 최근 거래된 농산물 시세를 최신 거래순으로 확인하세요.",
      },
      { property: "og:title", content: "실시간 시세 — AGDICT" },
      {
        property: "og:description",
        content:
          "전국 도매시장에서 최근 거래된 농산물 시세를 최신 거래순으로 확인하세요.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LivePage,
});

const PAGE_SIZE = LIST_PAGE_SIZE;

function LivePage() {
  const navigate = useNavigate({ from: "/live" });
  const [offset, setOffset] = useState(0);
  const [marketOpen, setMarketOpen] = useState(false);
  // "all"이면 전체 시장
  const [market, setMarket] = useState<{ id: string; label: string }>({
    id: "all",
    label: "전체 시장",
  });
  // 작물 조건은 앱 공통 작물 선택(/crop-select)의 확정값을 사용한다.
  const committedItemId = useCropSelection((s) => s.committed.itemId);
  const [cropAll, setCropAll] = useState(true);
  const cropItem = !cropAll && committedItemId ? getItemById(committedItemId) : undefined;
  const cropLabel = cropItem?.name ?? "전체 품목";

  const pageSize = PAGE_SIZE + offset;
  const { rows, total } = useMemo(
    () =>
      getLiveTrades({
        marketLabel: market.id === "all" ? undefined : market.label,
        cropId: cropItem?.name,
        limit: pageSize,
      }),
    [market, cropItem?.name, pageSize],
  );

  const handleSelect = useCallback(
    (trade: LiveTrade) => {
      applyMarketSelection(trade.id, { tab: "chart", marketLabel: trade.market });
      navigate({ to: "/market" });
    },
    [navigate],
  );

  return (
    <AppShell
      screenId="LIVE-001_실시간시세"
      header={<AppHeader title="실시간 시세" showBell={false} showSearch />}
    >
      <div className="px-4 pt-3">
        <div className="grid grid-cols-2 gap-2">
          <SelectorCard
            icon={<Store className="h-3.5 w-3.5" />}
            label="도매시장"
            value={market.label}
            onClick={() => setMarketOpen(true)}
          />
          <Link
            to="/crop-select"
            search={{ from: "live", return: "/live" }}
            onClick={() => {
              setCropAll(false);
              setOffset(0);
            }}
            className={CARD_CLASS}
          >
            <CardInner
              icon={<Sprout className="h-3.5 w-3.5" />}
              label="작물"
              value={cropLabel}
            />
          </Link>
        </div>

        <p className="mt-2 text-meta text-muted-foreground">
          가장 최근 거래부터 표시됩니다.
          {!cropAll && cropItem ? (
            <>
              {" · "}
              <button
                type="button"
                onClick={() => {
                  setCropAll(true);
                  setOffset(0);
                }}
                className="underline underline-offset-2"
              >
                전체 품목 보기
              </button>
            </>
          ) : null}
        </p>

        <div className="mt-2 overflow-hidden rounded-[10px] bg-surface">
          <ul>
            {rows.map((trade) => (
              <LiveTradeRowItem key={trade.key} trade={trade} onClick={handleSelect} />
            ))}
          </ul>
          {rows.length === 0 ? (
            <p className="px-3 py-8 text-center text-body text-muted-foreground">
              선택한 조건의 최근 거래가 없습니다.
            </p>
          ) : null}
        </div>
        {rows.length < total && (
          <LoadMoreButton onClick={() => setOffset((o) => o + PAGE_SIZE)} />
        )}
        <p className="mt-4 text-center text-meta text-muted-foreground">
          거래 시각과 정렬은 서버 기준입니다. 클라이언트에서 순서를 바꾸지 않습니다.
        </p>
      </div>

      <MarketSheet
        open={marketOpen}
        onOpenChange={setMarketOpen}
        value={market.id}
        onSelect={(id, label) => {
          setMarket({ id, label: id === "all" ? "전체 시장" : label });
          setOffset(0);
        }}
      />
    </AppShell>
  );
}

const CARD_CLASS = cn(
  "flex min-h-16 flex-col items-start gap-1 rounded-[12px] border border-[#E9ECEF] bg-white px-3 py-2.5 text-left",
  "active:bg-[#F8F9FA]",
);

function SelectorCard({
  icon,
  label,
  value,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className={CARD_CLASS}>
      <CardInner icon={icon} label={label} value={value} />
    </button>
  );
}

function CardInner({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <>
      <span className="flex items-center gap-1 text-meta font-medium text-[#868E96]">
        {icon}
        {label}
      </span>
      <span className="flex w-full items-center justify-between">
        <span className="truncate text-body font-bold text-foreground">{value}</span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[#ADB5BD]" />
      </span>
    </>
  );
}
