export type AgriNewsType =
  | "market-brief"
  | "agri-news"
  | "origin-report"
  | "policy";

export type AgriNewsItem = {
  id: string;
  type: AgriNewsType;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  url?: string;
};

export const AGRI_NEWS_TYPE_LABEL: Record<AgriNewsType, string> = {
  "market-brief": "시장 브리핑",
  "agri-news": "농산물 뉴스",
  "origin-report": "산지 리포트",
  policy: "정책 소식",
};

export const mockAgriNews: AgriNewsItem[] = [
  {
    id: "news-1",
    type: "market-brief",
    title: "배추 출하량 감소로 도매가 상승",
    summary: "여름배추 출하량 감소 영향으로 도매가격이 상승했습니다.",
    source: "연합뉴스",
    publishedAt: "2시간 전",
    url: "#",
  },
  {
    id: "news-2",
    type: "agri-news",
    title: "양파 저장 물량 늘며 가격 약세",
    summary: "창고 재고 증가 영향으로 가격 약세가 이어지고 있습니다.",
    source: "농민신문",
    publishedAt: "4시간 전",
    url: "#",
  },
  {
    id: "news-3",
    type: "origin-report",
    title: "사과 산지 기상 영향으로 반입량 변동",
    summary: "산지 기상 영향으로 일부 시장 반입량 변동이 나타났습니다.",
    source: "한국농업신문",
    publishedAt: "6시간 전",
    url: "#",
  },
  {
    id: "news-4",
    type: "policy",
    title: "농식품부, 여름철 수급 안정 대책 발표",
    summary: "주요 농산물 수급 안정을 위한 지원 대책이 발표됐습니다.",
    source: "농림축산식품부",
    publishedAt: "8시간 전",
    url: "#",
  },
];
