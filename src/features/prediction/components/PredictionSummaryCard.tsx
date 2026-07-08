import type { PricePrediction } from "../types";

export function PredictionSummaryCard({
  prediction,
}: {
  prediction: PricePrediction;
}) {
  const future = prediction.predictedPoints.filter(
    (p) => p.predictedPrice !== undefined && !p.isToday,
  );
  const prices = future.map((p) => p.predictedPrice!);
  const max = prices.length ? Math.max(...prices) : prediction.currentPrice;
  const min = prices.length ? Math.min(...prices) : prediction.currentPrice;
  const avg = prices.length
    ? Math.round(prices.reduce((s, v) => s + v, 0) / prices.length)
    : prediction.currentPrice;

  const items = [
    { label: "최고 예상가", value: `${max.toLocaleString()}원`, color: "text-[#E03131]" },
    { label: "최저 예상가", value: `${min.toLocaleString()}원`, color: "text-[#1971C2]" },
    { label: "평균 예상가", value: `${avg.toLocaleString()}원`, color: "text-foreground" },
    {
      label: "예측 기간",
      value: `${prediction.predictionRangeDays}일`,
      color: "text-foreground",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((it) => (
        <div
          key={it.label}
          className="rounded-xl border border-[#E9ECEF] bg-white px-3 py-2.5"
        >
          <div className="text-[11px] text-[#868E96]">{it.label}</div>
          <div className={`mt-1 text-[15px] font-bold tabular-nums ${it.color}`}>
            {it.value}
          </div>
        </div>
      ))}
    </div>
  );
}
