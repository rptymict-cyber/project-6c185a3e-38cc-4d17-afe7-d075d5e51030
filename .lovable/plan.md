# UX 개선 계획 (Phase 1~3)

코드는 아직 수정하지 않습니다. 아래는 우선순위 기반 실행 계획입니다.

---

## Phase 1. 서비스 신뢰성 및 공통 구조

### UX-02 기준일 불일치
1. 대상: `src/routes/index.tsx`, `src/components/home/DataSourceNotice.tsx`, `src/components/home/TodayMarketBanner.tsx`, `src/components/home/RealtimeCropRanking.tsx`, `src/store/notification-events.ts`, `src/lib/date.ts`
2. 방향: 하드코딩된 `2026.07.03`/`14:30`을 제거하고 "기준일 SSOT"를 신설(`src/lib/data-basis.ts`: 기준일, 업데이트 시각, 출처, 단위). 모든 화면은 이 값을 읽고, 표기는 공통 `DataSourceNotice`/기준일 바 컴포넌트로만 렌더.
3. 영향: 홈·시세·통계·예측의 기준일/업데이트 텍스트 전부. 표시 문자열만 변경, 가격 계산 로직은 불변.
4. 다른 화면: 기준일을 문구로 노출하는 모든 화면이 자동 동기화(의도된 변화).

### UX-03 AI 예측 용어
1. 대상: `src/routes/prediction.tsx`, `src/features/prediction/components/*`(Summary/Insight/Scenario/Compare/Rationale), `mockPredictionData.ts` 문구
2. 방향: 비용 미반영 지표에서 "수익" 표현 제거 → "예상 시세 / 예상 가격 / 예상 금액(비용 미반영)". 예측 카드에 "참고용 예측, 비용 미반영" 고정 디스클레이머 1행. 예측 대상일은 "예측 대상일(출하 예정일)" 라벨로 통일.
3. 영향: 예측 화면 텍스트/라벨. 계산식 변경 없음.
4. 다른 화면: 홈의 예측 진입 카드·메뉴 라벨 문구도 동일 사전에 맞춰 정정.

### UX-19 Header / GNB 컴포넌트 통합
1. 대상: `src/components/app-header.tsx`, `src/components/detail-header.tsx`, `src/components/app-shell.tsx`(TopHeader), `src/components/home/HomeSearchHeader.tsx`, `src/components/bottom-nav.tsx`
2. 방향: 헤더를 2종으로 정리 — `AppHeader`(GNB 1차 화면) / `DetailHeader`(하위·상세). `TopHeader`는 폐기하고 `DetailHeader`로 흡수, `HomeSearchHeader`는 `AppHeader`의 `search` 변형으로 재구성(의미 없는 빨간 점 제거, `UnreadBadge`로 통일). 우측 액션 슬롯 규칙(즐겨찾기/알림/새로고침)만 문서화된 조합으로 제한.
3. 영향: 헤더를 쓰는 라우트 약 20개의 import/props 정리.
4. 다른 화면: 전 화면 상단바 높이·정렬·아이콘이 동일해짐. 라우트별 커스텀 헤더는 제거.

---

## Phase 2. 모바일 사용성

### UX-04 Back Navigation
1. 대상: `src/components/detail-header.tsx`, 상세/설정/선택 라우트 전체(`market.*`, `statistics.$variety`, `notifications.settings.*`, `crop-select`, `data-guide`, `grades`, `compare`, `market-compare`, `news.$id`, `watchlist.add`)
2. 방향: 공통 `useBackTo(fallback)` 훅 신설 — 히스토리가 있으면 `history.back()`, 없으면(딥링크) 논리적 부모 경로로 이동. 뒤로가기 없는 상세 화면에 `DetailHeader` 적용.
3. 영향: 상세·설정 화면 내비게이션 일관성.
4. 다른 화면: 시트/모달 Route는 닫기 시 부모 경로 복귀 규칙과 동일 훅 공유.

### UX-05 Touch Target
1. 대상: `src/styles.css`(유틸 추가), `bottom-nav.tsx`, 필터 칩(`filter/period/interest-chips`), `category-tabs.tsx`, `star-toggle.tsx`, 목록 행의 보조 아이콘 버튼
2. 방향: 최소 44×44 규칙을 `@utility tap-target`로 토큰화하고 44 미달 요소에 일괄 적용. 인접 버튼 간 최소 8px 간격 확보. 시각 크기는 유지하고 히트 영역만 확장.
3. 영향: 시각 레이아웃 변화 최소, 오터치 감소.
4. 다른 화면: 칩/탭/아이콘 버튼을 쓰는 전 화면.

### UX-06 Loading 상태
1. 대상: `src/components/common/`(신규 `Skeleton*`), 목록·차트 화면(`live.tsx`, `market.index.tsx`, `statistics.*`, `prediction.tsx`, `search.tsx`)
2. 방향: 카드형/표형/차트형 스켈레톤 3종을 공통 컴포넌트로 정의하고, 데이터 준비 전에는 빈 화면 대신 스켈레톤 표시. 새로고침은 버튼 내 진행 표시 + 결과 분기 토스트(갱신됨/이미 최신/실패).
3. 영향: 초기 진입 체감 속도, 상태 가시성.
4. 다른 화면: 이후 신규 목록 화면도 동일 스켈레톤 사용.

### UX-07 Error Handling
1. 대상: `src/components/empty-state.tsx`, 신규 `ErrorState`, `src/routes/__root.tsx` 에러 컴포넌트, 각 목록/상세 라우트
2. 방향: `EmptyState`(데이터 없음)와 `ErrorState`(실패) 분리. 각 상태에 원인 문구 + 재시도 버튼 + 피드백 진입을 표준 배치. 기준일/출처 안내도 상태 화면에 유지.
3. 영향: 데이터 없음/오류 화면 전부.
4. 다른 화면: 피드백 진입점 정책(홈 하단/메뉴 상단/빈 상태/오류)과 일치.

---

## Phase 3. 데이터 표현 UX

### UX-21 Table / List Pattern
1. 대상: `src/components/common/LoadMoreButton.tsx`, 신규 `DataList`/`ExpertTableView` 공통화, `market.item.*`, `market.wholesale.*`, `compare.tsx`, `market-compare.tsx`, `grades.tsx`, `statistics/MarketAveragesTable.tsx`
2. 방향: 기본은 카드형 리스트(순위 배지, 품목명, kg 단가, 전일대비, 거래량), 표는 "전문가 보기"에서만. 모바일 기본 화면 컬럼 5개 이하. 50건 단위 "더보기"를 `LoadMoreButton`으로 전 화면 통일.
3. 영향: 목록/표 화면의 마크업 정리. 데이터 소스 변경 없음.
4. 다른 화면: 향후 추가 목록도 동일 패턴 강제.

### UX-17 Filter UX
1. 대상: `src/components/market-v2/MarketFilterBar.tsx`, `FilterChipGroup`(신규 공통화), `date-picker-sheet.tsx`, `crop-select.tsx`, `statistics`/`prediction` 조건 그리드
2. 방향: 조건 선택 카드/칩을 단일 컴포넌트로 통일하고 상단에 "적용된 조건 요약 + 초기화" 행 추가. 시트 내부는 검색 → 최근 → 전체 순서로 통일. 조회용 DatePicker와 예측용 DatePicker는 같은 컴포넌트에 `mode`로 분리(과거 허용/미래만).
3. 영향: 시세·통계·예측 필터 영역.
4. 다른 화면: 즐겨찾기 저장 조건 표기도 같은 요약 포맷 사용.

### UX-18 Tab UX
1. 대상: `src/components/category-tabs.tsx`, `src/components/home/HomeCategoryTabs.tsx`, `market.index.tsx` 탭, `statistics` 탭, `live.tsx` 정렬 탭
2. 방향: 세그먼트(2~4개, 상호배타 뷰)와 스크롤 탭(카테고리 다수)을 각각 1개 컴포넌트로 통일. 선택 상태는 URL search로 유지(뒤로가기·딥링크 대응), 스크롤 탭은 선택 항목 자동 스크롤 인. 하단 GNB와 화면 내 탭의 시각 위계 분리.
4. 영향: 탭이 있는 모든 화면의 상태 유지·복귀 동작.
5. 다른 화면: 홈→시세 이동 시 `tab` 파라미터 반영 규칙과 통합.

---

## 기술 메모
- 신규 공통 파일 예정: `src/lib/data-basis.ts`, `src/hooks/useBackTo.ts`, `src/components/common/{SkeletonList,ErrorState,FilterChipGroup,SegmentedTabs}.tsx`
- 기존 기능·라우트는 삭제하지 않고 재배치만 합니다. 작물 선택은 계속 `/crop-select` 단일 경로 재사용.
- Phase 단위로 나눠 적용하고, 각 Phase 후 320/360/390/430px 렌더 점검을 진행합니다.
