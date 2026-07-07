import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Bell, ChevronDown, ChevronRight, Star } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { AlertSettingsSheet } from "@/components/detail/AlertSettingsSheet";
import { DateSheetLite } from "@/components/date-sheet-lite";
import { MarketAveragesTable } from "@/components/statistics/MarketAveragesTable";
import { TrendTab } from "@/components/statistics/TrendTab";
import { VarietyPickerSheet } from "@/components/statistics/VarietyPickerSheet";
import { getCrop } from "@/lib/mock/crops";
import { getVarietyMarketAverages } from "@/lib/mock/variety-market-averages";
import { useAlerts } from "@/store/alerts";
import { useMarketFilter } from "@/store/market";
import { useRecentStats } from "@/store/recent-stats";
import { useWatchlist } from "@/store/watchlist";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/statistics/$variety")({
  component: VarietyStatsPage,
  head: () => ({
    meta: [
      { title: "품종 통계 — AGDICT" },
      { name: "description", content: "품종별 시장 평균가와 도매법인 세부 비교." },
    ],
  }),
});

type Tab = "market" | "trend";
const TABS: { id: Tab; label: string }[] = [
  { id: "market", label: "시장별 평균가격" },
  { id: "trend", label: "시장가격 그래프" },
];

function formatKoreanDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
  const wd = ["일", "월", "화", "수", "목", "금", "토"][dt.getDay()];
  return `${y}년 ${m}월 ${d}일 (${wd})`;
}

function VarietyStatsPage() {
  const { variety } = Route.useParams();
  const router = useRouter();
  const navigate = useNavigate();
  const crop = getCrop(variety);
  const pushRecent = useRecentStats((s) => s.push);

  // Statistics tab manages its own date state — do NOT share with market tab.
  const [date, setDate] = useState("2025-07-05");
  const [dateOpen, setDateOpen] = useState(false);

  const [tab, setTab] = useState<Tab>("market");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  useEffect(() => {
    if (crop) pushRecent(variety);
  }, [crop, variety, pushRecent]);

  const data = useMemo(
    () => (crop ? getVarietyMarketAverages({ varietyId: variety, date }) : null),
    [crop, variety, date],
  );

  const starred = useWatchlist((s) => s.crops.includes(variety));
  const toggleCrop = useWatchlist((s) => s.toggleCrop);
  const hasAlert = useAlerts((s) =>
    s.hasAnyFor(variety, data?.regions[0]?.markets[0]?.id ?? "all"),
  );

  const setSimpleMode = useMarketFilter((s) => s.setSimpleMode);
  const setMarket = useMarketFilter((s) => s.setMarket);
  const setMarketDate = useMarketFilter((s) => s.setDate);

  const openInSimpleMode = (marketId: string) => {
    if (!data) return;
    const market = data.regions
      .flatMap((r) => r.markets)
      .find((m) => m.id === marketId);
    setSimpleMode(true);
    setMarket(marketId, market?.name ?? "");
    setMarketDate(data.effectiveDate, `${data.effectiveDateLabel} · 최근 거래일`);
    navigate({ to: "/market" });
  };

  if (!crop || !data) {
    return (
      <AppShell
        header={
          <MinimalHeader label="품종 통계" onBack={() => router.history.back()} />
        }
      >
        <div className="px-4 py-10 text-center text-[13px] text-[#6C757D]">
          품종을 찾을 수 없어요
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      header={
        <header className="sticky top-0 z-30 flex h-[52px] items-center justify-between border-b border-[#E9ECEF] bg-background px-2">
          <button
            aria-label="뒤로"
            onClick={() => router.history.back()}
            className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="pointer-events-none absolute inset-x-0 top-0 flex h-[52px] items-center justify-center">
            <span className="text-[15px] font-black tracking-tight text-foreground">
              {crop.emoji} {crop.name}
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            <button
              aria-label="즐겨찾기"
              onClick={() => {
                const added = toggleCrop(variety);
                toast(added ? "즐겨찾기에 추가했어요" : "즐겨찾기에서 삭제했어요");
              }}
              className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary"
            >
              <Star
                className={cn(
                  "h-5 w-5",
                  starred ? "fill-[#F59F00] text-[#F59F00]" : "text-[#868E96]",
                )}
              />
            </button>
            <button
              aria-label="알림 설정"
              onClick={() => setAlertOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary"
            >
              <Bell className={cn("h-5 w-5", hasAlert ? "text-[#3A8A3A]" : "text-[#868E96]")} />
            </button>
          </div>
        </header>
      }
    >
      {/* Breadcrumb chip */}
      <div className="px-4 pt-4">
        <button
          onClick={() => setPickerOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#F1F3F5] px-3 py-1.5 text-[12px] font-semibold text-[#495057]"
        >
          <span>{data.breadcrumb.categoryLabel}</span>
          <ChevronRight className="h-3 w-3 text-[#ADB5BD]" />
          <span>{data.breadcrumb.itemLabel}</span>
          <ChevronRight className="h-3 w-3 text-[#ADB5BD]" />
          <span className="text-foreground">{data.breadcrumb.varietyLabel}</span>
          <ChevronDown className="ml-0.5 h-3.5 w-3.5 text-[#6C757D]" />
        </button>
      </div>

      {/* Tabs */}
      <div className="mt-4 border-b border-[#E9ECEF]">
        <div className="flex px-2">
          {TABS.map((t) => {
            const active = t.id === tab;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "relative shrink-0 px-3 py-3 text-[13.5px] font-semibold",
                  active ? "text-foreground" : "text-[#868E96]",
                )}
              >
                {t.label}
                {active && (
                  <span className="absolute inset-x-2 -bottom-px h-[2px] rounded-full bg-[#3A8A3A]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {tab === "market" && (
        <div className="pb-6">
          {/* Date button */}
          <div className="px-4 pt-4">
            <button
              onClick={() => setDateOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#E9ECEF] bg-white px-3 py-1.5 text-[13px] font-semibold text-foreground"
            >
              {formatKoreanDate(date)}
              <ChevronDown className="h-3.5 w-3.5 text-[#6C757D]" />
            </button>

            {data.differentFromRequest && (
              <div className="mt-2 rounded-[8px] bg-[#F0F9F0] px-3 py-2 text-[11.5px] font-semibold text-[#1F5C1F]">
                {data.requestedDateLabel} 휴장으로 직전 거래일({data.effectiveDateLabel}) 표시
              </div>
            )}
          </div>

          {/* Summary cards */}
          <div className="mt-3 grid grid-cols-4 gap-2 px-4">
            <SummaryCard label="전체 평균" value={`${data.overall.avgKg.toLocaleString()}원`} sub="kg당" />
            <SummaryCard
              label="전일 대비"
              value={fmtSigned(data.overall.deltaAmount) + "원"}
              tone={toneOf(data.overall.deltaAmount)}
            />
            <SummaryCard
              label="등락률"
              value={`${data.overall.deltaAmount > 0 ? "▲" : data.overall.deltaAmount < 0 ? "▼" : ""} ${Math.abs(data.overall.deltaPct).toFixed(1)}%`}
              tone={toneOf(data.overall.deltaAmount)}
            />
            <SummaryCard label="거래량" value={`${data.overall.volumeTon.toFixed(1)}t`} />
          </div>
          <p className="mt-2 px-4 text-[11px] text-[#868E96]">* kg당 평균가 기준</p>

          <MarketAveragesTable data={data} onOpenMarket={openInSimpleMode} />

          <p className="mt-3 px-4 text-[11px] text-[#868E96]">
            시장 행의 › 아이콘을 누르면 해당 시장의 경매 내역(간편 모드)으로 이동합니다.
          </p>
        </div>
      )}

      {tab === "trend" && <TrendTab varietyId={variety} />}

      <VarietyPickerSheet
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        currentCropId={variety}
        onSelect={(cropId) => {
          if (cropId !== variety) {
            navigate({ to: "/statistics/$variety", params: { variety: cropId } });
          }
        }}
      />

      <DateSheetLite
        open={dateOpen}
        onOpenChange={setDateOpen}
        selected={date}
        onSelect={(iso, label) => {
          setDate(iso);
          setDateLabel(label);
        }}
      />

      <AlertSettingsSheet
        open={alertOpen}
        onOpenChange={setAlertOpen}
        varietyId={variety}
        marketId={data.regions[0]?.markets[0]?.id ?? "all"}
        varietyLabel={crop.name}
        marketLabel={data.regions[0]?.markets[0]?.name ?? "전체"}
        targetPrice={Math.round(data.overall.avgKg * 1.1)}
      />
    </AppShell>
  );
}

function MinimalHeader({ label, onBack }: { label: string; onBack: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-[52px] items-center border-b border-[#E9ECEF] bg-background px-2">
      <button
        aria-label="뒤로"
        onClick={onBack}
        className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      <span className="ml-1 text-[15px] font-black tracking-tight text-foreground">
        {label}
      </span>
    </header>
  );
}
