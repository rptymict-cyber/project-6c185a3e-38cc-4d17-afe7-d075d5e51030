type CauseStep = { icon: string; t: string; sm: string; risk?: boolean };

export type HourlyWeather = {
  time: string;
  icon: string;
  temp: number;
  pop: number;
};

export type DailyWeather = {
  dayLabel: string;
  date: string;
  icon: string;
  condition: string;
  pop: number;
  min: number;
  max: number;
  tone?: "today" | "sat" | "sun";
};

export type WeatherMetrics = {
  pop: number;
  humidity: number;
  windMs: number;
  uvLabel: string;
};

type Weather = {
  region: string;
  regionFull: string;
  current: { icon: string; temp: number; desc: string };
  tip: string;
  today: { dateLabel: string; high: number; low: number };
  metrics: WeatherMetrics;
  hourly: HourlyWeather[];
  daily: DailyWeather[];
  advisory: string;
  forecast: { label: string; icon: string; temp: number }[];
  cause: { steps: CauseStep[]; result: string };
};

// 틸다 날씨 API 교체 대상
export const MOCK_WEATHER: Weather = {
  region: "공주시 우성면",
  regionFull: "충남 공주시 우성면",
  current: { icon: "☁️", temp: 28, desc: "대체로 흐림" },
  tip: "주말 비",
  today: { dateLabel: "2026년 7월 3일 금요일", high: 31, low: 24 },
  metrics: { pop: 60, humidity: 72, windMs: 2.1, uvLabel: "보통" },
  hourly: [
    { time: "09시", icon: "⛅", temp: 24, pop: 10 },
    { time: "12시", icon: "⛅", temp: 28, pop: 20 },
    { time: "15시", icon: "🌧️", temp: 31, pop: 60 },
    { time: "18시", icon: "🌧️", temp: 27, pop: 60 },
    { time: "21시", icon: "☁️", temp: 25, pop: 30 },
  ],
  daily: [
    { dayLabel: "오늘", date: "7/3 (금)", icon: "⛅", condition: "구름 조금", pop: 60, min: 24, max: 31, tone: "today" },
    { dayLabel: "토요일", date: "7/4 (토)", icon: "🌧️", condition: "비", pop: 80, min: 24, max: 29, tone: "sat" },
    { dayLabel: "일요일", date: "7/5 (일)", icon: "🌧️", condition: "비", pop: 70, min: 23, max: 28, tone: "sun" },
    { dayLabel: "월요일", date: "7/6 (월)", icon: "⛅", condition: "구름 조금", pop: 20, min: 24, max: 31 },
    { dayLabel: "화요일", date: "7/7 (화)", icon: "☀️", condition: "맑음", pop: 10, min: 24, max: 32 },
  ],
  advisory: "주말 강수 가능성이 있어 출하 및 야외 작업 계획 시 날씨를 확인하세요.",
  forecast: [
    { label: "내일", icon: "🌧️", temp: 24 },
    { label: "모레", icon: "🌧️", temp: 22 },
    { label: "글피", icon: "⛅", temp: 26 },
  ],
  cause: {
    steps: [
      { icon: "🌧️", t: "강수", sm: "20~35mm" },
      { icon: "🍎", t: "수확 지연", sm: "작업 차질" },
      { icon: "📦", t: "반입 감소", sm: "공급 ↓", risk: true },
    ],
    result: "가격 상승 요인",
  },
};

/* -------------------------------------------------------------------------
 * 날짜별 날씨 (예측 그래프 연동용)
 * 실제로는 틸다 날씨 API 교체 대상. 지금은 date 문자열 기반으로 결정적으로
 * 생성한 mock. 데이터 계약을 분리해 뒀으므로 프론트 코드 변경 없이
 * `getWeatherForDate`만 실제 API 응답으로 갈아끼우면 된다.
 * ---------------------------------------------------------------------- */

export type WeatherImpact = "low" | "warn" | "high";

export type DateWeather = {
  date: string; // YYYY-MM-DD
  icon: string;
  temp: number;
  condition: string;
  impact: WeatherImpact;
  cause: { steps: CauseStep[] };
  reason: string;
};

const IMPACT_MAP: Record<
  WeatherImpact,
  { badge: string; badgeBg: string; badgeBorder: string; badgeText: string }
> = {
  low: {
    badge: "영향 적음",
    badgeBg: "#E6F4EA",
    badgeBorder: "#C7E7CE",
    badgeText: "#1F7A50",
  },
  warn: {
    badge: "주의",
    badgeBg: "#FFF4E5",
    badgeBorder: "#FFD59A",
    badgeText: "#C25E00",
  },
  high: {
    badge: "출하 주의",
    badgeBg: "#FEF3F3",
    badgeBorder: "#F6C9C9",
    badgeText: "#C0392B",
  },
};

export function getWeatherImpactStyle(impact: WeatherImpact) {
  return IMPACT_MAP[impact];
}

const WEATHER_VARIANTS: Omit<DateWeather, "date">[] = [
  {
    icon: "☀️",
    temp: 30,
    condition: "맑음",
    impact: "low",
    cause: {
      steps: [
        { icon: "☀️", t: "맑음", sm: "무강수" },
        { icon: "🍎", t: "정상 수확", sm: "차질 없음" },
        { icon: "📦", t: "반입 유지", sm: "공급 안정" },
      ],
    },
    reason: "맑은 날씨로 출하 차질 없음. 공급 안정으로 가격 변동 요인 적음.",
  },
  {
    icon: "⛅",
    temp: 27,
    condition: "구름 조금",
    impact: "low",
    cause: {
      steps: [
        { icon: "⛅", t: "구름 조금", sm: "무강수" },
        { icon: "🍎", t: "정상 수확", sm: "작업 가능" },
        { icon: "📦", t: "반입 유지", sm: "공급 안정" },
      ],
    },
    reason: "출하 여건 양호. 예측 가격은 수급 흐름에 따라 결정됨.",
  },
  {
    icon: "☁️",
    temp: 26,
    condition: "흐림",
    impact: "warn",
    cause: {
      steps: [
        { icon: "☁️", t: "흐림", sm: "일조 부족" },
        { icon: "🍎", t: "수확 지연 우려", sm: "작업 지연", risk: true },
        { icon: "📦", t: "반입 소폭 감소", sm: "공급 ↓" },
      ],
    },
    reason: "흐린 날씨로 일부 산지 작업 지연 가능. 반입 감소가 소폭 반영됨.",
  },
  {
    icon: "🌧️",
    temp: 24,
    condition: "비",
    impact: "high",
    cause: {
      steps: [
        { icon: "🌧️", t: "강수", sm: "20~35mm", risk: true },
        { icon: "🍎", t: "수확 지연", sm: "작업 차질", risk: true },
        { icon: "📦", t: "반입 감소", sm: "공급 ↓", risk: true },
      ],
    },
    reason:
      "비 예보 · 출하 시 작업 차질 가능. 공급 감소가 추천가에 반영됨.",
  },
  {
    icon: "🌦️",
    temp: 25,
    condition: "소나기",
    impact: "warn",
    cause: {
      steps: [
        { icon: "🌦️", t: "소나기", sm: "5~15mm" },
        { icon: "🍎", t: "수확 일부 지연", sm: "간헐 차질", risk: true },
        { icon: "📦", t: "반입 소폭 감소", sm: "공급 ↓" },
      ],
    },
    reason: "간헐적 강수로 일부 산지 출하 조정 가능. 가격 영향 제한적.",
  },
];

function hashDate(iso: string): number {
  let h = 0;
  for (let i = 0; i < iso.length; i++) h = (h * 31 + iso.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/**
 * 특정 날짜의 날씨 조회. 실제로는 틸다 API 호출.
 * 현재는 date 기반 결정적 mock.
 */
export function getWeatherForDate(dateIso: string): DateWeather {
  const h = hashDate(dateIso);
  const v = WEATHER_VARIANTS[h % WEATHER_VARIANTS.length];
  const tempJitter = (h % 5) - 2;
  return {
    date: dateIso,
    icon: v.icon,
    temp: v.temp + tempJitter,
    condition: v.condition,
    impact: v.impact,
    cause: v.cause,
    reason: v.reason,
  };
}

