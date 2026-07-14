import { useEffect, useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Sprout } from "lucide-react";
import { DetailHeader } from "@/components/detail-header";
import { AppShell } from "@/components/app-shell";
import { FullSelectCard } from "@/components/common/ConditionSelectCard";
import { RegionalStatsTab } from "@/components/statistics/RegionalStatsTab";
import { TrendTab } from "@/components/statistics/TrendTab";
import { VolumeByMarketTab } from "@/components/statistics/VolumeByMarketTab";
import { resolveCropSubject } from "@/lib/mock/crop-resolver";
import { getVarietyMarketAverages } from "@/lib/mock/variety-market-averages";
import { computeRegionStats, marketIdsIn } from "@/lib/services/region-stats";
import { useTrendCompare, MAX_COMPARE } from "@/store/trend-compare";
import { useRecentStats } from "@/store/recent-stats";
import { MARKETS } from "@/lib/mock/markets";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/statistics/$variety")({
  component: VarietyStatsPage,
  head: () => ({
    meta: [
      { title: "지역별 통계 — AGDICT" },
      { name: "description", content: "품종별 지역별 대표 시세와 가격 추이." },
    ],
  }),
});

type Tab = "region" | "trend" | "volume";
const TABS: { id: Tab; label: string }[] = [
  { id: "region", label: "지역별 통계" },
  { id: "trend", label: "가격 추이" },
  { id: "volume", label: "시장별 거래량" },
];

function VarietyStatsPage() {
  const { variety } = Route.useParams();
  const router = useRouter();
  const subject = resolveCropSubject(variety);
  const pushRecent = useRecentStats((s) => s.push);

  const [date, setDate] = useState("2025-07-05");
  const [tab, setTab] = useState<Tab>("region");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  useEffect(() => {
    pushRecent(variety);
  }, [variety, pushRecent]);

  const data = getVarietyMarketAverages({ varietyId: variety, date });
  const regions = computeRegionStats(data);

  // Validate selected region against latest results.
  useEffect(() => {
    if (selectedRegion && !regions.find((r) => r.region === selectedRegion)) {
      // keep name for "데이터 없음" state; only clear if not in ALL data at all
      if (!MARKETS.some((m) => m.region === selectedRegion)) {
        setSelectedRegion(null);
      }
    }
  }, [selectedRegion, regions]);

  void subject;

  const handleOpenTrend = (region: string) => {
    setSelectedRegion(region);
    const marketIds = marketIdsIn(region);
    // 지역 대표 시리즈 + 시장 시리즈 (최대 MAX_COMPARE).
    const next = [`region:${region}`, ...marketIds].slice(0, MAX_COMPARE);
    useTrendCompare.setState({ compareIds: next });
    setTab("trend");
  };

  return (
    <AppShell
      header={<DetailHeader title="통계" onBack={() => router.history.back()} right={null} />}
    >
      <div className="px-4 pt-4">
        <FullSelectCard
          icon={<Sprout className="h-3.5 w-3.5" />}
          label="작물"
          value={`${data.breadcrumb.categoryLabel} · ${data.breadcrumb.itemLabel} · ${data.breadcrumb.varietyLabel}`}
          to="/crop-select"
          search={{ from: "statistics-detail", return: `/statistics/${variety}` }}
        />
        <p className="mt-2 text-[11.5px] text-[#868E96]">kg당 평균가 · 경매일 기준</p>
      </div>

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

      {tab === "region" && (
        <RegionalStatsTab
          varietyId={variety}
          date={date}
          onDateChange={setDate}
          selectedRegion={selectedRegion}
          onSelectRegion={setSelectedRegion}
          onOpenTrend={handleOpenTrend}
        />
      )}
      {tab === "trend" && <TrendTab varietyId={variety} />}
      {tab === "volume" && <VolumeByMarketTab varietyId={variety} date={date} />}
    </AppShell>
  );
}
