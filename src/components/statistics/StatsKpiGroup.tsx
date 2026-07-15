import type { Kpi } from "@/lib/mock/statistics-mock";

/**
 * 비교 KPI 그룹 카드. 3칸을 하나의 카드로 묶고 얇은 세로 구분선으로 나눔.
 * 개별 카드 테두리 없음. 배경 --group-bg(#F1F3F5). 터치 상호작용 없음.
 */
export function StatsKpiGroup({ kpis }: { kpis: Kpi[] }) {
  return (
    <div className="grid grid-cols-3 divide-x divide-[#E1E5EA] overflow-hidden rounded-[14px] bg-[#F1F3F5]">
      {kpis.map((k, i) => (
        <KpiCell key={i} kpi={k} />
      ))}
    </div>
  );
}

function KpiCell({ kpi }: { kpi: Kpi }) {
  const has = kpi.delta != null && kpi.pct != null;
  const dir = !has ? 0 : kpi.delta! > 0 ? 1 : kpi.delta! < 0 ? -1 : 0;

  const textColor = dir > 0 ? "#E03131" : dir < 0 ? "#1971C2" : "#868E96";
  const badgeBg = dir > 0 ? "#FEECEC" : dir < 0 ? "#EAF2FD" : "#E9ECEF";
  const arrow = dir > 0 ? "▲" : dir < 0 ? "▼" : "—";

  const fmtPct = (p: number) => {
    const abs = Math.abs(p);
    return abs % 1 === 0 ? `${abs.toFixed(0)}%` : `${abs.toFixed(1)}%`;
  };
  const pctText = has ? `${arrow}${fmtPct(kpi.pct!)}` : "—";
  const amountText = has
    ? `${kpi.delta! > 0 ? "+" : kpi.delta! < 0 ? "−" : ""}${Math.abs(kpi.delta!).toLocaleString()}원`
    : "—";

  return (
    <div className="flex flex-col items-center justify-center px-2 py-3 text-center">
      <span className="text-[11px] font-semibold text-[#868E96]">{kpi.label}</span>
      <span
        className="mt-1 text-[18px] font-black leading-tight tabular-nums"
        style={{ color: textColor }}
      >
        {amountText}
      </span>
      <span
        className="mt-1.5 inline-flex items-center rounded-[7px] px-2 py-0.5 text-[11px] font-extrabold"
        style={{ backgroundColor: badgeBg, color: textColor }}
      >
        {pctText}
      </span>
    </div>
  );
}
