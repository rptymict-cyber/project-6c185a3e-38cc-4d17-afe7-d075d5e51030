# 농업 뉴스 DS

- Menu ID: news
- Registry: docs/ds/screen-registry.json
- Baseline: 2026-08-05 코드 기준

## NWS-001_news_Default — 뉴스 목록 · 기본 상태

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0701 | 뉴스 목록 | NWS-001_news_Default | Visible | -구성.01: 상단 초록 톤 히어로 배너(제목 "농업 뉴스", 안내 문구 "매일 업데이트되는 농업 뉴스를 확인해보세요.", 우측 신문 일러스트) + 하단 뉴스 카드 목록<br>-표시.01: 카드마다 좌측 정사각 썸네일, 우측 상단 소식 유형 라벨("시장 브리핑"/"농산물 뉴스"/"산지 리포트"/"정책 소식"), 제목(2줄 말줄임), 요약(2줄 말줄임), 하단에 "출처 · 발행일"을 노출<br>-배지.01: AI 작성 기사 카드 상단에 "✨ AI를 통해 작성된 기사" 배지 노출<br>-정렬.01: 카드는 목데이터 배열 순서대로 세로 목록으로 정렬<br>-액션.01: 카드 우측에 이동 화살표 아이콘 표시 | Registry: docs/ds/screen-registry.json<br>Route: /news<br>File: src/routes/news.tsx<br>기술근거.01: AppShell screenId="NEWS-001_농업뉴스"(레지스트리 Screen ID NWS-001과 문자열이 다름)<br>Baseline: 2026-08-05 코드 기준 |
| DS-0701 | 뉴스 목록 | NWS-001_news_Default | Invisible | -데이터소스.01: mockAgriNews 배열(고정 목데이터, src/lib/mock/agri-news.ts)<br>-데이터소스.02: 소식 유형별 강조색은 AGRI_NEWS_TYPE_COLOR 매핑값을 그대로 사용<br>-분기.01: 기사 형식(format)이 "ai"이면 클릭 시 상세 화면으로 전환하고, "link"이고 url이 유효하면 새 탭으로 외부 링크를 연다<br>-분기.02: 썸네일은 AI형이면 공통 AI 기사 썸네일 이미지, 링크형이면 원문 이미지, 이미지가 없으면 초록색 배경의 신문 아이콘으로 대체 표시된다<br>-이동.01: AI 기사 카드 클릭 시 화면 내부 상태 전환으로 상세 뷰를 표시(라우트 이동 없이 같은 페이지에서 목록↔상세 전환)<br>-이동.02: 링크형 기사 카드 클릭 시 새 탭으로 외부 기사 URL을 연다<br>-미구현.01: 이 목록 화면과 /news/$id 상세 라우트가 각각 별도의 상세 뷰 코드를 중복 보유하고 있어 데이터 갱신 시 두 곳을 모두 수정해야 한다 | Registry: docs/ds/screen-registry.json<br>Route: /news<br>File: src/routes/news.tsx<br>기술근거.01: mockAgriNews, AGRI_NEWS_TYPE_COLOR — src/lib/mock/agri-news.ts<br>⚠️ 확인 필요.01: 목록 화면 내부 상태 전환용 NewsDetailView와 라우트 /news/$id(news.$id.tsx)의 상세 뷰 중 실제 서비스에서 사용할 진입 경로가 무엇인지 확인 필요<br>Baseline: 2026-08-05 코드 기준 |
| DS-0701 | 뉴스 목록 | NWS-001_news_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: /news<br>File: src/routes/news.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-0701 | 뉴스 목록 | NWS-001_news_Default | Design | -배경색.01: 히어로 배너 배경 연한 초록색(#EAF5EA)<br>-글자크기.01: 히어로 제목 26px, 글자 굵기 900(black)<br>-글자색.01: 히어로 안내 문구 색상 회색(#495057), 글자 크기 13px<br>-배경색.02: 카드 배경 흰색(#FFFFFF)<br>-테두리.01: 카드 테두리 1px solid 연한 회색(#EEF0F2)<br>-모서리.01: 카드 모서리 반경 16px<br>-안쪽여백.01: 카드 내부 여백 12px<br>-요소간격.01: 카드 사이 세로 간격 12px<br>-그림자.01: 카드 그림자 두 겹(rgba(16,24,40,0.04) 0/1px/2px, rgba(16,24,40,0.06) 0/4px/12px)<br>-크기.01: 썸네일 가로세로 104px, 모서리 반경 14px<br>-배경색.03: AI 배지 배경 연보라색(#F0EBFF), 글자색 보라색(#6741D9), 글자 크기 9.5px<br>-글자크기.02: 카드 제목 14.5px 굵게, 요약 12px, 하단 출처 문구 11px 회색(#868E96) | Registry: docs/ds/screen-registry.json<br>Route: /news<br>File: src/routes/news.tsx<br>Baseline: 2026-08-05 코드 기준 |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## NWS-002_news-id_Default — AI 기사 상세 · 기본 상태

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0702 | AI 기사 상세 | NWS-002_news-id_Default | Visible | -구성.01: 상단 헤더(뒤로가기, 타이틀 "농업 뉴스", 공유·즐겨찾기 아이콘 버튼) + AI 작성 배지 + 기사 제목 + 출처·생성일시 + 대표 이미지(있는 경우) + 본문 문단 + 근거 데이터 카드 + 하단 안내 문구<br>-배지.01: 본문 상단 "✨ AI를 통해 작성된 기사" 배지 노출<br>-표시.01: 출처와 생성 시각을 "{출처} · {생성일} 생성" 형식으로 표시<br>-구성.02: 근거 데이터 카드 제목 "📊 이 기사의 근거 데이터", 안내 문구 "이 기사는 아래 실제 시세 데이터를 기반으로 AI가 작성했습니다."<br>-표시.02: 근거 데이터 카드에 관련 작물 칩("🧅 {작물명}"), 시장명, 조회 기간, 출처명 칩을 태그 형태로 나열<br>-버튼.01: 근거 데이터에 연결 작물 정보가 있으면 "{작물명} 실시간 시세 보러가기" 버튼 노출<br>-문구.01: 하단 고정 안내 문구 "ℹ️ 본 기사는 데이터 기반 AI가 자동 작성한 참고용 콘텐츠입니다. 실제 시세·정책과 차이가 있을 수 있습니다." | Registry: docs/ds/screen-registry.json<br>Route: /news/$id<br>File: src/routes/news.$id.tsx<br>기술근거.01: AppShell screenId="NEWS-002_뉴스상세"(레지스트리 Screen ID NWS-002와 문자열이 다름)<br>Baseline: 2026-08-05 코드 기준 |
| DS-0702 | AI 기사 상세 | NWS-002_news-id_Default | Invisible | -데이터소스.01: mockAgriNews 배열에서 params.id로 항목 조회(src/lib/mock/agri-news.ts)<br>-조건.01: 진입 시 beforeLoad에서 해당 id 기사가 없거나 형식이 "ai"가 아니면 /news로 강제 이동한다<br>-이동.01: 뒤로가기 버튼 클릭 시 /news로 이동<br>-이동.02: "{작물명} 실시간 시세 보러가기" 버튼 클릭 시 /price/$variety로 이동(연결 품종 ID 기준)<br>-미구현.01: 공유 버튼과 즐겨찾기 버튼은 클릭 동작이 연결되어 있지 않다<br>-미구현.02: 문서 하단의 해시태그(#작물명) 목록도 클릭 동작이 없다 | Registry: docs/ds/screen-registry.json<br>Route: /news/$id<br>File: src/routes/news.$id.tsx<br>기술근거.01: mockAgriNews — src/lib/mock/agri-news.ts<br>Baseline: 2026-08-05 코드 기준 |
| DS-0702 | AI 기사 상세 | NWS-002_news-id_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: /news/$id<br>File: src/routes/news.$id.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-0702 | AI 기사 상세 | NWS-002_news-id_Default | Design | -배경색.01: 페이지 배경 흰색(#FFFFFF)<br>-높이.01: 상단 헤더 높이 48px, 하단 테두리 1px solid 연한 회색(#F1F3F5)<br>-글자크기.01: 헤더 타이틀 14px 굵게<br>-배경색.02: AI 배지 배경 연보라색(#F0EBFF), 글자색 보라색(#6741D9)<br>-글자크기.02: 기사 제목 20px, 글자 굵기 900(black), 행간 1.4<br>-글자색.01: 출처·생성일 문구 색상 회색(#6C757D), 글자 크기 12px<br>-모서리.01: 대표 이미지 모서리 반경 16px, 최대 높이 220px<br>-글자크기.03: 본문 문단 13.5px(첫 문단은 14px 굵게), 행간 1.85, 글자색 진회색(#343A40)<br>-배경색.03: 근거 데이터 카드 배경 연한 초록색(#F3FAF6), 테두리 1px solid 연한 초록색(#D8E9E0), 모서리 반경 16px<br>-배경색.04: 근거 데이터 버튼 배경 초록색(#2E9E6B), 글자색 흰색<br>-배경색.05: 하단 안내 문구 배경 연한 회색(#F8F9FA), 글자색 회색(#6C757D), 글자 크기 11px | Registry: docs/ds/screen-registry.json<br>Route: /news/$id<br>File: src/routes/news.$id.tsx<br>Baseline: 2026-08-05 코드 기준 |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## 분석 파일

- src/routes/news.tsx
- src/routes/news.$id.tsx
- src/lib/mock/agri-news.ts
- src/styles.css

## 미구현·확인필요 요약

- ⚠️ 확인 필요.01: 뉴스 목록 화면(news.tsx)이 라우트 이동 없이 내부 상태 전환으로 AI 기사 상세를 자체 렌더링하는 로직과, 별도 라우트 /news/$id(news.$id.tsx)가 거의 동일한 상세 뷰 코드를 각각 보유하고 있어 실제 진입 경로 정책 확인이 필요하다.
- -미구현.01: AI 기사 상세 화면의 공유 버튼과 즐겨찾기 버튼은 클릭해도 아무 동작이 없다.
- -미구현.02: 뉴스 데이터는 전량 목데이터(mockAgriNews)이며 실제 뉴스 API 연동이 되어있지 않다.
