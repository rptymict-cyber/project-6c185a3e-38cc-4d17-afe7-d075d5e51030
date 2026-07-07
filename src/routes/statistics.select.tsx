import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { CATEGORIES, CROPS, type Crop } from "@/lib/mock/crops";
import { useRecentStats } from "@/store/recent-stats";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/statistics/select")({
  component: StatisticsSelectPage,
  head: () => ({
    meta: [
      { title: "품목 선택 — 통계 — AGDICT" },
      { name: "description", content: "부류, 품목, 품종을 선택해 통계를 조회하세요." },
    ],
  }),
});

type Step = 1 | 2 | 3;

const VARIETIES: Record<string, string[]> = {
  // sensible defaults for a few crops; unknown crops fall back to ["전체"]
  apple: ["전체", "부사", "홍로", "감홍", "아오리", "기타"],
  pear: ["전체", "신고", "원황", "추황", "기타"],
  mandarin: ["전체", "하우스감귤", "감귤(일반)", "감귤(수입)", "극조생감귤", "만생귤", "기타"],
  cabbage: ["전체", "월동", "봄", "여름", "가을", "기타"],
  radish: ["전체", "가을", "봄", "월동", "기타"],
  onion: ["전체", "조생", "중생", "만생", "기타"],
  garlic: ["전체", "난지형", "한지형", "기타"],
  chili: ["전체", "노지", "하우스", "기타"],
  tomato: ["전체", "토마토(일반)", "방울토마토", "대추방울토마토", "기타"],
  eggplant: ["전체", "가지(일반)", "기타"],
};

function StatisticsSelectPage() {
  const router = useRouter();
  const navigate = useNavigate();
  const pushRecent = useRecentStats((s) => s.push);

  const [step, setStep] = useState<Step>(1);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [cropId, setCropId] = useState<string | null>(null);
  const [varietyLabel, setVarietyLabel] = useState<string | null>("전체");
  const [q, setQ] = useState("");

  const categoryList = useMemo(() => {
    return CATEGORIES.filter((c) => c.id !== "all").map((c) => ({
      id: c.id,
      label: c.label,
      count: CROPS.filter((crop) => crop.category === c.id).length,
    }));
  }, []);

  const filteredCategories = useMemo(
    () => categoryList.filter((c) => (q ? c.label.includes(q) : true)),
    [categoryList, q],
  );

  const crops = useMemo(() => {
    if (!categoryId) return [];
    return CROPS.filter((c) => c.category === categoryId);
  }, [categoryId]);

  const filteredCrops = useMemo(
    () => crops.filter((c) => (q ? c.name.includes(q) : true)),
    [crops, q],
  );

  const varieties = useMemo(() => {
    if (!cropId) return ["전체"];
    return VARIETIES[cropId] ?? ["전체", "기타"];
  }, [cropId]);

  const filteredVarieties = useMemo(
    () => varieties.filter((v) => (q ? v.includes(q) : true)),
    [varieties, q],
  );

  const catLabel = CATEGORIES.find((c) => c.id === categoryId)?.label ?? "";
  const cropLabel = CROPS.find((c) => c.id === cropId)?.name ?? "";

  const conditionText = [catLabel, cropLabel, varietyLabel && varietyLabel !== "전체" ? varietyLabel : null]
    .filter(Boolean)
    .join(" > ") || "-";

  const canNext =
    (step === 1 && !!categoryId) || (step === 2 && !!cropId) || (step === 3 && !!varietyLabel);

  const nextLabel = step === 3 ? "통계 보기" : "다음";

  const goBack = () => {
    setQ("");
    if (step === 1) {
      router.history.back();
      return;
    }
    if (step === 2) {
      setCropId(null);
      setStep(1);
      return;
    }
    setVarietyLabel("전체");
    setStep(2);
  };

  const goNext = () => {
    if (!canNext) return;
    setQ("");
    if (step === 1) {
      setStep(2);
      return;
    }
    if (step === 2) {
      setStep(3);
      return;
    }
    // finish
    if (!cropId) return;
    pushRecent(cropId);
    navigate({ to: "/statistics/$variety", params: { variety: cropId } });
  };

  return (
    <AppShell
      header={
        <header className="sticky top-0 z-30 flex h-[52px] items-center justify-between border-b border-[#E9ECEF] bg-background px-2">
          <button
            aria-label="뒤로"
            onClick={goBack}
            className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary"
          >
            {step === 1 ? <X className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
          </button>
          <div className="pointer-events-none absolute inset-x-0 top-0 flex h-[52px] items-center justify-center">
            <span className="text-[15px] font-black tracking-tight text-foreground">
              {step === 3 ? "품종 선택" : "품목 선택"}
            </span>
          </div>
          <button
            aria-label="닫기"
            onClick={() => router.history.back()}
            className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary"
          >
            <X className="h-5 w-5" />
          </button>
        </header>
      }
      bottom={
        <div className="sticky bottom-[60px] z-20 border-t border-[#E9ECEF] bg-background px-4 pt-2 pb-2">
          <div className="mb-1 text-[11px] text-[#6C757D]">선택한 조건</div>
          <div className="mb-2 truncate text-[13px] font-bold text-foreground">{conditionText}</div>
          <button
            disabled={!canNext}
            onClick={goNext}
            className={cn(
              "w-full rounded-[10px] py-3 text-[14px] font-bold text-white transition-colors",
              canNext ? "bg-[#3A8A3A]" : "bg-[#CED4DA]",
            )}
          >
            {nextLabel}
          </button>
        </div>
      }
    >
      {/* Stepper */}
      <div className="px-4 pt-4">
        <ol className="flex items-center">
          {[1, 2, 3].map((n) => {
            const active = step === n;
            const done = step > n;
            return (
              <li key={n} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-1">
                  <span
                    className={cn(
                      "grid h-6 w-6 place-items-center rounded-full text-[11px] font-bold",
                      active
                        ? "bg-[#3A8A3A] text-white"
                        : done
                          ? "bg-[#B7E1B7] text-white"
                          : "bg-[#E9ECEF] text-[#868E96]",
                    )}
                  >
                    {done ? "✓" : n}
                  </span>
                  <span
                    className={cn(
                      "text-[11px] font-semibold",
                      active ? "text-[#3A8A3A]" : done ? "text-[#495057]" : "text-[#ADB5BD]",
                    )}
                  >
                    {n === 1 ? "부류 선택" : n === 2 ? "품목 선택" : "품종 선택"}
                  </span>
                </div>
                {n < 3 && (
                  <span
                    className={cn(
                      "mx-2 h-px flex-1",
                      step > n ? "bg-[#B7E1B7]" : "bg-[#E9ECEF]",
                    )}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {/* Breadcrumb / back within step */}
      {step >= 2 && (
        <div className="mt-4 flex items-center gap-2 px-4 text-[13px] font-semibold text-[#495057]">
          <button
            onClick={goBack}
            className="grid h-6 w-6 place-items-center rounded hover:bg-[#F1F3F5]"
            aria-label="이전 단계"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <span>{catLabel}</span>
          {step === 3 && (
            <>
              <ChevronRight className="h-3.5 w-3.5 text-[#ADB5BD]" />
              <span>{cropLabel}</span>
            </>
          )}
        </div>
      )}

      {/* Search */}
      <div className="mt-3 px-4">
        <div className="flex items-center gap-2 rounded-[10px] border border-[#E9ECEF] bg-white px-3 py-2">
          <Search className="h-4 w-4 text-[#ADB5BD]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={step === 1 ? "부류 검색" : step === 2 ? "품목 검색" : "품종 검색"}
            className="min-w-0 flex-1 bg-transparent text-[13.5px] outline-none placeholder:text-[#ADB5BD]"
          />
        </div>
      </div>

      {/* List */}
      <div className="mt-3 px-4 pb-40">
        {step === 1 && (
          <ul className="overflow-hidden rounded-[10px] border border-[#E9ECEF] bg-white">
            {filteredCategories.map((c, i) => {
              const active = categoryId === c.id;
              return (
                <li key={c.id} className={cn(i > 0 && "border-t border-[#F1F3F5]")}>
                  <button
                    onClick={() => setCategoryId(c.id as string)}
                    className={cn(
                      "flex w-full items-center gap-3 px-3 py-3.5 text-left",
                      active && "bg-[#F0F9F0]",
                    )}
                  >
                    <span className="text-[18px]">{categoryEmoji(c.id as string)}</span>
                    <span className="flex-1 text-[14px] font-semibold text-foreground">
                      {c.label}
                    </span>
                    <span className="text-[12px] tabular-nums text-[#868E96]">{c.count}</span>
                    <ChevronRight className="h-4 w-4 text-[#ADB5BD]" />
                  </button>
                </li>
              );
            })}
            {filteredCategories.length === 0 && (
              <li className="px-4 py-8 text-center text-[13px] text-[#868E96]">
                검색 결과가 없어요
              </li>
            )}
          </ul>
        )}

        {step === 2 && (
          <ul className="overflow-hidden rounded-[10px] border border-[#E9ECEF] bg-white">
            {filteredCrops.map((c, i) => (
              <li key={c.id} className={cn(i > 0 && "border-t border-[#F1F3F5]")}>
                <CropRow
                  crop={c}
                  active={cropId === c.id}
                  onClick={() => setCropId(c.id)}
                />
              </li>
            ))}
            {filteredCrops.length === 0 && (
              <li className="px-4 py-8 text-center text-[13px] text-[#868E96]">
                검색 결과가 없어요
              </li>
            )}
          </ul>
        )}

        {step === 3 && (
          <ul className="overflow-hidden rounded-[10px] border border-[#E9ECEF] bg-white">
            {filteredVarieties.map((v, i) => {
              const active = varietyLabel === v;
              return (
                <li key={v} className={cn(i > 0 && "border-t border-[#F1F3F5]")}>
                  <button
                    onClick={() => setVarietyLabel(v)}
                    className={cn(
                      "flex w-full items-center gap-3 px-3 py-3.5 text-left",
                      active && "bg-[#F0F9F0]",
                    )}
                  >
                    <span className="flex-1 text-[14px] font-semibold text-foreground">{v}</span>
                    <span
                      className={cn(
                        "grid h-5 w-5 place-items-center rounded-full border-2",
                        active ? "border-[#3A8A3A]" : "border-[#CED4DA]",
                      )}
                    >
                      {active && <span className="h-2.5 w-2.5 rounded-full bg-[#3A8A3A]" />}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AppShell>
  );
}

function CropRow({ crop, active, onClick }: { crop: Crop; active: boolean; onClick: () => void }) {
  const showPredict = crop.isPredictable && crop.predictionStatus === "available";
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 px-3 py-3.5 text-left",
        active && "bg-[#F0F9F0]",
      )}
    >
      <span className="grid h-8 w-8 place-items-center rounded-full bg-[#F1F3F5] text-[18px]">
        {crop.emoji}
      </span>
      <span className="flex-1 text-[14px] font-semibold text-foreground">{crop.name}</span>
      {showPredict && (
        <span className="rounded-full bg-[#F0F9F0] px-2 py-0.5 text-[10.5px] font-bold text-[#3A8A3A]">
          시세 예측
        </span>
      )}
      <ChevronRight className="h-4 w-4 text-[#ADB5BD]" />
    </button>
  );
}

function categoryEmoji(id: string): string {
  switch (id) {
    case "fruit": return "🍎";
    case "vegetable": return "🥬";
    case "seasoning": return "🌶️";
    case "root": return "🥕";
    case "tuber": return "🥔";
    case "mushroom": return "🍄";
    case "grain": return "🌾";
    case "legume": return "🫘";
    default: return "🧺";
  }
}
