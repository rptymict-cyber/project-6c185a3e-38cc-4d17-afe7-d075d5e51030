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

const MAP = sidoMap as unknown as SidoMap;

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

const NO_DATA_FILL = "#EBEEF0";
const NO_DATA_STROKE = "#DEE2E6";
const DATA_STROKE = "#3A8A3A";
const SELECTED_STROKE = "#1F5C1F";

/** hex 보간: light → dark (min~max 정규화). */
function shadeFor(t: number): string {
  // t in [0,1]. light #E6F5E6 → dark #2F7A2F
  const clamp = Math.max(0, Math.min(1, t));
  const light = [230, 245, 230];
  const dark = [47, 122, 47];
  const rgb = light.map((c, i) => Math.round(c + (dark[i] - c) * clamp));
  return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
}

export function KoreaRegionMap({ regions, selected, onSelect }: Props) {
  const byRegion = useMemo(() => {
    const m = new Map<string, RegionStats>();
    for (const r of regions) m.set(toMapKey(r.region), r);
    return m;
  }, [regions]);

  const { min, max } = useMemo(() => {
    if (regions.length === 0) return { min: 0, max: 0 };
    const arr = regions.map((r) => r.avgKg);
    return { min: Math.min(...arr), max: Math.max(...arr) };
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

  const fillOf = (stats: RegionStats): string => {
    if (max === min) return shadeFor(0.5);
    return shadeFor((stats.avgKg - min) / (max - min));
  };

  return (
    <div className="relative">
      {selectedStats && (
        <div className="pointer-events-none absolute left-1/2 top-1 z-10 -translate-x-1/2 rounded-full bg-[#1F5C1F] px-3 py-1 text-[11.5px] font-bold text-white shadow-sm">
          {selectedStats.region} {selectedStats.avgKg.toLocaleString()}원/kg
        </div>
      )}
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
          const dim = selectedKey && !isSelected;
          const fill = hasData ? fillOf(stats!) : NO_DATA_FILL;
          const stroke = isSelected
            ? SELECTED_STROKE
            : hasData
              ? DATA_STROKE
              : NO_DATA_STROKE;
          const displayName = stats?.region ?? key;
          return (
            <path
              key={key}
              d={MAP.paths[key]}
              fill={fill}
              stroke={stroke}
              strokeWidth={isSelected ? 2 : 0.7}
              strokeLinejoin="round"
              opacity={dim ? 0.35 : 1}
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

        {/* Data labels: pin + leader line + pill (pill placed off-shape for tiny metros) */}
        {allKeys.map((key) => {
          const stats = byRegion.get(key);
          if (!stats) return null;
          const [lx, ly] = MAP.labels[key] ?? [0, 0];
          const [ox, oy] = MAP.labelOffset?.[key] ?? [0, 0];
          const isSelected = key === selectedKey;
          const dim = selectedKey && !isSelected;
          const label = MAP.shortName?.[key] ?? shortName(stats.region);
          const cx = lx + ox;
          const cy = ly + oy;
          const hasLeader = ox !== 0 || oy !== 0;
          return (
            <g key={`lbl-${key}`} pointerEvents="none" opacity={dim ? 0.4 : 1}>
              {hasLeader && (
                <line
                  x1={lx}
                  y1={ly}
                  x2={cx}
                  y2={cy}
                  stroke={isSelected ? SELECTED_STROKE : DATA_STROKE}
                  strokeWidth={0.7}
                />
              )}
              <circle
                cx={lx}
                cy={ly}
                r={isSelected ? 3 : 2.4}
                fill={isSelected ? SELECTED_STROKE : DATA_STROKE}
              />
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

        {/* No-data region names — very light */}
        {allKeys.map((key) => {
          if (byRegion.has(key)) return null;
          const [lx, ly] = MAP.labels[key] ?? [0, 0];
          const label = MAP.shortName?.[key] ?? key;
          return (
            <text
              key={`nd-${key}`}
              x={lx}
              y={ly}
              textAnchor="middle"
              fontSize={8}
              fill="#ADB5BD"
              pointerEvents="none"
            >
              {label}
            </text>
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
