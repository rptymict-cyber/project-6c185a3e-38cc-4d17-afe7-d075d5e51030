import { useNavigate } from "@tanstack/react-router";
import { MapPin, ChevronRight } from "lucide-react";
import { useLocation } from "@/store/location";
import { MOCK_WEATHER } from "@/lib/mock/weather";
import { WeatherIllustration } from "@/components/weather/WeatherIllustration";

// 틸다 날씨 API 교체 대상
export function HomeWeatherBar() {
  const navigate = useNavigate();
  const granted = useLocation((s) => s.granted);
  const request = useLocation((s) => s.request);

  if (granted === false) {
    return (
      <button
        type="button"
        onClick={() => request()}
        className="flex w-full items-center gap-2 rounded-[16px] border border-dashed border-[#E9ECEF] bg-[#FAFAFA] px-3 py-3 text-left"
      >
        <MapPin className="h-4 w-4 text-[#6C757D]" />
        <span className="flex-1 text-[12.5px] text-[#6C757D]">
          위치를 허용하면 날씨를 볼 수 있어요
        </span>
        <span className="whitespace-nowrap text-[11.5px] font-semibold text-[#495057]">
          설정 ›
        </span>
      </button>
    );
  }

  if (granted !== true) return null;

  const w = MOCK_WEATHER;
  return (
    <button
      type="button"
      onClick={() => navigate({ to: "/weather" })}
      aria-label={`${w.region} 날씨 상세 보기, 현재 ${w.current.temp}도 ${w.current.desc}`}
      className="group relative flex w-full items-center overflow-hidden rounded-[22px] px-5 py-4 text-left text-white shadow-[0_8px_24px_rgba(15,23,42,0.08),0_2px_6px_rgba(15,23,42,0.04)] transition-transform active:scale-[0.99]"
      style={{
        background:
          "linear-gradient(135deg, #0D75C7 0%, #0A65B2 55%, #07579C 100%)",
      }}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-center gap-1 text-[13px] font-semibold text-white/95">
          <MapPin className="h-3.5 w-3.5" />
          <span>{w.region}</span>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="text-[54px] font-bold leading-none tracking-tight">
            {w.current.temp}
            <span className="text-[28px] font-semibold align-top">°</span>
          </span>
          <span className="text-[17px] font-semibold text-white/95">
            {w.current.desc}
          </span>
        </div>
        {w.tip ? (
          <div className="mt-0.5 inline-flex items-center gap-1 text-[13px] font-medium text-white/90">
            <span>{w.tip}</span>
          </div>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-1 pl-2">
        <WeatherIllustration size={104} />
        <ChevronRight className="h-5 w-5 text-white/90" />
      </div>
    </button>
  );
}
