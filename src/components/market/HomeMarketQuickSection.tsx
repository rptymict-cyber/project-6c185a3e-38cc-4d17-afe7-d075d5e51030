import { Link, useNavigate } from "@tanstack/react-router";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { MARKETS } from "@/lib/mock/markets";
import { useHomeFixed, HOME_FIXED_MAX } from "@/store/homeFixedItems";
import { cn } from "@/lib/utils";

export function HomeMarketQuickSection() {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const fixedIds = useHomeFixed((s) => s.markets);
  const removeMarket = useHomeFixed((s) => s.removeMarket);

  const fixed = fixedIds
    .map((id) => MARKETS.find((m) => m.id === id))
    .filter((m): m is (typeof MARKETS)[number] => Boolean(m));

  return (
    <section className="mt-6 px-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[14px] font-bold text-foreground">도매시장별 조회</h3>
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
        {fixed.map((m) => (
          <div key={m.id} className="relative">
            <Link
              to="/market/wholesale/$market"
              params={{ market: m.id }}
              className={cn(
                "flex shrink-0 flex-col items-center gap-1.5",
                editing && "pointer-events-none",
              )}
            >
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#F0F9F0] text-2xl">
                🏛️
              </span>
              <span className="text-[11px] font-medium text-foreground">{m.name}</span>
            </Link>
            {editing && (
              <button
                onClick={() => removeMarket(m.id)}
                aria-label={`${m.name} 삭제`}
                className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-[#DC2626] text-white shadow"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}
        {fixed.length < HOME_FIXED_MAX && (
          <button
            onClick={() => navigate({ to: "/market/wholesale" })}
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
