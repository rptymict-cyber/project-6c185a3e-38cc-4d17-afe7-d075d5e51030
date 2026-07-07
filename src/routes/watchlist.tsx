import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import {
  Bell,
  Check,
  ChevronDown,
  ChevronLeft,
  GripVertical,
  Info,
  MoreVertical,
  Pencil,
  Search,
  Star,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AppShell, TopHeader } from "@/components/app-shell";
import { AppHeader } from "@/components/app-header";
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
import { cn } from "@/lib/utils";
import {
  isPredictionAvailable,
  timeAgo,
  useSavedQueries,
  type SavedQuery,
} from "@/store/saved-queries";

type Filter = "all" | "ai";
type Sort = "updated" | "trade" | "priceDesc" | "priceAsc" | "manual";

const SORT_LABEL: Record<Sort, string> = {
  updated: "최근 업데이트순",
  trade: "최근 거래순",
  priceDesc: "높은 가격순",
  priceAsc: "낮은 가격순",
  manual: "직접 정렬순",
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
  const items = useSavedQueries((s) => s.items);
  const remove = useSavedQueries((s) => s.remove);
  const removeMany = useSavedQueries((s) => s.removeMany);
  const replaceAll = useSavedQueries((s) => s.replaceAll);
  const restore = useSavedQueries((s) => s.restore);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<SavedQuery[]>([]);
  const originalRef = useRef<SavedQuery[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("updated");
  const [sortOpen, setSortOpen] = useState(false);

  // Fix hydration mismatch: relative-time strings depend on Date.now().
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const enterEdit = () => {
    setDraft(items);
    originalRef.current = items;
    setSelected(new Set());
    setEditing(true);
  };
  const exitEdit = (persist: boolean) => {
    if (persist) replaceAll(draft);
    else replaceAll(originalRef.current);
    setEditing(false);
    setSelected(new Set());
  };

  const filtered = useMemo(() => {
    let arr = items.slice();
    if (filter === "ai") arr = arr.filter((q) => isPredictionAvailable(q.cropId));
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      arr = arr.filter((it) =>
        [
          it.category,
          it.varietyName,
          it.marketName,
          it.corporation,
          it.origin,
          it.unitLabel,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q),
      );
    }
    if (sort === "updated") arr.sort((a, b) => b.updatedAt - a.updatedAt);
    else if (sort === "trade") arr.sort((a, b) => b.lastAuctionAt.localeCompare(a.lastAuctionAt));
    else if (sort === "priceDesc") arr.sort((a, b) => b.price - a.price);
    else if (sort === "priceAsc") arr.sort((a, b) => a.price - b.price);
    return arr;
  }, [items, filter, sort, query]);

  const toggleSelect = (id: string) =>
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const handleRemoveOne = (q: SavedQuery) => {
    const idx = items.findIndex((it) => it.id === q.id);
    remove(q.id);
    toast("즐겨찾기에서 제거되었습니다.", {
      action: {
        label: "실행 취소",
        onClick: () => restore(q, idx),
      },
    });
  };

  return (
    <AppShell
      header={
        editing ? (
          <TopHeader
            title="즐겨찾기 편집"
            left={
              <button
                type="button"
                onClick={() => exitEdit(false)}
                aria-label="편집 취소"
                className="grid h-9 w-9 place-items-center rounded-full text-foreground hover:bg-[#F1F3F5]"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            }
            right={
              <button
                type="button"
                onClick={() => {
                  exitEdit(true);
                  toast("변경사항이 저장되었습니다.");
                }}
                className="min-h-[36px] rounded-md px-2 text-[14px] font-semibold text-primary"
              >
                완료
              </button>
            }
          />
        ) : (
          <AppHeader title="농산물 시세 조회" />
        )
      }
      bottom={
        editing ? (
          <div className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[430px] border-t border-border bg-background px-4 pb-[env(safe-area-inset-bottom)] pt-3">
            <div className="flex items-center gap-2 pb-3">
              <button
                type="button"
                onClick={() => exitEdit(false)}
                className="flex-1 rounded-lg border border-input bg-secondary py-3 text-[14px] font-bold text-secondary-foreground"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => selected.size > 0 && setConfirmOpen(true)}
                disabled={selected.size === 0}
                className={cn(
                  "flex-[1.4] rounded-lg py-3 text-[14px] font-bold transition-colors",
                  selected.size === 0
                    ? "bg-muted text-muted-foreground opacity-60"
                    : "bg-destructive text-destructive-foreground",
                )}
              >
                {selected.size > 0 ? `삭제 (${selected.size})` : "삭제"}
              </button>
            </div>
            <p className="pb-2 text-center text-[11px] text-muted-foreground">
              ⓘ 드래그하여 순서를 변경할 수 있습니다.
            </p>
          </div>
        ) : null
      }
    >
      {editing ? (
        <EditView
          draft={draft}
          setDraft={setDraft}
          selected={selected}
          toggleSelect={toggleSelect}
        />
      ) : (
        <NormalView
          items={items}
          filtered={filtered}
          query={query}
          setQuery={setQuery}
          filter={filter}
          setFilter={setFilter}
          sort={sort}
          setSort={setSort}
          sortOpen={sortOpen}
          setSortOpen={setSortOpen}
          onEdit={enterEdit}
          onRemove={handleRemoveOne}
          mounted={mounted}
        />
      )}

      {editing && <div className="h-[120px]" aria-hidden />}

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>즐겨찾기를 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              선택한 {selected.size}개의 즐겨찾기를 삭제하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const ids = Array.from(selected);
                removeMany(ids);
                setDraft((d) => d.filter((q) => !selected.has(q.id)));
                setSelected(new Set());
                setConfirmOpen(false);
                toast("선택한 즐겨찾기가 삭제되었습니다.");
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}

/* -------------------- Normal view -------------------- */

function NormalView({
  items,
  filtered,
  query,
  setQuery,
  filter,
  setFilter,
  sort,
  setSort,
  sortOpen,
  setSortOpen,
  onEdit,
  onRemove,
  mounted,
}: {
  items: SavedQuery[];
  filtered: SavedQuery[];
  query: string;
  setQuery: (v: string) => void;
  filter: Filter;
  setFilter: (f: Filter) => void;
  sort: Sort;
  setSort: (s: Sort) => void;
  sortOpen: boolean;
  setSortOpen: (v: boolean) => void;
  onEdit: () => void;
  onRemove: (q: SavedQuery) => void;
  mounted: boolean;
}) {
  return (
    <>
      {/* Body header */}
      <div className="flex items-end justify-between px-4 pt-4">
        <div>
          <h1 className="text-[22px] font-black tracking-tight text-foreground">
            즐겨찾기
          </h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            총 <span className="font-semibold text-foreground">{items.length}</span>개의 즐겨찾기
          </p>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-primary px-3 text-[13px] font-bold text-primary hover:bg-primary/5"
        >
          <Pencil className="h-3.5 w-3.5" />
          편집
        </button>
      </div>

      {/* Search */}
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
              className="grid h-6 w-6 place-items-center rounded-full text-muted-foreground hover:bg-muted"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </label>
      </div>

      {/* Chips + sort */}
      <div className="mt-3 flex items-center gap-2 px-4">
        <div className="flex flex-1 items-center gap-2">
          {([
            ["all", "전체"],
            ["ai", "AI 예측"],
          ] as const).map(([id, label]) => {
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
                        "flex w-full items-center justify-between px-3 py-2.5 text-[12.5px] hover:bg-muted",
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

      {/* Info banner */}
      <div className="mx-4 mt-3 flex gap-2 rounded-[10px] bg-muted px-3 py-2.5 text-[11.5px] leading-relaxed text-muted-foreground">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span>별표를 누르면 즐겨찾기에서 해제됩니다.</span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState hasAny={items.length > 0} />
      ) : (
        <ul className="space-y-2 px-4 py-4">
          {filtered.map((q) => (
            <NormalCard key={q.id} q={q} onRemove={() => onRemove(q)} mounted={mounted} />
          ))}
        </ul>
      )}
    </>
  );
}

function PredictionBadge({ cropId }: { cropId: string }) {
  const active = isPredictionAvailable(cropId);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold",
        active
          ? "border-primary/30 bg-primary/10 text-primary"
          : "border-border bg-muted text-muted-foreground",
      )}
    >
      {active ? "AI 예측" : "예측 준비 중"}
    </span>
  );
}

function NormalCard({
  q,
  onRemove,
  mounted,
}: {
  q: SavedQuery;
  onRemove: () => void;
  mounted: boolean;
}) {
  const rising = q.changePct >= 0;
  return (
    <li className="rounded-2xl border border-border bg-background p-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="flex items-start gap-3">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-muted text-2xl" aria-hidden>
          {q.emoji}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <PredictionBadge cropId={q.cropId} />
              <div className="mt-1 truncate text-[14px] font-bold text-foreground">
                {q.category} · {q.varietyName}
              </div>
              <div className="mt-0.5 truncate text-[11.5px] text-muted-foreground">
                {q.marketName} · {q.corporation}
              </div>
              <div className="truncate text-[11.5px] text-muted-foreground">
                {q.origin} · {q.unitLabel} 기준
              </div>
              <div className="mt-1 truncate text-[10.5px] text-muted-foreground">
                최근 거래 {q.lastAuctionAt}
              </div>
            </div>

            <div className="text-right">
              <div className="font-data text-[15px] font-bold tabular-nums text-foreground">
                {q.price.toLocaleString()}
                <span className="ml-0.5 text-[10.5px] font-medium text-muted-foreground">
                  원 / {q.unitLabel}
                </span>
              </div>
              <div className="mt-1 inline-flex items-center gap-1">
                <span
                  className={cn(
                    "rounded-md px-1.5 py-0.5 text-[10.5px] font-bold",
                    rising ? "bg-[#FFE3E3] text-[#E03131]" : "bg-[#DBE4FF] text-[#1971C2]",
                  )}
                >
                  {rising ? "▲ +" : "▼ "}
                  {q.changePct.toFixed(1)}%
                </span>
                <span className="text-[10px] text-muted-foreground">전일 대비</span>
              </div>
              <div className="mt-1 text-[10px] text-muted-foreground" suppressHydrationWarning>
                {mounted ? `업데이트 ${timeAgo(q.updatedAt)}` : ""}
              </div>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-center gap-1">
          <button
            type="button"
            onClick={onRemove}
            aria-label="즐겨찾기에서 제거"
            className="grid h-7 w-7 place-items-center rounded-full text-amber-500"
          >
            <Star className="h-5 w-5 fill-amber-400" />
          </button>
          <button
            type="button"
            aria-label={q.hasAlert ? "알림 있음" : "알림 설정"}
            className={cn(
              "grid h-7 w-7 place-items-center rounded-full",
              q.hasAlert ? "text-primary" : "text-muted-foreground",
            )}
          >
            <Bell className={cn("h-5 w-5", q.hasAlert && "fill-primary")} />
          </button>
          <button
            type="button"
            aria-label="더 보기"
            className="grid h-7 w-7 place-items-center rounded-full text-muted-foreground"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Link
          to="/price/$variety"
          params={{ variety: q.cropId }}
          className="grid h-9 place-items-center rounded-lg border border-primary text-[12.5px] font-bold text-primary"
        >
          시세 보기
        </Link>
        <Link
          to="/price/$variety"
          params={{ variety: q.cropId }}
          hash="auctions"
          className="grid h-9 place-items-center rounded-lg border border-primary text-[12.5px] font-bold text-primary"
        >
          최근 경매
        </Link>
      </div>
    </li>
  );
}

/* -------------------- Edit view -------------------- */

function EditView({
  draft,
  setDraft,
  selected,
  toggleSelect,
}: {
  draft: SavedQuery[];
  setDraft: (updater: SavedQuery[] | ((prev: SavedQuery[]) => SavedQuery[])) => void;
  selected: Set<string>;
  toggleSelect: (id: string) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
  );

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    setDraft((prev) => {
      const oldIndex = prev.findIndex((q) => q.id === active.id);
      const newIndex = prev.findIndex((q) => q.id === over.id);
      if (oldIndex < 0 || newIndex < 0) return prev;
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  return (
    <>
      <div className="px-4 pt-3 text-[13px] font-semibold text-primary">
        {selected.size}개 선택됨
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={draft.map((q) => q.id)} strategy={verticalListSortingStrategy}>
          <ul className="space-y-2 px-4 py-3">
            {draft.map((q) => (
              <SortableEditCard
                key={q.id}
                q={q}
                checked={selected.has(q.id)}
                onCheck={() => toggleSelect(q.id)}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </>
  );
}

function SortableEditCard({
  q,
  checked,
  onCheck,
}: {
  q: SavedQuery;
  checked: boolean;
  onCheck: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: q.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const rising = q.changePct >= 0;

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-2xl border border-border bg-background p-3",
        isDragging ? "z-10 shadow-lg" : "shadow-[0_1px_2px_rgba(0,0,0,0.03)]",
      )}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={onCheck}
          aria-pressed={checked}
          aria-label={checked ? "선택 해제" : "선택"}
          className={cn(
            "mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-md border",
            checked
              ? "border-primary bg-primary text-primary-foreground"
              : "border-input bg-background",
          )}
        >
          {checked && <Check className="h-4 w-4" strokeWidth={3} />}
        </button>

        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-muted text-2xl" aria-hidden>
          {q.emoji}
        </div>

        <div className="min-w-0 flex-1">
          <PredictionBadge cropId={q.cropId} />
          <div className="mt-1 truncate text-[14px] font-bold text-foreground">
            {q.category} · {q.varietyName}
          </div>
          <div className="mt-0.5 truncate text-[11.5px] text-muted-foreground">
            {q.marketName} · {q.corporation}
          </div>
          <div className="truncate text-[11.5px] text-muted-foreground">
            {q.origin} · {q.unitLabel} 기준
          </div>
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <div className="font-data text-[14px] font-bold tabular-nums text-foreground">
              {q.price.toLocaleString()}
              <span className="ml-0.5 text-[10.5px] font-medium text-muted-foreground">
                원 / {q.unitLabel}
              </span>
            </div>
            <span
              className={cn(
                "rounded-md px-1.5 py-0.5 text-[10.5px] font-bold",
                rising ? "bg-[#FFE3E3] text-[#E03131]" : "bg-[#DBE4FF] text-[#1971C2]",
              )}
            >
              {rising ? "▲ +" : "▼ "}
              {q.changePct.toFixed(1)}%
            </span>
          </div>
        </div>

        <button
          type="button"
          aria-label="순서 변경"
          className="mt-1 grid h-9 w-8 shrink-0 cursor-grab touch-none place-items-center rounded-md text-muted-foreground active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5" />
        </button>
      </div>
    </li>
  );
}

/* -------------------- Empty -------------------- */

function EmptyState({ hasAny }: { hasAny: boolean }) {
  return (
    <div className="flex flex-col items-center px-6 pb-16 pt-20 text-center">
      <Star className="mb-5" size={48} color="hsl(var(--muted))" fill="hsl(var(--muted))" strokeWidth={1.5} />
      <h3 className="text-[16px] font-bold text-foreground">
        {hasAny ? "조건에 맞는 즐겨찾기가 없어요" : "즐겨찾기가 없어요"}
      </h3>
      <p className="mt-2 text-[13px] text-muted-foreground">
        {hasAny
          ? "검색어나 필터를 바꿔서 다시 확인해보세요"
          : "시세 화면에서 별표를 눌러 조건을 저장해보세요"}
      </p>
      {!hasAny && (
        <Link
          to="/market"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-[14px] font-bold text-primary-foreground"
        >
          시세 보러 가기
        </Link>
      )}
    </div>
  );
}

// silence unused import warning if useRouter tree-shakes later
void useRouter;
