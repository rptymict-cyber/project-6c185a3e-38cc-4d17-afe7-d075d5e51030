import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, Plus, Search, Star, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell, TopHeader } from "@/components/app-shell";
import { AppHeader } from "@/components/app-header";
import { cn } from "@/lib/utils";
import { CropIcon } from "@/components/crop-icon";
import { SwipeReorderList, type SRItem } from "@/components/swipe-reorder-list";
import { useFavoritePriceStore } from "@/features/favorites/favoriteStore";
import type { FavoritePriceItem } from "@/features/favorites/types";
import { useMarketFilter } from "@/store/market";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/watchlist/")({
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
    return a.createdAt > b.createdAt ? -1 : 1;
  });
}

function WatchlistPage() {
  const items = useFavoritePriceStore((s) => s.items);
  const removeFavorite = useFavoritePriceStore((s) => s.removeFavorite);
  const setOrder = useFavoritePriceStore((s) => s.setOrder);
  const [query, setQuery] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [confirmOpen, setConfirmOpen] = useState(false);

  const sorted = useMemo(() => sortFavorites(items), [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter((it) =>
      [it.cropName, it.varietyName, it.marketName, it.corporationName, it.originName, it.unit]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [sorted, query]);

  const isSearching = query.trim().length > 0;

  // 목록이 비면 편집 모드 자동 종료
  useEffect(() => {
    if (items.length === 0 && editMode) {
      setEditMode(false);
      setSelectedIds(new Set());
    }
  }, [items.length, editMode]);

  const exitEditMode = () => {
    setEditMode(false);
    setSelectedIds(new Set());
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const visibleIds = filtered.map((it) => it.id);
  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selectedIds.has(id));

  const toggleSelectAllVisible = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) {
        visibleIds.forEach((id) => next.delete(id));
      } else {
        visibleIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const [isDeleting, setIsDeleting] = useState(false);

  const performDelete = async () => {
    if (isDeleting || selectedIds.size === 0) return;
    const ids = Array.from(selectedIds);
    setIsDeleting(true);
    try {
      // 기존 단건 삭제 API를 안전하게 순차 호출 (removeFavorite은 로컬 스토어)
      ids.forEach((id) => removeFavorite(id));
      setConfirmOpen(false);
      setSelectedIds(new Set());
      setEditMode(false);
      toast("즐겨찾기에서 삭제되었습니다.");
    } catch {
      toast("삭제하지 못했습니다. 다시 시도해주세요.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReorder = (ids: string[]) => {
    if (isSearching) return;
    setOrder(ids);
  };

  const rows: SRItem[] = filtered.map((it) => ({
    id: it.id,
    render: () => <FavoriteCardBody item={it} />,
  }));

  const editHeader = (
    <TopHeader
      left={
        <button
          type="button"
          onClick={exitEditMode}
          className="min-h-[44px] px-1 text-[15px] font-medium text-foreground"
        >
          취소
        </button>
      }
      title="즐겨찾기 삭제"
      right={
        <button
          type="button"
          onClick={toggleSelectAllVisible}
          className="min-h-[44px] px-1 text-[15px] font-bold text-[#E03131]"
        >
          {allVisibleSelected ? "전체 해제" : "전체 선택"}
        </button>
      }
    />
  );

  const normalHeader = (
    <AppHeader
      title="즐겨찾기"
      showRefresh={false}
      showBell={false}
      right={
        items.length > 0 ? (
          <button
            type="button"
            onClick={() => setEditMode(true)}
            className="min-h-[44px] px-3 text-[15px] font-bold text-[#3A8A3A]"
          >
            편집
          </button>
        ) : undefined
      }
    />
  );

  const bottomBar = editMode ? (
    <div
      className="sticky bottom-[60px] z-20 border-t border-border bg-background"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-2 items-center gap-3 px-4 py-3">
        <button
          type="button"
          onClick={exitEditMode}
          className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-muted text-[15px] font-bold text-foreground active:opacity-90"
        >
          취소
        </button>
        <button
          type="button"
          disabled={selectedIds.size === 0 || isDeleting}
          onClick={() => setConfirmOpen(true)}
          className={cn(
            "inline-flex min-h-[48px] items-center justify-center rounded-xl px-4 text-[15px] font-bold",
            selectedIds.size === 0 || isDeleting
              ? "cursor-not-allowed bg-muted text-muted-foreground"
              : "bg-[#E03131] text-white active:opacity-90",
          )}
        >
          {isDeleting
            ? "삭제 중…"
            : selectedIds.size === 0
              ? "삭제"
              : `삭제 (${selectedIds.size})`}
        </button>
      </div>
    </div>
  ) : undefined;


  return (
    <AppShell header={editMode ? editHeader : normalHeader} bottom={bottomBar}>
      {items.length > 0 && (
        <div className="px-4 pt-4">
          <h1 className="text-[22px] font-black tracking-tight text-foreground">즐겨찾기</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            총 <span className="font-semibold text-foreground">{items.length}</span>
            개의 저장한 시세 조건
          </p>
        </div>
      )}

      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {!editMode && (
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
              {!isSearching && filtered.length > 1 && (
                <p className="mt-2 text-center text-[12px] text-muted-foreground">
                  <span className="mr-1 tracking-tighter">⋮⋮</span>를 드래그해 순서를 바꿀 수 있어요
                </p>
              )}
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center px-6 pb-16 pt-16 text-center">
              <p className="text-[13px] text-muted-foreground">조건에 맞는 저장된 시세가 없어요</p>
            </div>
          ) : editMode ? (
            <ul className="grid gap-2.5 px-4 pb-32 pt-3">
              {filtered.map((it) => {
                const selected = selectedIds.has(it.id);
                return (
                  <li key={it.id}>
                    <button
                      type="button"
                      onClick={() => toggleSelect(it.id)}
                      aria-pressed={selected}
                      className={cn(
                        "relative block w-full overflow-hidden rounded-2xl border bg-background text-left transition-colors",
                        selected ? "border-[#E03131]" : "border-border",
                      )}
                    >
                      <span className="absolute right-3 top-3 z-10">
                        <SelectCircle checked={selected} />
                      </span>
                      <FavoriteCardBody item={it} disableLink />
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <SwipeReorderList
              items={rows}
              onReorder={handleReorder}
              swipeToDelete={false}
              className="w-full bg-background box-border"
              wrapperClassName="w-full box-border rounded-2xl border border-border bg-background overflow-hidden"
              dragHandlePosition="top-right"
            />
          )}
        </>
      )}

      {!editMode && <FabAdd />}

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedIds.size === 1
                ? "즐겨찾기를 삭제할까요?"
                : "선택한 즐겨찾기를 삭제할까요?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedIds.size === 1
                ? "선택한 시세 조건이 즐겨찾기에서 삭제됩니다."
                : `선택한 ${selectedIds.size}개의 시세 조건이 즐겨찾기에서 삭제됩니다.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={performDelete}
              disabled={isDeleting}
              className="bg-[#E03131] text-white hover:bg-[#E03131]/90"
            >
              {isDeleting ? "삭제 중…" : "삭제"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}

function SelectCircle({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid h-6 w-6 place-items-center rounded-full border-2 transition-colors",
        checked ? "border-[#3A8A3A] bg-[#3A8A3A] text-white" : "border-[#CED4DA] bg-background",
      )}
    >
      {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
    </span>
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

function FavoriteCardBody({
  item,
  disableLink = false,
}: {
  item: FavoritePriceItem;
  disableLink?: boolean;
}) {
  const navigate = useNavigate();
  const setItem = useMarketFilter((s) => s.setItem);
  const setMarket = useMarketFilter((s) => s.setMarket);
  const setCorp = useMarketFilter((s) => s.setCorp);
  const setUnit = useMarketFilter((s) => s.setUnit);
  const rising = (item.changeRate ?? 0) >= 0;
  const flat = Math.abs(item.changeRate ?? 0) < 0.05;

  const unitLabel = item.unit.replace(/\s*기준\s*$/, "");

  const handleOpen = () => {
    if (disableLink) return;
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

  const kgPrice = item.kgPrice ?? item.price ?? 0;
  const unitPrice = item.price ?? 0;

  const Inner = (
    <>
      <div className="flex items-start gap-3">
        <div
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-muted"
          aria-hidden
        >
          <CropIcon name={item.cropName} size={26} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="truncate text-[15px] font-bold text-foreground">
                {item.cropName}
                {item.varietyName ? ` · ${item.varietyName}` : ""}
              </div>
            </div>
            {!disableLink && (
              <Star
                className="mr-9 h-5 w-5 shrink-0 text-[#F5B301]"
                fill="#F5B301"
                strokeWidth={1.5}
                aria-hidden
              />
            )}
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

      <div className="my-3 border-t border-[#F1F3F5]" />

      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-baseline gap-1">
            <span className="font-data text-[26px] font-black leading-none tabular-nums text-foreground">
              {kgPrice.toLocaleString()}
            </span>
            <span className="text-[12px] font-medium text-muted-foreground">원/kg</span>
          </div>
          <div className="mt-1.5 text-[11.5px] text-muted-foreground">
            {unitLabel} 기준 {unitPrice.toLocaleString()}원
            {item.totalVolume != null ? ` · 거래량 ${item.totalVolume.toLocaleString()}t` : ""}
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span
            className={cn(
              "inline-flex items-center whitespace-nowrap text-[15px] font-bold tabular-nums",
              flat ? "text-muted-foreground" : rising ? "text-[#E03131]" : "text-[#1971C2]",
            )}
          >
            {flat ? "— 0.0%" : `${rising ? "▲ +" : "▼ "}${(item.changeRate ?? 0).toFixed(1)}%`}
          </span>
          <span className="text-[11px] text-muted-foreground">전일 대비</span>
        </div>
      </div>
    </>
  );

  if (disableLink) {
    return <div className="bg-transparent p-4">{Inner}</div>;
  }

  return (
    <div className="bg-background p-4">
      <button type="button" onClick={handleOpen} className="block w-full text-left">
        {Inner}
      </button>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center px-6 text-center"
      style={{ minHeight: "calc(100dvh - 52px - 60px - env(safe-area-inset-bottom))" }}
    >
      <Star className="mb-5 text-[#B2DFB2]" size={48} strokeWidth={1.5} />
      <h3 className="text-[16px] font-bold text-foreground">저장한 시세 조건이 아직 없어요</h3>
      <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
        아래 + 버튼으로 관심 있는 품목과 시장을
        <br />
        추가해 보세요.
      </p>
    </div>
  );
}
