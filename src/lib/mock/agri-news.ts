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
  imageUrl?: string;
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
    title: "내달 27일부터 농산물 가격 하락분 지원…가격안정제 시행",
    description:
      "농식품부는 가격이 하락한 농산물에 대해 비축, 방출, 소비 촉진 등을 추진하고 하락분 일부를 보전하는 가격안정제를 다음 달부터 시행한다고 밝혔습니다.",
    source: "연합뉴스",
    publishedAt: "2시간 전",
    url: "#",
    imageUrl:
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=400&q=60",
  },
  {
    id: "news-2",
    type: "market-brief",
    typeLabel: "시장 브리핑",
    title: "반토막 났던 양파값, 두 달 만에 80% 반등",
    description:
      "5월 kg당 500원대까지 떨어졌던 양파 도매가격이 7월 들어 1000원대를 회복한 것으로 나타났습니다. 재고 감소와 소비 회복이 맞물린 결과로 풀이됩니다.",
    source: "다음뉴스",
    publishedAt: "6시간 전",
    url: "#",
    imageUrl:
      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=60",
  },
  {
    id: "news-3",
    type: "market-brief",
    typeLabel: "시장 브리핑",
    title: "배추·쪽파·양파·고구마·참외 경락값 분석",
    description:
      "가락시장 시황 분석에서 배추는 저장 물량 반입으로 상승세가 제한되는 흐름으로 나타났고, 쪽파·양파는 강보합, 참외는 약세 흐름을 보였습니다.",
    source: "농민신문",
    publishedAt: "1일 전",
    url: "#",
    imageUrl:
      "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=400&q=60",
  },
  {
    id: "news-4",
    type: "agri-news",
    typeLabel: "농산물 뉴스",
    title: "양파 저장 물량 증가, 도매가격 약세 이어져",
    description:
      "저장 양파 물량이 늘면서 일부 도매시장에서 가격 약세가 이어지고 있습니다. 창고 재고 증가 영향으로 당분간 약보합 흐름이 예상됩니다.",
    source: "농민신문",
    publishedAt: "1일 전",
    url: "#",
  },
  {
    id: "news-5",
    type: "origin-report",
    typeLabel: "산지 리포트",
    title: "사과 주산지 기상 영향으로 반입량 변동",
    description:
      "최근 산지 기상 여건 변화로 일부 시장의 사과 반입량이 변동하고 있습니다. 지역별 작황에 따라 등급별 가격 차이도 벌어지는 모습입니다.",
    source: "한국농업신문",
    publishedAt: "2일 전",
    url: "#",
    imageUrl:
      "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=400&q=60",
  },
];
