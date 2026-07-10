export type AgriNewsType =
  | "market-brief"
  | "agri-news"
  | "origin-report"
  | "policy";

export type AgriNewsItem = {
  id: string;
  type: AgriNewsType;
  typeLabel: string;
  title: string;
  description: string;
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
    type: "market-brief",
    typeLabel: "시장 브리핑",
    title: "배추 도매가격 상승, 출하량 감소 영향",
    description:
      "여름배추 산지 출하량 감소로 주요 도매시장에서 가격 상승 흐름이 나타나고 있습니다. 서울 가락시장을 비롯한 주요 시장에서 반입량이 줄어든 것으로 확인됩니다.",
    source: "연합뉴스",
    publishedAt: "2시간 전",
    url: "#",
  },
  {
    id: "news-2",
    type: "agri-news",
    typeLabel: "농산물 뉴스",
    title: "양파 저장 물량 증가, 도매가격 약세",
    description:
      "저장 양파 물량이 늘면서 일부 도매시장에서 가격 약세가 이어지고 있습니다. 창고 재고 증가 영향으로 당분간 약보합 흐름이 예상됩니다.",
    source: "농민신문",
    publishedAt: "4시간 전",
    url: "#",
  },
  {
    id: "news-3",
    type: "origin-report",
    typeLabel: "산지 리포트",
    title: "사과 주산지 기상 영향으로 반입량 변동",
    description:
      "최근 산지 기상 여건 변화로 일부 시장의 사과 반입량이 변동하고 있습니다. 지역별 작황에 따라 등급별 가격 차이도 벌어지는 모습입니다.",
    source: "한국농업신문",
    publishedAt: "6시간 전",
    url: "#",
  },
  {
    id: "news-4",
    type: "policy",
    typeLabel: "정책 소식",
    title: "농식품부, 여름철 주요 농산물 수급 안정 대책 발표",
    description:
      "농림축산식품부가 여름철 주요 농산물 수급 안정을 위한 관리 대책을 발표했습니다. 배추·무 등 주요 품목의 비축 물량 방출 계획이 포함됐습니다.",
    source: "농림축산식품부",
    publishedAt: "8시간 전",
  },
];
