import type { GaugeDatum } from "@/lib/mock/statistics-mock";
import { cn } from "@/lib/utils";

/**
 * 등락 금액 강조형 3칸 카드.
 * 라벨 / 등락 금액 / 등락률 뱃지를 한 번에 노출. 반원 게이지·탭 토글 없음.
 */
export function StatsGauge({
  label,
  data,
}: {
  label: string;
  data: GaugeDatum;
}) {
  const has = data != null && data.base > 0;
  const dir = !has || data!.delta === 0 ? 0 : data!.delta > 0 ? 1 : -1;

  const textColor = dir > 0 ? "#E03131" : dir < 0 ? "#1971C2" : "#868E96";
  const badgeBg = dir > 0 ? "#FEECEC" : dir < 0 ? "#EAF2FD" : "#F1F3F5";

  const pct = has ? data!.pct : 0;
  const pctText = has
    ? `${dir > 0 ? "▲" : dir < 0 ? "▼" : "—"}${Math.abs(pct).toFixed(pct % 1 === 0 ? 0 : 1).replace(/\.0$/, "")}%`
    : "—";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-[14px] border border-[#EAECEF] bg-white px-[10px] py-[13px] text-center",
      )}
    >
      <span className="text-[11px] font-semibold text-[#868E96]">{label}</span>
      <span
        className="mt-1 text-[19px] font-black tabular-nums leading-tight"
        style={{ color: textColor }}
      >
        {has ? (
          <>
            {data!.delta > 0 ? "+" : data!.delta < 0 ? "−" : ""}
            {Math.abs(data!.delta).toLocaleString()}원
          </>
        ) : (
          "—"
        )}
      </span>
      <span
        className="mt-1.5 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-extrabold"
        style={{ backgroundColor: badgeBg, color: textColor }}
      >
        {pctText}
      </span>
    </div>
  );
}
