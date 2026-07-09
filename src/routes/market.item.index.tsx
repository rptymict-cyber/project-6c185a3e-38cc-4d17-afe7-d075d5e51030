import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { DetailHeader } from "@/components/detail-header";
import { ITEMS, ITEM_CATEGORIES } from "@/lib/mock/items";
import { useHomeFixed } from "@/store/homeFixedItems";
import { CropIcon } from "@/components/crop-icon";
import { Check, Plus } from "lucide-react";

export const Route = createFileRoute("/market/item/")({
  head: () => ({
    meta: [
      { title: "품목별 조회 — AGDICT" },
      { name: "description", content: "전체 품목 목록에서 원하는 품목을 선택하세요." },
    ],
  }),
  component: ItemIndexPage,
});

function ItemIndexPage() {
  const fixed = useHomeFixed((s) => s.items);
  const addItem = useHomeFixed((s) => s.addItem);
  const removeItem = useHomeFixed((s) => s.removeItem);

  return (
    <AppShell
      header={<DetailHeader title="품목별 조회" onBack={() => history.back()} />}
    >
      <div className="px-4 pb-8 pt-3">
        <p className="mb-3 text-[12px] text-muted-foreground">
          홈에 고정하려면 오른쪽 + 버튼을 눌러 추가하세요.
        </p>
        {ITEM_CATEGORIES.filter((c) => c.id !== "all").map((cat) => {
          const list = ITEMS.filter((it) => it.category === cat.id);
          if (list.length === 0) return null;
          return (
            <section key={cat.id} className="mb-5">
              <h3 className="mb-2 text-[13px] font-bold text-foreground">{cat.label}</h3>
              <ul className="overflow-hidden rounded-[10px] bg-surface">
                {list.map((it) => {
                  const isFixed = fixed.includes(it.id);
                  return (
                    <li
                      key={it.id}
                      className="flex items-center gap-3 border-t border-[#F1F3F5] px-3 py-2.5 first:border-t-0"
                    >
                      <Link
                        to="/market/item/$item"
                        params={{ item: it.id }}
                        className="flex min-w-0 flex-1 items-center gap-2.5"
                      >
                        <CropIcon name={it.name} size={28} />
                        <span className="text-[14px] font-semibold text-foreground">{it.name}</span>
                      </Link>
                      <button
                        onClick={() => (isFixed ? removeItem(it.id) : addItem(it.id))}
                        className={
                          "grid h-8 w-8 place-items-center rounded-full " +
                          (isFixed ? "bg-[#3A8A3A] text-white" : "bg-[#F1F3F5] text-muted-foreground")
                        }
                        aria-label={isFixed ? "홈에서 제거" : "홈에 추가"}
                      >
                        {isFixed ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </AppShell>
  );
}
