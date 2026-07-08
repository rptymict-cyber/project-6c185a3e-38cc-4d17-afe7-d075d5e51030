import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, ChevronDown, Search, Star, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { AppHeader } from "@/components/app-header";
import { cn } from "@/lib/utils";
import { CropIcon } from "@/components/crop-icon";
import { useFavoritePriceStore } from "@/features/favorites/favoriteStore";
import type { FavoritePriceItem } from "@/features/favorites/types";
import { useMarketFilter } from "@/store/market";

type Filter = "all" | "ai";
type Sort = "updated" | "createdDesc" | "priceDesc" | "priceAsc";

const SORT_LABEL: Record<Sort, string> = {
  updated: "최근 업데이트순",
  createdDesc: "최근 저장순",
  priceDesc: "가격 높은순",
  priceAsc: "가격 낮은순",
};

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

function WatchlistPage() {
  const items = useFavoritePriceStore((s) => s.items);
  const removeFavorite = useFavoritePriceStore((s) => s.removeFavorite);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("updated");
  const [sortOpen, setSortOpen] = useState(false);

  const filtered = useMemo(() => {
    let arr = items.slice();
    if (filter === "ai") arr = arr.filter((it) => it.isPredictable);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      arr = arr.filter((it) =>
        [it.cropName, it.varietyName, it.marketName, it.corporationName, it.originName, it.unit]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q),
      );
    }
    if (sort === "priceDesc") arr.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    else if (sort === "priceAsc") arr.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    else if (sort === "createdDesc")
      arr.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
    else
      arr.sort((a, b) => ((b.updatedAt ?? "") > (a.updatedAt ?? "") ? 1 : -1));
    return arr;
  }, [items, filter, sort, query]);

  return (
    <AppShell header={<AppHeader title="농산물 시세 조회" />}>
      <div className="px-4 pt-4">
        <h1 className="text-[22px] font-black tracking-tight text-foreground">즐겨찾기</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          총 <span className="font-semibold text-foreground">{items.length}</span>개의
          저장한 시세 조건
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

          <div className="mt-3 flex items-center gap-2 px-4">
            <div className="flex flex-1 items-center gap-2">
              {(
                [
                  ["all", "전체"],
                  ["ai", "AI 가격 예측"],
                ] as const
              ).map(([id, label]) => {
                const active = filter === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setFilter(id)}
                    className={cn(
                      "h-8 rounded-full border px-3 text-[12.5px] font-semibold",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input bg-background text-foreground",
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setSortOpen(!sortOpen)}
                className="inline-flex h-8 items-center gap-1 rounded-full border border-input bg-background px-3 text-[12px] font-semibold text-foreground"
              >
                {SORT_LABEL[sort]}
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {sortOpen && (
                <>
                  <button
                    type="button"
                    aria-label="닫기"
                    onClick={() => setSortOpen(false)}
                    className="fixed inset-0 z-40"
                  />
                  <ul className="absolute right-0 top-9 z-50 w-[160px] overflow-hidden rounded-lg border border-border bg-background shadow-md">
                    {(Object.keys(SORT_LABEL) as Sort[]).map((s) => (
                      <li key={s}>
                        <button
                          type="button"
                          onClick={() => {
                            setSort(s);
                            setSortOpen(false);
                          }}
                          className={cn(
                            "flex w-full items-center justify-between px-3 py-2.5 text-[12.5px]",
                            sort === s ? "font-bold text-primary" : "text-foreground",
                          )}
                        >
                          {SORT_LABEL[s]}
                          {sort === s && <Check className="h-3.5 w-3.5" />}
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center px-6 pb-16 pt-16 text-center">
              <p className="text-[13px] text-muted-foreground">
                조건에 맞는 저장된 시세가 없어요
              </p>
            </div>
          ) : (
            <ul className="space-y-2 px-4 py-4">
              {filtered.map((it) => (
                <FavoriteCard
                  key={it.id}
                  item={it}
                  onRemove={() => {
                    removeFavorite(it.id);
                    toast("즐겨찾기에서 제거되었습니다");
                  }}
                />
              ))}
            </ul>
          )}
        </>
      )}
    </AppShell>
  );
}

function FavoriteCard({
  item,
  onRemove,
}: {
  item: FavoritePriceItem;
  onRemove: () => void;
}) {
  const navigate = useNavigate();
  const setItem = useMarketFilter((s) => s.setItem);
  const setMarket = useMarketFilter((s) => s.setMarket);
  const setCorp = useMarketFilter((s) => s.setCorp);
  const setUnit = useMarketFilter((s) => s.setUnit);
  const rising = (item.changeRate ?? 0) >= 0;
  const flat = Math.abs(item.changeRate ?? 0) < 0.05;

  const handleOpen = () => {
    // Sync market filter so the detail page reads the saved condition.
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
    <li className="rounded-2xl border border-border bg-background p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
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
                  AI 예측
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
              {item.originName ?? "전체 산지"} · {item.unit} 기준
              {item.grade ? ` · ${item.grade}` : ""}
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            aria-label="즐겨찾기에서 제거"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-amber-500"
          >
            <Star className="h-5 w-5 fill-amber-400" />
          </button>
        </div>

        <div className="mt-3 flex items-end justify-between gap-3 border-t border-border/60 pt-3">
          <div className="min-w-0">
            <div className="font-data text-[20px] font-bold leading-none tabular-nums text-foreground">
              {(item.price ?? 0).toLocaleString()}
              <span className="ml-1 text-[12px] font-medium text-muted-foreground">
                원 / {item.unit}
              </span>
            </div>
            {item.kgPrice != null && item.kgPrice !== item.price && (
              <div className="mt-1 text-[11.5px] text-muted-foreground">
                kg당 {item.kgPrice.toLocaleString()}원
              </div>
            )}
            {item.updatedAt && (
              <div className="mt-1 text-[11px] text-muted-foreground">
                {item.updatedAt} 업데이트
              </div>
            )}
            {(item.auctionCount != null || item.totalVolume != null) && (
              <div className="mt-0.5 text-[11px] text-muted-foreground">
                {item.auctionCount != null ? `경매 ${item.auctionCount}건` : ""}
                {item.auctionCount != null && item.totalVolume != null ? " · " : ""}
                {item.totalVolume != null
                  ? `거래량 ${item.totalVolume.toLocaleString()}t`
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
            <span className="text-[10.5px] text-muted-foreground">전일 대비</span>
          </div>
        </div>
      </button>
    </li>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center px-6 pb-16 pt-20 text-center">
      <Star
        className="mb-5 text-[#B2DFB2]"
        size={48}
        strokeWidth={1.5}
      />
      <h3 className="text-[16px] font-bold text-foreground">
        저장한 시세 조건이 아직 없어요
      </h3>
      <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
        시세 화면에서 별표를 누르면 자주 보는 작물과<br />
        시장 조건을 여기에 모아볼 수 있어요.
      </p>
      <Link
        to="/market"
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-[14px] font-bold text-primary-foreground"
      >
        시세 보러가기
      </Link>
    </div>
  );
}
