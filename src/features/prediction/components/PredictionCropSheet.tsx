import { useMemo, useState } from "react";
import { Check, Search, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { PREDICTABLE_CROPS } from "../mockPredictionData";
import { cn } from "@/lib/utils";

export function PredictionCropSheet({
  open,
  onOpenChange,
  selectedCropId,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  selectedCropId: string;
  onSelect: (cropId: string) => void;
}) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return PREDICTABLE_CROPS;
    return PREDICTABLE_CROPS.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.varietyName.toLowerCase().includes(query),
    );
  }, [q]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="mx-auto max-w-[430px] rounded-t-2xl p-0"
      >
        <SheetHeader className="border-b border-[#E9ECEF] px-4 py-3.5 text-left">
          <SheetTitle className="text-[15px] font-bold text-foreground">
            예측 작물 선택
          </SheetTitle>
        </SheetHeader>
        <div className="px-4 pb-2 pt-3">
          <div className="flex h-11 items-center gap-2 rounded-full border border-[#E9ECEF] bg-white px-4">
            <Search className="h-4 w-4 text-[#868E96]" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="예측 작물 검색"
              className="h-full flex-1 bg-transparent text-[13px] text-foreground outline-none placeholder:text-[#ADB5BD]"
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
        <div className="max-h-[60vh] overflow-y-auto px-4 pb-6 pt-2">
          {filtered.length === 0 ? (
            <div className="py-10 text-center text-[13px] text-[#868E96]">
              검색 결과가 없어요.
            </div>
          ) : (
            <ul className="divide-y divide-[#F1F3F5] overflow-hidden rounded-xl border border-[#E9ECEF] bg-white">
              {filtered.map((c) => {
                const active = c.id === selectedCropId;
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelect(c.id);
                        onOpenChange(false);
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 px-4 py-3.5 text-left active:bg-[#F8F9FA]",
                        active && "bg-[#F0F9F0]",
                      )}
                    >
                      <span className="text-xl">{c.emoji}</span>
                      <div className="min-w-0 flex-1">
                        <div
                          className={cn(
                            "text-[14px] font-semibold",
                            active ? "text-[#1F5C1F]" : "text-foreground",
                          )}
                        >
                          {c.name}
                        </div>
                        <div className="text-[11px] text-[#868E96]">
                          {c.categoryName} · {c.varietyName}
                        </div>
                      </div>
                      {active && (
                        <Check className="h-5 w-5 text-[#3A8A3A]" />
                      )}
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
