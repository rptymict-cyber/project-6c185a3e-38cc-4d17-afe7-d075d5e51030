import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { AppHeader } from "@/components/app-header";
import { PredictionChart } from "@/features/prediction/components/PredictionChart";
import { PredictionCompareCards } from "@/features/prediction/components/PredictionCompareCards";
import { PredictionConditionGrid } from "@/features/prediction/components/PredictionConditionGrid";
import { PredictionCropSheet } from "@/features/prediction/components/PredictionCropSheet";
import { PredictionFactorList } from "@/features/prediction/components/PredictionFactorList";
import { PredictionInsightCard } from "@/features/prediction/components/PredictionInsightCard";
import { PredictionGradeSegment } from "@/features/prediction/components/PredictionGradeSegment";
import { PredictionScenarioCards } from "@/features/prediction/components/PredictionScenarioCards";
import { PredictionRangeDetailSheet } from "@/features/prediction/components/PredictionRangeDetailSheet";

import { MarketPickerSheet } from "@/features/prediction/components/MarketPickerSheet";
import { QuantityPickerSheet } from "@/features/prediction/components/QuantityPickerSheet";
import { QUANTITY_UNIT_LABEL } from "@/features/prediction/quantityUnits";
import { ViewpointPickerSheet } from "@/features/prediction/components/ViewpointPickerSheet";
import { usePrediction } from "@/features/prediction/usePrediction";
import { usePredictionView } from "@/features/prediction/usePredictionView";
import {
  isPredictableCropId,
  getPredictableCrop,
} from "@/features/prediction/mockPredictionData";
import type { PredictionRangeDays } from "@/features/prediction/types";
import { MARKETS } from "@/lib/mock/markets";
import { MOCK_WEATHER } from "@/lib/mock/weather";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PredictionSearch {
  cropId?: string;
  crop?: string;
  entrySource?: string;
}

export const Route = createFileRoute("/prediction")({
  component: PredictionPage,
  validateSearch: (raw: Record<string, unknown>): PredictionSearch => ({
    cropId: typeof raw.cropId === "string" ? raw.cropId : undefined,
    crop: typeof raw.crop === "string" ? raw.crop : undefined,
    entrySource:
      typeof raw.entrySource === "string" ? raw.entrySource : undefined,
  }),
  head: () => ({
    meta: [
      { title: "AI 가격 예측 — AGDICT" },
      {
        name: "description",
        content:
          "AI 가격 예측: 사과·배추·무·양파·마늘의 예상 가격과 유리한 출하·매입 시점을 확인하세요.",
      },
    ],
  }),
});

const RANGE_OPTIONS: PredictionRangeDays[] = [7, 10, 14, 30];

function parseBaseUnitKg(unit: string): number {
  const m = unit.match(/(\d+)\s*kg/i);
  return m ? Number(m[1]) : 10;
}

function PredictionPage() {
  const navigate = useNavigate();

  const search = Route.useSearch();

  const selectedCropId = usePredictionView((s) => s.selectedCropId);
  const selectedViewpoint = usePredictionView((s) => s.selectedViewpoint);
  const selectedRangeDays = usePredictionView((s) => s.selectedRangeDays);
  const selectedGrade = usePredictionView((s) => s.selectedGrade);
  const quantityBoxes = usePredictionView((s) => s.quantityBoxes);
  const quantityUnit = usePredictionView((s) => s.quantityUnit);
  const marketId = usePredictionView((s) => s.marketId);
  const setSelectedCropId = usePredictionView((s) => s.setSelectedCropId);
  const setSelectedViewpoint = usePredictionView((s) => s.setSelectedViewpoint);
  const setSelectedRangeDays = usePredictionView((s) => s.setSelectedRangeDays);
  const setSelectedGrade = usePredictionView((s) => s.setSelectedGrade);
  const setQuantity = usePredictionView((s) => s.setQuantity);
  const setMarketId = usePredictionView((s) => s.setMarketId);

  useEffect(() => {
    const incoming = search.cropId ?? search.crop;
    if (incoming && isPredictableCropId(incoming) && incoming !== selectedCropId) {
      setSelectedCropId(incoming);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.cropId, search.crop]);

  const [cropSheetOpen, setCropSheetOpen] = useState(false);
  const [qtySheetOpen, setQtySheetOpen] = useState(false);
  const [marketSheetOpen, setMarketSheetOpen] = useState(false);
  const [viewpointSheetOpen, setViewpointSheetOpen] = useState(false);
  const [rangeDetailOpen, setRangeDetailOpen] = useState(false);

  const prediction = usePrediction(
    selectedCropId,
    selectedRangeDays,
    selectedGrade,
  );
  const cropMeta = getPredictableCrop(selectedCropId);
  const marketName =
    MARKETS.find((m) => m.id === marketId)?.name ??
    cropMeta?.marketName ??
    "서울가락";

  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  useEffect(() => {
    setSelectedDayIndex(null);
  }, [selectedRangeDays, selectedCropId, selectedGrade]);

  if (!prediction || !cropMeta) {
    return (
      <AppShell header={<AppHeader title="AI 시세 예측" />}>
        <div className="grid min-h-[60vh] place-items-center px-6 text-center text-[13px] text-[#6C757D]">
          예측 정보를 불러올 수 없어요.
        </div>
      </AppShell>
    );
  }

  const isFarmer = selectedViewpoint === "farmer";
  const insight = isFarmer
    ? prediction.farmerInsight
    : prediction.wholesalerInsight;

  const baseUnitKg = parseBaseUnitKg(prediction.unit);
  const baseUnitLabel = `${baseUnitKg}kg`;

  const recommendedIdx = prediction.predictedPoints.findIndex(
    (p) => p.isRecommendedDate,
  );
  const lastForecastIdx = (() => {
    for (let i = prediction.predictedPoints.length - 1; i >= 0; i--) {
      const p = prediction.predictedPoints[i];
      if (p.predictedPrice !== undefined && !p.isToday) return i;
    }
    return -1;
  })();
  const defaultIdx = recommendedIdx >= 0 ? recommendedIdx : lastForecastIdx;
  const effectiveIdx =
    selectedDayIndex != null &&
    prediction.predictedPoints[selectedDayIndex]?.predictedPrice !== undefined
      ? selectedDayIndex
      : defaultIdx;
  const selectedPoint = prediction.predictedPoints[effectiveIdx];
  const selectedDate = selectedPoint?.label ?? insight.recommendationDate;
  const selectedPrice = selectedPoint?.predictedPrice ?? insight.expectedPrice;

  const priceDiff = selectedPrice - prediction.currentPrice;
  const isPositiveForUser = isFarmer ? priceDiff > 0 : priceDiff < 0;

  return (
    <AppShell header={<AppHeader title="AI 시세 예측" />}>
      <div className="px-4 pb-16 pt-3">
        {/* 1. 상단 조건 선택 그리드 */}
        <PredictionConditionGrid
          quantityHeading={isFarmer ? "출하량" : "매입량"}
          quantityLabel={`${quantityBoxes.toLocaleString()}${QUANTITY_UNIT_LABEL[quantityUnit]}`}
          cropLabel={`${cropMeta.categoryName} · ${cropMeta.name} · ${cropMeta.varietyName}`}
          marketLabel={marketName}
          viewpointLabel={isFarmer ? "농민" : "도매상"}
          onQuantityClick={() => setQtySheetOpen(true)}
          onCropClick={() => setCropSheetOpen(true)}
          onMarketClick={() => setMarketSheetOpen(true)}
          onViewpointClick={() => setViewpointSheetOpen(true)}
        />

        {/* 2. 등급 세그먼트 (신규) */}
        <div className="mt-3">
          <PredictionGradeSegment
            value={selectedGrade}
            onChange={setSelectedGrade}
          />
        </div>

        {/* 3. AI 추천 카드 */}
        <div className="mt-3">
          <PredictionInsightCard
            viewpoint={selectedViewpoint}
            recommendationDate={selectedDate}
            expectedPrice={selectedPrice}
            currentPrice={prediction.currentPrice}
            baseUnitLabel={baseUnitLabel}
            quantityBoxes={quantityBoxes}
            quantityUnitLabel={QUANTITY_UNIT_LABEL[quantityUnit]}
            isPositiveForUser={isPositiveForUser}
            cropName={prediction.cropName}
            onDetailClick={() =>
              navigate({
                to: "/price/$variety",
                params: { variety: prediction.cropId },
              })
            }
          />
        </div>

        {/* 4. 가격 예측 차트 */}
        <section className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-[13px] font-bold text-foreground">
              가격 예측 차트
            </h2>
            <span className="text-[11px] text-[#868E96]">
              최근 업데이트 {prediction.updatedAt}
            </span>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-[#F1F3F5] p-1">
            {RANGE_OPTIONS.map((d) => {
              const active = selectedRangeDays === d;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setSelectedRangeDays(d)}
                  className={cn(
                    "flex-1 rounded-full py-1.5 text-[12px] font-semibold transition-colors",
                    active
                      ? "bg-white text-[#1F5C1F] shadow-sm"
                      : "text-[#6C757D]",
                  )}
                >
                  {d}일
                </button>
              );
            })}
          </div>

          <div className="mt-3 rounded-2xl border border-[#E9ECEF] bg-white p-3">
            <PredictionChart
              points={prediction.predictedPoints}
              selectedIndex={effectiveIdx}
              onSelectIndex={setSelectedDayIndex}
              viewpoint={selectedViewpoint}
              currentPrice={prediction.currentPrice}
              quantityBoxes={quantityBoxes}
              baseUnitLabel={baseUnitLabel}
            />
          </div>

          {/* 범례 */}
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 px-1 text-[11px] text-[#495057]">
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-[2px] w-3 rounded-full bg-[#E03B3B]" />
              실제 평균가
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span
                className="inline-block h-[2px] w-4"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #2E9E6B 0 4px, transparent 4px 8px, #2E9E6B 8px 12px, transparent 12px 16px)",
                }}
              />
              중립 예측
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span
                className="inline-block h-2.5 w-4 rounded-sm"
                style={{ background: "rgba(46,158,107,0.24)" }}
              />
              낙관~비관 범위
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-[#C9A227]" />
              변곡점
            </span>
          </div>

          {/* 5. 낙관/중립/비관 3 값카드 */}
          <div className="mt-3">
            <PredictionScenarioCards
              point={selectedPoint}
              baseUnitLabel={baseUnitLabel}
              onOpenRangeDetail={() => setRangeDetailOpen(true)}
            />
          </div>

          {/* 힌트 */}
          <div className="mt-3 rounded-lg bg-[#F1F8F3] px-3 py-2 text-[11.5px] text-[#1F5C1F]">
            📅 그래프의 날짜를 누르면 그날의 예상 시세가 표시됩니다
          </div>
        </section>

        {/* 6. 출하/매입 시점 비교 */}
        <div className="mt-4">
          <PredictionCompareCards
            viewpoint={selectedViewpoint}
            currentPrice={prediction.currentPrice}
            expectedPrice={selectedPrice}
            baseUnitLabel={baseUnitLabel}
            quantityBoxes={quantityBoxes}
            quantityUnitLabel={QUANTITY_UNIT_LABEL[quantityUnit]}
            recommendationDate={selectedDate}
            isRecommendedSelection={!!selectedPoint?.isRecommendedDate}
          />
        </div>

        {/* 7. 예측 근거 */}
        <section className="mt-4">
          <h2 className="mb-2 text-[13px] font-bold text-foreground">
            예측 근거
          </h2>

          {/* 날씨 근거 카드 (요약) */}
          <div className="mb-2 rounded-xl border border-[#E9ECEF] bg-white p-3">
            <div className="flex items-start gap-2">
              <span className="text-[20px] leading-none">🌧️</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] font-bold text-foreground">
                    날씨 영향
                  </span>
                  <span className="rounded-full bg-[#FFE9E9] px-1.5 py-[1px] text-[10px] font-extrabold text-[#E03B3B]">
                    출하 주의
                  </span>
                </div>
                <p className="mt-1 text-[11.5px] leading-snug text-[#495057]">
                  {MOCK_WEATHER.regionFull} · {selectedDate} ·{" "}
                  {MOCK_WEATHER.current.temp}° {MOCK_WEATHER.current.desc} —
                  강수 20~35mm로 수확·출하 차질 가능, 공급 감소가 추천가에
                  반영됨.
                </p>
                <div className="mt-2 grid grid-cols-3 gap-1.5">
                  <div className="rounded-lg bg-[#F8F9FA] px-2 py-1.5 text-center">
                    <div className="text-[10px] text-[#6C757D]">강수</div>
                    <div className="text-[11.5px] font-bold text-[#212529]">
                      20~35mm
                    </div>
                  </div>
                  <div className="rounded-lg bg-[#FEF3F3] px-2 py-1.5 text-center">
                    <div className="text-[10px] text-[#E03B3B]">수확 지연</div>
                    <div className="text-[11.5px] font-bold text-[#E03B3B]">
                      우려
                    </div>
                  </div>
                  <div className="rounded-lg bg-[#FEF3F3] px-2 py-1.5 text-center">
                    <div className="text-[10px] text-[#E03B3B]">반입</div>
                    <div className="text-[11.5px] font-bold text-[#E03B3B]">
                      ↓
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <PredictionFactorList factors={prediction.factors} />
        </section>

        {/* 8. AI 상세 예측 리포트 (프리미엄) */}
        <section className="mt-4">
          <div className="rounded-2xl border border-dashed border-[#2E9E6B] bg-white p-4 text-center">
            <div className="text-[13px] font-bold text-foreground">
              📑 AI 상세 예측 리포트
            </div>
            <p className="mt-1.5 text-[11.5px] leading-snug text-[#6C757D]">
              방향성 지수 · 리스크 팩터 · 과거 vs 예측 추세 · 토픽별 뉴스 정리
              <br />
              (틸다 ArgMax 기반 · 프리미엄)
            </p>
            <button
              type="button"
              onClick={() => toast("리포트 미리보기는 준비 중입니다.")}
              className="mt-3 inline-flex h-9 items-center justify-center rounded-lg bg-[#2E9E6B] px-4 text-[12.5px] font-bold text-white active:bg-[#1F7A50]"
            >
              리포트 미리보기 ›
            </button>
          </div>
        </section>

        {/* 고지문 */}
        <p className="mt-4 px-2 text-center text-[10.5px] leading-snug text-[#adb5bd]">
          본 예측은 데이터 기반 AI의 참고용 세컨드 오피니언입니다. 실제 시세와
          다를 수 있으니 최종 판단은 사용자에게 있습니다.
        </p>
      </div>

      <PredictionCropSheet
        open={cropSheetOpen}
        onOpenChange={setCropSheetOpen}
        selectedCropId={selectedCropId}
        onSelect={(id) => setSelectedCropId(id)}
      />
      <QuantityPickerSheet
        open={qtySheetOpen}
        onOpenChange={setQtySheetOpen}
        value={quantityBoxes}
        unit={quantityUnit}
        onChange={(v, u) => setQuantity(v, u)}
        heading={isFarmer ? "출하량" : "매입량"}
      />
      <MarketPickerSheet
        open={marketSheetOpen}
        onOpenChange={setMarketSheetOpen}
        value={marketId}
        onChange={setMarketId}
      />
      <ViewpointPickerSheet
        open={viewpointSheetOpen}
        onOpenChange={setViewpointSheetOpen}
        value={selectedViewpoint}
        onChange={setSelectedViewpoint}
      />
      <PredictionRangeDetailSheet
        open={rangeDetailOpen}
        onOpenChange={setRangeDetailOpen}
        point={selectedPoint}
        baseUnitLabel={baseUnitLabel}
      />
    </AppShell>
  );
}
