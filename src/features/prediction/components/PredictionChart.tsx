import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CartesianGrid,
  ComposedChart,
  Customized,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { RotateCcw } from "lucide-react";
import type { PredictionPoint } from "../types";

/** 과거 실제 가격 기본 표시 일수 (정책 변경 시 이 상수만 수정) */
const PAST_VISIBLE_DAYS = 5;
/** 확대 시 화면에 유지되는 최소 데이터 포인트 수 */
const MIN_VISIBLE_POINTS = 7;
/** 최대 확대 배율 */
const MAX_ZOOM = 3;
/** 수평 Pan으로 판정하는 최소 이동 거리(px) */
const PAN_THRESHOLD = 12;

const RED = "#E03B3B";
const TEAL = "#2E9E6B";
const GREY = "#94A3B8";
const UP_TURN = "#F08C00";
const DOWN_TURN = "#1971C2";
const NAVY = "#1F2937";

type TurnKind = "up" | "down";

interface ChartRow extends PredictionPoint {
  turn?: TurnKind;
  prevActualPrice?: number;
}

const WEEKDAY = ["일", "월", "화", "수", "목", "금", "토"];

function weekdayOf(iso?: string): string {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return "";
  return WEEKDAY[d.getDay()];
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

interface ScaleInfo {
  xScale?: (label: string) => number;
  bandwidth: number;
  yScale?: (v: number) => number;
  offset?: { top: number; left: number; width: number; height: number };
}

/** 오늘 기준선 */
function TodayLine({
  xAxisMap,
  offset,
  todayLabel,
}: {
  xAxisMap?: Record<string, any>;
  offset?: { top: number; left: number; width: number; height: number };
  todayLabel?: string;
}) {
  if (!xAxisMap || !offset || !todayLabel) return null;
  const xAxis = xAxisMap["main"] ?? Object.values(xAxisMap)[0];
  if (!xAxis?.scale) return null;
  const scale = xAxis.scale;
  const v = scale(todayLabel);
  if (typeof v !== "number" || Number.isNaN(v)) return null;
  const bw = typeof scale.bandwidth === "function" ? scale.bandwidth() : 0;
  const x = v + bw / 2;
  return (
    <g style={{ pointerEvents: "none" }}>
      <line
        x1={x}
        x2={x}
        y1={offset.top}
        y2={offset.top + offset.height}
        stroke={GREY}
        strokeWidth={1}
        strokeDasharray="3 3"
      />
      <text
        x={x}
        y={offset.top - 8}
        textAnchor="middle"
        fontSize={12}
        fontWeight={700}
        fill="#868E96"
      >
        오늘
      </text>
    </g>
  );
}

/** 좌표/스케일 캡처 (터치 히트 테스트용) */
function ScaleCapture({
  xAxisMap,
  yAxisMap,
  offset,
  onCapture,
}: {
  xAxisMap?: Record<string, any>;
  yAxisMap?: Record<string, any>;
  offset?: { top: number; left: number; width: number; height: number };
  onCapture: (info: ScaleInfo) => void;
}) {
  const xAxis = xAxisMap
    ? (xAxisMap["main"] ?? Object.values(xAxisMap)[0])
    : undefined;
  const yAxis = yAxisMap
    ? (yAxisMap["price"] ?? Object.values(yAxisMap)[0])
    : undefined;
  onCapture({
    xScale: xAxis?.scale,
    bandwidth:
      xAxis?.scale && typeof xAxis.scale.bandwidth === "function"
        ? xAxis.scale.bandwidth()
        : 0,
    yScale: yAxis?.scale,
    offset,
  });
  return null;
}

/** X축 라벨 (충돌 회피) */
function XLabelsOverlay({
  xAxisMap,
  offset,
  candidates,
}: {
  xAxisMap?: Record<string, any>;
  offset?: { top: number; left: number; width: number; height: number };
  candidates: Array<{ label: string; display: string; priority: number }>;
}) {
  if (!xAxisMap || !offset || candidates.length === 0) return null;
  const xAxis = xAxisMap["main"] ?? Object.values(xAxisMap)[0];
  if (!xAxis?.scale) return null;
  const scale = xAxis.scale;
  const bw = typeof scale.bandwidth === "function" ? scale.bandwidth() : 0;
  const withX = candidates
    .map((c) => {
      const v = scale(c.label);
      return typeof v === "number" && !Number.isNaN(v)
        ? { ...c, x: v + bw / 2 }
        : null;
    })
    .filter((c): c is { label: string; display: string; priority: number; x: number } => !!c);
  const accepted: typeof withX = [];
  for (const c of [...withX].sort((a, b) => a.priority - b.priority)) {
    if (accepted.every((a) => Math.abs(a.x - c.x) >= 34)) {
      accepted.push(c);
      if (accepted.length >= 5) break;
    }
  }
  accepted.sort((a, b) => a.x - b.x);
  const y = offset.top + offset.height + 16;
  return (
    <g style={{ pointerEvents: "none" }}>
      {accepted.map((c) => (
        <text
          key={`xl-${c.label}`}
          x={c.x}
          y={y}
          textAnchor="middle"
          fontSize={12}
          fontWeight={c.priority === 1 ? 700 : 400}
          fill={c.priority === 1 ? "#495057" : "#ADB5BD"}
        >
          {c.display}
        </text>
      ))}
    </g>
  );
}

/** 추천 badge */
function RecommendBadge({
  xAxisMap,
  yAxisMap,
  offset,
  label,
  price,
}: {
  xAxisMap?: Record<string, any>;
  yAxisMap?: Record<string, any>;
  offset?: { top: number; left: number; width: number; height: number };
  label?: string;
  price?: number;
}) {
  if (!xAxisMap || !yAxisMap || !offset || !label || typeof price !== "number")
    return null;
  const xAxis = xAxisMap["main"] ?? Object.values(xAxisMap)[0];
  const yAxis = yAxisMap["price"] ?? Object.values(yAxisMap)[0];
  if (!xAxis?.scale || !yAxis?.scale) return null;
  const xv = xAxis.scale(label);
  const yv = yAxis.scale(price);
  if (typeof xv !== "number" || typeof yv !== "number") return null;
  const bw =
    typeof xAxis.scale.bandwidth === "function" ? xAxis.scale.bandwidth() : 0;
  const w = 38;
  const h = 20;
  const cx = clamp(
    xv + bw / 2,
    offset.left + w / 2,
    offset.left + offset.width - w / 2,
  );
  let cy = yv - 18;
  if (cy - h / 2 < offset.top) cy = yv + 18;
  return (
    <g style={{ pointerEvents: "none" }}>
      <rect
        x={cx - w / 2}
        y={cy - h / 2}
        width={w}
        height={h}
        rx={10}
        ry={10}
        fill={TEAL}
      />
      <text
        x={cx}
        y={cy + 4}
        textAnchor="middle"
        fontSize={12}
        fontWeight={800}
        fill="#fff"
      >
        추천
      </text>
    </g>
  );
}

/** 터치 Tooltip (Dark Navy) */
function TooltipOverlay({
  xAxisMap,
  yAxisMap,
  offset,
  row,
  lines,
  title,
}: {
  xAxisMap?: Record<string, any>;
  yAxisMap?: Record<string, any>;
  offset?: { top: number; left: number; width: number; height: number };
  row?: ChartRow;
  lines: string[];
  title: string;
}) {
  if (!xAxisMap || !yAxisMap || !offset || !row) return null;
  const xAxis = xAxisMap["main"] ?? Object.values(xAxisMap)[0];
  const yAxis = yAxisMap["price"] ?? Object.values(yAxisMap)[0];
  if (!xAxis?.scale || !yAxis?.scale) return null;
  const xv = xAxis.scale(row.label);
  const value = row.actualPrice ?? row.predictedPrice;
  if (typeof xv !== "number" || typeof value !== "number") return null;
  const yv = yAxis.scale(value);
  if (typeof yv !== "number" || Number.isNaN(yv)) return null;
  const bw =
    typeof xAxis.scale.bandwidth === "function" ? xAxis.scale.bandwidth() : 0;
  const px = xv + bw / 2;

  const all = [title, ...lines];
  const w = Math.min(
    240,
    Math.max(...all.map((t) => t.length * 7.4)) + 20,
  );
  const lineH = 17;
  const h = 12 + all.length * lineH;
  const cx = clamp(px, offset.left + w / 2 + 2, offset.left + offset.width - w / 2 - 2);
  let top = yv - 14 - h;
  if (top < offset.top) top = Math.min(yv + 16, offset.top + offset.height - h - 2);

  return (
    <g style={{ pointerEvents: "none" }}>
      <circle cx={px} cy={yv} r={5.5} fill={NAVY} stroke="#fff" strokeWidth={2} />
      <g>
        <rect
          x={cx - w / 2}
          y={top}
          width={w}
          height={h}
          rx={10}
          ry={10}
          fill={NAVY}
          opacity={0.96}
        />
        {all.map((t, i) => (
          <text
            key={`tt-${i}`}
            x={cx - w / 2 + 10}
            y={top + 20 + i * lineH}
            fontSize={i === 0 ? 13 : 12}
            fontWeight={i === 0 ? 800 : 500}
            fill="#fff"
          >
            {t}
          </text>
        ))}
      </g>
    </g>
  );
}

/** 상승/하락 전환 marker */
function TurnMarkers({
  xAxisMap,
  yAxisMap,
  offset,
  rows,
}: {
  xAxisMap?: Record<string, any>;
  yAxisMap?: Record<string, any>;
  offset?: { top: number; left: number; width: number; height: number };
  rows: ChartRow[];
}) {
  if (!xAxisMap || !yAxisMap || !offset) return null;
  const xAxis = xAxisMap["main"] ?? Object.values(xAxisMap)[0];
  const yAxis = yAxisMap["price"] ?? Object.values(yAxisMap)[0];
  if (!xAxis?.scale || !yAxis?.scale) return null;
  const bw =
    typeof xAxis.scale.bandwidth === "function" ? xAxis.scale.bandwidth() : 0;
  return (
    <g style={{ pointerEvents: "none" }}>
      {rows.map((r) => {
        if (!r.turn || r.predictedPrice === undefined) return null;
        const xv = xAxis.scale(r.label);
        const yv = yAxis.scale(r.predictedPrice);
        if (typeof xv !== "number" || typeof yv !== "number") return null;
        const cx = xv + bw / 2;
        const color = r.turn === "up" ? UP_TURN : DOWN_TURN;
        return (
          <g key={`turn-${r.label}`}>
            <circle cx={cx} cy={yv} r={5} fill={color} stroke="#fff" strokeWidth={1.6} />
          </g>
        );
      })}
    </g>
  );
}

interface PredictionChartProps {
  points: PredictionPoint[];
  selectedIndex?: number;
  onSelectIndex?: (index: number) => void;
  viewpoint?: "farmer" | "wholesaler";
  currentPrice?: number;
  quantityBoxes?: number;
  baseUnitLabel?: string;
}

function PredictionChartBase({
  points,
  selectedIndex,
  onSelectIndex,
  currentPrice,
  baseUnitLabel,
}: PredictionChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef<ScaleInfo>({ bandwidth: 0 });

  // ── 기본 표시 범위: 최근 PAST_VISIBLE_DAYS 실제 + 오늘 + 선택 예측 기간
  const base = useMemo<ChartRow[]>(() => {
    const todayIdx = points.findIndex((p) => p.isToday);
    const from =
      todayIdx >= 0 ? Math.max(0, todayIdx - PAST_VISIBLE_DAYS) : 0;
    const sliced = points.slice(from);
    return sliced.map((p, i) => {
      const prev = sliced[i - 1];
      let turn: TurnKind | undefined;
      if (p.isInflection && p.predictedPrice !== undefined) {
        const before = sliced[i - 1]?.predictedPrice;
        const after = sliced[i + 1]?.predictedPrice;
        if (before !== undefined && after !== undefined) {
          turn = after >= p.predictedPrice && p.predictedPrice <= before ? "up" : "down";
        }
      }
      return {
        ...p,
        turn,
        prevActualPrice: prev?.actualPrice,
      };
    });
  }, [points]);

  const total = base.length;
  const todayRow = base.find((p) => p.isToday);
  const todayPrice = todayRow?.actualPrice ?? currentPrice;
  const recommended = base.find((p) => p.isRecommendedDate);

  const minCount = Math.min(
    total,
    Math.max(MIN_VISIBLE_POINTS, Math.ceil(total / MAX_ZOOM)),
  );

  const [zoom, setZoom] = useState<{ start: number; count: number } | null>(null);
  const [tipLabel, setTipLabel] = useState<string | null>(null);

  // 기간/작물 변경 시 zoom·tooltip 초기화
  useEffect(() => {
    setZoom(null);
    setTipLabel(null);
  }, [total, base[0]?.date, base[total - 1]?.date]);

  const count = zoom ? clamp(zoom.count, minCount, total) : total;
  const start = zoom ? clamp(zoom.start, 0, total - count) : 0;
  const visible = useMemo(
    () => base.slice(start, start + count),
    [base, start, count],
  );
  const isZoomed = count < total || start > 0;

  const yDomain = useMemo<[number, number]>(() => {
    const vals: number[] = [];
    visible.forEach((p) => {
      if (p.actualPrice !== undefined) vals.push(p.actualPrice);
      if (p.predictedPrice !== undefined) vals.push(p.predictedPrice);
    });
    if (vals.length === 0) return [0, 1];
    const lo = Math.min(...vals);
    const hi = Math.max(...vals);
    const pad = Math.max((hi - lo) * 0.18, hi * 0.01);
    return [Math.floor(lo - pad), Math.ceil(hi + pad)];
  }, [visible]);

  // X축 라벨 후보
  const candidates = useMemo(() => {
    const toMD = (p?: ChartRow) => {
      if (!p) return "";
      if (p.date) {
        const [, m, dd] = p.date.split("-");
        return `${Number(m)}/${Number(dd)}`;
      }
      return p.label;
    };
    const list: Array<{ label: string; display: string; priority: number }> = [];
    const todayVisible = visible.find((p) => p.isToday);
    if (todayVisible)
      list.push({ label: todayVisible.label, display: "오늘", priority: 1 });
    const last = visible[visible.length - 1];
    if (last && !last.isToday)
      list.push({ label: last.label, display: toMD(last), priority: 2 });
    const rec = visible.find((p) => p.isRecommendedDate);
    if (rec && !list.some((c) => c.label === rec.label))
      list.push({ label: rec.label, display: toMD(rec), priority: 3 });
    const first = visible[0];
    if (first && !list.some((c) => c.label === first.label))
      list.push({ label: first.label, display: toMD(first), priority: 4 });
    const mid = visible[Math.floor(visible.length / 2)];
    if (mid && !list.some((c) => c.label === mid.label))
      list.push({ label: mid.label, display: toMD(mid), priority: 5 });
    return list;
  }, [visible]);

  const ticks = useMemo(
    () => Array.from(new Set(candidates.map((c) => c.label))),
    [candidates],
  );

  // ── 터치 히트 테스트
  const indexFromClientX = useCallback(
    (clientX: number): number => {
      const el = containerRef.current;
      const info = scaleRef.current;
      if (!el || !info.xScale) return -1;
      const rect = el.getBoundingClientRect();
      const x = clientX - rect.left;
      let bestIdx = -1;
      let bestDist = Infinity;
      visible.forEach((p, i) => {
        const v = info.xScale!(p.label);
        if (typeof v !== "number" || Number.isNaN(v)) return;
        const cx = v + info.bandwidth / 2;
        const d = Math.abs(cx - x);
        if (d < bestDist) {
          bestDist = d;
          bestIdx = i;
        }
      });
      return bestDist <= 28 ? bestIdx : -1;
    },
    [visible],
  );

  const handleTap = useCallback(
    (clientX: number) => {
      const i = indexFromClientX(clientX);
      if (i < 0) {
        setTipLabel(null);
        return;
      }
      const row = visible[i];
      if (!row) return;
      setTipLabel((prev) => (prev === row.label ? null : row.label));
      if (row.predictedPrice !== undefined && !row.isToday && row.actualPrice === undefined) {
        const globalIdx = points.findIndex((p) => p.label === row.label);
        if (globalIdx >= 0) onSelectIndex?.(globalIdx);
      }
    },
    [indexFromClientX, visible, points, onSelectIndex],
  );

  // ── Pinch Zoom / Pan (세로 스크롤 보존)
  useEffect(() => {
    const el = containerRef.current;
    if (!el || total === 0) return;

    let mode: "none" | "pan" | "pinch" | "undecided" = "none";
    let startX = 0;
    let startY = 0;
    let baseStart = start;
    let baseCount = count;
    let pinchDist0 = 0;
    let pinchCenterIdx = 0;
    let moved = false;

    const plotWidth = () => {
      const info = scaleRef.current.offset;
      return info?.width ?? el.clientWidth;
    };

    const onTouchStart = (e: TouchEvent) => {
      baseStart = start;
      baseCount = count;
      moved = false;
      if (e.touches.length === 2) {
        mode = "pinch";
        pinchDist0 = Math.abs(e.touches[0].clientX - e.touches[1].clientX) || 1;
        const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const rect = el.getBoundingClientRect();
        const ratio = clamp((midX - rect.left) / Math.max(1, rect.width), 0, 1);
        pinchCenterIdx = baseStart + ratio * baseCount;
      } else if (e.touches.length === 1) {
        mode = "undecided";
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (mode === "pinch" && e.touches.length === 2) {
        e.preventDefault();
        moved = true;
        const dist = Math.abs(e.touches[0].clientX - e.touches[1].clientX) || 1;
        const nextCount = clamp(
          Math.round(baseCount / (dist / pinchDist0)),
          minCount,
          total,
        );
        const ratio = nextCount > 0 ? (pinchCenterIdx - baseStart) / baseCount : 0;
        const nextStart = clamp(
          Math.round(pinchCenterIdx - ratio * nextCount),
          0,
          total - nextCount,
        );
        setZoom({ start: nextStart, count: nextCount });
        setTipLabel(null);
        return;
      }
      if (e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      if (mode === "undecided") {
        if (Math.abs(dx) > PAN_THRESHOLD && Math.abs(dx) > Math.abs(dy) * 1.2) {
          if (baseCount < total) {
            mode = "pan";
          } else {
            mode = "none";
          }
        } else if (Math.abs(dy) > 8) {
          mode = "none"; // 세로 스크롤은 페이지에 양보
        }
        return;
      }
      if (mode === "pan") {
        e.preventDefault();
        moved = true;
        const pxPerPoint = plotWidth() / Math.max(1, baseCount);
        const shift = Math.round(-dx / Math.max(1, pxPerPoint));
        setZoom({
          start: clamp(baseStart + shift, 0, total - baseCount),
          count: baseCount,
        });
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      const wasMode = mode;
      mode = "none";
      if (moved || wasMode === "pan" || wasMode === "pinch") return;
      const t = e.changedTouches[0];
      if (!t) return;
      const dx = Math.abs(t.clientX - startX);
      const dy = Math.abs(t.clientY - startY);
      if (dx < 10 && dy < 10) handleTap(t.clientX);
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [start, count, total, minCount, handleTap]);

  // ── Tooltip 내용
  const tipRow = tipLabel ? visible.find((p) => p.label === tipLabel) : undefined;
  const tip = useMemo(() => {
    if (!tipRow) return null;
    const unit = baseUnitLabel ? ` / ${baseUnitLabel}` : "";
    const wd = weekdayOf(tipRow.date);
    const title = `${tipRow.label}${wd ? ` (${wd})` : ""}`;
    const lines: string[] = [];
    const isForecast =
      tipRow.predictedPrice !== undefined &&
      !tipRow.isToday &&
      tipRow.actualPrice === undefined;

    if (isForecast && tipRow.predictedPrice !== undefined) {
      lines.push(`${tipRow.predictedPrice.toLocaleString()}원${unit}`);
      if (typeof todayPrice === "number" && todayPrice > 0) {
        const diff = tipRow.predictedPrice - todayPrice;
        const rate = (diff / todayPrice) * 100;
        lines.push(
          `오늘 대비 ${diff >= 0 ? "+" : "-"}${Math.abs(diff).toLocaleString()}원 (${diff >= 0 ? "+" : "-"}${Math.abs(rate).toFixed(1)}%)`,
        );
      }
    } else if (tipRow.actualPrice !== undefined) {
      lines.push(`${tipRow.actualPrice.toLocaleString()}원${unit}`);
      if (tipRow.prevActualPrice) {
        const diff = tipRow.actualPrice - tipRow.prevActualPrice;
        const rate = (diff / tipRow.prevActualPrice) * 100;
        lines.push(
          `전일 대비 ${diff >= 0 ? "+" : "-"}${Math.abs(diff).toLocaleString()}원 (${diff >= 0 ? "+" : "-"}${Math.abs(rate).toFixed(1)}%)`,
        );
      }
    }

    if (tipRow.turn === "up") {
      lines.push("상승 전환 예상");
      lines.push("이 시점 이후 가격 흐름이 상승 방향으로");
      lines.push("바뀔 가능성이 있습니다.");
    } else if (tipRow.turn === "down") {
      lines.push("하락 전환 예상");
      lines.push("이 시점 이후 가격 흐름이 하락 방향으로");
      lines.push("바뀔 가능성이 있습니다.");
    }
    return { title, lines };
  }, [tipRow, baseUnitLabel, todayPrice]);

  const selectedPoint = selectedIndex != null ? points[selectedIndex] : undefined;
  const selectedLabel = selectedPoint?.label;
  const selectedPrice = selectedPoint?.predictedPrice;
  const showTopInfo = !!selectedLabel && typeof selectedPrice === "number";

  const todayLabel = visible.find((p) => p.isToday)?.label;
  const recommendedVisible = visible.find((p) => p.isRecommendedDate);
  const hasTurn = visible.some((p) => p.turn);

  return (
    <div className="w-full">
      {showTopInfo && selectedPrice != null && (
        <div className="mb-3 flex items-end justify-between gap-2">
          <div className="min-w-0">
            <div className="text-caption font-bold text-[#6C757D]">
              {selectedLabel} 예상 시세
            </div>
            <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="text-[30px] font-black leading-none tabular-nums text-[#2E9E6B]">
                {selectedPrice.toLocaleString()}
              </span>
              <span className="text-body font-bold text-[#495057]">
                원{baseUnitLabel ? ` / ${baseUnitLabel}` : ""}
              </span>
            </div>
          </div>
          {isZoomed && (
            <button
              type="button"
              onClick={() => {
                setZoom(null);
                setTipLabel(null);
              }}
              className="inline-flex h-9 shrink-0 items-center gap-1 rounded-full bg-[#F1F3F5] px-3 text-caption font-semibold text-[#495057] active:bg-[#E9ECEF]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              전체 보기
            </button>
          )}
        </div>
      )}

      <div
        ref={containerRef}
        className="h-[260px] w-full touch-pan-y pb-2 select-none"
        onClick={(e) => handleTap(e.clientX)}
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={visible}
            margin={{ top: 28, right: 12, left: 0, bottom: 6 }}
          >
            <CartesianGrid stroke="#F1F3F5" vertical={false} />
            <XAxis
              xAxisId="main"
              dataKey="label"
              tick={() => <g />}
              axisLine={false}
              tickLine={false}
              ticks={ticks}
              interval={0}
              height={24}
            />
            <YAxis
              yAxisId="price"
              tick={{ fontSize: 12, fill: "#868E96" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => Number(v).toLocaleString()}
              domain={yDomain}
              width={44}
            />
            <Customized
              component={(props: any) => (
                <ScaleCapture
                  {...props}
                  onCapture={(info: ScaleInfo) => {
                    scaleRef.current = info;
                  }}
                />
              )}
            />
            <Customized
              component={(props: any) => (
                <TodayLine {...props} todayLabel={todayLabel} />
              )}
            />
            <Customized
              component={(props: any) => (
                <XLabelsOverlay {...props} candidates={candidates} />
              )}
            />

            <Line
              xAxisId="main"
              yAxisId="price"
              type="monotone"
              dataKey="actualPrice"
              stroke={RED}
              strokeWidth={2.4}
              dot={false}
              activeDot={false}
              isAnimationActive={false}
              connectNulls={false}
            />
            <Line
              xAxisId="main"
              yAxisId="price"
              type="monotone"
              dataKey="predictedPrice"
              stroke={TEAL}
              strokeWidth={2.4}
              strokeDasharray="5 4"
              dot={(dotProps: any) => {
                const { cx, cy, index, payload } = dotProps;
                if (
                  payload.predictedPrice === undefined ||
                  payload.isToday ||
                  typeof cx !== "number" ||
                  typeof cy !== "number"
                ) {
                  return <g key={`d-${index}`} />;
                }
                const isRec = !!payload.isRecommendedDate;
                return (
                  <circle
                    key={`d-${index}`}
                    cx={cx}
                    cy={cy}
                    r={isRec ? 5 : 3}
                    fill={TEAL}
                    stroke="#fff"
                    strokeWidth={isRec ? 2 : 1.5}
                  />
                );
              }}
              activeDot={false}
              isAnimationActive={false}
              connectNulls={false}
            />

            <Customized
              component={(props: any) => (
                <TurnMarkers {...props} rows={visible} />
              )}
            />
            <Customized
              component={(props: any) => (
                <RecommendBadge
                  {...props}
                  label={recommendedVisible?.label}
                  price={recommendedVisible?.predictedPrice}
                />

              )}
            />
            {tip && (
              <Customized
                component={(props: any) => (
                  <TooltipOverlay
                    {...props}
                    row={tipRow}
                    title={tip.title}
                    lines={tip.lines}
                  />
                )}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {hasTurn && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-1 text-meta text-[#868E96]">
          <span className="inline-flex items-center gap-1.5">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: UP_TURN }}
            />
            상승 전환 예상
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: DOWN_TURN }}
            />
            하락 전환 예상
          </span>
        </div>
      )}
    </div>
  );
}

export const PredictionChart = memo(PredictionChartBase);
