# 통계 DS

- Menu ID: statistics
- Registry: docs/ds/screen-registry.json
- Baseline: 2026-08-04 코드 기준

## STA-001_statistics_Default — 통계 대시보드

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0501 | 통계 대시보드 | STA-001_statistics_Default | Visible | -정의.01: 작물별 가격·거래량 추이, 기간 비교 KPI, 주산지·시장 분포, 등급별 평균가를 한 화면에서 확인하는 대시보드<br>-구성.01: 상단 고정(sticky) 필터 바(작물 선택 카드, 도매시장 선택 버튼, 일별/월별/연도별 세그먼트)와 하단 스크롤 본문(추이 카드, KPI 그룹, 도넛 2종, 등급 막대)<br>-필터.01: 작물 선택 카드(FullSelectCard)는 이모지 아이콘과 "카테고리 · 품목 · 품종" 라벨을 표시하고 클릭 시 /crop-select로 이동<br>-필터.02: 도매시장 선택 버튼은 🏬 아이콘, "도매시장" 라벨, 선택값(단일이면 시장명, 복수면 "첫시장 외 N")을 표시<br>-필터.03: 일별/월별/연도별 세그먼트 탭(PERIOD_TABS), 선택된 탭은 흰 배경+녹색 텍스트로 강조<br>-표시.01: 추이 카드 상단에 "2026년 7월 중순 기준" 기준일과 "{작물}{품종} 평균 가격은 {값}원 (kg당)" 헤드라인 문구<br>-제목.01: 추이 카드 섹션 제목 "가격 · 거래량 추이", 우측에 단위 안내 "원/kg · 거래량 t"<br>-테이블.01: StatsTrendChart로 가격 라인(시장별 색상 구분)과 거래량 막대를 합성한 콤보 차트, 하단 범례 표시<br>-목록항목.01: StatsKpiGroup으로 기간에 따라 "전일/전월/전년 대비" 등 3개 비교 지표 카드 노출<br>-목록항목.02: StatsDonut "주산지 비율(광역)" 도넛 차트, 상위 5개 + 기타로 정규화<br>-목록항목.03: StatsDonut "도매시장별 거래 비율" 도넛 차트<br>-테이블.02: StatsGradeBars로 등급별(특/상/보통/등외/기타) 평균가·비중 막대 표시<br>-모달.01: 도매시장 선택 버튼 클릭 시 StatsMarketSheet 하단 시트 오픈(STA-003 참고) | Registry: docs/ds/screen-registry.json<br>Route: /statistics<br>File: src/routes/statistics.index.tsx<br>Baseline: 2026-08-04 코드 기준<br>Components: FullSelectCard, StatsTrendChart, StatsKpiGroup, StatsDonut, StatsGradeBars, StatsMarketSheet |
| DS-0501 | 통계 대시보드 | STA-001_statistics_Default | Invisible | -진입조건.01: /statistics 진입 시 useCropSelection(committed).itemId가 비어 있으면 카테고리 "06"·품목 "0602"(배추)·품종 "ALL"로 기본 선택 후 commitDraft 실행<br>-데이터소스.01: useStatistics 스토어(crop, markets, period)와 useCropSelection 스토어(committed)를 함께 사용<br>-데이터소스.02: buildSeries/buildKpis/getOriginShare/getMarketShare/getGradeAvg(src/lib/mock/statistics-mock.ts) 목데이터 함수로 화면 데이터 생성<br>-초기값.01: 기본 작물 crop="cabbage", 기본 시장 markets=["전국"], 기본 기간 period="day"<br>-분기.01: committed.itemId 변경 시 ITEM_NAME_TO_CROP_ID 매핑 테이블로 카탈로그 품목명을 통계 mock CropId로 변환해 setCrop 호출, 매핑 없는 품목은 통계 미반영<br>-계산식.01: 헤드라인 평균가는 markets[0] 기준 series 전체 평균을 반올림하여 산출<br>-계산식.02: buildKpis는 기간(day/month/year)별로 라벨셋이 다른 3개 비교 지표(예: 전일/전주/전년 대비)를 결정론적 시드 난수로 생성<br>-필터조건.01: 도매시장 시트에서 "전국" 선택 시 다른 시장과 동시 선택 불가(단일화), 개별 시장 선택 시 "전국" 자동 해제<br>-검증.01: 도매시장 시트에서 최종 선택이 0개면 자동으로 ["전국"]으로 대체<br>-이동.01: 작물 선택 카드 클릭 → /crop-select?from=statistics&return=/statistics<br>-미구현.01: 헤드라인/차트/KPI/도넛/등급 데이터가 모두 결정론적 시드 기반 mock이며 실제 API 연동 없음(statistics-mock.ts 주석에 "Replace ... with real API calls" 명시)<br>-미구현.02: components/statistics 폴더의 KoreaRegionMap, MarketAveragesTable, MarketComparisonSheet, RegionStatsList, RegionalStatsTab, StatsGauge, TrendDualChart, TrendTab, VarietyPickerSheet, VolumeByMarketTab은 어떤 라우트에서도 import되지 않는 미사용 컴포넌트<br>-미구현.03: 필터 변경(작물/시장/기간), 도넛/차트 상호작용에 대한 별도 트래킹 이벤트 전송 코드는 확인되지 않음 | Registry: docs/ds/screen-registry.json<br>Route: /statistics<br>File: src/routes/statistics.index.tsx<br>Baseline: 2026-08-04 코드 기준<br>Store: src/store/statistics.ts, src/store/cropSelection.ts<br>Source: src/lib/mock/statistics-mock.ts<br>⚠️ 확인 필요.01: ITEM_NAME_TO_CROP_ID에 없는 카탈로그 품목 선택 시 통계 화면 동작(직전 crop 유지) 기획 의도 확인 필요<br>⚠️ 확인 필요.02: 미사용 통계 컴포넌트 10종의 활용 계획(신규 화면 예정인지, 삭제 대상인지) 확인 필요 |
| DS-0501 | 통계 대시보드 | STA-001_statistics_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: /statistics<br>File: src/routes/statistics.index.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0501 | 통계 대시보드 | STA-001_statistics_Default | Design | -배경색.01: 페이지/카드 배경 #FFFFFF<br>-배경색.02: 필터 바 배경 #FFFFFF, 하단 경계선 1px solid #E9ECEF<br>-배경색.03: 기간 세그먼트 트랙 배경 #F1F3F5, 선택 탭 배경 #FFFFFF(shadow-sm)<br>-글자색.01: 선택된 기간 탭 텍스트 #1F5C1F, 비선택 텍스트 #6C757D<br>-글자색.02: 헤드라인 강조 텍스트 #3A8A3A(작물명), 본문 텍스트 #212529<br>-글자색.03: 기준일 안내문 #868E96<br>-글자크기.01: 헤드라인 평균가 수치 16px/font-black, 나머지 헤드라인 문구 14px/font-bold<br>-글자크기.02: 차트 섹션 제목 14px/font-extrabold, 단위 안내 11px<br>-테두리.01: 필터 카드 테두리 1px solid #E9ECEF, 모서리 반경 12px<br>-테두리.02: 추이 카드 테두리 1px solid #EAECEF, 모서리 반경 16px<br>-내부여백.01: 추이 카드 패딩 16px(p-4)<br>-외부여백.01: 섹션 간 상단 마진 12~16px(mt-3, mt-4)<br>-높이.01: 콤보 차트 영역 260px(h-[260px])<br>-아이콘크기.01: 도매시장 셀렉트 아이콘 배경 32px×32px 원형(#F1F3F5), ChevronDown 16px×16px 색상 #ADB5BD<br>-반응형.01: sticky top-[52px]로 AppHeader 높이(52px) 아래에 필터 바 고정 | Registry: docs/ds/screen-registry.json<br>Route: /statistics<br>File: src/routes/statistics.index.tsx<br>Baseline: 2026-08-04 코드 기준<br>클래스 참조: 화면 내 색상 대부분 하드코딩 hex 값 사용(styles.css 토큰 미참조)<br>⚠️ 확인 필요: 하드코딩된 색상값(#3A8A3A, #6C757D 등)이 styles.css 토큰(--primary, --muted-foreground 등)과 값은 동일하나 클래스 대신 arbitrary value로 직접 기재되어 있어 디자인 시스템 일원화 여부 확인 필요 |

## STA-002_statistics-id_Default — 품종 통계

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0502 | 품종 통계 | STA-002_statistics-id_Default | Visible | -정의.01: 레거시 품종별 통계 상세 라우트로 화면 UI 없이 즉시 리다이렉트 처리됨 | Registry: docs/ds/screen-registry.json<br>Route: /statistics/$variety<br>File: src/routes/statistics.$variety.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0502 | 품종 통계 | STA-002_statistics-id_Default | Invisible | -진입조건.01: /statistics/$variety 접근 시 beforeLoad에서 redirect({to: "/statistics"})가 즉시 실행됨<br>-이동.01: 무조건 /statistics(통계 대시보드)로 리다이렉트<br>-미구현.01: 화면 컴포넌트는 component: () => null 로 실질적인 화면이 존재하지 않음(신규 통계 화면이 /statistics 하나로 상태를 통합했기 때문)<br>-미구현.02: 리다이렉트 발생에 대한 트래킹 이벤트 없음 | Registry: docs/ds/screen-registry.json<br>Route: /statistics/$variety<br>File: src/routes/statistics.$variety.tsx<br>Baseline: 2026-08-04 코드 기준<br>⚠️ 확인 필요: registry에 STA-002가 등록되어 있으나 실제로는 사용되지 않는 리다이렉트 전용 라우트라 문서 유지 필요 여부 확인 필요 |
| DS-0502 | 품종 통계 | STA-002_statistics-id_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: /statistics/$variety<br>File: src/routes/statistics.$variety.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0502 | 품종 통계 | STA-002_statistics-id_Default | Design | - | Registry: docs/ds/screen-registry.json<br>Route: /statistics/$variety<br>File: src/routes/statistics.$variety.tsx<br>Baseline: 2026-08-04 코드 기준<br>⚠️ 확인 필요: 렌더링되는 화면이 없어 Design 상세 사양 확인 불가<br>기술 참조: - |

## STA-003_statistics-sheet-market_Default — 도매시장 선택 시트

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0503 | 도매시장 선택 시트 | STA-003_statistics-sheet-market_Default | Visible | -정의.01: 통계 대시보드에서 조회할 도매시장(들)을 선택하는 하단 시트<br>-제목.01: 시트 상단 "시장 선택" 타이틀<br>-목록항목.01: MARKET_OPTIONS(전국/서울가락/대구북부/광주서부/구리/부산엄궁) 목록을 체크박스 형태로 나열<br>-상태표시.01: 선택된 항목은 우측 체크 아이콘이 표시된 초록 배경 사각 체크박스로 표시<br>-오류표시.01: "전국"과 개별 시장을 함께 선택하려 하면 "전국과 개별 시장은 함께 선택할 수 없어요" 경고 배너(주황색) 노출<br>-버튼.01: 하단 고정 "적용" 버튼으로 draft 선택값을 확정(onConfirm) | Registry: docs/ds/screen-registry.json<br>Route: Parent=/statistics<br>File: src/components/statistics/StatsMarketSheet.tsx<br>Baseline: 2026-08-04 코드 기준<br>Components: Sheet, SheetContent |
| DS-0503 | 도매시장 선택 시트 | STA-003_statistics-sheet-market_Default | Invisible | -진입조건.01: 통계 대시보드에서 도매시장 선택 버튼 클릭 시 open=true로 시트 표시<br>-초기값.01: 시트 오픈 시 draft를 상위에서 전달받은 selected(현재 선택값)로 초기화, 경고 상태(warn)는 false로 리셋<br>-분기.01: "전국" 선택 시 draft를 즉시 ["전국"] 단일값으로 치환<br>-분기.02: 개별 시장 선택/해제 시 "전국"을 draft에서 제외, 직전 선택이 "전국"이었다면 warn=true로 경고 노출<br>-검증.01: 최종 선택이 0개가 되면 자동으로 ["전국"]으로 대체하여 빈 선택 방지<br>-액션.01: "적용" 클릭 시 onConfirm(draft) 호출 후 시트 닫힘(onOpenChange(false))<br>-미구현.01: 시장 선택/적용에 대한 트래킹 이벤트 코드는 확인되지 않음 | Registry: docs/ds/screen-registry.json<br>Route: Parent=/statistics<br>File: src/components/statistics/StatsMarketSheet.tsx<br>Baseline: 2026-08-04 코드 기준<br>Source: src/lib/mock/statistics-mock.ts(MARKET_OPTIONS) |
| DS-0503 | 도매시장 선택 시트 | STA-003_statistics-sheet-market_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: Parent=/statistics<br>File: src/components/statistics/StatsMarketSheet.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0503 | 도매시장 선택 시트 | STA-003_statistics-sheet-market_Default | Design | -배경색.01: 시트 배경 #FFFFFF, 상단 모서리 반경 16px(rounded-t-2xl)<br>-배경색.02: 경고 배너 배경 #FFF4E6<br>-글자색.01: 경고 배너 텍스트 #B76E00<br>-글자색.02: 타이틀 텍스트 기본 foreground, 16px/font-black<br>-글자색.03: 옵션 라벨 텍스트 foreground, 14px/font-semibold<br>-테두리.01: 체크박스 미선택 상태 테두리 1px solid #CED4DA, 선택 상태 배경/테두리 #3A8A3A<br>-테두리.02: 하단 버튼 영역 상단 경계선 1px solid #E9ECEF<br>-모서리.01: 체크박스 모서리 반경 6px<br>-높이.01: 시트 최대 높이 80vh(max-h-[80vh])<br>-아이콘크기.01: 체크 아이콘 14px×14px(h-3.5 w-3.5), 경고 아이콘 16px×16px | Registry: docs/ds/screen-registry.json<br>Route: Parent=/statistics<br>File: src/components/statistics/StatsMarketSheet.tsx<br>Baseline: 2026-08-04 코드 기준<br>기술 참조: "적용" 버튼 배경 #3A8A3A, 눌림 시 #2F6F2F, 텍스트 흰색 14px/font-black, 내부여백 상하 12px(py-3) |

Confluence 등록 시 같은 Screen ID의 연속 행에 있는 DS No. · Section명 · Screen ID 셀은 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## 분석 파일
- src/routes/statistics.index.tsx
- src/routes/statistics.$variety.tsx
- src/store/statistics.ts
- src/store/cropSelection.ts
- src/lib/mock/statistics-mock.ts
- src/components/statistics/StatsMarketSheet.tsx
- src/components/statistics/StatsTrendChart.tsx
- src/components/statistics/StatsDonut.tsx
- src/components/statistics/StatsKpiGroup.tsx
- src/components/statistics/StatsGradeBars.tsx
- src/components/common/ConditionSelectCard.tsx
- src/lib/catalog-service.ts
- src/styles.css

## 미구현·확인필요 요약
- 미구현: 4건 (STA-001 mock 데이터 전용, STA-001 미사용 컴포넌트 10종, STA-002 리다이렉트 전용, STA-002 트래킹 부재)
- ⚠️ 확인 필요: 5건 (STA-001 미매핑 품목 처리, STA-001 미사용 컴포넌트 활용 계획, STA-001 색상 토큰화 여부, STA-002 문서 유지 필요성, STA-002 Design 확인 불가)
