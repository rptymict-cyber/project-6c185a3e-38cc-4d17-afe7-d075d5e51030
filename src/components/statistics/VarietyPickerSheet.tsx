import { useEffect, useState } from "react";
import { Check, ChevronRight } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CATEGORIES, CROPS, type Category } from "@/lib/mock/crops";
import { cn } from "@/lib/utils";

/**
 * Statistics-page 작물 선택 sheet. Mirrors CropSheet's breadcrumb-step UX
 * but sources from the flat CROPS taxonomy used by the statistics ranking.
 */
export function VarietyPickerSheet({
  open,
  onOpenChange,
  currentCropId,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  currentCropId: string;
  onSelect: (cropId: string) => void;
}) {
  const current = CROPS.find((c) => c.id === currentCropId);
  const [step, setStep] = useState<1 | 2>(2);
  const [catId, setCatId] = useState<Category | "all">(current?.category ?? "fruit");

  useEffect(() => {
    if (open) {
      setCatId(current?.category ?? "fruit");
      setStep(2);
    }
  }, [open, current?.category]);

  const cats = CATEGORIES.filter((c) => c.id !== "all");
  const activeCat = cats.find((c) => c.id === catId) ?? cats[0];
  const varieties = CROPS.filter((c) => c.category === activeCat.id);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85dvh] overflow-y-auto rounded-t-2xl p-0">
        <SheetHeader className="px-5 pt-5">
          <SheetTitle className="text-[16px] font-bold">작물 선택</SheetTitle>
        </SheetHeader>

        <div className="mt-3 flex flex-wrap items-center gap-1.5 px-5">
          <StepChip
            n={1}
            title="부류"
            value={activeCat.label}
            active={step === 1}
            onClick={() => setStep(1)}
          />
          <ChevronRight className="h-3.5 w-3.5 text-[#ADB5BD]" />
          <StepChip
            n={2}
            title="품종"
            value={
              step >= 2 && current?.category === activeCat.id ? current.name : "선택"
            }
            active={step === 2}
            onClick={() => setStep(2)}
          />
        </div>

        <div className="px-2 pb-6 pt-3">
          {step === 1 && (
            <ul>
              {cats.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setCatId(c.id);
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
              {varieties.map((v) => {
                const isCurrent = v.id === currentCropId;
                return (
                  <li key={v.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelect(v.id);
                        onOpenChange(false);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between gap-2 rounded-[10px] px-3 py-3 text-left text-[14px]",
                        isCurrent ? "bg-[#F0F9F0] font-bold text-[#1F5C1F]" : "text-foreground",
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-[18px]">{v.emoji}</span>
                        {v.name}
                      </span>
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
