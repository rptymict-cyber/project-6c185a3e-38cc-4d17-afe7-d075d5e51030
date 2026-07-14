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
import { useMarketFilter } from "@/store/market";
import { CropIcon } from "@/components/crop-icon";
import { Button } from "@/components/ui/button";

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

const CTA_LABEL_BY_FROM: Record<string, string> = {
  market: "확인",
  statistics: "확인",
  "statistics-detail": "확인",
  prediction: "예측 보기",
  home: "적용하기",
};
const DEFAULT_CTA_LABEL = "적용하기";
const SILENT_APPLY_FROM = new Set(["statistics", "statistics-detail"]);

const HISTORY_KEY = "__cropSelectStep";
const ALL_VARIETY_ID = "ALL" as const;

const SUBTITLE: Record<Step, string> = {
  1: "먼저 부류를 선택해 주세요",
  2: "선택한 부류에서 품목을 골라주세요",
  3: "선택한 품목의 품종을 선택해 주세요",
};

const PLACEHOLDER: Record<Step, string> = {
  1: "부류를 검색하세요",
  2: "품목을 입력하세요",
  3: "품종을 검색하세요",
};

function CropSelectPage() {
  const { from, return: returnPath } = Route.useSearch();
  const navigate = useNavigate();

  const draft = useCropSelection((s) => s.draft);
  const committed = useCropSelection((s) => s.committed);
  const startDraftFromCommitted = useCropSelection((s) => s.startDraftFromCommitted);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [step, setStep] = useState<Step>(initialStep);

  const returnTo = returnPath && returnPath.startsWith("/") ? returnPath : "/";
  const ctaLabel = step === 3 ? "확인" : "다음";
  const finalCtaLabel = (from && CTA_LABEL_BY_FROM[from]) ?? DEFAULT_CTA_LABEL;

  useEffect(() => {
    startDraftFromCommitted();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        if (current > 1) return (current - 1) as Step;
        discardDraft();
        navigate({ to: returnTo });
        return current;
      });
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [discardDraft, navigate, returnTo]);

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as Step);
      return;
    }
    discardDraft();
    navigate({ to: returnTo });
  };

  const handleNext = () => {
    if (step === 1) {
      if (!draft.categoryId) return;
      setStep(2);
      return;
    }
    if (step === 2) {
      if (!draft.itemId) return;
      const item = getItemById(draft.itemId);
      if (item && (item.hasNoVariety || item.varieties.length === 0)) {
        setDraftVariety(ALL_VARIETY_ID);
        handleApply();
        return;
      }
      setStep(3);
      return;
    }
    handleApply();
  };

  const handleApply = () => {
    if (!draft.varietyId || !draft.categoryId || !draft.itemId) return;
    commitDraft();

    const category = getCategoryById(draft.categoryId);
    const item = getItemById(draft.itemId);
    if (category && item) {
      const isAll = draft.varietyId === ALL_VARIETY_ID;
      const variety = isAll
        ? undefined
        : item.varieties.find((v) => v.id === draft.varietyId);
      const varietyId = isAll ? `${item.id}:ALL` : (variety?.id ?? `${item.id}:ALL`);
      const varietyLabel = isAll ? "전체 품종" : (variety?.name ?? "전체 품종");
      useMarketFilter.getState().setItem({
        categoryId: category.id,
        categoryLabel: category.name,
        itemId: item.id,
        itemLabel: item.name,
        varietyId,
        varietyLabel,
      });
    }

    if (!from || !SILENT_APPLY_FROM.has(from)) {
      toast.success("조건을 적용했어요");
    }

    if ((from === "statistics" || from === "statistics-detail") && item) {
      const isAll = draft.varietyId === ALL_VARIETY_ID;
      const target = isAll ? item.id : (draft.varietyId as string);
      navigate({ to: "/statistics/$variety", params: { variety: target } });
      return;
    }

    navigate({ to: returnTo });
  };

  const handleRemoveCategory = () => {
    clearDraftCategory();
    setStep(1);
  };
  const handleRemoveItem = () => {
    clearDraftItem();
    setStep(2);
  };

  const handleSearchJump = (r: SearchResult) => {
    setDraftCategory(r.category.id);
    setDraftItem(r.item.id);
    setDraftVariety(r.variety ? r.variety.id : ALL_VARIETY_ID);
    const targetItem = getItemById(r.item.id);
    const noVar = targetItem && (targetItem.hasNoVariety || targetItem.varieties.length === 0);
    setStep(noVar ? 2 : 3);
  };

  const canProceed =
    (step === 1 && Boolean(draft.categoryId)) ||
    (step === 2 && Boolean(draft.itemId)) ||
    (step === 3 && Boolean(draft.varietyId));

  const buttonLabel = step === 3 ? finalCtaLabel : ctaLabel;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-[#F7F8FA]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#F7F8FA] px-4 pt-3 pb-1">
        <button
          type="button"
          onClick={handleBack}
          aria-label="뒤로가기"
          className="flex h-10 w-10 items-center justify-center -ml-2 text-gray-900"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
      </header>

      <Stepper step={step} draft={draft} />

      {/* Title */}
      <div className="px-5 pt-2 pb-4">
        <h1 className="text-[26px] font-extrabold leading-tight text-gray-900">
          <span className="text-[#2E9E6B]">작물</span>을 선택해 주세요
        </h1>
        <p className="mt-2 text-[14px] text-gray-500">{SUBTITLE[step]}</p>
      </div>

      <main className="flex-1 overflow-y-auto px-5 pb-40">
        {step === 1 && (
          <Step1Category
            selectedCategoryId={draft.categoryId}
            onPickCategory={setDraftCategory}
            onSearchJump={handleSearchJump}
          />
        )}
        {step === 2 && (
          <Step2Item
            categoryId={draft.categoryId!}
            selectedItemId={draft.itemId}
            onPickItem={setDraftItem}
            onRemoveCategory={handleRemoveCategory}
          />
        )}
        {step === 3 && (
          <Step3Variety
            itemId={draft.itemId!}
            selectedVarietyId={draft.varietyId}
            onPickVariety={setDraftVariety}
            onRemoveCategory={handleRemoveCategory}
            onRemoveItem={handleRemoveItem}
          />
        )}
      </main>

      <BottomBar
        draft={draft}
        step={step}
        label={buttonLabel}
        canProceed={canProceed}
        onClick={handleNext}
      />
    </div>
  );
}

/* ---------- Stepper ---------- */

function Stepper({
  step,
  draft,
}: {
  step: Step;
  draft: ReturnType<typeof useCropSelection.getState>["draft"];
}) {
  const doneMap: Record<Step, boolean> = {
    1: Boolean(draft.categoryId) && step > 1,
    2: Boolean(draft.itemId) && step > 2,
    3: false,
  };
  const labels: Record<Step, string> = {
    1: "부류 선택",
    2: "품목 선택",
    3: "품종 선택",
  };
  const list: Step[] = [1, 2, 3];

  return (
    <div className="px-6 pt-3 pb-2">
      <div className="grid grid-cols-[auto_1fr_auto_1fr_auto] items-center">
        {list.map((s, idx) => {
          const active = step === s;
          const done = doneMap[s];
          const nodes: React.ReactNode[] = [
            <div
              key={`c-${s}`}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-bold",
                active && "bg-[#2E9E6B] text-white",
                done && !active && "border-2 border-[#2E9E6B] bg-white text-[#2E9E6B]",
                !active && !done && "bg-gray-200 text-gray-400",
              )}
            >
              {done ? <Check className="h-4 w-4" strokeWidth={3} /> : s}
            </div>,
          ];
          if (idx < list.length - 1) {
            nodes.push(
              <div
                key={`l-${s}`}
                className={cn(
                  "mx-2 h-[2px] rounded",
                  done ? "bg-[#2E9E6B]" : "bg-gray-200",
                )}
              />,
            );
          }
          return nodes;
        })}
      </div>
      <div className="mt-2 grid grid-cols-[auto_1fr_auto_1fr_auto] items-start">
        {list.map((s, idx) => {
          const active = step === s;
          const done = doneMap[s];
          const [w1, w2] = labels[s].split(" ");
          const nodes: React.ReactNode[] = [
            <div
              key={`t-${s}`}
              className={cn(
                "w-8 text-center text-[11px] leading-[1.25]",
                active && "font-bold text-[#2E9E6B]",
                done && !active && "font-medium text-[#2E9E6B]",
                !active && !done && "text-gray-400",
              )}
              style={{ wordBreak: "keep-all", whiteSpace: "normal" }}
            >
              <div>{w1}</div>
              <div>{w2}</div>
            </div>,
          ];
          if (idx < list.length - 1) nodes.push(<div key={`sp-${s}`} />);
          return nodes;
        })}
      </div>
    </div>
  );
}

/* ---------- Step 1 ---------- */

function Step1Category({
  selectedCategoryId,
  onPickCategory,
  onSearchJump,
}: {
  selectedCategoryId?: string;
  onPickCategory: (id: string) => void;
  onSearchJump: (r: SearchResult) => void;
}) {
  const [q, setQ] = useState("");
  const categories = getCategories();
  const results = useMemo(() => (q.trim() ? searchAll(q) : []), [q]);

  return (
    <div>
      <SearchInput value={q} onChange={setQ} placeholder={PLACEHOLDER[1]} />

      {q.trim() ? (
        <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white">
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
        <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4">
          <div className="mb-3 text-[14px] font-bold text-gray-900">부류 선택</div>
          <div className="grid grid-cols-2 gap-2.5">
            {categories.map((c) => {
              const count = getItemsByCategory(c.id).length;
              const selected = selectedCategoryId === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onPickCategory(c.id)}
                  aria-pressed={selected}
                  className={cn(
                    "flex min-h-[56px] items-center justify-between rounded-xl border bg-white px-3 py-3 text-left transition-colors",
                    selected
                      ? "border-[#2E9E6B] bg-[#F0FAF4]"
                      : "border-gray-200 active:bg-gray-50",
                  )}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <CropIcon iconKey={c.iconKey} size={26} />
                    <span
                      className={cn(
                        "truncate text-[14px] font-semibold",
                        selected ? "text-[#2E9E6B]" : "text-gray-900",
                      )}
                    >
                      {c.name}
                    </span>
                  </span>
                  <span className="ml-2 inline-flex h-5 min-w-[22px] items-center justify-center rounded-full bg-gray-100 px-1.5 text-[11px] font-medium text-gray-500">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Step 2 ---------- */

function Step2Item({
  categoryId,
  selectedItemId,
  onPickItem,
  onRemoveCategory,
}: {
  categoryId: string;
  selectedItemId?: string;
  onPickItem: (id: string) => void;
  onRemoveCategory: () => void;
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
    <div>
      <SearchInput value={q} onChange={setQ} placeholder={PLACEHOLDER[2]} />

      {category && (
        <div className="mt-3 flex flex-wrap gap-2">
          <UpperChip label={category.name} onRemove={onRemoveCategory} />
        </div>
      )}

      <div className="mt-3 rounded-2xl border border-gray-200 bg-white p-4">
        <div className="mb-3 text-[14px] font-bold text-gray-900">품목 선택</div>
        {filtered.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-gray-500">
            해당하는 품목이 없어요.
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {filtered.map((it) => {
              const selected = selectedItemId === it.id;
              return (
                <li key={it.id}>
                  <button
                    type="button"
                    onClick={() => onPickItem(it.id)}
                    aria-pressed={selected}
                    className={cn(
                      "flex min-h-[52px] w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors",
                      selected
                        ? "border-[#2E9E6B] bg-[#F0FAF4]"
                        : "border-gray-200 bg-white active:bg-gray-50",
                    )}
                  >
                    <span
                      className={cn(
                        "text-[14px] font-semibold",
                        selected ? "text-[#2E9E6B]" : "text-gray-900",
                      )}
                    >
                      {it.name}
                    </span>
                    {selected && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2E9E6B] text-white">
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ---------- Step 3 ---------- */

function Step3Variety({
  itemId,
  selectedVarietyId,
  onPickVariety,
  onRemoveCategory,
  onRemoveItem,
}: {
  itemId: string;
  selectedVarietyId?: string;
  onPickVariety: (id: string) => void;
  onRemoveCategory: () => void;
  onRemoveItem: () => void;
}) {
  const [q, setQ] = useState("");
  const item = getItemById(itemId);
  const category = item ? getCategoryById(item.categoryId) : undefined;
  const varieties = item?.varieties ?? [];
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return varieties;
    return varieties.filter((v) => v.name.toLowerCase().includes(query));
  }, [varieties, q]);

  const rows: { id: string; name: string }[] = [
    { id: ALL_VARIETY_ID, name: "전체 품종" },
    ...filtered.map((v) => ({ id: v.id, name: v.name })),
  ];

  return (
    <div>
      <SearchInput value={q} onChange={setQ} placeholder={PLACEHOLDER[3]} />

      <div className="mt-3 flex flex-wrap gap-2">
        {category && <UpperChip label={category.name} onRemove={onRemoveCategory} />}
        {item && <UpperChip label={item.name} onRemove={onRemoveItem} />}
      </div>

      <div className="mt-3 rounded-2xl border border-gray-200 bg-white p-4">
        <div className="mb-3 text-[14px] font-bold text-gray-900">품종 선택</div>
        <ul className="flex flex-col gap-2">
          {rows.map((r) => {
            const selected = selectedVarietyId === r.id;
            return (
              <li key={r.id}>
                <button
                  type="button"
                  onClick={() => onPickVariety(r.id)}
                  role="radio"
                  aria-checked={selected}
                  className={cn(
                    "flex min-h-[52px] w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors",
                    selected
                      ? "border-[#2E9E6B] bg-[#F0FAF4]"
                      : "border-gray-200 bg-white active:bg-gray-50",
                  )}
                >
                  <span
                    className={cn(
                      "text-[14px] font-semibold",
                      selected ? "text-[#2E9E6B]" : "text-gray-900",
                    )}
                  >
                    {r.name}
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full border-2",
                      selected ? "border-[#2E9E6B]" : "border-gray-300",
                    )}
                  >
                    {selected && (
                      <span className="h-2.5 w-2.5 rounded-full bg-[#2E9E6B]" />
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
  step,
  label,
  canProceed,
  onClick,
}: {
  draft: ReturnType<typeof useCropSelection.getState>["draft"];
  step: Step;
  label: string;
  canProceed: boolean;
  onClick: () => void;
}) {
  const category = draft.categoryId ? getCategoryById(draft.categoryId) : undefined;
  const item = draft.itemId ? getItemById(draft.itemId) : undefined;
  const varietyName = (() => {
    if (!draft.varietyId) return undefined;
    if (draft.varietyId === ALL_VARIETY_ID) return "전체 품종";
    return item?.varieties.find((v) => v.id === draft.varietyId)?.name;
  })();

  // Highlight color for the current step's most recent selection.
  const parts: { text: string; highlight: boolean }[] = [];
  if (category) parts.push({ text: category.name, highlight: step === 1 });
  if (item) parts.push({ text: item.name, highlight: step === 2 });
  if (varietyName) parts.push({ text: varietyName, highlight: step === 3 });

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[430px] bg-[#F7F8FA] px-5 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-3">
      {parts.length > 0 && (
        <div className="mb-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
          <div className="text-[12px] font-medium text-gray-500">선택한 조건</div>
          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[15px] font-bold">
            {parts.map((p, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-gray-300">›</span>}
                <span className={p.highlight ? "text-[#2E9E6B]" : "text-gray-900"}>
                  {p.text}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}
      <Button
        type="button"
        size="mobile"
        onClick={onClick}
        disabled={!canProceed}
        className={cn(
          "w-full bg-[#2E9E6B] text-white hover:bg-[#268A5C]",
          !canProceed && "bg-gray-200 text-gray-400 hover:bg-gray-200",
        )}
      >
        {label}
      </Button>
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
    <div className="flex h-12 items-center gap-2 rounded-full border border-gray-200 bg-white px-4">
      <Search className="h-4 w-4 text-gray-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-full flex-1 bg-transparent text-[14px] text-gray-900 outline-none placeholder:text-gray-400"
        aria-label={placeholder}
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

function UpperChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[#EAF6EF] pl-3 pr-2 text-[13px] font-semibold text-[#2E9E6B]">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`${label} 선택 해제`}
        className="flex h-5 w-5 items-center justify-center rounded-full text-[#2E9E6B]/70 active:bg-white/40"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </span>
  );
}
