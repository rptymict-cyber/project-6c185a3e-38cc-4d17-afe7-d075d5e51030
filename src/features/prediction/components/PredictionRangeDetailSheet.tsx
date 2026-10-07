import { PredictionSheetFrame, SheetPrimaryButton } from "./PredictionSheetFrame";
import type { PredictionPoint, PredictionViewpoint } from "../types";
import { toKg, unitKgOf, type AmountUnit } from "@/lib/units";

const DOW = ["일", "월", "화", "수", "목", "금", "토"];
function md(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return `${m}/${d}(${DOW[new Date(y, m - 1, d).getDay()]})`;
}

export function PredictionRangeDetailSheet({
  open,
  onOpenChange,
  point,
  baseUnitLabel,
  quantityBoxes,
  quantityUnit,
  quantityUnitLabel,
  cropName,
  viewpoint,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  point?: PredictionPoint;
  baseUnitLabel: string;
  quantityBoxes: number;
  quantityUnit: AmountUnit;
  quantityUnitLabel: string;
  cropName: string;
  viewpoint: PredictionViewpoint;
}) {
  const isFarmer = viewpoint === "farmer";
  const baseUnitKg = unitKgOf(baseUnitLabel) || 1;
  const baseUnitCount = toKg(quantityBoxes, quantityUnit, cropName) / baseUnitKg;
  const mid = point?.predictedPrice;
  const opt = point?.optimisticPrice;
  const pess = point?.pessimisticPrice;
  const has = mid != null && opt != null && pess != null;
  const total = (p: number) => Math.round(p * baseUnitCount);
  const midPct = has && opt! !== pess! ? ((mid! - pess!) / (opt! - pess!)) * 100 : 50;

  const cards = has
    ? [
        { key: "opt", title: "높게 본 가격", desc: "공급이 줄거나 수요가 늘어 가격이 높게 형성될 경우", price: opt!, strong: false },
        { key: "mid", title: "예상 가격", desc: "AI가 예측한 기본 가격 (차트의 가운데 점선)", price: mid!, strong: true },
        { key: "pess", title: "낮게 본 가격", desc: "반입량이 늘거나 날씨가 나빠 가격이 낮게 형성될 경우", price: pess!, strong: false },
      ]
    : [];

  return (
    <PredictionSheetFrame
      open={open}
      onOpenChange={onOpenChange}
      title="예측 범위 자세히"
      footer={<SheetPrimaryButton onClick={() => onOpenChange(false)}>확인</SheetPrimaryButton>}
    >
      <div className="px-4 pt-[14px] pb-4">
        {point && (
          <>
            <span className="inline-flex items-center rounded-full border border-[#CFE7CF] bg-[#EAF7F0] px-3 py-1.5 text-[13px] font-bold text-[#1F5C1F]">
              📅 {md(point.date)} 기준
              {point.isRecommendedDate ? ` · ${isFarmer ? "출하" : "매입"}에 유리한 날` : ""}
            </span>
            <p className="mt-1.5 mb-2.5 text-[11px] text-[#868E96]">
              차트에서 다른 날짜를 누르면 그 날짜 기준으로 바뀌어요.
            </p>
          </>
        )}

        <p className="mt-2 mb-3 text-[12.5px] leading-[1.55] text-[#495057]">
          AI는 하나의 값이 아니라 가격이 들어올 <b>범위</b>를 예측해요. 뒤로 갈수록 범위가 넓어지는 건 그만큼 예측이 어렵다는 뜻이에요.
        </p>

        {has ? (
          <>
            <div className="space-y-2">
              {cards.map((c) => (
                <div
                  key={c.key}
                  className={
                    "flex items-stretch gap-2.5 rounded-[14px] px-3 py-[11px] " +
                    (c.strong ? "border-2 border-[#2E9E6B] bg-[#F4FBF7]" : "border border-[#E9ECEF] bg-white")
                  }
                >
                  <span className={"w-2.5 shrink-0 rounded-full " + (c.strong ? "bg-[#2E9E6B]" : "bg-[#9AD3B5]")} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[14px] font-bold text-foreground">{c.title}</span>
                      
                    </div>
                    <div className="mt-0.5 text-[11px] leading-[1.4] text-[#868E96]">{c.desc}</div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-[16px] font-bold tabular-nums text-foreground">{c.price.toLocaleString()}원</div>
                    <div className="text-[11px] tabular-nums text-[#868E96]">
                      / {baseUnitLabel} · {total(c.price).toLocaleString()}원
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 px-1">
              <div className="relative h-[18px]">
                <div
                  className="absolute inset-x-0 top-1 h-2.5 rounded-full"
                  style={{ background: "linear-gradient(90deg,#CDEBDD,#8FD0B0 50%,#CDEBDD)" }}
                />
                {[0, midPct, 100].map((p, i) => (
                  <span
                    key={i}
                    className="absolute top-0 h-[18px] w-[3px] -translate-x-1/2 rounded-full bg-[#1F7A50]"
                    style={{ left: `${p}%` }}
                  />
                ))}
              </div>
              <div className="relative mt-1 h-4 text-[11px] text-[#868E96]">
                <span className="absolute left-0">낮게 본 {pess!.toLocaleString()}</span>
                <span
                  className="absolute -translate-x-1/2 font-bold text-[#1F5C1F]"
                  style={{ left: `${Math.min(70, Math.max(30, midPct))}%` }}
                >
                  예상 {mid!.toLocaleString()}
                </span>
                <span className="absolute right-0">높게 본 {opt!.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-[#F8F9FA] px-3 py-2.5 text-[11.5px] leading-[1.5] text-[#495057]">
              오른쪽 금액은{" "}
              <b>
                {isFarmer ? "출하량" : "매입량"} {quantityBoxes.toLocaleString()}
                {quantityUnitLabel} 기준 {isFarmer ? "예상 판매금액" : "예상 매입금액"}
              </b>
              이에요. 예상 시세 기준이라 물류비·수수료는 반영되지 않았어요.
            </div>
          </>
        ) : (
          <div className="rounded-xl bg-[#F8F9FA] px-3 py-2.5 text-[11.5px] leading-[1.5] text-[#495057]">
            예측 범위 데이터를 불러오지 못했어요. 잠시 후 다시 확인해주세요.
          </div>
        )}

        <div className="mt-3 rounded-xl bg-[#F0F9F0] px-3 py-2.5 text-meta leading-snug text-[#2c6444]">
          📌 차트의 연한 초록 띠는 높게~낮게 본 가격의 범위, 가운데 점선은 예상 가격이에요.
        </div>
      </div>
    </PredictionSheetFrame>
  );
}
