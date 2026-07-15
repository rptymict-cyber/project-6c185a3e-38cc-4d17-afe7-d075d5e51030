export type AgriNewsType =
  | "market-brief"
  | "agri-news"
  | "origin-report"
  | "policy";

export type AgriNewsFormat = "link" | "ai";

export type AgriNewsBasis = {
  crops: string[];
  market?: string;
  period?: string;
  sourceName?: string;
  cropRouteId?: string;
};

export type AgriNewsItem = {
  id: string;
  type: AgriNewsType;
  typeLabel: string;
  format: AgriNewsFormat;
  title: string;
  description: string;
  source: string;
  publishedAt: string;
  url?: string;
  imageUrl?: string;
  body?: string[];
  basis?: AgriNewsBasis;
  generatedAt?: string;
};

export const AGRI_NEWS_TYPE_LABEL: Record<AgriNewsType, string> = {
  "market-brief": "시장 브리핑",
  "agri-news": "농산물 뉴스",
  "origin-report": "산지 리포트",
  policy: "정책 소식",
};

/** 소식 유형별 강조 색상 (라벨 텍스트에만 사용) */
export const AGRI_NEWS_TYPE_COLOR: Record<AgriNewsType, string> = {
  "market-brief": "#3A8A3A",
  "agri-news": "#3B82F6",
  "origin-report": "#8B5CF6",
  policy: "#F59E0B",
};

export const mockAgriNews: AgriNewsItem[] = [
  {
    id: "news-1",
    type: "policy",
    typeLabel: "정책 소식",
    format: "link",
    title:
      "농산물 가격 급락하면 정부가 보전…농식품부, 8월 '가격안정제' 첫 도입",
    description:
      "농식품부가 8월 27일부터 농산물 가격이 기준 이하로 떨어질 경우 손실 일부를 보전하는 가격안정제를 처음 도입한다.",
    source: "뉴스핌",
    publishedAt: "2026.07.07",
    url: "https://www.newspim.com/news/view/20260707000937",
    imageUrl:
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=400&q=60",
  },
  {
    id: "news-2",
    type: "market-brief",
    typeLabel: "시장 브리핑",
    format: "link",
    title: "정부·농협 '882억 양파 구하기' 통했다…도매가 두 달 만에 79% 반등",
    description:
      "가락시장 상등급 양파 도매가격이 5월 평균 kg당 570원에서 7월 8일 1022원까지 회복하며 약 79% 반등했다.",
    source: "머니투데이",
    publishedAt: "2026.07.09",
    url: "https://www.mt.co.kr/economy/2026/07/09/2026070913555965606",
    imageUrl:
      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=60",
  },
  {
    id: "news-3",
    type: "agri-news",
    typeLabel: "농산물 뉴스",
    format: "link",
    title: "재고 쌓인데다 생산량 증가…여름배추 약세 이어질 듯",
    description:
      "봄배추 재고 누적과 여름배추 생산량 증가로 가락시장 배추 도매가격 약세가 이어지고 있다.",
    source: "한국농어민신문",
    publishedAt: "2026.07.07",
    url: "https://www.agrinet.co.kr/news/articleView.html?idxno=405485",
    imageUrl:
      "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=400&q=60",
  },
  {
    id: "news-ai-onion",
    type: "market-brief",
    typeLabel: "시장 브리핑",
    format: "ai",
    title: "반토막 났던 양파값, 두 달 만에 80% 반등",
    description:
      "5월 kg당 500원대까지 떨어졌던 양파 도매가격이 7월 들어 1,000원대를 회복하며 두 달 만에 약 80% 반등했다.",
    source: "AGDICT AI",
    publishedAt: "2시간 전",
    body: [
      "5월 kg당 500원대까지 떨어졌던 양파 도매가격이 7월 들어 1,000원대를 회복하며 두 달 만에 약 80% 반등했다.",
      "서울 가락시장 기준 양파 평균 경락가는 6월 중순 저점을 찍은 뒤 저장 물량 소진과 여름철 수요 증가가 맞물리며 꾸준한 오름세를 보이고 있다.",
      "산지에서는 조생종 출하가 마무리 단계에 접어들며 반입량이 줄어든 점도 가격 상승을 뒷받침한 것으로 분석된다.",
    ],
    basis: {
      crops: ["양파"],
      market: "서울 가락시장",
      period: "2026.05.01 ~ 07.14",
      sourceName: "aT KAMIS",
      cropRouteId: "onion",
    },
    generatedAt: "2026.07.15 08:00",
  },
  {
    id: "news-ai-cabbage",
    type: "agri-news",
    typeLabel: "농산물 뉴스",
    format: "ai",
    title: "여름배추 출하 지연에 도매가 강세…이달 말 분수령",
    description:
      "고랭지 여름배추 출하가 늦어지며 가락시장 배추 도매가격이 평년 대비 높은 수준을 유지하고 있다.",
    source: "AGDICT AI",
    publishedAt: "5시간 전",
    body: [
      "고랭지 여름배추 출하가 늦어지며 가락시장 배추 도매가격이 평년 대비 높은 수준을 유지하고 있다.",
      "최근 잦은 강우로 산지 작업이 지연되면서 일일 반입량이 줄었고, 이에 따라 상품(上品) 기준 경락가가 강세를 이어가는 흐름이다.",
      "다만 이달 말 이후 출하가 본격화되면 반입량이 회복되며 가격이 안정될 가능성이 있어, 출하·매입 시점 판단에 주의가 필요하다.",
    ],
    basis: {
      crops: ["배추"],
      market: "서울 가락시장",
      period: "2026.06.15 ~ 07.14",
      sourceName: "aT KAMIS",
      cropRouteId: "cabbage",
    },
    generatedAt: "2026.07.15 09:20",
  },
];
