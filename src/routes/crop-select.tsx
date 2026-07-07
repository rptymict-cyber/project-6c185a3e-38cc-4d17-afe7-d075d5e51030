import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Check, ChevronRight, Search, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  getCategories,
  getCategoryById,
  getItemById,
  getItemsByCategory,
  searchAll,
  type SearchResult,
} from "@/lib/catalog-service";
import { useCropSelection } from "@/store/cropSelection";

type Step = 1 | 2 | 3;

interface CropSelectSearch {
  from?: string;
  return?: string;
}

export const Route = createFileRoute("/crop-select")({
  validateSearch: (raw: Record<string, unknown>): CropSelectSearch => ({
    from: typeof raw.from === "string" ? raw.from : undefined,
    return: typeof raw.return === "string" ? raw.return : undefined,
  }),
  component: CropSelectPage,
  head: () => ({
    meta: [
      { title: "작물 선택 — AGDICT" },
      {
        name: "description",
        content: "부류, 품목, 품종을 선택해 원하는 작물 조건을 지정하세요.",
      },
    ],
  }),
});

/**
 * from 컨텍스트별 CTA 라벨 매핑.
 * 매핑에 없는 값이 들어오면 기본 라벨("적용하기")로 동작한다.
 * 새 화면을 추가할 때 여기에 매핑만 추가하면 된다.
 */
const CTA_LABEL_BY_FROM: Record<string, string> = {
  market: "시세 보기",
  statistics: "통계 보기",
  watchlist: "즐겨찾기에 추가",
  prediction: "예측 보기",
  home: "적용하기",
};
const DEFAULT_CTA_LABEL = "적용하기";

const STEP_TITLE: Record<Step, string> = {
  1: "부류 선택",
  2: "품목 선택",
  3: "품종 선택",
};

const HISTORY_KEY = "__cropSelectStep";
const ALL_VARIETY_ID = "ALL" as const;

function CropSelectPage() {
  const { from, return: returnPath } = Route.useSearch();
  const navigate = useNavigate();

  const draft = useCropSelection((s) => s.draft);
  const committed = useCropSelection((s) => s.committed);
  const startDraftFromCommitted = useCropSelection(
    (s) => s.startDraftFromCommitted,
  );
  const setDraftCategory = useCropSelection((s) => s.setDraftCategory);
  const setDraftItem = useCropSelection((s) => s.setDraftItem);
  const setDraftVariety = useCropSelection((s) => s.setDraftVariety);
  const clearDraftCategory = useCropSelection((s) => s.clearDraftCategory);
  const clearDraftItem = useCropSelection((s) => s.clearDraftItem);
  const clearDraftVariety = useCropSelection((s) => s.clearDraftVariety);
  const commitDraft = useCropSelection((s) => s.commitDraft);
  const discardDraft = useCropSelection((s) => s.discardDraft);

  const initialStep: Step = useMemo(() => {
    if (committed.varietyId) return 3;
    if (committed.itemId) return 3;
    if (committed.categoryId) return 2;
    return 1;
    // 마운트 시점 초기값만 계산
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [step, setStep] = useState<Step>(initialStep);

  const returnTo = returnPath && returnPath.startsWith("/") ? returnPath : "/";
  const ctaLabel =
    (from && CTA_LABEL_BY_FROM[from]) ?? DEFAULT_CTA_LABEL;

  // 마운트 시 draft를 committed로부터 초기화
  useEffect(() => {
    startDraftFromCommitted();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // step별 history 관리 (OS/브라우저 뒤로가기로 스텝 후퇴)
  const suppressPopRef = useRef(false);
  const prevStepRef = useRef<Step>(initialStep);
  useEffect(() => {
    const prev = prevStepRef.current;
    if (step > prev) {
      window.history.pushState({ [HISTORY_KEY]: step }, "");
    }
    prevStepRef.current = step;
  }, [step]);

  useEffect(() => {
    const onPop = () => {
      if (suppressPopRef.current) {
        suppressPopRef.current = false;
        return;
      }
      setStep((current) => {
        if (current > 1) {
          return (current - 1) as Step;
        }
        // 1단계에서 뒤로가기 → draft 폐기 후 return 경로 이동
        discardDraft();
        navigate({ to: returnTo });
        return current;
      });
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [discardDraft, navigate, returnTo]);

  const goStep = (target: Step) => {
    if (target === step) return;
    if (target === 2 && !draft.categoryId) return;
    if (target === 3 && !draft.itemId) return;
    setStep(target);
  };

  const handleClose = () => {
    discardDraft();
    navigate({ to: returnTo });
  };

  const handleApply = () => {
    if (!draft.varietyId) return;
    commitDraft();
    toast.success("조건을 적용했어요");
    navigate({ to: returnTo });
  };

  const handlePickCategory = (categoryId: string) => {
    setDraftCategory(categoryId);
    setStep(2);
  };

  const handlePickItem = (itemId: string) => {
    setDraftItem(itemId);
    setStep(3);
  };

  const handlePickVariety = (varietyId: string) => {
    setDraftVariety(varietyId);
  };

  // 검색 결과로 3단계까지 한번에 채우기
  const handleSearchJump = (r: SearchResult) => {
    setDraftCategory(r.category.id);
    setDraftItem(r.item.id);
    setDraftVariety(r.variety ? r.variety.id : ALL_VARIETY_ID);
    setStep(3);
  };

  const handleRemoveCategory = () => {
    clearDraftCategory();
    setStep(1);
  };
  const handleRemoveItem = () => {
    clearDraftItem();
    setStep(2);
  };
  const handleRemoveVariety = () => {
    clearDraftVariety();
    setStep(3);
  };

  const selectionCards = (
    <SelectionCards
      draft={draft}
      onRemoveCategory={handleRemoveCategory}
      onRemoveItem={handleRemoveItem}
      onRemoveVariety={handleRemoveVariety}
    />
  );

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-gray-100">
      <Header title={STEP_TITLE[step]} onClose={handleClose} />
      <Stepper step={step} draft={draft} onStepClick={goStep} />

      <main className="flex-1 overflow-y-auto pb-40">
        {step === 1 && (
          <Step1Category
            onPickCategory={handlePickCategory}
            onSearchJump={handleSearchJump}
            selectionCards={selectionCards}
          />
        )}
        {step === 2 && (
          <Step2Item
            categoryId={draft.categoryId!}
            onPickItem={handlePickItem}
            selectionCards={selectionCards}
          />
        )}
        {step === 3 && (
          <Step3Variety
            categoryId={draft.categoryId!}
            itemId={draft.itemId!}
            selectedVarietyId={draft.varietyId}
            onPickVariety={handlePickVariety}
            selectionCards={selectionCards}
          />
        )}
      </main>

      <BottomBar
        draft={draft}
        ctaLabel={ctaLabel}
        onApply={handleApply}
      />
    </div>
  );
}

/* ---------- Header ---------- */

function Header({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-3">
      <button
        type="button"
        onClick={onClose}
        aria-label="닫기"
        className="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 active:bg-gray-100"
      >
        <X className="h-5 w-5" />
      </button>
      <h1 className="text-base font-semibold text-gray-900">{title}</h1>
      <div className="h-10 w-10" />
    </header>
  );
}

/* ---------- Stepper ---------- */

function Stepper({
  step,
  draft,
  onStepClick,
}: {
  step: Step;
  draft: ReturnType<typeof useCropSelection.getState>["draft"];
  onStepClick: (s: Step) => void;
}) {
  const doneMap: Record<Step, boolean> = {
    1: Boolean(draft.categoryId) && step > 1,
    2: Boolean(draft.itemId) && step > 2,
    3: Boolean(draft.varietyId) && false, // 3은 완료 표시 대신 active로만 유지
  };
  const lockedMap: Record<Step, boolean> = {
    1: false,
    2: !draft.categoryId,
    3: !draft.itemId,
  };
  const labels: Record<Step, string> = {
    1: "부류",
    2: "품목",
    3: "품종",
  };

  const stepList: Step[] = [1, 2, 3];

  return (
    <div className="bg-white px-4 pb-4 pt-3">
      <div className="flex items-center">
        {stepList.map((s, idx) => {
          const isActive = step === s;
          const isDone = doneMap[s];
          const isLocked = lockedMap[s] && !isActive && !isDone;
          return (
            <div key={s} className="flex flex-1 items-center">
              <button
                type="button"
                onClick={() => onStepClick(s)}
                disabled={isLocked}
                className="flex flex-col items-center gap-1"
                aria-current={isActive ? "step" : undefined}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                    isDone && "bg-green-600 text-white",
                    isActive && "bg-green-700 text-white",
                    isLocked && "bg-gray-200 text-gray-400",
                    !isDone &&
                      !isActive &&
                      !isLocked &&
                      "bg-gray-100 text-gray-500",
                  )}
                >
                  {isDone ? <Check className="h-4 w-4" /> : s}
                </span>
                <span
                  className={cn(
                    "text-[11px]",
                    isActive
                      ? "font-semibold text-green-700"
                      : isLocked
                        ? "text-gray-400"
                        : "text-gray-600",
                  )}
                >
                  {labels[s]}
                </span>
              </button>
              {idx < stepList.length - 1 && (
                <div
                  className={cn(
                    "mx-2 h-0.5 flex-1 rounded",
                    doneMap[s] ? "bg-green-600" : "bg-gray-200",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Step 1 ---------- */

function Step1Category({
  onPickCategory,
  onSearchJump,
  selectionCards,
}: {
  onPickCategory: (id: string) => void;
  onSearchJump: (r: SearchResult) => void;
  selectionCards: React.ReactNode;
}) {
  const [q, setQ] = useState("");
  const categories = getCategories();

  const results = useMemo(() => (q.trim() ? searchAll(q) : []), [q]);

  return (
    <div className="px-4 py-4">
      <SearchInput
        value={q}
        onChange={setQ}
        placeholder="부류 검색 (예: 하우스감귤 — 품종명으로도 검색 가능)"
      />
      {selectionCards}


      {q.trim() ? (
        <div className="mt-3 overflow-hidden rounded-2xl bg-white">
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-gray-500">
              검색 결과가 없어요.
            </div>
          ) : (
            <ul>
              {results.map((r, i) => (
                <li key={`${r.category.id}-${r.item.id}-${r.variety?.id ?? ""}-${i}`}>
                  <button
                    type="button"
                    onClick={() => onSearchJump(r)}
                    className="flex w-full items-center justify-between gap-2 border-b border-gray-100 px-4 py-3 text-left last:border-b-0 active:bg-gray-50"
                  >
                    <span className="text-sm text-gray-800">
                      {r.category.name}
                      <span className="mx-1 text-gray-400">›</span>
                      {r.item.name}
                      {r.variety && (
                        <>
                          <span className="mx-1 text-gray-400">›</span>
                          <span className="font-medium text-gray-900">
                            {r.variety.name}
                          </span>
                        </>
                      )}
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-gray-400" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="mt-3 overflow-hidden rounded-2xl bg-white">
          <ul>
            {categories.map((c) => {
              const count = getItemsByCategory(c.id).length;
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => onPickCategory(c.id)}
                    className="flex w-full items-center justify-between gap-3 border-b border-gray-100 px-4 py-3.5 text-left last:border-b-0 active:bg-gray-50"
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-xl">{c.emoji}</span>
                      <span className="text-sm font-medium text-gray-900">
                        {c.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        품목 {count}
                      </span>
                    </span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ---------- Step 2 ---------- */

function Step2Item({
  categoryId,
  onBack,
  onPickItem,
}: {
  categoryId: string;
  onBack: () => void;
  onPickItem: (id: string) => void;
}) {
  const [q, setQ] = useState("");
  const category = getCategoryById(categoryId);
  const items = getItemsByCategory(categoryId);
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return items;
    return items.filter((i) => i.name.toLowerCase().includes(query));
  }, [items, q]);

  return (
    <div className="px-4 py-4">
      <Breadcrumb onBack={onBack}>{category?.name ?? "부류"}</Breadcrumb>
      <div className="mt-3">
        <SearchInput value={q} onChange={setQ} placeholder="품목 검색" />
      </div>

      <div className="mt-3 overflow-hidden rounded-2xl bg-white">
        {filtered.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-gray-500">
            해당하는 품목이 없어요.
          </div>
        ) : (
          <ul>
            {filtered.map((it) => (
              <li key={it.id}>
                <button
                  type="button"
                  onClick={() => onPickItem(it.id)}
                  className="flex w-full items-center justify-between gap-3 border-b border-gray-100 px-4 py-3.5 text-left last:border-b-0 active:bg-gray-50"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xl">{it.emoji}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {it.name}
                    </span>
                    {it.prediction.status === "active" && (
                      <span className="rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-semibold text-green-700">
                        시세 예측
                      </span>
                    )}
                  </span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ---------- Step 3 ---------- */

function Step3Variety({
  categoryId,
  itemId,
  selectedVarietyId,
  onBack,
  onPickVariety,
}: {
  categoryId: string;
  itemId: string;
  selectedVarietyId?: string;
  onBack: () => void;
  onPickVariety: (id: string) => void;
}) {
  const [q, setQ] = useState("");
  const category = getCategoryById(categoryId);
  const item = getItemById(itemId);
  const varieties = item?.varieties ?? [];
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return varieties;
    return varieties.filter((v) => v.name.toLowerCase().includes(query));
  }, [varieties, q]);

  const rows: { id: string; name: string; isAll?: boolean }[] = [
    { id: ALL_VARIETY_ID, name: "전체 품종", isAll: true },
    ...filtered.map((v) => ({ id: v.id, name: v.name })),
  ];

  return (
    <div className="px-4 py-4">
      <Breadcrumb onBack={onBack}>
        {category?.name ?? "부류"} <span className="text-gray-400">{">"}</span>{" "}
        {item?.name ?? "품목"}
      </Breadcrumb>
      <div className="mt-3">
        <SearchInput value={q} onChange={setQ} placeholder="품종 검색" />
      </div>

      <div className="mt-3 overflow-hidden rounded-2xl bg-white">
        <ul>
          {rows.map((r) => {
            const selected = selectedVarietyId === r.id;
            return (
              <li key={r.id}>
                <button
                  type="button"
                  onClick={() => onPickVariety(r.id)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 border-b border-gray-100 px-4 py-3.5 text-left last:border-b-0 active:bg-gray-50",
                    r.isAll && "bg-gray-50/60",
                  )}
                >
                  <span className="text-sm font-medium text-gray-900">
                    {r.name}
                  </span>
                  <span
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full border-2",
                      selected
                        ? "border-green-600"
                        : "border-gray-300",
                    )}
                    aria-hidden
                  >
                    {selected && (
                      <span className="h-2.5 w-2.5 rounded-full bg-green-600" />
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/* ---------- Bottom bar ---------- */

function BottomBar({
  draft,
  ctaLabel,
  onApply,
}: {
  draft: ReturnType<typeof useCropSelection.getState>["draft"];
  ctaLabel: string;
  onApply: () => void;
}) {
  const category = draft.categoryId
    ? getCategoryById(draft.categoryId)
    : undefined;
  const item = draft.itemId ? getItemById(draft.itemId) : undefined;
  const varietyName = (() => {
    if (!draft.varietyId) return undefined;
    if (draft.varietyId === ALL_VARIETY_ID) return "전체 품종";
    return item?.varieties.find((v) => v.id === draft.varietyId)?.name;
  })();

  const summary = [
    category?.name,
    item?.name,
    varietyName,
  ].filter(Boolean) as string[];

  const canApply = Boolean(draft.varietyId);

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[430px] border-t border-gray-200 bg-white px-4 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-3">
      <div className="mb-3 rounded-xl bg-green-50 px-3 py-2.5">
        <div className="text-[11px] font-medium text-green-700">선택한 조건</div>
        <div className="mt-0.5 text-sm font-semibold text-green-900">
          {summary.length === 0
            ? "-"
            : summary.join(" > ")}
        </div>
      </div>
      <button
        type="button"
        onClick={onApply}
        disabled={!canApply}
        className={cn(
          "h-12 w-full rounded-xl text-sm font-semibold transition-colors",
          canApply
            ? "bg-green-600 text-white active:bg-green-700"
            : "bg-gray-200 text-gray-400",
        )}
      >
        {ctaLabel}
      </button>
    </div>
  );
}

/* ---------- Shared bits ---------- */

function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="flex h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3">
      <Search className="h-4 w-4 text-gray-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-full flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="지우기"
          className="flex h-6 w-6 items-center justify-center rounded-full text-gray-400 active:bg-gray-100"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function Breadcrumb({
  children,
  onBack,
}: {
  children: React.ReactNode;
  onBack: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onBack}
      className="inline-flex items-center gap-1 text-sm text-gray-600 active:text-gray-900"
    >
      <ArrowLeft className="h-4 w-4" />
      <span>{children}</span>
    </button>
  );
}
