import { useNavigate } from "@tanstack/react-router";
import { MapPin, ChevronRight, Umbrella } from "lucide-react";
import { useLocation } from "@/store/location";
import { MOCK_WEATHER, DEFAULT_REGION_WEATHER } from "@/lib/mock/weather";
import { WeatherIllustration } from "@/components/weather/WeatherIllustration";

// 틸다 날씨 API 교체 대상
export function HomeWeatherBar() {
  const navigate = useNavigate();
  const granted = useLocation((s) => s.granted);
  const request = useLocation((s) => s.request);
  const pending = useLocation((s) => s.pending);

  // 권한이 없으면 기본 지역(서울) 날씨로 대체 표시
  const isFallback = granted !== true;
  const w = isFallback ? DEFAULT_REGION_WEATHER : MOCK_WEATHER;

  return (
    <button
      type="button"
      onClick={() => navigate({ to: "/weather" })}
      aria-label={`${w.region} 날씨 상세 보기`}
      className="relative flex w-full items-stretch overflow-hidden rounded-[20px] text-left text-white shadow-[0_6px_16px_rgba(2,82,153,0.16)] transition-transform duration-150 ease-out active:scale-[0.99]"
      style={{
        background:
          "linear-gradient(110deg, #0879ca 0%, #0968b6 52%, #07569d 100%)",
        minHeight: 118,
        paddingTop: 14,
        paddingBottom: 14,
        paddingLeft: 18,
        paddingRight: 16,
      }}
    >
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-1">
        {/* 위치 */}
        <div className="flex items-center gap-1 text-white/95">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span
            className="whitespace-nowrap"
            style={{ fontSize: 14, fontWeight: 600, lineHeight: "20px" }}
          >
            {w.region}
          </span>
          {isFallback ? (
            <span
              className="ml-1 rounded-full bg-white/20 px-1.5 py-0.5 text-white/95"
              style={{ fontSize: 10.5, fontWeight: 600 }}
            >
              기본 지역
            </span>
          ) : null}
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

        {/* 주말 안내 또는 위치 권한 안내 */}
        {isFallback ? (
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              if (!pending) void request();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.stopPropagation();
                if (!pending) void request();
              }
            }}
            className="flex items-center gap-1 text-left text-white/90 underline decoration-white/40 underline-offset-2"
            style={{ fontSize: 12, fontWeight: 600, lineHeight: "18px" }}
          >
            <MapPin className="h-3 w-3 shrink-0" />
            현재 위치 날씨를 보려면 위치 권한을 허용해주세요
          </span>
        ) : w.tip ? (
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
        <WeatherIllustration size={82} className="max-w-[88px]" />
        <ChevronRight className="h-5 w-5 text-white/95" />
      </div>
    </button>
  );
}
