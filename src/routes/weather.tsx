import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ChevronLeft, Droplets, Info, MapPin, Sun, Umbrella, Wind } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { WeatherIllustration } from "@/components/weather/WeatherIllustration";
import { MOCK_WEATHER } from "@/lib/mock/weather";
import { cn } from "@/lib/utils";

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
  const router = useRouter();
  const w = MOCK_WEATHER;

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.history.back();
    } else {
      router.navigate({ to: "/" });
    }
  };

  return (
    <AppShell
      header={
        <header className="sticky top-0 z-30 flex h-[52px] items-center justify-between border-b border-[#E9ECEF] bg-background px-2">
          <button
            type="button"
            onClick={goBack}
            aria-label="뒤로가기"
            className="grid h-10 w-10 place-items-center rounded-full text-foreground hover:bg-secondary"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div className="pointer-events-none absolute inset-x-0 top-0 flex h-[52px] items-center justify-center">
            <span className="text-[15px] font-black tracking-tight text-foreground">
              날씨 상세
            </span>
          </div>
          <div className="w-10" />
        </header>
      }
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
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-1 text-[13px] font-semibold text-white/95">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{w.region}</span>
                </div>
                <div className="mt-1.5 flex items-baseline">
                  <span className="text-[64px] font-bold leading-none tracking-tight">
                    {w.current.temp}
                  </span>
                  <span className="ml-1 text-[24px] font-semibold">°C</span>
                </div>
                <div className="mt-2 text-[20px] font-semibold text-white">
                  {w.current.desc}
                </div>
                {w.tip ? (
                  <div className="mt-1.5 text-[14px] font-medium text-white/90">
                    {w.tip}
                  </div>
                ) : null}
                <div className="mt-2 text-[13px] text-white/85">
                  {w.today.dateLabel}
                </div>
                <div className="mt-3 flex items-center gap-4 text-[14px] font-semibold text-white/95">
                  <span>
                    최고 <span className="text-white">{w.today.high}°</span>
                  </span>
                  <span>
                    최저 <span className="text-white">{w.today.low}°</span>
                  </span>
                </div>
              </div>
              <div className="shrink-0">
                <WeatherIllustration size={130} />
              </div>
            </div>
          </div>
        </section>

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
          <h2 className="px-4 text-[17px] font-bold text-[#111827]">
            시간대별 예보
          </h2>
          <div className="mt-2 overflow-x-auto no-scrollbar">
            <div className="flex gap-2.5 px-4 pb-1">
              {w.hourly.map((h) => (
                <div
                  key={h.time}
                  className="flex w-[84px] shrink-0 flex-col items-center gap-1.5 rounded-[16px] border border-[#EEF1F5] bg-white py-3"
                >
                  <div className="text-[13px] font-semibold text-[#4B5563]">
                    {h.time}
                  </div>
                  <div className="text-[26px] leading-none">{h.icon}</div>
                  <div className="text-[17px] font-bold tabular-nums text-[#111827]">
                    {h.temp}°
                  </div>
                  <div className="flex items-center gap-0.5 text-[11.5px] font-semibold text-[#2878E8]">
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
          <h2 className="text-[17px] font-bold text-[#111827]">주간 예보</h2>
          <ul className="mt-2 divide-y divide-[#F1F3F5] rounded-[16px] border border-[#EEF1F5] bg-white">
            {w.daily.map((d) => (
              <li
                key={d.date}
                className="grid grid-cols-[70px_60px_28px_1fr_64px_84px] items-center gap-2 px-3 py-3"
              >
                <span
                  className={cn(
                    "text-[14px] font-bold",
                    d.tone === "today" && "text-[#46933F]",
                    d.tone === "sat" && "text-[#2878E8]",
                    d.tone === "sun" && "text-[#E43D3D]",
                    !d.tone && "text-[#111827]",
                  )}
                >
                  {d.dayLabel}
                </span>
                <span className="text-[12.5px] text-[#6B7280]">{d.date}</span>
                <span className="text-[20px] leading-none">{d.icon}</span>
                <span className="truncate text-[13.5px] text-[#374151]">
                  {d.condition}
                </span>
                <span className="flex items-center justify-end gap-0.5 text-[12.5px] font-semibold text-[#2878E8]">
                  <Umbrella className="h-3 w-3" />
                  {d.pop}%
                </span>
                <span className="flex items-center justify-end gap-1 text-[13.5px] font-bold tabular-nums">
                  <span className="text-[#2878E8]">{d.min}°</span>
                  <span className="text-[#C4C9D0]">/</span>
                  <span className="text-[#E43D3D]">{d.max}°</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Advisory */}
        {w.advisory ? (
          <section className="px-4 pt-4">
            <div className="flex items-start gap-2 rounded-[14px] bg-[#EAF3FB] px-3 py-3">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#2878E8]" />
              <p className="text-[13px] leading-relaxed text-[#1F3B5B]">
                {w.advisory}
              </p>
            </div>
          </section>
        ) : null}
      </div>
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
      <div className="text-[11.5px] font-medium text-[#6B7280]">{label}</div>
      <div className={cn("text-[14px] font-bold text-[#111827]", valueClass)}>
        {value}
      </div>
    </div>
  );
}
