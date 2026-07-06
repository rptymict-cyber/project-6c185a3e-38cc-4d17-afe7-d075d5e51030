import { useEffect, useState } from "react";
import { Check, ChevronRight } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CATEGORIES } from "@/lib/mock/market-taxonomy";
import { useMarketFilter } from "@/store/market";
import { cn } from "@/lib/utils";

type Step = 1 | 2 | 3;

export function ItemSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const filter = useMarketFilter();
  const [step, setStep] = useState<Step>(1);
  const [catId, setCatId] = useState(filter.categoryId);
  const [itemId, setItemId] = useState(filter.itemId);

  useEffect(() => {
    if (open) {
      setStep(1);
      setCatId(filter.categoryId);
      setItemId(filter.itemId);
    }
  }, [open, filter.categoryId, filter.itemId]);

  const category = CATEGORIES.find((c) => c.id === catId) ?? CATEGORIES[0];
  const item = category.items.find((i) => i.id === itemId) ?? category.items[0];

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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85dvh] overflow-y-auto rounded-t-2xl p-0">
        <SheetHeader className="px-5 pt-5">
          <SheetTitle className="text-[16px] font-bold">품목 선택</SheetTitle>
        </SheetHeader>

        {/* Step indicator */}
        <div className="flex items-center gap-1.5 px-5 pt-3 text-[12px]">
          <StepDot n={1} label="부류" active={step === 1} done={step > 1} onClick={() => setStep(1)} />
          <ChevronRight className="h-3 w-3 text-[#ADB5BD]" />
          <StepDot n={2} label="품목" active={step === 2} done={step > 2} onClick={() => step > 1 && setStep(2)} />
          <ChevronRight className="h-3 w-3 text-[#ADB5BD]" />
          <StepDot n={3} label="품종" active={step === 3} done={false} onClick={() => step > 2 && setStep(3)} />
        </div>

        {/* Current path breadcrumb */}
        <div className="mx-5 mt-3 rounded-[10px] bg-[#F0F9F0] px-3 py-2 text-[12.5px] text-[#1F5C1F]">
          {category.label}
          {step >= 2 && <> {" › "} <b>{item.label}</b></>}
          {step >= 3 && <> {" › "} <span className="font-bold">{filter.varietyLabel}</span> <Check className="ml-1 inline h-3.5 w-3.5" /></>}
        </div>

        {/* Lists */}
        <div className="px-2 pb-6 pt-2">
          {step === 1 && (
            <ul>
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => {
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
                    onClick={() => {
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
              {item.varieties.map((v) => (
                <li key={v.id}>
                  <button
                    onClick={() => commit(v.id, v.label)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-[10px] px-3 py-3 text-left text-[14px]",
                      v.id === filter.varietyId ? "bg-[#F0F9F0] font-bold text-[#1F5C1F]" : "text-foreground",
                    )}
                  >
                    {v.label}
                    {v.id === filter.varietyId && <Check className="h-4 w-4 text-[#3A8A3A]" />}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function StepDot({
  n, label, active, done, onClick,
}: { n: number; label: string; active: boolean; done: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1",
        active ? "text-[#1F5C1F]" : done ? "text-[#3A8A3A]" : "text-[#ADB5BD]",
      )}
    >
      <span className={cn(
        "grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold",
        active ? "bg-[#3A8A3A] text-white" : done ? "bg-[#D6F0D6] text-[#1F5C1F]" : "bg-[#F1F3F5]",
      )}>{n}</span>
      <span className="text-[12px] font-semibold">{label}</span>
    </button>
  );
}
