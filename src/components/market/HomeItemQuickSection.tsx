import { Link, useNavigate } from "@tanstack/react-router";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { ITEMS } from "@/lib/mock/items";
import { CropIcon } from "@/components/crop-icon";
import { useHomeFixed, HOME_FIXED_MAX } from "@/store/homeFixedItems";
import { cn } from "@/lib/utils";

export function HomeItemQuickSection() {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const fixedIds = useHomeFixed((s) => s.items);
  const removeItem = useHomeFixed((s) => s.removeItem);

  const fixed = fixedIds
    .map((id) => ITEMS.find((it) => it.id === id))
    .filter((it): it is (typeof ITEMS)[number] => Boolean(it));

  return (
    <section className="mt-6 px-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[14px] font-bold text-foreground">품목별 조회</h3>
        <button
          onClick={() => setEditing((v) => !v)}
          className={cn(
            "rounded-full px-2.5 py-1 text-[11.5px] font-semibold",
            editing ? "bg-[#3A8A3A] text-white" : "bg-[#F1F3F5] text-muted-foreground",
          )}
        >
          {editing ? "완료" : "편집"}
        </button>
      </div>
      <div className="no-scrollbar flex gap-3 overflow-x-auto">
        {fixed.map((it) => (
          <div key={it.id} className="relative">
            <Link
              to="/market/item/$item"
              params={{ item: it.id }}
              className={cn(
                "flex shrink-0 flex-col items-center gap-1.5",
                editing && "pointer-events-none",
              )}
            >
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#F0F9F0]">
                <CropIcon name={it.name} size={32} />
              </span>
              <span className="text-[11px] font-medium text-foreground">{it.name}</span>
            </Link>
            {editing && (
              <button
                onClick={() => removeItem(it.id)}
                aria-label={`${it.name} 삭제`}
                className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-[#DC2626] text-white shadow"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}
        {fixed.length < HOME_FIXED_MAX && (
          <button
            onClick={() => navigate({ to: "/market/item" })}
            className="flex shrink-0 flex-col items-center gap-1.5"
          >
            <span className="grid h-14 w-14 place-items-center rounded-2xl border-2 border-dashed border-[#CED4DA] text-muted-foreground">
              <Plus className="h-5 w-5" />
            </span>
            <span className="text-[11px] font-medium text-muted-foreground">추가</span>
          </button>
        )}
      </div>
    </section>
  );
}
