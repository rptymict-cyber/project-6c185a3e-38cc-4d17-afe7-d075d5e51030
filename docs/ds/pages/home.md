# 홈 DS 초안

- Menu ID: home
- Registry: docs/ds/screen-registry.json
- Baseline: 2026-07-31 코드 기준

## HOM-001_root_Default — 홈 대시보드

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0101 | 홈 대시보드 | HOM-001_root_Default | Visible | 정의.01: `/` 진입 시 노출되는 시세 대시보드 화면(컴포넌트 MarketListHome).<br>구성.01: 상단 위치 기반 날씨 배너(HomeWeatherBar) → 검색 진입 버튼(Link to="/search") → AI 시세 예측 카드 섹션(PredictableCropCards) → 실시간 시세 섹션(RealtimeSection) → 농업 뉴스 캐러셀(HomeAgriNewsSection) → 빠른 조회 카드 2개(HomeFeatureCard) → 데이터 출처 안내(DataSourceNotice) 순서로 배치.<br>표시.01: AppHeader title="농산물 시세 조회"와 그 아래 고정 배너 "기준일 2026.07.03 14:30 업데이트"(src/routes/index.tsx 하드코딩 문자열).<br>문구.01: 검색바 placeholder "품목, 시장, 산지, 등급을 검색하세요".<br>문구.02: AI 예측 섹션 제목 "AI 시세 예측" + 배지 "Beta", 부제 "5개 품목의 예상 시세와 유리한 시점을 확인해보세요", 더보기 링크 문구 "더보기".<br>문구.03: 실시간 시세 섹션 제목 "실시간 시세", 더보기 버튼 문구 "더보기 ›".<br>문구.04: 농업 뉴스 섹션 제목 "농업 뉴스", 더보기 링크 문구 "더보기".<br>문구.05: 빠른 조회 섹션 제목 "빠른 조회", 카드1 eyebrow "원하는 품목의 가격을 확인하세요"/title "품목별 조회", 카드2 eyebrow "전국 도매시장 시세를 확인하세요"/title "도매시장별 조회".<br>문구.06: 데이터 출처 안내 "기준일 2026.07.03 \| 단위 원/kg \| 출처 KAMIS / aT \| 14:30 업데이트", 하단 문구 "kg 환산 가격은 제공 데이터 기준이며, 일부 품목은 원 단위로 표시될 수 있습니다."<br>버튼.01: RealtimeSection 상단 정렬 토글 버튼 "상승률순"/"하락률순"/"거래량순"(초기 선택 "상승률순").<br>목록항목.01: PredictableCropCards — PREDICTABLE_CROPS 5개(사과/배추/무/양파/마늘) 카드, 각 카드에 CropIcon, 품목명, "가격.toLocaleString()원/단위", 변화율 배지 "↑ 예측 상승 N%" 또는 "↓ 예측 하락 N%".<br>목록항목.02: RealtimeSection — 상위 5건(HOME_LIMIT=5) 실시간 시세 리스트. 각 행 순위, CropIcon, 품목명, "시장 · 단위", "현재가원/kg"(PriceBadge로 등락률 표시), 거래량(N.Nt).<br>목록항목.03: HomeAgriNewsSection — mockAgriNews 상위 5건 캐러셀. 각 카드 유형 배지(typeLabel), 썸네일(imageUrl 있으면 img, 없으면 Newspaper 아이콘), 제목, 설명, "N분/시간/일 전 · source" 및 하단 캐러셀 인디케이터 dot. | Registry: docs/ds/screen-registry.json<br>Route: /<br>File: src/routes/index.tsx<br>Baseline: 2026-07-31 코드 기준<br>Components: MarketListHome, HomeWeatherBar, PredictableCropCards, RealtimeSection, HomeAgriNewsSection, HomeFeatureCard, DataSourceNotice |
| DS-0101 | 홈 대시보드 | HOM-001_root_Default | Invisible | 데이터소스.01: 실시간 시세 목록 — getLivePrices()(src/lib/services/live-prices.ts)의 POOL 하드코딩 배열 20건, sort/limit만 인자로 받아 정렬된 결과 반환.<br>데이터소스.02: AI 예측 카드 가격/등락률 — PredictableCropCards.tsx 내 HOME_PRICE 상수(품목별 하드코딩 price/changePct/unitLabel).<br>데이터소스.03: 날씨 배너 — MOCK_WEATHER(src/lib/mock/weather.ts) 고정 객체.<br>데이터소스.04: 농업 뉴스 — mockAgriNews(src/lib/mock/agri-news.ts).<br>초기값.01: RealtimeSection 정렬 상태 useState<LiveSort>("up")로 "up" 초기값.<br>조건.01: HomeWeatherBar는 useLocation((s)=>s.granted) 값에 따라 3분기 — granted===false: 위치 허용 유도 버튼 렌더(HOM-001_root_Empty 상태), granted!==true(=null): 아무것도 렌더하지 않음(return null), granted===true: 날씨 배너 렌더.<br>분기.01: 위 조건.01의 3분기.<br>액션.01: 검색바 클릭 → Link to="/search".<br>액션.02: 실시간 시세 "더보기 ›" 클릭 → navigate({ to: "/live", search: { sort } }), 현재 sort 상태를 그대로 전달.<br>액션.03: 실시간 시세 행 클릭 → onSelectCrop(id) 콜백 실행 → router.navigate({ to: "/market", search: { crop: id, tab: "chart" } }).<br>액션.04: PredictableCropCards 카드 클릭 → Link to="/prediction" search={{ cropId, entrySource: "home" }}.<br>액션.05: AI 시세 예측 "더보기" 클릭 → Link to="/prediction".<br>액션.06: 농업 뉴스 카드/더보기 클릭 → Link to="/news".<br>액션.07: 빠른 조회 카드 클릭 → Link to="/market/item" 또는 Link to="/market/wholesale".<br>액션.08: 날씨 배너(granted===true) 클릭 → navigate({ to: "/weather" }), aria-label="{지역명} 날씨 상세 보기".<br>미구현.01: PredictableCropCards.tsx 주석 "홈에 뿌릴 최소 시세 값(예측 가능 5개 작물 전용)" — HOME_PRICE는 하드코딩 값이며 실제 예측 API 미연동.<br>미구현.02: HomeWeatherBar.tsx 및 lib/mock/weather.ts 주석 "틸다 날씨 API 교체 대상" — MOCK_WEATHER 고정값 사용, 실 API 미연동.<br>미구현.03: getLivePrices, mockAgriNews 모두 mock 데이터이며 실 API 연동 없음.<br>미구현.04: 헤더 하단 고정 문구 "기준일 2026.07.03 14:30 업데이트"는 src/routes/index.tsx에 문자열로 하드코딩되어 실시간 갱신되지 않음.<br>확인필요.01: src/store/location.ts 주석에 따르면 mock 단계에서 granted 기본값이 true로 고정되어 있어, 실제 위치 권한 거부/보류 분기(Empty 상태)가 정상 플로우에서 트리거되는 조건은 실 연동 전까지 코드만으로 확인 불가. | Registry: docs/ds/screen-registry.json<br>Route: /<br>File: src/routes/index.tsx<br>Baseline: 2026-07-31 코드 기준<br>Store: src/store/location.ts |
| DS-0101 | 홈 대시보드 | HOM-001_root_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: /<br>File: src/routes/index.tsx<br>Baseline: 2026-07-31 코드 기준 |
| DS-0101 | 홈 대시보드 | HOM-001_root_Default | Design | 컴포넌트.01: AppShell(screenId="HOME-001_홈" data 속성용), AppHeader, MarketListHome, HomeWeatherBar, PredictableCropCards, RealtimeSection→LivePriceHeader/LivePriceRowItem, HomeAgriNewsSection, HomeFeatureCard(+ WholesaleMarketIllustration/ItemBasketIllustration SVG), DataSourceNotice, CropIcon, PriceBadge.<br>클래스.01: 날씨 배너 그라디언트 "linear-gradient(110deg, #0879ca 0%, #0968b6 52%, #07569d 100%)", 카드 rounded-[20px]/[16px]/[10px] 등 Tailwind 임의값 클래스 다수 사용.<br>상태스타일.01: PriceBadge — 상승 bg-price-up-bg/text-price-up, 하락 bg-price-down-bg/text-price-down, 보합(0.05 미만) bg-secondary/text-price-flat.<br>반응형.01: AppShell 컨테이너 max-w-[430px] 모바일 폭 고정. | Registry: docs/ds/screen-registry.json<br>Route: /<br>File: src/routes/index.tsx<br>Baseline: 2026-07-31 코드 기준 |

## HOM-001_root_Empty — 홈 대시보드

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0102 | 홈 대시보드 | HOM-001_root_Empty | Visible | 빈상태.01: HomeWeatherBar에서 위치 권한이 거부(granted===false)된 경우 날씨 배너 대신 노출되는 대체 UI. 점선 테두리 카드에 지도핀 아이콘, 문구 "위치를 허용하면 날씨를 볼 수 있어요", 우측 버튼 문구 "설정 ›". | Registry: docs/ds/screen-registry.json<br>Route: /<br>File: src/components/home/HomeWeatherBar.tsx<br>Baseline: 2026-07-31 코드 기준 |
| DS-0102 | 홈 대시보드 | HOM-001_root_Empty | Invisible | 진입조건.01: useLocation().granted === false 일 때만 이 상태 렌더.<br>액션.01: 버튼 클릭 시 useLocation().request() 호출 → navigator.geolocation.getCurrentPosition 성공 시 granted=true, 실패 시 granted=false 유지, geolocation 미지원 시 즉시 granted=false.<br>미구현.01: src/store/location.ts 기본 상태값이 granted:true로 고정되어 있어(주석: "mock 단계에서는 위치 좌표를 사용하지 않으므로 기본값을 허용 상태로 두어…"), 실제 코드 흐름상 이 Empty 상태는 request() 호출 후 geolocation이 실패한 경우에만 도달. | Registry: docs/ds/screen-registry.json<br>Route: /<br>File: src/components/home/HomeWeatherBar.tsx<br>Baseline: 2026-07-31 코드 기준<br>Store: src/store/location.ts |
| DS-0102 | 홈 대시보드 | HOM-001_root_Empty | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: /<br>File: src/components/home/HomeWeatherBar.tsx<br>Baseline: 2026-07-31 코드 기준 |
| DS-0102 | 홈 대시보드 | HOM-001_root_Empty | Design | 컴포넌트.01: HomeWeatherBar 내 버튼(border-dashed).<br>클래스.01: "rounded-[16px] border border-dashed border-[#E9ECEF] bg-[#FAFAFA]".<br>아이콘.01: lucide MapPin(h-4 w-4, text-[#6C757D]). | Registry: docs/ds/screen-registry.json<br>Route: /<br>File: src/components/home/HomeWeatherBar.tsx<br>Baseline: 2026-07-31 코드 기준 |

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

## 미구현·확인필요 요약

- 미구현 4건: PredictableCropCards HOME_PRICE 하드코딩(DS-0102), HomeWeatherBar/MOCK_WEATHER 날씨 API 미연동(DS-0102), getLivePrices·mockAgriNews mock 데이터(DS-0102), 헤더 하단 고정 문구 하드코딩(DS-0102) + HomeWeatherBar Empty 도달 조건 관련 1건(DS-0106) = 총 5건.
- 확인필요 1건: 위치 권한 기본값(granted:true) 고정으로 인한 Empty 상태 실사용 트리거 조건(DS-0102).
