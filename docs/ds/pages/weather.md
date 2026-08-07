# 날씨 DS

- Menu ID: weather
- Registry: docs/ds/screen-registry.json
- Baseline: 2026-08-05 코드 기준

## WTR-001_weather_Default — 날씨 상세 · 기본 상태

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0801 | 날씨 상세 | WTR-001_weather_Default | Visible | -구성.01: 상단 헤더(뒤로가기, 타이틀 "날씨 상세") + 파란색 그라데이션 히어로 카드 + 4열 지표 카드(강수확률/습도/풍속/자외선) + 시간대별 예보 가로 스크롤 + 주간 예보 목록 + 하단 안내 배너 | Registry: docs/ds/screen-registry.json<br>Route: /weather<br>File: src/routes/weather.tsx<br>기술근거.01: AppShell screenId="WTR-001_날씨상세"<br>Baseline: 2026-08-05 코드 기준 |
| DS-0802 | 날씨 상세 | WTR-001_weather_Default | Visible | -표시.01: 히어로 카드에 지역명, 현재 기온(°C), 날씨 설명 문구, 한줄 팁 문구, 날짜 라벨, 오늘 최고·최저 기온을 표시 | - |
| DS-0803 | 날씨 상세 | WTR-001_weather_Default | Visible | -표시.02: 지표 카드 4종에 라벨과 값 표시 "강수확률 {n}%", "습도 {n}%", "풍속 {n}m/s", "자외선 {라벨}" | - |
| DS-0804 | 날씨 상세 | WTR-001_weather_Default | Visible | -표시.03: 시간대별 예보 카드마다 시각, 날씨 아이콘, 기온(°), 강수확률(%)을 표시 | - |
| DS-0805 | 날씨 상세 | WTR-001_weather_Default | Visible | -표시.04: 주간 예보 목록 행마다 요일 라벨, 날짜, 날씨 아이콘, 날씨 설명, 강수확률, 최저·최고 기온을 표시하며 오늘은 초록색, 토요일은 파란색, 일요일은 빨간색으로 요일 글자색을 구분한다 | - |
| DS-0806 | 날씨 상세 | WTR-001_weather_Default | Visible | -문구.01: 하단 안내 배너에 강수 대비 농작업 안내 문구 표시(예: "주말 강수 가능성이 있어 출하 및 야외 작업 계획 시 날씨를 확인하세요.") | - |
| DS-0807 | 날씨 상세 | WTR-001_weather_Default | Invisible | -데이터소스.01: MOCK_WEATHER 고정 목데이터(src/lib/mock/weather.ts), 실제 기상 API로 교체 예정 항목으로 코드에 표기됨 | Registry: docs/ds/screen-registry.json<br>Route: /weather<br>File: src/routes/weather.tsx<br>기술근거.01: MOCK_WEATHER — src/lib/mock/weather.ts<br>Baseline: 2026-08-05 코드 기준 |
| DS-0808 | 날씨 상세 | WTR-001_weather_Default | Invisible | -이동.01: 뒤로가기 버튼 클릭 시 브라우저 히스토리가 있으면 이전 화면으로, 없으면 홈(/)으로 이동 | - |
| DS-0809 | 날씨 상세 | WTR-001_weather_Default | Invisible | -조건.01: 하단 안내 배너는 advisory 값이 있을 때만 노출된다 | - |
| DS-0810 | 날씨 상세 | WTR-001_weather_Default | Invisible | -미구현.01: 지역명, 기온, 예보 등 모든 표시값이 위치 기반 실시간 조회가 아닌 고정된 목데이터이며 사용자 위치와 무관하게 항상 동일한 값이 노출된다 | - |
| DS-0811 | 날씨 상세 | WTR-001_weather_Default | Design | -배경색.01: 페이지 배경 연한 회청색(#F8FAFC) | Registry: docs/ds/screen-registry.json<br>Route: /weather<br>File: src/routes/weather.tsx<br>기술근거.01: WeatherIllustration 컴포넌트(src/components/weather/WeatherIllustration.tsx)로 히어로 우측 일러스트 렌더<br>Baseline: 2026-08-05 코드 기준 |
| DS-0812 | 날씨 상세 | WTR-001_weather_Default | Design | -높이.01: 헤더 높이 52px, 하단 테두리 1px solid 연한 회색(#E9ECEF) | - |
| DS-0813 | 날씨 상세 | WTR-001_weather_Default | Design | -배경색.02: 히어로 카드 배경 파란색 대각 그라데이션(#0D75C7 → #0A65B2 → #07579C), 최소 높이 220px | - |
| DS-0814 | 날씨 상세 | WTR-001_weather_Default | Design | -모서리.01: 히어로 카드 모서리 반경 24px | - |
| DS-0815 | 날씨 상세 | WTR-001_weather_Default | Design | -안쪽여백.01: 히어로 카드 내부 여백 20px | - |
| DS-0816 | 날씨 상세 | WTR-001_weather_Default | Design | -그림자.01: 히어로 카드 그림자 두 겹(rgba(15,23,42,0.08) 0/8px/24px, rgba(15,23,42,0.04) 0/2px/6px) | - |
| DS-0817 | 날씨 상세 | WTR-001_weather_Default | Design | -글자색.01: 히어로 내부 글자 흰색 계열 | - |
| DS-0818 | 날씨 상세 | WTR-001_weather_Default | Design | -글자크기.01: 현재 기온 숫자 64px 굵게 | - |
| DS-0819 | 날씨 상세 | WTR-001_weather_Default | Design | -테두리.01: 지표 카드·시간대별 카드·주간 예보 목록 테두리 1px solid 연한 회색(#EEF1F5) | - |
| DS-0820 | 날씨 상세 | WTR-001_weather_Default | Design | -모서리.02: 지표 카드 및 시간대별 카드 모서리 반경 16px | - |
| DS-0821 | 날씨 상세 | WTR-001_weather_Default | Design | -글자크기.02: 시간대별 예보 시각 13px, 기온 17px 굵게 | - |
| DS-0822 | 날씨 상세 | WTR-001_weather_Default | Design | -상태색.01: 습도·강수확률·자외선 강조 색상 파란색(#2878E8), 자외선 아이콘 색상 주황색(#F4A017) | - |
| DS-0823 | 날씨 상세 | WTR-001_weather_Default | Design | -상태색.02: 주간 예보 오늘 요일 글자색 초록색(#46933F), 토요일 파란색(#2878E8), 일요일 빨간색(#E43D3D) | - |
| DS-0824 | 날씨 상세 | WTR-001_weather_Default | Design | -상태색.03: 최저 기온 글자색 파란색(#2878E8), 최고 기온 글자색 빨간색(#E43D3D) | - |
| DS-0825 | 날씨 상세 | WTR-001_weather_Default | Design | -배경색.03: 하단 안내 배너 배경 연한 파란색(#EAF3FB), 글자색 진한 남색(#1F3B5B), 모서리 반경 14px | - |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## 분석 파일

- src/routes/weather.tsx
- src/lib/mock/weather.ts
- src/components/weather/WeatherIllustration.tsx
- src/styles.css

## 미구현·확인필요 요약

- -미구현.01: 날씨 데이터 전체가 위치·시간과 무관한 고정 목데이터(MOCK_WEATHER)이며, 코드 주석에도 "틸다 날씨 API 교체 대상"으로 명시되어 있어 실제 기상 API 연동이 되어있지 않다.
- ⚠️ 확인 필요.01: 히어로 카드의 지역명이 "공주시 우성면"으로 고정되어 있어, 사용자 위치 기반 표시 정책(GPS 연동 여부, 지역 미설정 시 처리)을 확인할 필요가 있다.
