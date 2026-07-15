import { useMemo, useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { CROPS, CROP_GROUPS, type CropId } from "@/lib/mock/statistics-mock";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatsCropSheet({
  open, onOpenChange, selected, onSelect,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  selected: CropId;
  onSelect: (c: CropId) => void;
}) {
  const [q, setQ] = useState("");

  const groups = useMemo(() => {
    const kw = q.trim();
    return CROP_GROUPS.map((g) => ({
      ...g,
      crops: g.crops.filter((id) => !kw || CROPS[id].name.includes(kw)),
    })).filter((g) => g.crops.length > 0);
  }, [q]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85vh] rounded-t-2xl p-0">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <h3 className="text-[16px] font-black">작물 선택</h3>
          <button onClick={() => onOpenChange(false)} aria-label="닫기" className="p-1"><X className="h-5 w-5" /></button>
        </div>
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 rounded-[10px] border border-[#E9ECEF] bg-white px-3 py-2">
            <Search className="h-4 w-4 text-[#868E96]" />
            <input
              value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="품목명 검색"
              className="w-full bg-transparent text-[13.5px] outline-none placeholder:text-[#ADB5BD]"
            />
          </div>
        </div>
        <div className="max-h-[65vh] overflow-y-auto px-4 pb-6">
          {groups.map((g) => (
            <section key={g.id} className="mt-3">
              <h4 className="mb-2 text-[12px] font-bold text-[#495057]">{g.label}</h4>
              <div className="grid grid-cols-3 gap-2">
                {g.crops.map((id) => {
                  const c = CROPS[id];
                  const active = id === selected;
                  return (
                    <button
                      key={id}
                      onClick={() => { onSelect(id); onOpenChange(false); }}
                      className={cn(
                        "flex flex-col items-center justify-center gap-1 rounded-[10px] border px-2 py-3 text-[12.5px] font-semibold",
                        active
                          ? "border-[#3A8A3A] bg-[#EBF7EB] text-[#2F6F2F]"
                          : "border-[#E9ECEF] bg-white text-foreground active:bg-[#F8F9FA]",
                      )}
                    >
                      <span className="text-[22px] leading-none">{c.emoji}</span>
                      <span>{c.name}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
          {groups.length === 0 && (
            <p className="mt-8 text-center text-[13px] text-[#868E96]">검색 결과가 없어요</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
