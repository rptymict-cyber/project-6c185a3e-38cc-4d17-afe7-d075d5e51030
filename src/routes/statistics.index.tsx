import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AppHeader } from "@/components/app-header";
import { useStatistics, type PeriodMode } from "@/store/statistics";
import {
  CROPS,
  buildSeries,
  buildGauges,
  getOriginShare,
  getMarketShare,
  getGradeAvg,
  type CropId,
} from "@/lib/mock/statistics-mock";
import { StatsMarketSheet } from "@/components/statistics/StatsMarketSheet";
import { StatsTrendChart } from "@/components/statistics/StatsTrendChart";
import { StatsDonut } from "@/components/statistics/StatsDonut";
import { StatsGauge } from "@/components/statistics/StatsGauge";
import { StatsGradeBars } from "@/components/statistics/StatsGradeBars";
import { FullSelectCard } from "@/components/common/ConditionSelectCard";
import { useCropSelection } from "@/store/cropSelection";
import {
  getCategoryById,
  getItemById,
  getVarietyById,
} from "@/lib/catalog-service";
import { cn } from "@/lib/utils";

// 카탈로그 품목명 → 통계 mock CropId 매핑.
const ITEM_NAME_TO_CROP_ID: Record<string, CropId> = {
  "사과": "apple", "배": "pear", "포도": "grape", "감귤": "citrus",
  "배추": "cabbage", "상추": "lettuce", "얼갈이배추": "napa",
  "마늘": "garlic", "양파": "onion", "청양고추": "chili", "고추": "chili",
  "무": "radish", "당근": "carrot",
  "감자": "potato", "고구마": "sweetpotato",
  "표고버섯": "shiitake", "팽이버섯": "enoki",
  "쌀": "rice", "보리": "barley", "콩": "soybean", "팥": "redbean",
};

export const Route = createFileRoute("/statistics/")({
  component: StatisticsPage,
  head: () => ({
    meta: [
      { title: "농산물 통계 — AGDICT" },
      {
        name: "description",
        content:
          "작물별 가격·거래량 추이, 주산지·시장 분포, 등급별 평균가를 확인하세요.",
      },
    ],
  }),
});

const PERIOD_TABS: { id: PeriodMode; label: string }[] = [
  { id: "day", label: "일별" },
  { id: "month", label: "월별" },
  { id: "year", label: "연도별" },
];

function StatisticsPage() {
  const { crop, markets, period, setCrop, setMarkets, setPeriod } =
    useStatistics();
  const [marketOpen, setMarketOpen] = useState(false);

  // 공용 작물 선택 스토어(committed)를 SSOT로 사용.
  const committed = useCropSelection((s) => s.committed);
  const setDraftCategory = useCropSelection((s) => s.setDraftCategory);
  const setDraftItem = useCropSelection((s) => s.setDraftItem);
  const setDraftVariety = useCropSelection((s) => s.setDraftVariety);
  const commitDraft = useCropSelection((s) => s.commitDraft);

  // 최초 진입 시 committed가 비어 있으면 기본 작물(배추)로 seed.
  useEffect(() => {
    if (!committed.itemId) {
      setDraftCategory("06");
      setDraftItem("0602"); // 배추
      setDraftVariety("ALL");
      commitDraft();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // committed 변경 시 통계 crop 동기화.
  useEffect(() => {
    if (!committed.itemId) return;
    const item = getItemById(committed.itemId);
    if (!item) return;
    const mapped = ITEM_NAME_TO_CROP_ID[item.name];
    if (mapped && mapped !== crop) setCrop(mapped);
  }, [committed.itemId, crop, setCrop]);

  const series = useMemo(
    () => buildSeries(crop, markets, period),
    [crop, markets, period],
  );
  const gauges = useMemo(() => buildGauges(crop), [crop]);
  const origin = useMemo(() => getOriginShare(crop), [crop]);
  const marketShare = useMemo(() => getMarketShare(crop), [crop]);
  const grades = useMemo(() => getGradeAvg(crop), [crop]);

  const cropDef = CROPS[crop];
  const marketLabel =
    markets.length === 1
      ? markets[0]
      : `${markets[0]} 외 ${markets.length - 1}`;

  // 작물 카드 라벨
  const cropCardLabel = useMemo(() => {
    if (!committed.itemId) return undefined;
    const cat = committed.categoryId
      ? getCategoryById(committed.categoryId)
      : undefined;
    const item = getItemById(committed.itemId);
    const varietyName =
      committed.varietyId && committed.varietyId !== "ALL" && committed.itemId
        ? getVarietyById(committed.itemId, committed.varietyId)?.name
        : "전체 품종";
    const parts = [cat?.name, item?.name, varietyName].filter(Boolean);
    return parts.join(" · ");
  }, [committed]);

  // 헤드라인 평균가 (첫 시장 기준)
  const headlinePrice = useMemo(() => {
    if (!series.length) return 0;
    const first = markets[0];
    const sum = series.reduce(
      (s, p) => s + (typeof p[first] === "number" ? (p[first] as number) : 0),
      0,
    );
    return Math.round(sum / series.length);
  }, [series, markets]);

  const varietyName =
    committed.varietyId && committed.varietyId !== "ALL" && committed.itemId
      ? getVarietyById(committed.itemId, committed.varietyId)?.name
      : "";

  return (
    <AppShell header={<AppHeader title="통계" />}>
      {/* Filter bar */}
      <div className="sticky top-[52px] z-20 space-y-2.5 border-b border-[#E9ECEF] bg-white px-4 pb-3 pt-3">
        <div className="grid grid-cols-2 gap-2">
          <FullSelectCard
            icon={<span className="text-[16px] leading-none">{cropDef.emoji}</span>}
            label="작물"
            value={cropCardLabel}
            placeholder="작물 선택"
            to="/crop-select"
            search={{ from: "statistics", return: "/statistics" }}
          />
          <button
            type="button"
            onClick={() => setMarketOpen(true)}
            className="flex w-full items-center gap-3 rounded-[12px] border border-[#E9ECEF] bg-white px-3 py-3 text-left active:bg-[#F8F9FA]"
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#F1F3F5] text-[14px]">
              🏬
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-medium text-[#868E96]">
                도매시장
              </span>
              <span className="block truncate text-[14px] font-bold text-foreground">
                {marketLabel}
              </span>
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 text-[#ADB5BD]" />
          </button>
        </div>

        {/* Period segment */}
        <div className="flex items-center gap-1 rounded-full bg-[#F1F3F5] p-1">
          {PERIOD_TABS.map((t) => {
            const active = period === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setPeriod(t.id)}
                className={cn(
                  "flex-1 rounded-full py-1.5 text-[12.5px] font-semibold transition-colors",
                  active
                    ? "bg-white text-[#1F5C1F] shadow-sm"
                    : "text-[#6C757D]",
                )}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Body */}
      <div className="px-4 pb-16 pt-4">
        {/* 3-1 요약 헤드라인 */}
        <section className="rounded-[12px] border border-[#E9ECEF] bg-white p-3">
          <div className="text-[11.5px] font-medium text-[#868E96]">
            2026년 7월 중순 기준
          </div>
          <div className="mt-1 text-[14px] font-bold leading-snug text-foreground">
            {cropDef.name}
            {varietyName ? ` ${varietyName}` : ""} 평균 가격은{" "}
            <span className="text-[16px] font-black text-[#3A8A3A] tabular-nums">
              {headlinePrice.toLocaleString()}
            </span>
            원 (kg당)
          </div>
        </section>

        {/* 3-2 등락 비교 3칸 카드 */}
        <section className="mt-3 grid grid-cols-3 gap-2">
          <StatsGauge label="전순 대비" data={gauges.prevXun} />
          <StatsGauge label="전년 동순 대비" data={gauges.prevYear} />
          <StatsGauge label="평년 동순 대비" data={gauges.normalYear} />
        </section>

        {/* 3-3 콤보 차트 */}
        <section className="mt-4 rounded-[12px] border border-[#E9ECEF] bg-white p-3">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-[13px] font-bold text-foreground">
              가격 · 거래량 추이
            </h4>
            <span className="text-[10.5px] text-[#868E96]">원/kg · 거래량 t</span>
          </div>
          <StatsTrendChart points={series} marketIds={markets} />
        </section>

        {/* 3-4 주산지 도넛 */}
        <div className="mt-4">
          <StatsDonut title="주산지 비율 (광역)" data={origin} />
        </div>

        {/* 3-5 도매시장 도넛 */}
        <div className="mt-3">
          <StatsDonut title="도매시장별 거래 비율" data={marketShare} />
        </div>

        {/* 3-6 등급별 평균가 */}
        <div className="mt-3">
          <StatsGradeBars rows={grades} />
        </div>
      </div>

      <StatsMarketSheet
        open={marketOpen}
        onOpenChange={setMarketOpen}
        selected={markets}
        onConfirm={setMarkets}
      />
    </AppShell>
  );
}
