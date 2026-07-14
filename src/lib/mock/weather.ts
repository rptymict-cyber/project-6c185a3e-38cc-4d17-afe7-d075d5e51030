type CauseStep = { icon: string; t: string; sm: string; risk?: boolean };
type Weather = {
  region: string;
  regionFull: string;
  current: { icon: string; temp: number; desc: string };
  tip: string;
  forecast: { label: string; icon: string; temp: number }[];
  cause: { steps: CauseStep[]; result: string };
};

// 틸다 날씨 API 교체 대상
export const MOCK_WEATHER: Weather = {
  region: "청송",
  regionFull: "경북 청송",
  current: { icon: "⛅", temp: 28, desc: "구름 조금" },
  tip: "☂ 주말 비",
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
