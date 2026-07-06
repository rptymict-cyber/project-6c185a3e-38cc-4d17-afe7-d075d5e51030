import { createFileRoute, Link } from "@tanstack/react-router";
import { TrendingDown, TrendingUp, Layers } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AppHeader } from "@/components/app-header";
import { CATEGORIES, CROPS } from "@/lib/mock/crops";
import { PriceBadge, priceColor } from "@/components/price-badge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/statistics")({
  component: StatsPage,
  head: () => ({
    meta: [
      { title: "통계 — AGDICT" },
      { name: "description", content: "오늘의 상승·하락 랭킹과 거래량 통계." },
    ],
  }),
});

function StatsPage() {
  const withChange = CROPS.map((c) => ({
    ...c,
    changePct: ((c.currentPrice - c.prevPrice) / c.prevPrice) * 100,
  }));
  const gainers = [...withChange].sort((a, b) => b.changePct - a.changePct).slice(0, 5);
  const losers = [...withChange].sort((a, b) => a.changePct - b.changePct).slice(0, 5);
  const volumeTop = [...withChange].sort((a, b) => b.volumeTon - a.volumeTon).slice(0, 5);
  const totalVol = withChange.reduce((s, c) => s + c.volumeTon, 0);
  const avgChange =
    withChange.reduce((s, c) => s + c.changePct, 0) / withChange.length;

  const byCategory = CATEGORIES.filter((c) => c.id !== "all").map((cat) => {
    const items = withChange.filter((c) => c.category === cat.id);
    const vol = items.reduce((s, c) => s + c.volumeTon, 0);
    const chg =
      items.length ? items.reduce((s, c) => s + c.changePct, 0) / items.length : 0;
    return { ...cat, count: items.length, vol, chg };
  });

  return (
    <AppShell header={<AppHeader title="통계" />}>
      <div className="px-4 pt-4 pb-6">
        {/* KPI row */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-[10px] bg-surface p-4">
            <div className="text-[11px] font-semibold text-muted-foreground">
              전체 평균 등락률
            </div>
            <div
              className={cn(
                "mt-1 font-data text-[22px] font-black tabular-nums",
                priceColor(avgChange),
              )}
            >
              {avgChange > 0 ? "+" : ""}
              {avgChange.toFixed(2)}%
            </div>
          </div>
          <div className="rounded-[10px] bg-surface p-4">
            <div className="text-[11px] font-semibold text-muted-foreground">
              총 거래량
            </div>
            <div className="mt-1 font-data text-[22px] font-black tabular-nums">
              {totalVol.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              <span className="ml-0.5 text-[12px] font-medium text-muted-foreground">t</span>
            </div>
          </div>
        </div>

        <Section
          icon={<TrendingUp className="h-4 w-4 text-price-up" />}
          title="상승 랭킹"
        >
          <RankList items={gainers} />
        </Section>

        <Section
          icon={<TrendingDown className="h-4 w-4 text-price-down" />}
          title="하락 랭킹"
        >
          <RankList items={losers} />
        </Section>

        <Section
          icon={<Layers className="h-4 w-4 text-primary" />}
          title="거래량 상위"
        >
          <ul className="overflow-hidden rounded-[10px] bg-surface">
            {volumeTop.map((c, i) => (
              <li
                key={c.id}
                className={cn(
                  "flex items-center gap-3 px-4 py-3",
                  i > 0 && "border-t border-border",
                )}
              >
                <span className="w-5 shrink-0 text-center text-[12px] font-bold text-muted-foreground tabular-nums">
                  {i + 1}
                </span>
                <span className="text-xl">{c.emoji}</span>
                <span className="flex-1 truncate text-[14px] font-semibold">{c.name}</span>
                <span className="font-data text-[14px] font-bold tabular-nums">
                  {c.volumeTon.toLocaleString()}
                  <span className="ml-0.5 text-[11px] font-medium text-muted-foreground">t</span>
                </span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="분류별 요약">
          <ul className="overflow-hidden rounded-[10px] bg-surface">
            {byCategory.map((c, i) => (
              <li
                key={c.id}
                className={cn(
                  "grid grid-cols-[1fr_auto_auto] items-center gap-3 px-4 py-3",
                  i > 0 && "border-t border-border",
                )}
              >
                <span className="text-[14px] font-semibold">{c.label}</span>
                <span className="tabular-nums text-[12px] text-muted-foreground">
                  {c.count}개 · {c.vol.toLocaleString(undefined, { maximumFractionDigits: 0 })}t
                </span>
                <PriceBadge changePct={c.chg} />
              </li>
            ))}
          </ul>
        </Section>

        <p className="mt-6 text-center text-[11px] text-muted-foreground">
          데이터 제공: KAMIS 농산물유통정보
        </p>
      </div>
    </AppShell>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon?: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6">
      <h2 className="mb-2 flex items-center gap-1.5 px-1 text-[13px] font-bold text-foreground">
        {icon}
        {title}
      </h2>
      {children}
    </section>
  );
}

function RankList({
  items,
}: {
  items: (typeof CROPS[number] & { changePct: number })[];
}) {
  return (
    <ul className="overflow-hidden rounded-[10px] bg-surface">
      {items.map((c, i) => (
        <li
          key={c.id}
          className={cn(
            "grid grid-cols-[20px_28px_1fr_auto_auto] items-center gap-3 px-4 py-3",
            i > 0 && "border-t border-border",
          )}
        >
          <span className="text-center text-[12px] font-bold text-muted-foreground tabular-nums">
            {i + 1}
          </span>
          <span className="text-xl">{c.emoji}</span>
          <Link
            to="/market/$crop"
            params={{ crop: c.id }}
            className="truncate text-[14px] font-semibold hover:text-primary"
          >
            {c.name}
          </Link>
          <span className="font-data text-[13px] font-bold tabular-nums">
            {c.currentPrice.toLocaleString()}
          </span>
          <PriceBadge changePct={c.changePct} />
        </li>
      ))}
    </ul>
  );
}
