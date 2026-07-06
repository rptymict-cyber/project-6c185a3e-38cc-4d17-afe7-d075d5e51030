import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Check, Plus, Search, X } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { CATEGORIES, type Crop } from "@/lib/mock/crops";
import { useInterests } from "@/store/interests";
import { cn } from "@/lib/utils";

type CatId = (typeof CATEGORIES)[number]["id"];

export function AddCropSheet({
  open,
  onOpenChange,
  allCrops,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  allCrops: Crop[];
}) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<CatId>("all");
  const ids = useInterests((s) => s.ids);
  const add = useInterests((s) => s.add);
  const remove = useInterests((s) => s.remove);

  const list = useMemo(() => {
    return allCrops.filter((c) => {
      if (cat !== "all" && c.category !== cat) return false;
      if (q && !c.name.includes(q.trim())) return false;
      return true;
    });
  }, [allCrops, cat, q]);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="mx-auto max-w-[430px] px-0">
        <DrawerHeader className="pb-2">
          <DrawerTitle className="text-left text-[16px] font-bold">작물 추가</DrawerTitle>
        </DrawerHeader>

        <div className="px-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="작물명으로 검색"
              className="h-10 w-full rounded-lg bg-[#F8F9FA] pl-9 pr-9 text-[14px] outline-none focus:ring-2 focus:ring-[#3A8A3A]/30"
            />
            {q && (
              <button
                onClick={() => setQ("")}
                className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="mt-3 -mx-0 flex gap-1.5 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1 text-[12px] font-semibold",
                cat === c.id
                  ? "bg-[#3A8A3A] text-white"
                  : "bg-secondary text-[#6C757D]",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="max-h-[55vh] overflow-y-auto px-2 pb-6">
          {list.length === 0 && (
            <div className="px-4 py-10 text-center text-[13px] text-muted-foreground">
              검색 결과가 없어요
            </div>
          )}
          {list.map((c) => {
            const added = ids.includes(c.id);
            const catLabel = CATEGORIES.find((x) => x.id === c.category)?.label ?? "";
            return (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-lg px-2 py-2.5 active:bg-secondary"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="text-xl" aria-hidden>
                    {c.emoji}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-[14px] font-semibold text-foreground">
                      {c.name}
                    </div>
                    <div className="text-[11px] text-muted-foreground">{catLabel}</div>
                  </div>
                </div>
                <button
                  aria-label={added ? "제거" : "추가"}
                  onClick={() => {
                    if (added) {
                      remove(c.id);
                      toast(`${c.name}가(이) 삭제되었습니다`);
                    } else {
                      add(c.id);
                      toast(`🌱 ${c.name}가(이) 관심 작물에 추가되었습니다`);
                    }
                  }}
                  className={cn(
                    "grid h-8 w-8 shrink-0 place-items-center rounded-full",
                    added
                      ? "bg-[#F0F9F0] text-[#3A8A3A]"
                      : "bg-[#3A8A3A] text-white",
                  )}
                >
                  {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </button>
              </div>
            );
          })}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
