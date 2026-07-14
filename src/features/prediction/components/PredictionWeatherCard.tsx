import { AlertTriangle } from "lucide-react";

export interface WeatherForecastDay {
  label: string; // "내일" | "모레" | "글피"
  icon: string;
  temp: number;
}

export interface PredictionWeatherCardProps {
  regionLabel: string;
  current: { icon: string; temp: number; desc: string };
  forecast: WeatherForecastDay[];
  priceImpact?: string;
}

// 가격 영향 문자열에서 "가격 상승 요인" / "가격 하락 요인" 부분을 강조 렌더링
function renderPriceImpact(text: string) {
  const match = text.match(/(가격\s*(상승|하락)\s*요인)/);
  if (!match) return <>{text}</>;
  const idx = text.indexOf(match[0]);
  const before = text.slice(0, idx);
  const keyword = match[0];
  const after = text.slice(idx + keyword.length);
  return (
    <>
      {before}
      <span className="font-extrabold text-[#E03B3B]">{keyword}</span>
      {after}
    </>
  );
}

export function PredictionWeatherCard({
  regionLabel,
  current,
  forecast,
  priceImpact,
}: PredictionWeatherCardProps) {
  return (
    <section className="rounded-[14px] border border-[#DBEAF6] bg-gradient-to-br from-[#EAF3FB] to-[#F3F8FC] p-3.5">
      {/* 현재 날씨 */}
      <div className="flex items-center gap-3">
        <span className="text-[32px] leading-none">{current.icon}</span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[11px] text-[#868E96]">
            {regionLabel}
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[23px] font-black leading-tight tabular-nums text-foreground">
              {current.temp}°
            </span>
            <span className="truncate text-[11px] text-[#495057]">
              {current.desc}
            </span>
          </div>
        </div>
      </div>

      {/* 3일 예보 */}
      <div className="mt-2.5 flex gap-1.5">
        {forecast.map((d) => (
          <div
            key={d.label}
            className="flex-1 rounded-[9px] bg-white/70 py-1.5 text-center"
          >
            <div className="text-[9.5px] text-[#868E96]">{d.label}</div>
            <div className="text-[17px] leading-tight">{d.icon}</div>
            <div className="text-[10px] font-bold tabular-nums text-foreground">
              {d.temp}°
            </div>
          </div>
        ))}
      </div>

      {/* 가격 영향 */}
      {priceImpact ? (
        <div className="mt-2.5 flex gap-1.5 border-t border-[rgba(59,130,196,0.2)] pt-2.5">
          <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-[#1F5C1F]" />
          <div className="text-[11px] font-bold leading-snug text-[#1F5C1F]">
            {renderPriceImpact(priceImpact)}
          </div>
        </div>
      ) : null}
    </section>
  );
}
