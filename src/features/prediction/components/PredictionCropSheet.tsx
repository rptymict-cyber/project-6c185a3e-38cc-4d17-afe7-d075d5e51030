import { useEffect, useMemo, useState } from "react";
import { Check, Search, X } from "lucide-react";
import { PREDICTABLE_CROPS } from "../mockPredictionData";
import { cn } from "@/lib/utils";
import { CropIcon } from "@/components/crop-icon";
import { PredictionSheetFrame, SheetPrimaryButton } from "./PredictionSheetFrame";

/** 예측 지원 5종(사과·배추·양파·무·마늘)만 노출, 임시 선택 후 [적용하기] */
export function PredictionCropSheet({
  open,
  onOpenChange,
  selectedCropId,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  selectedCropId: string | null;
  onSelect: (cropId: string) => void;
}) {
  const [q, setQ] = useState("");
  const [draft, setDraft] = useState<string | null>(selectedCropId);
  useEffect(() => {
    if (open) {
      setDraft(selectedCropId);
      setQ("");
    }
  }, [open, selectedCropId]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return PREDICTABLE_CROPS;
    return PREDICTABLE_CROPS.filter(
      (c) => c.name.toLowerCase().includes(query) || c.varietyName.toLowerCase().includes(query),
    );
  }, [q]);

  return (
    <PredictionSheetFrame
      open={open}
      onOpenChange={onOpenChange}
      title="작물 선택"
      footer={
        <SheetPrimaryButton
          disabled={!draft}
          onClick={() => {
            if (!draft) return;
            onSelect(draft);
            onOpenChange(false);
          }}
        >
          적용하기
        </SheetPrimaryButton>
      }
    >
      <div className="px-4 pb-2 pt-3">
        <div className="flex h-11 items-center gap-2 rounded-full border border-[#E9ECEF] bg-white px-4">
          <Search className="h-4 w-4 text-[#868E96]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="예측 작물 검색"
            className="h-full flex-1 bg-transparent text-body text-foreground outline-none placeholder:text-[#ADB5BD]"
          />
          {q && (
            <button
              type="button"
              onClick={() => setQ("")}
              aria-label="지우기"
              className="grid h-5 w-5 place-items-center rounded-full text-[#868E96]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
      <div className="px-4 pb-4 pt-2">
        {filtered.length === 0 ? (
          <div className="py-10 text-center text-body text-[#868E96]">검색 결과가 없어요.</div>
        ) : (
          <ul className="divide-y divide-[#F1F3F5] overflow-hidden rounded-xl border border-[#E9ECEF] bg-white">
            {filtered.map((c) => {
              const active = c.id === draft;
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => setDraft(c.id)}
                    className={cn(
                      "flex w-full items-center gap-3 px-4 py-3.5 text-left active:bg-[#F8F9FA]",
                      active && "bg-[#F0F9F0]",
                    )}
                  >
                    <CropIcon name={c.name} size={24} />
                    <div className="min-w-0 flex-1">
                      <div className={cn("text-body font-semibold", active ? "text-[#1F5C1F]" : "text-foreground")}>
                        {c.name}
                      </div>
                      <div className="text-meta text-[#868E96]">
                        {c.categoryName} · {c.varietyName}
                      </div>
                    </div>
                    {active && <Check className="h-5 w-5 text-[#3A8A3A]" />}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </PredictionSheetFrame>
  );
}
