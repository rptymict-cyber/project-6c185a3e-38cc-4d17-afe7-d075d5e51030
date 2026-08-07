# 홈 DS

- Menu ID: home
- Registry: docs/ds/screen-registry.json
- Baseline: 2026-08-05 코드 기준

## HOM-001_root_Default — 홈 대시보드 · 기본 상태

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0101 | 홈 대시보드 | HOM-001_root_Default | Visible | -정의.01: `/` 진입 시 노출되는 시세 대시보드 화면. | 단위 원/kg |
| DS-0102 | 홈 대시보드 | HOM-001_root_Default | Visible | -구성.01: 상단 헤더 아래 위치 기반 날씨 배너 → 검색 진입 버튼 → AI 시세 예측 카드 섹션 → 실시간 시세 섹션 → 농업 뉴스 캐러셀 → 빠른 조회 카드 2개 → 데이터 출처 안내 순서로 배치. | - |
| DS-0103 | 홈 대시보드 | HOM-001_root_Default | Visible | -표시.01: 상단 헤더 title "농산물 시세 조회", 그 아래 고정 안내 배너 문구 "기준일 2026.07.03 14:30 업데이트". | - |
| DS-0104 | 홈 대시보드 | HOM-001_root_Default | Visible | -버튼.01: 검색 진입 버튼 문구 "품목, 시장, 산지, 등급을 검색하세요"(돋보기 아이콘 포함, 클릭 시 검색 화면으로 이동). | - |
| DS-0105 | 홈 대시보드 | HOM-001_root_Default | Visible | -문구.01: AI 예측 섹션 제목 "AI 시세 예측" + 배지 "Beta", 부제 "5개 품목의 예상 시세와 유리한 시점을 확인해보세요", 더보기 링크 문구 "더보기". | - |
| DS-0106 | 홈 대시보드 | HOM-001_root_Default | Visible | -문구.02: 실시간 시세 섹션 제목 "실시간 시세", 더보기 버튼 문구 "더보기 ›". | - |
| DS-0107 | 홈 대시보드 | HOM-001_root_Default | Visible | -문구.03: 농업 뉴스 섹션 제목 "농업 뉴스", 더보기 링크 문구 "더보기". | - |
| DS-0108 | 홈 대시보드 | HOM-001_root_Default | Visible | -문구.04: 빠른 조회 섹션 제목 "빠른 조회", 카드1 상단문구 "원하는 품목의 가격을 확인하세요"/제목 "품목별 조회", 카드2 상단문구 "전국 도매시장 시세를 확인하세요"/제목 "도매시장별 조회". | - |
| DS-0109 | 홈 대시보드 | HOM-001_root_Default | Visible | -문구.05: 데이터 출처 안내 "기준일 2026.07.03 | - |
| DS-0110 | 홈 대시보드 | HOM-001_root_Default | Invisible | -데이터.01: 실시간 시세 목록은 하드코딩된 20건 배열을 정렬·상위 노출한 결과이며 정렬·개수 값만 파라미터로 받는다. | Route: /<br>File: src/routes/index.tsx<br>Baseline: 2026-08-05 코드 기준<br>기술근거.01: getLivePrices()의 POOL 하드코딩 배열(src/lib/services/live-prices.ts)<br>기술근거.02: PredictableCropCards.tsx HOME_PRICE 상수<br>기술근거.03: MOCK_WEATHER(src/lib/mock/weather.ts), mockAgriNews(src/lib/mock/agri-news.ts)<br>기술근거.04: useLocation((s)=>s.granted) 상태값(src/store/location.ts)에 따른 HomeWeatherBar.tsx 3분기 렌더<br>⚠️ 확인 필요.01: src/store/location.ts 기본값이 granted:true로 고정되어 있어(주석: "mock 단계에서는 위치 좌표를 사용하지 않으므로 기본값을 허용 상태로 두어…") 위치 권한 거부·보류 분기가 실제 서비스 흐름에서 언제 트리거되는지 코드만으로 확인 불가. |
| DS-0111 | 홈 대시보드 | HOM-001_root_Default | Invisible | -데이터.02: AI 예측 카드의 가격·등락률은 5개 품목에 대해 화면 코드 내에 고정 기재된 값이다. | - |
| DS-0112 | 홈 대시보드 | HOM-001_root_Default | Invisible | -데이터.03: 날씨 배너에 표시되는 지역·기온·날씨 상태는 고정된 목업 값이다. | - |
| DS-0113 | 홈 대시보드 | HOM-001_root_Default | Invisible | -데이터.04: 농업 뉴스 목록은 고정된 목업 데이터다. | - |
| DS-0114 | 홈 대시보드 | HOM-001_root_Default | Invisible | -초기값.01: 실시간 시세 섹션 정렬 기준 초기값은 "상승률순". | - |
| DS-0115 | 홈 대시보드 | HOM-001_root_Default | Invisible | -조건.01: 날씨 배너는 위치 권한 상태에 따라 3가지로 분기된다 — 권한 거부 시 위치 허용 유도 UI(빈 상태) 노출, 권한 응답 대기 중이면 아무것도 표시하지 않음, 권한 허용 시 날씨 배너 표시. | - |
| DS-0116 | 홈 대시보드 | HOM-001_root_Default | Invisible | -상태.01: 위 조건.01의 3분기가 이 화면의 상태 전환 전체다. | - |
| DS-0117 | 홈 대시보드 | HOM-001_root_Default | Invisible | -액션.01: 검색 버튼 클릭 시 검색 화면으로 이동. | - |
| DS-0118 | 홈 대시보드 | HOM-001_root_Default | Invisible | -액션.02: 실시간 시세 "더보기 ›" 클릭 시 실시간 시세 화면으로 이동하며 현재 선택된 정렬 기준을 그대로 전달한다. | - |
| DS-0119 | 홈 대시보드 | HOM-001_root_Default | Invisible | -액션.03: 실시간 시세 행 클릭 시 시세 상세 화면(차트 탭)으로 이동한다. | - |
| DS-0120 | 홈 대시보드 | HOM-001_root_Default | Invisible | -액션.04: AI 예측 카드 클릭 시 예측 화면으로 이동하며 선택 품목과 진입 경로 정보를 함께 전달한다. | - |
| DS-0121 | 홈 대시보드 | HOM-001_root_Default | Invisible | -액션.05: AI 시세 예측 "더보기" 클릭 시 예측 화면으로 이동한다. | - |
| DS-0122 | 홈 대시보드 | HOM-001_root_Default | Invisible | -액션.06: 농업 뉴스 카드 또는 "더보기" 클릭 시 뉴스 화면으로 이동한다. | - |
| DS-0123 | 홈 대시보드 | HOM-001_root_Default | Invisible | -액션.07: 빠른 조회 카드 클릭 시 각각 품목 목록 화면 또는 도매시장 목록 화면으로 이동한다. | - |
| DS-0124 | 홈 대시보드 | HOM-001_root_Default | Invisible | -액션.08: 날씨 배너(허용 상태) 클릭 시 날씨 상세 화면으로 이동한다. | - |
| DS-0125 | 홈 대시보드 | HOM-001_root_Default | Invisible | -미구현.01: AI 예측 카드의 가격·등락률 값은 화면 전용으로 고정 기재된 값이며 실제 예측 결과와 연동되지 않는다. | - |
| DS-0126 | 홈 대시보드 | HOM-001_root_Default | Invisible | -미구현.02: 날씨 배너 표시 값은 외부 날씨 서비스와 연동되지 않은 고정 값이다. | - |
| DS-0127 | 홈 대시보드 | HOM-001_root_Default | Invisible | -미구현.03: 실시간 시세 목록과 농업 뉴스 목록은 모두 고정 데이터이며 외부 데이터 수신 연동이 없다. | - |
| DS-0128 | 홈 대시보드 | HOM-001_root_Default | Invisible | -미구현.04: 헤더 하단 고정 안내 문구("기준일 2026.07.03 14:30 업데이트")는 화면 코드에 문자열로 고정되어 있어 실제 갱신 시각과 무관하게 항상 동일하게 표시된다. | - |
| DS-0129 | 홈 대시보드 | HOM-001_root_Default | Design | -배경색.01: 화면 전체 배경 흰색(#FFFFFF). | Route: /<br>File: src/routes/index.tsx<br>Baseline: 2026-08-05 코드 기준<br>기술근거.01: AppShell(screenId="HOME-001_홈"), AppHeader, MarketListHome, HomeWeatherBar, PredictableCropCards, RealtimeSection→LivePriceHeader/LivePriceRowItem, HomeAgriNewsSection, HomeFeatureCard, DataSourceNotice, CropIcon, PriceBadge<br>기술근거.02: CSS 변수 --background, --primary, --secondary, --price-up, --price-up-bg, --price-down, --price-down-bg, --price-flat, --foreground, --muted-foreground(src/styles.css) |
| DS-0130 | 홈 대시보드 | HOM-001_root_Default | Design | -배경색.02: 검색 진입 버튼 배경 흰색(#FFFFFF), 테두리 연회색(#E8EEE8). | - |
| DS-0131 | 홈 대시보드 | HOM-001_root_Default | Design | -배경색.03: 날씨 배너 배경 파란색 계열 그라데이션(#0879CA → #0968B6 → #07569D, 대각선 110도). | - |
| DS-0132 | 홈 대시보드 | HOM-001_root_Default | Design | -배경색.04: AI 예측 카드 배경 연한 초록색(#F5FAF6), 눌림 시 연한 초록색(#E8F1E8). | - |
| DS-0133 | 홈 대시보드 | HOM-001_root_Default | Design | -배경색.05: 실시간 시세 목록 컨테이너 배경 연회색(#FAFBFA), 목록 헤더 행 배경 연회색(#FAFBFC). | - |
| DS-0134 | 홈 대시보드 | HOM-001_root_Default | Design | -배경색.06: 정렬 토글 활성 배경 초록색(#3A8A3A), 비활성 배경 연회색(#F1F3F5). | - |
| DS-0135 | 홈 대시보드 | HOM-001_root_Default | Design | -배경색.07: 농업 뉴스 카드 배경 흰색(#FFFFFF), 테두리 연회색(#E8EEE8), 썸네일 대체 배경 연한 초록색(#F0F9F0). | - |
| DS-0136 | 홈 대시보드 | HOM-001_root_Default | Design | -배경색.08: 빠른 조회 카드 배경 흰색(#FFFFFF), 테두리 연회색(#E8EEE8), 눌림 시 연회색(#F8F9FA). | - |
| DS-0137 | 홈 대시보드 | HOM-001_root_Default | Design | -글자색.01: 섹션 제목 짙은 남색(#111827), 본문 보조 문구 회색(#6B7280), 데이터 출처 안내 문구 회색(#868E96, 강조 값 #495057). | - |
| DS-0138 | 홈 대시보드 | HOM-001_root_Default | Design | -글자색.02: 검색 안내 문구 색 회색(#6C757D). | - |
| DS-0139 | 홈 대시보드 | HOM-001_root_Default | Design | -글자색.03: AI 예측 변화율 배지 상승 텍스트 빨간색(#E03B3B, 배경 #FDECEC), 하락 텍스트 파란색(#2563EB, 배경 #EAF0FE). | - |
| DS-0140 | 홈 대시보드 | HOM-001_root_Default | Design | -글자색.04: 등락률 배지 상승 텍스트 빨간색(#E03131, 배경 #FFF5F5), 하락 텍스트 파란색(#1971C2, 배경 #EDF2FF), 보합 텍스트 회색(#6C757D, 배경 #F1F3F5). | - |
| DS-0141 | 홈 대시보드 | HOM-001_root_Default | Design | -글자색.05: 실시간 시세 순위 숫자 초록색(#3A8A3A), 품목명 짙은 회색(#212529), 부가정보 회색(#6C757D). | - |
| DS-0142 | 홈 대시보드 | HOM-001_root_Default | Design | -글자굵기.01: 섹션 제목 굵게(700) 18px, 빠른 조회 카드 제목 매우 굵게(800) 18px, 목록 품목명 중간 굵게(600) 14px. | - |
| DS-0143 | 홈 대시보드 | HOM-001_root_Default | Design | -글자크기.01: 섹션 제목 18px(행간 28px), 본문 보조 문구 13px(행간 19.5px), 데이터 출처 안내 11px(행간 16.5px), 실시간 목록 순위 12px, 현재가 14px. | - |
| DS-0144 | 홈 대시보드 | HOM-001_root_Default | Design | -모서리.01: 검색 버튼 모서리 둥글기 12px, AI 예측 카드 10px, 실시간 목록 컨테이너 10px, 농업 뉴스 카드 16px, 빠른 조회 카드 20px, 날씨 배너 20px. | - |
| DS-0145 | 홈 대시보드 | HOM-001_root_Default | Design | -안쪽여백.01: 검색 버튼 위아래 12px·좌우 16px, AI 예측 카드 위아래 10px·좌우 8px, 빠른 조회 카드 위아래 12px·좌우 16px(높이 88px 고정), 농업 뉴스 섹션 카드 16px. | - |
| DS-0146 | 홈 대시보드 | HOM-001_root_Default | Design | -바깥여백.01: 각 섹션 상단 여백 20px, 화면 좌우 여백 16px. | - |
| DS-0147 | 홈 대시보드 | HOM-001_root_Default | Design | -요소간격.01: AI 예측 카드 가로 스크롤 카드 사이 간격 6px, 정렬 토글 버튼 사이 간격 6px. | - |
| DS-0148 | 홈 대시보드 | HOM-001_root_Default | Design | -테두리.01: 검색 버튼·농업 뉴스 카드·빠른 조회 카드 테두리 1px 실선 연회색(#E8EEE8). | - |
| DS-0149 | 홈 대시보드 | HOM-001_root_Default | Design | -그림자.01: 날씨 배너 그림자(0 6px 16px, 파란색 16% 불투명), 농업 뉴스 카드·빠른 조회 카드 그림자(0 4px 16px, 검정 4% 불투명). | - |
| DS-0150 | 홈 대시보드 | HOM-001_root_Default | Design | -아이콘크기.01: 품목 아이콘 24~28px(카드 24px, 실시간 목록 28px), 등락률 배지 아이콘 12px, 검색 아이콘 16px. | - |
| DS-0151 | 홈 대시보드 | HOM-001_root_Default | Design | -화면폭.01: 화면 컨테이너 최대 너비 430px 모바일 폭 고정, 좌우 중앙 정렬. | - |

## HOM-001_root_Empty — 홈 대시보드 · 빈 상태

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0152 | 홈 대시보드 | HOM-001_root_Empty | Visible | -정의.01: 위치 권한이 거부된 경우 날씨 배너 자리에 대신 노출되는 대체 안내 카드. | Route: /<br>File: src/components/home/HomeWeatherBar.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-0153 | 홈 대시보드 | HOM-001_root_Empty | Visible | -표시.01: 점선 테두리 카드에 지도핀 아이콘, 안내 문구 "위치를 허용하면 날씨를 볼 수 있어요", 우측 버튼 문구 "설정 ›". | - |
| DS-0154 | 홈 대시보드 | HOM-001_root_Empty | Invisible | -조건.01: 위치 권한 상태가 "거부"일 때만 이 화면 노출. | Route: /<br>File: src/components/home/HomeWeatherBar.tsx<br>Baseline: 2026-08-05 코드 기준<br>기술근거.01: useLocation().granted===false 분기, request() 호출 시 navigator.geolocation.getCurrentPosition 실패 처리(src/store/location.ts)<br>⚠️ 확인 필요.01: src/store/location.ts 기본값(granted:true) 정책상 이 빈 상태의 실 서비스 진입 경로를 코드만으로 확인 불가. |
| DS-0155 | 홈 대시보드 | HOM-001_root_Empty | Invisible | -액션.01: 안내 카드 클릭 시 위치 권한을 다시 요청하며, 위치 확인 성공 시 날씨 배너로 전환되고 실패 시 이 빈 상태를 유지한다. | - |
| DS-0156 | 홈 대시보드 | HOM-001_root_Empty | Invisible | -미구현.01: 위치 권한 저장 값 기본값이 "허용"으로 고정되어 있어, 실제로는 권한 재요청 후 위치 확인이 실패한 경우에만 이 빈 상태에 도달한다. | - |
| DS-0157 | 홈 대시보드 | HOM-001_root_Empty | Design | -배경색.01: 대체 카드 배경 연회색(#FAFAFA), 테두리 1px 점선 연회색(#E9ECEF). | Route: /<br>File: src/components/home/HomeWeatherBar.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-0158 | 홈 대시보드 | HOM-001_root_Empty | Design | -글자색.01: 안내 문구 회색(#6C757D), 우측 "설정 ›" 문구 진회색(#495057). | - |
| DS-0159 | 홈 대시보드 | HOM-001_root_Empty | Design | -글자크기.01: 안내 문구 12.5px, 우측 버튼 문구 11.5px(중간 굵게 600). | - |
| DS-0160 | 홈 대시보드 | HOM-001_root_Empty | Design | -모서리.01: 모서리 둥글기 16px. | - |
| DS-0161 | 홈 대시보드 | HOM-001_root_Empty | Design | -안쪽여백.01: 위아래 12px·좌우 12px. | - |
| DS-0162 | 홈 대시보드 | HOM-001_root_Empty | Design | -요소간격.01: 아이콘·문구·버튼 사이 간격 8px. | - |
| DS-0163 | 홈 대시보드 | HOM-001_root_Empty | Design | -아이콘크기.01: 지도핀 아이콘 16px×16px, 색상 회색(#6C757D). | - |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## 분석 파일

- src/routes/index.tsx
- src/components/market/MarketListHome.tsx
- src/components/home/HomeWeatherBar.tsx
- src/components/home/PredictableCropCards.tsx
- src/components/market/RealtimeSection.tsx
- src/components/home/HomeAgriNewsSection.tsx
- src/components/home/HomeFeatureCard.tsx
- src/components/home/DataSourceNotice.tsx
- src/components/market/LivePriceRow.tsx
- src/lib/services/live-prices.ts
- src/store/location.ts
- src/lib/mock/weather.ts
- src/lib/mock/agri-news.ts
- src/features/prediction/mockPredictionData.ts
- src/components/crop-icon.tsx
- src/components/price-badge.tsx
- src/components/app-shell.tsx
- src/components/app-header.tsx
- src/components/weather/WeatherIllustration.tsx
- src/styles.css

## 미구현·확인필요 요약

- 미구현 5건: AI 예측 카드 가격 값 화면 전용 고정 기재(DS-0101), 날씨 배너 외부 서비스 미연동(DS-0101), 실시간 시세·농업 뉴스 데이터 미연동(DS-0101), 헤더 하단 고정 안내 문구 값 고정(DS-0101), 위치 권한 거부 빈 상태 도달 조건 특이사항(DS-0102).
- 확인필요 2건: 위치 권한 기본값이 "허용"으로 고정되어 있어 빈 상태 실사용 트리거 조건을 코드만으로 확인 불가(DS-0101, DS-0102).
