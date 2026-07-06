import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { ITEMS, topVariety } from "@/lib/mock/items";
import { useMarketStore, SORT_LABEL } from "@/store/market";
import { CategoryChips } from "./CategoryChips";
import { ItemRow } from "./ItemRow";
import { SortSheet } from "./SortSheet";

export function ItemsPanel() {
  const category = useMarketStore((s) => s.category);
  const setCategory = useMarketStore((s) => s.setCategory);
  const sort = useMarketStore((s) => s.sort);
  const setSort = useMarketStore((s) => s.setSort);
  const [sheetOpen, setSheetOpen] = useState(false);

  const filtered = useMemo(() => {
    const list = category === "all" ? ITEMS : ITEMS.filter((i) => i.category === category);
    const sorted = [...list];
    if (sort === "volume") {
      sorted.sort(
        (a, b) =>
          b.varieties.reduce((s, v) => s + v.volumeTon, 0) -
          a.varieties.reduce((s, v) => s + v.volumeTon, 0),
      );
    } else if (sort === "change") {
      sorted.sort((a, b) => topVariety(b).changePct - topVariety(a).changePct);
    } else {
      sorted.sort((a, b) => a.name.localeCompare(b.name, "ko"));
    }
    return sorted;
  }, [category, sort]);

  return (
    <div className="pb-4">
      <CategoryChips value={category} onChange={setCategory} />

      <div className="flex items-center justify-between px-4 pb-1.5 pt-2.5">
        <span className="text-[12px] text-[#6C757D]">품목 {filtered.length}개</span>
        <button
          onClick={() => setSheetOpen(true)}
          className="inline-flex items-center gap-0.5 text-[12.5px] font-semibold text-foreground"
        >
          {SORT_LABEL[sort]}
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <span className="text-4xl">🌾</span>
          <span className="text-[13px] text-[#6C757D]">해당 분류의 거래 품목이 없어요</span>
        </div>
      ) : (
        <ul className="divide-y divide-[#F1F3F5] border-y border-[#F1F3F5]">
          {filtered.map((item) => (
            <li key={item.id}>
              <ItemRow item={item} />
            </li>
          ))}
        </ul>
      )}

      <SortSheet open={sheetOpen} onOpenChange={setSheetOpen} value={sort} onChange={setSort} />
    </div>
  );
}
