import { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { RegionStats } from "@/lib/services/region-stats";
import { ALL_REGIONS, shortName } from "@/lib/services/region-stats";

/**
 * 스타일라이즈드 대한민국 시·도 배치 (지리적 SVG 아님).
 * 좌표는 실제 위치에 근사한 UI 메타데이터. 지리 SVG로 언제든 교체 가능하도록
 * ALL_REGIONS ↔ REGION_POS 매핑으로 분리했다.
 * 라이선스: 좌표는 프로젝트 자체 자산(공개 도메인).
 */
const REGION_POS: Record<string, { x: number; y: number }> = {
  서울특별시: { x: 135, y: 105 },
  인천광역시: { x: 100, y: 115 },
  경기도: { x: 140, y: 140 },
  강원특별자치도: { x: 205, y: 105 },
  충청북도: { x: 175, y: 185 },
  충청남도: { x: 115, y: 200 },
  세종특별자치시: { x: 150, y: 200 },
  대전광역시: { x: 160, y: 220 },
  전라북도: { x: 125, y: 250 },
  전라남도: { x: 105, y: 305 },
  광주광역시: { x: 135, y: 295 },
  경상북도: { x: 220, y: 195 },
  대구광역시: { x: 215, y: 235 },
  경상남도: { x: 195, y: 285 },
  울산광역시: { x: 245, y: 270 },
  부산광역시: { x: 230, y: 305 },
  제주특별자치도: { x: 130, y: 375 },
};

type Props = {
  regions: RegionStats[];
  selected: string | null;
  onSelect: (region: string | null) => void;
};

export function KoreaRegionMap({ regions, selected, onSelect }: Props) {
  const byRegion = useMemo(() => {
    const m = new Map<string, RegionStats>();
    for (const r of regions) m.set(r.region, r);
    return m;
  }, [regions]);

  const { min, max } = useMemo(() => {
    const vals = regions.map((r) => r.avgKg);
    return { min: Math.min(...vals), max: Math.max(...vals) };
  }, [regions]);

  const colorFor = (r?: RegionStats): string => {
    if (!r) return "#F1F3F5";
    if (min === max) return "#8CE99A";
    const t = (r.avgKg - min) / (max - min);
    // gradient from #E6F5E6 → #2F7A2F
    const pct = Math.round(t * 5);
    const scale = ["#EAF7EA", "#C7EAC7", "#9FDA9F", "#6FC46F", "#3E9E3E", "#2F7A2F"];
    return scale[pct];
  };

  return (
    <div className="relative">
      <svg
        viewBox="0 0 340 420"
        className="w-full h-auto"
        role="group"
        aria-label="대한민국 시·도 지도"
      >
        {ALL_REGIONS.map((region) => {
          const pos = REGION_POS[region];
          if (!pos) return null;
          const stats = byRegion.get(region);
          const active = selected === region;
          const fill = colorFor(stats);
          const label = shortName(region);
          const hasData = !!stats;
          return (
            <g key={region}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={active ? 26 : 22}
                fill={fill}
                stroke={active ? "#1F5C1F" : hasData ? "#3A8A3A33" : "#DEE2E6"}
                strokeWidth={active ? 3 : 1}
                onClick={() => onSelect(active ? null : region)}
                aria-label={
                  hasData
                    ? `${region} 평균가 ${stats!.avgKg.toLocaleString()}원${active ? " 선택됨" : ""}`
                    : `${region} 데이터 없음`
                }
                role="button"
                tabIndex={0}
                style={{ cursor: "pointer" }}
              />
              <text
                x={pos.x}
                y={pos.y - 2}
                textAnchor="middle"
                fontSize={11}
                fontWeight={700}
                fill={hasData ? "#1F3D1F" : "#ADB5BD"}
                pointerEvents="none"
              >
                {label}
              </text>
              {hasData && (
                <text
                  x={pos.x}
                  y={pos.y + 11}
                  textAnchor="middle"
                  fontSize={10}
                  fontWeight={700}
                  fill="#1F3D1F"
                  pointerEvents="none"
                >
                  {stats!.avgKg.toLocaleString()}원
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="mt-3 flex items-center justify-between px-4 text-[11px] text-[#6C757D]">
        <span>낮은 평균가</span>
        <div className="flex h-3 flex-1 mx-2 rounded overflow-hidden">
          {["#EAF7EA", "#C7EAC7", "#9FDA9F", "#6FC46F", "#3E9E3E", "#2F7A2F"].map((c) => (
            <div key={c} className="flex-1" style={{ background: c }} />
          ))}
        </div>
        <span>높은 평균가</span>
      </div>

      <p
        className={cn(
          "mt-2 px-4 text-[11.5px]",
          selected ? "text-[#3A8A3A]" : "text-[#868E96]",
        )}
      >
        {selected
          ? `${selected} 선택됨 · 지역을 다시 눌러 해제`
          : "지역을 누르면 도매시장별 통계를 확인할 수 있어요"}
      </p>
    </div>
  );
}
