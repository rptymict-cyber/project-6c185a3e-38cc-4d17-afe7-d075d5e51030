import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Check, ChevronDown, GripVertical, Info, MoreVertical, RotateCw, Search, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell, TopHeader } from "@/components/app-shell";
import { cn } from "@/lib/utils";
import { useSavedQueries, timeAgo, type SavedQuery } from "@/store/saved-queries";

type Filter = "all" | "alert" | "ai";
type Sort = "updated" | "added" | "priceDesc" | "changeDesc";

const SORT_LABEL: Record<Sort, string> = {
  updated: "최근 업데이트순",
  added: "등록순",
  priceDesc: "가격 높은순",
  changeDesc: "등락률순",
};

export const Route = createFileRoute("/watchlist")({
  component: WatchlistPage,
  head: () => ({
    meta: [
      { title: "즐겨찾기 — AGDICT" },
      { name: "description", content: "저장한 시세 조회 조건을 빠르게 다시 확인하세요." },
    ],
  }),
});

function WatchlistPage() {
  const items = useSavedQueries((s) => s.items);
  const remove = useSavedQueries((s) => s.remove);
  const removeMany = useSavedQueries((s) => s.removeMany);
  const reorder = useSavedQueries((s) => s.reorder);
  const refresh = useSavedQueries((s) => s.refresh);

  const [editing, setEditing] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("updated");
  const [sortOpen, setSortOpen] = useState(false);

  const filtered = useMemo(() => {
    let arr = items.slice();
    if (filter === "alert") arr = arr.filter((q) => q.hasAlert);
    if (filter === "ai") arr = arr.filter((q) => q.aiReady);
    if (sort === "updated") arr.sort((a, b) => b.updatedAt - a.updatedAt);
    else if (sort === "priceDesc") arr.sort((a, b) => b.price - a.price);
    else if (sort === "changeDesc") arr.sort((a, b) => b.changePct - a.changePct);
    // "added" preserves store order (no-op after slice)
    return arr;
  }, [items, filter, sort]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allSelected = filtered.length > 0 && filtered.every((q) => selected.has(q.id));
  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(filtered.map((q) => q.id)));
  };

  const handleDelete = () => {
    if (selected.size === 0) return;
    removeMany(Array.from(selected));
    toast(`${selected.size}개의 즐겨찾기가 삭제되었습니다`);
    setSelected(new Set());
  };

  const handleMoveTop = () => {
    if (selected.size === 0) return;
    const ordered = [
      ...items.filter((q) => selected.has(q.id)).map((q) => q.id),
      ...items.filter((q) => !selected.has(q.id)).map((q) => q.id),
    ];
    reorder(ordered);
    toast("선택 항목을 맨 위로 이동했어요");
  };

  const toggleEditing = () => {
    setEditing((e) => !e);
    setSelected(new Set());
  };

  return (
    <AppShell
      header={
        <TopHeader
          title="즐겨찾기"
          right={
            <>
              {!editing && (
                <Link
                  to="/search"
                  aria-label="검색"
                  className="grid h-9 w-9 place-items-center rounded-full text-foreground hover:bg-[#F1F3F5]"
                >
                  <Search className="h-[18px] w-[18px]" />
                </Link>
              )}
              <button
                type="button"
                onClick={toggleEditing}
                className={cn(
                  "min-h-[36px] rounded-md px-2 text-[14px] font-semibold",
                  editing ? "text-[#3A8A3A]" : "text-foreground",
                )}
              >
                {editing ? "완료" : "편집"}
              </button>
            </>
          }
        />
      }
      bottom={
        editing ? (
          <div className="fixed inset-x-0 bottom-[60px] z-30 mx-auto w-full max-w-[430px] border-t border-border bg-background px-4 py-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleAll}
                className="flex-1 rounded-lg border border-[#3A8A3A] py-2.5 text-[13px] font-bold text-[#3A8A3A]"
              >
                {allSelected ? "선택 해제" : "전체 선택"}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={selected.size === 0}
                className={cn(
                  "flex-1 rounded-lg border py-2.5 text-[13px] font-bold",
                  selected.size === 0
                    ? "border-[#E9ECEF] text-[#ADB5BD]"
                    : "border-[#E03131] text-[#E03131]",
                )}
              >
                삭제
              </button>
              <button
                type="button"
                onClick={handleMoveTop}
                disabled={selected.size === 0}
                className={cn(
                  "flex-1 rounded-lg border py-2.5 text-[13px] font-bold",
                  selected.size === 0
                    ? "border-[#E9ECEF] text-[#ADB5BD]"
                    : "border-[#3A8A3A] text-[#3A8A3A]",
                )}
              >
                ↑ 순서 변경
              </button>
            </div>
          </div>
        ) : null
      }
    >
      {/* Count row */}
      <div className="px-4 pt-3">
        {editing ? (
          <div className="text-[13px] font-semibold text-[#3A8A3A]">
            선택 {selected.size}개
          </div>
        ) : (
          <div className="text-[13px] font-semibold text-[#495057]">
            총 <span className="text-foreground">{items.length}</span>개의 즐겨찾기
          </div>
        )}
      </div>

      {/* Filter chips + sort */}
      <div className="mt-3 flex items-center gap-2 px-4">
        <div className="flex flex-1 items-center gap-2">
          {([
            ["all", "전체"],
            ["alert", "알림 있음"],
            ["ai", "예측 가능"],
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
                    ? "border-[#3A8A3A] bg-[#3A8A3A] text-white"
                    : "border-[#E9ECEF] bg-white text-[#495057]",
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
            onClick={() => setSortOpen((v) => !v)}
            className="inline-flex h-8 items-center gap-1 rounded-full border border-[#E9ECEF] bg-white px-3 text-[12px] font-semibold text-[#495057]"
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
              <ul className="absolute right-0 top-9 z-50 w-[140px] overflow-hidden rounded-lg border border-[#E9ECEF] bg-white shadow-md">
                {(Object.keys(SORT_LABEL) as Sort[]).map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      onClick={() => {
                        setSort(s);
                        setSortOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between px-3 py-2 text-[12.5px] hover:bg-[#F8F9FA]",
                        sort === s ? "font-bold text-[#3A8A3A]" : "text-[#495057]",
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
      <div className="mx-4 mt-3 flex gap-2 rounded-[10px] bg-[#F1F3F5] px-3 py-2.5 text-[11.5px] leading-relaxed text-[#495057]">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#868E96]" />
        <div>
          즐겨찾기를 탭하면 시세 상세를 볼 수 있어요.
          <br />
          별표를 탭하면 목록에서 제거됩니다.
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState hasAny={items.length > 0} />
      ) : (
        <ul className="space-y-2 px-4 py-4">
          {filtered.map((q) => (
            <QueryCard
              key={q.id}
              q={q}
              editing={editing}
              checked={selected.has(q.id)}
              onCheck={() => toggleSelect(q.id)}
              onRemove={() => {
                remove(q.id);
                toast("즐겨찾기에서 삭제되었어요");
              }}
              onRefresh={() => {
                refresh(q.id);
                toast("최신 시세로 업데이트했어요");
              }}
            />
          ))}
        </ul>
      )}

      {editing && <div className="h-[76px]" aria-hidden />}
    </AppShell>
  );
}

function QueryCard({
  q,
  editing,
  checked,
  onCheck,
  onRemove,
  onRefresh,
}: {
  q: SavedQuery;
  editing: boolean;
  checked: boolean;
  onCheck: () => void;
  onRemove: () => void;
  onRefresh: () => void;
}) {
  const rising = q.changePct >= 0;
  return (
    <li className="rounded-2xl border border-[#E9ECEF] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="flex items-start gap-3">
        {editing && (
          <button
            type="button"
            onClick={onCheck}
            aria-pressed={checked}
            aria-label={checked ? "선택 해제" : "선택"}
            className={cn(
              "mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-md border",
              checked
                ? "border-[#3A8A3A] bg-[#3A8A3A] text-white"
                : "border-[#CED4DA] bg-white",
            )}
          >
            {checked && <Check className="h-4 w-4" strokeWidth={3} />}
          </button>
        )}

        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-[#F8F9FA] text-2xl" aria-hidden>
          {q.emoji}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="truncate text-[14px] font-bold text-foreground">
                {q.category} · {q.varietyName}
              </div>
              <div className="mt-0.5 truncate text-[11.5px] text-[#6C757D]">
                {q.marketName} · {q.corporation}
              </div>
              <div className="truncate text-[11.5px] text-[#6C757D]">
                {q.origin} · {q.unitLabel} 기준
              </div>
            </div>

            <div className="text-right">
              <div className="font-data text-[16px] font-bold tabular-nums text-foreground">
                {q.price.toLocaleString()}
                <span className="ml-0.5 text-[11px] font-medium text-[#868E96]">원 / {q.unitLabel}</span>
              </div>
              <div className="mt-0.5 text-[11px] text-[#6C757D]">
                kg당 {q.perKg.toLocaleString()}원
              </div>
              <div className="mt-1 inline-flex items-center gap-1 text-[11px]">
                <span className="text-[#868E96]">전일 대비</span>
                <span
                  className={cn(
                    "rounded-md px-1.5 py-0.5 text-[10.5px] font-bold",
                    rising ? "bg-[#FFE3E3] text-[#E03131]" : "bg-[#DBE4FF] text-[#1971C2]",
                  )}
                >
                  {rising ? "+" : ""}
                  {q.changePct.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between text-[10.5px] text-[#868E96]">
            <span>최근 거래 {q.lastAuctionAt}</span>
            <button
              type="button"
              onClick={onRefresh}
              className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 hover:bg-[#F1F3F5]"
              aria-label="업데이트"
            >
              최근 업데이트 {timeAgo(q.updatedAt)}
              <RotateCw className="h-3 w-3" />
            </button>
          </div>
        </div>

        {editing ? (
          <div className="mt-1 grid h-8 w-6 shrink-0 place-items-center text-[#ADB5BD]">
            <GripVertical className="h-4 w-4" />
          </div>
        ) : (
          <div className="flex shrink-0 flex-col items-center gap-1">
            <button
              type="button"
              onClick={onRemove}
              aria-label="즐겨찾기에서 제거"
              className="grid h-7 w-7 place-items-center rounded-full text-amber-500"
            >
              <Star className="h-5 w-5 fill-amber-400" />
            </button>
            <div
              className={cn(
                "grid h-7 w-7 place-items-center rounded-full",
                q.hasAlert ? "text-[#3A8A3A]" : "text-[#ADB5BD]",
              )}
              aria-label={q.hasAlert ? "알림 있음" : "알림 없음"}
            >
              <Bell
                className={cn("h-5 w-5", q.hasAlert && "fill-[#3A8A3A]")}
              />
            </div>
            <button
              type="button"
              aria-label="더 보기"
              className="grid h-7 w-7 place-items-center rounded-full text-[#868E96]"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {!editing && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Link
            to="/price/$variety"
            params={{ variety: q.cropId }}
            className="grid h-9 place-items-center rounded-lg border border-[#3A8A3A] text-[12.5px] font-bold text-[#3A8A3A]"
          >
            시세 보기
          </Link>
          <Link
            to="/price/$variety"
            params={{ variety: q.cropId }}
            hash="auctions"
            className="grid h-9 place-items-center rounded-lg border border-[#3A8A3A] text-[12.5px] font-bold text-[#3A8A3A]"
          >
            최근 경매
          </Link>
        </div>
      )}
    </li>
  );
}

function EmptyState({ hasAny }: { hasAny: boolean }) {
  return (
    <div className="flex flex-col items-center px-6 pb-16 pt-20 text-center">
      <Star className="mb-5" size={48} color="#E9ECEF" fill="#E9ECEF" strokeWidth={1.5} />
      <h3 className="text-[16px] font-bold text-foreground">
        {hasAny ? "조건에 맞는 즐겨찾기가 없어요" : "즐겨찾기가 없어요"}
      </h3>
      <p className="mt-2 text-[13px] text-muted-foreground">
        {hasAny
          ? "필터를 바꿔서 다시 확인해보세요"
          : "시세 화면에서 별표를 눌러 조건을 저장해보세요"}
      </p>
      {!hasAny && (
        <Link
          to="/market"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-[#3A8A3A] px-6 py-2.5 text-[14px] font-bold text-white"
        >
          시세 보러 가기
        </Link>
      )}
    </div>
  );
}
