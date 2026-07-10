import { useMemo, useState } from "react";
import {
  createFileRoute,
  Link,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { Calendar as CalendarIcon, ChevronDown, ChevronRight, Sprout } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AppHeader } from "@/components/app-header";
import { DatePickerSheet, defaultTradingDayFilter } from "@/components/date-picker-sheet";
import { useCropSelection } from "@/store/cropSelection";
import { getCategoryById, getItemById } from "@/lib/catalog-service";
import { getVarietyMarketAverages } from "@/lib/mock/variety-market-averages";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/market-compare")({
  component: MarketComparePage,
  head: () => ({
    meta: [
      { title: "시장별 가격 비교 — AGDICT" },
      {
        name: "description",
        content: "선택한 작물의 시장별 kg당 평균가를 한눈에 비교하세요.",
      },
    ],
  }),
});

function MarketComparePage() {
  const router = useRouter();
  const navigate = useNavigate();
  const committed = useCropSelection((s) => s.committed);

  const category = committed.categoryId ? getCategoryById(committed.categoryId) : undefined;
  const item = committed.itemId ? getItemById(committed.itemId) : undefined;
  const varietyName = !item
    ? undefined
    : !committed.varietyId || committed.varietyId === "ALL"
      ? "전체 품종"
      : item.varieties.find((v) => v.id === committed.varietyId)?.name;

  const cropLabel = item && varietyName ? `${item.name} · ${varietyName}` : undefined;
  const cropSubLabel = category?.name;

  const varietyId =
    item && (!committed.varietyId || committed.varietyId === "ALL")
      ? item.id
      : (committed.varietyId as string | undefined);

  const [date, setDate] = useState("2025-07-05");
  const [dateOpen, setDateOpen] = useState(false);

  const data = useMemo(
    () => (varietyId ? getVarietyMarketAverages({ varietyId, date }) : null),
    [varietyId, date],
  );

  const ranked = useMemo(() => {
    if (!data) return [];
    return data.regions
      .flatMap((r) => r.markets)
      .slice()
      .sort((a, b) => b.avgKg - a.avgKg);
  }, [data]);

  const maxPrice = ranked[0]?.avgKg ?? 0;
  const top = ranked[0];
  const bottom = ranked[ranked.length - 1];

  return (
    <AppShell
      header={<AppHeader title="시장별 가격 비교" showBell={false} />}
    >
      <div className="px-4 pb-24 pt-4">
        {/* Big crop selector */}
        <Link
          to="/crop-select"
          search={{ from: "market-compare", return: "/market-compare" }}
          className="flex w-full items-center gap-3 rounded-[14px] border border-[#E9ECEF] bg-white px-4 py-4 text-left active:bg-[#F8F9FA]"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#F1F3F5] text-[#3A8A3A]">
            <Sprout className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] font-semibold text-[#868E96]">비교 품목</span>
            <span
              className={cn(
                "block truncate text-[22px] font-black leading-tight",
                cropLabel ? "text-foreground" : "text-[#ADB5BD]",
              )}
            >
              {cropLabel ?? "작물 선택"}
            </span>
            {cropSubLabel && (
              <span className="mt-0.5 block truncate text-[11.5px] text-[#868E96]">
                {cropSubLabel}
              </span>
            )}
          </span>
          <ChevronRight className="h-4 w-4 shrink-0 text-[#ADB5BD]" />
        </Link>

        {/* Date + basis */}
        <div className="mt-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setDateOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#F1F3F5] px-3 py-1.5 text-[12px] font-semibold text-[#495057]"
          >
            <CalendarIcon className="h-3.5 w-3.5" />
            <span>{date.replaceAll("-", ".")}</span>
            <ChevronDown className="h-3.5 w-3.5 text-[#6C757D]" />
          </button>
          <span className="text-[11.5px] text-[#868E96]">
            kg당 평균가 · 경매일 기준 · 전체 시장
          </span>
        </div>

        {!data && (
          <div className="mt-8 rounded-[12px] border border-dashed border-[#E9ECEF] bg-white px-4 py-12 text-center">
            <p className="text-[13px] font-bold text-foreground">비교할 작물을 선택하세요</p>
            <p className="mt-1 text-[11.5px] text-[#868E96]">
              위 카드를 눌러 부류·품목·품종을 선택하면 시장별 가격을 비교할 수 있어요.
            </p>
          </div>
        )}

        {data && top && bottom && (
          <>
            {/* Highlight cards */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <HighlightCard
                tone="up"
                label="가장 비쌈"
                marketName={top.name}
                region={top.region}
                price={top.avgKg}
                deltaPct={top.deltaPct}
              />
              <HighlightCard
                tone="down"
                label="가장 저렴"
                marketName={bottom.name}
                region={bottom.region}
                price={bottom.avgKg}
                deltaPct={bottom.deltaPct}
              />
            </div>

            {/* Ranking list */}
            <section className="mt-5 rounded-[14px] border border-[#E9ECEF] bg-white">
              <header className="flex items-center justify-between border-b border-[#F1F3F5] px-4 py-3">
                <h3 className="text-[14px] font-black text-foreground">
                  시장별 순위 <span className="text-[12px] font-semibold text-[#868E96]">(높은 가격순)</span>
                </h3>
                <span className="text-[11px] text-[#868E96]">{ranked.length}곳</span>
              </header>
              <ul>
                {ranked.map((m, i) => {
                  const isTop = i === 0;
                  const barPct = maxPrice > 0 ? Math.max(6, (m.avgKg / maxPrice) * 100) : 0;
                  const tone: "up" | "down" | "flat" =
                    m.deltaAmount > 0 ? "up" : m.deltaAmount < 0 ? "down" : "flat";
                  const deltaColor =
                    tone === "up"
                      ? "text-[#E03131]"
                      : tone === "down"
                        ? "text-[#1971C2]"
                        : "text-[#868E96]";
                  return (
                    <li
                      key={m.id}
                      className={cn(
                        "px-3 py-3",
                        i > 0 && "border-t border-[#F1F3F5]",
                        isTop && "rounded-t-[14px] border-2 border-[#E03131] bg-[#FFF5F5]",
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={cn(
                            "grid h-7 w-7 shrink-0 place-items-center rounded-full text-[12px] font-black tabular-nums",
                            isTop ? "bg-[#E03131] text-white" : "bg-[#F1F3F5] text-[#495057]",
                          )}
                        >
                          {i + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="truncate text-[13.5px] font-bold text-foreground">
                              {m.name}
                            </span>
                            {isTop && (
                              <span className="shrink-0 rounded bg-[#E03131] px-1.5 py-0.5 text-[10px] font-black text-white">
                                최고가
                              </span>
                            )}
                          </div>
                          <div className="mt-0.5 text-[11px] text-[#868E96]">{m.region}</div>
                        </div>
                        <div className="shrink-0 text-right">
                          <div className="text-[14px] font-black tabular-nums text-foreground">
                            {m.avgKg.toLocaleString()}
                            <span className="ml-0.5 text-[10.5px] font-semibold text-[#868E96]">
                              원/kg
                            </span>
                          </div>
                          <div className={cn("mt-0.5 text-[11px] font-bold tabular-nums", deltaColor)}>
                            {tone === "up" ? "▲" : tone === "down" ? "▼" : "-"}{" "}
                            {Math.abs(m.deltaPct).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      {/* Bar */}
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#F1F3F5]">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            isTop ? "bg-[#E03131]" : "bg-[#3A8A3A]",
                          )}
                          style={{ width: `${barPct}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* CTA */}
            {varietyId && (
              <button
                type="button"
                onClick={() => navigate({ to: "/statistics/$variety", params: { variety: varietyId } })}
                className="mt-4 flex w-full items-center justify-center gap-1 rounded-[12px] border border-[#3A8A3A] bg-white py-3 text-[13.5px] font-black text-[#3A8A3A] active:bg-[#F0F9F0]"
              >
                상세 시세 보기
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </>
        )}
      </div>

      <DatePickerSheet
        open={dateOpen}
        onOpenChange={setDateOpen}
        selected={date}
        onConfirm={(iso) => setDate(iso)}
        hasDataFor={defaultTradingDayFilter}
      />
    </AppShell>
  );
}

function HighlightCard({
  tone,
  label,
  marketName,
  region,
  price,
  deltaPct,
}: {
  tone: "up" | "down";
  label: string;
  marketName: string;
  region: string;
  price: number;
  deltaPct: number;
}) {
  const isUp = tone === "up";
  const border = isUp ? "border-[#FFC9C9]" : "border-[#C5DAFB]";
  const bg = isUp ? "bg-[#FFF5F5]" : "bg-[#F0F6FF]";
  const labelColor = isUp ? "text-[#E03131]" : "text-[#1971C2]";
  return (
    <div className={cn("rounded-[12px] border px-3 py-3", border, bg)}>
      <div className={cn("text-[11px] font-black", labelColor)}>{label}</div>
      <div className="mt-1 truncate text-[13.5px] font-bold text-foreground">{marketName}</div>
      <div className="text-[10.5px] text-[#868E96]">{region}</div>
      <div className="mt-2 text-[17px] font-black tabular-nums text-foreground">
        {price.toLocaleString()}
        <span className="ml-0.5 text-[10.5px] font-semibold text-[#868E96]">원/kg</span>
      </div>
      <div className={cn("mt-0.5 text-[11px] font-bold tabular-nums", labelColor)}>
        전일 대비 {deltaPct > 0 ? "+" : ""}
        {deltaPct.toFixed(1)}%
      </div>
    </div>
  );
}
