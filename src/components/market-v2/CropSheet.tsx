import { useEffect, useState } from "react";
import { Check, ChevronRight } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CATEGORIES } from "@/lib/mock/market-taxonomy";
import { useMarketFilter } from "@/store/market";
import { cn } from "@/lib/utils";

type Step = 1 | 2 | 3;

/**
 * Unified 작물 선택 sheet. Breadcrumb steps are individually tappable so any
 * single stage (부류 / 품목 / 품종) can be edited without restarting the flow.
 * When the sheet opens with a fully-selected crop, it lands on the last step.
 * Changing an upper step resets only the downstream selections.
 */
export function CropSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const filter = useMarketFilter();
  const [step, setStep] = useState<Step>(3);
  const [catId, setCatId] = useState(filter.categoryId);
  const [itemId, setItemId] = useState(filter.itemId);

  useEffect(() => {
    if (open) {
      setCatId(filter.categoryId);
      setItemId(filter.itemId);
      setStep(3); // already have a full selection → start at variety list
    }
  }, [open, filter.categoryId, filter.itemId]);

  const category =
    CATEGORIES.find((c) => c.id === catId) ?? CATEGORIES[0];
  const item =
    category.items.find((i) => i.id === itemId) ?? category.items[0];

  const commit = (varietyId: string, varietyLabel: string) => {
    filter.setItem({
      categoryId: category.id,
      categoryLabel: category.label,
      itemId: item.id,
      itemLabel: item.label,
      varietyId,
      varietyLabel,
    });
    onOpenChange(false);
  };

  // Breadcrumb chip labels — show current selection preview per step.
  const chipCat = category.label;
  const chipItem = step >= 2 ? item.label : filter.itemLabel;
  const chipVar =
    step >= 3 && item.id === filter.itemId ? filter.varietyLabel : "선택";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85dvh] overflow-y-auto rounded-t-2xl p-0">
        <SheetHeader className="px-5 pt-5">
          <SheetTitle className="text-[16px] font-bold">작물 선택</SheetTitle>
        </SheetHeader>

        {/* Breadcrumb steps — each chip is individually tappable */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 px-5">
          <StepChip
            n={1}
            title="부류"
            value={chipCat}
            active={step === 1}
            onClick={() => setStep(1)}
          />
          <ChevronRight className="h-3.5 w-3.5 text-[#ADB5BD]" />
          <StepChip
            n={2}
            title="품목"
            value={chipItem}
            active={step === 2}
            onClick={() => setStep(2)}
          />
          <ChevronRight className="h-3.5 w-3.5 text-[#ADB5BD]" />
          <StepChip
            n={3}
            title="품종"
            value={chipVar}
            active={step === 3}
            onClick={() => setStep(3)}
          />
        </div>

        {/* Lists */}
        <div className="px-2 pb-6 pt-3">
          {step === 1 && (
            <ul>
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => {
                      // Changing 부류 resets 품목 / 품종
                      setCatId(c.id);
                      setItemId(c.items[0].id);
                      setStep(2);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-[10px] px-3 py-3 text-left text-[14px]",
                      c.id === catId ? "bg-[#F0F9F0] font-bold text-[#1F5C1F]" : "text-foreground",
                    )}
                  >
                    {c.label}
                    <ChevronRight className="h-4 w-4 text-[#ADB5BD]" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {step === 2 && (
            <ul>
              {category.items.map((it) => (
                <li key={it.id}>
                  <button
                    type="button"
                    onClick={() => {
                      // Changing 품목 resets 품종만
                      setItemId(it.id);
                      setStep(3);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-[10px] px-3 py-3 text-left text-[14px]",
                      it.id === itemId ? "bg-[#F0F9F0] font-bold text-[#1F5C1F]" : "text-foreground",
                    )}
                  >
                    {it.label}
                    <ChevronRight className="h-4 w-4 text-[#ADB5BD]" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {step === 3 && (
            <ul>
              {item.varieties.map((v) => {
                const isCurrent =
                  v.id === filter.varietyId && item.id === filter.itemId;
                return (
                  <li key={v.id}>
                    <button
                      type="button"
                      onClick={() => commit(v.id, v.label)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-[10px] px-3 py-3 text-left text-[14px]",
                        isCurrent ? "bg-[#F0F9F0] font-bold text-[#1F5C1F]" : "text-foreground",
                      )}
                    >
                      {v.label}
                      {isCurrent && <Check className="h-4 w-4 text-[#3A8A3A]" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function StepChip({
  n,
  title,
  value,
  active,
  onClick,
}: {
  n: number;
  title: string;
  value: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px]",
        active
          ? "border-[#3A8A3A] bg-[#3A8A3A] text-white"
          : "border-[#E9ECEF] bg-white text-[#495057]",
      )}
    >
      <span
        className={cn(
          "grid h-4 w-4 place-items-center rounded-full text-[10px] font-bold",
          active ? "bg-white/25 text-white" : "bg-[#F1F3F5] text-[#6C757D]",
        )}
      >
        {n}
      </span>
      <span className="font-semibold">{title}</span>
      <span className={cn("font-bold", active ? "text-white" : "text-foreground")}>
        {value}
      </span>
    </button>
  );
}
