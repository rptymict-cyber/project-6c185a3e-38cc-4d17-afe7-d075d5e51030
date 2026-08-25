// 데이터 기준(기준일 · 업데이트 시각 · 출처 · 단위) SSOT.
//
// 앱의 모든 화면은 기준일/출처/단위 문구를 이 모듈에서만 읽는다.
// 화면별로 날짜 문자열을 하드코딩하면 화면 간 기준일이 어긋나므로 금지.

import { todayIso } from "./date";

/** 일요일은 도매시장 휴장 — 직전 거래일로 보정 */
function toTradingDay(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d);
  while (dt.getDay() === 0) dt.setDate(dt.getDate() - 1);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${dt.getFullYear()}-${p(dt.getMonth() + 1)}-${p(dt.getDate())}`;
}

/** 조회 기준일(ISO, yyyy-mm-dd) */
export function basisDateIso(): string {
  return toTradingDay(todayIso());
}

/** 조회 기준일 표시 라벨(yyyy.mm.dd) */
export function basisDateLabel(): string {
  return basisDateIso().replaceAll("-", ".");
}

/** 데이터 최종 업데이트 시각(도매시장 집계 확정 시각) */
export const BASIS_UPDATED_TIME = "14:30";

/** 데이터 출처 */
export const BASIS_SOURCE = "KAMIS / aT";

/** 기본 가격 단위 */
export const BASIS_PRICE_UNIT = "원/kg";

/** "기준일 2026.08.25 14:30 업데이트" 한 줄 문구 */
export function basisLineLabel(): string {
  return `기준일 ${basisDateLabel()} ${BASIS_UPDATED_TIME} 업데이트`;
}

/** "2026.08.25 14:30 기준" 짧은 문구 */
export function basisShortLabel(): string {
  return `${basisDateLabel()} ${BASIS_UPDATED_TIME} 기준`;
}
