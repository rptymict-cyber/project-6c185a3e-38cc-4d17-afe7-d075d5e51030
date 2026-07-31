# 통계 DS 초안

- Menu ID: statistics
- Registry: docs/ds/screen-registry.json
- Baseline: 2026-07-31 코드 기준

## STA-001_statistics_Default — 통계 대시보드

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0501 | 통계 대시보드 | STA-001_statistics_Default | Visible | 정의.01: 작물별 가격·거래량 추이와 주산지/시장/등급 통계를 보여주는 대시보드<br>구성.01: AppHeader(제목 "통계") + 필터바(작물 선택 카드, 도매시장 선택 버튼, 기간 세그먼트 탭) + 추이 카드(헤드라인+콤보차트) + KPI 그룹 + 주산지 도넛 + 도매시장 도넛 + 등급별 평균가 + StatsMarketSheet(바텀시트)<br>제목.01: 통계<br>문구.01: 2026년 7월 중순 기준<br>문구.02: "{작물명}{품종명} 평균 가격은 {headlinePrice}원 (kg당)"<br>문구.03: 가격 · 거래량 추이<br>문구.04: 원/kg · 거래량 t<br>필터.01: 작물 선택 카드(FullSelectCard) → /crop-select 이동<br>필터.02: 도매시장 선택 버튼 → StatsMarketSheet 오픈<br>필터.03: 기간 세그먼트 탭(일별/월별/연도별, PERIOD_TABS)<br>상태표시.01: 기간 탭 선택 시 스타일(bg-white text-[#1F5C1F] shadow-sm), 미선택 시 text-[#6C757D] | Registry: docs/ds/screen-registry.json<br>Route: /statistics<br>File: src/routes/statistics.index.tsx<br>Baseline: 2026-07-31 코드 기준 |
| DS-0501 | 통계 대시보드 | STA-001_statistics_Default | Invisible | 진입조건.01: /statistics 라우트 접근<br>데이터소스.01: useStatistics(zustand, 비persist) crop/markets/period 상태 + mock 데이터(src/lib/mock/statistics-mock.ts)의 CROPS/buildSeries/buildKpis/getOriginShare/getMarketShare/getGradeAvg + useCropSelection(committed)<br>API.01: 없음(전부 결정론적 mock 함수, 파일 주석에 "Replace buildSeries, buildGauges, ... with real API calls when backend lands" 명시)<br>초기값.01: useStatistics 기본값 crop="cabbage" markets=["전국"] period="day"<br>자동동작.01: committed.itemId가 비어 있으면 최초 진입 시 categoryId="06" itemId="0602"(배추) varietyId="ALL"로 자동 seed(commitDraft)<br>자동동작.02: committed.itemId 변경 시 ITEM_NAME_TO_CROP_ID 매핑으로 useStatistics.crop 동기화<br>계산식.01: headlinePrice = markets[0] 기준 series 값 평균 후 반올림<br>계산식.02: marketLabel = markets.length===1 ? markets[0] : `${markets[0]} 외 ${markets.length-1}`<br>필터조건.01: 기간(day/month/year) 변경 시 buildSeries/buildKpis 재계산<br>분기.01: 코드상 Loading/Error/Empty 분기 없음 — mock 데이터가 항상 즉시 반환되어 Default 상태만 존재<br>액션.01: 기간 탭 클릭 → setPeriod(t.id)<br>액션.02: 도매시장 버튼 클릭 → setMarketOpen(true)<br>액션.03: StatsMarketSheet onConfirm → setMarkets(선택 시장 배열)<br>미구현.01: 실제 백엔드 API 미연동, 모든 수치는 statistics-mock.ts의 결정론적 시드(seed) 기반 값<br>확인필요.01: "2026년 7월 중순 기준" 문구가 하드코딩되어 있어 실제 서비스 시점에 따른 갱신 로직이 코드에 없음 | Registry: docs/ds/screen-registry.json<br>Route: /statistics<br>File: src/routes/statistics.index.tsx<br>Store: src/store/statistics.ts, src/store/cropSelection.ts<br>Source: src/lib/mock/statistics-mock.ts<br>Baseline: 2026-07-31 코드 기준 |
| DS-0501 | 통계 대시보드 | STA-001_statistics_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: /statistics<br>File: src/routes/statistics.index.tsx<br>Baseline: 2026-07-31 코드 기준 |
| DS-0501 | 통계 대시보드 | STA-001_statistics_Default | Design | 컴포넌트.01: AppShell, AppHeader, FullSelectCard, StatsTrendChart, StatsKpiGroup, StatsDonut, StatsGradeBars, StatsMarketSheet<br>클래스.01: sticky top-[52px] 필터바, rounded-[16px] 카드<br>아이콘.01: ChevronDown<br>상태스타일.01: 기간 탭 선택 시 bg-white 텍스트 #1F5C1F<br>반응형.01: 없음 | Registry: docs/ds/screen-registry.json<br>Route: /statistics<br>File: src/routes/statistics.index.tsx<br>Components: src/components/statistics/StatsTrendChart.tsx, StatsKpiGroup.tsx, StatsDonut.tsx, StatsGradeBars.tsx<br>Baseline: 2026-07-31 코드 기준 |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## STA-002_statistics-id_Default — 품종 통계

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0502 | 품종 통계 | STA-002_statistics-id_Default | Visible | 표시.01: 실제 렌더링되는 화면 요소 없음 — component가 항상 null을 반환(리다이렉트 전용 라우트) | Registry: docs/ds/screen-registry.json<br>Route: /statistics/$variety<br>File: src/routes/statistics.$variety.tsx<br>Baseline: 2026-07-31 코드 기준 |
| DS-0502 | 품종 통계 | STA-002_statistics-id_Default | Invisible | 진입조건.01: /statistics/$variety 경로 접근(동적 세그먼트 $variety 값과 무관)<br>분기.01: beforeLoad에서 조건 없이 항상 redirect({to:"/statistics"}) 실행<br>이동.01: /statistics로 즉시 리다이렉트<br>미구현.01: 소스 주석 "Legacy detail route — new statistics screen holds all state at /statistics." — 품종별 개별 통계 화면은 더 이상 구현되어 있지 않고 /statistics 화면으로 흡수됨<br>확인필요.01: screenId STA-002가 실질적으로 화면을 갖지 않는(리다이렉트 전용) 레거시 라우트인데, 이 라우트를 계속 유지해야 하는지 업무적으로 확인 필요 | Registry: docs/ds/screen-registry.json<br>Route: /statistics/$variety<br>File: src/routes/statistics.$variety.tsx<br>Baseline: 2026-07-31 코드 기준 |
| DS-0502 | 품종 통계 | STA-002_statistics-id_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: /statistics/$variety<br>File: src/routes/statistics.$variety.tsx<br>Baseline: 2026-07-31 코드 기준 |
| DS-0502 | 품종 통계 | STA-002_statistics-id_Default | Design | - | Registry: docs/ds/screen-registry.json<br>Route: /statistics/$variety<br>File: src/routes/statistics.$variety.tsx<br>Baseline: 2026-07-31 코드 기준 |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## STA-003_statistics-sheet-market_Default — 도매시장 선택 시트

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0503 | 도매시장 선택 시트 | STA-003_statistics-sheet-market_Default | Visible | 정의.01: 통계 화면에서 비교할 도매시장을 다중 선택하는 바텀시트<br>구성.01: Sheet/SheetContent(side="bottom") 타이틀 "시장 선택" + 경고 문구(조건부) + 시장 체크리스트 + 적용 버튼<br>제목.01: 시장 선택<br>문구.01: 전국과 개별 시장은 함께 선택할 수 없어요 (warn=true일 때)<br>목록항목.01: MARKET_OPTIONS(전국/서울가락/대구북부/광주서부/구리/부산엄궁) 각 항목에 체크 표시<br>버튼.01: 적용 버튼 → onConfirm(draft) 호출 후 시트 닫기<br>상태표시.01: 선택된 항목 체크박스 bg-[#3A8A3A] | Registry: docs/ds/screen-registry.json<br>Route: Parent=/statistics<br>File: src/components/statistics/StatsMarketSheet.tsx<br>Baseline: 2026-07-31 코드 기준 |
| DS-0503 | 도매시장 선택 시트 | STA-003_statistics-sheet-market_Default | Invisible | 진입조건.01: 부모 화면(/statistics)에서 marketOpen=true일 때 오픈<br>데이터소스.01: MARKET_OPTIONS(src/lib/mock/statistics-mock.ts), props selected(부모 useStatistics.markets)<br>초기값.01: open될 때 draft=selected, warn=false로 초기화(useEffect)<br>조건.01: id==="전국" 선택 시 draft를 ["전국"]으로 단일화<br>조건.02: 개별 시장 선택 시 draft에서 "전국" 제거<br>검증.01: next.length===0이면 강제로 ["전국"]으로 되돌림(setDraft)<br>분기.01: 신규 선택(has===false)이고 기존 selected에 "전국"이 포함되어 있으면 warn=true로 경고 문구 노출<br>액션.01: 항목 클릭 → toggle(id)<br>액션.02: 적용 버튼 클릭 → onConfirm(draft) 호출 후 onOpenChange(false)<br>저장.01: 부모 setMarkets(draft) 호출(useStatistics 상태 갱신, persist 미적용 — 새로고침 시 초기화) | Registry: docs/ds/screen-registry.json<br>Route: Parent=/statistics<br>File: src/components/statistics/StatsMarketSheet.tsx<br>Store: src/store/statistics.ts<br>Source: src/lib/mock/statistics-mock.ts<br>Baseline: 2026-07-31 코드 기준 |
| DS-0503 | 도매시장 선택 시트 | STA-003_statistics-sheet-market_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: Parent=/statistics<br>File: src/components/statistics/StatsMarketSheet.tsx<br>Baseline: 2026-07-31 코드 기준 |
| DS-0503 | 도매시장 선택 시트 | STA-003_statistics-sheet-market_Default | Design | 컴포넌트.01: Sheet, SheetContent<br>아이콘.01: Check, AlertTriangle<br>상태스타일.01: 선택됨 border-[#3A8A3A] bg-[#3A8A3A] text-white, 경고 배너 bg-[#FFF4E6] text-[#B76E00]<br>반응형.01: max-h-[80vh] rounded-t-2xl | Registry: docs/ds/screen-registry.json<br>Route: Parent=/statistics<br>File: src/components/statistics/StatsMarketSheet.tsx<br>Baseline: 2026-07-31 코드 기준 |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## 분석 파일

- src/routes/statistics.index.tsx
- src/routes/statistics.$variety.tsx
- src/store/statistics.ts
- src/lib/mock/statistics-mock.ts
- src/components/statistics/StatsMarketSheet.tsx
- src/components/common/ConditionSelectCard.tsx
- src/store/cropSelection.ts (committed 참조 확인용)
- src/components/app-shell.tsx

## 미구현·확인필요 요약

총 4건 (미구현 2건, 확인필요 2건)

- 미구현.01 (STA-001_statistics_Default): 실제 백엔드 API 미연동, 모든 수치가 statistics-mock.ts의 결정론적 mock 값
- 미구현.01 (STA-002_statistics-id_Default): 품종별 개별 통계 화면이 더 이상 구현되어 있지 않고 항상 /statistics로 리다이렉트됨(레거시 라우트)
- 확인필요.01 (STA-001_statistics_Default): "2026년 7월 중순 기준" 문구가 하드코딩되어 실제 서비스 시점 갱신 로직 불명확
- 확인필요.01 (STA-002_statistics-id_Default): 리다이렉트 전용 레거시 라우트를 계속 유지해야 하는지 업무적 확인 필요
