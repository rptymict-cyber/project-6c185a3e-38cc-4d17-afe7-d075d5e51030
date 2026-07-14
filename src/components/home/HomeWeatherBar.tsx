import { useNavigate } from "@tanstack/react-router";
import { MapPin, ChevronRight, Umbrella } from "lucide-react";
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
      aria-label={`${w.region} 날씨 상세 보기`}
      className="relative flex w-full items-stretch overflow-hidden rounded-[20px] text-left text-white shadow-[0_6px_16px_rgba(2,82,153,0.16)] transition-transform duration-150 ease-out active:scale-[0.99]"
      style={{
        background:
          "linear-gradient(110deg, #0879ca 0%, #0968b6 52%, #07569d 100%)",
        height: 120,
        minHeight: 118,
        maxHeight: 124,
        paddingTop: 14,
        paddingBottom: 14,
        paddingLeft: 18,
        paddingRight: 16,
      }}
    >
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        {/* 위치 */}
        <div className="flex items-center gap-1 text-white/95">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span
            className="whitespace-nowrap"
            style={{ fontSize: 14, fontWeight: 600, lineHeight: "20px" }}
          >
            {w.region}
          </span>
        </div>

        {/* 기온 + 상태 */}
        <div className="flex items-center gap-2">
          <span
            className="tabular-nums text-white"
            style={{
              fontSize: 54,
              fontWeight: 700,
              lineHeight: 0.95,
              letterSpacing: "-2px",
            }}
          >
            {w.current.temp}
            <span style={{ fontSize: 32, fontWeight: 700 }}>°</span>
          </span>
          <span
            className="truncate text-white"
            style={{ fontSize: 17, fontWeight: 600, lineHeight: "24px" }}
          >
            {w.current.desc}
          </span>
        </div>

        {/* 주말 안내 */}
        {w.tip ? (
          <div
            className="flex items-center gap-1 text-white/95"
            style={{ fontSize: 14, fontWeight: 600, lineHeight: "20px" }}
          >
            <Umbrella className="h-3.5 w-3.5 shrink-0" />
            <span>{w.tip}</span>
          </div>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-1 pl-2">
        <WeatherIllustration
          size={82}
          className="max-w-[88px]"
        />
        <ChevronRight className="h-5 w-5 text-white/95" />
      </div>
    </button>
  );
}
