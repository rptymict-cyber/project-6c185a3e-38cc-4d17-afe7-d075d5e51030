# 실시간 시세 DS

- Menu ID: live
- Registry: docs/ds/screen-registry.json
- Baseline: 2026-08-05 코드 기준

## LIV-001_live_Default — 실시간 목록 · 기본 상태

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0301 | 실시간 목록 | LIV-001_live_Default | Visible | -정의.01: `/live` 진입 시 노출되는 전국 실시간 시세 순위 목록 화면.<br>-구성.01: 상단 헤더 → 정렬 탭 → 정렬 기준 안내 문구 → 목록 헤더 행 + 목록 → 더보기 버튼(조건부) → 하단 고정 안내 문구 순서로 배치.<br>-표시.01: 헤더 title "실시간 시세", 알림 아이콘 미노출, 검색 아이콘 노출.<br>-버튼.01: 정렬 탭 3개 "상승률순"/"하락률순"/"거래량순"(현재 선택 탭 강조 표시).<br>-문구.01: 정렬 안내 문구 — "거래량순" 선택 시 "전국 거래량 합계", "상승률순"·"하락률순" 선택 시 "전국 평균가 기준 등락률".<br>-표.01: 목록 헤더 컬럼 — 순위(빈칸 표시), "품목", "현재가", "등락률", "거래량".<br>-목록.01: 각 행에 순위(1부터), 품목 아이콘, 품목명, "시장 · 단위", "현재가원/kg", 등락률 배지, "거래량t"(소수 첫째 자리까지). 최초 노출 건수 50건.<br>-버튼.02: 더보기 버튼 — 노출된 건수가 전체 건수보다 적을 때만 표시, 문구 "더보기".<br>-문구.02: 하단 고정 안내 "정렬/집계는 서버 기준입니다. 클라이언트에서 순서를 바꾸지 않습니다." | Route: /live<br>File: src/routes/live.tsx<br>Baseline: 2026-08-05 코드 기준<br>기술근거.01: LivePriceHeader, LivePriceRowItem, LoadMoreButton(src/components/market/LivePriceRow.tsx, src/components/common/LoadMoreButton.tsx) |
| DS-0301 | 실시간 목록 | LIV-001_live_Default | Invisible | -데이터.01: 목록은 하드코딩된 20건 배열을 정렬 기준·노출 건수 기준으로 정렬·절단한 결과이며, 전체 건수는 항상 20건이다.<br>-조건.01: 화면 진입 시 URL의 정렬 파라미터 값이 "상승률순"/"하락률순"/"거래량순"에 해당하지 않으면 "상승률순"으로 보정한다.<br>-초기값.01: 추가 노출 오프셋 초기값 0, 노출 건수는 기본 50건에 오프셋을 더한 값이다.<br>-정렬.01: "상승률순"은 등락률 내림차순, "하락률순"은 등락률 오름차순, "거래량순"은 거래량 내림차순으로 정렬한다.<br>-조건.02: 노출된 건수가 전체 건수보다 적을 때만 더보기 버튼을 노출한다.<br>-액션.01: 정렬 탭 클릭 시 노출 오프셋을 0으로 초기화하고 URL의 정렬 파라미터를 갱신한다.<br>-액션.02: 목록 행 클릭 시 시세 상세 화면(차트 탭)으로 이동한다.<br>-액션.03: 더보기 버튼 클릭 시 노출 건수를 50건 추가로 늘려 동일 데이터에서 더 많은 항목을 보여준다(추가 데이터 요청 없음).<br>-미구현.01: 목록 데이터는 20개 품목으로 고정된 목업 배열이며 실제 서버 데이터와 연동되지 않는다.<br>-미구현.02: 더보기 클릭 시 서버 재조회 없이 이미 보유한 고정 데이터 범위 안에서 노출 건수만 늘리는 방식으로, 실제 페이지 단위 서버 조회 기능은 구현되어 있지 않다. | Route: /live<br>File: src/routes/live.tsx<br>Baseline: 2026-08-05 코드 기준<br>기술근거.01: getLivePrices({ sort, limit })의 POOL 하드코딩 배열과 sortPool()(src/lib/services/live-prices.ts)<br>기술근거.02: validateSearch sort 보정, useState(offset), navigate({ search: { sort } })(src/routes/live.tsx) |
| DS-0301 | 실시간 목록 | LIV-001_live_Default | Tracking | - | Route: /live<br>File: src/routes/live.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-0301 | 실시간 목록 | LIV-001_live_Default | Design | -배경색.01: 화면 전체 배경 흰색(#FFFFFF), 목록 컨테이너 배경 연회색(#F8F9FA).<br>-배경색.02: 목록 헤더 행 배경 연회색(#FAFBFC), 각 행 구분선 색 연회색(#F1F3F5).<br>-배경색.03: 정렬 탭 활성 배경 초록색(#3A8A3A), 비활성 배경 연회색(#F1F3F5).<br>-배경색.04: 더보기 버튼 배경 흰색(#FFFFFF), 테두리 연회색(#E9ECEF).<br>-글자색.01: 정렬 탭 활성 텍스트 흰색(#FFFFFF), 비활성 텍스트 회색(#6C757D).<br>-글자색.02: 정렬 안내 문구·하단 고정 문구 색 회색(#6C757D).<br>-글자색.03: 목록 헤더 컬럼명 색 회색(#6C757D).<br>-글자색.04: 순위 숫자 색 초록색(#3A8A3A), 품목명 색 짙은 회색(#212529), 부가정보(시장·단위) 색 회색(#6C757D), 현재가 색 짙은 회색(#212529), 거래량 색 회색(#6C757D).<br>-글자색.05: 등락률 배지 상승 텍스트 빨간색(#E03131, 배경 #FFF5F5), 하락 텍스트 파란색(#1971C2, 배경 #EDF2FF), 보합 텍스트 회색(#6C757D, 배경 #F1F3F5).<br>-글자굵기.01: 정렬 탭·품목명 중간 굵게(600), 현재가·순위 굵게(700).<br>-글자크기.01: 정렬 탭 12px, 정렬 안내 10.5px, 목록 헤더 10.5px, 순위 12px, 품목명 14px, 부가정보 10.5px, 현재가 14px, 등락률 배지 11px, 거래량 11px, 하단 고정 문구 10.5px.<br>-모서리.01: 정렬 탭 모서리 완전 둥글게(999px), 목록 컨테이너 10px, 더보기 버튼 10px.<br>-안쪽여백.01: 정렬 탭 위아래 4px·좌우 12px, 목록 헤더 위아래 6px, 각 행 위아래 10px, 더보기 버튼 높이 44px.<br>-바깥여백.01: 화면 좌우 여백 16px, 화면 상단 여백 12px.<br>-요소간격.01: 정렬 탭 사이 간격 6px, 행 내부 요소 간격 8px.<br>-너비.01: 행·헤더 공통 열 너비 순서대로 16px(순위) 28px(아이콘) 나머지 전체(품목) 84px(현재가) 64px(등락률) 52px(거래량).<br>-테두리.01: 목록 헤더 하단 1px 실선 연회색(#F1F3F5), 각 행 상단 1px 실선 연회색(#F1F3F5, 첫 행 제외), 더보기 버튼 테두리 1px 실선 연회색(#E9ECEF).<br>-아이콘크기.01: 품목 아이콘 28px×28px, 등락률 배지 아이콘 12px, 더보기 버튼 화살표 아이콘 16px.<br>-화면폭.01: 화면 컨테이너 최대 너비 430px 모바일 폭 고정. | Route: /live<br>File: src/routes/live.tsx<br>Baseline: 2026-08-05 코드 기준<br>기술근거.01: AppShell(screenId="LIVE-001_실시간시세"), AppHeader, LivePriceHeader, LivePriceRowItem, LoadMoreButton, CropIcon, PriceBadge<br>기술근거.02: LivePriceRow.tsx GRID 상수 "grid grid-cols-[16px_28px_1fr_84px_64px_52px]"<br>기술근거.03: CSS 변수 --surface, --secondary, --muted-foreground, --price-up, --price-up-bg, --price-down, --price-down-bg, --price-flat, --primary, --foreground(src/styles.css) |

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

- 미구현 2건: 목록 데이터가 20건 고정 목업 배열임(DS-0301), 더보기 클릭 시 서버 재조회 없이 노출 건수만 늘리는 방식(DS-0301).
- 확인필요 0건.
