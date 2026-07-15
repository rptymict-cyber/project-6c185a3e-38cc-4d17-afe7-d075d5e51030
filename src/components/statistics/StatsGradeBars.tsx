import type { GradeRow } from "@/lib/mock/statistics-mock";

export function StatsGradeBars({ rows }: { rows: GradeRow[] }) {
  const max = Math.max(...rows.map((r) => r.price), 1);
  return (
    <div className="rounded-[12px] border border-[#E9ECEF] bg-white p-3">
      <h4 className="text-[13px] font-bold text-foreground">등급별 평균가</h4>
      <ul className="mt-3 space-y-2.5">
        {rows.map((r) => {
          const w = Math.max(6, Math.round((r.price / max) * 100));
          return (
            <li key={r.grade} className="flex items-center gap-2">
              <span className="w-8 shrink-0 text-[12px] font-bold text-[#495057]">{r.grade}</span>
              <div className="relative flex-1">
                <div className="h-6 w-full overflow-hidden rounded-[6px] bg-[#F1F3F5]">
                  <div
                    className="h-full rounded-[6px] bg-[#3A8A3A]"
                    style={{ width: `${w}%` }}
                  />
                </div>
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[11px] font-bold text-white mix-blend-plus-lighter">
                  {r.price.toLocaleString()}원/kg
                </span>
              </div>
              <span className="w-12 shrink-0 text-right text-[11.5px] font-semibold tabular-nums text-[#6C757D]">
                {r.share}%
              </span>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-[10.5px] leading-snug text-[#868E96]">
        등급이 높을수록 단가가 높습니다. 실시간 경매 데이터의 등급 제공 여부는 확인이 필요합니다.
      </p>
    </div>
  );
}
