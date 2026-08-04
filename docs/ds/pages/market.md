# 시세 DS

- Menu ID: market
- Registry: docs/ds/screen-registry.json
- Baseline: 2026-08-04 코드 기준

## MKT-001_market_Default — 시세 조회 메인

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0201 | 시세 조회 메인 | MKT-001_market_Default | Visible | -구성.01: 상단 검색바(MarketSearchBar) + 2x2 조건 선택 카드(MarketFilterBar: 조회 날짜/작물/도매시장/도매법인) + 헤드라인 카드(ProPriceHeadlineCard) + 탭형 분석 섹션(ProAnalysisSection)<br>-검색.01: 검색바 문구 "작물명·품종으로 검색"(클릭 시 /search 이동)<br>-표시.01: 헤드라인 카드에 품목·품종명, 시장·법인 조건, 현재가, 단위 표시, 전일/전주/전년 등락률, 경매 건수, 갱신시각, 반입량(상자) 표시<br>-구성.02: 분석 섹션 탭 6종 "차트/경매내역/시장비교/법인/산지/품종"(useMarketFilter.proTab)<br>-구성.03: 차트 탭 기간 필터 5종 "당일/1주/1개월/3개월/1년"<br>-문구.01: AI 예측 배너 문구 "{추천일} 출하를 추천해요" | Registry: docs/ds/screen-registry.json<br>Route: /market<br>File: src/routes/market.index.tsx<br>Components: src/components/market-v2/MarketSearchBar.tsx, MarketFilterBar.tsx, ProPriceHeadlineCard.tsx, ProAnalysisSection.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0201 | 시세 조회 메인 | MKT-001_market_Default | Invisible | -데이터소스.01: getMarketQuote(itemId, varietyId, marketId, unit, date) — src/lib/mock/market-analysis.ts<br>-데이터소스.02: getPriceVolumeSeries(...) — 차트/예측 시계열<br>-데이터소스.03: useMarketFilter(zustand, persist key "agdict:marketFilter:v2") — date는 partialize에서 제외되어 세션마다 오늘 날짜로 초기화<br>-초기값.01: categoryId "06"(과실류), itemId "0601"(사과), varietyId "0601:ALL", marketId "all", unit "10kg 기준"<br>-분기.01: showForecast = isTodayQuery && (period가 1주 또는 1개월) && isPredictable(getItemById(itemId).prediction.supported) && series.points.length>0<br>-이동.01: 작물 선택 카드 클릭 → /crop-select?from=market&return=/market(공통 문서 SEL-001 대상)<br>-이동.02: 검색바 클릭 → /search(공통 문서 SRC-001 대상)<br>-미구현.01: MarketSheet 내 "가장 가까운 도매시장 찾기" 버튼은 toast("위치 권한을 확인 중이에요 (준비 중)")만 호출하고 실제 위치 조회 로직 없음 | Registry: docs/ds/screen-registry.json<br>Route: /market<br>File: src/routes/market.index.tsx<br>Store: src/store/market.ts<br>Baseline: 2026-08-04 코드 기준 |
| DS-0201 | 시세 조회 메인 | MKT-001_market_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: /market<br>File: src/routes/market.index.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0201 | 시세 조회 메인 | MKT-001_market_Default | Design | -배경색.01: 헤드라인 카드 배경 #FFFFFF<br>-테두리.01: 헤드라인 카드 테두리 1px solid #E9ECEF<br>-모서리.01: 헤드라인 카드 모서리 반경 14px<br>-내부여백.01: 헤드라인 카드 내부 여백 상하좌우 16px<br>-글자색.01: 본문 텍스트 #212529<br>-상태색.01: 상승 #E03131, 하락 #1971C2, 보합 #6C757D | Registry: docs/ds/screen-registry.json<br>Route: /market<br>File: src/routes/market.index.tsx<br>기술 참조: AppShell(data-screen-id="MKT-001_시세조회" 속성으로 DOM에 노출)<br>Baseline: 2026-08-04 코드 기준 |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## MKT-002_market-id_Default — 시세 상세

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0202 | 시세 상세 | MKT-002_market-id_Default | Visible | -구성.01: 상단 가격 요약(현재가/등락 배지/전일대비) + 기간칩(PeriodChips) + 가격·거래량 차트(PriceVolumeChart) + 4열 통계(현재가/전일대비/등락률/거래량) + 등급별 가격(상/중/하) + 시세 테이블(최근 30건) + 하단 고정 바(총 거래량/kg당 평균)<br>-버튼.01: 즐겨찾기 토글(StarToggle), 공유 버튼(aria-label="공유", 클릭 시 링크 복사)<br>-문구.01: 헤더 타이틀 "시세 상세"<br>-문구.02: 하단 링크 "전체 시세조회 →"(/market 이동)<br>-테이블.01: 컬럼 "날짜/가격/등락률/거래량/등급"(등급은 idx%3 기반 상/중/하 결정론적 배정) | Registry: docs/ds/screen-registry.json<br>Route: /market/$crop<br>File: src/routes/market.$crop.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0202 | 시세 상세 | MKT-002_market-id_Default | Invisible | -데이터소스.01: getCrop(cropId), seriesFor(cropId, period) — src/lib/mock/crops.ts<br>-데이터소스.02: useUi(period), useFavoritePriceStore(즐겨찾기 토글)<br>-계산식.01: changePct = (currentPrice-prevPrice)/prevPrice*100<br>-계산식.02: avg = round(sum(price)/count)<br>-조건.01: crop이 없으면 Empty 상태로 분기(아래 MKT-002_market-id_Empty)<br>-성공.01: 즐겨찾기 추가/제거 시 toast("즐겨찾기에 추가되었습니다 ★" / "즐겨찾기에서 제거되었습니다")<br>-성공.02: 링크 복사 시 toast("링크를 복사했어요")<br>-미구현.01: MarketDetailTabs·MarketChartView·MarketAuctionView·MarketCompareView·MarketOriginView·MarketGradeSpecView(src/components/market/*) 5종 탭 컴포넌트는 이 라우트를 포함해 어디에서도 import되지 않는 미사용 코드(등급 요약과 30건 테이블만 실제 렌더링됨) | Registry: docs/ds/screen-registry.json<br>Route: /market/$crop<br>File: src/routes/market.$crop.tsx<br>Store: src/store/ui.ts, src/features/favorites/favoriteStore.ts<br>⚠️ 확인 필요: 사용자 지정 MKT-007~011 스크린 ID(탭 컴포넌트)는 코드상 어떤 화면에도 배선되지 않은 상태로, 향후 연결 계획이 있는지 확인 필요<br>Baseline: 2026-08-04 코드 기준 |
| DS-0202 | 시세 상세 | MKT-002_market-id_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: /market/$crop<br>File: src/routes/market.$crop.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0202 | 시세 상세 | MKT-002_market-id_Default | Design | -배경색.01: 페이지 배경 #FFFFFF<br>-글자색.01: 본문 텍스트 #212529<br>-글자색.02: 보조 텍스트 #6C757D<br>-상태색.01: 등락 텍스트 상승 #E03131, 하락 #1971C2, 보합 #6C757D | Registry: docs/ds/screen-registry.json<br>Route: /market/$crop<br>File: src/routes/market.$crop.tsx<br>기술 참조: AppShell(screenId="MKT-002_시세상세"), DetailHeader, PriceBadge, PriceVolumeChart 컴포넌트로 구현됨<br>Baseline: 2026-08-04 코드 기준 |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## MKT-002_market-id_Empty — 시세 상세(품목 없음)

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0203 | 시세 상세(품목 없음) | MKT-002_market-id_Empty | Visible | -빈상태.01: 본문 문구 "품목을 찾을 수 없어요."만 표시(중앙 정렬, text-muted-foreground)<br>-구성.01: DetailHeader(title="시세 상세", 뒤로가기)만 노출 | Registry: docs/ds/screen-registry.json<br>Route: /market/$crop<br>File: src/routes/market.$crop.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0203 | 시세 상세(품목 없음) | MKT-002_market-id_Empty | Invisible | -조건.01: getCrop(cropId)가 undefined일 때 진입<br>-분기.01: AppShell screenState="Empty" 설정<br>-액션.01: 라우트 notFoundComponent도 동일 문구의 별도 안내를 제공(TanStack Router notFound 경로) | Registry: docs/ds/screen-registry.json<br>Route: /market/$crop<br>File: src/routes/market.$crop.tsx<br>⚠️ 확인 필요: 두 개의 "찾을 수 없음" 표현(컴포넌트 내부 분기 vs notFoundComponent)이 중복 구현되어 있어 실제로 어느 조건에서 어느 쪽이 렌더링되는지 라우팅 정책 확인 필요<br>Baseline: 2026-08-04 코드 기준 |
| DS-0203 | 시세 상세(품목 없음) | MKT-002_market-id_Empty | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: /market/$crop<br>File: src/routes/market.$crop.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0203 | 시세 상세(품목 없음) | MKT-002_market-id_Empty | Design | -배경색.01: 페이지 배경 #FFFFFF<br>-글자색.01: 빈 상태 안내 문구 #6C757D<br>-정렬.01: 안내 문구 가로 중앙 정렬 | Registry: docs/ds/screen-registry.json<br>Route: /market/$crop<br>File: src/routes/market.$crop.tsx<br>기술 참조: AppShell(screenId="MKT-002_시세상세", screenState="Empty")<br>Baseline: 2026-08-04 코드 기준 |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## MKT-003_market-item_Default — 품목 목록

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0204 | 품목 목록 | MKT-003_market-item_Default | Visible | -구성.01: 선택 품목 드롭다운 버튼(Drawer 트리거, "부류 · 품목명 · 전체 품종" 표시) + 도매시장별 시세 리스트<br>-모달.01: Drawer로 열리는 "품목 선택" 바텀시트, 카테고리(ITEM_CATEGORIES)별 그룹 리스트, 선택 항목 체크 표시<br>-목록항목.01: 시장별 행에 시장명/지역/가격(원)/등락률(▲/▼ + %) 표시<br>-문구.01: 소제목 "{품목명} 도매시장별 시세" | Registry: docs/ds/screen-registry.json<br>Route: /market/item<br>File: src/routes/market.item.index.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0204 | 품목 목록 | MKT-003_market-item_Default | Invisible | -데이터소스.01: ITEMS, ITEM_CATEGORIES(src/lib/mock/items.ts), MARKETS(src/lib/mock/markets.ts)<br>-검색조건.01: URL search param "item"(validateSearch), 없으면 DEFAULT_ITEM="apple"<br>-계산식.01: 시장별 가격 = base * factor, factor = 1 + (((itemIdx+i)%7)-3)*0.015 (결정론적 mock 오프셋)<br>-이동.01: 품목 선택 시 navigate({to:"/market/item", search:{item:id}, replace:true})<br>-이동.02: 시장 행 클릭 → /market/wholesale/$market | Registry: docs/ds/screen-registry.json<br>Route: /market/item<br>File: src/routes/market.item.index.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0204 | 품목 목록 | MKT-003_market-item_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: /market/item<br>File: src/routes/market.item.index.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0204 | 품목 목록 | MKT-003_market-item_Default | Design | -배경색.01: 시트 배경 #FFFFFF<br>-모서리.01: 시트 상단 모서리 반경 18px<br>-테두리.01: 목록 항목 하단 구분선 1px solid #E9ECEF<br>-글자색.01: 본문 텍스트 #212529 | Registry: docs/ds/screen-registry.json<br>Route: /market/item<br>File: src/routes/market.item.index.tsx<br>기술 참조: AppShell(screenId="MKT-003_품목별시세"), Drawer/DrawerContent/DrawerTrigger, CropIcon<br>Baseline: 2026-08-04 코드 기준 |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## MKT-004_market-item-id_Default — 품목 상세

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0205 | 품목 상세 | MKT-004_market-item-id_Default | Visible | -구성.01: 선택 품목 칩(이름+카테고리 라벨) + 3열 요약(오늘 총 거래량/kg당 평균가/거래 품종 수) + 품종별 리스트(VarietyRow, 거래량순 정렬)<br>-문구.01: 소제목 "품종 {n} · 거래량순" | Registry: docs/ds/screen-registry.json<br>Route: /market/item/$item<br>File: src/routes/market.item.$item.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0205 | 품목 상세 | MKT-004_market-item-id_Default | Invisible | -데이터소스.01: getItem(params.item), itemAvgKg, itemTotalVolume(src/lib/mock/items.ts)<br>-API.01: loader에서 getItem 실패 시 notFound() throw<br>-분기.01: notFound 시 notFoundComponent "품목을 찾을 수 없어요." 렌더(loaderData 없을 때 head도 noindex 처리)<br>-정렬.01: [...item.varieties].sort((a,b)=>b.volumeTon-a.volumeTon) | Registry: docs/ds/screen-registry.json<br>Route: /market/item/$item<br>File: src/routes/market.item.$item.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0205 | 품목 상세 | MKT-004_market-item-id_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: /market/item/$item<br>File: src/routes/market.item.$item.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0205 | 품목 상세 | MKT-004_market-item-id_Default | Design | -배경색.01: 페이지 배경 #FFFFFF<br>-테두리.01: 품종 행 하단 구분선 1px solid #E9ECEF<br>-글자색.01: 본문 텍스트 #212529<br>-글자색.02: 보조 텍스트 #6C757D | Registry: docs/ds/screen-registry.json<br>Route: /market/item/$item<br>File: src/routes/market.item.$item.tsx<br>기술 참조: AppShell(screenId="MKT-004_품목시세상세"), DetailHeader, CropIcon<br>클래스 참조: src/components/market-v2/VarietyRow.tsx<br>Baseline: 2026-08-04 코드 기준 |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## MKT-005_market-wholesale_Default — 도매시장 목록

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0206 | 도매시장 목록 | MKT-005_market-wholesale_Default | Visible | -구성.01: 선택 시장 드롭다운(Drawer 트리거, 시장명+지역 표시) + 거래 품목 리스트<br>-모달.01: Drawer "도매시장 선택" 바텀시트, 지역(region)별 그룹, 선택 항목 체크<br>-목록항목.01: 품목 행에 아이콘/이름/가격/등락률 표시<br>-문구.01: 소제목 "{시장명} 거래 품목" | Registry: docs/ds/screen-registry.json<br>Route: /market/wholesale<br>File: src/routes/market.wholesale.index.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0206 | 도매시장 목록 | MKT-005_market-wholesale_Default | Invisible | -데이터소스.01: MARKETS(src/lib/mock/markets.ts), ITEMS(src/lib/mock/items.ts)<br>-검색조건.01: URL search "m", 없으면 DEFAULT_MARKET="seoul-garak"<br>-계산식.01: priceKg = base * (1 + ((offset+i)%7)*0.012)<br>-이동.01: 시장 선택 시 navigate({to:"/market/wholesale", search:{m:id}, replace:true})<br>-이동.02: 품목 행 클릭 → /market/wholesale/$market(현재 선택된 시장 파라미터로 이동, 클릭한 품목은 파라미터에 반영되지 않음) | Registry: docs/ds/screen-registry.json<br>Route: /market/wholesale<br>File: src/routes/market.wholesale.index.tsx<br>⚠️ 확인 필요: 품목 행 Link params가 market.id만 전달하고 선택 품목 정보는 다음 화면에 전달되지 않아, 상세 화면에서 품목이 자동 선택되지 않는 것이 의도된 동작인지 확인 필요<br>Baseline: 2026-08-04 코드 기준 |
| DS-0206 | 도매시장 목록 | MKT-005_market-wholesale_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: /market/wholesale<br>File: src/routes/market.wholesale.index.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0206 | 도매시장 목록 | MKT-005_market-wholesale_Default | Design | -배경색.01: 시트 배경 #FFFFFF<br>-모서리.01: 시트 상단 모서리 반경 18px<br>-테두리.01: 품목 행 하단 구분선 1px solid #E9ECEF<br>-상태색.01: 등락률 상승 #E03131, 하락 #1971C2 | Registry: docs/ds/screen-registry.json<br>Route: /market/wholesale<br>File: src/routes/market.wholesale.index.tsx<br>기술 참조: AppShell(screenId="MKT-005_도매시장목록"), Drawer, CropIcon<br>Baseline: 2026-08-04 코드 기준 |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## MKT-006_market-wholesale-id_Default — 도매시장 상세

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0207 | 도매시장 상세 | MKT-006_market-wholesale-id_Default | Visible | -구성.01: 선택 시장 칩 + 작물 칩 목록(상위 6개 품목, CROP_POOL) + 구분/평균가/전일대비/거래량 4열 테이블(전체 평균 + 품종별 행, 아코디언 펼침 시 법인별 서브행) + 하단 고정 바(총 거래량/kg당 평균)<br>-목록항목.01: 아코디언 펼침 시 법인별 가격/등락률/거래량 서브행 표시 | Registry: docs/ds/screen-registry.json<br>Route: /market/wholesale/$market<br>File: src/routes/market.wholesale.$market.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0207 | 도매시장 상세 | MKT-006_market-wholesale-id_Default | Invisible | -데이터소스.01: MARKETS.find(params.market), ITEMS.slice(0,6)(CROP_POOL)<br>-API.01: loader에서 시장 미존재 시 notFound() throw<br>-계산식.01: buildRows(cropId, market) — 법인별 가격 = v.pricePerKg * (1 + (idx-1)*0.03)(mock 결정론적 오프셋)<br>-계산식.02: total = sum(varieties.volumeTon), avg = 가중평균(pricePerKg * volumeTon)<br>-분기.01:  | changePct<br>Baseline: 2026-08-04 코드 기준 | <0.05이면 등락 상태를 보합(flat)으로 처리<br>자동동작.01: 작물 칩 변경 시 아코디언 펼침 상태(expanded)가 자동으로 초기화됨 | Registry: docs/ds/screen-registry.json<br>Route: /market/wholesale/$market<br>File: src/routes/market.wholesale.$market.tsx |
| DS-0207 | 도매시장 상세 | MKT-006_market-wholesale-id_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: /market/wholesale/$market<br>File: src/routes/market.wholesale.$market.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0207 | 도매시장 상세 | MKT-006_market-wholesale-id_Default | Design | -상태색.01: 상승 #E03131, 하락 #1971C2, 보합 #6C757D<br>-배경색.01: 페이지 배경 #FFFFFF<br>-테두리.01: 테이블 행 하단 구분선 1px solid #E9ECEF | Registry: docs/ds/screen-registry.json<br>Route: /market/wholesale/$market<br>File: src/routes/market.wholesale.$market.tsx<br>기술 참조: AppShell(screenId="MKT-006_도매시장상세"), DetailHeader, CropIcon<br>Baseline: 2026-08-04 코드 기준 |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## MKT-007_market-crop-tab-chart_Default — 차트 탭

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0208 | 차트 탭 | MKT-007_market-crop-tab-chart_Default | Visible | -구성.01: 가격 추이 카드(PriceVolumeChart) + 기간 필터 5종(당일/1주/1개월/3개월/1년) + AI 예측 배너("{일자} 출하가 유리해요") + "일별·시장별 시세 보기" 버튼 + 4열 통계(최고/최저 평균가, 거래량 합, 표본 수) + DataSourceNotice | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market/$crop<br>File: src/components/market/MarketChartView.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0208 | 차트 탭 | MKT-007_market-crop-tab-chart_Default | Invisible | -데이터소스.01: getCrop(cropId)(src/lib/mock/crops.ts), useMarketFilter(date)<br>-계산식.01: buildRows()가 seeded(seed) 결정론적 PRNG로 기간별(당일 24시간/1주/1개월/3개월 13주/1년 12개월) 가격·거래량·예측치 생성<br>-분기.01: showForecast = crop.isPredictable && isToday && (1주 또는 1개월)<br>-이동.01: 예측 배너 클릭 → /prediction?cropId={cropId}<br>-액션.01: "일별·시장별 시세 보기" 클릭 → onJumpTab("auction")(부모 상태 전환 콜백)<br>-미구현.01: 본 컴포넌트(MarketChartView)를 렌더링하는 부모(MarketDetailTabs)가 어느 라우트에서도 import되지 않아 실제 화면에는 연결되어 있지 않음<br>-미구현.02: 표본 수 값이 항상 하드코딩 "732건"으로 고정되어 실제 데이터 건수를 반영하지 않음 | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market/$crop<br>File: src/components/market/MarketChartView.tsx<br>Store: src/store/market.ts<br>⚠️ 확인 필요: MKT-007~011 탭 세트를 /market/$crop 화면에 연결할 계획인지, 혹은 /price/$variety의 ChartTab 등으로 대체된 것인지 기획 확인 필요<br>Baseline: 2026-08-04 코드 기준 |
| DS-0208 | 차트 탭 | MKT-007_market-crop-tab-chart_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market/$crop<br>File: src/components/market/MarketChartView.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0208 | 차트 탭 | MKT-007_market-crop-tab-chart_Default | Design | -상태색.01: 가격선 #E03B3B(--chart-price), 거래량 막대 #F3C6C6(--chart-volume)<br>-배경색.01: 카드 배경 #FFFFFF<br>-테두리.01: 카드 테두리 1px solid #E9ECEF<br>-글자색.01: 안내 문구(DataSourceNotice) #6C757D | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market/$crop<br>File: src/components/market/MarketChartView.tsx<br>기술 참조: PriceVolumeChart(src/components/price-volume-chart.tsx), DataSourceNotice 컴포넌트로 구현됨<br>Baseline: 2026-08-04 코드 기준 |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## MKT-008_market-crop-tab-auction_Default — 경매내역 탭

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0209 | 경매내역 탭 | MKT-008_market-crop-tab-auction_Default | Visible | -필터.01: 필터 칩 "오늘/도매시장/법인/등급/규격/더보기"(클릭 동작 없음)<br>-구성.01: 요약 4셀(최근 낙찰가/최고가/최저가/누적 거래량) + 실시간 경매내역 리스트 + 시간대별 체결 흐름 바 차트 + DataSourceNotice | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market/$crop<br>File: src/components/market/MarketAuctionView.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0209 | 경매내역 탭 | MKT-008_market-crop-tab-auction_Default | Invisible | -데이터소스.01: 컴포넌트 내부 상수 ROWS(5건 고정 mock), 외부 store/API 연동 없음<br>-미구현.01: 이 컴포넌트는 어떤 라우트에서도 import되지 않아 실제로 화면에 표시되지 않음(MarketDetailTabs 참조)<br>-미구현.02: 모든 수치(ROWS, 요약값, 시간대별 체결 흐름 막대 높이)가 상수 하드코딩이며 필터 칩 6종은 클릭 핸들러가 없어 동작하지 않음 | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market/$crop<br>File: src/components/market/MarketAuctionView.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0209 | 경매내역 탭 | MKT-008_market-crop-tab-auction_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market/$crop<br>File: src/components/market/MarketAuctionView.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0209 | 경매내역 탭 | MKT-008_market-crop-tab-auction_Default | Design | -상태색.01: 상승 #E03131, 하락 #1971C2, 보합 #6C757D<br>-배경색.01: 카드 배경 #FFFFFF<br>-테두리.01: 카드 테두리 1px solid #E9ECEF<br>-글자색.01: 안내 문구(DataSourceNotice) #6C757D | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market/$crop<br>File: src/components/market/MarketAuctionView.tsx<br>기술 참조: PriceBadge, DataSourceNotice 컴포넌트로 구현됨(MarketDetailTabs 미배선으로 실화면 미노출)<br>Baseline: 2026-08-04 코드 기준 |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## MKT-009_market-crop-tab-compare_Default — 시장비교 탭

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0210 | 시장비교 탭 | MKT-009_market-crop-tab-compare_Default | Visible | -필터.01: 필터 칩 "오늘/10개 시장/가격순/카드·표"(클릭 동작 없음)<br>-구성.01: 요약 3셀(최고 시장/평균 가격/가격 편차) + 시장 순위 리스트(현재 기준 하이라이트) + 1주 가격 흐름 막대 그래프 + 범례 + DataSourceNotice | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market/$crop<br>File: src/components/market/MarketCompareView.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0210 | 시장비교 탭 | MKT-009_market-crop-tab-compare_Default | Invisible | -계산식.01: avg = round(sum(price)/count), spread = max(price)-min(price)<br>-미구현.01: 본 컴포넌트는 어떤 라우트에서도 import되지 않아 실제 화면에 노출되지 않음(MarketDetailTabs 참조)<br>-미구현.02: MARKETS 배열(6개 시장) 및 흐름 그래프 수치가 상수 하드코딩 | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market/$crop<br>File: src/components/market/MarketCompareView.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0210 | 시장비교 탭 | MKT-009_market-crop-tab-compare_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market/$crop<br>File: src/components/market/MarketCompareView.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0210 | 시장비교 탭 | MKT-009_market-crop-tab-compare_Default | Design | -상태색.01: 상승 #E03131, 하락 #1971C2, 보합 #6C757D<br>-배경색.01: 카드 배경 #FFFFFF<br>-테두리.01: 카드 테두리 1px solid #E9ECEF<br>-글자색.01: 안내 문구(DataSourceNotice) #6C757D | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market/$crop<br>File: src/components/market/MarketCompareView.tsx<br>기술 참조: PriceBadge, DataSourceNotice 컴포넌트로 구현됨(MarketDetailTabs 미배선으로 실화면 미노출)<br>Baseline: 2026-08-04 코드 기준 |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## MKT-010_market-crop-tab-origin_Default — 산지 탭

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0211 | 산지 탭 | MKT-010_market-crop-tab-origin_Default | Visible | -필터.01: 필터 칩 "이번 주/주산지/출하지/거래량순"(클릭 동작 없음)<br>-구성.01: 주산지 시세 순위 리스트(5개 산지, 점유율/거래량/가격/등락률) + 주산지 비중 스택 바 + 범례 + 안내 문구("같은 품목과 유사 규격 기준으로 비교됩니다.<br>-문구.01: 일부 산지는 표본 수가 적어 변동률이 크게 보일 수 있습니다.") + DataSourceNotice | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market/$crop<br>File: src/components/market/MarketOriginView.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0211 | 산지 탭 | MKT-010_market-crop-tab-origin_Default | Invisible | -미구현.01: 본 컴포넌트는 어떤 라우트에서도 import되지 않아 실제 화면에 노출되지 않음(MarketDetailTabs 참조)<br>-미구현.02: ORIGINS 배열이 상수 하드코딩 | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market/$crop<br>File: src/components/market/MarketOriginView.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0211 | 산지 탭 | MKT-010_market-crop-tab-origin_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market/$crop<br>File: src/components/market/MarketOriginView.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0211 | 산지 탭 | MKT-010_market-crop-tab-origin_Default | Design | -상태색.01: 상승 #E03131, 하락 #1971C2, 보합 #6C757D<br>-배경색.01: 카드 배경 #FFFFFF<br>-테두리.01: 카드 테두리 1px solid #E9ECEF<br>-글자색.01: 안내 문구(DataSourceNotice) #6C757D | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market/$crop<br>File: src/components/market/MarketOriginView.tsx<br>기술 참조: PriceBadge, DataSourceNotice 컴포넌트로 구현됨(MarketDetailTabs 미배선으로 실화면 미노출)<br>Baseline: 2026-08-04 코드 기준 |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## MKT-011_market-crop-tab-grade_Default — 등급·규격 탭

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0212 | 등급·규격 탭 | MKT-011_market-crop-tab-grade_Default | Visible | -구성.01: "등급 비교/품종 비교" 세그먼트 토글<br>-표시.01: 등급 비교 화면 — 등급별 평균 시세 3열(특/상/중) + 규격별 비교 3열(10kg망/8kg/원단위)<br>-표시.02: 품종 비교 화면 — 품종별 비교 2열 그리드(배추(일반)/얼갈이배추/봄배추/저장배추)<br>-문구.01: 안내 문구 "같은 등급과 유사 규격 기준으로 비교됩니다.<br>-문구.02: 일부 품종은 표본 수가 적어 변동률이 크게 보일 수 있습니다." | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market/$crop<br>File: src/components/market/MarketGradeSpecView.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0212 | 등급·규격 탭 | MKT-011_market-crop-tab-grade_Default | Invisible | -미구현.01: 본 컴포넌트는 어떤 라우트에서도 import되지 않아 실제 화면에 노출되지 않음(MarketDetailTabs 참조)<br>-미구현.02: GRADES/SPECS/VARIETIES 배열이 상수 하드코딩 | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market/$crop<br>File: src/components/market/MarketGradeSpecView.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0212 | 등급·규격 탭 | MKT-011_market-crop-tab-grade_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market/$crop<br>File: src/components/market/MarketGradeSpecView.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0212 | 등급·규격 탭 | MKT-011_market-crop-tab-grade_Default | Design | -상태색.01: 상승 #E03131, 하락 #1971C2, 보합 #6C757D<br>-배경색.01: 카드 배경 #FFFFFF<br>-테두리.01: 카드 테두리 1px solid #E9ECEF<br>-글자색.01: 안내 문구(DataSourceNotice) #6C757D | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market/$crop<br>File: src/components/market/MarketGradeSpecView.tsx<br>기술 참조: PriceBadge, DataSourceNotice 컴포넌트로 구현됨(MarketDetailTabs 미배선으로 실화면 미노출)<br>Baseline: 2026-08-04 코드 기준 |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## MKT-012_market-sheet-date_Default — 조회 날짜 선택 시트

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0213 | 조회 날짜 선택 시트 | MKT-012_market-sheet-date_Default | Visible | -구성.01: 바텀시트, 헤더 "날짜 선택" + 닫기(X) 버튼, "오늘" 바로가기 링크, Calendar(캘린더), 하단 "완료" 버튼<br>-표시.01: 캡션 형식 "{연}년 {월}월", 요일 한글 헤더(일/월/화/수/목/금/토, 일요일 빨간색) | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market<br>File: src/components/date-picker-sheet.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0213 | 조회 날짜 선택 시트 | MKT-012_market-sheet-date_Default | Invisible | -진입조건.01: /market의 MarketFilterBar "조회 날짜" 카드 클릭 시 open<br>-액션.01: "완료" 클릭 시 onConfirm(iso, humanLabel(iso)) 호출 → useMarketFilter.setDate(iso, label) 반영 후 시트 닫힘<br>-액션.02: "오늘" 클릭 시 오늘 날짜로 캘린더 이동 및 draft 갱신(자동 완료 아님, 완료 버튼 별도 클릭 필요)<br>-자동동작.01: defaultTradingDayFilter — 일요일(getDay()===0)만 휴장으로 간주하는 mock 규칙<br>-미구현.01: 오늘 이후 미래 날짜 및 hasDataFor(iso)=false인 날짜(휴장일: 일요일)는 선택 비활성화 | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market<br>File: src/components/date-picker-sheet.tsx<br>Components: src/components/market-v2/MarketFilterBar.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0213 | 조회 날짜 선택 시트 | MKT-012_market-sheet-date_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market<br>File: src/components/date-picker-sheet.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0213 | 조회 날짜 선택 시트 | MKT-012_market-sheet-date_Default | Design | -배경색.01: 시트 배경 #FFFFFF<br>-모서리.01: 시트 상단 모서리 반경 18px<br>-글자색.01: 일요일 요일 헤더 #E03131<br>-글자색.02: 평일 텍스트 #212529<br>-테두리.01: 헤더 하단 구분선 1px solid #E9ECEF | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market<br>File: src/components/date-picker-sheet.tsx<br>기술 참조: Sheet/SheetContent(side="bottom"), Calendar(react-day-picker 래퍼)<br>Baseline: 2026-08-04 코드 기준 |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## MKT-013_market-sheet-market_Default — 도매시장 선택 시트

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0214 | 도매시장 선택 시트 | MKT-013_market-sheet-market_Default | Visible | -구성.01: 바텀시트 헤더 "도매시장 선택" + "가장 가까운 도매시장 찾기" 버튼 + 옵션 리스트("전체" + MARKETS 전체)<br>-상태표시.01: 선택된 항목 우측 체크(Check) 아이콘 강조 | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market<br>File: src/components/market-v2/MarketSheet.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0214 | 도매시장 선택 시트 | MKT-013_market-sheet-market_Default | Invisible | -데이터소스.01: MARKETS(src/lib/mock/markets.ts)<br>-진입조건.01: MarketFilterBar "도매시장" 카드 클릭 시 open<br>-액션.01: 옵션 클릭 시 useMarketFilter.setMarket(id,label) 호출 — 시장 변경 시 corpId/corpLabel이 "all"/"전체"로 초기화됨<br>-미구현.01: "가장 가까운 도매시장 찾기" 버튼은 toast("위치 권한을 확인 중이에요 (준비 중)")만 호출하고 위치 기반 로직 없음 | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market<br>File: src/components/market-v2/MarketSheet.tsx<br>Store: src/store/market.ts<br>Baseline: 2026-08-04 코드 기준 |
| DS-0214 | 도매시장 선택 시트 | MKT-013_market-sheet-market_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market<br>File: src/components/market-v2/MarketSheet.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0214 | 도매시장 선택 시트 | MKT-013_market-sheet-market_Default | Design | -배경색.01: 시트 배경 #FFFFFF<br>-모서리.01: 시트 상단 모서리 반경 18px<br>-테두리.01: 옵션 항목 하단 구분선 1px solid #E9ECEF | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market<br>File: src/components/market-v2/MarketSheet.tsx<br>기술 참조: Sheet/SheetContent(side="bottom")<br>Baseline: 2026-08-04 코드 기준 |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## MKT-014_market-sheet-corporation_Default — 도매법인 선택 시트

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0215 | 도매법인 선택 시트 | MKT-014_market-sheet-corporation_Default | Visible | -구성.01: 바텀시트 헤더 "법인 선택" + "{도매시장명} 소속" 안내 문구 + 법인 리스트<br>-상태표시.01: 선택된 법인 항목은 배경 강조(bg-[#F0F9F0])와 Check 아이콘 표시 | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market<br>File: src/components/market-v2/CorporationSheet.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0215 | 도매법인 선택 시트 | MKT-014_market-sheet-corporation_Default | Invisible | -데이터소스.01: getCorporations(marketId) — src/lib/mock/corporations.ts(BY_MARKET 매핑, 미등록 시장은 DEFAULT [{id:"all",label:"전체"}])<br>-진입조건.01: MarketFilterBar "도매법인" 카드 클릭 시 open<br>-액션.01: 옵션 클릭 시 useMarketFilter.setCorp(id,label) 호출 후 시트 닫힘 | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market<br>File: src/components/market-v2/CorporationSheet.tsx<br>Store: src/store/market.ts<br>Baseline: 2026-08-04 코드 기준 |
| DS-0215 | 도매법인 선택 시트 | MKT-014_market-sheet-corporation_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market<br>File: src/components/market-v2/CorporationSheet.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0215 | 도매법인 선택 시트 | MKT-014_market-sheet-corporation_Default | Design | -배경색.01: 시트 배경 #FFFFFF<br>-배경색.02: 선택 항목 강조 배경 #F0F9F0<br>-모서리.01: 시트 상단 모서리 반경 18px | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market<br>File: src/components/market-v2/CorporationSheet.tsx<br>기술 참조: Sheet/SheetContent/SheetHeader/SheetTitle<br>Baseline: 2026-08-04 코드 기준 |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## AUC-001_market-auction-id_Default — 경매 상세

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0216 | 경매 상세 | AUC-001_market-auction-id_Default | Visible | -구성.01: DetailHeader(title="경매 상세 결과") + 상세 정보 리스트(경매시간/분류/품목/품종/규격/경락가(강조)/kg당 환산/수량/도매시장/도매법인/출하지) | Registry: docs/ds/screen-registry.json<br>Route: /market/auction/$id<br>File: src/routes/market.auction.$id.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0216 | 경매 상세 | AUC-001_market-auction-id_Default | Invisible | -데이터소스.01: getAuctionById(id, {categoryLabel,itemLabel,varietyLabel,marketLabel})(src/lib/mock/auctions.ts) — useMarketFilter 조건값과 결합해 결정론적으로 상세 레코드 생성<br>-분기.01: record가 없으면 Empty 상태(아래 AUC-001_market-auction-id_Empty)로 전환(AppShell screenState) | Registry: docs/ds/screen-registry.json<br>Route: /market/auction/$id<br>File: src/routes/market.auction.$id.tsx<br>Store: src/store/market.ts<br>Baseline: 2026-08-04 코드 기준 |
| DS-0216 | 경매 상세 | AUC-001_market-auction-id_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: /market/auction/$id<br>File: src/routes/market.auction.$id.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0216 | 경매 상세 | AUC-001_market-auction-id_Default | Design | -배경색.01: 페이지 배경 #FFFFFF<br>-글자색.01: 경락가 강조 텍스트 #3A8A3A<br>-글자색.02: 본문 텍스트 #212529 | Registry: docs/ds/screen-registry.json<br>Route: /market/auction/$id<br>File: src/routes/market.auction.$id.tsx<br>기술 참조: AppShell(내부 문자열 screenId="MKT-007_경매상세" — 본 DS 문서의 Screen ID 체계와 별개), DetailHeader<br>Baseline: 2026-08-04 코드 기준 |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## AUC-001_market-auction-id_Empty — 경매 상세(결과 없음)

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0217 | 경매 상세(결과 없음) | AUC-001_market-auction-id_Empty | Visible | -빈상태.01: 문구 "경매 정보를 찾을 수 없어요." + 링크 "시세 화면으로 돌아가기"(/market 이동) | Registry: docs/ds/screen-registry.json<br>Route: /market/auction/$id<br>File: src/routes/market.auction.$id.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0217 | 경매 상세(결과 없음) | AUC-001_market-auction-id_Empty | Invisible | -조건.01: getAuctionById(...)가 undefined를 반환할 때 진입<br>-분기.01: AppShell screenState="Empty" | Registry: docs/ds/screen-registry.json<br>Route: /market/auction/$id<br>File: src/routes/market.auction.$id.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0217 | 경매 상세(결과 없음) | AUC-001_market-auction-id_Empty | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: /market/auction/$id<br>File: src/routes/market.auction.$id.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0217 | 경매 상세(결과 없음) | AUC-001_market-auction-id_Empty | Design | -배경색.01: 페이지 배경 #FFFFFF<br>-글자색.01: 빈 상태 안내 문구 #6C757D<br>-글자색.02: 링크 텍스트 #3A8A3A | Registry: docs/ds/screen-registry.json<br>Route: /market/auction/$id<br>File: src/routes/market.auction.$id.tsx<br>기술 참조: AppShell(screenState="Empty"), DetailHeader<br>Baseline: 2026-08-04 코드 기준 |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## CMP-001_market-compare_Default — 시장 비교

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0218 | 시장 비교 | CMP-001_market-compare_Default | Visible | -구성.01: 작물/조회 날짜 Full 선택 카드(FullSelectCard) + 안내 문구 "kg당 평균가 · 경매일 기준 · 전체 시장" + (미선택 시) 안내 카드 "비교할 작물을 선택하세요" + (선택 시) 최고/최저 하이라이트 카드 2종 + 시장별 순위 리스트(막대그래프 포함) + "상세 시세 보기" 버튼<br>-빈상태.01: 문구 "비교할 작물을 선택하세요" / "위 카드를 눌러 부류·품목·품종을 선택하면 시장별 가격을 비교할 수 있어요."<br>-목록항목.01: 순위 1위 항목에 "최고가" 뱃지와 빨간 강조 테두리 적용 | Registry: docs/ds/screen-registry.json<br>Route: /market-compare<br>File: src/routes/market-compare.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0218 | 시장 비교 | CMP-001_market-compare_Default | Invisible | -데이터소스.01: useCropSelection(committed)(src/store/cropSelection.ts), getCategoryById/getItemById(src/lib/catalog-service.ts), getVarietyMarketAverages({varietyId,date})(src/lib/mock/variety-market-averages.ts)<br>-조건.01: data는 varietyId가 있을 때만 계산, 없으면 null(빈 상태 렌더)<br>-정렬.01: ranked = regions.flatMap(markets).sort(b.avgKg-a.avgKg)(높은 가격순)<br>-이동.01: 작물 선택 카드 → /crop-select?from=market-compare&return=/market-compare(공통 문서 SEL-001 대상)<br>-이동.02: "상세 시세 보기" → /statistics/$variety<br>-초기값.01: date 기본값 "2025-07-05"(useState, DatePickerSheet로 변경) | Registry: docs/ds/screen-registry.json<br>Route: /market-compare<br>File: src/routes/market-compare.tsx<br>Store: src/store/cropSelection.ts<br>Baseline: 2026-08-04 코드 기준 |
| DS-0218 | 시장 비교 | CMP-001_market-compare_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: /market-compare<br>File: src/routes/market-compare.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0218 | 시장 비교 | CMP-001_market-compare_Default | Design | -배경색.01: 페이지 배경 #FFFFFF<br>-배경색.02: 카드 배경 #FFFFFF<br>-테두리.01: 카드 테두리 1px solid #E9ECEF<br>-테두리색.01: 최고가 하이라이트 카드 강조 테두리 #E03131 | Registry: docs/ds/screen-registry.json<br>Route: /market-compare<br>File: src/routes/market-compare.tsx<br>기술 참조: AppShell(screenId="MKT-008_시장비교"), FullSelectCard, DatePickerSheet<br>Baseline: 2026-08-04 코드 기준 |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## CMP-002_compare_Default — 가격 비교

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0219 | 가격 비교 | CMP-002_compare_Default | Visible | -구성.01: 작물 선택 드롭다운(select) + "가장 저렴/가장 비쌈" 하이라이트 2셀 + 시장별 순위 리스트(막대그래프) + 하단 링크 "{작물명} 상세 시세 보기 →"<br>-문구.01: 소제목 "시장별 순위" | Registry: docs/ds/screen-registry.json<br>Route: /compare<br>File: src/routes/compare.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0219 | 가격 비교 | CMP-002_compare_Default | Invisible | -데이터소스.01: CROPS(src/lib/mock/crops.ts), MARKETS(src/lib/mock/markets.ts)<br>-계산식.01: factor = 0.9 + ((시장id 첫글자 charCode %20)/100)(mock 결정론적 오프셋), price = crop.currentPrice*factor<br>-정렬.01: rows.sort((a,b)=>a.price-b.price)(낮은 가격순), best=rows[0], worst=rows[len-1]<br>-초기값.01: 초기 선택 작물 = CROPS[0]<br>-이동.01: 하단 링크 → /market/$crop | Registry: docs/ds/screen-registry.json<br>Route: /compare<br>File: src/routes/compare.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0219 | 가격 비교 | CMP-002_compare_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: /compare<br>File: src/routes/compare.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0219 | 가격 비교 | CMP-002_compare_Default | Design | -배경색.01: 페이지 배경 #FFFFFF<br>-상태색.01: 상승 #E03131, 하락 #1971C2 | Registry: docs/ds/screen-registry.json<br>Route: /compare<br>File: src/routes/compare.tsx<br>기술 참조: AppShell(screenId="MKT-009_시장별가격비교"), PriceBadge<br>Baseline: 2026-08-04 코드 기준 |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## GRD-001_grades_Default — 등급 정보

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0220 | 등급 정보 | GRD-001_grades_Default | Visible | -구성.01: 안내 배너("KAMIS 기준 상·중·하 3등급 시세입니다. 등급 구분이 가능한 품목만 표시됩니다.") + 등급 보유 작물 리스트(작물별 상/중/하 막대그래프 + 가격)<br>-필터.01: withGrades = CROPS.filter(c=>c.grades)로 등급 데이터가 있는 작물만 표시(코드상 별도 필터 UI는 없음, 자동 필터) | Registry: docs/ds/screen-registry.json<br>Route: /grades<br>File: src/routes/grades.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0220 | 등급 정보 | GRD-001_grades_Default | Invisible | -데이터소스.01: CROPS(src/lib/mock/crops.ts)<br>-계산식.01: 막대 폭 = row.v/max(top,mid,low)*100(%) | Registry: docs/ds/screen-registry.json<br>Route: /grades<br>File: src/routes/grades.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0220 | 등급 정보 | GRD-001_grades_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: /grades<br>File: src/routes/grades.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0220 | 등급 정보 | GRD-001_grades_Default | Design | -배경색.01: 페이지 배경 #FFFFFF<br>-배경색.02: 안내 배너 배경 #F0F9F0<br>-글자색.01: 본문 텍스트 #212529 | Registry: docs/ds/screen-registry.json<br>Route: /grades<br>File: src/routes/grades.tsx<br>기술 참조: AppShell(screenId="MKT-010_등급별가격"), DetailHeader, CropIcon<br>Baseline: 2026-08-04 코드 기준 |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## PRC-001_price-id_Default — 품종 상세

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0221 | 품종 상세 | PRC-001_price-id_Default | Visible | -구성.01: 타이틀(이모지+품종명, 품목·부류 배지, "AI 가격 예측 가능" 배지) + 현재가/단위/kg당 환산 + 등락률(전일대비) + 탭 6종(차트/경매내역/시장비교/법인/산지/품종) + 탭별 콘텐츠<br>-버튼.01: 즐겨찾기(Star), 가격 알림 설정(Bell) 버튼<br>-구성.02: 차트 탭 — 기간 필터 5종(오늘/1주/1개월/3개월/1년), 가격추이 차트, 범례, 최고/최저/평균가 3셀, 전일/전주/전년/거래량 4셀 통계, 안내 문구<br>-구성.03: 경매내역 탭 — 요약 3셀과 경매 테이블, 50건 단위 더보기<br>-테이블.01: 시장비교 탭 — 시장별 현재가/전일/거래량/점유율 컬럼<br>-테이블.02: 법인 탭 — 도매법인별 평균가/전일/거래 건수 컬럼<br>-테이블.03: 산지 탭 — 출하지별 평균가/건수/비중 컬럼<br>-테이블.04: 품종 탭 — 품종별 비교 컬럼 | Registry: docs/ds/screen-registry.json<br>Route: /price/$variety<br>File: src/routes/price.$variety.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0221 | 품종 상세 | PRC-001_price-id_Default | Invisible | -데이터소스.01: 시세 요약과 가격·거래량 시계열은 getMarketQuote·getPriceVolumeSeries(src/lib/mock/market-analysis.ts)에서 가져온다<br>-데이터소스.02: 법인·시장·산지·품종 비교 데이터는 getCompanyBreakdown·getMarketCompare·getOriginBreakdown·getVarietyBreakdown(src/lib/mock/variety-detail.ts)에서 가져온다<br>-조건.01: 조회 조건(시장·단위 등)은 useMarketFilter에서, 알림 존재 여부는 useAlerts의 hasAnyFor·getByKey에서, 즐겨찾기 여부는 useFavoritePriceStore에서 읽는다<br>-분기.01: 예측 가능 여부는 품종의 isPredictable이 참이고 predictionStatus가 available인 경우에만 참으로 판정한다<br>-이동.01: 알림 버튼을 누르면 기존 규칙이 있으면 /notifications/settings/$ruleId로, 없으면 /notifications/settings/new(품종·시장 파라미터 포함)로 이동한다<br>-이동.02: AI 예측 배지를 누르면 /prediction으로 품종과 진입 출처 파라미터를 붙여 이동한다<br>-성공.01: 즐겨찾기 토글 시 "즐겨찾기에 추가했어요" 또는 "즐겨찾기에서 삭제했어요" 토스트를 표시한다<br>-미구현.01: 모든 시세·비교 데이터가 mock 모듈의 하드코딩 값이며 실제 서버 API와 연동되어 있지 않다 | Registry: docs/ds/screen-registry.json<br>Route: /price/$variety<br>File: src/routes/price.$variety.tsx<br>Baseline: 2026-08-04 코드 기준<br>Store: src/store/market.ts, src/store/alerts.ts<br>Components: src/components/market-v2/AuctionHistoryTable.tsx, src/components/price-volume-chart.tsx |
| DS-0221 | 품종 상세 | PRC-001_price-id_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: /price/$variety<br>File: src/routes/price.$variety.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0221 | 품종 상세 | PRC-001_price-id_Default | Design | -너비.01: 화면 콘텐츠 최대 너비 430px, 좌우 중앙 정렬<br>-배경색.01: 페이지 배경 #FFFFFF, 카드 배경 #FFFFFF<br>-테두리색.01: 카드·구분선 테두리 #E9ECEF, 1px solid<br>-모서리.01: 카드 모서리 반경 12px<br>-글자색.01: 본문 기본 글자색 #212529, 보조 설명 #6C757D, 약한 보조 #868E96<br>-상태색.01: 상승 표기 #E03131, 하락 표기 #1971C2, 보합 표기 #868E96<br>-상태색.02: 선택된 기간 필터 배경 #3A8A3A, 글자색 #FFFFFF, 비선택 배경 #F1F3F5, 글자색 #6C757D<br>-글꼴.01: 본문 글꼴 "Pretendard", "Noto Sans KR", 시스템 산세리프 대체<br>-글자크기.01: 품종명 15px/700, 현재가 16px/700, 보조 텍스트 12px/400, 표 본문 13px/400<br>-아이콘크기.01: 헤더 아이콘 20px × 20px, stroke-width 2, 색상 #212529 | Registry: docs/ds/screen-registry.json<br>Route: /price/$variety<br>File: src/routes/price.$variety.tsx<br>Baseline: 2026-08-04 코드 기준<br>기술 참조: AppShell(screenId="MKT-011_품종시세상세"), DetailHeader<br>토큰 참조: --background #ffffff, --foreground #212529, --border #E9ECEF, --primary #3a8a3a, --price-up, --price-down |


Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## PRC-002_price-id-alert_Default — 알림 설정

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0222 | 알림 설정 | PRC-002_price-id-alert_Default | Visible | -구성.01: 조건 요약 카드(품목·품종, 시장·단위, 현재가) + "목표가 알림" 섹션(목표가 이상/이하 숫자 입력) + "등락률 알림" 섹션(5% 이상 상승/하락 토글) + "거래량 알림" 섹션(전일 대비 거래량 30% 이상 증가 토글) + 하단 고정 취소/저장 버튼<br>-입력.01: NumField placeholder "원 이상이면 알림" / "원 이하이면 알림"(단위 "원")<br>-버튼.01: "취소", "저장" | Registry: docs/ds/screen-registry.json<br>Route: /price/$variety/alert<br>File: src/routes/price.$variety.alert.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0222 | 알림 설정 | PRC-002_price-id-alert_Default | Invisible | -데이터소스.01: getMarketQuote(...)(src/lib/mock/market-analysis.ts)<br>-조건.01: useAlerts.getFor(variety, marketId)(레거시 스키마 PriceAlerts: target/swing/auctionStart), setFor로 patch 저장<br>-저장.01: 저장 버튼 클릭 시 toast("가격 알림이 설정되었습니다.") 후 router.history.back()(입력값은 실제로 useAlerts에 반영되지 않음)<br>-미구현.01: 목표가 이상/이하 NumField는 입력값을 상태에 저장하는 로직이 없는 비제어 입력(onChange 없음)이며 저장 시 반영되지 않음<br>-미구현.02: "5% 이상 상승"과 "5% 이상 하락" 토글이 동일한 alerts.swing 값을 공유해 두 토글이 항상 같은 상태로 움직이며 독립 제어 불가<br>-미구현.03: "거래량 알림" 토글이 alerts.target(목표가 플래그)에 바인딩되어 있어 명명과 실제 저장 필드가 불일치 | Registry: docs/ds/screen-registry.json<br>Route: /price/$variety/alert<br>File: src/routes/price.$variety.alert.tsx<br>Store: src/store/alerts.ts, src/store/market.ts<br>⚠️ 확인 필요: useAlerts에는 신규 스키마(PriceAlertRule: targetAbove/targetBelow/swingUp/swingDown/volumeSurge 등)가 별도로 존재하나 본 화면은 레거시 getFor/setFor만 사용 중이므로 신규 스키마로 전환 예정인지 확인 필요<br>Baseline: 2026-08-04 코드 기준 |
| DS-0222 | 알림 설정 | PRC-002_price-id-alert_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: /price/$variety/alert<br>File: src/routes/price.$variety.alert.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0222 | 알림 설정 | PRC-002_price-id-alert_Default | Design | -너비.01: 콘텐츠 최대 너비 430px, 하단 고정 바는 하단에서 60px 위에 배치<br>-배경색.01: 조건 카드·입력 카드 배경 #FFFFFF, 페이지 배경 #FFFFFF<br>-테두리.01: 카드 테두리 1px solid #E9ECEF, 행 구분선 1px solid #F1F3F5<br>-모서리.01: 카드 모서리 반경 12px, 버튼 모서리 반경 10px<br>-내부여백.01: 카드 내부 여백 상 16px·우 16px·하 16px·좌 16px, 입력 행 여백 상 14px·우 16px·하 14px·좌 16px<br>-외부여백.01: 카드 좌우 여백 16px, 상단 여백 16px<br>-간격.01: 하단 버튼 사이 간격 8px<br>-글자크기.01: 섹션 제목 13.5px/700, 입력 라벨 13px/400, 입력 값 13.5px/400, 버튼 14px/700<br>-글자색.01: 기본 글자색 #212529, 입력 라벨 #495057, 단위 표기 #868E96, 입력 자리표시자 #ADB5BD<br>-상태색.01: 현재가 강조 글자색 #E03131<br>-상태색.02: 저장 버튼 배경 #3A8A3A·글자색 #FFFFFF, 눌림 상태 배경 #2F6F2F<br>-상태색.03: 취소 버튼 배경 #FFFFFF·테두리 1px solid #3A8A3A·글자색 #3A8A3A, 눌림 상태 배경 #F0F9F0<br>-상태색.04: 스위치 켜짐 배경 #3A8A3A | Registry: docs/ds/screen-registry.json<br>Route: /price/$variety/alert<br>File: src/routes/price.$variety.alert.tsx<br>Baseline: 2026-08-04 코드 기준<br>기술 참조: AppShell(screenId="MKT-012_품종가격알림"), DetailHeader, Switch<br>클래스 참조: rounded-[12px] border border-[#E9ECEF], data-[state=checked]:bg-[#3A8A3A] |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## 분석 파일

- src/routes/market.index.tsx
- src/routes/market.$crop.tsx
- src/routes/market.item.index.tsx
- src/routes/market.item.$item.tsx
- src/routes/market.wholesale.index.tsx
- src/routes/market.wholesale.$market.tsx
- src/routes/market.auction.$id.tsx
- src/routes/market-compare.tsx
- src/routes/compare.tsx
- src/routes/grades.tsx
- src/routes/price.$variety.tsx
- src/routes/price.$variety.alert.tsx
- src/components/app-shell.tsx
- src/components/detail-header.tsx
- src/components/date-picker-sheet.tsx
- src/components/market-v2/MarketSearchBar.tsx
- src/components/market-v2/MarketFilterBar.tsx
- src/components/market-v2/ProPriceHeadlineCard.tsx
- src/components/market-v2/ProAnalysisSection.tsx
- src/components/market-v2/MarketSheet.tsx
- src/components/market-v2/CorporationSheet.tsx
- src/components/market-v2/AuctionHistoryTable.tsx
- src/components/market/MarketDetailTabs.tsx
- src/components/market/MarketChartView.tsx
- src/components/market/MarketAuctionView.tsx
- src/components/market/MarketCompareView.tsx
- src/components/market/MarketOriginView.tsx
- src/components/market/MarketGradeSpecView.tsx
- src/store/market.ts
- src/store/alerts.ts
- src/lib/mock/market-analysis.ts
- src/lib/mock/crops.ts
- src/lib/mock/items.ts
- src/lib/mock/markets.ts
- src/lib/mock/corporations.ts
- src/lib/mock/auctions.ts
- src/lib/mock/variety-detail.ts
- src/lib/mock/variety-market-averages.ts
- src/components/home/DataSourceNotice.tsx

## 미구현·확인필요 요약

총 13건 (미구현 10건, 확인필요 3건)

1. (MKT-001) 미구현 — MarketSheet "가장 가까운 도매시장 찾기" 버튼이 toast만 호출하고 위치 조회 로직 없음.
2. (MKT-002 Default) 미구현 — MarketDetailTabs 및 5개 탭 컴포넌트(MarketChartView/MarketAuctionView/MarketCompareView/MarketOriginView/MarketGradeSpecView)가 어느 라우트에서도 import되지 않는 미사용 코드.
3. (MKT-002 Empty) 확인필요 — 컴포넌트 내부 Empty 분기와 라우트 notFoundComponent가 동일 문구로 중복 구현됨. 실제 트리거 조건 재확인 필요.
4. (MKT-005) 확인필요 — 도매시장 목록에서 품목 행 클릭 시 선택 품목 정보가 상세 화면에 전달되지 않음(의도 여부 확인 필요).
5. (MKT-007) 미구현 — 차트 탭 "표본 수" 값이 항상 "732건"으로 하드코딩.
6. (MKT-007) 미구현/확인필요 — MarketDetailTabs가 미배선 상태로, MKT-007~011 탭 세트가 /market/$crop에 연결될 계획인지 재확인 필요.
7. (MKT-008) 미구현 — 경매내역 탭 필터 칩 6종에 클릭 핸들러 없음, 모든 수치 하드코딩.
8. (MKT-009) 미구현 — 시장비교 탭 MARKETS 배열 및 흐름 그래프 수치 하드코딩.
9. (MKT-010) 미구현 — 산지 탭 ORIGINS 배열 하드코딩.
10. (MKT-011) 미구현 — 등급·규격 탭 GRADES/SPECS/VARIETIES 배열 하드코딩.
11. (MKT-013) 미구현 — MarketSheet "가장 가까운 도매시장 찾기" 버튼 위치 로직 없음(MKT-001과 동일 컴포넌트).
12. (PRC-002) 미구현 — 목표가 이상/이하 입력값이 상태에 저장되지 않는 비제어 입력.
13. (PRC-002) 미구현 — "5% 이상 상승/하락" 토글이 동일 alerts.swing 값을 공유해 독립 제어 불가.
14. (PRC-002) 미구현 — "거래량 알림" 토글이 alerts.target에 바인딩되어 명명과 저장 필드 불일치.
15. (PRC-002) 확인필요 — useAlerts의 신규 스키마(PriceAlertRule)가 별도로 존재하나 본 화면은 레거시 getFor/setFor만 사용, 전환 계획 확인 필요.
