# 날씨 DS

- Menu ID: weather
- Registry: docs/ds/screen-registry.json
- Baseline: 2026-08-04 코드 기준

## WTR-001_weather_Default — 날씨 상세

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0801 | 날씨 상세 | WTR-001_weather_Default | Visible | 정의.01: `/weather` 진입 시 노출되는 날씨 상세 화면(WeatherDetailPage).<br>구성.01: 커스텀 헤더(뒤로가기+제목) → Hero(현재 위치/기온/날씨 설명/팁/오늘 최고·최저) → 오늘의 지표 4종(강수확률·습도·풍속·자외선) → 시간대별 예보(가로 스크롤) → 주간 예보(리스트) → 농작업 조언(조건부).<br>표시.01: 헤더 중앙 제목 "날씨 상세", 좌측 뒤로가기 버튼(aria-label="뒤로가기").<br>문구.01: Hero 지역 "{w.region}"(공주시 우성면), 현재 기온 "{temp}°C", 날씨 설명 "{desc}"(대체로 흐림), 팁 "{tip}"(주말 비, 존재할 때만 노출), 날짜 "{today.dateLabel}"(2026년 7월 3일 금요일), "최고 {high}°"/"최저 {low}°".<br>지표.01: Metric 4종 — "강수확률 {pop}%", "습도 {humidity}%", "풍속 {windMs}m/s", "자외선 {uvLabel}"(보통).<br>목록항목.01: 시간대별 예보(hourly) 5개 카드 — 시간, 아이콘 이모지, 기온 "{temp}°", 강수확률 "{pop}%".<br>목록항목.02: 주간 예보(daily) 5개 행 — 요일 라벨(오늘/토요일/일요일/월요일/화요일, tone별 색상: today 녹색·sat 파랑·sun 빨강), 날짜, 아이콘, 날씨 설명(condition), 강수확률, "최저°/최고°".<br>문구.02: 시간대별 예보 섹션 제목 "시간대별 예보", 주간 예보 섹션 제목 "주간 예보".<br>도움말.01: 농작업 조언 박스 — w.advisory 값이 있을 때만 노출, 문구 "주말 강수 가능성이 있어 출하 및 야외 작업 계획 시 날씨를 확인하세요." | Registry: docs/ds/screen-registry.json<br>Route: /weather<br>File: src/routes/weather.tsx<br>Baseline: 2026-08-04 코드 기준<br>Components: WeatherIllustration |
| DS-0801 | 날씨 상세 | WTR-001_weather_Default | Invisible | 데이터소스.01: MOCK_WEATHER(src/lib/mock/weather.ts) 고정 객체 하나를 그대로 사용(현재/오늘/지표/시간대별 5건/주간 5건/조언 모두 상수값).<br>조건.01: 팁(tip) 블록은 w.tip 값이 존재(truthy)할 때만 렌더.<br>조건.02: 농작업 조언 블록은 w.advisory 값이 존재할 때만 렌더.<br>액션.01: 뒤로가기 버튼 클릭 → window.history.length > 1 이면 router.history.back(), 아니면 router.navigate({ to: "/" }).<br>미구현.01: lib/mock/weather.ts 주석 "틸다 날씨 API 교체 대상" — MOCK_WEATHER는 하드코딩 값이며 실제 날씨 API 미연동. 지역/현재기온/시간대별·주간 예보 모두 실시간 갱신되지 않음.<br>미구현.02: 이 화면에는 로딩/에러/빈 상태 분기가 코드상 존재하지 않음(항상 동일한 MOCK_WEATHER를 즉시 렌더). | Registry: docs/ds/screen-registry.json<br>Route: /weather<br>File: src/routes/weather.tsx<br>Baseline: 2026-08-04 코드 기준<br>Source: src/lib/mock/weather.ts |
| DS-0801 | 날씨 상세 | WTR-001_weather_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: /weather<br>File: src/routes/weather.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0801 | 날씨 상세 | WTR-001_weather_Default | Design | 배경색.01: 화면 컨테이너 배경 #FFFFFF(--background), 콘텐츠 영역 배경 #F8FAFC.<br>배경색.02: 헤더 배경 #FFFFFF, 하단 테두리 1px solid #E9ECEF.<br>배경색.03: Hero 카드 배경 linear-gradient(135deg, #0D75C7 0%, #0A65B2 55%, #07579C 100%).<br>배경색.04: 지표 카드 배경 #FFFFFF, 테두리 #EEF1F5.<br>배경색.05: 시간대별 예보 카드 배경 #FFFFFF, 테두리 #EEF1F5.<br>배경색.06: 주간 예보 리스트 배경 #FFFFFF, 테두리 #EEF1F5, 행 구분선 #F1F3F5.<br>배경색.07: 농작업 조언 박스 배경 #EAF3FB.<br>글자색.01: Hero 지역/기온/설명/팁/날짜/최고·최저 텍스트 흰색 계열(#FFFFFF, 보조 텍스트 rgba(255,255,255,0.85~0.95)).<br>글자색.02: 지표 라벨 색 #6B7280, 값 색 #111827(자외선 값만 #2878E8).<br>글자색.03: 섹션 제목("시간대별 예보"/"주간 예보") 색 #111827.<br>글자색.04: 시간대별 예보 시간 색 #4B5563, 기온 색 #111827, 강수확률 색 #2878E8.<br>글자색.05: 주간 예보 요일 라벨 색 — today #46933F, sat #2878E8, sun #E43D3D, 그 외 #111827; 날짜 색 #6B7280; 조건 색 #374151; 강수확률 색 #2878E8; 최저 색 #2878E8, 최고 색 #E43D3D, 구분자 "/" 색 #C4C9D0.<br>글자색.06: 농작업 조언 문구 색 #1F3B5B, 아이콘 색 #2878E8.<br>글자두께.01: Hero 기온 font-bold(700), 지역/날씨설명/팁 font-semibold(600), 섹션 제목 font-bold(700), 지표 값 font-bold(700).<br>글자크기.01: Hero 기온 64px/1(line-height none), 단위 "°C" 24px, 지역 13px, 날씨 설명 20px, 팁 14px, 날짜 13px, 최고·최저 14px; 지표 라벨 11.5px, 값 14px; 섹션 제목 17px; 시간대 카드 시간 13px, 기온 17px, 강수확률 11.5px; 주간 예보 요일 14px, 날짜 12.5px, 조건 13.5px, 강수확률 12.5px, 최저·최고 13.5px; 농작업 조언 문구 13px.<br>모서리.01: Hero 카드 radius 24px, 지표 카드 radius 16px, 시간대별 예보 카드 radius 16px, 주간 예보 리스트 radius 16px, 농작업 조언 박스 radius 14px.<br>내부여백.01: Hero 카드 padding 20px(p-5), 최소 높이 220px; 지표 영역 padding 상하 12px(py-3); 시간대별 예보 카드 padding 상하 12px(py-3), 너비 84px; 주간 예보 행 padding 12px 12px(px-3 py-3); 농작업 조언 박스 padding 12px(px-3 py-3).<br>외부여백.01: 각 섹션 상단 여백 12~20px(pt-3/pt-5), 좌우 페이지 padding 16px(px-4).<br>간격.01: Hero 내부 요소 간격 6~12px, 지표 4열 grid divide-x 구분선 색 #EEF1F5, 시간대별 예보 카드 간격 10px(gap-2.5), 주간 예보 행 그리드 컬럼 간격 8px(gap-2).<br>너비.01: 주간 예보 행 그리드 컬럼 폭 70px(요일) 60px(날짜) 28px(아이콘) 1fr(조건) 64px(강수확률) 84px(최저·최고).<br>테두리.01: 지표/시간대별 예보/주간 예보 카드 1px solid #EEF1F5, 주간 예보 리스트 내부 행 구분선 1px solid #F1F3F5.<br>그림자.01: Hero 카드 box-shadow 0 8px 24px rgba(15,23,42,0.08), 0 2px 6px rgba(15,23,42,0.04).<br>아이콘크기.01: 헤더 ChevronLeft 24px(h-6 w-6), 지표 아이콘(Umbrella/Droplets/Wind/Sun) 20px(h-5 w-5), Hero MapPin 14px(h-3.5 w-3.5), 시간대별 예보 Droplets 12px(h-3 w-3), 주간 예보 Umbrella 12px(h-3 w-3), 조언 Info 16px(h-4 w-4).<br>반응형.01: 화면 컨테이너 최대 너비 430px 모바일 폭 고정. | Registry: docs/ds/screen-registry.json<br>Route: /weather<br>File: src/routes/weather.tsx<br>Baseline: 2026-08-04 코드 기준<br>기술 참조: AppShell(screenId="WTR-001_날씨상세"), WeatherIllustration, lucide 아이콘(ChevronLeft, Droplets, Info, MapPin, Sun, Umbrella, Wind) |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## 분석 파일

- src/routes/weather.tsx
- src/components/weather/WeatherIllustration.tsx
- src/lib/mock/weather.ts
- src/components/app-shell.tsx
- src/styles.css

## 미구현·확인필요 요약

- 미구현 2건: MOCK_WEATHER 하드코딩(날씨 API 미연동, DS-0801), 로딩/에러/빈 상태 분기 없음(DS-0801).
- 확인필요 0건.
