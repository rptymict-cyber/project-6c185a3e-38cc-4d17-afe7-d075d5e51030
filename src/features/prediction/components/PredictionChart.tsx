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

// TODO(미확정): 과거 데이터 보유 일수는 틸다 확인 후 확정
const MAX_PAST_DAYS = 30;
// TODO(미확정): 확대 단계 과거/미래 일수
const ZOOM_IN_PAST = 3;
const ZOOM_IN_FUTURE = 4;
// TODO(미확정): 거래량 막대 최대 높이 비율(차트 영역 대비)
const VOL_MAX_RATIO = 0.3;
// TODO(미확정): 거래량 단위(현재 Mock)
const VOL_UNIT = "t";
const TAP_MOVE_PX = 8;
const TOOLTIP_MS = 2600;
/** 핀치 한 번에 한 단계 이동 판정 비율 */
const PINCH_STEP_RATIO = 1.2;

const H = 230;
const PAD = { top: 26, right: 14, bottom: 26, left: 44 };

const ACTUAL = "#5E8F6B";
const PRED = "#2E9E6B";
const UP = "#E03B3B";
const DOWN = "#1971C2";
const TURN = "#C9A227";
const TODAY_LINE = "#94A3B8";
const VOL_FILL = "rgba(224,59,59,0.20)";
const GREY = "#ADB5BD";

/** -1 = 확대, 0 = 기본, 1 = 축소 */
type ZoomLevel = -1 | 0 | 1;

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
  /** 선택된 예측 탭 일수(N). 미래 구간은 N일을 넘지 않는다. */
  rangeDays?: number;
}

type TipKind = "actual" | "pred" | "turn" | "vol";

function PredictionChartBase({
  points,
  onSelectIndex,
  currentPrice,
  baseUnitLabel = "10kg",
  rangeDays,
}: PredictionChartProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(340);
  const [showUp, setShowUp] = useState(false);
  const [showDown, setShowDown] = useState(false);
  const [showTurn, setShowTurn] = useState(false);
  const [tip, setTip] = useState<{ idx: number; kind: TipKind } | null>(null);

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
  const N = Math.max(1, Math.min(rangeDays ?? total - 1 - todayIdx, total - 1 - todayIdx));

  // 이동 가능 범위: 과거 MAX_PAST_DAYS, 미래 N (Lock)
  const minStart = todayIdx - MAX_PAST_DAYS;
  const maxEnd = todayIdx + N;

  const winForLevel = useCallback(
    (lv: ZoomLevel): Win => {
      const past = lv === -1 ? ZOOM_IN_PAST : lv === 1 ? MAX_PAST_DAYS : Math.min(N, MAX_PAST_DAYS);
      const fut = lv === -1 ? Math.min(ZOOM_IN_FUTURE, N) : N;
      return { start: todayIdx - past, span: past + fut + 1 };
    },
    [N, todayIdx],
  );

  const [level, setLevel] = useState<ZoomLevel>(0);
  const defaultWin = useMemo(() => winForLevel(0), [winForLevel]);
  const [win, setWin] = useState<Win>(defaultWin);
  useEffect(() => {
    setLevel(0);
    setWin(defaultWin);
    setTip(null);
  }, [defaultWin, points]);

  const fix = useCallback(
    (w: Win): Win => ({
      span: w.span,
      start: clamp(w.start, minStart, Math.max(minStart, maxEnd - (w.span - 1))),
    }),
    [minStart, maxEnd],
  );

  /** 한 단계 확대/축소. 현재 위치의 오늘 기준 오프셋을 최대한 유지 */
  const stepZoom = useCallback(
    (dir: 1 | -1) => {
      setLevel((lv) => {
        const next = clamp(lv + dir, -1, 1) as ZoomLevel;
        if (next === lv) return lv;
        setWin(fix(winForLevel(next)));
        setTip(null);
        return next;
      });
    },
    [fix, winForLevel],
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

  // 거래량 (과거 구간만, Mock)
  const volOf = (r: PredictionPoint) => r.volume ?? 40 + (hash(r.date) % 60);
  const vols = visible
    .filter((r) => r.actualPrice !== undefined && !r.isToday)
    .map((r) => ({ r, v: volOf(r) }));
  const volMax = Math.max(1, ...vols.map((v) => v.v));
  const barW = Math.max(2, Math.min(10, (plotW / Math.max(1, win.span)) * 0.5));
  const volH = (v: number) => (v / volMax) * plotH * VOL_MAX_RATIO;

  // ── 제스처 (Pointer Events)
  const ptrs = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{
    startWin: Win;
    startX: number;
    startY: number;
    moved: boolean;
    pinchDist?: number;
    pinchDone?: boolean;
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
        pinchDone: false,
      };
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!ptrs.current.has(e.pointerId) || !gesture.current) return;
    ptrs.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = gesture.current;
    const list = [...ptrs.current.values()];
    if (list.length >= 2 && g.pinchDist) {
      if (g.pinchDone) return;
      const [a, b] = list;
      const ratio = (Math.abs(a.x - b.x) || 1) / g.pinchDist;
      if (ratio > PINCH_STEP_RATIO) {
        g.pinchDone = true;
        stepZoom(-1);
      } else if (ratio < 1 / PINCH_STEP_RATIO) {
        g.pinchDone = true;
        stepZoom(1);
      }
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
    // 손가락 1:1 추종, 관성 없음
    setWin(fix({ span: g.startWin.span, start: g.startWin.start - dx * (denom / plotW) }));
  };

  const tapAt = (clientX: number, clientY: number) => {
    const x = localX(clientX);
    const r = wrapRef.current?.getBoundingClientRect();
    const y = r ? clientY - r.top : 0;
    // 1) 전환 시점 마커
    const hitTurn = visible.find(
      (row) =>
        row.turn &&
        row.predictedPrice !== undefined &&
        Math.hypot(xOf(row.i) - x, yOf(row.predictedPrice) - y) < 18,
    );
    if (hitTurn) {
      setTip({ idx: hitTurn.i, kind: "turn" });
      return;
    }
    // 2) 거래량 막대 (툴팁만, 기준일 변경 없음)
    const baseY = PAD.top + plotH;
    const hitVol = vols.find(
      ({ r: row, v }) =>
        Math.abs(xOf(row.i) - x) <= Math.max(barW / 2 + 4, 8) &&
        y >= baseY - volH(v) - 4 &&
        y <= baseY + 4,
    );
    if (hitVol) {
      setTip({ idx: hitVol.r.i, kind: "vol" });
      return;
    }
    // 3) 선 위 포인트
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

  // 휠 = 한 단계 확대/축소 (PC), 연속 휠은 쓰로틀
  const wheelRef = useRef<(e: WheelEvent) => void>(() => {});
  const lastWheel = useRef(0);
  wheelRef.current = (e: WheelEvent) => {
    const now = Date.now();
    if (now - lastWheel.current < 350 || Math.abs(e.deltaY) < 2) return;
    lastWheel.current = now;
    stepZoom(e.deltaY < 0 ? -1 : 1);
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
    level === 0 &&
    Math.abs(win.start - fix(defaultWin).start) < 0.3 &&
    Math.abs(win.span - defaultWin.span) < 0.3;
  const resetView = () => {
    setLevel(0);
    setWin(fix(defaultWin));
    setTip(null);
  };

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
  // 최고: 보이는 미래 구간의 예상 가격(기준선) 최댓값 — 토글과 무관하게 항상 표시
  const futVisible = visible.filter(
    (r) => r.predictedPrice !== undefined && r.actualPrice === undefined,
  );
  const maxFut = futVisible.length
    ? futVisible.reduce((a, b) => (b.predictedPrice! > a.predictedPrice! ? b : a))
    : undefined;

  // X축 라벨: 보이는 구간 균등 분할(시작·끝 포함)
  const xTicks = (() => {
    const n = Math.min(5, visible.length);
    const out = new Set<number>();
    for (let k = 0; k < n; k++) {
      const idx = Math.round(visLo + (k / Math.max(1, n - 1)) * (visHi - visLo));
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

  const firstIso = rows[visLo]?.date;
  const lastIso = rows[visHi]?.date;

  // ── 툴팁 내용 (검정 말풍선, 탭 지점 바로 위, 아래 꼬리)
  const tipNode = (() => {
    if (!tip) return null;
    const r = rows[tip.idx];
    if (!r) return null;
    const x = xOf(r.i);
    let y: number;
    let body: React.ReactNode;
    if (tip.kind === "vol") {
      const v = volOf(r);
      const prevRow = rows[r.i - 1];
      const prev = prevRow && prevRow.actualPrice !== undefined ? volOf(prevRow) : undefined;
      const diff = prev !== undefined ? v - prev : undefined;
      const pct = prev ? (diff! / prev) * 100 : 0;
      y = PAD.top + plotH - volH(v);
      body = (
        <>
          <div className="font-bold">{korDate(r.date)} · 거래량</div>
          <div className="mt-0.5">
            <span className="text-body font-extrabold tabular-nums">{v.toLocaleString()}</span> {VOL_UNIT}
          </div>
          {diff !== undefined ? (
            <div
              className={cn(
                "mt-0.5 font-bold tabular-nums",
                diff > 0 ? "text-[#FF8787]" : diff < 0 ? "text-[#74C0FC]" : "text-white/80",
              )}
            >
              전일 대비 {signed(diff)} {VOL_UNIT} ({diff > 0 ? "+" : ""}
              {pct.toFixed(1)}%)
            </div>
          ) : null}
        </>
      );
    } else {
      const value = tip.kind === "actual" ? r.actualPrice : r.predictedPrice;
      if (value === undefined) return null;
      y = yOf(value);
      if (tip.kind === "turn") {
        body = (
          <>
            <div className="font-bold">{korDate(r.date)}</div>
            <div className="mt-0.5 font-extrabold" style={{ color: "#F5D565" }}>
              {r.turn === "up" ? "상승" : "하락"} 전환 예상
            </div>
            <div className="mt-0.5 text-white/80">
              이후 가격이 {r.turn === "up" ? "상승" : "하락"} 흐름으로 바뀔 가능성이 있어요.
            </div>
          </>
        );
      } else {
        const ref = tip.kind === "actual" ? rows[r.i - 1]?.actualPrice : todayPrice;
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
                {tip.kind === "actual" ? "전일" : "오늘"} 대비 {signed(diff)}원 ({diff > 0 ? "+" : ""}
                {pct.toFixed(1)}%)
              </div>
            ) : null}
          </>
        );
      }
    }
    const bw = 176;
    const left = clamp(x - bw / 2, 2, width - bw - 2);
    const tailX = clamp(x - left, 10, bw - 10);
    return (
      <>
        <div
          className="pointer-events-none absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#111827]"
          style={{ left: x, top: y }}
        />
        <div
          role="tooltip"
          className="pointer-events-none absolute z-10 rounded-[10px] bg-[#111827] px-2.5 py-2 text-meta leading-snug text-white shadow-lg"
          style={{ left, width: bw, bottom: H - y + 10 }}
        >
          {body}
          <span
            className="absolute top-full h-0 w-0 -translate-x-1/2 border-x-[6px] border-t-[6px] border-x-transparent border-t-[#111827]"
            style={{ left: tailX }}
          />
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

  const legend: Array<{ label: string; color: string; kind: "solid" | "dash" | "bar"; dim?: boolean }> = [
    { label: "실제 가격", color: ACTUAL, kind: "solid" },
    { label: "예상 가격", color: PRED, kind: "dash" },
    { label: "상승 예상치", color: UP, kind: "dash", dim: !showUp },
    { label: "하락 예상치", color: DOWN, kind: "dash", dim: !showDown },
    { label: "거래량(과거)", color: VOL_FILL, kind: "bar" },
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
              t.on ? "bg-white" : "border-[#E9ECEF] bg-[#F8F9FA]",
              !t.set && "cursor-default",
            )}
            style={t.on ? { borderColor: t.color, color: t.color } : { color: "#868E96" }}
          >
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: t.on ? t.color : GREY }}
            />
            {t.label}
          </button>
        ))}
      </div>

      {/* 범례 */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pb-2">
        {legend.map((l) => (
          <span
            key={l.label}
            className="inline-flex items-center gap-1 text-meta font-medium text-[#495057]"
            style={{ opacity: l.dim ? 0.35 : 1 }}
          >
            {l.kind === "bar" ? (
              <span className="inline-block h-2.5 w-2 rounded-[1px]" style={{ background: l.color }} />
            ) : (
              <span
                className="inline-block w-4"
                style={{ borderTop: `2px ${l.kind === "dash" ? "dashed" : "solid"} ${l.color}` }}
              />
            )}
            {l.label}
          </span>
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
            onClick={resetView}
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
          {/* 최고 콜아웃 (미래 예상 가격 기준선, 항상 표시) */}
          {maxFut ? (
            <Callout x={xOf(maxFut.i)} y={yOf(maxFut.predictedPrice!) - 16} text={`최고 ${maxFut.predictedPrice!.toLocaleString()}`} color={UP} minX={PAD.left} maxX={PAD.left + plotW} />
          ) : null}

          {/* 끝값 라벨 */}
          {lastVisFuture && showUp ? (
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
