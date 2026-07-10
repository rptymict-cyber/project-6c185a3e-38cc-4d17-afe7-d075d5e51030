import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Plus, RefreshCw, Search, Star, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { AppHeader } from "@/components/app-header";
import { cn } from "@/lib/utils";
import { CropIcon } from "@/components/crop-icon";
import { SwipeReorderList, type SRItem } from "@/components/swipe-reorder-list";
import { useFavoritePriceStore } from "@/features/favorites/favoriteStore";
import type { FavoritePriceItem } from "@/features/favorites/types";
import { useMarketFilter } from "@/store/market";

export const Route = createFileRoute("/watchlist")({
  component: WatchlistPage,
  head: () => ({
    meta: [
      { title: "즐겨찾기 — AGDICT" },
      {
        name: "description",
        content: "저장한 시세 조회 조건을 빠르게 다시 확인하세요.",
      },
    ],
  }),
});

function sortFavorites(items: FavoritePriceItem[]): FavoritePriceItem[] {
  return items.slice().sort((a, b) => {
    const ao = a.order;
    const bo = b.order;
    if (ao != null && bo != null) return ao - bo;
    if (ao != null) return -1;
    if (bo != null) return 1;
    // 등록순 fallback: 최근 등록이 위
    return a.createdAt > b.createdAt ? -1 : 1;
  });
}

function WatchlistPage() {
  const items = useFavoritePriceStore((s) => s.items);
  const removeFavorite = useFavoritePriceStore((s) => s.removeFavorite);
  const setOrder = useFavoritePriceStore((s) => s.setOrder);
  const [query, setQuery] = useState("");
  const [spinning, setSpinning] = useState(false);

  const sorted = useMemo(() => sortFavorites(items), [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter((it) =>
      [
        it.cropName,
        it.varietyName,
        it.marketName,
        it.corporationName,
        it.originName,
        it.unit,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [sorted, query]);

  const isSearching = query.trim().length > 0;

  const rightSlot = (
    <button
      type="button"
      aria-label="새로고침"
      onClick={() => {
        setSpinning(true);
        setTimeout(() => setSpinning(false), 700);
        toast("최신 시세로 업데이트했어요");
      }}
      className="grid h-9 w-9 place-items-center rounded-full text-foreground hover:bg-secondary"
    >
      <RefreshCw
        className={cn("h-5 w-5 transition-transform", spinning && "animate-spin")}
      />
    </button>
  );

  const rows: SRItem[] = filtered.map((it) => ({
    id: it.id,
    render: () => <FavoriteCardBody item={it} />,
  }));

  const handleReorder = (ids: string[]) => {
    // 검색 중이면 재정렬 대상이 부분집합이 되므로 무시.
    if (isSearching) return;
    setOrder(ids);
  };

  const handleDelete = (id: string) => {
    removeFavorite(id);
    toast("즐겨찾기에서 제거되었습니다");
  };

  return (
    <AppShell header={<AppHeader title="즐겨찾기" right={rightSlot} />}>
      <div className="px-4 pt-4">
        <h1 className="text-[22px] font-black tracking-tight text-foreground">
          즐겨찾기
        </h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          총{" "}
          <span className="font-semibold text-foreground">{items.length}</span>
          개의 저장한 시세 조건
        </p>
      </div>

      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="px-4 pt-3">
            <label className="flex h-11 items-center gap-2 rounded-xl border border-input bg-secondary/50 px-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="품목, 품종, 시장명으로 검색하세요"
                className="min-w-0 flex-1 bg-transparent text-[13.5px] outline-none placeholder:text-muted-foreground"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="지우기"
                  className="grid h-6 w-6 place-items-center rounded-full text-muted-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </label>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center px-6 pb-16 pt-16 text-center">
              <p className="text-[13px] text-muted-foreground">
                조건에 맞는 저장된 시세가 없어요
              </p>
            </div>
          ) : (
            <>
              <SwipeReorderList
                items={rows}
                onDelete={handleDelete}
                onReorder={handleReorder}
              />
              {!isSearching && filtered.length > 1 && (
                <p className="pb-6 text-center text-[12px] text-muted-foreground">
                  <span className="mr-1 tracking-tighter">⋮⋮</span>
                  를 드래그해 순서를 바꿀 수 있어요
                </p>
              )}
            </>
          )}
        </>
      )}

      <FabAdd />
    </AppShell>
  );
}

function FabAdd() {
  return (
    <Link
      to="/watchlist/add"
      aria-label="즐겨찾기 추가"
      className="fixed bottom-24 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg active:scale-95"
    >
      <Plus className="h-6 w-6" />
    </Link>
  );
}

function FavoriteCardBody({ item }: { item: FavoritePriceItem }) {
  const navigate = useNavigate();
  const setItem = useMarketFilter((s) => s.setItem);
  const setMarket = useMarketFilter((s) => s.setMarket);
  const setCorp = useMarketFilter((s) => s.setCorp);
  const setUnit = useMarketFilter((s) => s.setUnit);
  const rising = (item.changeRate ?? 0) >= 0;
  const flat = Math.abs(item.changeRate ?? 0) < 0.05;

  // "8kg 기준 기준" 중복 버그 방지: 저장된 unit 문자열에 이미 "기준"이 붙어있어도 한 번만 표기.
  const unitLabel = item.unit.replace(/\s*기준\s*$/, "");

  const handleOpen = () => {
    setItem({
      categoryId: "all",
      categoryLabel: "",
      itemId: item.cropId,
      itemLabel: item.cropName,
      varietyId: item.varietyId ?? item.cropId,
      varietyLabel: item.varietyName ?? item.cropName,
    });
    setMarket(item.marketId, item.marketName);
    setCorp(item.corporationId ?? "all", item.corporationName ?? "전체");
    setUnit(item.unit);
    navigate({
      to: "/price/$variety",
      params: { variety: item.varietyId ?? item.cropId },
    });
  };

  return (
    <div className="rounded-2xl border border-border bg-background p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <button
        type="button"
        onClick={handleOpen}
        className="block w-full text-left"
      >
        <div className="flex items-start gap-3">
          <div
            className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-muted"
            aria-hidden
          >
            <CropIcon name={item.cropName} size={28} />
          </div>
          <div className="min-w-0 flex-1">
            {item.isPredictable && (
              <div className="mb-1">
                <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                  AI 가격 예측
                </span>
              </div>
            )}
            <div className="truncate text-[15px] font-bold text-foreground">
              {item.cropName}
              {item.varietyName ? ` · ${item.varietyName}` : ""}
            </div>
            <div className="mt-0.5 truncate text-[12px] text-muted-foreground">
              {item.marketName} · {item.corporationName ?? "전체 법인"}
            </div>
            <div className="truncate text-[12px] text-muted-foreground">
              {item.originName ?? "전체 산지"} · {unitLabel} 기준
              {item.grade ? ` · ${item.grade}` : ""}
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-end justify-between gap-3 border-t border-border/60 pt-3">
          <div className="min-w-0">
            <div className="font-data text-[20px] font-bold leading-none tabular-nums text-foreground">
              {(item.price ?? 0).toLocaleString()}
              <span className="ml-1 text-[12px] font-medium text-muted-foreground">
                원 / {unitLabel}
              </span>
            </div>
            {item.kgPrice != null && item.kgPrice !== item.price && (
              <div className="mt-1 text-[11.5px] text-muted-foreground">
                kg당 {item.kgPrice.toLocaleString()}원
              </div>
            )}
            {item.totalVolume != null && (
              <div className="mt-1 text-[11px] text-muted-foreground">
                거래량 {item.totalVolume.toLocaleString()}t
                {item.auctionCount != null
                  ? ` · 경매 ${item.auctionCount}건`
                  : ""}
              </div>
            )}
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            <span
              className={cn(
                "inline-flex items-center whitespace-nowrap rounded-md px-2 py-1 text-[12px] font-bold tabular-nums",
                flat
                  ? "bg-muted text-muted-foreground"
                  : rising
                    ? "bg-[#FFE3E3] text-[#E03131]"
                    : "bg-[#DBE4FF] text-[#1971C2]",
              )}
            >
              {flat
                ? "— 0.0%"
                : `${rising ? "▲ +" : "▼ "}${(item.changeRate ?? 0).toFixed(1)}%`}
            </span>
            <span className="text-[10.5px] text-muted-foreground">
              전일 대비
            </span>
          </div>
        </div>
      </button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center px-6 pb-16 pt-20 text-center">
      <Star className="mb-5 text-[#B2DFB2]" size={48} strokeWidth={1.5} />
      <h3 className="text-[16px] font-bold text-foreground">
        저장한 시세 조건이 아직 없어요
      </h3>
      <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
        아래 + 버튼으로 관심 있는 품목과 시장을
        <br />
        직접 추가해 보세요.
      </p>
      <Link
        to="/watchlist/add"
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-[14px] font-bold text-primary-foreground"
      >
        즐겨찾기 추가
      </Link>
    </div>
  );
}
