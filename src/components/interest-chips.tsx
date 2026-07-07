import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useInterests } from "@/store/interests";
import { getCrop } from "@/lib/mock/crops";
import { cn } from "@/lib/utils";
import { useState } from "react";
// NOTE: 작물 추가는 /crop-select 페이지가 유일한 진입점.
// AddCropSheet 컴포넌트 파일은 롤백 대비로 남겨두었으며 여기서 import 하지 않는다.

export function InterestChips() {
  const ids = useInterests((s) => s.ids);
  const selectedId = useInterests((s) => s.selectedId);
  const select = useInterests((s) => s.select);
  const remove = useInterests((s) => s.remove);
  const [editing, setEditing] = useState(false);
  const [open, setOpen] = useState(false);

  const items = ids.map(getCrop).filter(Boolean) as ReturnType<typeof getCrop> extends undefined
    ? never
    : NonNullable<ReturnType<typeof getCrop>>[];

  return (
    <>
      <div className="flex items-center justify-between px-4 pt-3">
        <span className="text-[11px] font-semibold text-muted-foreground">
          관심 작물 {items.length}
        </span>
        <button
          onClick={() => setEditing((v) => !v)}
          className="text-[11px] font-semibold text-[#3A8A3A]"
        >
          {editing ? "완료" : "편집"}
        </button>
      </div>
      <div className="-mx-4 mt-1.5 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((c) => {
          const active = c.id === selectedId;
          return (
            <button
              key={c.id}
              onClick={() => select(c.id)}
              className={cn(
                "group inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors",
                active
                  ? "border-[#3A8A3A] bg-[#3A8A3A] text-white"
                  : "border-[#3A8A3A] bg-[#F0F9F0] text-[#1F5C1F]",
              )}
            >
              <span aria-hidden>{c.emoji}</span>
              <span>{c.name}</span>
              {editing && (
                <span
                  role="button"
                  aria-label={`${c.name} 삭제`}
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(c.id);
                    toast(`${c.name}가(이) 삭제되었습니다`);
                  }}
                  className={cn(
                    "-mr-1 grid h-4 w-4 place-items-center rounded-full",
                    active ? "bg-white/25" : "bg-[#3A8A3A]/15",
                  )}
                >
                  <X className="h-3 w-3" />
                </span>
              )}
            </button>
          );
        })}
        <Link
          to="/crop-select"
          search={{ from: "home", return: "/" }}
          className="inline-flex shrink-0 items-center gap-1 rounded-full border border-dashed border-[#ADB5BD] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#6C757D]"
        >
          <Plus className="h-3.5 w-3.5" />
          추가
        </Link>
      </div>
    </>
  );
}
