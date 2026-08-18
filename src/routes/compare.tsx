import { applyMarketSelection } from "@/lib/goto-market";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sprout } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AppHeader } from "@/components/app-header";
import { CROPS } from "@/lib/mock/crops";
import { MARKETS } from "@/lib/mock/markets";
import { PriceBadge } from "@/components/price-badge";
import { FullSelectCard } from "@/components/common/ConditionSelectCard";
import { cn } from "@/lib/utils";

interface CompareSearch {
  cropId?: string;
}

export const Route = createFileRoute("/compare")({
  component: ComparePage,
  validateSearch: (raw: Record<string, unknown>): CompareSearch => ({
    cropId: typeof raw.cropId === "string" ? raw.cropId : undefined,
  }),
  head: () => ({
    meta: [
      { title: "시장별 비교 — AGDICT" },
      { name: "description", content: "여러 도매시장의 평균가를 한눈에 비교하세요." },
    ],
  }),
});

function ComparePage() {
  const { cropId } = Route.useSearch();
  // 작물 선택은 공통 화면(/crop-select, SEL-001)에서만 수행한다.
  const crop = CROPS.find((c) => c.id === cropId) ?? CROPS[0];

  // deterministic factor per market so numbers vary but stay stable
  // 정렬·최고/최저 표현은 CMP-001(/market-compare)과 동일하게 "높은 가격순 + 배지/테두리" 방식.
  // ※ 두 화면이 하나로 통합되면 이 블록은 그대로 제거 가능(중복 해소).
  const rows = MARKETS.map((m) => {
    const factor = 0.9 + ((m.id.charCodeAt(0) % 20) / 100);
    const price = Math.round(crop.currentPrice * factor);
    const prev = Math.round(crop.prevPrice * factor);
    return {
      market: m,
      price,
      pct: ((price - prev) / prev) * 100,
    };
  }).sort((a, b) => b.price - a.price);

  const maxPrice = rows[0]?.price ?? 0;
  const lastIdx = rows.length - 1;

  return (
    <AppShell screenId="MKT-009_시장별가격비교" header={<AppHeader title="시장별 가격 비교" showBell={false} />}>
      <div className="px-4 pt-4 pb-8">
        <FullSelectCard
          icon={<Sprout className="h-4 w-4" />}
          label="작물"
          value={crop.name}
          to="/crop-select"
          search={{ from: "compare", return: "/compare" }}
        />

        <h2 className="mt-6 mb-2 px-1 text-[13px] font-bold text-muted-foreground">
          시장별 순위 <span className="font-semibold">(높은 가격순)</span>
        </h2>
        <ul className="overflow-hidden rounded-[10px] bg-surface">
          {rows.map((r, i) => {
            const isTop = i === 0;
            const isBottom = i === lastIdx && rows.length > 1;
            const barPct = maxPrice > 0 ? Math.max(6, (r.price / maxPrice) * 100) : 0;
            return (
              <li
                key={r.market.id}
                className={cn(
                  "px-3 py-3",
                  i > 0 && "border-t border-border",
                  isTop && "rounded-t-[10px] border-2 border-price-up bg-price-up-bg",
                  isBottom && "rounded-b-[10px] border-2 border-price-down bg-price-down-bg",
                )}
              >
                <div className="grid grid-cols-[28px_1fr_auto_auto] items-center gap-2.5">
                  <span
                    className={cn(
                      "grid h-7 w-7 shrink-0 place-items-center rounded-full text-[12px] font-black tabular-nums",
                      isTop
                        ? "bg-price-up text-white"
                        : isBottom
                          ? "bg-price-down text-white"
                          : "bg-secondary text-muted-foreground",
                    )}
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-[14px] font-semibold">{r.market.name}</span>
                      {isTop && (
                        <span className="shrink-0 rounded bg-price-up px-1.5 py-0.5 text-[10px] font-black text-white">
                          최고가
                        </span>
                      )}
                      {isBottom && (
                        <span className="shrink-0 rounded bg-price-down px-1.5 py-0.5 text-[10px] font-black text-white">
                          최저가
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-muted-foreground">{r.market.region}</div>
                  </div>
                  <span className="font-data text-[14px] font-bold tabular-nums">
                    {r.price.toLocaleString()}
                  </span>
                  <PriceBadge changePct={r.pct} />
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      isTop ? "bg-price-up" : isBottom ? "bg-price-down" : "bg-primary/70",
                    )}
                    style={{ width: `${barPct}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 text-center">
          <Link
            to="/market"
            onClick={() => applyMarketSelection(crop.id)}
            className="text-[13px] font-semibold text-primary"
          >
            {crop.name} 상세 시세 보기 →
          </Link>
        </div>
      </div>
    </AppShell>
  );
}

