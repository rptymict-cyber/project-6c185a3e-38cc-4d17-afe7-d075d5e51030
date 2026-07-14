import { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { RegionStats } from "@/lib/services/region-stats";
import { shortName } from "@/lib/services/region-stats";
import sidoMap from "@/assets/korea-sido.json";

/**
 * 실제 시·도 경계 SVG. paths/labels는 src/assets/korea-sido.json 자산에서
 * 그대로 사용하고, 이 컴포넌트에서 좌표를 생성하지 않는다.
 */
type SidoMap = {
  viewBox: string;
  paths: Record<string, string>;
  labels: Record<string, [number, number]>;
  labelOffset?: Record<string, [number, number]>;
  shortName?: Record<string, string>;
};

const MAP = sidoMap as SidoMap;

/** 데이터 지역명 → JSON 지역 키. 강원특별자치도 등 신 명칭 매핑. */
const DATA_TO_MAP_KEY: Record<string, string> = {
  강원특별자치도: "강원도",
  전북특별자치도: "전라북도",
};
function toMapKey(region: string): string {
  return DATA_TO_MAP_KEY[region] ?? region;
}

type Props = {
  regions: RegionStats[];
  selected: string | null;
  onSelect: (region: string | null) => void;
};

const NO_DATA_FILL = "#F1F3F5";
const NO_DATA_STROKE = "#DEE2E6";
const DATA_FILL = "#8CE99A";
const DATA_STROKE = "#3A8A3A";
const SELECTED_FILL = "#2F7A2F";
const SELECTED_STROKE = "#1F5C1F";

export function KoreaRegionMap({ regions, selected, onSelect }: Props) {
  const byRegion = useMemo(() => {
    const m = new Map<string, RegionStats>();
    for (const r of regions) m.set(toMapKey(r.region), r);
    return m;
  }, [regions]);

  const allKeys = Object.keys(MAP.paths);
  const selectedKey = selected ? toMapKey(selected) : null;
  const selectedStats = selected ? regions.find((r) => r.region === selected) ?? null : null;

  // Render order: no-data first, data next, selected last (on top).
  const ordered = [...allKeys].sort((a, b) => {
    const aHas = byRegion.has(a) ? 1 : 0;
    const bHas = byRegion.has(b) ? 1 : 0;
    if (aHas !== bHas) return aHas - bHas;
    if (a === selectedKey) return 1;
    if (b === selectedKey) return -1;
    return 0;
  });

  return (
    <div className="relative">
      <svg
        viewBox={MAP.viewBox}
        className="w-full h-auto"
        role="group"
        aria-label="대한민국 시·도 지도"
      >
        {/* Region shapes */}
        {ordered.map((key) => {
          const stats = byRegion.get(key);
          const isSelected = key === selectedKey;
          const hasData = !!stats;
          const fill = isSelected ? SELECTED_FILL : hasData ? DATA_FILL : NO_DATA_FILL;
          const stroke = isSelected ? SELECTED_STROKE : hasData ? DATA_STROKE : NO_DATA_STROKE;
          const displayName = stats?.region ?? key;
          return (
            <path
              key={key}
              d={MAP.paths[key]}
              fill={fill}
              stroke={stroke}
              strokeWidth={isSelected ? 1.5 : 0.7}
              strokeLinejoin="round"
              onClick={() => {
                if (hasData) onSelect(isSelected ? null : displayName);
              }}
              style={{ cursor: hasData ? "pointer" : "default" }}
              aria-label={
                hasData
                  ? `${displayName} 평균가 ${stats!.avgKg.toLocaleString()}원${isSelected ? " 선택됨" : ""}`
                  : `${key} 데이터 없음`
              }
              role={hasData ? "button" : undefined}
            />
          );
        })}

        {/* Labels only for regions with data */}
        {allKeys.map((key) => {
          const stats = byRegion.get(key);
          if (!stats) return null;
          const [lx, ly] = MAP.labels[key] ?? [0, 0];
          const [ox, oy] = MAP.labelOffset?.[key] ?? [0, 0];
          const isSelected = key === selectedKey;
          const label = MAP.shortName?.[key] ?? shortName(stats.region);
          const cx = lx + ox;
          const cy = ly + oy;
          return (
            <g key={`lbl-${key}`} pointerEvents="none">
              {/* Small pin dot at centroid so the pill can sit off-shape for tiny metros */}
              <circle
                cx={lx}
                cy={ly}
                r={isSelected ? 3 : 2.2}
                fill={isSelected ? SELECTED_STROKE : DATA_STROKE}
              />
              {/* Value pill */}
              <g transform={`translate(${cx},${cy})`}>
                <rect
                  x={-26}
                  y={-11}
                  width={52}
                  height={22}
                  rx={6}
                  fill="white"
                  stroke={isSelected ? SELECTED_STROKE : DATA_STROKE}
                  strokeWidth={isSelected ? 1.5 : 0.8}
                />
                <text
                  x={0}
                  y={-1}
                  textAnchor="middle"
                  fontSize={9}
                  fontWeight={700}
                  fill="#495057"
                >
                  {label}
                </text>
                <text
                  x={0}
                  y={9}
                  textAnchor="middle"
                  fontSize={9}
                  fontWeight={800}
                  fill={isSelected ? SELECTED_STROKE : "#1F3D1F"}
                >
                  {stats.avgKg.toLocaleString()}원
                </text>
              </g>
            </g>
          );
        })}

        {/* Market pins around selected region centroid (no market coords available) */}
        {selectedStats &&
          (() => {
            const key = toMapKey(selectedStats.region);
            const [lx, ly] = MAP.labels[key] ?? [0, 0];
            const markets = selectedStats.markets;
            return markets.map((m, i) => {
              const angle = (i / Math.max(markets.length, 1)) * Math.PI * 2 - Math.PI / 2;
              const r = 22;
              const mx = lx + Math.cos(angle) * r;
              const my = ly + Math.sin(angle) * r;
              return (
                <g key={m.id} pointerEvents="none">
                  <circle cx={mx} cy={my} r={3.5} fill="white" stroke={SELECTED_STROKE} strokeWidth={1.2} />
                  <circle cx={mx} cy={my} r={1.6} fill={SELECTED_STROKE} />
                </g>
              );
            });
          })()}
      </svg>

      <p
        className={cn(
          "mt-2 px-4 text-[11.5px]",
          selected ? "text-[#3A8A3A]" : "text-[#868E96]",
        )}
      >
        {selected
          ? `${selected} 선택됨 · 지역을 다시 눌러 해제`
          : "채색된 지역을 눌러 도매시장별 통계를 확인하세요"}
      </p>
    </div>
  );
}
