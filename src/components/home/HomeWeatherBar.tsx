import { useNavigate } from "@tanstack/react-router";

interface HomeWeatherBarProps {
  regionLabel: string;
  icon: string;
  temp: number;
  desc: string;
  tip?: string;
}

export function HomeWeatherBar({
  regionLabel,
  icon,
  temp,
  desc,
  tip,
}: HomeWeatherBarProps) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigate({ to: "/prediction" })}
      className="flex w-full items-center gap-2 rounded-[12px] border border-[#DBEAF6] bg-gradient-to-r from-[#EAF3FB] to-[#F1F7FC] px-3 py-2.5 text-left"
      aria-label={`${regionLabel} 날씨 ${temp}도 ${desc}`}
    >
      <span className="text-[19px] leading-none">{icon}</span>
      <span className="text-[11px] font-semibold text-[#868E96]">
        {regionLabel}
      </span>
      <span className="text-[14px] font-extrabold tabular-nums text-[#111827]">
        {temp}°
      </span>
      <span className="text-[11px] text-[#495057]">{desc}</span>
      <span className="flex-1" />
      {tip ? (
        <span className="whitespace-nowrap rounded-lg bg-[#3B82C4]/10 px-1.5 py-0.5 text-[10.5px] font-bold text-[#3B82C4]">
          {tip}
        </span>
      ) : null}
      <span className="text-[14px] text-[#ADB5BD]">›</span>
    </button>
  );
}
