import { useLocation } from "@/store/location";
import {
  getWeatherForDate,
  getWeatherImpactStyle,
  MOCK_WEATHER,
} from "@/lib/mock/weather";

// 틸다 날씨 API 교체 대상 — 지금은 date 기반 mock 조회.
export function PredictionDateWeatherCard({
  dateIso,
  dateLabel,
}: {
  dateIso?: string;
  dateLabel?: string;
}) {
  const granted = useLocation((s) => s.granted);
  const request = useLocation((s) => s.request);

  if (granted !== true) {
    return (
      <div className="mt-3 flex items-center gap-2 rounded-2xl border border-dashed border-[#E9ECEF] bg-[#FAFAFA] px-3 py-4">
        <span className="text-[18px]">📍</span>
        <span className="flex-1 text-[12px] text-[#6C757D]">
          위치를 허용하면 선택한 날짜의 날씨 영향을 볼 수 있어요
        </span>
        <button
          type="button"
          onClick={() => request()}
          className="whitespace-nowrap rounded-lg bg-[#2E9E6B] px-3 py-1.5 text-[11.5px] font-bold text-white"
        >
          위치 허용하기 ›
        </button>
      </div>
    );
  }

  if (!dateIso) return null;

  const w = getWeatherForDate(dateIso);
  const impact = getWeatherImpactStyle(w.impact);

  return (
    <div className="mt-3 overflow-hidden rounded-2xl border border-[#E9ECEF] bg-white">
      {/* 상단 현황 바 */}
      <div className="flex items-center gap-3 bg-gradient-to-br from-[#EAF3FB] to-[#F3F8FC] px-3 py-3">
        <span className="text-[26px] leading-none">{w.icon}</span>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-semibold text-[#6C757D]">
            {MOCK_WEATHER.regionFull} · {dateLabel ?? dateIso}
          </div>
          <div className="mt-0.5 flex items-baseline gap-1.5">
            <span className="text-[20px] font-extrabold tabular-nums text-[#111827]">
              {w.temp}°
            </span>
            <span className="text-[11.5px] text-[#495057]">{w.condition}</span>
          </div>
        </div>
        <span
          className="rounded-full border px-2 py-0.5 text-[11px] font-extrabold"
          style={{
            backgroundColor: impact.badgeBg,
            borderColor: impact.badgeBorder,
            color: impact.badgeText,
          }}
        >
          {impact.badge}
        </span>
      </div>

      {/* 인과 플로우 */}
      <div className="flex items-stretch gap-1 px-3 py-3">
        {w.cause.steps.map((s, i) => (
          <div key={i} className="flex flex-1 items-center gap-1">
            <div
              className={
                "flex flex-1 flex-col items-center rounded-xl border px-1.5 py-2 text-center " +
                (s.risk
                  ? "border-[#F6C9C9] bg-[#FEF3F3]"
                  : "border-[#E9ECEF] bg-[#F8F9FA]")
              }
            >
              <span className="text-[18px] leading-none">{s.icon}</span>
              <span
                className={
                  "mt-1 text-[11.5px] font-bold " +
                  (s.risk ? "text-[#E03B3B]" : "text-[#212529]")
                }
              >
                {s.t}
              </span>
              <span className="mt-0.5 text-[10px] text-[#6C757D]">{s.sm}</span>
            </div>
            {i < w.cause.steps.length - 1 && (
              <span className="text-[14px] font-bold text-[#ADB5BD]">→</span>
            )}
          </div>
        ))}
      </div>

      {/* 근거 한 줄 */}
      <div className="border-t border-[#F1F3F5] bg-[#FAFBFC] px-3 py-2.5 text-[11.5px] leading-snug text-[#495057]">
        {w.reason}
      </div>
    </div>
  );
}
