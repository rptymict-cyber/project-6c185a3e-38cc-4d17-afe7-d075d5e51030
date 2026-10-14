import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { MapPin, ChevronRight, ChevronDown, Umbrella, Thermometer, Droplets, TriangleAlert } from "lucide-react";
import { useLocation } from "@/store/location";
import {
  MOCK_WEATHER,
  DEFAULT_REGION_WEATHER,
  getWeatherForRegion,
} from "@/lib/mock/weather";
import { WeatherIllustration } from "@/components/weather/WeatherIllustration";
import { WeatherRegionSheet } from "@/components/weather/WeatherRegionSheet";
import { useWeatherRegion } from "@/store/weatherRegion";

// 틸다 날씨 API 교체 대상
const fmtKST = () => {
  const p = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    month: "numeric",
    day: "numeric",
    weekday: "short",
  }).formatToParts(new Date());
  const g = (t: string) => p.find((x) => x.type === t)?.value ?? "";
  return `${g("month")}월 ${g("day")}일 (${g("weekday")})`;
};

export function HomeWeatherBar() {
  const navigate = useNavigate();
  const granted = useLocation((s) => s.granted);
  const request = useLocation((s) => s.request);
  const pending = useLocation((s) => s.pending);
  const regionId = useWeatherRegion((s) => s.regionId);
  const [regionOpen, setRegionOpen] = useState(false);
  const [todayLabel, setTodayLabel] = useState(fmtKST);
  // 자정이 지나거나 화면이 다시 보일 때 날짜 갱신
  useEffect(() => {
    const refresh = () => setTodayLabel(fmtKST());
    refresh();
    document.addEventListener("visibilitychange", refresh);
    return () => document.removeEventListener("visibilitychange", refresh);
  }, []);

  // 사용자가 지역을 직접 선택했으면 그 지역, 아니면 권한 여부에 따라 결정
  const isFallback = regionId === null && granted !== true;
  const w = regionId
    ? getWeatherForRegion(regionId)
    : granted === true
      ? MOCK_WEATHER
      : DEFAULT_REGION_WEATHER;

  const fb = w.forecastBadges;
  const badges: { text: string; Icon: typeof Thermometer; warn?: boolean }[] = [];
  if (fb) {
    if (typeof fb.horizonDays === "number")
      badges.push({ text: `향후 ${fb.horizonDays}일 기상 반영 중`, Icon: Thermometer });
    if (fb.rain) {
      const n = fb.rain.daysAhead;
      badges.push({ text: n === 0 ? "오늘 강수 예보" : n === 1 ? "내일 강수 예보" : `${n}일 후 강수 예보`, Icon: Droplets });
    }
    if (fb.shipImpact === "caution") badges.push({ text: "출하 영향 주의", Icon: TriangleAlert, warn: true });
  }

  return (
    <>
    <button
      type="button"
      onClick={() => navigate({ to: "/weather" })}
      aria-label={`${w.region} 날씨 상세 보기`}
      className="group relative flex w-full flex-col overflow-hidden rounded-[20px] text-left text-white shadow-[0_6px_16px_rgba(2,82,153,0.16)] transition-transform duration-150 ease-out active:scale-[0.99]"
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
      <div className="flex w-full items-stretch">
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-1">
        {/* 위치 */}
        <div className="flex items-center">
          <span
            className="flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-white/30 bg-white/[0.14] px-3 text-white"
            style={{ fontSize: 15, fontWeight: 600, lineHeight: "22px", minWidth: 118 }}
            suppressHydrationWarning
          >
            <CalendarDays className="h-4 w-4 shrink-0" />
            {todayLabel}
          </span>
        </div>
        <div className="absolute right-4 top-3.5 z-10 flex items-center">
          <span
            role="button"
            tabIndex={0}
            aria-label="지역 변경"
            onClick={(e) => {
              e.stopPropagation();
              setRegionOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.stopPropagation();
                setRegionOpen(true);
              }
            }}
            className="relative flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-white/30 bg-white/[0.14] pl-3 pr-2.5 text-white transition-colors duration-150 active:bg-white/[0.24] after:absolute after:-inset-1 after:content-['']"
            style={{ fontSize: 16, fontWeight: 600, lineHeight: "22px" }}
          >
            <MapPin className="h-4 w-4 shrink-0" />
            {w.region}
            <ChevronDown className="h-4 w-4" />
          </span>
        </div>

        {/* 기온 + 상태 */}
        <div className="my-auto flex items-center gap-2">
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
        {!isFallback && w.tip ? (
          <div
            className="flex items-center gap-1 text-white/95"
            style={{ fontSize: 14, fontWeight: 600, lineHeight: "20px" }}
          >
            <Umbrella className="h-3.5 w-3.5 shrink-0" />
            <span>{w.tip}</span>
          </div>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-1 pl-2 pt-9">
        <WeatherIllustration size={82} className="max-w-[88px]" />
        <span
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/[0.14] transition-colors duration-150 group-active:bg-white/[0.24]"
        >
          <ChevronRight className="h-5 w-5 text-white" />
        </span>
      </div>
      </div>
      {badges.length > 0 ? (
        <div
          className="no-scrollbar mt-2.5 flex w-full gap-1.5 overflow-x-auto whitespace-nowrap"
          style={{
            maskImage: "linear-gradient(90deg,#000 85%,transparent)",
            WebkitMaskImage: "linear-gradient(90deg,#000 85%,transparent)",
          }}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {badges.map((b) => (
            <span
              key={b.text}
              className="inline-flex h-[26px] shrink-0 items-center gap-1 rounded-full px-2.5 font-bold"
              style={{
                fontSize: 12,
                background: b.warn ? "rgba(255,214,102,0.24)" : "rgba(255,255,255,0.16)",
                border: `1px solid ${b.warn ? "rgba(255,214,102,0.5)" : "rgba(255,255,255,0.22)"}`,
                color: b.warn ? "#FFE49A" : "#FFFFFF",
              }}
            >
              <b.Icon className="h-3 w-3 shrink-0" />
              {b.text}
            </span>
          ))}
        </div>
      ) : null}
    </button>
    <WeatherRegionSheet open={regionOpen} onOpenChange={setRegionOpen} />
    </>
  );
}
