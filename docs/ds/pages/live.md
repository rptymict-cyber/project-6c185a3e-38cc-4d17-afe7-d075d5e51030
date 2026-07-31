# 실시간 시세 DS 초안

- Menu ID: live
- Registry: docs/ds/screen-registry.json
- Baseline: 2026-07-31 코드 기준

## LIV-001_live_Default — 실시간 목록

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0301 | 실시간 목록 | LIV-001_live_Default | Visible | 정의.01: `/live` 진입 시 노출되는 전국 실시간 시세 순위 목록 화면(LivePage).<br>구성.01: AppHeader(검색 아이콘 노출, 알림 아이콘 미노출) → 정렬 탭 → 정렬 기준 안내 문구 → 목록 헤더(LivePriceHeader) + 행 목록(LivePriceRowItem) → 더보기 버튼(조건부) → 하단 안내 문구.<br>표시.01: AppHeader title="실시간 시세", showBell={false}, showSearch={true}.<br>버튼.01: 정렬 탭 3개 "상승률순"/"하락률순"/"거래량순"(현재 선택 탭은 배경 #3A8A3A 강조).<br>문구.01: 정렬 안내 — sort==="vol"이면 "전국 거래량 합계", 그 외("up"/"down")면 "전국 평균가 기준 등락률".<br>테이블.01: LivePriceHeader 컬럼 — 빈칸(순위), "품목"(colspan 2 시각적), "현재가", "등락률", "거래량".<br>목록항목.01: LivePriceRowItem — 순위(1부터), CropIcon, 품목명, "시장 · 단위", "현재가.toLocaleString()원/kg", PriceBadge(등락률), "거래량.toFixed(1)t". 초기 표시 건수 PAGE_SIZE=50(LIST_PAGE_SIZE).<br>버튼.02: 더보기 버튼(LoadMoreButton) — rows.length < total 조건일 때만 노출, 문구 "더보기".<br>문구.02: 하단 고정 안내 "정렬/집계는 서버 기준입니다. 클라이언트에서 순서를 바꾸지 않습니다." | Registry: docs/ds/screen-registry.json<br>Route: /live<br>File: src/routes/live.tsx<br>Baseline: 2026-07-31 코드 기준<br>Components: LivePriceHeader, LivePriceRowItem, LoadMoreButton |
| DS-0301 | 실시간 목록 | LIV-001_live_Default | Invisible | 데이터소스.01: getLivePrices({ sort, limit })(src/lib/services/live-prices.ts) — POOL 하드코딩 배열 20건을 sort 기준으로 정렬 후 slice(offset, offset+limit) 반환. total=20(POOL 전체 길이).<br>검색조건.01: URL search 파라미터 sort — validateSearch에서 "up"/"down"/"vol" 이외 값은 모두 "up"으로 보정(기본값 up).<br>초기값.01: offset useState(0). pageSize = PAGE_SIZE(50) + offset.<br>정렬.01: sortPool() — up: changePct 내림차순, down: changePct 오름차순, vol: volumeTon 내림차순.<br>계산식.01: rows.length < total 일 때만 더보기 버튼 노출.<br>액션.01: 정렬 탭 클릭 → setOffset(0) 후 navigate({ search: { sort: s } })로 URL 갱신(useNavigate({ from: "/live" })).<br>액션.02: 행 클릭 → navigate({ to: "/market", search: { crop: row.id, tab: "chart" } }).<br>액션.03: 더보기 버튼 클릭 → setOffset((o) => o + PAGE_SIZE), 추가로 50건씩 노출 범위 확장(재요청 없이 limit만 증가).<br>미구현.01: live-prices.ts 주석 "mock 단계에서도 '정렬/집계는 서버 책임' 원칙을 반영" — POOL은 하드코딩된 20개 품목 배열이며 실 서버 API 미연동.<br>미구현.02: 페이지네이션이 offset 증가 시 서버 재조회 없이 클라이언트에서 limit만 늘려 동일 POOL을 다시 정렬·slice하는 방식(실 API 페이지네이션 미구현). | Registry: docs/ds/screen-registry.json<br>Route: /live<br>File: src/routes/live.tsx<br>Baseline: 2026-07-31 코드 기준<br>Source: src/lib/services/live-prices.ts |
| DS-0301 | 실시간 목록 | LIV-001_live_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: /live<br>File: src/routes/live.tsx<br>Baseline: 2026-07-31 코드 기준 |
| DS-0301 | 실시간 목록 | LIV-001_live_Default | Design | 컴포넌트.01: AppShell(screenId="LIVE-001_실시간시세"), AppHeader, LivePriceHeader, LivePriceRowItem, LoadMoreButton, CropIcon, PriceBadge.<br>클래스.01: 목록 컨테이너 "rounded-[10px] bg-surface", 정렬 탭 활성 "bg-[#3A8A3A] text-white" 비활성 "bg-[#F1F3F5] text-muted-foreground".<br>토큰.01: LivePriceRow.tsx GRID 상수 "grid grid-cols-[16px_28px_1fr_84px_64px_52px]"로 헤더/행 정렬 통일.<br>상태스타일.01: PriceBadge 상승/하락/보합 색상 토큰(price-up/price-down/price-flat)은 홈과 동일 규칙 사용. | Registry: docs/ds/screen-registry.json<br>Route: /live<br>File: src/routes/live.tsx<br>Baseline: 2026-07-31 코드 기준 |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## 분석 파일

- src/routes/live.tsx
- src/components/market/LivePriceRow.tsx
- src/lib/services/live-prices.ts
- src/components/common/LoadMoreButton.tsx
- src/components/app-shell.tsx
- src/components/app-header.tsx
- src/components/crop-icon.tsx
- src/components/price-badge.tsx

## 미구현·확인필요 요약

- 미구현 2건: POOL 하드코딩(mock, DS-0302), 오프셋 증가 시 서버 재조회 없는 클라이언트 페이지 확장 방식(DS-0302).
- 확인필요 0건.
