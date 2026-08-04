# 실시간 시세 DS

- Menu ID: live
- Registry: docs/ds/screen-registry.json
- Baseline: 2026-08-04 코드 기준

## LIV-001_live_Default — 실시간 목록

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0301 | 실시간 목록 | LIV-001_live_Default | Visible | -정의.01: `/live` 진입 시 노출되는 전국 실시간 시세 순위 목록 화면(LivePage).<br>-구성.01: 상단 헤더(검색 아이콘 노출, 알림 아이콘 미노출) → 정렬 탭 → 정렬 기준 안내 문구 → 목록 헤더(LivePriceHeader) + 행 목록(LivePriceRowItem) → 더보기 버튼(조건부) → 하단 안내 문구.<br>-표시.01: 헤더 title "실시간 시세", 알림 아이콘 없음, 검색 아이콘 있음.<br>-버튼.01: 정렬 탭 3개 "상승률순"/"하락률순"/"거래량순"(현재 선택 탭 강조 표시).<br>-문구.01: 정렬 안내 — sort==="vol"이면 "전국 거래량 합계", 그 외("up"/"down")면 "전국 평균가 기준 등락률".<br>-테이블.01: LivePriceHeader 컬럼 — 빈칸(순위), "품목"(colspan 2 시각적), "현재가", "등락률", "거래량".<br>-목록항목.01: LivePriceRowItem — 순위(1부터), CropIcon, 품목명, "시장 · 단위", "현재가.toLocaleString()원/kg", PriceBadge(등락률), "거래량.toFixed(1)t". 초기 표시 건수 PAGE_SIZE=50(LIST_PAGE_SIZE).<br>-버튼.02: 더보기 버튼(LoadMoreButton) — rows.length < total 조건일 때만 노출, 문구 "더보기".<br>-문구.02: 하단 고정 안내 "정렬/집계는 서버 기준입니다. 클라이언트에서 순서를 바꾸지 않습니다." | Registry: docs/ds/screen-registry.json<br>Route: /live<br>File: src/routes/live.tsx<br>Baseline: 2026-08-04 코드 기준<br>Components: LivePriceHeader, LivePriceRowItem, LoadMoreButton |
| DS-0301 | 실시간 목록 | LIV-001_live_Default | Invisible | -데이터소스.01: getLivePrices({ sort, limit })(src/lib/services/live-prices.ts) — POOL 하드코딩 배열 20건을 sort 기준으로 정렬 후 slice(offset, offset+limit) 반환. total=20(POOL 전체 길이).<br>-검색조건.01: URL search 파라미터 sort — validateSearch에서 "up"/"down"/"vol" 이외 값은 모두 "up"으로 보정(기본값 up).<br>-초기값.01: offset useState(0). pageSize = PAGE_SIZE(50) + offset.<br>-정렬.01: sortPool() — up: changePct 내림차순, down: changePct 오름차순, vol: volumeTon 내림차순.<br>-계산식.01: rows.length < total 일 때만 더보기 버튼 노출.<br>-액션.01: 정렬 탭 클릭 → setOffset(0) 후 navigate({ search: { sort: s } })로 URL 갱신(useNavigate({ from: "/live" })).<br>-액션.02: 행 클릭 → navigate({ to: "/market", search: { crop: row.id, tab: "chart" } }).<br>-액션.03: 더보기 버튼 클릭 → setOffset((o) => o + PAGE_SIZE), 추가로 50건씩 노출 범위 확장(재요청 없이 limit만 증가).<br>-미구현.01: live-prices.ts 주석 "mock 단계에서도 '정렬/집계는 서버 책임' 원칙을 반영" — POOL은 하드코딩된 20개 품목 배열이며 실 서버 API 미연동.<br>-미구현.02: 페이지네이션이 offset 증가 시 서버 재조회 없이 클라이언트에서 limit만 늘려 동일 POOL을 다시 정렬·slice하는 방식(실 API 페이지네이션 미구현). | Registry: docs/ds/screen-registry.json<br>Route: /live<br>File: src/routes/live.tsx<br>Baseline: 2026-08-04 코드 기준<br>Source: src/lib/services/live-prices.ts |
| DS-0301 | 실시간 목록 | LIV-001_live_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: /live<br>File: src/routes/live.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0301 | 실시간 목록 | LIV-001_live_Default | Design | -배경색.01: 화면 컨테이너 배경 #FFFFFF(--background). 목록 컨테이너 배경 #F8F9FA(--surface).<br>-배경색.02: 목록 헤더 행 배경 #FAFBFC, 각 행 구분선 색 #F1F3F5.<br>-배경색.03: 정렬 탭 활성 배경 #3A8A3A, 비활성 배경 #F1F3F5(--secondary).<br>-배경색.04: 더보기 버튼 배경 #FFFFFF, 테두리 #E9ECEF.<br>-글자색.01: 정렬 탭 활성 텍스트 #FFFFFF, 비활성 텍스트 #6C757D(--muted-foreground).<br>-글자색.02: 정렬 안내/하단 고정 문구 색 #6C757D.<br>-글자색.03: 목록 헤더 컬럼명 색 #6C757D.<br>-글자색.04: 순위 숫자 색 #3A8A3A(--primary), 품목명 색 #212529(--foreground), 부가정보(시장·단위) 색 #6C757D, 현재가 색 #212529, 거래량 색 #6C757D.<br>-글자색.05: PriceBadge 상승 텍스트 #E03131(배경 #FFF5F5), 하락 텍스트 #1971C2(배경 #EDF2FF), 보합 텍스트 #6C757D(배경 #F1F3F5).<br>-글자두께.01: 정렬 탭 font-semibold(600), 품목명 font-semibold(600), 현재가 font-bold(700), 순위 font-bold(700).<br>-글자크기.01: 정렬 탭 12px, 정렬 안내 10.5px, 목록 헤더 10.5px, 순위 12px, 품목명 14px, 부가정보 10.5px, 현재가 14px, 등락률 배지 11px, 거래량 11px, 하단 고정 문구 10.5px.<br>-모서리.01: 정렬 탭 radius 9999px(rounded-full), 목록 컨테이너 radius 10px, 더보기 버튼 radius 10px.<br>-내부여백.01: 정렬 탭 padding 4px 12px(py-1 px-3), 목록 헤더 padding 6px(py-1.5), 각 행 padding 10px(py-2.5), 더보기 버튼 높이 44px(h-11).<br>-외부여백.01: 페이지 좌우 padding 16px(px-4), 페이지 상단 padding 12px(pt-3).<br>-간격.01: 정렬 탭 사이 간격 6px(gap-1.5), 행 내부 그리드 컬럼 간격 8px(gap-2).<br>-너비.01: 행/헤더 공통 그리드 컬럼 폭 16px(순위) 28px(아이콘) 1fr(품목) 84px(현재가) 64px(등락률) 52px(거래량).<br>-테두리.01: 목록 헤더 하단 1px solid #F1F3F5, 각 행 상단 1px solid #F1F3F5(첫 행 제외), 더보기 버튼 1px solid #E9ECEF.<br>-아이콘크기.01: CropIcon 28px×28px, PriceBadge 아이콘 12px(h-3 w-3), LoadMoreButton ChevronDown 16px(h-4 w-4).<br>-반응형.01: 화면 컨테이너 최대 너비 430px 모바일 폭 고정. | Registry: docs/ds/screen-registry.json<br>Route: /live<br>File: src/routes/live.tsx<br>Baseline: 2026-08-04 코드 기준<br>기술 참조: AppShell(screenId="LIVE-001_실시간시세"), AppHeader, LivePriceHeader, LivePriceRowItem, LoadMoreButton, CropIcon, PriceBadge<br>클래스 참조: LivePriceRow.tsx GRID 상수 "grid grid-cols-[16px_28px_1fr_84px_64px_52px]"<br>토큰 참조: --surface, --secondary, --muted-foreground, --price-up, --price-up-bg, --price-down, --price-down-bg, --price-flat, --primary, --foreground(src/styles.css) |

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
- src/styles.css

## 미구현·확인필요 요약

- 미구현 2건: POOL 하드코딩(mock, DS-0301), 오프셋 증가 시 서버 재조회 없는 클라이언트 페이지 확장 방식(DS-0301).
- 확인필요 0건.
