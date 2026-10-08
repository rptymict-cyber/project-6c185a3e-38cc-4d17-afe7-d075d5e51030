import { MARKETS } from "@/lib/mock/markets";
import type { PredictionFactor } from "./types";

/** 예측 근거 목업 (작물·도매시장별로 결정적으로 달라짐) — 틸다 API 교체 대상 */

function h(s: string) {
  let x = 0;
  for (const c of s) x = (x * 31 + c.charCodeAt(0)) >>> 0;
  return x;
}
const marketOf = (id: string) => MARKETS.find((m) => m.id === id) ?? MARKETS[0];

/* ---------- 날씨 영향 ---------- */
const WEATHER_BY_MARKET: Record<string, { icon: string; desc: string; temp: number; rain: string; wet: boolean }> = {
  "seoul-garak": { icon: "🌧️", desc: "비", temp: 19, rain: "20~35mm", wet: true },
  "busan-eomgung": { icon: "☀️", desc: "맑음", temp: 23, rain: "0mm", wet: false },
  "daegu-bugbu": { icon: "🌦️", desc: "소나기", temp: 21, rain: "5~15mm", wet: true },
  "gwangju-gakhwa": { icon: "⛅", desc: "구름 조금", temp: 20, rain: "0~2mm", wet: false },
  "daejeon-ojeong": { icon: "🌧️", desc: "비", temp: 18, rain: "15~30mm", wet: true },
};

const CROP_WEATHER: Record<string, { wet: string; dry: string; chip: string; chipVal: string; supply: string }> = {
  apple: { wet: "강수로 수확·선별 작업이 늦어져 반입 감소가 예상가에 반영됨.", dry: "작업 여건이 좋아 반입이 평소 수준을 유지할 전망.", chip: "수확 지연", chipVal: "우려", supply: "↓" },
  cabbage: { wet: "잦은 비로 무름병 우려가 커져 출하 물량 감소 가능.", dry: "생육 여건이 양호해 출하량이 안정적일 전망.", chip: "무름병", chipVal: "주의", supply: "↓" },
  radish: { wet: "강수로 산지 수확이 지연돼 단기 반입이 줄어들 수 있음.", dry: "수확이 원활해 반입이 다소 늘어날 전망.", chip: "수확 작업", chipVal: "지연", supply: "↓" },
  onion: { wet: "비로 저장 품질 관리 부담이 커져 출하 조절 가능성.", dry: "저장 물량 출하가 이어져 공급이 안정적일 전망.", chip: "저장 품질", chipVal: "관리", supply: "↓" },
  garlic: { wet: "습도 상승으로 건조 작업이 늦어져 출하가 지연될 수 있음.", dry: "건조 여건이 좋아 출하 차질은 크지 않을 전망.", chip: "건조 작업", chipVal: "지연", supply: "↓" },
};

export function getWeatherCause(cropId: string, marketId: string) {
  const m = marketOf(marketId);
  const w = WEATHER_BY_MARKET[m.id] ?? WEATHER_BY_MARKET["seoul-garak"];
  const c = CROP_WEATHER[cropId] ?? CROP_WEATHER.apple;
  // 일부 조합은 비가 와도 영향이 작아 "양호"
  const risk = w.wet && h(cropId + m.id) % 3 !== 0;
  return {
    icon: w.icon,
    region: m.region,
    temp: w.temp,
    desc: w.desc,
    rain: w.rain,
    risk,
    badge: risk ? "출하 주의" : "양호",
    sentence: risk ? c.wet : c.dry,
    chip: c.chip,
    chipVal: risk ? c.chipVal : "양호",
    supply: risk ? c.supply : "→",
  };
}

/* ---------- 경매·수급 ---------- */
export function isoWeek(d = new Date()) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const y = t.getUTCFullYear();
  const w = Math.ceil(((t.getTime() - Date.UTC(y, 0, 1)) / 86400000 + 1) / 7);
  return { year: y, week: w };
}

const ORIGINS: Record<string, [string, string, string]> = {
  apple: ["경북", "충북", "경남"],
  cabbage: ["강원", "전남", "충북"],
  radish: ["제주", "강원", "전북"],
  onion: ["전남", "경남", "경북"],
  garlic: ["경남", "충남", "전남"],
};

export function getAuctionSupply(cropId: string, marketId: string, currentPrice: number) {
  const m = marketOf(marketId);
  const k = h(cropId + "|" + m.id);
  const weeklyVolumeTon = Math.round(m.volumeTon * (0.25 + (k % 20) / 100));
  const volumeChangePct = ((k % 130) - 65) / 10;
  const avgChangePct = (((k >> 3) % 80) - 30) / 10;
  const [a, b, c] = ORIGINS[cropId] ?? ORIGINS.apple;
  const p1 = 38 + (k % 9);
  const p2 = 24 + ((k >> 2) % 7);
  const p3 = 14 + ((k >> 4) % 6);
  const origins = [
    { name: a, pct: p1 },
    { name: b, pct: p2 },
    { name: c, pct: p3 },
    { name: "기타", pct: 100 - p1 - p2 - p3 },
  ];
  const { year, week } = isoWeek();
  return {
    marketName: m.name,
    weekLabel: `${year}년 ${week}주차`,
    avgAuctionPrice: currentPrice,
    avgChangePct,
    weeklyVolumeTon,
    volumeChangePct,
    origins,
  };
}

/* ---------- 예측 요인 ---------- */
const FACTORS: Record<string, PredictionFactor[]> = {
  apple: [
    { type: "positive", title: "저장 물량 감소", description: "전년 대비 저장 사과 재고가 줄어 가격 지지 요인." },
    { type: "negative", title: "조생종 출하 증가", description: "조생종 반입이 늘며 중품 위주로 약세 가능." },
    { type: "warning", title: "명절 수요 변동", description: "선물 수요 시점에 따라 단기 변동이 커질 수 있음." },
  ],
  cabbage: [
    { type: "positive", title: "고랭지 작황 부진", description: "고온으로 결구가 늦어 공급이 줄어든 상태." },
    { type: "warning", title: "김장철 수요 대기", description: "김장 수요 시작 시점에 따라 급등락 가능." },
    { type: "negative", title: "정부 비축 방출", description: "비축 물량 방출 시 상승 폭이 제한될 수 있음." },
  ],
  radish: [
    { type: "negative", title: "가을무 출하 확대", description: "가을무 본격 출하로 반입량 증가 예상." },
    { type: "positive", title: "산지 기온 하락", description: "기온 하락으로 생육이 더뎌 공급 조절 가능." },
    { type: "warning", title: "품위 편차 확대", description: "상·하품 가격 차이가 커져 등급별 확인 필요." },
  ],
  onion: [
    { type: "negative", title: "저장 양파 출하 지속", description: "저장 물량이 꾸준히 풀려 약세 압력." },
    { type: "positive", title: "수입량 감소", description: "수입 양파 반입이 줄어 국산 수요 증가." },
    { type: "warning", title: "저장 감모 확대", description: "고온다습 시 감모가 늘어 출하 조절 가능성." },
  ],
  garlic: [
    { type: "positive", title: "생산량 감소", description: "재배면적 감소로 올해 생산량이 줄어든 상태." },
    { type: "warning", title: "깐마늘 수요 변동", description: "가공 수요에 따라 단기 등락이 생길 수 있음." },
    { type: "negative", title: "수입 물량 증가", description: "저가 수입 마늘 유입으로 상승 폭 제한." },
  ],
};
export const getFactors = (cropId: string) => FACTORS[cropId] ?? FACTORS.apple;

/* ---------- 가격 전망 리포트 ---------- */
const CROP_NAME: Record<string, string> = { apple: "사과", cabbage: "배추", radish: "무", onion: "양파", garlic: "마늘" };
const TREND: Record<string, [string, string]> = {
  apple: ["저장 물량 소진과 착색 지연이 겹치며 완만한 상승세를 유지함.", "상단 부근에서 횡보하며 고점 형성 흐름이 예상됨."],
  cabbage: ["고랭지 작황 부진으로 변동성이 큰 강세 흐름을 보임.", "김장 수요 전후로 등락을 반복할 가능성이 높음."],
  radish: ["가을무 출하 전 강보합 흐름을 유지해 옴.", "출하 확대와 함께 점진적인 하향 안정이 예상됨."],
  onion: ["저장 물량 출하로 약보합 흐름이 이어짐.", "하단을 다지며 완만한 반등 시도가 예상됨."],
  garlic: ["생산량 감소로 꾸준한 상승 흐름을 보임.", "강보합 속 완만한 우상향 흐름이 예상됨."],
};
const GRADE_TEXT: Record<string, string> = { all: "전체 등급", 특: "상(특) 등급", 중: "중 등급", 하: "하 등급" };

export function getOutlookReport(cropId: string, marketName: string, rangeDays: number, low: number, high: number, grade: string) {
  const [past, future] = TREND[cropId] ?? TREND.apple;
  const name = CROP_NAME[cropId] ?? "";
  return [
    { title: "과거 가격 추세", body: `${marketName} ${name}(${GRADE_TEXT[grade] ?? "전체 등급"}) 기준 최근 180일간 ${past}` },
    { title: "예측 추세", body: `향후 ${rangeDays}일 예측 범위는 ${Math.round(low).toLocaleString()}~${Math.round(high).toLocaleString()}원임. ${future}` },
    { title: "시장 영향", body: "공급 불확실성이 남아있어 전환 시점 중심으로 진입·이탈 시점을 잡는 것이 유리함." },
  ];
}

/* ---------- 관련 뉴스 ---------- */
const NEWS: Record<string, [string, string, string, string]> = {
  apple: ["주산지 우박 피해로 상품 비율 하락", "경북 사과 착색 지연 장기화", "사과 저장 물량 전년比 감소", "추석 선물 수요 조기 증가"],
  cabbage: ["고랭지 배추 고온 피해 확산", "강원 산지 잦은 비로 수확 차질", "정부, 배추 비축분 방출 검토", "김장철 앞두고 절임배추 예약 증가"],
  radish: ["제주 월동무 파종 지연", "강원 무 생육 부진 우려", "가을무 출하 본격화 전망", "외식 수요 회복에 무 소비 증가"],
  onion: ["저장 양파 감모율 상승", "전남 양파 정식 앞두고 기상 변수", "수입 양파 반입량 감소", "양파 가공 수요 꾸준"],
  garlic: ["마늘 재배면적 감소 공식 집계", "경남 마늘 건조 작업 지연", "수입 마늘 저율관세 물량 확대", "깐마늘 가공업체 매입 증가"],
};
export function getTopicNews(cropId: string) {
  const [a, b, c, d] = NEWS[cropId] ?? NEWS.apple;
  return [
    { title: "🌧️ 기상·생산 리스크", items: [
      { date: "2026-10-06", source: "농민신문", headline: a },
      { date: "2026-10-03", source: "한국농어민", headline: b },
    ] },
    { title: "📦 유통·정책", items: [
      { date: "2026-10-05", source: "aT센터", headline: c },
      { date: "2026-09-30", source: "농수산식품신문", headline: d },
    ] },
  ];
}
