import type { PredictionPoint } from "../types";

const DOW = ["일", "월", "화", "수", "목", "금", "토"];
function md(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return `${m}/${d}(${DOW[new Date(y, m - 1, d).getDay()]})`;
}

/** 선택 예측 기간 내 중립 예측값 기준 최고가 / 예상 평균가 / 최저가 */
export function PredictionScenarioCards({
  points,
  rangeDays,
  baseUnitLabel,
  onOpenRangeDetail,
}: {
  points: PredictionPoint[];
  rangeDays: number;
  baseUnitLabel: string;
  onOpenRangeDetail: () => void;
}) {
  const fut = points.filter((p) => !p.isToday && p.actualPrice === undefined && p.predictedPrice !== undefined);
  if (!fut.length) return null;
  const max = fut.reduce((a, b) => (b.predictedPrice! > a.predictedPrice! ? b : a));
  const min = fut.reduce((a, b) => (b.predictedPrice! < a.predictedPrice! ? b : a));
  const avg = Math.round(fut.reduce((s, p) => s + p.predictedPrice!, 0) / fut.length);

  return (
    <section>
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-[13px] border border-[#E9ECEF] bg-white p-2.5 text-center">
          <div className="text-meta font-bold text-[#E03B3B]">▲ 최고가</div>
          <div className="mt-1 flex items-baseline justify-center gap-0.5">
            <span className="text-subtitle font-black tabular-nums text-foreground">
              {max.predictedPrice!.toLocaleString()}
            </span>
            <span className="text-subtitle font-black text-foreground">원</span>
          </div>
          <div className="mt-0.5 text-meta font-semibold text-[#868E96]">{md(max.date)}</div>
        </div>
        <div className="relative rounded-[13px] border-2 border-[#2E9E6B] bg-[#F0F9F0] p-2.5 text-center">
          <div className="text-meta font-bold text-[#1F5C1F]">● 예상 평균가</div>
          <div className="mt-1 flex items-baseline justify-center gap-0.5">
            <span className="text-subtitle font-black tabular-nums text-[#1F5C1F]">{avg.toLocaleString()}</span>
            <span className="text-subtitle font-black text-[#1F5C1F]">원</span>
          </div>
          <div className="mt-0.5 text-meta font-semibold leading-tight text-[#1F5C1F]">앞으로 {rangeDays}일 평균</div>
        </div>
        <div className="rounded-[13px] border border-[#E9ECEF] bg-white p-2.5 text-center">
          <div className="text-meta font-bold text-[#1971C2]">▼ 최저가</div>
          <div className="mt-1 flex items-baseline justify-center gap-0.5">
            <span className="text-subtitle font-black tabular-nums text-foreground">
              {min.predictedPrice!.toLocaleString()}
            </span>
            <span className="text-subtitle font-black text-foreground">원</span>
          </div>
          <div className="mt-0.5 text-meta font-semibold text-[#868E96]">{md(min.date)}</div>
        </div>
      </div>
      <div className="mt-1 text-right text-meta text-[#ADB5BD]">원 / {baseUnitLabel}</div>

      <div className="mt-2 rounded-xl bg-[#F0F9F0] px-3 py-2 text-meta leading-snug text-[#2c6444]">
        💡 연한 초록 띠는 AI가 예상하는 <b>가격 범위</b>예요. 뒤로 갈수록 띠가 넓어지는 건 그만큼 예측이 어렵다는 뜻이에요.{" "}
        <button
          type="button"
          onClick={onOpenRangeDetail}
          className="ml-0.5 inline-flex min-h-9 items-center whitespace-nowrap font-bold text-[#1F7A50] underline underline-offset-2"
        >
          자세히›
        </button>
      </div>
    </section>
  );
}
