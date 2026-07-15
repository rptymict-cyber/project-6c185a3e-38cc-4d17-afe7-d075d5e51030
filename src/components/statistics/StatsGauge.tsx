import { useState } from "react";
import type { GaugeDatum } from "@/lib/mock/statistics-mock";
import { cn } from "@/lib/utils";

/**
 * 반원 게이지. 값이 없으면 "—" 표시. 탭 시 상세 문장 토글.
 */
export function StatsGauge({
  label,
  data,
  detailBaseLabel,
}: {
  label: string;
  data: GaugeDatum;
  /** 상세 문장 앞에 붙일 기준 라벨. 예: "직전 순 평균가" / "전년 동순 평균가" / "평년 동순 평균가" */
  detailBaseLabel: string;
}) {
  const [open, setOpen] = useState(false);

  const has = data != null && data.base > 0;
  const pct = has ? data!.pct : 0;
  const dir = !has || data!.delta === 0 ? 0 : data!.delta > 0 ? 1 : -1;
  const color = dir > 0 ? "#E03131" : dir < 0 ? "#1971C2" : "#868E96";

  // 반원 progress: |pct| / 50 을 0..1로 클램프
  const ratio = Math.max(0, Math.min(1, Math.abs(pct) / 50));

  // SVG geometry
  const W = 96;
  const H = 56;
  const cx = W / 2;
  const cy = H - 8;
  const r = 40;
  const startAngle = Math.PI;
  const endAngle = 0;
  const currentAngle = startAngle + (endAngle - startAngle) * ratio;

  const pt = (a: number) => `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  const bgPath = `M ${pt(startAngle)} A ${r} ${r} 0 0 1 ${pt(endAngle)}`;
  const fgPath = `M ${pt(startAngle)} A ${r} ${r} 0 0 1 ${pt(currentAngle)}`;

  return (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      className={cn(
        "flex w-full flex-col items-center rounded-[12px] border border-[#E9ECEF] bg-white px-2 py-3 text-center active:bg-[#F8F9FA]",
        open && "ring-1 ring-[#3A8A3A]/30",
      )}
    >
      <div className="relative">
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden>
          <path d={bgPath} stroke="#F1F3F5" strokeWidth={8} fill="none" strokeLinecap="round" />
          {has && (
            <path d={fgPath} stroke={color} strokeWidth={8} fill="none" strokeLinecap="round" />
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-0">
          <span
            className="text-[13px] font-black tabular-nums leading-none"
            style={{ color: has ? color : "#868E96" }}
          >
            {has ? (dir > 0 ? "▲" : dir < 0 ? "▼" : "—") : "—"}{" "}
            {has ? `${Math.abs(pct)}%` : ""}
          </span>
        </div>
      </div>
      <div className="mt-1 text-[11.5px] font-semibold text-[#495057]">{label}</div>
      {has && (
        <div className="mt-0.5 text-[10.5px] tabular-nums" style={{ color }}>
          {data!.delta > 0 ? "+" : ""}
          {data!.delta.toLocaleString()}원
        </div>
      )}
      {open && (
        <div className="mt-1.5 w-full rounded-[8px] bg-[#F8F9FA] px-2 py-1.5 text-[10.5px] leading-snug text-[#495057]">
          {has ? (
            <>
              {detailBaseLabel} {data!.base.toLocaleString()}원 대비{" "}
              <span style={{ color }} className="font-bold">
                {Math.abs(data!.delta).toLocaleString()}원({Math.abs(pct)}%){" "}
                {dir > 0 ? "상승" : dir < 0 ? "하락" : "보합"}
              </span>
            </>
          ) : (
            <>데이터 필요 · 백엔드 연동 후 표시됩니다.</>
          )}
        </div>
      )}
    </button>
  );
}
