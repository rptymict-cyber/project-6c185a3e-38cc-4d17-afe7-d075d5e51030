import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ChevronDown, TrendingDown, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PredictionChart } from "@/features/prediction/components/PredictionChart";
import { PredictionCropSheet } from "@/features/prediction/components/PredictionCropSheet";
import { PredictionFactorList } from "@/features/prediction/components/PredictionFactorList";
import { PredictionInsightCard } from "@/features/prediction/components/PredictionInsightCard";
import { PredictionSummaryCard } from "@/features/prediction/components/PredictionSummaryCard";
import { ViewpointDropdown } from "@/features/prediction/components/ViewpointDropdown";
import { usePrediction } from "@/features/prediction/usePrediction";
import { usePredictionView } from "@/features/prediction/usePredictionView";
import {
  isPredictableCropId,
  PREDICTABLE_CROPS,
} from "@/features/prediction/mockPredictionData";
import type { PredictionRangeDays } from "@/features/prediction/types";
import { cn } from "@/lib/utils";
import { CropIcon } from "@/components/crop-icon";

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
      { title: "AI 가격 예측 (Beta) — AGDICT" },
      {
        name: "description",
        content:
          "AI 가격 예측: 사과·배추·무·양파·고추의 예상 가격과 유리한 출하·매입 시점을 확인하세요.",
      },
    ],
  }),
});

const RANGE_OPTIONS: PredictionRangeDays[] = [7, 10, 14, 30];

function PredictionPage() {
  const router = useRouter();
  const navigate = useNavigate();
  const search = Route.useSearch();

  const selectedCropId = usePredictionView((s) => s.selectedCropId);
  const selectedViewpoint = usePredictionView((s) => s.selectedViewpoint);
  const selectedRangeDays = usePredictionView((s) => s.selectedRangeDays);
  const setSelectedCropId = usePredictionView((s) => s.setSelectedCropId);
  const setSelectedViewpoint = usePredictionView((s) => s.setSelectedViewpoint);
  const setSelectedRangeDays = usePredictionView((s) => s.setSelectedRangeDays);

  // URL의 cropId/crop이 예측 가능하면 스토어에 반영 (홈/상세에서 진입 시)
  useEffect(() => {
    const incoming = search.cropId ?? search.crop;
    if (incoming && isPredictableCropId(incoming) && incoming !== selectedCropId) {
      setSelectedCropId(incoming);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.cropId, search.crop]);

  const [cropSheetOpen, setCropSheetOpen] = useState(false);

  const prediction = usePrediction(selectedCropId, selectedRangeDays);

  if (!prediction) {
    return (
      <AppShell header={<PredictionHeader onBack={() => router.history.back()} />}>
        <div className="grid min-h-[60vh] place-items-center px-6 text-center text-[13px] text-[#6C757D]">
          예측 정보를 불러올 수 없어요.
        </div>
      </AppShell>
    );
  }

  const insight =
    selectedViewpoint === "farmer"
      ? prediction.farmerInsight
      : prediction.wholesalerInsight;

  const prevUp = prediction.previousChangeRate > 0;
  const prevFlat = prediction.previousChangeRate === 0;
  const prevColor = prevFlat
    ? "text-[#6C757D]"
    : prevUp
      ? "text-[#E03131]"
      : "text-[#1971C2]";

  return (
    <AppShell
      header={<PredictionHeader onBack={() => router.history.back()} />}
    >
      <div className="px-4 pb-16 pt-3">
        {/* 작물 요약 카드 */}
        <section className="rounded-2xl border border-[#E9ECEF] bg-white p-4">
          <div className="flex items-start justify-between gap-2">
            <button
              type="button"
              onClick={() => setCropSheetOpen(true)}
              className="flex min-w-0 items-center gap-2 text-left"
            >
              <CropIcon name={prediction.cropName} size={32} />
              <div className="min-w-0">
                <div className="flex items-center gap-1 text-[16px] font-bold text-foreground">
                  {prediction.cropName}
                  <span className="text-[12px] font-medium text-[#6C757D]">
                    · {prediction.varietyName}
                  </span>
                  <ChevronDown className="h-4 w-4 text-[#868E96]" />
                </div>
                <div className="mt-0.5 text-[11.5px] text-[#868E96]">
                  {prediction.marketName} · {prediction.unit}
                </div>
              </div>
            </button>
            <ViewpointDropdown
              value={selectedViewpoint}
              onChange={setSelectedViewpoint}
            />
          </div>

          <div className="mt-3 flex items-end gap-1.5">
            <span className="text-[26px] font-black leading-none tabular-nums text-foreground">
              {prediction.currentPrice.toLocaleString()}
            </span>
            <span className="pb-0.5 text-[13px] font-semibold text-foreground">
              원
            </span>
            <span className="pb-0.5 text-[11.5px] text-[#868E96]">
              / {prediction.unit.replace(" 기준", "")}
            </span>
          </div>

          <div className={cn("mt-1 flex items-center gap-1 text-[12px] font-bold tabular-nums", prevColor)}>
            {prevUp ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" />
            )}
            {prevUp ? "+" : ""}
            {prediction.previousChangePrice.toLocaleString()}원 (
            {prevUp ? "+" : ""}
            {prediction.previousChangeRate.toFixed(1)}%)
            <span className="ml-1 text-[11px] font-medium text-[#868E96]">
              전일 대비
            </span>
          </div>

          <button
            type="button"
            onClick={() => setCropSheetOpen(true)}
            className="mt-3 inline-flex h-8 items-center gap-1 rounded-full border border-[#E9ECEF] bg-white px-3 text-[12px] font-semibold text-[#495057] active:bg-[#F8F9FA]"
          >
            작물 변경
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </section>

        {/* 관점별 핵심 카드 */}
        <div className="mt-3">
          <PredictionInsightCard
            insight={insight}
            confidenceScore={prediction.confidenceScore}
          />
        </div>

        {/* 기간 선택 */}
        <section className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-[13px] font-bold text-foreground">가격 예측 차트</h2>
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

        {/* 예측 요약 */}
        <section className="mt-4">
          <h2 className="mb-2 text-[13px] font-bold text-foreground">
            예측 요약
          </h2>
          <PredictionSummaryCard prediction={prediction} />
        </section>

        {/* 예측 근거 */}
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
    </AppShell>
  );
}

function PredictionHeader({ onBack }: { onBack: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-[52px] items-center justify-between border-b border-[#E9ECEF] bg-background px-2">
      <button
        aria-label="뒤로"
        onClick={onBack}
        className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      <div className="flex items-center gap-1.5">
        <span className="text-[15px] font-bold text-foreground">
          AI 가격 예측
        </span>
        <span className="rounded-full bg-[#F0F9F0] px-1.5 py-0.5 text-[10px] font-bold text-[#3A8A3A]">
          Beta
        </span>
      </div>
      <div className="h-9 w-9" />
    </header>
  );
}

// prevent unused import warning during dev without JSX referencing PREDICTABLE_CROPS
void PREDICTABLE_CROPS;
