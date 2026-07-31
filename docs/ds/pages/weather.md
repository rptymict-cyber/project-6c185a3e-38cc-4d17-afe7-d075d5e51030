# 날씨 DS 초안

- Menu ID: weather
- Registry: docs/ds/screen-registry.json
- Baseline: 2026-07-31 코드 기준

## WTR-001_weather_Default — 날씨 상세

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0801 | 날씨 상세 | WTR-001_weather_Default | Visible | 정의.01: `/weather` 진입 시 노출되는 날씨 상세 화면(WeatherDetailPage).<br>구성.01: 커스텀 헤더(뒤로가기+제목) → Hero(현재 위치/기온/날씨 설명/팁/오늘 최고·최저) → 오늘의 지표 4종(강수확률·습도·풍속·자외선) → 시간대별 예보(가로 스크롤) → 주간 예보(리스트) → 농작업 조언(조건부).<br>표시.01: 헤더 중앙 제목 "날씨 상세", 좌측 뒤로가기 버튼(aria-label="뒤로가기").<br>문구.01: Hero 지역 "{w.region}"(공주시 우성면), 현재 기온 "{temp}°C", 날씨 설명 "{desc}"(대체로 흐림), 팁 "{tip}"(주말 비, 존재할 때만 노출), 날짜 "{today.dateLabel}"(2026년 7월 3일 금요일), "최고 {high}°"/"최저 {low}°".<br>지표.01: Metric 4종 — "강수확률 {pop}%", "습도 {humidity}%", "풍속 {windMs}m/s", "자외선 {uvLabel}"(보통).<br>목록항목.01: 시간대별 예보(hourly) 5개 카드 — 시간, 아이콘 이모지, 기온 "{temp}°", 강수확률 "{pop}%".<br>목록항목.02: 주간 예보(daily) 5개 행 — 요일 라벨(오늘/토요일/일요일/월요일/화요일, tone별 색상: today 녹색·sat 파랑·sun 빨강), 날짜, 아이콘, 날씨 설명(condition), 강수확률, "최저°/최고°".<br>문구.02: 시간대별 예보 섹션 제목 "시간대별 예보", 주간 예보 섹션 제목 "주간 예보".<br>도움말.01: 농작업 조언 박스 — w.advisory 값이 있을 때만 노출, 문구 "주말 강수 가능성이 있어 출하 및 야외 작업 계획 시 날씨를 확인하세요." | Registry: docs/ds/screen-registry.json<br>Route: /weather<br>File: src/routes/weather.tsx<br>Baseline: 2026-07-31 코드 기준<br>Components: WeatherIllustration |
| DS-0802 | 날씨 상세 | WTR-001_weather_Default | Invisible | 데이터소스.01: MOCK_WEATHER(src/lib/mock/weather.ts) 고정 객체 하나를 그대로 사용(현재/오늘/지표/시간대별 5건/주간 5건/조언 모두 상수값).<br>조건.01: 팁(tip) 블록은 w.tip 값이 존재(truthy)할 때만 렌더.<br>조건.02: 농작업 조언 블록은 w.advisory 값이 존재할 때만 렌더.<br>액션.01: 뒤로가기 버튼 클릭 → window.history.length > 1 이면 router.history.back(), 아니면 router.navigate({ to: "/" }).<br>미구현.01: lib/mock/weather.ts 주석 "틸다 날씨 API 교체 대상" — MOCK_WEATHER는 하드코딩 값이며 실제 날씨 API 미연동. 지역/현재기온/시간대별·주간 예보 모두 실시간 갱신되지 않음.<br>미구현.02: 이 화면에는 로딩/에러/빈 상태 분기가 코드상 존재하지 않음(항상 동일한 MOCK_WEATHER를 즉시 렌더). | Registry: docs/ds/screen-registry.json<br>Route: /weather<br>File: src/routes/weather.tsx<br>Baseline: 2026-07-31 코드 기준<br>Source: src/lib/mock/weather.ts |
| DS-0803 | 날씨 상세 | WTR-001_weather_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: /weather<br>File: src/routes/weather.tsx<br>Baseline: 2026-07-31 코드 기준 |
| DS-0804 | 날씨 상세 | WTR-001_weather_Default | Design | 컴포넌트.01: AppShell(screenId="WTR-001_날씨상세"), WeatherIllustration, lucide 아이콘(ChevronLeft, Droplets, Info, MapPin, Sun, Umbrella, Wind).<br>클래스.01: Hero 카드 배경 "linear-gradient(135deg, #0D75C7 0%, #0A65B2 55%, #07579C 100%)", rounded-[24px].<br>상태스타일.01: 주간 예보 요일 색상 — tone==="today" text-[#46933F], tone==="sat" text-[#2878E8], tone==="sun" text-[#E43D3D], 그 외 text-[#111827](cn 유틸 사용).<br>반응형.01: AppShell 컨테이너 max-w-[430px] 모바일 폭 고정. | Registry: docs/ds/screen-registry.json<br>Route: /weather<br>File: src/routes/weather.tsx<br>Baseline: 2026-07-31 코드 기준 |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## 분석 파일

- src/routes/weather.tsx
- src/components/weather/WeatherIllustration.tsx
- src/lib/mock/weather.ts
- src/components/app-shell.tsx

## 미구현·확인필요 요약

- 미구현 2건: MOCK_WEATHER 하드코딩(날씨 API 미연동, DS-0802), 로딩/에러/빈 상태 분기 없음(DS-0802).
- 확인필요 0건.
