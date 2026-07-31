# AI 시세 예측 DS 초안

- Menu ID: prediction
- Registry: docs/ds/screen-registry.json
- Baseline: 2026-07-31 코드 기준

## PRD-001_prediction_Default — 예측 메인

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0601 | 예측 메인 | PRD-001_prediction_Default | Visible | 정의.01: AI 시세 예측 메인 화면. 상단 조건 선택 그리드 → 등급 세그먼트 → AI 추천 카드 → 가격 예측 차트 → 낙관/중립/비관 카드 → 출하·매입 시점 비교 → 예측 근거 → AI 상세 예측 리포트(프리미엄) 순으로 구성됨.<br>구성.01: PredictionConditionGrid(출하량·매입량/작물/도매시장/유형 4칸 그리드)<br>구성.02: PredictionGradeSegment(등급 세그먼트: 전체/상(특)/중/하, "NEW" 배지)<br>구성.03: PredictionInsightCard(관점별 AI 추천 카드)<br>구성.04: 예측 범위 토글(7일/10일/14일/30일) + PredictionChart<br>구성.05: PredictionScenarioCards(낙관·중립·비관 3열 카드)<br>구성.06: PredictionCompareCards(출하/매입 시점 비교 배너+2카드)<br>구성.07: 예측 근거 섹션(날씨 영향 카드, TrendDirectionCard, AuctionSupplyCard, PredictionFactorList, PriceOutlookReportCard, TopicRelatedNewsCard)<br>구성.08: "AI 상세 예측 리포트" 프리미엄 안내 카드<br>표시.01: AppHeader 타이틀 "AI 시세 예측"<br>표시.02: 차트 상단 업데이트 시각 "최근 업데이트 {prediction.updatedAt}"<br>문구.01: 차트 범례 "실제 평균가", "중립 예측", "낙관~비관 범위", "변곡점"<br>문구.02: PredictionChart 상단 헤드라인 "{선택 날짜} 예상 시세" — "수익"이 아닌 "예상 시세" 표현을 사용(PredictionChart.tsx 상단 정보 블록)<br>문구.03: PredictionInsightCard KPI 라벨 "예상 평균가", "예상 매출"(농민)/"예상 매입액"(도매상), "예상 추가 수익"(농민)/"예상 절감액"(도매상)<br>문구.04: PredictionCompareCards 배너 라벨 "예상 추가 수익"(농민)/"예상 절감"(도매상)<br>문구.05: 하단 고지문 "본 예측은 데이터 기반 AI의 참고용 세컨드 오피니언입니다. 실제 시세와 다를 수 있으니 최종 판단은 사용자에게 있습니다."<br>입력.01: 등급 세그먼트 클릭(전체/상(특)/중/하)<br>입력.02: 예측 범위 토글 버튼(7일/10일/14일/30일)<br>버튼.01: "리포트 미리보기 ›" 버튼<br>버튼.02: "시세 상세 보기" 버튼(PredictionInsightCard)<br>목록항목.01: 예측 근거 팩터 목록(prediction.factors: "최근 거래량 감소", "주말 전 수요 증가", "휴장 이후 반입량 증가 가능성")<br>상태표시.01: 관점별 카드 배지 "AI 출하 추천"/"AI 출하 안내"(농민), "AI 매입 추천"/"AI 매입 안내"(도매상)<br>상태표시.02: PredictionCompareCards 태그 "추천"/"선택"<br>도움말.01: 등급 세그먼트 하단 "※ 시세는 출하량 단위(10kg) 기준 표시 · aT 규격 혼재분은 kg 환산 처리. 등급은 연동 확정 시 활성화(베타)."<br>도움말.02: 시나리오 카드 하단 안내문 + "자세히›" 링크(PredictionRangeDetailSheet 오픈)<br>도움말.03: 수량 선택 결과에 따른 표시 라벨 "{quantityBoxes}{QUANTITY_UNIT_LABEL[unit]}" | Registry: docs/ds/screen-registry.json<br>Route: /prediction<br>File: src/routes/prediction.tsx<br>Baseline: 2026-07-31 코드 기준<br>Components: PredictionConditionGrid, PredictionGradeSegment, PredictionInsightCard, PredictionChart, PredictionScenarioCards, PredictionCompareCards, PredictionFactorList, PredictionRationaleExtras |
| DS-0602 | 예측 메인 | PRD-001_prediction_Default | Invisible | 진입조건.01: 라우트 /prediction 진입 시 search 파라미터 cropId 또는 crop이 isPredictableCropId()로 유효하면 usePredictionView.setSelectedCropId()로 자동 반영(useEffect)<br>데이터소스.01: mockPredictionData.ts의 PREDICTABLE_CROPS(사과·배추·무·양파·마늘 5종, 전 종목 marketId="seoul-garak" 고정)<br>데이터소스.02: usePrediction(selectedCropId, selectedRangeDays, selectedGrade) → useMemo로 buildMockPrediction() 호출<br>API.01: 미구현.01: 실제 시세 예측 API 연동 없음. buildMockPrediction()의 seed() 의사난수(LCG)로 미래 가격을 생성하는 mock 데이터만 사용<br>초기값.01: usePredictionView(zustand persist, localStorage key "agdict:aiPricePrediction", version 4) 기본값 selectedCropId="apple", selectedViewpoint="farmer", selectedRangeDays=7, selectedGrade="특", quantityUnit="box"/quantityBoxes=15, marketId="seoul-garak"<br>조건.01: selectedDayIndex(차트에서 클릭 선택한 날짜)는 selectedRangeDays·selectedCropId·selectedGrade가 바뀌면 null로 초기화됨(useEffect)<br>조건.02: 표시 날짜(selectedDate)는 recommendedIdx(예측 구간 내 최고가 지점) 우선, 없으면 lastForecastIdx(마지막 예측 지점) 사용. 사용자가 차트에서 다른 지점을 클릭하면 selectedDayIndex가 우선 적용됨<br>계산식.01: priceDiff = selectedPrice - prediction.currentPrice; isPositiveForUser = 농민이면 priceDiff>0, 도매상이면 priceDiff<0<br>계산식.02: PredictionInsightCard 내부 totalRevenue = expectedPrice×quantityBoxes, gain = 농민이면 totalDiff, 도매상이면 -totalDiff<br>계산식.03: PredictionCompareCards의 diff = (expectedPrice×quantityBoxes) - (currentPrice×quantityBoxes), gain = 농민이면 diff, 도매상이면 -diff<br>확인필요.01: prediction.currentDate(오늘 실제 시세 조회일, formatDate(new Date()))와 insight.recommendationDate/selectedDate(예측 대상 미래 날짜)는 코드상 서로 다른 필드로 명확히 구분되나, 화면에는 currentDate 자체는 노출되지 않고 "오늘 대비" 문구로만 간접 표현됨. prediction.updatedAt(예측 모델 업데이트 시각)도 currentDate·recommendationDate와 별개로 존재<br>분기.01: !prediction \|\| !cropMeta 인 경우 PRD-001_prediction_Empty 상태로 분기<br>액션.01: onQuantityClick/onCropClick/onMarketClick/onViewpointClick → 각 시트의 open state를 true로 설정<br>액션.02: onOpenRangeDetail → rangeDetailOpen=true<br>이동.01: PredictionInsightCard "시세 상세 보기" 클릭 시 navigate({to:"/price/$variety", params:{variety: prediction.cropId}})<br>저장.01: usePredictionView persist 미들웨어로 localStorage에 선택 조건 저장. migrate: fromVersion<3이면 quantityUnit="box", fromVersion<4이면 selectedGrade="특"로 보정<br>자동동작.01: AppHeader 새로고침 버튼 클릭 시 setNow(new Date()) 및 toast("최신 시세로 업데이트했어요") 표시 — 실제 예측 데이터 재조회는 하지 않음<br>미구현.02: "리포트 미리보기" 버튼은 toast("리포트 미리보기는 준비 중입니다.")만 표시하고 실제 리포트 화면/API 연동 없음<br>미구현.03: 예측 근거의 "날씨 영향" 카드, TrendDirectionCard, AuctionSupplyCard, PriceOutlookReportCard, TopicRelatedNewsCard는 모두 하드코딩된 고정 값(실제 API 미연동) | Registry: docs/ds/screen-registry.json<br>Route: /prediction<br>File: src/routes/prediction.tsx<br>Baseline: 2026-07-31 코드 기준<br>Store: usePredictionView(src/features/prediction/usePredictionView.ts) |
| DS-0603 | 예측 메인 | PRD-001_prediction_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: /prediction<br>File: src/routes/prediction.tsx<br>Baseline: 2026-07-31 코드 기준 |
| DS-0604 | 예측 메인 | PRD-001_prediction_Default | Design | 컴포넌트.01: PredictionConditionGrid, PredictionGradeSegment, PredictionInsightCard, PredictionChart, PredictionScenarioCards, PredictionCompareCards, PredictionFactorList, TrendDirectionCard/AuctionSupplyCard/PriceOutlookReportCard/TopicRelatedNewsCard(PredictionRationaleExtras.tsx)<br>클래스.01: 카드 공통 rounded-2xl 또는 rounded-xl, border border-[#E9ECEF], bg-white<br>토큰.01: PredictionInsightCard 배경 그라디언트 "linear-gradient(145deg, #2E9E6B 0%, #1F7A50 55%, #145A3A 100%)"<br>토큰.02: 브랜드 그린 #3A8A3A/#2E9E6B, 경고·상승 레드 #E03B3B/#E03131, 하락 블루 #1971C2<br>아이콘.01: lucide-react ChevronRight, Sparkles, TrendingUp/TrendingDown, Info, AlertTriangle<br>상태스타일.01: 등급/범위 세그먼트 active 시 bg-white text-[#1F5C1F] shadow-sm<br>반응형.01: mx-auto max-w-[430px] 모바일 전용 레이아웃(AppShell 공통) | Registry: docs/ds/screen-registry.json<br>Route: /prediction<br>File: src/routes/prediction.tsx<br>Baseline: 2026-07-31 코드 기준 |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## PRD-001_prediction_Empty — 예측 메인(정보 없음)

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0605 | 예측 메인(정보 없음) | PRD-001_prediction_Empty | Visible | 정의.01: prediction 또는 cropMeta 조회 실패 시 노출되는 빈 상태 화면<br>표시.01: AppHeader 타이틀 "AI 시세 예측" 유지, 본문에 안내 문구만 노출<br>문구.01: "예측 정보를 불러올 수 없어요."<br>빈상태.01: 위 문구 1건 외 다른 UI 요소 없음(px-6 text-center) | Registry: docs/ds/screen-registry.json<br>Route: /prediction<br>File: src/routes/prediction.tsx<br>Baseline: 2026-07-31 코드 기준 |
| DS-0606 | 예측 메인(정보 없음) | PRD-001_prediction_Empty | Invisible | 진입조건.01: usePrediction(selectedCropId, selectedRangeDays, selectedGrade)이 null을 반환하거나 getPredictableCrop(selectedCropId)이 undefined인 경우<br>데이터소스.01: isPredictableCropId()/getPredictableCrop()으로 selectedCropId 유효성 판정(mockPredictionData.ts)<br>조건.01: PREDICTABLE_CROPS(사과·배추·무·양파·마늘) 목록 외 cropId가 들어오면 이 상태로 진입 가능하나, setSelectedCropId 자체가 유효성 검사를 거치므로 정상 플로우에서는 도달 빈도가 낮음<br>확인필요.01: 실제 서비스에서 이 Empty 상태에 도달하는 구체적 업무 트리거(예: 신규 작물 예측 미지원 구간)는 코드만으로 확정 불가 | Registry: docs/ds/screen-registry.json<br>Route: /prediction<br>File: src/routes/prediction.tsx<br>Baseline: 2026-07-31 코드 기준 |
| DS-0607 | 예측 메인(정보 없음) | PRD-001_prediction_Empty | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: /prediction<br>File: src/routes/prediction.tsx<br>Baseline: 2026-07-31 코드 기준 |
| DS-0608 | 예측 메인(정보 없음) | PRD-001_prediction_Empty | Design | 컴포넌트.01: div(text-[13px] text-[#6C757D])<br>클래스.01: grid min-h-[60vh] place-items-center px-6 text-center | Registry: docs/ds/screen-registry.json<br>Route: /prediction<br>File: src/routes/prediction.tsx<br>Baseline: 2026-07-31 코드 기준 |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## PRD-002_prediction-sheet-crop_Default — 작물 선택 시트

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0609 | 작물 선택 시트 | PRD-002_prediction-sheet-crop_Default | Visible | 정의.01: /prediction 하단 시트로 예측 대상 작물을 검색·선택하는 화면<br>표시.01: 시트 타이틀 "예측 작물 선택"<br>검색.01: 검색 입력창 placeholder "예측 작물 검색", 입력값 있을 때 지우기(X) 버튼 노출<br>목록항목.01: PREDICTABLE_CROPS 목록을 카드형 리스트로 표시(CropIcon, 작물명, "{categoryName} · {varietyName}")<br>상태표시.01: 선택된 작물 행은 bg-[#F0F9F0] 강조 및 우측 체크 아이콘(Check) 표시 | Registry: docs/ds/screen-registry.json<br>Route: Parent=/prediction<br>File: src/features/prediction/components/PredictionCropSheet.tsx |
| DS-0610 | 작물 선택 시트 | PRD-002_prediction-sheet-crop_Default | Invisible | 데이터소스.01: PREDICTABLE_CROPS(mockPredictionData.ts)<br>검색조건.01: 입력값(q)을 소문자로 trim 후 작물명(name) 또는 품종명(varietyName)에 부분일치(includes)하는 항목만 필터링(useMemo)<br>액션.01: 항목 클릭 시 onSelect(cropId) 호출 후 onOpenChange(false)로 시트 닫힘<br>저장.01: 상위(prediction.tsx)에서 usePredictionView.setSelectedCropId(id) 호출 | Registry: docs/ds/screen-registry.json<br>Route: Parent=/prediction<br>File: src/features/prediction/components/PredictionCropSheet.tsx |
| DS-0611 | 작물 선택 시트 | PRD-002_prediction-sheet-crop_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: Parent=/prediction<br>File: src/features/prediction/components/PredictionCropSheet.tsx |
| DS-0612 | 작물 선택 시트 | PRD-002_prediction-sheet-crop_Default | Design | 컴포넌트.01: Sheet/SheetContent(side="bottom", rounded-t-2xl)<br>아이콘.01: lucide-react Check, Search, X / CropIcon(@/components/crop-icon)<br>반응형.01: mx-auto max-w-[430px], 목록 영역 max-h-[60vh] overflow-y-auto | Registry: docs/ds/screen-registry.json<br>Route: Parent=/prediction<br>File: src/features/prediction/components/PredictionCropSheet.tsx |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## PRD-002_prediction-sheet-crop_Empty — 작물 선택 시트(검색 결과 없음)

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0613 | 작물 선택 시트(검색 결과 없음) | PRD-002_prediction-sheet-crop_Empty | Visible | 빈상태.01: 검색 결과가 없을 때 목록 대신 "검색 결과가 없어요." 문구 표시 | Registry: docs/ds/screen-registry.json<br>Route: Parent=/prediction<br>File: src/features/prediction/components/PredictionCropSheet.tsx |
| DS-0614 | 작물 선택 시트(검색 결과 없음) | PRD-002_prediction-sheet-crop_Empty | Invisible | 진입조건.01: filtered.length === 0 (검색어와 일치하는 작물이 PREDICTABLE_CROPS에 없을 때) | Registry: docs/ds/screen-registry.json<br>Route: Parent=/prediction<br>File: src/features/prediction/components/PredictionCropSheet.tsx |
| DS-0615 | 작물 선택 시트(검색 결과 없음) | PRD-002_prediction-sheet-crop_Empty | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: Parent=/prediction<br>File: src/features/prediction/components/PredictionCropSheet.tsx |
| DS-0616 | 작물 선택 시트(검색 결과 없음) | PRD-002_prediction-sheet-crop_Empty | Design | 클래스.01: py-10 text-center text-[13px] text-[#868E96] | Registry: docs/ds/screen-registry.json<br>Route: Parent=/prediction<br>File: src/features/prediction/components/PredictionCropSheet.tsx |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## PRD-003_prediction-sheet-quantity_Default — 출하량·매입량 선택 시트

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0617 | 출하량·매입량 선택 시트 | PRD-003_prediction-sheet-quantity_Default | Visible | 정의.01: /prediction 하단 시트로 수량과 단위를 선택하는 화면(농민=출하량, 도매상=매입량으로 heading이 바뀜)<br>표시.01: 시트 타이틀 "{heading} 선택"(heading은 "출하량" 또는 "매입량")<br>구성.01: 단위 세그먼트(상자/kg/톤/개, QUANTITY_UNITS), 수량 카운터(감소/증가 버튼+숫자 입력), 프리셋 버튼 그룹<br>입력.01: 숫자 직접 입력(min=step, 최대 QUANTITY_MAX=9999)<br>버튼.01: 감소(Minus)/증가(Plus) 버튼, 단위별 QUANTITY_UNIT_STEP만큼 증減<br>버튼.02: 프리셋 버튼(단위별 QUANTITY_UNIT_PRESETS 값)<br>버튼.03: "적용" 버튼<br>도움말.01: "⚖️ 단위 환산 안내 · aT 경락 데이터는 상자·망·포대 등 규격이 혼재하고 kg이 미표기된 경우가 많아, 1kg 기준으로 환산해 시세를 계산해요. (선택 단위 기준 총액도 함께 표시)" | Registry: docs/ds/screen-registry.json<br>Route: Parent=/prediction<br>File: src/features/prediction/components/QuantityPickerSheet.tsx |
| DS-0618 | 출하량·매입량 선택 시트 | PRD-003_prediction-sheet-quantity_Default | Invisible | 초기값.01: 시트가 열릴 때(open=true) 상위 value/unit으로 내부 state(n,u) 초기화(useEffect)<br>입력제한.01: clampQuantity(value, unit)로 각 단위별 step(box=1, kg=10, ton=1, ea=10) 배수 및 QUANTITY_MAX(9999) 범위로 보정<br>조건.01: 단위 변경 시 수량을 해당 단위의 QUANTITY_UNIT_DEFAULT 값으로 리셋(handleUnitChange)<br>액션.01: "적용" 클릭 시 onChange(clampQuantity(n,u), u) 호출 후 onOpenChange(false)<br>저장.01: 상위(prediction.tsx)에서 usePredictionView.setQuantity(value, unit) 호출 → quantityUnit·quantityBoxes 갱신 | Registry: docs/ds/screen-registry.json<br>Route: Parent=/prediction<br>File: src/features/prediction/components/QuantityPickerSheet.tsx<br>Store: quantityUnits.ts(QUANTITY_UNIT_STEP/PRESETS/DEFAULT/MAX) |
| DS-0619 | 출하량·매입량 선택 시트 | PRD-003_prediction-sheet-quantity_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: Parent=/prediction<br>File: src/features/prediction/components/QuantityPickerSheet.tsx |
| DS-0620 | 출하량·매입량 선택 시트 | PRD-003_prediction-sheet-quantity_Default | Design | 컴포넌트.01: Sheet/SheetContent(side="bottom", rounded-t-2xl)<br>아이콘.01: lucide-react Minus, Plus<br>상태스타일.01: 선택된 단위/프리셋 버튼은 bg-white text-[#1F5C1F] shadow-sm 또는 border-[#3A8A3A] bg-[#F0F9F0] text-[#1F5C1F] | Registry: docs/ds/screen-registry.json<br>Route: Parent=/prediction<br>File: src/features/prediction/components/QuantityPickerSheet.tsx |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## PRD-004_prediction-sheet-market_Default — 도매시장 선택 시트

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0621 | 도매시장 선택 시트 | PRD-004_prediction-sheet-market_Default | Visible | 정의.01: /prediction 하단 시트로 도매시장을 선택하는 화면<br>표시.01: 시트 타이틀 "도매시장 선택"<br>목록항목.01: MARKETS 목록을 카드형 리스트로 표시(시장명, 지역)<br>상태표시.01: 선택된 시장 행은 bg-[#F0F9F0] 강조 및 우측 체크 아이콘(Check) 표시 | Registry: docs/ds/screen-registry.json<br>Route: Parent=/prediction<br>File: src/features/prediction/components/MarketPickerSheet.tsx |
| DS-0622 | 도매시장 선택 시트 | PRD-004_prediction-sheet-market_Default | Invisible | 데이터소스.01: MARKETS(src/lib/mock/markets.ts) 전체 6개 시장(서울가락, 서울강서, 부산엄궁, 부산반여, 대구북부, 광주서부)<br>액션.01: 항목 클릭 시 onChange(m.id) 호출 후 onOpenChange(false)로 시트 닫힘<br>저장.01: 상위(prediction.tsx)에서 usePredictionView.setMarketId(id) 호출<br>확인필요.01: PREDICTABLE_CROPS의 각 작물은 marketId="seoul-garak"로 고정되어 있어, 다른 시장을 선택해도 예측 데이터(buildMockPrediction)에는 반영되지 않고 화면 표시용 marketName(marketId로 MARKETS에서 조회)만 바뀜 | Registry: docs/ds/screen-registry.json<br>Route: Parent=/prediction<br>File: src/features/prediction/components/MarketPickerSheet.tsx<br>Source: src/lib/mock/markets.ts |
| DS-0623 | 도매시장 선택 시트 | PRD-004_prediction-sheet-market_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: Parent=/prediction<br>File: src/features/prediction/components/MarketPickerSheet.tsx |
| DS-0624 | 도매시장 선택 시트 | PRD-004_prediction-sheet-market_Default | Design | 컴포넌트.01: Sheet/SheetContent(side="bottom", rounded-t-2xl)<br>아이콘.01: lucide-react Check<br>반응형.01: 목록 영역 max-h-[60vh] overflow-y-auto | Registry: docs/ds/screen-registry.json<br>Route: Parent=/prediction<br>File: src/features/prediction/components/MarketPickerSheet.tsx |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## PRD-005_prediction-sheet-viewpoint_Default — 관점 선택 시트

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0625 | 관점 선택 시트 | PRD-005_prediction-sheet-viewpoint_Default | Visible | 정의.01: /prediction 하단 시트로 농민/도매상 관점을 선택하는 화면<br>표시.01: 시트 타이틀 "유형 선택"<br>목록항목.01: "농민"(부제 "출하 시점 추천"), "도매상"(부제 "매입 시점 추천") 2개 옵션<br>상태표시.01: 선택된 항목은 bg-[#F0F9F0] 강조 및 우측 체크 아이콘(Check) 표시 | Registry: docs/ds/screen-registry.json<br>Route: Parent=/prediction<br>File: src/features/prediction/components/ViewpointPickerSheet.tsx |
| DS-0626 | 관점 선택 시트 | PRD-005_prediction-sheet-viewpoint_Default | Invisible | 데이터소스.01: 컴포넌트 내부 하드코딩 OPTIONS 배열(farmer/wholesaler 2건 고정)<br>액션.01: 항목 클릭 시 onChange(o.id) 호출 후 onOpenChange(false)로 시트 닫힘<br>저장.01: 상위(prediction.tsx)에서 usePredictionView.setSelectedViewpoint(v) 호출 → PredictionInsightCard/PredictionCompareCards의 관점별 문구·계산이 즉시 반영됨 | Registry: docs/ds/screen-registry.json<br>Route: Parent=/prediction<br>File: src/features/prediction/components/ViewpointPickerSheet.tsx |
| DS-0627 | 관점 선택 시트 | PRD-005_prediction-sheet-viewpoint_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: Parent=/prediction<br>File: src/features/prediction/components/ViewpointPickerSheet.tsx |
| DS-0628 | 관점 선택 시트 | PRD-005_prediction-sheet-viewpoint_Default | Design | 컴포넌트.01: Sheet/SheetContent(side="bottom", rounded-t-2xl)<br>아이콘.01: lucide-react Check | Registry: docs/ds/screen-registry.json<br>Route: Parent=/prediction<br>File: src/features/prediction/components/ViewpointPickerSheet.tsx |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## PRD-006_prediction-sheet-range_Default — 예측 범위 상세 시트

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0629 | 예측 범위 상세 시트 | PRD-006_prediction-sheet-range_Default | Visible | 정의.01: /prediction 예측 범위(낙관·중립·비관) 값을 상세 설명하는 하단 시트<br>표시.01: 시트 타이틀 "예측 범위 자세히"<br>문구.01: "AI는 하나의 값이 아니라 가격이 들어올 범위를 예측합니다. 확신하는 정도에 따라 범위의 넓이가 달라집니다."<br>목록항목.01: "유력 범위"(가능성 60%, {likelyLow}~{likelyHigh}), "최대 범위"(가능성 90%, {pessimisticPrice}~{optimisticPrice})<br>도움말.01: "📌 화면의 낙관·중립·비관은 이 범위에서 각각 위쪽·가운데·아래쪽 값입니다. 중립이 가장 가능성이 높습니다."<br>버튼.01: "확인" 버튼 | Registry: docs/ds/screen-registry.json<br>Route: Parent=/prediction<br>File: src/features/prediction/components/PredictionRangeDetailSheet.tsx |
| DS-0630 | 예측 범위 상세 시트 | PRD-006_prediction-sheet-range_Default | Invisible | 데이터소스.01: 상위(prediction.tsx)에서 전달한 point(현재 선택된 PredictionPoint: predictedPrice/optimisticPrice/pessimisticPrice)<br>계산식.01: spread=(optimisticPrice-pessimisticPrice)/2, likelyLow=Math.round(predictedPrice-spread×0.55), likelyHigh=Math.round(predictedPrice+spread×0.55)<br>조건.01: mid/opt/pess 셋 중 하나라도 없으면(has=false) 범위 목록 블록을 렌더링하지 않고 안내 문구·확인 버튼만 표시<br>액션.01: "확인" 버튼 클릭 시 onOpenChange(false) | Registry: docs/ds/screen-registry.json<br>Route: Parent=/prediction<br>File: src/features/prediction/components/PredictionRangeDetailSheet.tsx |
| DS-0631 | 예측 범위 상세 시트 | PRD-006_prediction-sheet-range_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: Parent=/prediction<br>File: src/features/prediction/components/PredictionRangeDetailSheet.tsx |
| DS-0632 | 예측 범위 상세 시트 | PRD-006_prediction-sheet-range_Default | Design | 컴포넌트.01: Sheet/SheetContent(side="bottom", rounded-t-2xl)<br>토큰.01: 강조색 #2E9E6B(유력 범위) / #2E9E6B 40% 투명도(최대 범위) | Registry: docs/ds/screen-registry.json<br>Route: Parent=/prediction<br>File: src/features/prediction/components/PredictionRangeDetailSheet.tsx |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## 분석 파일
- src/routes/prediction.tsx
- src/features/prediction/usePredictionView.ts
- src/features/prediction/usePrediction.ts
- src/features/prediction/mockPredictionData.ts
- src/features/prediction/types.ts
- src/features/prediction/quantityUnits.ts
- src/features/prediction/components/PredictionCropSheet.tsx
- src/features/prediction/components/QuantityPickerSheet.tsx
- src/features/prediction/components/MarketPickerSheet.tsx
- src/features/prediction/components/ViewpointPickerSheet.tsx
- src/features/prediction/components/PredictionRangeDetailSheet.tsx
- src/features/prediction/components/PredictionConditionGrid.tsx
- src/features/prediction/components/PredictionGradeSegment.tsx
- src/features/prediction/components/PredictionInsightCard.tsx
- src/features/prediction/components/PredictionCompareCards.tsx
- src/features/prediction/components/PredictionScenarioCards.tsx
- src/features/prediction/components/PredictionFactorList.tsx
- src/features/prediction/components/PredictionRationaleExtras.tsx
- src/features/prediction/components/PredictionChart.tsx
- src/features/prediction/components/PredictionWeatherCause.tsx (미사용 — 어떤 라우트/부모 컴포넌트에서도 import되지 않음)
- src/features/prediction/components/PredictionSummaryCard.tsx (미사용 — 어떤 라우트/부모 컴포넌트에서도 import되지 않음)
- src/features/prediction/components/PredictionDateWeatherCard.tsx (미사용 — 어떤 라우트/부모 컴포넌트에서도 import되지 않음)
- src/features/prediction/components/ViewpointDropdown.tsx (미사용 — 어떤 라우트/부모 컴포넌트에서도 import되지 않음)
- src/lib/mock/markets.ts
- src/store/location.ts
- src/components/app-shell.tsx
- src/components/app-header.tsx

## 미구현·확인필요 요약
총 9건 (미구현 6건, 확인필요 3건)

1. 미구현 — PRD-001_prediction_Default: "리포트 미리보기" 버튼은 toast만 표시, 실제 리포트 연동 없음.
2. 미구현 — PRD-001_prediction_Default: 예측 근거의 날씨 영향/추세 방향성/경매·수급 동향/가격 전망 리포트/주제별 관련 뉴스 카드는 모두 하드코딩 고정 값.
3. 미구현 — PRD-001_prediction_Default: 시세 예측 자체가 buildMockPrediction()의 의사난수 mock이며 실 API 미연동.
4. 미구현 — PRD-001_prediction_Default: AppHeader 새로고침 버튼은 toast만 표시할 뿐 실제 데이터 재조회 없음.
5. 미구현 — 파일 존재하나 어떤 화면에도 연결되지 않은 컴포넌트: PredictionWeatherCause.tsx, PredictionSummaryCard.tsx, PredictionDateWeatherCard.tsx, ViewpointDropdown.tsx.
6. 미구현 — PRD-006 시트: point 값이 없을 때(has=false) 범위 카드 자체가 렌더링되지 않음(별도 안내 없음).
7. 확인필요 — PRD-001_prediction_Default: currentDate(오늘 시세 조회일)·recommendationDate(예측일)·updatedAt(모델 업데이트 시각) 3개 날짜 개념이 코드상 분리되어 있으나 실제 화면 문구/업무 규칙상 각각의 노출 기준은 코드만으로 확정 불가.
8. 확인필요 — PRD-001_prediction_Empty: Empty 상태에 도달하는 구체적 업무 트리거는 코드만으로 확정 불가.
9. 확인필요 — PRD-004_prediction-sheet-market_Default: 도매시장을 변경해도 예측 계산에는 반영되지 않고 표시 라벨만 변경되는 것이 의도된 동작인지 코드만으로 확정 불가.
