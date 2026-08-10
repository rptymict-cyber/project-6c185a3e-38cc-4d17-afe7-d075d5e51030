# 통계 DS

- Menu ID: statistics
- Registry: docs/ds/screen-registry.json
- Baseline: 2026-08-05 코드 기준

## 통계 대시보드 · 기본 상태

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0501 | 통계 대시보드 | STA-001_statistics_Default | Visible | -정의.01: 작물별 가격·거래량 추이, 기간별 비교 지표, 주산지·시장 분포, 등급별 평균가를 한 화면에서 확인하는 대시보드 | Registry: docs/ds/screen-registry.json<br>Route: /statistics<br>File: src/routes/statistics.index.tsx<br>Baseline: 2026-08-05 코드 기준<br>기술근거.01: 컴포넌트 FullSelectCard, StatsTrendChart, StatsKpiGroup, StatsDonut, StatsGradeBars, StatsMarketSheet 사용 |
| DS-0502 | 통계 대시보드 | STA-001_statistics_Default | Visible | -구성.01: 화면 상단에 고정되는 필터 영역(작물 선택 카드, 도매시장 선택 버튼, 일별·월별·연도별 기간 탭)과 그 아래 스크롤되는 본문(추이 카드, 비교 지표, 도넛 차트 2종, 등급별 막대) | - |
| DS-0503 | 통계 대시보드 | STA-001_statistics_Default | Visible | -필터.01: 작물 선택 카드는 작물 이모지 아이콘과 "카테고리 · 품목 · 품종" 형식의 라벨을 표시하며, 누르면 작물 선택 화면으로 이동한다 | - |
| DS-0504 | 통계 대시보드 | STA-001_statistics_Default | Visible | -필터.02: 도매시장 선택 버튼은 매장 아이콘과 "도매시장" 라벨, 선택값(단일 선택 시 시장명, 복수 선택 시 "첫 시장명 외 N")을 표시한다 | - |
| DS-0505 | 통계 대시보드 | STA-001_statistics_Default | Visible | -필터.03: "일별"·"월별"·"연도별" 기간 탭 중 선택된 탭은 흰 배경에 진한 초록 글자로 강조 표시된다 | - |
| DS-0506 | 통계 대시보드 | STA-001_statistics_Default | Visible | -문구.01: 추이 카드 상단에 "2026년 7월 중순 기준" 기준일 문구와 "{작물명}{품종명} 평균 가격은 {가격}원 (kg당)" 헤드라인 문구가 표시된다 | - |
| DS-0507 | 통계 대시보드 | STA-001_statistics_Default | Visible | -제목.01: 추이 카드 내 "가격 · 거래량 추이" 제목과 우측 "원/kg · 거래량 t" 단위 안내 | - |
| DS-0508 | 통계 대시보드 | STA-001_statistics_Default | Visible | -차트.01: 가격 추이는 선 그래프(시장별 색상 구분), 거래량은 막대 그래프로 함께 표시되며 하단에 범례가 나타난다 | - |
| DS-0509 | 통계 대시보드 | STA-001_statistics_Default | Visible | -비교지표.01: 선택한 기간에 맞춰 3개의 비교 지표 카드(예: 전일·전월·전년 대비 등)가 표시된다 | - |
| DS-0510 | 통계 대시보드 | STA-001_statistics_Default | Visible | -도넛.01: "주산지 비율(광역)" 도넛 차트에는 비중 상위 5개 지역과 "기타"로 묶은 값이 표시된다 | - |
| DS-0511 | 통계 대시보드 | STA-001_statistics_Default | Visible | -도넛.02: "도매시장별 거래 비율" 도넛 차트가 별도로 표시된다 | - |
| DS-0512 | 통계 대시보드 | STA-001_statistics_Default | Visible | -등급표.01: 등급(특·상·보통·등외·기타)별 평균가와 비중을 막대로 표시한다 | - |
| DS-0513 | 통계 대시보드 | STA-001_statistics_Default | Visible | -시트.01: 도매시장 선택 버튼을 누르면 하단에 도매시장 선택 시트가 열린다(STA-003 참고) | - |
| DS-0514 | 통계 대시보드 | STA-001_statistics_Default | Invisible | -조건.01: 화면 진입 시 공용 작물 선택 상태가 비어 있으면 카테고리 "채소류"·품목 "배추"·품종 "전체"로 자동 선택된 뒤 확정된다 | Registry: docs/ds/screen-registry.json<br>Route: /statistics<br>File: src/routes/statistics.index.tsx<br>Baseline: 2026-08-05 코드 기준<br>기술근거.01: useStatistics(store/statistics.ts), useCropSelection(store/cropSelection.ts), buildSeries/buildKpis/getOriginShare/getMarketShare/getGradeAvg(lib/mock/statistics-mock.ts)<br>기술근거.02: 품목명→작물식별자 매핑표 ITEM_NAME_TO_CROP_ID(statistics.index.tsx)<br>⚠️ 확인 필요.01: 매핑표에 없는 카탈로그 품목을 선택했을 때 직전 작물을 그대로 유지하는 동작이 기획 의도인지 확인 필요<br>⚠️ 확인 필요.02: 미사용 통계 화면 요소 10종이 향후 신규 화면에 쓰일 예정인지, 삭제 대상인지 확인 필요 |
| DS-0515 | 통계 대시보드 | STA-001_statistics_Default | Invisible | -데이터.01: 통계 전용 상태(선택 작물·선택 시장 목록·선택 기간)와 공용 작물 선택 상태를 함께 사용해 화면을 구성한다 | - |
| DS-0516 | 통계 대시보드 | STA-001_statistics_Default | Invisible | -데이터.02: 가격·거래량 추이, 비교 지표, 주산지 비율, 시장별 비율, 등급별 평균가는 모두 통계 목데이터 생성 함수로 산출한다 | - |
| DS-0517 | 통계 대시보드 | STA-001_statistics_Default | Invisible | -초기값.01: 기본 작물은 배추, 기본 시장은 "전국", 기본 기간은 "일별"이다 | - |
| DS-0518 | 통계 대시보드 | STA-001_statistics_Default | Invisible | -분기.01: 공용 작물 선택이 바뀌면 카탈로그 품목명을 통계용 작물 식별자로 변환해 반영하며, 매핑표에 없는 품목은 통계 화면에 반영되지 않고 직전 작물이 유지된다 | - |
| DS-0519 | 통계 대시보드 | STA-001_statistics_Default | Invisible | -계산.01: 헤드라인 평균 가격은 첫 번째 선택 시장 기준으로 전체 기간 평균을 반올림해 산출한다 | - |
| DS-0520 | 통계 대시보드 | STA-001_statistics_Default | Invisible | -계산.02: 3개 비교 지표는 선택한 기간(일별·월별·연도별)에 따라 서로 다른 비교 대상 라벨을 사용하며 고정된 규칙으로 값이 생성된다 | - |
| DS-0521 | 통계 대시보드 | STA-001_statistics_Default | Invisible | -검증.01: 도매시장 선택 시트에서 "전국"을 선택하면 다른 시장과 동시 선택이 불가능하며, 개별 시장을 선택하면 "전국" 선택이 자동 해제된다 | - |
| DS-0522 | 통계 대시보드 | STA-001_statistics_Default | Invisible | -검증.02: 도매시장 선택 결과가 0개가 되면 자동으로 "전국"으로 대체된다 | - |
| DS-0523 | 통계 대시보드 | STA-001_statistics_Default | Invisible | -이동.01: 작물 선택 카드를 누르면 작물 선택 화면으로 이동하고, 돌아오면 이 화면이 다시 표시된다 | - |
| DS-0524 | 통계 대시보드 | STA-001_statistics_Default | Invisible | -미구현.01: 화면의 모든 수치(추이·비교 지표·주산지·시장 비율·등급별 평균가)는 실제 시세 데이터가 아닌 정해진 규칙으로 생성되는 목데이터이며, 실제 데이터 연동은 되어 있지 않다 | - |
| DS-0525 | 통계 대시보드 | STA-001_statistics_Default | Invisible | -미구현.02: 통계 관련 폴더에 있는 지도, 시장별 평균가 표, 시장 비교 시트, 지역 통계 목록, 지역 통계 탭, 게이지, 이중 추이 차트, 추이 탭, 품종 선택 시트, 시장별 거래량 탭 등 10개 화면 요소는 현재 어떤 화면에서도 사용되지 않는다 | - |
| DS-0526 | 통계 대시보드 | STA-001_statistics_Default | Invisible | -미구현.03: 필터 변경, 도넛·차트 상호작용 등 주요 행동에 대한 별도 통계 수집(트래킹) 코드는 확인되지 않는다 | - |
| DS-0527 | 통계 대시보드 | STA-001_statistics_Default | Design | -배경색.01: 페이지·카드 배경 흰색(#FFFFFF) | Registry: docs/ds/screen-registry.json<br>Route: /statistics<br>File: src/routes/statistics.index.tsx<br>Baseline: 2026-08-05 코드 기준<br>기술근거.01: 화면 내 색상 대부분이 --primary 등 토큰 대신 하드코딩 hex 값(#3A8A3A, #6C757D 등)으로 직접 기재됨(styles.css 토큰과 값은 동일)<br>⚠️ 확인 필요.01: 하드코딩 색상값을 디자인 토큰(--primary, --muted-foreground 등)으로 일원화할 계획이 있는지 확인 필요 |
| DS-0528 | 통계 대시보드 | STA-001_statistics_Default | Design | -배경색.02: 필터 영역 배경 흰색(#FFFFFF), 하단 경계선 1px 실선 연회색(#E9ECEF) | - |
| DS-0529 | 통계 대시보드 | STA-001_statistics_Default | Design | -배경색.03: 기간 탭 트랙 배경 연회색(#F1F3F5), 선택된 탭 배경 흰색(약한 그림자 포함) | - |
| DS-0530 | 통계 대시보드 | STA-001_statistics_Default | Design | -글자색.01: 선택된 기간 탭 텍스트 진초록(#1F5C1F), 비선택 탭 텍스트 회색(#6C757D) | - |
| DS-0531 | 통계 대시보드 | STA-001_statistics_Default | Design | -글자색.02: 헤드라인 문구 중 작물명 강조 텍스트 초록색(#3A8A3A), 나머지 본문 텍스트 진회색(#212529) | - |
| DS-0532 | 통계 대시보드 | STA-001_statistics_Default | Design | -글자색.03: 기준일 안내문 텍스트 연회색(#868E96) | - |
| DS-0533 | 통계 대시보드 | STA-001_statistics_Default | Design | -글자크기.01: 헤드라인 평균가 숫자 16px 매우 굵게, 나머지 헤드라인 문구 14px 굵게 | - |
| DS-0534 | 통계 대시보드 | STA-001_statistics_Default | Design | -글자크기.02: 차트 섹션 제목 14px 매우 굵게, 단위 안내 11px | - |
| DS-0535 | 통계 대시보드 | STA-001_statistics_Default | Design | -테두리.01: 필터 카드 테두리 1px 실선 연회색(#E9ECEF), 모서리 둥글기 12px | - |
| DS-0536 | 통계 대시보드 | STA-001_statistics_Default | Design | -테두리.02: 추이 카드 테두리 1px 실선 연회색(#EAECEF), 모서리 둥글기 16px | - |
| DS-0537 | 통계 대시보드 | STA-001_statistics_Default | Design | -안쪽여백.01: 추이 카드 내부 안쪽 여백 16px | - |
| DS-0538 | 통계 대시보드 | STA-001_statistics_Default | Design | -바깥여백.01: 본문 섹션 간 위쪽 바깥 여백 12~16px | - |
| DS-0539 | 통계 대시보드 | STA-001_statistics_Default | Design | -높이.01: 가격·거래량 콤보 차트 영역 높이 260px | - |
| DS-0540 | 통계 대시보드 | STA-001_statistics_Default | Design | -아이콘.01: 도매시장 선택 버튼 아이콘 배경 32px 원형(연회색 #F1F3F5), 펼침 화살표 아이콘 16px 색상 연회색(#ADB5BD) | - |
| DS-0541 | 통계 대시보드 | STA-001_statistics_Default | Design | -고정위치.01: 필터 영역은 상단 헤더(52px) 바로 아래에 고정되어 스크롤 시에도 화면에 남는다 | - |

## 품종 통계 · 기본 상태

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0542 | 품종 통계 | STA-002_statistics-id_Default | Visible | -정의.01: 과거 품종별 통계 상세 화면이었던 경로로, 현재는 화면을 그리지 않고 즉시 통계 대시보드로 넘어간다 | Registry: docs/ds/screen-registry.json<br>Route: /statistics/$variety<br>File: src/routes/statistics.$variety.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-0543 | 품종 통계 | STA-002_statistics-id_Default | Invisible | -조건.01: 이 경로에 접근하면 화면이 로드되기 전에 통계 대시보드(/statistics)로 이동 처리된다 | Registry: docs/ds/screen-registry.json<br>Route: /statistics/$variety<br>File: src/routes/statistics.$variety.tsx<br>Baseline: 2026-08-05 코드 기준<br>⚠️ 확인 필요.01: 화면 목록에 등록되어 있으나 실사용 화면이 없는 이동 전용 경로를 문서에 계속 유지할 필요가 있는지 확인 필요 |
| DS-0544 | 품종 통계 | STA-002_statistics-id_Default | Invisible | -이동.01: 예외 없이 통계 대시보드로 이동한다 | - |
| DS-0545 | 품종 통계 | STA-002_statistics-id_Default | Invisible | -미구현.01: 실제로 그려지는 화면 내용이 없다(신규 통계 대시보드가 상태를 통합해 대체함) | - |
| DS-0546 | 품종 통계 | STA-002_statistics-id_Default | Invisible | -미구현.02: 이동 처리에 대한 별도 통계 수집(트래킹) 코드는 확인되지 않는다 | - |

## 도매시장 선택 시트 · 기본 상태

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0547 | 도매시장 선택 시트 | STA-003_statistics-sheet-market_Default | Visible | -정의.01: 통계 대시보드에서 조회할 도매시장을 하나 이상 선택하는 하단 시트 | Registry: docs/ds/screen-registry.json<br>Route: Parent=/statistics<br>File: src/components/statistics/StatsMarketSheet.tsx<br>Baseline: 2026-08-05 코드 기준<br>기술근거.01: Sheet, SheetContent 컴포넌트 사용 |
| DS-0548 | 도매시장 선택 시트 | STA-003_statistics-sheet-market_Default | Visible | -제목.01: 시트 상단 "시장 선택" 타이틀 | - |
| DS-0549 | 도매시장 선택 시트 | STA-003_statistics-sheet-market_Default | Visible | -목록항목.01: "전국", "서울가락", "대구북부", "광주서부", "구리", "부산엄궁" 시장 목록이 체크 항목 형태로 나열된다 | - |
| DS-0550 | 도매시장 선택 시트 | STA-003_statistics-sheet-market_Default | Visible | -상태표시.01: 선택된 항목은 초록색 배경의 사각 체크 표시로 나타난다 | - |
| DS-0551 | 도매시장 선택 시트 | STA-003_statistics-sheet-market_Default | Visible | -경고문구.01: "전국"과 개별 시장을 함께 선택하려 하면 주황색 경고 배너 "전국과 개별 시장은 함께 선택할 수 없어요"가 나타난다 | - |
| DS-0552 | 도매시장 선택 시트 | STA-003_statistics-sheet-market_Default | Visible | -버튼.01: 하단 고정 "적용" 버튼을 누르면 선택한 값이 통계 대시보드에 반영되고 시트가 닫힌다 | - |
| DS-0553 | 도매시장 선택 시트 | STA-003_statistics-sheet-market_Default | Invisible | -조건.01: 통계 대시보드에서 도매시장 선택 버튼을 누르면 시트가 열린다 | Registry: docs/ds/screen-registry.json<br>Route: Parent=/statistics<br>File: src/components/statistics/StatsMarketSheet.tsx<br>Baseline: 2026-08-05 코드 기준<br>기술근거.01: MARKET_OPTIONS(lib/mock/statistics-mock.ts) 목록 사용 |
| DS-0554 | 도매시장 선택 시트 | STA-003_statistics-sheet-market_Default | Invisible | -초기값.01: 시트가 열릴 때 현재 대시보드에 반영된 선택값으로 임시 선택 상태가 초기화되고 경고 표시는 꺼진 상태로 시작한다 | - |
| DS-0555 | 도매시장 선택 시트 | STA-003_statistics-sheet-market_Default | Invisible | -분기.01: "전국"을 선택하면 다른 선택값을 모두 지우고 "전국"만 단일 선택으로 반영한다 | - |
| DS-0556 | 도매시장 선택 시트 | STA-003_statistics-sheet-market_Default | Invisible | -분기.02: 개별 시장을 선택·해제하면 "전국"은 선택 목록에서 제외되며, 직전 상태가 "전국"이었던 경우 경고 배너가 표시된다 | - |
| DS-0557 | 도매시장 선택 시트 | STA-003_statistics-sheet-market_Default | Invisible | -검증.01: 선택값이 0개가 되면 자동으로 "전국"으로 대체되어 빈 선택 상태를 방지한다 | - |
| DS-0558 | 도매시장 선택 시트 | STA-003_statistics-sheet-market_Default | Invisible | -액션.01: "적용" 버튼을 누르면 임시 선택값이 통계 대시보드에 확정 반영되고 시트가 닫힌다 | - |
| DS-0559 | 도매시장 선택 시트 | STA-003_statistics-sheet-market_Default | Invisible | -미구현.01: 시장 선택·적용에 대한 별도 통계 수집(트래킹) 코드는 확인되지 않는다 | - |
| DS-0560 | 도매시장 선택 시트 | STA-003_statistics-sheet-market_Default | Design | -배경색.01: 시트 배경 흰색(#FFFFFF), 위쪽 모서리 둥글기 16px | Registry: docs/ds/screen-registry.json<br>Route: Parent=/statistics<br>File: src/components/statistics/StatsMarketSheet.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-0561 | 도매시장 선택 시트 | STA-003_statistics-sheet-market_Default | Design | -배경색.02: 경고 배너 배경 연주황(#FFF4E6) | - |
| DS-0562 | 도매시장 선택 시트 | STA-003_statistics-sheet-market_Default | Design | -글자색.01: 경고 배너 텍스트 갈색 주황(#B76E00) | - |
| DS-0563 | 도매시장 선택 시트 | STA-003_statistics-sheet-market_Default | Design | -글자색.02: 타이틀 텍스트 진회색, 16px 매우 굵게 | - |
| DS-0564 | 도매시장 선택 시트 | STA-003_statistics-sheet-market_Default | Design | -글자색.03: 항목 라벨 텍스트 진회색, 14px 반굵게 | - |
| DS-0565 | 도매시장 선택 시트 | STA-003_statistics-sheet-market_Default | Design | -테두리.01: 체크 표시 미선택 테두리 회색(#CED4DA), 선택 시 배경·테두리 초록색(#3A8A3A) | - |
| DS-0566 | 도매시장 선택 시트 | STA-003_statistics-sheet-market_Default | Design | -테두리.02: 하단 버튼 영역 위쪽 경계선 1px 실선 연회색(#E9ECEF) | - |
| DS-0567 | 도매시장 선택 시트 | STA-003_statistics-sheet-market_Default | Design | -모서리.01: 체크 표시 모서리 둥글기 6px | - |
| DS-0568 | 도매시장 선택 시트 | STA-003_statistics-sheet-market_Default | Design | -높이.01: 시트 최대 높이 화면 높이의 80% | - |
| DS-0569 | 도매시장 선택 시트 | STA-003_statistics-sheet-market_Default | Design | -아이콘.01: 체크 아이콘 14px, 경고 아이콘 16px | - |
| DS-0570 | 도매시장 선택 시트 | STA-003_statistics-sheet-market_Default | Design | -버튼.01: "적용" 버튼 배경 초록색(#3A8A3A), 누를 때 진한 초록(#2F6F2F), 글자 흰색 14px 매우 굵게, 상하 안쪽 여백 12px | - |

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
- 미구현: 4건 (STA-001 목데이터 전용, STA-001 미사용 화면 요소 10종, STA-002 이동 전용 경로, STA-002 트래킹 부재)
- ⚠️ 확인 필요: 4건 (STA-001 매핑표 미등록 품목 처리, STA-001 미사용 요소 활용 계획, STA-001 색상 토큰 일원화 여부, STA-002 문서 유지 필요성)
