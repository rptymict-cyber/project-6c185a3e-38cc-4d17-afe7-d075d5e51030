import { useNavigate } from "@tanstack/react-router";
import { useLocation } from "@/store/location";
import { MOCK_WEATHER } from "@/lib/mock/weather";

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
        className="flex w-full items-center gap-2 rounded-[12px] border border-dashed border-[#E9ECEF] bg-[#FAFAFA] px-3 py-2.5 text-left"
      >
        <span className="text-[16px] leading-none">📍</span>
        <span className="flex-1 text-[12px] text-[#6C757D]">
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
      onClick={() => navigate({ to: "/prediction" })}
      className="flex w-full items-center gap-2 rounded-[12px] border border-[#DBEAF6] bg-gradient-to-r from-[#EAF3FB] to-[#F1F7FC] px-3 py-2.5 text-left"
      aria-label={`${w.region} 날씨 ${w.current.temp}도 ${w.current.desc}`}
    >
      <span className="text-[19px] leading-none">{w.current.icon}</span>
      <span className="text-[11px] font-semibold text-[#868E96]">
        {w.region}
      </span>
      <span className="text-[14px] font-extrabold tabular-nums text-[#111827]">
        {w.current.temp}°
      </span>
      <span className="text-[11px] text-[#495057]">{w.current.desc}</span>
      <span className="flex-1" />
      {w.tip ? (
        <span className="whitespace-nowrap rounded-lg bg-[#3B82C4]/10 px-1.5 py-0.5 text-[10.5px] font-bold text-[#3B82C4]">
          {w.tip}
        </span>
      ) : null}
      <span className="text-[13px] text-[#ADB5BD]">›</span>
    </button>
  );
}
