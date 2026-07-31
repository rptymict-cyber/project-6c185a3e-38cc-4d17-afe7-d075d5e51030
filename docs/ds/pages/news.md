# 농업 뉴스 DS 초안

- Menu ID: news
- Registry: docs/ds/screen-registry.json
- Baseline: 2026-07-31 코드 기준

## NWS-001_news_Default — 뉴스 목록

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0701 | 뉴스 목록 | NWS-001_news_Default | Visible | 정의.01: 농업 뉴스 목록 화면. 상단 초록 히어로 배너 + 뉴스 카드 리스트로 구성<br>표시.01: 히어로 타이틀 "농업 뉴스", 문구 "매일 업데이트되는 농업 뉴스를<br>확인해보세요."<br>구성.01: 우측 인라인 SVG 일러스트(NewsHeroIllustration)<br>목록항목.01: mockAgriNews 배열을 카드 리스트로 표시. 각 카드: 썸네일(NewsThumb), 유형 라벨(typeLabel, AGRI_NEWS_TYPE_COLOR로 색상 지정), 제목(title, 2줄 clamp), 설명(description, 2줄 clamp), "{source} · {publishedAt}"<br>상태표시.01: format="ai"인 카드에는 "✨ AI를 통해 작성된 기사" 배지 노출 | Registry: docs/ds/screen-registry.json<br>Route: /news<br>File: src/routes/news.tsx<br>Source: src/lib/mock/agri-news.ts |
| DS-0701 | 뉴스 목록 | NWS-001_news_Default | Invisible | 데이터소스.01: mockAgriNews(src/lib/mock/agri-news.ts) 5건 하드코딩 배열(policy 1건, market-brief link 1건, agri-news link 1건, market-brief ai 1건, agri-news ai 1건)<br>분기.01: 카드 클릭 동작이 format에 따라 3가지로 분기됨 — format="ai"이면 setSelected(n)으로 컴포넌트 내부 state를 바꿔 같은 라우트(/news) 안에서 NewsDetailView를 인라인 렌더링(URL 변경 없음). format="link"이고 url이 있으면 <a target="_blank">로 외부 새 창 이동. 그 외에는 클릭해도 아무 동작 없음<br>확인필요.01: format="ai" 기사는 실제로는 /news/$id 라우트(NWS-002, news.$id.tsx)가 별도로 존재하지만, 이 목록 화면(news.tsx)의 클릭 핸들러는 그 라우트로 navigate하지 않고 동일 컴포넌트 내부에서 자체 NewsDetailView를 렌더링함 — 두 상세 구현(news.tsx 내부 NewsDetailView, news.$id.tsx)이 중복 존재하는 것으로 보이며 실제 서비스 URL 정책(공유 링크 시 /news/$id 접근 가능 여부 등)은 코드만으로 확정 불가<br>이동.01: format="ai" 카드 클릭 → setSelected(n) (라우트 이동 아님)<br>이동.02: format="link" && url && url!=="#" → 새 창(target="_blank") 외부 URL 이동<br>미구현.01: format이 link이면서 url이 없거나 "#"인 카드는 클릭해도 아무 반응 없음(비활성 카드) | Registry: docs/ds/screen-registry.json<br>Route: /news<br>File: src/routes/news.tsx |
| DS-0701 | 뉴스 목록 | NWS-001_news_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: /news<br>File: src/routes/news.tsx |
| DS-0701 | 뉴스 목록 | NWS-001_news_Default | Design | 컴포넌트.01: AppShell(screenId="NEWS-001_농업뉴스"), NewsThumb, NewsHeroIllustration(인라인 SVG)<br>클래스.01: 히어로 배경 bg-[#EAF5EA], 카드 rounded-2xl border border-[#EEF0F2] bg-white<br>아이콘.01: lucide-react ChevronRight, Newspaper, Share2, Star(상세 헤더용)<br>반응형.01: AppShell 공통 max-w-[430px] | Registry: docs/ds/screen-registry.json<br>Route: /news<br>File: src/routes/news.tsx |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## NWS-002_news-id_Default — AI 기사 상세

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0702 | AI 기사 상세 | NWS-002_news-id_Default | Visible | 정의.01: AI가 작성한 기사(format="ai")의 상세 화면. 상단 커스텀 헤더(뒤로/공유/즐겨찾기)와 본문으로 구성<br>표시.01: 헤더 중앙 타이틀 "농업 뉴스"<br>문구.01: 상단 배지 "✨ AI를 통해 작성된 기사"<br>표시.02: 기사 제목(item.title), "{source} · {generatedAt ?? publishedAt} 생성"<br>표시.03: 대표 이미지(item.imageUrl 있을 때만)<br>목록항목.01: 본문 문단(item.body 배열)을 순서대로 렌더링, 첫 문단은 굵게(font-bold) 강조<br>구성.01: "📊 이 기사의 근거 데이터" 카드(basis 존재 시): "이 기사는 아래 실제 시세 데이터를 기반으로 AI가 작성했습니다." 안내 + basis.crops/market/period/sourceName 태그 칩<br>버튼.01: "{primaryCrop} 실시간 시세 보러가기 ›" 버튼(basis.cropRouteId 존재 시)<br>도움말.01: "ℹ️ 본 기사는 데이터 기반 AI가 자동 작성한 참고용 콘텐츠입니다. 실제 시세·정책과 차이가 있을 수 있습니다."<br>목록항목.02: basis.crops를 "#{crop}" 해시태그 형태로 하단에 추가 노출 | Registry: docs/ds/screen-registry.json<br>Route: /news/$id<br>File: src/routes/news.$id.tsx<br>Source: src/lib/mock/agri-news.ts |
| DS-0702 | AI 기사 상세 | NWS-002_news-id_Default | Invisible | 진입조건.01: beforeLoad에서 mockAgriNews 중 params.id와 일치하는 항목을 찾아 없거나 format!=="ai"이면 redirect({to:"/news"}) 처리<br>데이터소스.01: mockAgriNews(src/lib/mock/agri-news.ts)에서 useParams().id로 조회<br>이동.01: 헤더 뒤로가기(Link to="/news")<br>이동.02: "{primaryCrop} 실시간 시세 보러가기" 클릭 시 Link to="/price/$variety" params={variety: cropRouteId}로 이동<br>미구현.01: 헤더의 공유(Share2)·즐겨찾기(Star) 버튼은 onClick 핸들러가 없어 클릭해도 아무 동작 없음<br>확인필요.01: 이 라우트(/news/$id)와 news.tsx 내부 인라인 상세(NewsDetailView, setSelected 방식)가 동일한 데이터·UI를 각각 별도로 구현하고 있어, 실제 진입 경로가 두 갈래(뉴스 목록에서 클릭 → 인라인 렌더링 / 직접 URL 접근 → 이 라우트)로 나뉘는 것이 의도된 설계인지 코드만으로 확정 불가 | Registry: docs/ds/screen-registry.json<br>Route: /news/$id<br>File: src/routes/news.$id.tsx |
| DS-0702 | AI 기사 상세 | NWS-002_news-id_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: /news/$id<br>File: src/routes/news.$id.tsx |
| DS-0702 | AI 기사 상세 | NWS-002_news-id_Default | Design | 컴포넌트.01: AppShell(screenId="NEWS-002_뉴스상세")<br>아이콘.01: lucide-react ChevronLeft, Share2, Star, ChevronRight<br>클래스.01: 근거 데이터 카드 rounded-2xl border border-[#D8E9E0] bg-[#F3FAF6]<br>반응형.01: AppShell 공통 max-w-[430px] | Registry: docs/ds/screen-registry.json<br>Route: /news/$id<br>File: src/routes/news.$id.tsx |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## 분석 파일
- src/routes/news.tsx
- src/routes/news.$id.tsx
- src/lib/mock/agri-news.ts
- src/components/news/AgriNewsIcon.tsx (미사용 — 어떤 화면에서도 import되지 않음)
- src/components/app-shell.tsx
- src/components/app-header.tsx

## 미구현·확인필요 요약
총 5건 (미구현 2건, 확인필요 3건)

1. 미구현 — NWS-001_news_Default: format="link"이면서 url이 없거나 "#"인 카드는 클릭 반응 없음.
2. 미구현 — NWS-002_news-id_Default: 헤더 공유(Share2)·즐겨찾기(Star) 버튼에 onClick 핸들러가 없음.
3. 확인필요 — NWS-001_news_Default: AI 기사 카드 클릭이 /news/$id로 이동하지 않고 동일 라우트 내부 state(setSelected)로 상세를 렌더링해 news.$id.tsx와 구현이 중복되는 점이 의도된 설계인지 불명확.
4. 확인필요 — NWS-002_news-id_Default: /news/$id 라우트와 news.tsx 내부 인라인 상세의 관계(진입 경로 이원화)가 의도된 설계인지 불명확.
5. 확인필요 — 프로젝트 전반: AgriNewsIcon.tsx 컴포넌트가 어떤 뉴스 화면에서도 사용되지 않아 실제 사용 여부를 코드만으로 확정 불가.
