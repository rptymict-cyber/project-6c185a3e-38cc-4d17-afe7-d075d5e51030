import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { AppHeader } from "@/components/app-header";
import { CROPS } from "@/lib/mock/crops";
import { MARKETS } from "@/lib/mock/markets";
import { PriceBadge } from "@/components/price-badge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/compare")({
  component: ComparePage,
  head: () => ({
    meta: [
      { title: "시장별 비교 — AGDICT" },
      { name: "description", content: "여러 도매시장의 평균가를 한눈에 비교하세요." },
    ],
  }),
});

function ComparePage() {
  const [cropId, setCropId] = useState(CROPS[0].id);
  const crop = CROPS.find((c) => c.id === cropId)!;

  // deterministic factor per market so numbers vary but stay stable
  const rows = MARKETS.map((m) => {
    const factor = 0.9 + ((m.id.charCodeAt(0) % 20) / 100);
    const price = Math.round(crop.currentPrice * factor);
    const prev = Math.round(crop.prevPrice * factor);
    return {
      market: m,
      price,
      pct: ((price - prev) / prev) * 100,
    };
  }).sort((a, b) => a.price - b.price);

  const best = rows[0];
  const worst = rows[rows.length - 1];

  return (
    <AppShell header={<AppHeader title="시장별 가격 비교" showBell={false} />}>
      <div className="px-4 pt-4 pb-8">
        <label className="block rounded-[10px] bg-surface px-3 py-2.5">
          <div className="text-[11px] font-semibold text-muted-foreground">비교 품목</div>
          <select
            className="mt-0.5 w-full bg-transparent text-[15px] font-bold outline-none"
            value={cropId}
            onChange={(e) => setCropId(e.target.value)}
          >
            {CROPS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-[10px] bg-price-down-bg px-3 py-3">
            <div className="text-[11px] font-semibold text-price-down">가장 저렴</div>
            <div className="mt-0.5 text-[13px] font-bold text-foreground">
              {best.market.name}
            </div>
            <div className="mt-1 font-data text-[16px] font-black tabular-nums text-price-down">
              {best.price.toLocaleString()}
              <span className="ml-0.5 text-[11px] font-medium text-muted-foreground">원/kg</span>
            </div>
          </div>
          <div className="rounded-[10px] bg-price-up-bg px-3 py-3">
            <div className="text-[11px] font-semibold text-price-up">가장 비쌈</div>
            <div className="mt-0.5 text-[13px] font-bold text-foreground">
              {worst.market.name}
            </div>
            <div className="mt-1 font-data text-[16px] font-black tabular-nums text-price-up">
              {worst.price.toLocaleString()}
              <span className="ml-0.5 text-[11px] font-medium text-muted-foreground">원/kg</span>
            </div>
          </div>
        </div>

        <h2 className="mt-6 mb-2 px-1 text-[13px] font-bold text-muted-foreground">
          시장별 순위
        </h2>
        <ul className="overflow-hidden rounded-[10px] bg-surface">
          {rows.map((r, i) => {
            const pctBar = ((r.price - best.price) / best.price) * 100;
            return (
              <li
                key={r.market.id}
                className={cn(
                  "px-4 py-3",
                  i > 0 && "border-t border-border",
                )}
              >
                <div className="grid grid-cols-[20px_1fr_auto_auto] items-center gap-3">
                  <span className="text-center text-[12px] font-bold text-muted-foreground tabular-nums">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-[14px] font-semibold">{r.market.name}</div>
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
                      i === 0 ? "bg-price-down" : "bg-primary/70",
                    )}
                    style={{ width: `${Math.max(6, 100 - pctBar * 4)}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 text-center">
          <Link
            to="/market/$crop"
            params={{ crop: cropId }}
            className="text-[13px] font-semibold text-primary"
          >
            {crop.name} 상세 시세 보기 →
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
