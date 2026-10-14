import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, ChevronDown, Droplets, Info, MapPin, Sun, Umbrella, Wind } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { WeatherIllustration } from "@/components/weather/WeatherIllustration";
import {
  MOCK_WEATHER,
  DEFAULT_REGION_WEATHER,
  getWeatherForRegion,
  getAlertLabel,
  getWeatherImpactStyle,
} from "@/lib/mock/weather";
import { WeatherRegionSheet } from "@/components/weather/WeatherRegionSheet";
import { useWeatherRegion } from "@/store/weatherRegion";
import { useLocation } from "@/store/location";
import { cn } from "@/lib/utils";
import { useBackTo } from "@/hooks/useBackTo";
import { DetailHeader } from "@/components/detail-header";

export const Route = createFileRoute("/weather")({
  head: () => ({
    meta: [
      { title: "날씨 상세 — AGDICT" },
      {
        name: "description",
        content:
          "현재 위치 기반의 실시간 날씨, 시간대별 예보와 주간 예보를 확인하고 농작업 계획에 활용하세요.",
      },
      { property: "og:title", content: "날씨 상세 — AGDICT" },
      {
        property: "og:description",
        content:
          "현재 위치 기반의 실시간 날씨, 시간대별 예보와 주간 예보를 확인하고 농작업 계획에 활용하세요.",
      },
    ],
  }),
  component: WeatherDetailPage,
});

function WeatherDetailPage() {
  const goBack = useBackTo("/");
  const regionId = useWeatherRegion((s) => s.regionId);
  const granted = useLocation((s) => s.granted);
  const [regionOpen, setRegionOpen] = useState(false);
  const w = regionId
    ? getWeatherForRegion(regionId)
    : granted === true
      ? MOCK_WEATHER
      : DEFAULT_REGION_WEATHER;
  const rainN = w.forecastBadges?.rain?.daysAhead;
  const rainIdx = typeof rainN === "number" && rainN >= 1 && rainN <= 3 ? rainN : -1;
  const firstRain = w.daily.find((d) => d.condition.includes("비"));
  const advisoryText = firstRain
    ? `${firstRain.date}에 비가 예보되어 있어요. 야외 작업 일정을 확인하세요.`
    : "향후 10일간 큰 비 소식은 없어요.";
  const alertStyle = w.alert ? getWeatherImpactStyle(w.alert.level === "warning" ? "high" : "warn") : null;
  const fmtIssued = (iso: string) => {
    const m = /^\d{4}-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(iso);
    return m ? `${Number(m[1])}/${Number(m[2])} ${m[3]}:${m[4]} 발효` : "";
  };

  return (
    <AppShell screenId="WTR-001_날씨상세"
      header={<DetailHeader title="날씨 상세" onBack={goBack} />}

    >
      <div className="bg-[#F8FAFC] pb-6">
        {/* Hero */}
        <section className="px-4 pt-3">
          <div
            className="relative overflow-hidden rounded-[24px] p-5 text-white shadow-[0_8px_24px_rgba(15,23,42,0.08),0_2px_6px_rgba(15,23,42,0.04)]"
            style={{
              background:
                "linear-gradient(135deg, #0D75C7 0%, #0A65B2 55%, #07579C 100%)",
              minHeight: 220,
            }}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 truncate text-body text-white/85">{w.today.dateLabel}</div>
                  <button
                    type="button"
                    aria-label="지역 변경"
                    onClick={() => setRegionOpen(true)}
                    className="relative flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-white/30 bg-white/[0.14] pl-3 pr-2.5 text-white transition-colors duration-150 active:bg-white/[0.24] after:absolute after:-inset-1 after:content-['']"
                    style={{ fontSize: 16, fontWeight: 600, lineHeight: "22px" }}
                  >
                    <MapPin className="h-4 w-4 shrink-0" />
                    {w.region}
                    <ChevronDown className="h-4 w-4" />
                  </button>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-baseline">
                  <span className="text-[64px] font-bold leading-none tracking-tight">
                    {w.current.temp}
                  </span>
                  <span className="ml-1 text-display font-semibold">°C</span>
                </div>
              </div>
              <div className="shrink-0">
                <WeatherIllustration size={130} />
              </div>
            </div>
            <div className="mt-1 flex items-center justify-between gap-3">
              <div className="min-w-0 truncate text-heading font-semibold text-white">
                {w.current.desc}
              </div>
              <div className="flex shrink-0 items-center gap-3 text-body font-semibold text-white/95">
                <span>
                  최고 <span className="text-white">{w.today.high}°</span>
                </span>
                <span>
                  최저 <span className="text-white">{w.today.low}°</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 기상 특보 안내 */}
        {w.alert && alertStyle ? (
          <section className="px-4 pt-3">
            <div
              className="flex items-center gap-3 rounded-[16px] border px-4 py-3"
              style={{ background: alertStyle.badgeBg, borderColor: alertStyle.badgeBorder, color: alertStyle.badgeText }}
            >
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <div className="min-w-0">
                <div className="text-body font-bold">
                  {getAlertLabel(w.alert)}
                  {(w.alert.count ?? 1) >= 2 ? ` 외 ${(w.alert.count ?? 1) - 1}건` : ""}
                </div>
                <div className="text-meta font-medium opacity-90">
                  {w.alert.region} · {fmtIssued(w.alert.issuedAt)}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {/* Metrics */}
        <section className="px-4 pt-3">
          <div className="grid grid-cols-4 divide-x divide-[#EEF1F5] rounded-[16px] border border-[#EEF1F5] bg-white py-3">
            <Metric
              icon={<Umbrella className="h-5 w-5 text-[#2878E8]" />}
              label="강수확률"
              value={`${w.metrics.pop}%`}
            />
            <Metric
              icon={<Droplets className="h-5 w-5 text-[#2878E8]" />}
              label="습도"
              value={`${w.metrics.humidity}%`}
            />
            <Metric
              icon={<Wind className="h-5 w-5 text-[#6C7A89]" />}
              label="풍속"
              value={`${w.metrics.windMs}m/s`}
            />
            <Metric
              icon={<Sun className="h-5 w-5 text-[#F4A017]" />}
              label="자외선"
              value={w.metrics.uvLabel}
              valueClass="text-[#2878E8]"
            />
          </div>
        </section>

        {/* Hourly */}
        <section className="pt-5">
          <h2 className="px-4 text-title font-bold text-[#111827]">
            시간대별 예보
          </h2>
          <div className="mt-2 overflow-x-auto no-scrollbar">
            <div className="flex gap-2.5 px-4 pb-1">
              {w.hourly.map((h) => (
                <div
                  key={h.time}
                  className="flex w-[84px] shrink-0 flex-col items-center gap-1.5 rounded-[16px] border border-[#EEF1F5] bg-white py-3"
                >
                  <div className="text-body font-semibold text-[#4B5563]">
                    {h.time}
                  </div>
                  <div className="text-display leading-none">{h.icon}</div>
                  <div className="text-title font-bold tabular-nums text-[#111827]">
                    {h.temp}°
                  </div>
                  <div className="flex items-center gap-0.5 text-meta font-semibold text-[#2878E8]">
                    <Droplets className="h-3 w-3" />
                    {h.pop}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Weekly */}
        <section className="px-4 pt-5">
          <h2 className="text-title font-bold text-[#111827]">10일 예보</h2>
          <ul className="mt-2 divide-y divide-[#F1F3F5] rounded-[16px] border border-[#EEF1F5] bg-white">
            {w.daily.map((d, i) => (
              <li
                key={d.date}
                style={d.pop >= 60 ? { background: "#F3F8FF" } : undefined}
                className="first:rounded-t-[16px] last:rounded-b-[16px] grid grid-cols-[auto_auto_24px_minmax(0,1fr)_auto_auto] items-center gap-1.5 px-3 py-3"
              >
                <span
                  className={cn(
                    "text-body font-bold",
                    d.tone === "today" && "text-[#46933F]",
                    d.tone === "sat" && "text-[#2878E8]",
                    d.tone === "sun" && "text-[#E43D3D]",
                    !d.tone && "text-[#111827]",
                  )}
                >
                  {d.dayLabel}
                </span>
                <span className="text-caption text-[#6B7280]">{d.date}</span>
                <span className="text-heading leading-none">{d.icon}</span>
                <span className="flex min-w-0 items-center gap-1 text-body text-[#374151]">
                  <span className="truncate">{d.condition ?? "-"}</span>
                  {i === rainIdx ? (
                    <span className="shrink-0 rounded-full bg-[#E6F0FD] px-1.5 py-0.5 text-caption font-bold text-[#2878E8]">
                      강수 예보
                    </span>
                  ) : null}
                </span>
                <span className="flex items-center justify-end gap-0.5 text-caption font-semibold text-[#2878E8]">
                  <Umbrella className="h-3 w-3" />
                  {d.pop}%
                </span>
                <span className="flex items-center justify-end gap-1 text-body font-bold tabular-nums">
                  <span className="text-[#2878E8]">{d.min}°</span>
                  <span className="text-[#C4C9D0]">/</span>
                  <span className="text-[#E43D3D]">{d.max}°</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Advisory */}
        {advisoryText ? (
          <section className="px-4 pt-4">
            <div className="flex items-start gap-2 rounded-[14px] bg-[#EAF3FB] px-3 py-3">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#2878E8]" />
              <p className="text-body leading-relaxed text-[#1F3B5B]">
                {advisoryText}
              </p>
            </div>
          </section>
        ) : null}
      </div>
      <WeatherRegionSheet open={regionOpen} onOpenChange={setRegionOpen} />
    </AppShell>
  );
}

function Metric({
  icon,
  label,
  value,
  valueClass,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 px-1">
      <div>{icon}</div>
      <div className="text-meta font-medium text-[#6B7280]">{label}</div>
      <div className={cn("text-body font-bold text-[#111827]", valueClass)}>
        {value}
      </div>
    </div>
  );
}
