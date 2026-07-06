export type MarketCompany = {
  name: string;
  avgKg: number;
  prevAvgKg: number;
  volumeTon: number;
  origin: string; // 출하지
};

export type Market = {
  id: string;
  name: string;
  region: string;
  avgKg: number;
  prevAvgKg: number;
  volumeTon: number;
  companies: MarketCompany[];
};

export const MARKETS: Market[] = [
  {
    id: "seoul-garak",
    name: "서울가락",
    region: "서울특별시",
    avgKg: 3280,
    prevAvgKg: 3210,
    volumeTon: 1240,
    companies: [
      { name: "동화청과", avgKg: 3320, prevAvgKg: 3240, volumeTon: 420, origin: "경북 청송" },
      { name: "중앙청과", avgKg: 3240, prevAvgKg: 3180, volumeTon: 380, origin: "전남 나주" },
      { name: "서울청과", avgKg: 3280, prevAvgKg: 3220, volumeTon: 440, origin: "충남 예산" },
    ],
  },
  {
    id: "seoul-gangseo",
    name: "서울강서",
    region: "서울특별시",
    avgKg: 3210,
    prevAvgKg: 3260,
    volumeTon: 720,
    companies: [
      { name: "강서청과", avgKg: 3180, prevAvgKg: 3260, volumeTon: 380, origin: "전남 해남" },
      { name: "농협강서", avgKg: 3240, prevAvgKg: 3260, volumeTon: 340, origin: "경북 영주" },
    ],
  },
  {
    id: "busan-eomgung",
    name: "부산엄궁",
    region: "부산광역시",
    avgKg: 3140,
    prevAvgKg: 3080,
    volumeTon: 520,
    companies: [
      { name: "엄궁청과", avgKg: 3140, prevAvgKg: 3080, volumeTon: 520, origin: "경남 진주" },
    ],
  },
  {
    id: "busan-banyeo",
    name: "부산반여",
    region: "부산광역시",
    avgKg: 3320,
    prevAvgKg: 3300,
    volumeTon: 380,
    companies: [
      { name: "반여청과", avgKg: 3320, prevAvgKg: 3300, volumeTon: 380, origin: "경남 창원" },
    ],
  },
  {
    id: "daegu-bugbu",
    name: "대구북부",
    region: "대구광역시",
    avgKg: 3180,
    prevAvgKg: 3220,
    volumeTon: 340,
    companies: [
      { name: "북부청과", avgKg: 3160, prevAvgKg: 3200, volumeTon: 200, origin: "경북 청송" },
      { name: "대구농협", avgKg: 3200, prevAvgKg: 3240, volumeTon: 140, origin: "경북 영주" },
    ],
  },
  {
    id: "gwangju-seobu",
    name: "광주서부",
    region: "광주광역시",
    avgKg: 3040,
    prevAvgKg: 3120,
    volumeTon: 280,
    companies: [
      { name: "광주원협", avgKg: 3040, prevAvgKg: 3120, volumeTon: 280, origin: "전남 나주" },
    ],
  },
];

export const ORIGIN_REGIONS = [
  "경북 청송",
  "경북 영주",
  "전남 나주",
  "전남 해남",
  "충남 예산",
  "경남 진주",
  "경남 창원",
];


export function marketsByRegion() {
  const map = new Map<string, Market[]>();
  MARKETS.forEach((m) => {
    if (!map.has(m.region)) map.set(m.region, []);
    map.get(m.region)!.push(m);
  });
  return Array.from(map.entries());
}

export type Origin = { region: string; volumeTon: number; avgKg: number };
export const ORIGINS_BY_MONTH: Record<string, Record<number, Origin[]>> = {
  apple: {
    10: [
      { region: "경북 청송", volumeTon: 320, avgKg: 3280 },
      { region: "경북 영주", volumeTon: 240, avgKg: 3210 },
      { region: "충북 충주", volumeTon: 180, avgKg: 3140 },
    ],
    11: [
      { region: "경북 청송", volumeTon: 420, avgKg: 3180 },
      { region: "경북 영주", volumeTon: 320, avgKg: 3120 },
      { region: "충북 충주", volumeTon: 220, avgKg: 3040 },
    ],
  },
  cabbage: {
    10: [
      { region: "강원 평창", volumeTon: 620, avgKg: 1180 },
      { region: "강원 태백", volumeTon: 420, avgKg: 1140 },
    ],
    11: [
      { region: "전남 해남", volumeTon: 820, avgKg: 1080 },
      { region: "충남 예산", volumeTon: 320, avgKg: 1120 },
    ],
  },
};
