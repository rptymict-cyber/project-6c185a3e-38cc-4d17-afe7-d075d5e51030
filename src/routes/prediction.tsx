import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { DetailHeader } from "@/components/detail-header";
import { PredictionChart } from "@/features/prediction/components/PredictionChart";
import { PredictionCompareCards } from "@/features/prediction/components/PredictionCompareCards";
import { PredictionConditionGrid } from "@/features/prediction/components/PredictionConditionGrid";
import { PredictionCropSheet } from "@/features/prediction/components/PredictionCropSheet";
import { PredictionFactorList } from "@/features/prediction/components/PredictionFactorList";
import { PredictionInsightCard } from "@/features/prediction/components/PredictionInsightCard";
import { PredictionSummaryCard } from "@/features/prediction/components/PredictionSummaryCard";
import { MarketPickerSheet } from "@/features/prediction/components/MarketPickerSheet";
import { QuantityPickerSheet } from "@/features/prediction/components/QuantityPickerSheet";
import { ViewpointPickerSheet } from "@/features/prediction/components/ViewpointPickerSheet";
import { usePrediction } from "@/features/prediction/usePrediction";
import { usePredictionView } from "@/features/prediction/usePredictionView";
import {
  isPredictableCropId,
  getPredictableCrop,
} from "@/features/prediction/mockPredictionData";
import type { PredictionRangeDays } from "@/features/prediction/types";
import { MARKETS } from "@/lib/mock/markets";
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
          "AI 가격 예측: 사과·배추·무·양파·고추의 예상 가격과 유리한 출하·매입 시점을 확인하세요.",
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
  const router = useRouter();
  const search = Route.useSearch();

  const selectedCropId = usePredictionView((s) => s.selectedCropId);
  const selectedViewpoint = usePredictionView((s) => s.selectedViewpoint);
  const selectedRangeDays = usePredictionView((s) => s.selectedRangeDays);
  const quantityBoxes = usePredictionView((s) => s.quantityBoxes);
  const marketId = usePredictionView((s) => s.marketId);
  const setSelectedCropId = usePredictionView((s) => s.setSelectedCropId);
  const setSelectedViewpoint = usePredictionView((s) => s.setSelectedViewpoint);
  const setSelectedRangeDays = usePredictionView((s) => s.setSelectedRangeDays);
  const setQuantityBoxes = usePredictionView((s) => s.setQuantityBoxes);
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

  const prediction = usePrediction(selectedCropId, selectedRangeDays);
  const cropMeta = getPredictableCrop(selectedCropId);
  const marketName =
    MARKETS.find((m) => m.id === marketId)?.name ??
    cropMeta?.marketName ??
    "서울가락";

  if (!prediction || !cropMeta) {
    return (
      <AppShell header={<DetailHeader title="AI 가격 예측" onBack={() => router.history.back()} />}>
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

  // 관점별 유리 방향: 농민 = 상승, 도매상 = 하락
  const priceDiff = insight.expectedPrice - prediction.currentPrice;
  const isPositiveForUser = isFarmer ? priceDiff > 0 : priceDiff < 0;

  return (
    <AppShell header={<DetailHeader title="AI 가격 예측" onBack={() => router.history.back()} />}>
      <div className="px-4 pb-16 pt-3">
        {/* 1. 상단 조건 선택 그리드 */}
        <PredictionConditionGrid
          quantityHeading={isFarmer ? "출하량" : "매입량"}
          quantityLabel={`${quantityBoxes}상자`}
          cropLabel={prediction.cropName}
          marketLabel={marketName}
          viewpointLabel={isFarmer ? "농민" : "도매상"}
          onQuantityClick={() => setQtySheetOpen(true)}
          onCropClick={() => setCropSheetOpen(true)}
          onMarketClick={() => setMarketSheetOpen(true)}
          onViewpointClick={() => setViewpointSheetOpen(true)}
        />

        {/* 2. AI 추천 카드 */}
        <div className="mt-3">
          <PredictionInsightCard
            viewpoint={selectedViewpoint}
            recommendationDate={insight.recommendationDate}
            expectedPrice={insight.expectedPrice}
            currentPrice={prediction.currentPrice}
            baseUnitLabel={baseUnitLabel}
            quantityBoxes={quantityBoxes}
            isPositiveForUser={isPositiveForUser}
          />
        </div>

        {/* 3. 출하/매입 시점 비교 */}
        <div className="mt-4">
          <PredictionCompareCards
            viewpoint={selectedViewpoint}
            currentPrice={prediction.currentPrice}
            expectedPrice={insight.expectedPrice}
            baseUnitLabel={baseUnitLabel}
            quantityBoxes={quantityBoxes}
            recommendationDate={insight.recommendationDate}
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
            <PredictionChart points={prediction.predictedPoints} />
          </div>
        </section>

        {/* 5. 예측 요약 */}
        <section className="mt-4">
          <h2 className="mb-2 text-[13px] font-bold text-foreground">
            예측 요약
          </h2>
          <PredictionSummaryCard prediction={prediction} />
        </section>

        {/* 6. 예측 근거 */}
        <section className="mt-4">
          <h2 className="mb-2 text-[13px] font-bold text-foreground">
            예측 근거
          </h2>
          <PredictionFactorList factors={prediction.factors} />
        </section>

        {/* 시세 상세 이동 */}
        <button
          type="button"
          onClick={() =>
            navigate({
              to: "/price/$variety",
              params: { variety: prediction.cropId },
            })
          }
          className="mt-5 grid h-11 w-full place-items-center rounded-xl border border-[#E9ECEF] bg-white text-[13px] font-semibold text-[#495057] active:bg-[#F8F9FA]"
        >
          {prediction.cropName} 시세 상세 보기
        </button>
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
        onChange={setQuantityBoxes}
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
    </AppShell>
  );
}
