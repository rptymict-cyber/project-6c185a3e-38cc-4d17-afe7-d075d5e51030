# AI 시세 예측 DS

- Menu ID: prediction
- Registry: docs/ds/screen-registry.json
- Baseline: 2026-08-05 코드 기준

## PRD-001_prediction_Default — 예측 메인 · 기본 상태

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0601 | 예측 메인 | PRD-001_prediction_Default | Visible | -정의.01: AI 시세 예측 메인 화면. 조건 선택 그리드→등급 세그먼트→AI 추천 카드→가격 예측 차트→낙관/중립/비관 카드→출하·매입 시점 비교→예측 근거→AI 상세 예측 리포트 안내→고지문 순으로 구성됨<br>-구성.01: 조건 선택 그리드 2행 2열(출하량 또는 매입량/작물/도매시장/유형)<br>-구성.02: 등급 세그먼트(전체/상(특)/중/하) 4버튼과 안내문<br>-구성.03: 관점별 AI 추천 카드(초록 그라디언트 배경)<br>-구성.04: 예측 범위 토글(7일/10일/14일/30일)과 최근 업데이트 시각 표시<br>-구성.05: 가격 예측 차트와 범례(실제 평균가/중립 예측/낙관~비관 범위/변곡점)<br>-구성.06: 낙관·중립·비관 3열 값 카드와 하단 안내문<br>-구성.07: 출하 또는 매입 시점 비교 섹션(강조 배너 1개 + 현재 시점·선택 또는 추천 시점 카드 2개)<br>-구성.08: 예측 근거 섹션(날씨 영향 요약 카드, 추세 방향성 카드, 경매·수급 동향 카드, 예측 근거 팩터 목록 3건, 가격 전망 리포트 카드, 주제별 관련 뉴스 카드)<br>-구성.09: "AI 상세 예측 리포트" 프리미엄 안내 카드(점선 테두리)<br>-표시.01: 화면 상단 타이틀 "AI 시세 예측"<br>-표시.02: 차트 영역 상단에 "가격 예측 차트" 제목과 "최근 업데이트 {업데이트 시각}" 문구 표시<br>-문구.01: 차트 범례 라벨 "실제 평균가", "중립 예측", "낙관~비관 범위", "변곡점"<br>-문구.02: 예측 근거 섹션 제목 "예측 근거", 날씨 카드 배지 "출하 주의"<br>-문구.03: AI 추천 카드 KPI 라벨 "예상 평균가", "예상 매출"(농민 관점)·"예상 매입액"(도매상 관점), "예상 추가 수익"(농민 관점)·"예상 절감액"(도매상 관점)<br>-문구.04: 시점 비교 배너 라벨 "예상 추가 수익"(농민 관점)·"예상 절감"(도매상 관점)<br>-문구.05: 하단 고지문 "본 예측은 데이터 기반 AI의 참고용 세컨드 오피니언입니다. 실제 시세와 다를 수 있으니 최종 판단은 사용자에게 있습니다."<br>-입력.01: 등급 세그먼트 버튼 클릭으로 전체/상(특)/중/하 전환<br>-입력.02: 예측 범위 토글 버튼 클릭으로 7일/10일/14일/30일 전환<br>-입력.03: 차트의 데이터 포인트 클릭으로 조회 기준일 변경<br>-버튼.01: "리포트 미리보기 ›" 버튼<br>-버튼.02: AI 추천 카드 "시세 상세 보기" 버튼<br>-버튼.03: 낙관·중립·비관 카드 하단 "자세히›" 링크(예측 범위 상세 시트 오픈)<br>-목록항목.01: 예측 근거 팩터 3건("최근 거래량 감소", "주말 전 수요 증가", "휴장 이후 반입량 증가 가능성")<br>-목록항목.02: 주제별 관련 뉴스 목록(기상·생산 리스크 2건, 유통·정책 2건)<br>-상태표시.01: AI 추천 카드 배지 "AI 출하 추천"·"AI 출하 안내"(농민 관점), "AI 매입 추천"·"AI 매입 안내"(도매상 관점)<br>-상태표시.02: 시점 비교 카드 태그 "추천" 또는 "선택"<br>-상태표시.03: 오늘 대비 가격 변동 배지(상승 빨강 화살표, 하락 파랑 화살표, 보합 회색)<br>-도움말.01: 등급 세그먼트 하단 "※ 시세는 출하량 단위(10kg) 기준 표시 · aT 규격 혼재분은 kg 환산 처리. 등급은 연동 확정 시 활성화(베타)."<br>-도움말.02: 낙관/중립/비관 카드 하단 "추천일 시세는 보통 이 정도(중립), 잘 되면 낙관, 안 되면 비관까지 움직일 수 있어요. 뒤로 갈수록 범위가 넓어지는 건 그만큼 예측이 어렵다는 뜻이에요."<br>-도움말.03: 예측 근거 목록 하단 "AI 가격 예측은 최근 경매 데이터와 가격 흐름을 기반으로 한 참고 정보입니다. 실제 거래 가격은 시장 상황에 따라 달라질 수 있습니다."<br>-접근성.01: 수량 시트 내 감소·증가 버튼에 각각 "감소"·"증가" 접근성 라벨 부여, 작물 시트 내 검색창 지우기 버튼에 "지우기" 접근성 라벨 부여 | Route: /prediction<br>File: src/routes/prediction.tsx<br>Baseline: 2026-08-05 코드 기준<br>기술근거.01: PredictionConditionGrid, PredictionGradeSegment, PredictionInsightCard, PredictionChart, PredictionScenarioCards, PredictionCompareCards, PredictionFactorList, PredictionRationaleExtras(TrendDirectionCard·AuctionSupplyCard·PriceOutlookReportCard·TopicRelatedNewsCard) 컴포넌트로 구성됨 |
| DS-0601 | 예측 메인 | PRD-001_prediction_Default | Invisible | -진입조건.01: 라우트 /prediction 진입 시 search 파라미터 cropId 또는 crop 값이 예측 가능 작물 목록에 존재하고 현재 선택값과 다르면 선택 작물을 자동 반영함(search 값이 바뀔 때만 재실행)<br>-데이터소스.01: 예측 가능 작물은 사과·배추·무·양파·마늘 5종으로 고정되며 전 종목의 기준 도매시장은 "서울가락"으로 고정됨<br>-데이터소스.02: 선택된 작물·예측 범위 일수·등급이 바뀔 때만 예측 데이터를 재계산함<br>-데이터소스.03: 날씨 요약 카드는 고정된 목(mock) 날씨 데이터를 사용함<br>-데이터소스.04: 도매시장 목록은 별도 목(mock) 시장 데이터를 사용함<br>-데이터.01: 미구현.01: 실제 시세 예측 API 연동 없음. 의사난수 방식으로 미래 가격을 생성하는 목 데이터만 사용함<br>-초기값.01: 최초 진입 시 선택 조건은 작물 "사과", 관점 "농민", 예측 범위 "7일", 등급 "특", 수량 "kg 100", 도매시장 "서울가락"으로 설정되며 이전 방문 시 저장된 값이 있으면 그 값을 우선 사용함<br>-조건.01: 차트에서 클릭 선택한 조회일 인덱스는 예측 범위·작물·등급이 바뀌면 초기화되어 기본 추천일로 되돌아감<br>-조건.02: 화면 표시 기준일과 기준 가격은 예측 구간 내 최고가 지점(추천일)을 우선 사용하고, 추천일이 없으면 마지막 예측 지점을 사용함. 사용자가 차트에서 다른 지점을 클릭하면 그 지점이 우선 적용됨<br>-계산식.01: 가격 변동액은 기준 가격에서 현재가를 뺀 값이며, 이 값이 농민 관점에서는 양수일 때, 도매상 관점에서는 음수일 때 사용자에게 유리한 것으로 판정함<br>-계산식.02: AI 추천 카드의 예상 매출(또는 매입액)은 예상 평균가에 수량을 곱한 값이며, 예상 추가 수익(또는 절감액)은 가격 변동액에 수량을 곱한 값에 관점별 부호를 적용한 값임<br>-계산식.03: 시점 비교 카드의 이득 금액은 (기준 가격×수량)에서 (현재가×수량)을 뺀 값에 관점별 부호를 적용해 산출함<br>-계산식.04: 현재가는 작물별 기준가에 등급 보정계수(전체·중=1.0, 특=1.06, 하=0.9)를 곱해 산출하며, 낙관가·비관가는 미래 시점이 멀수록 스프레드가 제곱 비례로 확대됨<br>-분기.01: 예측 데이터 또는 작물 정보를 찾지 못하면 PRD-001_prediction_Empty 상태로 전환함<br>-액션.01: 조건 선택 그리드의 4개 셀 클릭 시 각각 수량, 작물, 도매시장, 유형 선택 시트가 열림<br>-액션.02: 낙관·중립·비관 카드 "자세히" 클릭 시 예측 범위 상세 시트가 열림<br>-이동.01: AI 추천 카드 "시세 상세 보기" 클릭 시 해당 작물의 품종 상세 화면(/price/$variety)으로 이동함<br>-저장.01: 조건 선택 값(작물·관점·예측 범위·등급·수량·단위·도매시장)은 브라우저에 저장되어 다음 방문 시 복원됨<br>-자동동작.01: 화면 상단 새로고침 버튼 클릭 시 안내 토스트 "최신 시세로 업데이트했어요"만 표시되고 실제 예측 데이터 재조회는 이루어지지 않음<br>-미구현.02: "리포트 미리보기" 버튼은 안내 토스트 "리포트 미리보기는 준비 중입니다."만 표시하고 실제 리포트 화면·API 연동 없음<br>-미구현.03: 예측 근거의 날씨 영향 카드, 추세 방향성 카드, 경매·수급 동향 카드, 가격 전망 리포트 카드, 주제별 관련 뉴스 카드는 모두 고정 값으로 표시되며 실제 데이터와 연동되지 않음<br>-미구현.04: 등급 세그먼트는 등급별 실 데이터 연동 없이 계수 보정만 적용되는 베타 기능임 | Route: /prediction<br>File: src/routes/prediction.tsx<br>Baseline: 2026-08-05 코드 기준<br>기술근거.01: 상태 저장소 usePredictionView(src/features/prediction/usePredictionView.ts, zustand persist, localStorage key "agdict:aiPricePrediction", version 4, migrate: fromVersion<3이면 quantityUnit="box", fromVersion<4이면 selectedGrade="특"로 보정)<br>기술근거.02: 예측 데이터 산출 로직 src/features/prediction/usePrediction.ts, src/features/prediction/mockPredictionData.ts(buildMockPrediction, seed 의사난수)<br>기술근거.03: 조건 유효성 검증 함수 isPredictableCropId·getPredictableCrop<br>⚠️ 확인 필요.01: 화면에는 오늘 실제 시세 조회일이 직접 노출되지 않고 "오늘 대비" 문구로만 간접 표현됨 |
| DS-0601 | 예측 메인 | PRD-001_prediction_Default | Tracking | - | Route: /prediction<br>File: src/routes/prediction.tsx<br>Baseline: 2026-08-05 코드 기준<br>⚠️ 확인 필요.01: 코드 내 이벤트 로깅·트래킹 함수 호출이 발견되지 않음(분석 도구 연동 없음) |
| DS-0601 | 예측 메인 | PRD-001_prediction_Default | Design | -배경색.01: 페이지 배경 흰색(#FFFFFF)<br>-배경색.02: 조건 선택 그리드 일반 셀 배경 흰색(#FFFFFF), 유형 셀 강조 배경 연한 초록색(#F0F9F0)<br>-배경색.03: 예측 범위 토글·등급 세그먼트 트랙 배경 연한 회색(#F1F3F5)<br>-배경색.04: AI 추천 카드 배경 대각선 그라디언트(#2E9E6B→#1F7A50→#145A3A)<br>-배경색.05: 시점 비교 강조 배너 배경 대각선 그라디언트(#2E9E6B→#1F7A50, 이득일 때) 또는 (#E03131→#B02525, 손실일 때)<br>-배경색.06: 시점 비교 선택·추천 카드 배경 연한 초록색(#EAF7F0)<br>-배경색.07: 등급·낙관중립비관 카드 안내 박스 배경 연한 초록색(#F0F9F0), 예측 근거 하단 고지 박스 배경 연한 회색(#F8F9FA)<br>-배경색.08: AI 상세 리포트 안내 카드 배경 흰색(#FFFFFF), 테두리 점선 초록색(#2E9E6B)<br>-글자색.01: 본문 기본 글자색 진회색(#212529)<br>-글자색.02: 보조 설명 글자색 회색 계열(#6C757D, #868E96, #ADB5BD, 단계별로 옅어짐)<br>-글자색.03: 가격 상승 글자색 빨강(#E03131, #E03B3B), 가격 하락 글자색 파랑(#1971C2), 브랜드 초록(#3A8A3A, #2E9E6B, #1F5C1F, #1F7A50, #145A3A)<br>-글자색.04: 등급 세그먼트 NEW 배지 글자색 빨강(#D33), 배경 연한 분홍(#FFE9E9)<br>-글자굵기.01: 카드 타이틀 굵게(700), 헤드라인 숫자 매우 굵게(900)<br>-글자크기.01: 조건 그리드 값 14px, 라벨 11px<br>-글자크기.02: AI 추천 카드 날짜 헤드라인 38px, KPI 값 13~16px(화면 폭에 따라 가변)<br>-글자크기.03: 섹션 제목 13px, 보조 텍스트 11~11.5px, 하단 고지문 10.5px<br>-테두리.01: 카드 공통 테두리 1px 실선 연회색(#E9ECEF)<br>-테두리.02: 시점 비교 선택 카드 테두리 2px 실선 초록(#2E9E6B)<br>-테두리.03: 낙관중립비관 중립 카드 테두리 2px 실선 초록(#2E9E6B)<br>-모서리.01: 카드 모서리 12px~28px 둥근 처리, 조건 그리드 셀 모서리 12px<br>-안쪽여백.01: 조건 그리드 셀 안쪽 여백 가로 12px·세로 10px, 카드 안쪽 여백 12~20px<br>-요소간격.01: 조건 그리드 요소 간격 8px, 낙관중립비관 3열 카드 간격 8px<br>-그림자.01: AI 추천 카드 그림자 아래쪽 40px 퍼짐(rgba(46,158,107,0.55))<br>-그림자.02: 시점 비교 강조 배너 그림자 아래쪽 28px 퍼짐(rgba(46,158,107,0.6))<br>-아이콘크기.01: 화살표·스파클·상승하락 아이콘 16px, 소형 아이콘 12px<br>-아이콘색상.01: 조건 그리드 화살표 아이콘 회색(#ADB5BD), AI 추천 카드 스파클 아이콘 흰색(#FFFFFF)<br>-상태색.01: 실제 평균가 선 빨강(#E03B3B), 과거 거래량 바 연빨강(rgba(224,59,59,0.20)), 중립 예측선 초록(#2E9E6B), 낙관~비관 밴드 연초록(rgba(46,158,107,0.24)), 변곡점 마커 금색(#C9A227), 오늘 기준선 회색(#94A3B8), 최저가 라벨 파랑(#1971C2)<br>-투명도.01: AI 추천 카드 장식 원형 흐림 배경 불투명도 20~30%<br>-반응형.01: 좌우 중앙 정렬 최대 너비 430px 모바일 전용 레이아웃 | Route: /prediction<br>File: src/routes/prediction.tsx<br>Baseline: 2026-08-05 코드 기준<br>기술근거.01: 색상 실측 출처 src/styles.css(--background, --foreground, --secondary, --primary-tint, --border 등), src/features/prediction/components/PredictionInsightCard.tsx, PredictionCompareCards.tsx, PredictionScenarioCards.tsx, PredictionChart.tsx |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## PRD-001_prediction_Empty — 예측 메인 · 빈 상태

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0602 | 예측 메인 | PRD-001_prediction_Empty | Visible | -정의.01: 예측 데이터 또는 작물 정보 조회에 실패했을 때 노출되는 빈 상태 화면<br>-표시.01: 화면 상단 타이틀 "AI 시세 예측"은 유지되고 본문에는 안내 문구만 노출됨<br>-문구.01: "예측 정보를 불러올 수 없어요."<br>-빈상태.01: 위 문구 1건 외 다른 요소 없이 화면 세로 중앙에 배치됨 | Route: /prediction<br>File: src/routes/prediction.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-0602 | 예측 메인 | PRD-001_prediction_Empty | Invisible | -진입조건.01: 예측 데이터 조회 결과가 없거나 선택된 작물 정보가 존재하지 않는 경우 이 상태로 진입함<br>-데이터소스.01: 선택 작물 id의 유효성은 예측 가능 작물 목록(사과·배추·무·양파·마늘) 기준으로 판정함<br>-조건.01: 목록 외 작물 id가 들어오면 이 상태로 분기되나, 작물 선택 저장 로직 자체가 유효성 검사를 거치므로 실제로는 비정상 값이 저장되기 어려움<br>-액션.01: 이 화면에는 별도 사용자 액션이 없고 화면 공통 상단 영역의 기능만 유효함<br>-미구현.01: 재시도 버튼 등 복구 액션 없이 안내 문구만 존재함 | Route: /prediction<br>File: src/routes/prediction.tsx<br>Baseline: 2026-08-05 코드 기준<br>기술근거.01: 상태 저장소 usePredictionView(src/features/prediction/usePredictionView.ts) |
| DS-0602 | 예측 메인 | PRD-001_prediction_Empty | Tracking | - | Route: /prediction<br>File: src/routes/prediction.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-0602 | 예측 메인 | PRD-001_prediction_Empty | Design | -배경색.01: 페이지 배경 흰색(#FFFFFF)<br>-글자색.01: 안내 문구 글자색 회색(#6C757D)<br>-글자크기.01: 안내 문구 13px<br>-정렬.01: 컨테이너를 화면 중앙에 배치하고 최소 높이는 화면 세로의 60%로 확보함<br>-안쪽여백.01: 좌우 안쪽 여백 24px | Route: /prediction<br>File: src/routes/prediction.tsx<br>Baseline: 2026-08-05 코드 기준 |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## PRD-002_prediction-sheet-crop_Default — 작물 선택 시트 · 기본 상태

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0603 | 작물 선택 시트 | PRD-002_prediction-sheet-crop_Default | Visible | -정의.01: 하단에서 올라오는 시트 형태의 예측 작물 선택 화면. 검색창과 결과 목록으로 구성됨<br>-구성.01: 시트 상단 타이틀 "예측 작물 선택"<br>-구성.02: 둥근 모서리 검색 입력창(좌측에 검색 아이콘 배치)<br>-구성.03: 작물 목록(작물 아이콘, 작물명, 분류·품종 보조 텍스트, 선택 항목에는 체크 아이콘 표시)<br>-표시.01: 목록 항목은 구분선이 있는 카드 리스트 형태로 표시됨<br>-문구.01: 검색창 안내 문구 "예측 작물 검색"<br>-입력.01: 검색어 입력 시 작물명 또는 품종명에 포함되는 항목만 실시간으로 필터링됨(대소문자 구분 없음)<br>-버튼.01: 검색어 지우기 버튼(X 아이콘)<br>-목록항목.01: 예측 가능 작물 5종(사과·배추·무·양파·마늘)이 표시되며 각 항목에 분류명·품종명이 함께 표기됨<br>-상태표시.01: 현재 선택된 작물 항목은 연한 초록 배경과 초록색 체크 아이콘으로 강조됨<br>-빈상태.01: 검색 결과가 없으면 "검색 결과가 없어요." 문구가 표시됨<br>-접근성.01: 검색창 지우기 버튼에 "지우기" 접근성 라벨 부여 | Route: Parent=/prediction<br>File: src/features/prediction/components/PredictionCropSheet.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-0603 | 작물 선택 시트 | PRD-002_prediction-sheet-crop_Default | Invisible | -진입조건.01: 예측 메인 화면 조건 선택 그리드의 "작물" 셀 클릭 시 시트가 열림<br>-데이터소스.01: 예측 가능 작물 5종(사과·배추·무·양파·마늘, 전량 예측 가능 상태로 고정)의 목(mock) 목록을 사용함<br>-필터조건.01: 입력된 검색어의 앞뒤 공백을 제거하고 소문자로 변환한 뒤 작물명 또는 품종명에 포함되는 항목만 표시하며, 검색어가 없으면 전체 목록을 표시함<br>-액션.01: 목록 항목 클릭 시 해당 작물이 선택되고 시트가 자동으로 닫힘<br>-저장.01: 선택 결과는 예측 메인 화면의 조건 저장소에 반영되며, 유효하지 않은 작물 id는 기본 작물(사과)로 대체됨<br>-미구현.01: 카테고리별 그룹핑, 최근 조회, 즐겨찾기 등 부가 기능이 없으며 목록은 5종 고정으로 별도 데이터 조회 없이 노출됨 | Route: Parent=/prediction<br>File: src/features/prediction/components/PredictionCropSheet.tsx<br>Baseline: 2026-08-05 코드 기준<br>기술근거.01: 목록 데이터 출처 src/features/prediction/mockPredictionData.ts(PREDICTABLE_CROPS)<br>기술근거.02: 선택 저장 함수 usePredictionView.setSelectedCropId() |
| DS-0603 | 작물 선택 시트 | PRD-002_prediction-sheet-crop_Default | Tracking | - | Route: Parent=/prediction<br>File: src/features/prediction/components/PredictionCropSheet.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-0603 | 작물 선택 시트 | PRD-002_prediction-sheet-crop_Default | Design | -배경색.01: 시트 배경 흰색(#FFFFFF), 선택된 항목 배경 연한 초록색(#F0F9F0)<br>-배경색.02: 검색창 배경 흰색(#FFFFFF), 테두리 1px 실선 연회색(#E9ECEF)<br>-글자색.01: 시트 타이틀 글자색 진회색(#212529), 15px, 굵게<br>-글자색.02: 목록 항목명 글자색 진회색(#212529, 비선택) 또는 진초록(#1F5C1F, 선택), 14px, 준굵게<br>-글자색.03: 분류·품종 보조 텍스트 글자색 회색(#868E96), 11px<br>-글자색.04: 검색창 안내 문구 글자색 연회색(#ADB5BD)<br>-테두리.01: 목록 컨테이너 테두리 1px 실선 연회색(#E9ECEF), 항목 간 구분선 1px 실선 옅은 회색(#F1F3F5)<br>-모서리.01: 시트 상단 모서리 16px, 목록 컨테이너 모서리 12px, 검색창 모서리 완전 둥근 처리<br>-높이.01: 검색창 높이 44px, 목록 영역 최대 높이는 화면 세로의 60%로 제한하고 넘으면 스크롤 처리됨<br>-안쪽여백.01: 목록 항목 안쪽 여백 가로 16px·세로 14px<br>-아이콘크기.01: 검색 아이콘 16px, 체크 아이콘 20px, 지우기 아이콘 14px<br>-아이콘색상.01: 검색 아이콘·지우기 아이콘 회색(#868E96), 체크 아이콘 초록(#3A8A3A) | Route: Parent=/prediction<br>File: src/features/prediction/components/PredictionCropSheet.tsx<br>Baseline: 2026-08-05 코드 기준 |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## PRD-002_prediction-sheet-crop_Empty — 작물 선택 시트 · 빈 상태

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0604 | 작물 선택 시트 | PRD-002_prediction-sheet-crop_Empty | Visible | -정의.01: 작물 선택 시트에서 검색 결과가 0건일 때의 빈 상태<br>-빈상태.01: 목록 영역에 "검색 결과가 없어요." 문구만 표시되며 상하 여백 40px과 함께 가운데 정렬됨 | Route: Parent=/prediction<br>File: src/features/prediction/components/PredictionCropSheet.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-0604 | 작물 선택 시트 | PRD-002_prediction-sheet-crop_Empty | Invisible | -진입조건.01: 검색어와 매칭되는 작물명·품종명이 하나도 없을 때 이 상태로 전환됨<br>-필터조건.01: DS-0603과 동일한 필터 로직을 사용하며 매칭 0건일 때만 이 상태로 전환됨<br>-미구현.01: 검색어 교정 제안, 인기 검색어 등 추가 안내 기능이 없음 | Route: Parent=/prediction<br>File: src/features/prediction/components/PredictionCropSheet.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-0604 | 작물 선택 시트 | PRD-002_prediction-sheet-crop_Empty | Tracking | - | Route: Parent=/prediction<br>File: src/features/prediction/components/PredictionCropSheet.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-0604 | 작물 선택 시트 | PRD-002_prediction-sheet-crop_Empty | Design | -글자색.01: 안내 문구 글자색 회색(#868E96)<br>-글자크기.01: 안내 문구 13px<br>-안쪽여백.01: 상하 안쪽 여백 40px<br>-정렬.01: 텍스트 가운데 정렬 | Route: Parent=/prediction<br>File: src/features/prediction/components/PredictionCropSheet.tsx<br>Baseline: 2026-08-05 코드 기준 |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## PRD-003_prediction-sheet-quantity_Default — 출하량·매입량 선택 시트 · 기본 상태

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0605 | 출하량·매입량 선택 시트 | PRD-003_prediction-sheet-quantity_Default | Visible | -정의.01: 하단 시트에서 단위(상자·kg·톤·개)를 선택하고 수량을 조정하는 화면<br>-구성.01: 시트 상단 타이틀 "출하량 선택"(농민 관점) 또는 "매입량 선택"(도매상 관점)<br>-구성.02: 단위 세그먼트(상자·kg·톤·개 4버튼)<br>-구성.03: 수량 카운터(감소 버튼, 숫자 입력, 단위 텍스트, 증가 버튼)<br>-구성.04: 프리셋 버튼 4열 2행 그리드(단위별 사전 정의 값)<br>-구성.05: 단위 환산 안내 박스<br>-구성.06: 하단 "적용" 버튼<br>-입력.01: 숫자 직접 입력(1~9999 범위로 제한)<br>-입력.02: 단위 세그먼트 선택 시 수량이 해당 단위의 기본값으로 초기화됨<br>-버튼.01: 감소·증가 버튼<br>-버튼.02: 프리셋 값 버튼(단위별로 상이: 상자 5/10/15/20/30/50/100, kg 10/50/100/200/500/1000, 톤 1/2/5/10/20/50, 개 10/50/100/300/500/1000)<br>-버튼.03: "적용" 버튼<br>-문구.01: 단위 환산 안내 "⚖️ 단위 환산 안내 · aT 경락 데이터는 상자·망·포대 등 규격이 혼재하고 kg이 미표기된 경우가 많아, 1kg 기준으로 환산해 시세를 계산해요. (선택 단위 기준 총액도 함께 표시)"<br>-상태표시.01: 현재 선택된 단위·프리셋 값은 흰 배경과 그림자 또는 초록 테두리로 강조됨<br>-접근성.01: 감소·증가 버튼에 각각 "감소"·"증가" 접근성 라벨 부여 | Route: Parent=/prediction<br>File: src/features/prediction/components/QuantityPickerSheet.tsx<br>Baseline: 2026-08-05 코드 기준<br>기술근거.01: 프리셋·단위 정의 src/features/prediction/quantityUnits.ts |
| DS-0605 | 출하량·매입량 선택 시트 | PRD-003_prediction-sheet-quantity_Default | Invisible | -진입조건.01: 예측 메인 화면 조건 선택 그리드의 "출하량" 또는 "매입량" 셀 클릭 시 시트가 열리며, 타이틀은 관점(농민 또는 도매상)에 따라 "출하량"·"매입량"으로 결정됨<br>-초기값.01: 시트가 열릴 때마다 상위 화면의 현재 수량·단위 값으로 내부 상태가 동기화됨<br>-입력제한.01: 숫자 입력이 올바르지 않으면 최소 증감 단위 값으로 대체되며 1~9999 범위로 제한됨<br>-검증.01: "적용" 클릭 시 단위별 최소 증감 단위 이상, 최대 9999 이하로 최종 보정됨<br>-계산식.01: 단위 변경 시 수량은 단위별 기본값(상자=15, kg=100, 톤=2, 개=100)으로 재설정됨<br>-계산식.02: 증감 단위는 단위별로 상이함(상자=1, kg=10, 톤=1, 개=10)<br>-액션.01: "적용" 클릭 시 보정된 수량·단위가 상위 화면에 반영되고 시트가 닫힘<br>-저장.01: 결과는 예측 메인 화면의 조건 저장소에 반영되어 조건 그리드의 수량 표시가 갱신됨<br>-미구현.01: 단위를 변경할 때 기존 입력값을 환산하지 않고 단위별 기본값으로 재설정됨(예: kg 100 상태에서 상자로 바꾸면 15로 초기화되며 별도 환산 계산 없음) | Route: Parent=/prediction<br>File: src/features/prediction/components/QuantityPickerSheet.tsx<br>Baseline: 2026-08-05 코드 기준<br>기술근거.01: 상태 저장소 usePredictionView.setQuantity()<br>⚠️ 확인 필요.01: 단위 전환 시 수량 값이 환산되지 않고 단위별 기본값으로 초기화되는 동작이 의도된 사양인지 확인 필요 |
| DS-0605 | 출하량·매입량 선택 시트 | PRD-003_prediction-sheet-quantity_Default | Tracking | - | Route: Parent=/prediction<br>File: src/features/prediction/components/QuantityPickerSheet.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-0605 | 출하량·매입량 선택 시트 | PRD-003_prediction-sheet-quantity_Default | Design | -배경색.01: 시트 배경 흰색(#FFFFFF), 단위 세그먼트 트랙 배경 연회색(#F1F3F5)<br>-배경색.02: 선택된 단위 버튼 배경 흰색(그림자 포함), 선택된 프리셋 버튼 배경 연한 초록색(#F0F9F0)<br>-배경색.03: 단위 환산 안내 박스 배경 연한 초록색(#F0F9F0)<br>-배경색.04: "적용" 버튼 배경 초록(#3A8A3A), 눌림 시 진초록(#2F6F2F)<br>-글자색.01: 시트 타이틀 15px 굵게, 색상 진회색(#212529)<br>-글자색.02: 카운터 숫자 글자색 진회색(#212529), 30px, 매우 굵게<br>-글자색.03: 선택된 프리셋 버튼 글자색 진초록(#1F5C1F), 비선택 회색(#495057)<br>-글자색.04: 안내 문구 글자색 진초록(#2c6444), 11px<br>-테두리.01: 감소·증가 버튼 및 비선택 프리셋 버튼 테두리 1px 실선 연회색(#E9ECEF)<br>-테두리.02: 선택된 프리셋 버튼 테두리 1px 실선 초록(#3A8A3A)<br>-모서리.01: 카운터 버튼·프리셋 버튼 완전 둥근 처리<br>-모서리.02: 적용 버튼 모서리 12px<br>-높이.01: 감소·증가 버튼 44px×44px<br>-높이.02: 적용 버튼 높이 44px<br>-높이.03: 프리셋 버튼 높이 36px<br>-요소간격.01: 프리셋 그리드 요소 간격 8px, 4열 배치<br>-아이콘크기.01: 감소·증가 아이콘 16px | Route: Parent=/prediction<br>File: src/features/prediction/components/QuantityPickerSheet.tsx<br>Baseline: 2026-08-05 코드 기준 |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## PRD-004_prediction-sheet-market_Default — 도매시장 선택 시트 · 기본 상태

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0606 | 도매시장 선택 시트 | PRD-004_prediction-sheet-market_Default | Visible | -정의.01: 하단 시트 형태의 도매시장 선택 화면<br>-구성.01: 시트 상단 타이틀 "도매시장 선택"<br>-구성.02: 도매시장 목록(시장명·지역명, 선택 항목에는 체크 아이콘 표시)<br>-목록항목.01: 등록된 도매시장 전체 목록이 표시됨<br>-상태표시.01: 현재 선택된 시장 항목은 연한 초록 배경과 초록색 체크 아이콘으로 강조됨 | Route: Parent=/prediction<br>File: src/features/prediction/components/MarketPickerSheet.tsx<br>Baseline: 2026-08-05 코드 기준<br>기술근거.01: 목록 데이터 출처 src/lib/mock/markets.ts |
| DS-0606 | 도매시장 선택 시트 | PRD-004_prediction-sheet-market_Default | Invisible | -진입조건.01: 예측 메인 화면 조건 선택 그리드의 "도매시장" 셀 클릭 시 시트가 열림<br>-데이터소스.01: 목(mock) 도매시장 목록을 검색·필터 기능 없이 전체 노출함<br>-액션.01: 목록 항목 클릭 시 해당 도매시장이 선택되고 시트가 자동으로 닫힘<br>-저장.01: 선택 결과는 예측 메인 화면의 조건 저장소에 반영되나, 실제 예측 시세 계산에는 반영되지 않고 서울가락 기준 시세가 그대로 사용됨<br>-미구현.01: 도매시장을 변경해도 예측 시세·차트 결과가 실제로 바뀌지 않고 조건 그리드의 표시 라벨 용도로만 사용되며, 검색 기능이 없음 | Route: Parent=/prediction<br>File: src/features/prediction/components/MarketPickerSheet.tsx<br>Baseline: 2026-08-05 코드 기준<br>기술근거.01: 상태 저장소 usePredictionView.setMarketId()<br>⚠️ 확인 필요.01: 도매시장을 변경해도 시세 예측치가 바뀌지 않는 동작이 의도된 사양인지 확인 필요 |
| DS-0606 | 도매시장 선택 시트 | PRD-004_prediction-sheet-market_Default | Tracking | - | Route: Parent=/prediction<br>File: src/features/prediction/components/MarketPickerSheet.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-0606 | 도매시장 선택 시트 | PRD-004_prediction-sheet-market_Default | Design | -배경색.01: 시트 배경 흰색(#FFFFFF), 선택 항목 배경 연한 초록색(#F0F9F0)<br>-글자색.01: 시트 타이틀 15px 굵게, 색상 진회색(#212529)<br>-글자색.02: 시장명 글자색 진회색(#212529, 비선택) 또는 진초록(#1F5C1F, 선택), 14px 준굵게<br>-글자색.03: 지역명 보조 텍스트 글자색 회색(#868E96), 11px<br>-테두리.01: 목록 컨테이너 테두리 1px 실선 연회색(#E9ECEF), 항목 간 구분선 1px 실선 옅은 회색(#F1F3F5)<br>-모서리.01: 시트 상단 모서리 16px, 목록 컨테이너 모서리 12px<br>-높이.01: 목록 영역 최대 높이는 화면 세로의 60%로 제한하고 넘으면 스크롤 처리됨<br>-안쪽여백.01: 목록 항목 안쪽 여백 가로 16px·세로 12px<br>-아이콘크기.01: 체크 아이콘 20px, 색상 초록(#3A8A3A) | Route: Parent=/prediction<br>File: src/features/prediction/components/MarketPickerSheet.tsx<br>Baseline: 2026-08-05 코드 기준 |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## PRD-005_prediction-sheet-viewpoint_Default — 관점 선택 시트 · 기본 상태

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0607 | 관점 선택 시트 | PRD-005_prediction-sheet-viewpoint_Default | Visible | -정의.01: 하단 시트 형태의 관점(농민·도매상) 선택 화면<br>-구성.01: 시트 상단 타이틀 "유형 선택"<br>-구성.02: 관점 목록 2건(농민, 도매상)<br>-목록항목.01: "농민"(부제 "출하 시점 추천"), "도매상"(부제 "매입 시점 추천")<br>-상태표시.01: 현재 선택된 관점 항목은 연한 초록 배경과 초록색 체크 아이콘으로 강조됨 | Route: Parent=/prediction<br>File: src/features/prediction/components/ViewpointPickerSheet.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-0607 | 관점 선택 시트 | PRD-005_prediction-sheet-viewpoint_Default | Invisible | -진입조건.01: 예측 메인 화면 조건 선택 그리드의 "유형" 셀 클릭 시 시트가 열림<br>-데이터소스.01: 농민·도매상 2건이 화면 내부에 고정값으로 정의되어 있음<br>-액션.01: 목록 항목 클릭 시 해당 관점이 선택되고 시트가 자동으로 닫힘<br>-저장.01: 선택 결과는 예측 메인 화면의 조건 저장소에 반영되며, 이 값에 따라 화면 전체(AI 추천 카드, 시점 비교, KPI 라벨 등)의 농민·도매상 문구와 계산이 전환됨<br>-미구현.01: 관점 옵션은 농민·도매상 2종으로 고정되어 있고 추가 역할군이 없음 | Route: Parent=/prediction<br>File: src/features/prediction/components/ViewpointPickerSheet.tsx<br>Baseline: 2026-08-05 코드 기준<br>기술근거.01: 상태 저장소 usePredictionView.setSelectedViewpoint() |
| DS-0607 | 관점 선택 시트 | PRD-005_prediction-sheet-viewpoint_Default | Tracking | - | Route: Parent=/prediction<br>File: src/features/prediction/components/ViewpointPickerSheet.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-0607 | 관점 선택 시트 | PRD-005_prediction-sheet-viewpoint_Default | Design | -배경색.01: 시트 배경 흰색(#FFFFFF), 선택 항목 배경 연한 초록색(#F0F9F0)<br>-글자색.01: 시트 타이틀 15px 굵게, 색상 진회색(#212529)<br>-글자색.02: 항목명 글자색 진회색(#212529, 비선택) 또는 진초록(#1F5C1F, 선택), 14px 준굵게<br>-글자색.03: 부제 텍스트 글자색 회색(#868E96), 11px<br>-테두리.01: 목록 컨테이너 테두리 1px 실선 연회색(#E9ECEF), 항목 간 구분선 1px 실선 옅은 회색(#F1F3F5)<br>-모서리.01: 시트 상단 모서리 16px, 목록 컨테이너 모서리 12px<br>-안쪽여백.01: 목록 항목 안쪽 여백 가로 16px·세로 12px<br>-아이콘크기.01: 체크 아이콘 20px, 색상 초록(#3A8A3A) | Route: Parent=/prediction<br>File: src/features/prediction/components/ViewpointPickerSheet.tsx<br>Baseline: 2026-08-05 코드 기준 |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## PRD-006_prediction-sheet-range_Default — 예측 범위 상세 시트 · 기본 상태

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0608 | 예측 범위 상세 시트 | PRD-006_prediction-sheet-range_Default | Visible | -정의.01: 낙관·중립·비관 카드의 "자세히" 클릭 시 열리는 예측 범위 설명 시트<br>-구성.01: 시트 상단 타이틀 "예측 범위 자세히"<br>-구성.02: 상단 설명 문구<br>-구성.03: "유력 범위"(가능성 60%) 카드, "최대 범위"(가능성 90%) 카드<br>-구성.04: 하단 안내 박스, "확인" 버튼<br>-문구.01: "AI는 하나의 값이 아니라 가격이 들어올 범위를 예측합니다. 확신하는 정도에 따라 범위의 넓이가 달라집니다."<br>-문구.02: "가격이 이 안에 들 가능성 60%", "거의 대부분(90%)이 이 안에 듭니다"<br>-문구.03: 하단 안내 "📌 화면의 낙관·중립·비관은 이 범위에서 각각 위쪽·가운데·아래쪽 값입니다. 중립이 가장 가능성이 높습니다."<br>-버튼.01: "확인" 버튼(클릭 시 시트가 닫힘)<br>-표시.01: 유력·최대 범위 카드는 "{하한} ~ {상한}"과 "원 / {기준 단위}" 형식으로 표시됨<br>-빈상태.01: 선택 지점 또는 중립·낙관·비관 예측가 중 하나라도 없으면 범위 카드 2건이 표시되지 않고 설명 문구, 안내 박스, 확인 버튼만 표시됨 | Route: Parent=/prediction<br>File: src/features/prediction/components/PredictionRangeDetailSheet.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-0608 | 예측 범위 상세 시트 | PRD-006_prediction-sheet-range_Default | Invisible | -진입조건.01: 예측 메인 화면 낙관·중립·비관 카드의 "자세히" 텍스트를 클릭하거나 키보드 Enter·Space를 입력하면 시트가 열림<br>-데이터소스.01: 예측 메인 화면에서 전달되는 선택 지점의 예측가와 기준 단위 라벨을 사용함<br>-계산식.01: 낙관가와 비관가 차이의 절반을 스프레드 값으로 산출함<br>-계산식.02: 유력 범위(60%) 하한·상한은 중립 예측가에서 스프레드의 55%를 빼거나 더한 값으로 산출함<br>-계산식.03: 최대 범위(90%)는 비관가~낙관가 값을 그대로 표시함<br>-조건.01: 중립·낙관·비관 예측가 중 하나라도 없으면 범위 카드 영역이 표시되지 않음<br>-액션.01: "확인" 버튼 클릭 시 시트가 닫힘<br>-미구현.01: 60%·90% 신뢰구간 수치는 화면 표시용 근사 계산값이며 실제 통계적 신뢰구간 모델과 연동되지 않음 | Route: Parent=/prediction<br>File: src/features/prediction/components/PredictionRangeDetailSheet.tsx<br>Baseline: 2026-08-05 코드 기준<br>기술근거.01: 타입 정의 src/features/prediction/types.ts<br>⚠️ 확인 필요.01: 유력 범위(60%) 산출에 사용되는 0.55 계수의 통계적 근거 확인 필요 |
| DS-0608 | 예측 범위 상세 시트 | PRD-006_prediction-sheet-range_Default | Tracking | - | Route: Parent=/prediction<br>File: src/features/prediction/components/PredictionRangeDetailSheet.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-0608 | 예측 범위 상세 시트 | PRD-006_prediction-sheet-range_Default | Design | -배경색.01: 시트 배경 흰색(#FFFFFF)<br>-배경색.02: 범위 카드 배경 흰색(#FFFFFF), 테두리 1px 실선 연회색(#E9ECEF)<br>-배경색.03: 하단 안내 박스 배경 연한 초록색(#F0F9F0)<br>-배경색.04: "확인" 버튼 배경 초록(#2E9E6B), 눌림 시 진초록(#1F7A50)<br>-글자색.01: 시트 타이틀 15px 굵게, 색상 진회색(#212529)<br>-글자색.02: 설명 문구 글자색 회색(#495057), 12px<br>-글자색.03: 범위 카드 타이틀 글자색 진회색(#212529), 12.5px 굵게<br>-글자색.04: 범위 카드 보조 문구 글자색 회색(#6C757D), 11px<br>-글자색.05: 하단 안내 문구 글자색 진초록(#2c6444), 11.5px<br>-모서리.01: 범위 카드 모서리 12px, 확인 버튼 모서리 12px, 시트 상단 모서리 16px<br>-높이.01: 확인 버튼 높이 44px<br>-요소간격.01: 범위 카드 간 세로 간격 8px<br>-상태색.01: 유력 범위 인디케이터 바 배경 초록(#2E9E6B), 최대 범위 인디케이터 바 배경 연초록(rgba(46,158,107,0.4)) | Route: Parent=/prediction<br>File: src/features/prediction/components/PredictionRangeDetailSheet.tsx<br>Baseline: 2026-08-05 코드 기준 |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## 분석 파일

- src/routes/prediction.tsx
- src/features/prediction/usePrediction.ts
- src/features/prediction/usePredictionView.ts
- src/features/prediction/mockPredictionData.ts
- src/features/prediction/types.ts
- src/features/prediction/quantityUnits.ts
- src/features/prediction/components/PredictionConditionGrid.tsx
- src/features/prediction/components/PredictionGradeSegment.tsx
- src/features/prediction/components/PredictionInsightCard.tsx
- src/features/prediction/components/PredictionChart.tsx
- src/features/prediction/components/PredictionScenarioCards.tsx
- src/features/prediction/components/PredictionCompareCards.tsx
- src/features/prediction/components/PredictionFactorList.tsx
- src/features/prediction/components/PredictionRationaleExtras.tsx
- src/features/prediction/components/PredictionCropSheet.tsx
- src/features/prediction/components/QuantityPickerSheet.tsx
- src/features/prediction/components/MarketPickerSheet.tsx
- src/features/prediction/components/ViewpointPickerSheet.tsx
- src/features/prediction/components/PredictionRangeDetailSheet.tsx
- src/lib/mock/markets.ts
- src/lib/mock/weather.ts
- src/styles.css

## 미구현·확인필요 요약

- 실제 시세 예측 API 연동 없음. 의사난수 기반 목(mock) 데이터로 화면을 구성함(DS-0601)
- "리포트 미리보기" 버튼은 준비 중 안내만 표시하고 실제 리포트 화면·API 연동 없음(DS-0601)
- 예측 근거 섹션의 날씨 영향, 추세 방향성, 경매·수급 동향, 가격 전망 리포트, 주제별 관련 뉴스 카드는 모두 고정 값으로 실제 데이터와 연동되지 않음(DS-0601)
- 등급 세그먼트는 등급별 실 데이터 연동 없이 계수 보정만 적용되는 베타 기능임(DS-0601)
- 출하량·매입량 시트에서 단위 변경 시 기존 입력값이 환산되지 않고 단위별 기본값으로 초기화됨. 의도된 사양인지 확인 필요(DS-0605)
- 도매시장 선택 시트에서 도매시장을 변경해도 실제 예측 시세·차트 결과가 바뀌지 않음. 의도된 사양인지 확인 필요(DS-0606)
- 예측 범위 상세 시트의 유력 범위(60%) 산출에 쓰이는 0.55 계수의 통계적 근거 확인 필요(DS-0608)
- 화면 전반에 걸쳐 이벤트 로깅·트래킹 코드가 발견되지 않음(분석 도구 연동 없음)
