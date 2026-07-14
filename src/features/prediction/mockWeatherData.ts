// 틸다 날씨 API 교체 대상
// 지금은 예측 지원 작물별 대표 산지 + 임시 날씨 mock. RS-001 재배 지역 입력값이
// 생기면 그 값을 우선 사용하고, 없을 때 아래 fallback을 쓴다.

export interface CropWeatherMock {
  region: string;
  current: { icon: string; temp: number; desc: string };
  forecast: { label: string; icon: string; temp: number }[];
  priceImpact?: string;
}

const WEATHER_BY_CROP: Record<string, CropWeatherMock> = {
  apple: {
    region: "경북 청송",
    current: { icon: "⛅", temp: 22, desc: "구름 조금 · 습도 62%" },
    forecast: [
      { label: "내일", icon: "☀️", temp: 24 },
      { label: "모레", icon: "🌧️", temp: 19 },
      { label: "글피", icon: "🌧️", temp: 18 },
    ],
    priceImpact:
      "주 후반 강수 집중 예보 → 수확·반입 지연 시 가격 상승 요인",
  },
  cabbage: {
    region: "강원 평창",
    current: { icon: "🌤️", temp: 18, desc: "맑음 · 습도 55%" },
    forecast: [
      { label: "내일", icon: "☀️", temp: 20 },
      { label: "모레", icon: "⛅", temp: 21 },
      { label: "글피", icon: "🌦️", temp: 17 },
    ],
    priceImpact: "고랭지 기온 안정 → 출하량 유지, 가격 하락 요인",
  },
  radish: {
    region: "제주 구좌",
    current: { icon: "🌦️", temp: 20, desc: "약한 비 · 습도 78%" },
    forecast: [
      { label: "내일", icon: "🌧️", temp: 19 },
      { label: "모레", icon: "⛅", temp: 22 },
      { label: "글피", icon: "☀️", temp: 24 },
    ],
    priceImpact: "잦은 강수로 수확 지연 → 가격 상승 요인",
  },
  onion: {
    region: "전남 무안",
    current: { icon: "☀️", temp: 25, desc: "맑음 · 습도 50%" },
    forecast: [
      { label: "내일", icon: "☀️", temp: 26 },
      { label: "모레", icon: "🌤️", temp: 25 },
      { label: "글피", icon: "⛅", temp: 24 },
    ],
  },
  garlic: {
    region: "경남 창녕",
    current: { icon: "⛅", temp: 23, desc: "구름 많음 · 습도 60%" },
    forecast: [
      { label: "내일", icon: "🌦️", temp: 22 },
      { label: "모레", icon: "🌧️", temp: 20 },
      { label: "글피", icon: "⛅", temp: 22 },
    ],
    priceImpact: "산지 습도 상승 → 저장 손실 우려, 가격 상승 요인",
  },
};

const FALLBACK: CropWeatherMock = {
  region: "주요 산지",
  current: { icon: "⛅", temp: 21, desc: "구름 조금 · 습도 60%" },
  forecast: [
    { label: "내일", icon: "☀️", temp: 22 },
    { label: "모레", icon: "⛅", temp: 21 },
    { label: "글피", icon: "🌦️", temp: 19 },
  ],
};

export function getCropWeather(cropId: string): CropWeatherMock {
  return WEATHER_BY_CROP[cropId] ?? FALLBACK;
}
