import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PredictionPoint } from "../types";

/**
 * 가격 예측 차트 (가격 단일 축)
 * - 핀치(두 손가락)/휠 = 확대·축소, 드래그(한 손가락/마우스) = 좌우 이동
 * - 표시 구간 자체가 재계산되며 Y축도 보이는 구간 기준으로 재산출
 * - 차트 내부는 가로 제스처만 처리, 세로 스크롤은 페이지로 전달(touch-action: pan-y)
 */

/** 기본 표시 구간(일) */
const DEFAULT_SPAN = 15;
/** 최대 확대 시 최소 표시 일수 */
const MIN_SPAN = 5;
/** 최대 축소 시 표시 일수 */
const MAX_SPAN = 40;
const TAP_MOVE_PX = 8;
const TOOLTIP_MS = 2800;

const H = 230;
const PAD = { top: 26, right: 14, bottom: 26, left: 44 };

const ACTUAL = "#5E8F6B";
const PRED = "#2E9E6B";
const UP = "#E03B3B";
const DOWN = "#1971C2";
const TURN = "#F08C00";
const GREY = "#ADB5BD";

const WEEKDAY = ["일", "월", "화", "수", "목", "금", "토"];

function parseIso(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}
function md(iso: string) {
  const d = parseIso(iso);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}
function korDate(iso: string, withDow = true) {
  const d = parseIso(iso);
  return `${d.getMonth() + 1}월 ${d.getDate()}일${withDow ? `(${WEEKDAY[d.getDay()]})` : ""}`;
}
function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}
function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}
function signed(n: number) {
  return `${n > 0 ? "+" : n < 0 ? "-" : ""}${Math.abs(Math.round(n)).toLocaleString()}`;
}

type Turn = "up" | "down";
interface Row extends PredictionPoint {
  i: number;
  turn?: Turn;
}

interface Win {
  start: number;
  span: number;
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
  onSelectIndex,
  currentPrice,
  baseUnitLabel = "10kg",
}: PredictionChartProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(340);
  const [showUp, setShowUp] = useState(false);
  const [showDown, setShowDown] = useState(false);
  const [showTurn, setShowTurn] = useState(false);
  const [tip, setTip] = useState<{ idx: number; kind: "actual" | "pred" | "turn" } | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth || 340));
    ro.observe(el);
    setWidth(el.clientWidth || 340);
    return () => ro.disconnect();
  }, []);

  const rows = useMemo<Row[]>(
    () =>
      points.map((p, i) => {
        let turn: Turn | undefined;
        if (p.isInflection && p.predictedPrice !== undefined) {
          const after = points[i + 1]?.predictedPrice;
          turn = after !== undefined && after >= p.predictedPrice ? "up" : "down";
        }
        return { ...p, i, turn };
      }),
    [points],
  );
  const total = rows.length;
  const todayIdx = Math.max(0, rows.findIndex((r) => r.isToday));
  const todayPrice = rows[todayIdx]?.actualPrice ?? currentPrice ?? 0;

  const maxSpan = Math.min(MAX_SPAN, total);
  const minSpan = Math.min(MIN_SPAN, total);
  const defaultWin = useMemo<Win>(() => {
    const span = Math.min(DEFAULT_SPAN, total);
    const start = clamp(todayIdx - Math.floor((span - 1) / 2), 0, total - span);
    return { start, span };
  }, [total, todayIdx]);

  const [win, setWin] = useState<Win>(defaultWin);
  useEffect(() => {
    setWin(defaultWin);
    setTip(null);
  }, [defaultWin, points]);

  const fix = useCallback(
    (w: Win): Win => {
      const span = clamp(w.span, minSpan, maxSpan);
      return { span, start: clamp(w.start, 0, Math.max(0, total - span)) };
    },
    [minSpan, maxSpan, total],
  );

  const plotW = Math.max(10, width - PAD.left - PAD.right);
  const plotH = H - PAD.top - PAD.bottom;
  const denom = Math.max(1, win.span - 1);
  const xOf = (i: number) => PAD.left + ((i - win.start) / denom) * plotW;

  const visLo = Math.max(0, Math.floor(win.start));
  const visHi = Math.min(total - 1, Math.ceil(win.start + win.span - 1));
  const visible = rows.slice(visLo, visHi + 1);

  const [yMin, yMax] = useMemo(() => {
    const vals: number[] = [];
    for (const r of visible) {
      if (r.actualPrice !== undefined) vals.push(r.actualPrice);
      if (r.predictedPrice !== undefined) vals.push(r.predictedPrice);
      if (showUp && r.optimisticPrice !== undefined) vals.push(r.optimisticPrice);
      if (showDown && r.pessimisticPrice !== undefined) vals.push(r.pessimisticPrice);
    }
    if (!vals.length) return [0, 1];
    const lo = Math.min(...vals);
    const hi = Math.max(...vals);
    const pad = Math.max((hi - lo) * 0.2, hi * 0.01);
    return [lo - pad, hi + pad];
  }, [visible, showUp, showDown]);
  const yOf = (v: number) => PAD.top + (1 - (v - yMin) / (yMax - yMin || 1)) * plotH;

  // ── 제스처 (Pointer Events)
  const ptrs = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{
    startWin: Win;
    startX: number;
    startY: number;
    moved: boolean;
    pinchDist?: number;
    pinchCenter?: number;
    t: number;
  } | null>(null);

  const localX = (clientX: number) => {
    const r = wrapRef.current?.getBoundingClientRect();
    return r ? clientX - r.left : clientX;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    ptrs.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const list = [...ptrs.current.values()];
    if (list.length === 1) {
      gesture.current = { startWin: win, startX: e.clientX, startY: e.clientY, moved: false, t: Date.now() };
    } else if (list.length === 2 && gesture.current) {
      const [a, b] = list;
      gesture.current = {
        ...gesture.current,
        startWin: win,
        moved: true,
        pinchDist: Math.abs(a.x - b.x) || 1,
        pinchCenter: localX((a.x + b.x) / 2),
      };
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!ptrs.current.has(e.pointerId) || !gesture.current) return;
    ptrs.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = gesture.current;
    const list = [...ptrs.current.values()];
    const perPx = denom / plotW;
    if (list.length >= 2 && g.pinchDist && g.pinchCenter !== undefined) {
      const [a, b] = list;
      const dist = Math.abs(a.x - b.x) || 1;
      const span = clamp(g.startWin.span * (g.pinchDist / dist), minSpan, maxSpan);
      const anchorIdx = g.startWin.start + (g.pinchCenter - PAD.left) * ((g.startWin.span - 1) / plotW);
      const ratio = (g.pinchCenter - PAD.left) / plotW;
      setWin(fix({ span, start: anchorIdx - ratio * (span - 1) }));
      return;
    }
    const dx = e.clientX - g.startX;
    const dy = e.clientY - g.startY;
    if (!g.moved && Math.abs(dx) < TAP_MOVE_PX && Math.abs(dy) < TAP_MOVE_PX) return;
    if (!g.moved && Math.abs(dy) > Math.abs(dx)) {
      // 세로 제스처 → 페이지 스크롤에 양보
      ptrs.current.delete(e.pointerId);
      gesture.current = null;
      return;
    }
    g.moved = true;
    setWin(fix({ span: g.startWin.span, start: g.startWin.start - dx * perPx }));
  };

  const tapAt = (clientX: number, clientY: number) => {
    const x = localX(clientX);
    const r = wrapRef.current?.getBoundingClientRect();
    const y = r ? clientY - r.top : 0;
    // 전환 시점 점 우선
    if (showTurn) {
      const hit = visible.find(
        (row) =>
          row.turn &&
          row.predictedPrice !== undefined &&
          Math.hypot(xOf(row.i) - x, yOf(row.predictedPrice) - y) < 18,
      );
      if (hit) {
        setTip({ idx: hit.i, kind: "turn" });
        return;
      }
    }
    let best = -1;
    let bd = Infinity;
    for (const row of visible) {
      const d = Math.abs(xOf(row.i) - x);
      if (d < bd) {
        bd = d;
        best = row.i;
      }
    }
    if (best < 0 || bd > 30) {
      setTip(null);
      return;
    }
    const row = rows[best];
    const isPast = row.actualPrice !== undefined && !row.isToday;
    setTip({ idx: best, kind: isPast || row.isToday ? "actual" : "pred" });
    if (!isPast && !row.isToday && row.predictedPrice !== undefined) onSelectIndex?.(best);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const g = gesture.current;
    const wasSingle = ptrs.current.size === 1;
    ptrs.current.delete(e.pointerId);
    if (g && wasSingle && !g.moved && Date.now() - g.t < 500) tapAt(e.clientX, e.clientY);
    if (ptrs.current.size === 0) gesture.current = null;
    else if (ptrs.current.size === 1 && g) {
      const [p] = [...ptrs.current.values()];
      gesture.current = { startWin: win, startX: p.x, startY: p.y, moved: true, t: Date.now() };
    }
  };

  // 휠 = 확대/축소 (PC)
  const wheelRef = useRef<(e: WheelEvent) => void>(() => {});
  wheelRef.current = (e: WheelEvent) => {
    const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 100 : 1);
    const cx = localX(e.clientX);
    setWin((w) => {
      const span = clamp(w.span * Math.exp(dy * 0.002), minSpan, maxSpan);
      const ratio = clamp((cx - PAD.left) / plotW, 0, 1);
      const anchor = w.start + ratio * (w.span - 1);
      return fix({ span, start: anchor - ratio * (span - 1) });
    });
  };
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const h = (e: WheelEvent) => {
      e.preventDefault();
      wheelRef.current(e);
    };
    el.addEventListener("wheel", h, { passive: false });
    return () => el.removeEventListener("wheel", h);
  }, []);

  // 툴팁 자동 숨김
  useEffect(() => {
    if (!tip) return;
    const t = setTimeout(() => setTip(null), TOOLTIP_MS);
    return () => clearTimeout(t);
  }, [tip]);

  const isDefault =
    Math.abs(win.start - defaultWin.start) < 0.3 && Math.abs(win.span - defaultWin.span) < 0.3;

  // ── 경로
  const pathOf = (list: Array<[number, number]>) =>
    list.map(([x, y], k) => `${k ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join("");
  const actualPath = pathOf(
    rows.filter((r) => r.actualPrice !== undefined).map((r) => [xOf(r.i), yOf(r.actualPrice!)]),
  );
  const predPath = pathOf(
    rows.filter((r) => r.i >= todayIdx && r.predictedPrice !== undefined).map((r) => [xOf(r.i), yOf(r.predictedPrice!)]),
  );
  const seriesPath = (key: "optimisticPrice" | "pessimisticPrice") =>
    pathOf(
      rows
        .filter((r) => r.i >= todayIdx)
        .map((r) => {
          const v = r.isToday ? todayPrice : r[key];
          return v === undefined ? null : ([xOf(r.i), yOf(v)] as [number, number]);
        })
        .filter((v): v is [number, number] => !!v),
    );

  const lastVisFuture = [...visible].reverse().find((r) => r.optimisticPrice !== undefined);

  const pastVisible = visible.filter((r) => r.actualPrice !== undefined);
  const minPast = pastVisible.length
    ? pastVisible.reduce((a, b) => (b.actualPrice! < a.actualPrice! ? b : a))
    : undefined;
  const optVisible = visible.filter((r) => r.optimisticPrice !== undefined);
  const maxOpt = showUp && optVisible.length
    ? optVisible.reduce((a, b) => (b.optimisticPrice! > a.optimisticPrice! ? b : a))
    : undefined;

  // 거래량(배경 장식)
  const vols = visible
    .filter((r) => r.actualPrice !== undefined)
    .map((r) => ({ r, v: r.volume ?? 40 + (hash(r.date) % 60) }));
  const volMax = Math.max(1, ...vols.map((v) => v.v));
  const barW = Math.max(2, Math.min(10, (plotW / Math.max(1, win.span)) * 0.5));

  // X축 라벨
  const xTicks = (() => {
    const n = Math.min(5, visible.length);
    const out = new Set<number>();
    for (let k = 0; k < n; k++) {
      const idx = Math.round(win.start + (k / Math.max(1, n - 1)) * (win.span - 1));
      if (idx >= 0 && idx < total) out.add(idx);
    }
    if (todayIdx >= visLo && todayIdx <= visHi) {
      for (const t of [...out]) if (Math.abs(xOf(t) - xOf(todayIdx)) < 30) out.delete(t);
      out.add(todayIdx);
    }
    return [...out].sort((a, b) => a - b);
  })();

  const yTicks = [0, 1, 2, 3].map((k) => yMin + ((yMax - yMin) * k) / 3);

  const todayX = xOf(todayIdx);
  const todayInView = todayX >= PAD.left - 1 && todayX <= PAD.left + plotW + 1;

  const firstIso = rows[Math.round(win.start)]?.date;
  const lastIso = rows[Math.min(total - 1, Math.round(win.start + win.span - 1))]?.date;

  // ── 툴팁 내용
  const tipNode = (() => {
    if (!tip) return null;
    const r = rows[tip.idx];
    if (!r) return null;
    const value = tip.kind === "actual" ? r.actualPrice : r.predictedPrice;
    if (value === undefined) return null;
    const x = xOf(r.i);
    const y = yOf(value);
    let body: React.ReactNode;
    if (tip.kind === "turn") {
      body = (
        <>
          <div className="font-bold">{korDate(r.date)}</div>
          <div className="mt-0.5 font-extrabold text-[#FFC078]">
            {r.turn === "up" ? "상승" : "하락"} 전환 예상
          </div>
          <div className="mt-0.5 text-white/80">
            이후 가격이 {r.turn === "up" ? "상승" : "하락"} 흐름으로
            <br />
            바뀔 가능성이 있어요.
          </div>
        </>
      );
    } else {
      const ref =
        tip.kind === "actual" ? rows[r.i - 1]?.actualPrice : todayPrice;
      const diff = ref !== undefined ? value - ref : undefined;
      const pct = ref ? (diff! / ref) * 100 : 0;
      body = (
        <>
          <div className="font-bold">{korDate(r.date)}</div>
          <div className="mt-0.5">
            <span className="text-body font-extrabold tabular-nums">{value.toLocaleString()}</span>{" "}
            원/{baseUnitLabel}
          </div>
          {diff !== undefined ? (
            <div
              className={cn(
                "mt-0.5 font-bold tabular-nums",
                diff > 0 ? "text-[#FF8787]" : diff < 0 ? "text-[#74C0FC]" : "text-white/80",
              )}
            >
              {tip.kind === "actual" ? "전일" : "오늘"} 대비 {signed(diff)}원({diff > 0 ? "+" : ""}
              {pct.toFixed(1)}%)
            </div>
          ) : null}
        </>
      );
    }
    const bw = 170;
    const left = clamp(x - bw / 2, 2, width - bw - 2);
    const above = y > 80;
    return (
      <>
        <div
          className="pointer-events-none absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#1F2937]"
          style={{ left: x, top: y }}
        />
        <div
          role="tooltip"
          className="pointer-events-none absolute z-10 rounded-[10px] bg-[#1F2937]/95 px-2.5 py-2 text-meta leading-snug text-white shadow-lg"
          style={{
            left,
            width: bw,
            top: above ? undefined : y + 12,
            bottom: above ? H - y + 12 : undefined,
          }}
        >
          {body}
        </div>
      </>
    );
  })();

  const toggles: Array<{ key: string; label: string; on: boolean; color: string; set?: () => void }> = [
    { key: "mid", label: "예상 가격", on: true, color: PRED },
    { key: "up", label: "상승 예상치", on: showUp, color: UP, set: () => setShowUp((v) => !v) },
    { key: "down", label: "하락 예상치", on: showDown, color: DOWN, set: () => setShowDown((v) => !v) },
    { key: "turn", label: "전환 시점", on: showTurn, color: TURN, set: () => setShowTurn((v) => !v) },
  ];

  return (
    <div>
      {/* 선택형 토글 */}
      <div className="grid grid-cols-4 gap-1 pb-2">
        {toggles.map((t) => (
          <button
            key={t.key}
            type="button"
            aria-pressed={t.on}
            disabled={!t.set}
            onClick={t.set}
            className={cn(
              "inline-flex min-h-9 min-w-0 items-center justify-center gap-1 whitespace-nowrap rounded-full border px-1 text-meta font-bold tracking-tight",
              t.on ? "bg-white" : "border-[#E9ECEF] bg-[#F8F9FA] text-[#868E96]",
              !t.set && "cursor-default",
            )}
            style={t.on ? { borderColor: t.color, color: t.color } : undefined}
          >
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: t.on ? t.color : GREY }}
            />
            {t.label}
          </button>
        ))}
      </div>

      {/* 구간 배지 + 전체 보기 */}
      <div className="flex min-h-8 items-center justify-between">
        <span className="rounded-full bg-[#F0F9F0] px-2 py-0.5 text-meta font-bold text-[#1F5C1F]">
          {firstIso && lastIso ? `${korDate(firstIso, false)} ~ ${korDate(lastIso, false)}` : ""}
        </span>
        {!isDefault ? (
          <button
            type="button"
            onClick={() => setWin(defaultWin)}
            className="inline-flex min-h-9 items-center gap-1 rounded-full border border-[#DEE2E6] bg-white px-2.5 text-meta font-bold text-[#495057]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            전체 보기
          </button>
        ) : null}
      </div>

      <div
        ref={wrapRef}
        className="relative mt-1 select-none"
        style={{ height: H, touchAction: "pan-y" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role="img"
        aria-label="가격 예측 차트. 핀치 또는 휠로 확대·축소, 드래그로 구간 이동"
      >
        <svg width={width} height={H} className="block">
          <defs>
            <clipPath id="pc-clip">
              <rect x={PAD.left} y={0} width={plotW} height={H} />
            </clipPath>
          </defs>

          {/* Y 그리드 + 라벨 */}
          {yTicks.map((v, k) => (
            <g key={k}>
              <line x1={PAD.left} x2={PAD.left + plotW} y1={yOf(v)} y2={yOf(v)} stroke="#F1F3F5" />
              <text x={PAD.left - 6} y={yOf(v) + 4} textAnchor="end" fontSize={10} fill="#ADB5BD">
                {v >= 10000 ? `${(v / 10000).toFixed(1)}만` : Math.round(v).toLocaleString()}
              </text>
            </g>
          ))}

          <g clipPath="url(#pc-clip)">
            {/* 거래량 배경 막대 */}
            {vols.map(({ r, v }) => {
              const h = (v / volMax) * plotH * 0.25;
              return (
                <rect
                  key={`v-${r.i}`}
                  x={xOf(r.i) - barW / 2}
                  y={PAD.top + plotH - h}
                  width={barW}
                  height={h}
                  rx={1.5}
                  fill="#E9F3EC"
                />
              );
            })}

            {/* 오늘 구분선 */}
            {todayInView ? (
              <line x1={todayX} x2={todayX} y1={PAD.top - 8} y2={PAD.top + plotH} stroke={GREY} strokeDasharray="3 3" />
            ) : null}

            <path d={actualPath} fill="none" stroke={ACTUAL} strokeWidth={2.2} strokeLinejoin="round" />
            <path d={predPath} fill="none" stroke={PRED} strokeWidth={2.4} strokeDasharray="5 4" strokeLinejoin="round" />
            {showUp ? (
              <path d={seriesPath("optimisticPrice")} fill="none" stroke={UP} strokeWidth={1.6} strokeDasharray="4 4" />
            ) : null}
            {showDown ? (
              <path d={seriesPath("pessimisticPrice")} fill="none" stroke={DOWN} strokeWidth={1.6} strokeDasharray="4 4" />
            ) : null}

            {/* 전환 시점 */}
            {showTurn
              ? visible.map((r) =>
                  r.turn && r.predictedPrice !== undefined ? (
                    <g key={`t-${r.i}`}>
                      <circle cx={xOf(r.i)} cy={yOf(r.predictedPrice)} r={5} fill={TURN} stroke="#fff" strokeWidth={1.6} />
                      <text
                        x={xOf(r.i)}
                        y={yOf(r.predictedPrice) - 10}
                        textAnchor="middle"
                        fontSize={10}
                        fontWeight={800}
                        fill={TURN}
                      >
                        {r.turn === "up" ? "상승" : "하락"} 전환 예상
                      </text>
                    </g>
                  ) : null,
                )
              : null}
          </g>

          {/* 실제/예상 구분 라벨 */}
          {todayInView ? (
            <g fontSize={10} fontWeight={700}>
              <text x={todayX - 6} y={PAD.top - 12} textAnchor="end" fill="#868E96">
                ← 실제 가격
              </text>
              <text x={todayX + 6} y={PAD.top - 12} textAnchor="start" fill={PRED}>
                예상 가격 →
              </text>
            </g>
          ) : null}

          {/* 최저 콜아웃 (과거 구간) */}
          {minPast ? (
            <Callout x={xOf(minPast.i)} y={yOf(minPast.actualPrice!) + 16} text={`최저 ${minPast.actualPrice!.toLocaleString()}`} color={DOWN} minX={PAD.left} maxX={PAD.left + plotW} />
          ) : null}
          {/* 최고 콜아웃 (상승 예상치 ON) */}
          {maxOpt ? (
            <Callout x={xOf(maxOpt.i)} y={yOf(maxOpt.optimisticPrice!) - 16} text={`최고 ${maxOpt.optimisticPrice!.toLocaleString()}`} color={UP} minX={PAD.left} maxX={PAD.left + plotW} />
          ) : null}

          {/* 끝값 라벨 */}
          {lastVisFuture && showUp && lastVisFuture.i !== maxOpt?.i ? (
            <EndLabel x={xOf(lastVisFuture.i)} y={yOf(lastVisFuture.optimisticPrice!)} v={lastVisFuture.optimisticPrice!} color={UP} maxX={PAD.left + plotW} />
          ) : null}
          {lastVisFuture && showDown ? (
            <EndLabel x={xOf(lastVisFuture.i)} y={yOf(lastVisFuture.pessimisticPrice!)} v={lastVisFuture.pessimisticPrice!} color={DOWN} maxX={PAD.left + plotW} />
          ) : null}

          {/* X축 */}
          {xTicks.map((i) => (
            <text
              key={`x-${i}`}
              x={clamp(xOf(i), PAD.left + 10, PAD.left + plotW - 10)}
              y={H - 8}
              textAnchor="middle"
              fontSize={10.5}
              fontWeight={i === todayIdx ? 800 : 500}
              fill={i === todayIdx ? "#495057" : "#ADB5BD"}
            >
              {i === todayIdx ? "오늘" : md(rows[i].date)}
            </text>
          ))}
        </svg>
        {tipNode}
      </div>

      <div className="mt-2 rounded-xl bg-[#F8F9FA] px-3 py-2 text-meta leading-snug text-[#6C757D]">
        그래프를 터치하면 날짜별 상세 정보를 확인할 수 있어요. 핀치로 구간을 확대/축소할 수 있습니다.
        확대된 경우 우측 상단의 전체 보기 버튼으로 원래 범위로 돌아갈 수 있어요.
      </div>
    </div>
  );
}

function Callout({
  x,
  y,
  text,
  color,
  minX,
  maxX,
}: {
  x: number;
  y: number;
  text: string;
  color: string;
  minX: number;
  maxX: number;
}) {
  const w = text.length * 6.6 + 12;
  const cx = clamp(x, minX + w / 2, maxX - w / 2);
  return (
    <g style={{ pointerEvents: "none" }}>
      <rect x={cx - w / 2} y={y - 9} width={w} height={18} rx={5} fill="#fff" stroke={color} strokeWidth={1} />
      <text x={cx} y={y + 4} textAnchor="middle" fontSize={10} fontWeight={800} fill={color}>
        {text}
      </text>
    </g>
  );
}

function EndLabel({ x, y, v, color, maxX }: { x: number; y: number; v: number; color: string; maxX: number }) {
  const text = v.toLocaleString();
  const w = text.length * 6.4 + 10;
  const left = Math.min(x + 4, maxX - w);
  return (
    <g style={{ pointerEvents: "none" }}>
      <circle cx={x} cy={y} r={3} fill={color} />
      <rect x={left} y={y - 17} width={w} height={14} rx={4} fill={color} />
      <text x={left + w / 2} y={y - 7} textAnchor="middle" fontSize={9.5} fontWeight={800} fill="#fff">
        {text}
      </text>
    </g>
  );
}

export const PredictionChart = memo(PredictionChartBase);
