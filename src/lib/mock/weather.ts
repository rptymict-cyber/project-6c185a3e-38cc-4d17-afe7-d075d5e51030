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
  region: "청송",
  regionFull: "경북 청송",
  current: { icon: "⛅", temp: 28, desc: "구름 조금" },
  tip: "☂ 주말 비",
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
