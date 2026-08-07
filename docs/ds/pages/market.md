# 시세 DS

- Menu ID: market
- Registry: docs/ds/screen-registry.json
- Baseline: 2026-08-05 코드 기준

## MKT-001_market_Default — 시세 조회 메인 · 기본 상태

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0201 | 시세 조회 메인 | MKT-001_market_Default | Visible | -구성.01: 헤더 타이틀 "시세 조회" | Registry: docs/ds/screen-registry.json<br>Route: /market<br>File: src/routes/market.index.tsx<br>기술근거.01: 검색바 src/components/market-v2/MarketSearchBar.tsx, 조건카드 src/components/market-v2/MarketFilterBar.tsx, 헤드라인 src/components/market-v2/ProPriceHeadlineCard.tsx, 분석섹션 src/components/market-v2/ProAnalysisSection.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-0202 | 시세 조회 메인 | MKT-001_market_Default | Visible | -구성.02: 검색바 "작물명·품종으로 검색" | - |
| DS-0203 | 시세 조회 메인 | MKT-001_market_Default | Visible | -구성.03: 2x2 조건 선택 카드 4종 "조회 날짜/작물/도매시장/도매법인"(각 카드는 라벨과 현재 선택값을 함께 표시) | - |
| DS-0204 | 시세 조회 메인 | MKT-001_market_Default | Visible | -구성.04: 헤드라인 카드에 작물 아이콘, 품목·품종명, 시장·법인 조건 문구, 현재가, 단위 표기(원/단위, 클릭 시 단위 변경 가능), 등락률 배지, 예정경매 안내(예: "오늘 경매 기준"), 전일·전주·전년 등락률과 경매 건수 4셀, 갱신시각, 반입량(상자) 표시 | - |
| DS-0205 | 시세 조회 메인 | MKT-001_market_Default | Visible | -구성.05: 헤드라인 카드 우측 상단에 즐겨찾기(별)·알림(종) 버튼 | - |
| DS-0206 | 시세 조회 메인 | MKT-001_market_Default | Visible | -구성.06: 분석 섹션 탭 6종 "차트/경매내역/시장비교/법인/산지/품종" | - |
| DS-0207 | 시세 조회 메인 | MKT-001_market_Default | Visible | -구성.07: 차트 탭 기간 필터 5종 "당일/1주/1개월/3개월/1년", 최고가/최저가/평균가 3셀, 범례 | - |
| DS-0208 | 시세 조회 메인 | MKT-001_market_Default | Visible | -문구.01: AI 예측 배너 문구 "{추천월}월 {추천일}일 출하를 추천해요", 하단 "AI 예측 보기" 버튼 | - |
| DS-0209 | 시세 조회 메인 | MKT-001_market_Default | Visible | -문구.02: 차트 하단 안내 문구 "차트는 경매일 기준 · 오늘 이후 {7/30}일은 AI 예측입니다." 또는 "차트는 경매일 기준이며, 선택한 기간의 데이터를 제공합니다." | - |
| DS-0210 | 시세 조회 메인 | MKT-001_market_Default | Invisible | -데이터소스.01: 헤드라인 시세는 getMarketQuote(itemId,varietyId,marketId,unit,date)로 조회한다 | Registry: docs/ds/screen-registry.json<br>Route: /market<br>File: src/routes/market.index.tsx<br>기술근거.01: src/store/market.ts(useMarketFilter), src/lib/mock/market-analysis.ts(getMarketQuote, getPriceVolumeSeries)<br>Baseline: 2026-08-05 코드 기준 |
| DS-0211 | 시세 조회 메인 | MKT-001_market_Default | Invisible | -데이터소스.02: 차트·거래량 시계열은 getPriceVolumeSeries(...)로 조회한다 | - |
| DS-0212 | 시세 조회 메인 | MKT-001_market_Default | Invisible | -데이터소스.03: 조건값은 useMarketFilter(zustand, persist key "agdict:marketFilter:v2")에 보관하며 date는 저장 대상에서 제외되어 세션마다 오늘 날짜로 초기화된다 | - |
| DS-0213 | 시세 조회 메인 | MKT-001_market_Default | Invisible | -초기값.01: 카테고리 "과실류", 품목 "사과", 품종 "전체", 도매시장 "전체", 단위 "10kg 기준" | - |
| DS-0214 | 시세 조회 메인 | MKT-001_market_Default | Invisible | -조건.01: AI 예측 배너는 조회일이 오늘이고 기간이 1주 또는 1개월이며 해당 품목이 예측 지원 품목이고 시계열 데이터가 있을 때만 노출한다 | - |
| DS-0215 | 시세 조회 메인 | MKT-001_market_Default | Invisible | -액션.01: 즐겨찾기 버튼을 누르면 즐겨찾기 목록에 추가·제거되고 "즐겨찾기에 추가했어요"/"즐겨찾기에서 제거했어요" 토스트가 뜬다 | - |
| DS-0216 | 시세 조회 메인 | MKT-001_market_Default | Invisible | -이동.01: 작물 조건 카드를 누르면 작물 선택 화면으로 이동한다(공통 문서 SEL-001 대상) | - |
| DS-0217 | 시세 조회 메인 | MKT-001_market_Default | Invisible | -이동.02: 검색바를 누르면 통합 검색 화면으로 이동한다(공통 문서 SRC-001 대상) | - |
| DS-0218 | 시세 조회 메인 | MKT-001_market_Default | Invisible | -이동.03: 알림 버튼을 누르면 기존 알림 규칙이 있으면 해당 알림 설정 화면으로, 없으면 신규 알림 설정 화면으로 이동한다 | - |
| DS-0219 | 시세 조회 메인 | MKT-001_market_Default | Invisible | -이동.04: AI 예측 배너·"AI 예측 보기" 버튼을 누르면 AI 시세 예측 화면으로 이동한다 | - |
| DS-0220 | 시세 조회 메인 | MKT-001_market_Default | Invisible | -미구현.01: 도매시장 선택 시트의 "가장 가까운 도매시장 찾기" 버튼은 "위치 권한을 확인 중이에요 (준비 중)" 안내만 띄우고 실제 위치 조회는 되지 않는다 | - |
| DS-0221 | 시세 조회 메인 | MKT-001_market_Default | Design | -배경색.01: 페이지 배경 흰색(#FFFFFF) | Registry: docs/ds/screen-registry.json<br>Route: /market<br>File: src/routes/market.index.tsx<br>기술근거.01: AppShell(screenId="MKT-001_시세조회")로 DOM data 속성 노출<br>기술근거.02: 색상 값은 src/styles.css의 --price-up(#e03131), --price-down(#1971c2), --primary(#3a8a3a), --border(#e9ecef) 및 컴포넌트 내 인라인 hex와 일치<br>Baseline: 2026-08-05 코드 기준 |
| DS-0222 | 시세 조회 메인 | MKT-001_market_Default | Design | -배경색.02: 헤드라인 카드 배경 흰색(#FFFFFF), 조건 선택 카드 배경 흰색(#FFFFFF) | - |
| DS-0223 | 시세 조회 메인 | MKT-001_market_Default | Design | -테두리.01: 헤드라인 카드·조건 선택 카드 테두리 1px 옅은 회색(#E9ECEF) | - |
| DS-0224 | 시세 조회 메인 | MKT-001_market_Default | Design | -모서리.01: 헤드라인 카드 모서리 반경 14px, 조건 선택 카드 모서리 반경 12px | - |
| DS-0225 | 시세 조회 메인 | MKT-001_market_Default | Design | -내부여백.01: 헤드라인 카드 내부 여백 16px | - |
| DS-0226 | 시세 조회 메인 | MKT-001_market_Default | Design | -글자색.01: 본문 텍스트 진회색(#212529), 보조 텍스트 회색(#868E96) | - |
| DS-0227 | 시세 조회 메인 | MKT-001_market_Default | Design | -상태색.01: 상승 빨간색(#E03131), 하락 파란색(#1971C2), 보합 회색(#6C757D) | - |
| DS-0228 | 시세 조회 메인 | MKT-001_market_Default | Design | -상태색.02: 선택된 기간 필터 배경 진초록색(#1F5C1F)·글자 흰색, 비선택 배경 옅은 회색(#F1F3F5)·글자 회색(#6C757D) | - |
| DS-0229 | 시세 조회 메인 | MKT-001_market_Default | Design | -상태색.03: AI 예측 추천 카드 배경 초록 계열 그라데이션(#2E9E6B→#1F7A50), 글자 흰색 | - |
| DS-0230 | 시세 조회 메인 | MKT-001_market_Default | Design | -글자크기.01: 품목·품종명 16px/900, 현재가 30px/900, 보조 문구 11~12px | - |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## MKT-002_market-id_Default — 시세 상세 · 기본 상태

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0231 | 시세 상세 | MKT-002_market-id_Default | Visible | -구성.01: 헤더 타이틀 "시세 상세", 우측 즐겨찾기(별) 버튼과 공유 버튼 | Registry: docs/ds/screen-registry.json<br>Route: /market/$crop<br>File: src/routes/market.$crop.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-0232 | 시세 상세 | MKT-002_market-id_Default | Visible | -표시.01: 현재가, 단위, 등락 배지, 전일대비 등락 금액, 갱신시각 | - |
| DS-0233 | 시세 상세 | MKT-002_market-id_Default | Visible | -구성.02: 기간칩(당일/1주/1개월/3개월/1년) + 가격·거래량 차트 | - |
| DS-0234 | 시세 상세 | MKT-002_market-id_Default | Visible | -표시.02: 4열 통계 "현재가/전일대비/등락률/거래량" | - |
| DS-0235 | 시세 상세 | MKT-002_market-id_Default | Visible | -표시.03: 등급별 가격(상/중/하) 3열, 해당 품목에 등급 정보가 있을 때만 표시 | - |
| DS-0236 | 시세 상세 | MKT-002_market-id_Default | Visible | -표시.04: 시세 테이블(최근 30건) 컬럼 "날짜/가격/등락률/거래량/등급" | - |
| DS-0237 | 시세 상세 | MKT-002_market-id_Default | Visible | -표시.05: 하단 고정 바에 총 거래량과 kg당 평균 표시 | - |
| DS-0238 | 시세 상세 | MKT-002_market-id_Default | Visible | -문구.01: 하단 링크 "전체 시세조회 →" | - |
| DS-0239 | 시세 상세 | MKT-002_market-id_Default | Invisible | -데이터소스.01: 품목 정보는 getCrop(cropId)에서, 기간별 시세 시계열은 seriesFor(cropId, period)에서 조회한다 | Registry: docs/ds/screen-registry.json<br>Route: /market/$crop<br>File: src/routes/market.$crop.tsx<br>기술근거.01: src/store/ui.ts, src/features/favorites/favoriteStore.ts, src/lib/mock/crops.ts<br>⚠️ 확인 필요.01: MKT-007~011 탭 컴포넌트(src/components/market/*)를 이 화면에 연결할 계획인지 기획 확인 필요<br>Baseline: 2026-08-05 코드 기준 |
| DS-0240 | 시세 상세 | MKT-002_market-id_Default | Invisible | -데이터소스.02: 기간 선택 상태는 전역 화면 상태(useUi)에, 즐겨찾기 여부는 즐겨찾기 저장소(useFavoritePriceStore)에 보관한다 | - |
| DS-0241 | 시세 상세 | MKT-002_market-id_Default | Invisible | -계산식.01: 등락률은 (현재가-전일가)/전일가*100으로 계산한다 | - |
| DS-0242 | 시세 상세 | MKT-002_market-id_Default | Invisible | -계산식.02: 평균가는 표시 기간 가격 합계를 표시 기간 건수로 나눈 값을 반올림해 계산한다 | - |
| DS-0243 | 시세 상세 | MKT-002_market-id_Default | Invisible | -계산식.03: 시세 테이블의 등급은 실제 등급 데이터가 아니라 행 순번을 3으로 나눈 나머지로 상/중/하를 결정론적으로 배정한다 | - |
| DS-0244 | 시세 상세 | MKT-002_market-id_Default | Invisible | -조건.01: 품목이 존재하지 않으면 시세 상세(품목 없음) 상태로 전환한다 | - |
| DS-0245 | 시세 상세 | MKT-002_market-id_Default | Invisible | -액션.01: 즐겨찾기 버튼을 누르면 "즐겨찾기에 추가되었습니다 ★" 또는 "즐겨찾기에서 제거되었습니다" 토스트가 뜬다 | - |
| DS-0246 | 시세 상세 | MKT-002_market-id_Default | Invisible | -액션.02: 공유 버튼을 누르면 현재 페이지 링크가 복사되고 "링크를 복사했어요" 토스트가 뜬다 | - |
| DS-0247 | 시세 상세 | MKT-002_market-id_Default | Invisible | -미구현.01: 차트/경매내역/시장비교/산지/등급·규격 5종 탭 컴포넌트가 별도로 구현돼 있으나 이 화면을 포함해 어디에서도 연결되어 있지 않아 실제 화면에는 등급 요약과 30건 테이블만 노출된다 | - |
| DS-0248 | 시세 상세 | MKT-002_market-id_Default | Design | -배경색.01: 페이지 배경 흰색(#FFFFFF) | Registry: docs/ds/screen-registry.json<br>Route: /market/$crop<br>File: src/routes/market.$crop.tsx<br>기술근거.01: AppShell(screenId="MKT-002_시세상세"), DetailHeader, PriceBadge, PriceVolumeChart 컴포넌트로 구현됨<br>Baseline: 2026-08-05 코드 기준 |
| DS-0249 | 시세 상세 | MKT-002_market-id_Default | Design | -글자색.01: 본문 텍스트 진회색(#212529), 보조 텍스트 회색(#6C757D) | - |
| DS-0250 | 시세 상세 | MKT-002_market-id_Default | Design | -상태색.01: 등락 텍스트 상승 빨간색(#E03131), 하락 파란색(#1971C2), 보합 회색(#6C757D) | - |
| DS-0251 | 시세 상세 | MKT-002_market-id_Default | Design | -글자크기.01: 현재가 32px/900(font-black) | - |
| DS-0252 | 시세 상세 | MKT-002_market-id_Default | Design | -테두리.01: 통계 4열 상하 구분선 1px 옅은 회색(#E9ECEF) | - |
| DS-0253 | 시세 상세 | MKT-002_market-id_Default | Design | -모서리.01: 등급 카드 모서리 반경 10px, 시세 테이블 모서리 반경 10px | - |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## MKT-002_market-id_Empty — 시세 상세 · 빈 상태

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0254 | 시세 상세(품목 없음) | MKT-002_market-id_Empty | Visible | -빈상태.01: 안내 문구 "품목을 찾을 수 없어요."가 화면 가운데 표시된다 | Registry: docs/ds/screen-registry.json<br>Route: /market/$crop<br>File: src/routes/market.$crop.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-0255 | 시세 상세(품목 없음) | MKT-002_market-id_Empty | Visible | -구성.01: 헤더 타이틀 "시세 상세"와 뒤로가기 버튼만 노출된다 | - |
| DS-0256 | 시세 상세(품목 없음) | MKT-002_market-id_Empty | Invisible | -조건.01: 요청한 품목 id로 조회한 품목 정보가 없을 때 이 상태로 진입한다 | Registry: docs/ds/screen-registry.json<br>Route: /market/$crop<br>File: src/routes/market.$crop.tsx<br>⚠️ 확인 필요.01: 컴포넌트 내부 빈 상태 분기와 라우트의 notFoundComponent 분기 두 가지가 동시에 존재해 어느 조건에서 어느 쪽이 노출되는지 라우팅 정책 확인 필요<br>Baseline: 2026-08-05 코드 기준 |
| DS-0257 | 시세 상세(품목 없음) | MKT-002_market-id_Empty | Invisible | -분기.01: 화면 상태값을 "빈 상태"로 설정한다 | - |
| DS-0258 | 시세 상세(품목 없음) | MKT-002_market-id_Empty | Invisible | -예외.01: 라우트 자체의 경로 불일치(찾을 수 없음) 처리에서도 동일한 문구의 별도 안내가 한 번 더 제공된다 | - |
| DS-0259 | 시세 상세(품목 없음) | MKT-002_market-id_Empty | Design | -배경색.01: 페이지 배경 흰색(#FFFFFF) | Registry: docs/ds/screen-registry.json<br>Route: /market/$crop<br>File: src/routes/market.$crop.tsx<br>기술근거.01: AppShell(screenId="MKT-002_시세상세", screenState="Empty")<br>Baseline: 2026-08-05 코드 기준 |
| DS-0260 | 시세 상세(품목 없음) | MKT-002_market-id_Empty | Design | -글자색.01: 빈 상태 안내 문구 회색(#6C757D) | - |
| DS-0261 | 시세 상세(품목 없음) | MKT-002_market-id_Empty | Design | -정렬.01: 안내 문구 가로 중앙 정렬 | - |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## MKT-003_market-item_Default — 품목 목록 · 기본 상태

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0262 | 품목 목록 | MKT-003_market-item_Default | Visible | -구성.01: 헤더 타이틀 "품목별 조회" | Registry: docs/ds/screen-registry.json<br>Route: /market/item<br>File: src/routes/market.item.index.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-0263 | 품목 목록 | MKT-003_market-item_Default | Visible | -구성.02: 선택 품목 드롭다운 버튼(부류명·품목명·"전체 품종" 표시) | - |
| DS-0264 | 품목 목록 | MKT-003_market-item_Default | Visible | -모달.01: 버튼을 누르면 바텀시트 "품목 선택"이 열리며 부류별로 품목 목록이 그룹핑되어 표시되고 선택 항목에 체크 아이콘이 붙는다 | - |
| DS-0265 | 품목 목록 | MKT-003_market-item_Default | Visible | -목록항목.01: 도매시장별 시세 리스트, 각 행에 시장명·지역·가격(원)·등락률(▲/▼ 아이콘과 %) 표시 | - |
| DS-0266 | 품목 목록 | MKT-003_market-item_Default | Visible | -문구.01: 소제목 "{품목명} 도매시장별 시세" | - |
| DS-0267 | 품목 목록 | MKT-003_market-item_Default | Invisible | -데이터소스.01: 품목 목록과 부류 목록, 도매시장 목록을 mock 데이터에서 조회한다 | Registry: docs/ds/screen-registry.json<br>Route: /market/item<br>File: src/routes/market.item.index.tsx<br>기술근거.01: src/lib/mock/items.ts(ITEMS, ITEM_CATEGORIES), src/lib/mock/markets.ts(MARKETS)<br>Baseline: 2026-08-05 코드 기준 |
| DS-0268 | 품목 목록 | MKT-003_market-item_Default | Invisible | -조건.01: 조회 대상 품목은 주소 검색조건의 item 값으로 결정되며 값이 없으면 사과(apple)를 기본값으로 사용한다 | - |
| DS-0269 | 품목 목록 | MKT-003_market-item_Default | Invisible | -계산식.01: 시장별 가격은 기준가에 품목·시장 인덱스로 만든 결정론적 배수를 곱해 산출한다(실거래 연동 아님) | - |
| DS-0270 | 품목 목록 | MKT-003_market-item_Default | Invisible | -액션.01: 품목을 선택하면 주소 검색조건이 갱신되며 화면이 갱신된다 | - |
| DS-0271 | 품목 목록 | MKT-003_market-item_Default | Invisible | -이동.01: 시장 행을 누르면 해당 도매시장 상세 화면으로 이동한다 | - |
| DS-0272 | 품목 목록 | MKT-003_market-item_Default | Design | -배경색.01: 드롭다운 버튼 배경 흰색(#FFFFFF), 시트 배경 흰색(#FFFFFF) | Registry: docs/ds/screen-registry.json<br>Route: /market/item<br>File: src/routes/market.item.index.tsx<br>기술근거.01: AppShell(screenId="MKT-003_품목별시세"), Drawer/DrawerContent/DrawerTrigger, CropIcon<br>Baseline: 2026-08-05 코드 기준 |
| DS-0273 | 품목 목록 | MKT-003_market-item_Default | Design | -테두리.01: 드롭다운 버튼 테두리 1px 옅은 회색(#E9ECEF) | - |
| DS-0274 | 품목 목록 | MKT-003_market-item_Default | Design | -모서리.01: 드롭다운 버튼 모서리 반경 12px | - |
| DS-0275 | 품목 목록 | MKT-003_market-item_Default | Design | -테두리.02: 목록 항목 상단 구분선 1px 옅은 회색(#F1F3F5) | - |
| DS-0276 | 품목 목록 | MKT-003_market-item_Default | Design | -배경색.02: 시트 내 선택된 품목 행 배경 연한 초록색(#F0F9F0) | - |
| DS-0277 | 품목 목록 | MKT-003_market-item_Default | Design | -상태색.01: 등락률 상승 빨간색(#DC2626), 하락 파란색(#2563EB) | - |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## MKT-004_market-item-id_Default — 품목 상세 · 기본 상태

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0278 | 품목 상세 | MKT-004_market-item-id_Default | Visible | -구성.01: 헤더 타이틀 "시세 상세"와 뒤로가기 버튼 | Registry: docs/ds/screen-registry.json<br>Route: /market/item/$item<br>File: src/routes/market.item.$item.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-0279 | 품목 상세 | MKT-004_market-item-id_Default | Visible | -표시.01: 선택 품목 칩(품목명)과 부류 라벨 배지 | - |
| DS-0280 | 품목 상세 | MKT-004_market-item-id_Default | Visible | -표시.02: 3열 요약 "오늘 총 거래량/kg당 평균가/거래 품종" | - |
| DS-0281 | 품목 상세 | MKT-004_market-item-id_Default | Visible | -문구.01: 소제목 "품종 {건수} · 거래량순" | - |
| DS-0282 | 품목 상세 | MKT-004_market-item-id_Default | Visible | -목록항목.01: 품종별 리스트(거래량이 많은 순서로 정렬) | - |
| DS-0283 | 품목 상세 | MKT-004_market-item-id_Default | Invisible | -데이터소스.01: 품목 정보, 총 거래량, kg당 평균가를 mock 데이터에서 조회한다 | Registry: docs/ds/screen-registry.json<br>Route: /market/item/$item<br>File: src/routes/market.item.$item.tsx<br>기술근거.01: src/lib/mock/items.ts(getItem, itemAvgKg, itemTotalVolume)<br>Baseline: 2026-08-05 코드 기준 |
| DS-0284 | 품목 상세 | MKT-004_market-item-id_Default | Invisible | -정렬.01: 품종 목록은 거래량(톤) 기준 내림차순으로 정렬한다 | - |
| DS-0285 | 품목 상세 | MKT-004_market-item-id_Default | Invisible | -분기.01: 요청한 품목이 존재하지 않으면 경로를 찾을 수 없음으로 처리하고 "품목을 찾을 수 없어요." 안내를 표시한다 | - |
| DS-0286 | 품목 상세 | MKT-004_market-item-id_Default | Design | -배경색.01: 페이지 배경 흰색(#FFFFFF), 요약 3열 배경 옅은 회색(#F8F9FA) | Registry: docs/ds/screen-registry.json<br>Route: /market/item/$item<br>File: src/routes/market.item.$item.tsx<br>기술근거.01: AppShell(screenId="MKT-004_품목시세상세"), DetailHeader, CropIcon, src/components/market-v2/VarietyRow.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-0287 | 품목 상세 | MKT-004_market-item-id_Default | Design | -모서리.01: 요약 3열 모서리 반경 12px | - |
| DS-0288 | 품목 상세 | MKT-004_market-item-id_Default | Design | -테두리.01: 품종 행 상하 구분선 1px 옅은 회색(#F1F3F5) | - |
| DS-0289 | 품목 상세 | MKT-004_market-item-id_Default | Design | -배경색.02: 품목 칩 배경 연한 초록색(#F0F9F0), 글자 진초록색(#3A8A3A) | - |
| DS-0290 | 품목 상세 | MKT-004_market-item-id_Default | Design | -글자색.01: 본문 텍스트 진회색(foreground), 보조 텍스트 회색(#6C757D) | - |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## MKT-005_market-wholesale_Default — 도매시장 목록 · 기본 상태

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0291 | 도매시장 목록 | MKT-005_market-wholesale_Default | Visible | -구성.01: 헤더 타이틀 "도매시장별 조회" | Registry: docs/ds/screen-registry.json<br>Route: /market/wholesale<br>File: src/routes/market.wholesale.index.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-0292 | 도매시장 목록 | MKT-005_market-wholesale_Default | Visible | -구성.02: 선택 시장 드롭다운 버튼(시장명, 지역명 표시) | - |
| DS-0293 | 도매시장 목록 | MKT-005_market-wholesale_Default | Visible | -모달.01: 버튼을 누르면 바텀시트 "도매시장 선택"이 열리며 지역별로 시장 목록이 그룹핑되어 표시되고 선택 항목에 체크 아이콘이 붙는다 | - |
| DS-0294 | 도매시장 목록 | MKT-005_market-wholesale_Default | Visible | -목록항목.01: 거래 품목 리스트, 각 행에 품목 아이콘·이름·가격·등락률 표시 | - |
| DS-0295 | 도매시장 목록 | MKT-005_market-wholesale_Default | Visible | -문구.01: 소제목 "{시장명} 거래 품목" | - |
| DS-0296 | 도매시장 목록 | MKT-005_market-wholesale_Default | Invisible | -데이터소스.01: 도매시장 목록과 품목 목록을 mock 데이터에서 조회한다 | Registry: docs/ds/screen-registry.json<br>Route: /market/wholesale<br>File: src/routes/market.wholesale.index.tsx<br>기술근거.01: src/lib/mock/markets.ts(MARKETS), src/lib/mock/items.ts(ITEMS)<br>⚠️ 확인 필요.01: 품목 행 클릭 시 선택 품목 정보가 상세 화면에 전달되지 않아 상세 화면에서 품목이 자동 선택되지 않는 것이 의도된 동작인지 확인 필요<br>Baseline: 2026-08-05 코드 기준 |
| DS-0297 | 도매시장 목록 | MKT-005_market-wholesale_Default | Invisible | -조건.01: 조회 대상 시장은 주소 검색조건 값으로 결정되며 값이 없으면 서울 가락시장을 기본값으로 사용한다 | - |
| DS-0298 | 도매시장 목록 | MKT-005_market-wholesale_Default | Invisible | -계산식.01: 품목별 가격은 기준가에 시장 오프셋으로 만든 결정론적 배수를 곱해 산출한다(실거래 연동 아님) | - |
| DS-0299 | 도매시장 목록 | MKT-005_market-wholesale_Default | Invisible | -액션.01: 시장을 선택하면 주소 검색조건이 갱신되며 화면이 갱신된다 | - |
| DS-02100 | 도매시장 목록 | MKT-005_market-wholesale_Default | Invisible | -이동.01: 품목 행을 누르면 현재 선택된 시장의 상세 화면으로 이동하며, 누른 품목 정보는 다음 화면에 전달되지 않는다 | - |
| DS-02101 | 도매시장 목록 | MKT-005_market-wholesale_Default | Design | -배경색.01: 드롭다운 버튼·시트 배경 흰색(#FFFFFF) | Registry: docs/ds/screen-registry.json<br>Route: /market/wholesale<br>File: src/routes/market.wholesale.index.tsx<br>기술근거.01: AppShell(screenId="MKT-005_도매시장목록"), Drawer, CropIcon<br>Baseline: 2026-08-05 코드 기준 |
| DS-02102 | 도매시장 목록 | MKT-005_market-wholesale_Default | Design | -모서리.01: 드롭다운 버튼 모서리 반경 12px | - |
| DS-02103 | 도매시장 목록 | MKT-005_market-wholesale_Default | Design | -테두리.01: 목록 항목 상단 구분선 1px 옅은 회색(#F1F3F5) | - |
| DS-02104 | 도매시장 목록 | MKT-005_market-wholesale_Default | Design | -상태색.01: 등락률 상승 빨간색(#DC2626), 하락 파란색(#2563EB) | - |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## MKT-006_market-wholesale-id_Default — 도매시장 상세 · 기본 상태

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-02105 | 도매시장 상세 | MKT-006_market-wholesale-id_Default | Visible | -구성.01: 헤더 타이틀 "시세 상세"와 뒤로가기 버튼 | Registry: docs/ds/screen-registry.json<br>Route: /market/wholesale/$market<br>File: src/routes/market.wholesale.$market.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-02106 | 도매시장 상세 | MKT-006_market-wholesale-id_Default | Visible | -표시.01: 선택 시장 칩(시장명) | - |
| DS-02107 | 도매시장 상세 | MKT-006_market-wholesale-id_Default | Visible | -구성.02: 작물 칩 목록(상위 6개 품목, 가로 스크롤) | - |
| DS-02108 | 도매시장 상세 | MKT-006_market-wholesale-id_Default | Visible | -표시.02: 표 컬럼 "구분/평균가/전일대비/거래량", 전체 평균 행과 품종별 행으로 구성 | - |
| DS-02109 | 도매시장 상세 | MKT-006_market-wholesale-id_Default | Visible | -목록항목.01: 품종 행을 펼치면 법인별 가격·등락률·거래량 서브행이 표시된다 | - |
| DS-02110 | 도매시장 상세 | MKT-006_market-wholesale-id_Default | Visible | -표시.03: 하단 고정 바에 "{품목명} 총 거래량"과 "kg당 평균" 표시 | - |
| DS-02111 | 도매시장 상세 | MKT-006_market-wholesale-id_Default | Invisible | -데이터소스.01: 도매시장 정보와 상위 6개 품목 목록을 mock 데이터에서 조회한다 | Registry: docs/ds/screen-registry.json<br>Route: /market/wholesale/$market<br>File: src/routes/market.wholesale.$market.tsx<br>기술근거.01: src/lib/mock/markets.ts(MARKETS), src/lib/mock/items.ts(ITEMS)<br>Baseline: 2026-08-05 코드 기준 |
| DS-02112 | 도매시장 상세 | MKT-006_market-wholesale-id_Default | Invisible | -분기.01: 요청한 시장이 존재하지 않으면 경로를 찾을 수 없음으로 처리하고 "시장을 찾을 수 없어요." 안내를 표시한다 | - |
| DS-02113 | 도매시장 상세 | MKT-006_market-wholesale-id_Default | Invisible | -계산식.01: 법인별 가격은 품종 평균가에 법인 순번 기반 오프셋을 곱해 산출한다(실거래 연동 아님) | - |
| DS-02114 | 도매시장 상세 | MKT-006_market-wholesale-id_Default | Invisible | -계산식.02: 전체 평균은 품종별 거래량을 가중치로 한 가중평균으로 계산한다 | - |
| DS-02115 | 도매시장 상세 | MKT-006_market-wholesale-id_Default | Invisible | -분기.02: 등락률 절댓값이 0.05% 미만이면 보합으로 처리한다 | - |
| DS-02116 | 도매시장 상세 | MKT-006_market-wholesale-id_Default | Invisible | -자동동작.01: 작물 칩을 변경하면 펼쳐진 법인별 서브행이 자동으로 접힌다 | - |
| DS-02117 | 도매시장 상세 | MKT-006_market-wholesale-id_Default | Design | -상태색.01: 상승 빨간색(#E03131), 하락 파란색(#1971C2), 보합 회색(#6C757D) | Registry: docs/ds/screen-registry.json<br>Route: /market/wholesale/$market<br>File: src/routes/market.wholesale.$market.tsx<br>기술근거.01: AppShell(screenId="MKT-006_도매시장상세"), DetailHeader, CropIcon<br>Baseline: 2026-08-05 코드 기준 |
| DS-02118 | 도매시장 상세 | MKT-006_market-wholesale-id_Default | Design | -배경색.01: 페이지 배경 흰색(#FFFFFF), 하단 고정 바 배경 옅은 회색(#F8F9FA) | - |
| DS-02119 | 도매시장 상세 | MKT-006_market-wholesale-id_Default | Design | -배경색.02: 전체 평균 행 배경 옅은 하늘색(#EBF6FD) | - |
| DS-02120 | 도매시장 상세 | MKT-006_market-wholesale-id_Default | Design | -테두리.01: 표 행 상하 구분선 1px 옅은 회색(#E9ECEF) | - |
| DS-02121 | 도매시장 상세 | MKT-006_market-wholesale-id_Default | Design | -배경색.03: 선택 시장 칩 배경 연한 초록색(#F0F9F0), 글자 진초록색(#3A8A3A) | - |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## MKT-007_market-crop-tab-chart_Default — 차트 탭 · 기본 상태

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-02122 | 차트 탭 | MKT-007_market-crop-tab-chart_Default | Visible | -구성.01: 가격 추이 카드(가격·거래량 차트) + 기간 필터 5종 "당일/1주/1개월/3개월/1년" | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market/$crop<br>File: src/components/market/MarketChartView.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-02123 | 차트 탭 | MKT-007_market-crop-tab-chart_Default | Visible | -문구.01: AI 예측 배너 문구 "{일자} 출하가 유리해요" | - |
| DS-02124 | 차트 탭 | MKT-007_market-crop-tab-chart_Default | Visible | -버튼.01: "일별·시장별 시세 보기" 버튼 | - |
| DS-02125 | 차트 탭 | MKT-007_market-crop-tab-chart_Default | Visible | -표시.01: 4열 통계 "최고 평균가/최저 평균가/거래량 합/표본 수" | - |
| DS-02126 | 차트 탭 | MKT-007_market-crop-tab-chart_Default | Visible | -구성.02: 안내 문구 영역(DataSourceNotice) | - |
| DS-02127 | 차트 탭 | MKT-007_market-crop-tab-chart_Default | Invisible | -데이터소스.01: 품목 정보를 mock 데이터에서, 조회 날짜는 전역 시세 조건 저장소에서 가져온다 | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market/$crop<br>File: src/components/market/MarketChartView.tsx<br>기술근거.01: src/store/market.ts, 상위 컨테이너 MarketDetailTabs<br>⚠️ 확인 필요.01: MKT-007~011 탭 세트를 /market/$crop 화면에 연결할 계획인지, 혹은 /price/$variety 화면의 탭으로 대체된 것인지 기획 확인 필요<br>Baseline: 2026-08-05 코드 기준 |
| DS-02128 | 차트 탭 | MKT-007_market-crop-tab-chart_Default | Invisible | -계산식.01: 기간별(당일 24시간/1주/1개월/3개월 13주/1년 12개월) 가격·거래량·예측치는 결정론적 난수로 생성한다 | - |
| DS-02129 | 차트 탭 | MKT-007_market-crop-tab-chart_Default | Invisible | -조건.01: AI 예측 배너는 예측 지원 품목이고 조회일이 오늘이며 기간이 1주 또는 1개월일 때만 노출한다 | - |
| DS-02130 | 차트 탭 | MKT-007_market-crop-tab-chart_Default | Invisible | -이동.01: 예측 배너를 누르면 AI 시세 예측 화면으로 이동한다 | - |
| DS-02131 | 차트 탭 | MKT-007_market-crop-tab-chart_Default | Invisible | -액션.01: "일별·시장별 시세 보기"를 누르면 경매내역 탭으로 전환된다 | - |
| DS-02132 | 차트 탭 | MKT-007_market-crop-tab-chart_Default | Invisible | -미구현.01: 본 컴포넌트를 렌더링하는 상위 탭 컨테이너가 어느 라우트에서도 사용되지 않아 실제 화면에는 연결되어 있지 않다 | - |
| DS-02133 | 차트 탭 | MKT-007_market-crop-tab-chart_Default | Invisible | -미구현.02: 표본 수 값이 항상 "732건"으로 고정되어 실제 데이터 건수를 반영하지 않는다 | - |
| DS-02134 | 차트 탭 | MKT-007_market-crop-tab-chart_Default | Design | -상태색.01: 가격선 진한 빨간색(#E03B3B), 거래량 막대 연한 분홍색(#F3C6C6) | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market/$crop<br>File: src/components/market/MarketChartView.tsx<br>기술근거.01: PriceVolumeChart(src/components/price-volume-chart.tsx), DataSourceNotice 컴포넌트로 구현됨<br>기술근거.02: 색상 토큰 src/styles.css --chart-price(#e03b3b), --chart-volume(#f3c6c6)<br>Baseline: 2026-08-05 코드 기준 |
| DS-02135 | 차트 탭 | MKT-007_market-crop-tab-chart_Default | Design | -배경색.01: 카드 배경 흰색(#FFFFFF) | - |
| DS-02136 | 차트 탭 | MKT-007_market-crop-tab-chart_Default | Design | -테두리.01: 카드 테두리 1px 옅은 회색(#E9ECEF) | - |
| DS-02137 | 차트 탭 | MKT-007_market-crop-tab-chart_Default | Design | -글자색.01: 안내 문구 회색(#6C757D) | - |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## MKT-008_market-crop-tab-auction_Default — 경매내역 탭 · 기본 상태

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-02138 | 경매내역 탭 | MKT-008_market-crop-tab-auction_Default | Visible | -필터.01: 필터 칩 6종 "오늘/도매시장/법인/등급/규격/더보기" | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market/$crop<br>File: src/components/market/MarketAuctionView.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-02139 | 경매내역 탭 | MKT-008_market-crop-tab-auction_Default | Visible | -표시.01: 요약 4셀 "최근 낙찰가/최고가/최저가/누적 거래량" | - |
| DS-02140 | 경매내역 탭 | MKT-008_market-crop-tab-auction_Default | Visible | -구성.01: 실시간 경매내역 리스트, 시간대별 체결 흐름 막대 그래프, 안내 문구 영역(DataSourceNotice) | - |
| DS-02141 | 경매내역 탭 | MKT-008_market-crop-tab-auction_Default | Invisible | -데이터소스.01: 경매 목록 5건과 요약값, 체결 흐름 막대 높이가 컴포넌트 내부 고정값으로만 존재하고 외부 저장소·API 연동이 없다 | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market/$crop<br>File: src/components/market/MarketAuctionView.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-02142 | 경매내역 탭 | MKT-008_market-crop-tab-auction_Default | Invisible | -미구현.01: 본 컴포넌트는 어떤 라우트에서도 사용되지 않아 실제 화면에 표시되지 않는다 | - |
| DS-02143 | 경매내역 탭 | MKT-008_market-crop-tab-auction_Default | Invisible | -미구현.02: 필터 칩 6종은 눌러도 동작하지 않는다 | - |
| DS-02144 | 경매내역 탭 | MKT-008_market-crop-tab-auction_Default | Design | -상태색.01: 상승 빨간색(#E03131), 하락 파란색(#1971C2), 보합 회색(#6C757D) | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market/$crop<br>File: src/components/market/MarketAuctionView.tsx<br>기술근거.01: PriceBadge, DataSourceNotice 컴포넌트로 구현됨(상위 탭 컨테이너 미배선으로 실화면 미노출)<br>Baseline: 2026-08-05 코드 기준 |
| DS-02145 | 경매내역 탭 | MKT-008_market-crop-tab-auction_Default | Design | -배경색.01: 카드 배경 흰색(#FFFFFF) | - |
| DS-02146 | 경매내역 탭 | MKT-008_market-crop-tab-auction_Default | Design | -테두리.01: 카드 테두리 1px 옅은 회색(#E9ECEF) | - |
| DS-02147 | 경매내역 탭 | MKT-008_market-crop-tab-auction_Default | Design | -글자색.01: 안내 문구 회색(#6C757D) | - |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## MKT-009_market-crop-tab-compare_Default — 시장비교 탭 · 기본 상태

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-02148 | 시장비교 탭 | MKT-009_market-crop-tab-compare_Default | Visible | -필터.01: 필터 칩 4종 "오늘/10개 시장/가격순/카드·표" | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market/$crop<br>File: src/components/market/MarketCompareView.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-02149 | 시장비교 탭 | MKT-009_market-crop-tab-compare_Default | Visible | -표시.01: 요약 3셀 "최고 시장/평균 가격/가격 편차" | - |
| DS-02150 | 시장비교 탭 | MKT-009_market-crop-tab-compare_Default | Visible | -구성.01: 시장 순위 리스트(현재 기준 항목 강조 표시), 1주 가격 흐름 막대 그래프, 범례, 안내 문구 영역(DataSourceNotice) | - |
| DS-02151 | 시장비교 탭 | MKT-009_market-crop-tab-compare_Default | Invisible | -계산식.01: 평균 가격은 시장별 가격의 산술평균, 가격 편차는 최고가와 최저가의 차이로 계산한다 | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market/$crop<br>File: src/components/market/MarketCompareView.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-02152 | 시장비교 탭 | MKT-009_market-crop-tab-compare_Default | Invisible | -미구현.01: 본 컴포넌트는 어떤 라우트에서도 사용되지 않아 실제 화면에 표시되지 않는다 | - |
| DS-02153 | 시장비교 탭 | MKT-009_market-crop-tab-compare_Default | Invisible | -미구현.02: 시장 6곳 목록과 흐름 그래프 수치가 컴포넌트 내부 고정값이다 | - |
| DS-02154 | 시장비교 탭 | MKT-009_market-crop-tab-compare_Default | Invisible | -미구현.03: 필터 칩 4종은 눌러도 동작하지 않는다 | - |
| DS-02155 | 시장비교 탭 | MKT-009_market-crop-tab-compare_Default | Design | -상태색.01: 상승 빨간색(#E03131), 하락 파란색(#1971C2), 보합 회색(#6C757D) | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market/$crop<br>File: src/components/market/MarketCompareView.tsx<br>기술근거.01: PriceBadge, DataSourceNotice 컴포넌트로 구현됨(상위 탭 컨테이너 미배선으로 실화면 미노출)<br>Baseline: 2026-08-05 코드 기준 |
| DS-02156 | 시장비교 탭 | MKT-009_market-crop-tab-compare_Default | Design | -배경색.01: 카드 배경 흰색(#FFFFFF) | - |
| DS-02157 | 시장비교 탭 | MKT-009_market-crop-tab-compare_Default | Design | -테두리.01: 카드 테두리 1px 옅은 회색(#E9ECEF) | - |
| DS-02158 | 시장비교 탭 | MKT-009_market-crop-tab-compare_Default | Design | -글자색.01: 안내 문구 회색(#6C757D) | - |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## MKT-010_market-crop-tab-origin_Default — 산지 탭 · 기본 상태

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-02159 | 산지 탭 | MKT-010_market-crop-tab-origin_Default | Visible | -필터.01: 필터 칩 4종 "이번 주/주산지/출하지/거래량순" | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market/$crop<br>File: src/components/market/MarketOriginView.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-02160 | 산지 탭 | MKT-010_market-crop-tab-origin_Default | Visible | -구성.01: 주산지 시세 순위 리스트(5개 산지, 점유율·거래량·가격·등락률 표시) | - |
| DS-02161 | 산지 탭 | MKT-010_market-crop-tab-origin_Default | Visible | -구성.02: 주산지 비중 스택 막대와 범례 | - |
| DS-02162 | 산지 탭 | MKT-010_market-crop-tab-origin_Default | Visible | -문구.01: 안내 문구 "같은 품목과 유사 규격 기준으로 비교됩니다. 일부 산지는 표본 수가 적어 변동률이 크게 보일 수 있습니다."와 DataSourceNotice 영역 | - |
| DS-02163 | 산지 탭 | MKT-010_market-crop-tab-origin_Default | Invisible | -미구현.01: 본 컴포넌트는 어떤 라우트에서도 사용되지 않아 실제 화면에 표시되지 않는다 | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market/$crop<br>File: src/components/market/MarketOriginView.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-02164 | 산지 탭 | MKT-010_market-crop-tab-origin_Default | Invisible | -미구현.02: 산지 5개 목록이 컴포넌트 내부 고정값이다 | - |
| DS-02165 | 산지 탭 | MKT-010_market-crop-tab-origin_Default | Invisible | -미구현.03: 필터 칩 4종은 눌러도 동작하지 않는다 | - |
| DS-02166 | 산지 탭 | MKT-010_market-crop-tab-origin_Default | Design | -상태색.01: 상승 빨간색(#E03131), 하락 파란색(#1971C2), 보합 회색(#6C757D) | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market/$crop<br>File: src/components/market/MarketOriginView.tsx<br>기술근거.01: PriceBadge, DataSourceNotice 컴포넌트로 구현됨(상위 탭 컨테이너 미배선으로 실화면 미노출)<br>Baseline: 2026-08-05 코드 기준 |
| DS-02167 | 산지 탭 | MKT-010_market-crop-tab-origin_Default | Design | -배경색.01: 카드 배경 흰색(#FFFFFF) | - |
| DS-02168 | 산지 탭 | MKT-010_market-crop-tab-origin_Default | Design | -테두리.01: 카드 테두리 1px 옅은 회색(#E9ECEF) | - |
| DS-02169 | 산지 탭 | MKT-010_market-crop-tab-origin_Default | Design | -글자색.01: 안내 문구 회색(#6C757D) | - |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## MKT-011_market-crop-tab-grade_Default — 등급·규격 탭 · 기본 상태

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-02170 | 등급·규격 탭 | MKT-011_market-crop-tab-grade_Default | Visible | -구성.01: "등급 비교/품종 비교" 세그먼트 토글 | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market/$crop<br>File: src/components/market/MarketGradeSpecView.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-02171 | 등급·규격 탭 | MKT-011_market-crop-tab-grade_Default | Visible | -표시.01: 등급 비교 화면 — 등급별 평균 시세 3열(특/상/중), 규격별 비교 3열(10kg망/8kg/원단위) | - |
| DS-02172 | 등급·규격 탭 | MKT-011_market-crop-tab-grade_Default | Visible | -표시.02: 품종 비교 화면 — 품종별 비교 2열 그리드(배추(일반)/얼갈이배추/봄배추/저장배추) | - |
| DS-02173 | 등급·규격 탭 | MKT-011_market-crop-tab-grade_Default | Visible | -문구.01: 안내 문구 "같은 등급과 유사 규격 기준으로 비교됩니다. 일부 품종은 표본 수가 적어 변동률이 크게 보일 수 있습니다." | - |
| DS-02174 | 등급·규격 탭 | MKT-011_market-crop-tab-grade_Default | Invisible | -미구현.01: 본 컴포넌트는 어떤 라우트에서도 사용되지 않아 실제 화면에 표시되지 않는다 | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market/$crop<br>File: src/components/market/MarketGradeSpecView.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-02175 | 등급·규격 탭 | MKT-011_market-crop-tab-grade_Default | Invisible | -미구현.02: 등급·규격·품종 비교 데이터가 컴포넌트 내부 고정값이다 | - |
| DS-02176 | 등급·규격 탭 | MKT-011_market-crop-tab-grade_Default | Design | -상태색.01: 상승 빨간색(#E03131), 하락 파란색(#1971C2), 보합 회색(#6C757D) | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market/$crop<br>File: src/components/market/MarketGradeSpecView.tsx<br>기술근거.01: PriceBadge, DataSourceNotice 컴포넌트로 구현됨(상위 탭 컨테이너 미배선으로 실화면 미노출)<br>Baseline: 2026-08-05 코드 기준 |
| DS-02177 | 등급·규격 탭 | MKT-011_market-crop-tab-grade_Default | Design | -배경색.01: 카드 배경 흰색(#FFFFFF) | - |
| DS-02178 | 등급·규격 탭 | MKT-011_market-crop-tab-grade_Default | Design | -테두리.01: 카드 테두리 1px 옅은 회색(#E9ECEF) | - |
| DS-02179 | 등급·규격 탭 | MKT-011_market-crop-tab-grade_Default | Design | -글자색.01: 안내 문구 회색(#6C757D) | - |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## MKT-012_market-sheet-date_Default — 조회 날짜 선택 시트 · 기본 상태

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-02180 | 조회 날짜 선택 시트 | MKT-012_market-sheet-date_Default | Visible | -구성.01: 바텀시트 헤더 "날짜 선택"과 닫기(X) 버튼 | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market<br>File: src/components/date-picker-sheet.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-02181 | 조회 날짜 선택 시트 | MKT-012_market-sheet-date_Default | Visible | -구성.02: "오늘" 바로가기 링크, 달력, 하단 "완료" 버튼 | - |
| DS-02182 | 조회 날짜 선택 시트 | MKT-012_market-sheet-date_Default | Visible | -표시.01: 달력 상단 캡션 "{연}년 {월}월", 요일 헤더 "일/월/화/수/목/금/토"(일요일은 빨간색으로 강조) | - |
| DS-02183 | 조회 날짜 선택 시트 | MKT-012_market-sheet-date_Default | Invisible | -조건.01: 시세 조회 메인 화면의 "조회 날짜" 카드를 누르면 열린다 | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market<br>File: src/components/date-picker-sheet.tsx<br>기술근거.01: src/components/market-v2/MarketFilterBar.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-02184 | 조회 날짜 선택 시트 | MKT-012_market-sheet-date_Default | Invisible | -액션.01: "완료"를 누르면 선택한 날짜와 표시 라벨이 조회 조건에 반영되고 시트가 닫힌다 | - |
| DS-02185 | 조회 날짜 선택 시트 | MKT-012_market-sheet-date_Default | Invisible | -액션.02: "오늘"을 누르면 달력이 오늘 날짜로 이동하고 임시 선택값이 오늘로 바뀌며, 완료 버튼을 눌러야 실제로 반영된다 | - |
| DS-02186 | 조회 날짜 선택 시트 | MKT-012_market-sheet-date_Default | Invisible | -자동동작.01: 일요일만 휴장일로 간주해 선택을 막는 mock 규칙이 적용된다 | - |
| DS-02187 | 조회 날짜 선택 시트 | MKT-012_market-sheet-date_Default | Invisible | -검증.01: 오늘 이후의 미래 날짜와 데이터가 없는 날짜(휴장일)는 선택할 수 없도록 비활성화된다 | - |
| DS-02188 | 조회 날짜 선택 시트 | MKT-012_market-sheet-date_Default | Design | -배경색.01: 시트 배경 흰색(#FFFFFF) | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market<br>File: src/components/date-picker-sheet.tsx<br>기술근거.01: Sheet/SheetContent(side="bottom"), Calendar(react-day-picker 래퍼)<br>Baseline: 2026-08-05 코드 기준 |
| DS-02189 | 조회 날짜 선택 시트 | MKT-012_market-sheet-date_Default | Design | -모서리.01: 시트 상단 모서리 반경 16px | - |
| DS-02190 | 조회 날짜 선택 시트 | MKT-012_market-sheet-date_Default | Design | -글자색.01: 일요일 요일 헤더 빨간색(#E03131) | - |
| DS-02191 | 조회 날짜 선택 시트 | MKT-012_market-sheet-date_Default | Design | -글자색.02: 평일 텍스트 진회색(#212529) | - |
| DS-02192 | 조회 날짜 선택 시트 | MKT-012_market-sheet-date_Default | Design | -배경색.02: 완료 버튼 배경 진초록색(#3A8A3A), 글자 흰색 | - |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## MKT-013_market-sheet-market_Default — 도매시장 선택 시트 · 기본 상태

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-02193 | 도매시장 선택 시트 | MKT-013_market-sheet-market_Default | Visible | -구성.01: 바텀시트 헤더 "도매시장 선택" | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market<br>File: src/components/market-v2/MarketSheet.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-02194 | 도매시장 선택 시트 | MKT-013_market-sheet-market_Default | Visible | -버튼.01: "가장 가까운 도매시장 찾기" 버튼 | - |
| DS-02195 | 도매시장 선택 시트 | MKT-013_market-sheet-market_Default | Visible | -목록항목.01: 옵션 리스트("전체" + 전체 도매시장), 선택된 항목 우측에 체크 아이콘 표시 | - |
| DS-02196 | 도매시장 선택 시트 | MKT-013_market-sheet-market_Default | Invisible | -데이터소스.01: 도매시장 목록을 mock 데이터에서 조회한다 | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market<br>File: src/components/market-v2/MarketSheet.tsx<br>기술근거.01: src/store/market.ts<br>Baseline: 2026-08-05 코드 기준 |
| DS-02197 | 도매시장 선택 시트 | MKT-013_market-sheet-market_Default | Invisible | -조건.01: 시세 조회 메인 화면의 "도매시장" 카드를 누르면 열린다 | - |
| DS-02198 | 도매시장 선택 시트 | MKT-013_market-sheet-market_Default | Invisible | -액션.01: 옵션을 누르면 조회 조건의 도매시장이 변경되며, 도매법인 조건은 "전체"로 초기화된다 | - |
| DS-02199 | 도매시장 선택 시트 | MKT-013_market-sheet-market_Default | Invisible | -미구현.01: "가장 가까운 도매시장 찾기" 버튼은 "위치 권한을 확인 중이에요 (준비 중)" 안내만 띄우고 실제 위치 조회는 되지 않는다 | - |
| DS-02200 | 도매시장 선택 시트 | MKT-013_market-sheet-market_Default | Design | -배경색.01: 시트 배경 흰색(#FFFFFF) | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market<br>File: src/components/market-v2/MarketSheet.tsx<br>기술근거.01: Sheet/SheetContent(side="bottom")<br>Baseline: 2026-08-05 코드 기준 |
| DS-02201 | 도매시장 선택 시트 | MKT-013_market-sheet-market_Default | Design | -모서리.01: 시트 상단 모서리 반경 16px | - |
| DS-02202 | 도매시장 선택 시트 | MKT-013_market-sheet-market_Default | Design | -테두리.01: "가장 가까운 도매시장 찾기" 버튼 테두리 1.5px 진초록색(#3A8A3A), 배경 연한 초록색 | - |
| DS-02203 | 도매시장 선택 시트 | MKT-013_market-sheet-market_Default | Design | -상태색.01: 선택 항목 체크 배지 배경 진초록색(#3A8A3A), 글자 흰색 | - |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## MKT-014_market-sheet-corporation_Default — 도매법인 선택 시트 · 기본 상태

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-02204 | 도매법인 선택 시트 | MKT-014_market-sheet-corporation_Default | Visible | -구성.01: 바텀시트 헤더 "법인 선택"과 "{도매시장명} 소속" 안내 문구 | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market<br>File: src/components/market-v2/CorporationSheet.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-02205 | 도매법인 선택 시트 | MKT-014_market-sheet-corporation_Default | Visible | -목록항목.01: 법인 리스트, 선택된 법인은 배경이 강조되고 우측에 체크 아이콘이 표시된다 | - |
| DS-02206 | 도매법인 선택 시트 | MKT-014_market-sheet-corporation_Default | Invisible | -데이터소스.01: 선택된 도매시장 소속 법인 목록을 mock 데이터에서 조회하며, 등록되지 않은 시장은 "전체" 한 항목만 제공한다 | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market<br>File: src/components/market-v2/CorporationSheet.tsx<br>기술근거.01: src/lib/mock/corporations.ts(getCorporations), src/store/market.ts<br>Baseline: 2026-08-05 코드 기준 |
| DS-02207 | 도매법인 선택 시트 | MKT-014_market-sheet-corporation_Default | Invisible | -조건.01: 시세 조회 메인 화면의 "도매법인" 카드를 누르면 열린다 | - |
| DS-02208 | 도매법인 선택 시트 | MKT-014_market-sheet-corporation_Default | Invisible | -액션.01: 옵션을 누르면 조회 조건의 도매법인이 변경되고 시트가 닫힌다 | - |
| DS-02209 | 도매법인 선택 시트 | MKT-014_market-sheet-corporation_Default | Design | -배경색.01: 시트 배경 흰색(#FFFFFF) | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market<br>File: src/components/market-v2/CorporationSheet.tsx<br>기술근거.01: Sheet/SheetContent/SheetHeader/SheetTitle<br>Baseline: 2026-08-05 코드 기준 |
| DS-02210 | 도매법인 선택 시트 | MKT-014_market-sheet-corporation_Default | Design | -배경색.02: 선택 항목 강조 배경 연한 초록색(#F0F9F0), 글자 진초록색(#1F5C1F) | - |
| DS-02211 | 도매법인 선택 시트 | MKT-014_market-sheet-corporation_Default | Design | -모서리.01: 시트 상단 모서리 반경 16px, 옵션 항목 모서리 반경 10px | - |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## AUC-001_market-auction-id_Default — 경매 상세 · 기본 상태

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-02212 | 경매 상세 | AUC-001_market-auction-id_Default | Visible | -구성.01: 헤더 타이틀 "경매 상세 결과"와 뒤로가기 버튼 | Registry: docs/ds/screen-registry.json<br>Route: /market/auction/$id<br>File: src/routes/market.auction.$id.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-02213 | 경매 상세 | AUC-001_market-auction-id_Default | Visible | -표시.01: 상세 정보 리스트 "경매시간/분류/품목/품종/규격/경락가(강조)/kg당 환산/수량/도매시장/도매법인/출하지" | - |
| DS-02214 | 경매 상세 | AUC-001_market-auction-id_Default | Invisible | -데이터소스.01: 경매 상세 레코드는 현재 조회 조건(부류·품목·품종·시장 라벨)과 결합해 결정론적으로 생성한다 | Registry: docs/ds/screen-registry.json<br>Route: /market/auction/$id<br>File: src/routes/market.auction.$id.tsx<br>기술근거.01: src/lib/mock/auctions.ts(getAuctionById), src/store/market.ts<br>Baseline: 2026-08-05 코드 기준 |
| DS-02215 | 경매 상세 | AUC-001_market-auction-id_Default | Invisible | -분기.01: 조회 결과가 없으면 경매 상세(결과 없음) 상태로 전환한다 | - |
| DS-02216 | 경매 상세 | AUC-001_market-auction-id_Default | Design | -배경색.01: 페이지 배경 흰색(#FFFFFF), 상세 정보 카드 배경 흰색(#FFFFFF) | Registry: docs/ds/screen-registry.json<br>Route: /market/auction/$id<br>File: src/routes/market.auction.$id.tsx<br>기술근거.01: AppShell(내부 문자열 screenId="MKT-007_경매상세" — 본 DS 문서의 Screen ID 체계와 별개), DetailHeader<br>Baseline: 2026-08-05 코드 기준 |
| DS-02217 | 경매 상세 | AUC-001_market-auction-id_Default | Design | -테두리.01: 상세 정보 카드 테두리 1px 옅은 회색(#E9ECEF), 모서리 반경 12px | - |
| DS-02218 | 경매 상세 | AUC-001_market-auction-id_Default | Design | -글자색.01: 경락가 강조 텍스트 빨간색(#E03131), 15px/700 | - |
| DS-02219 | 경매 상세 | AUC-001_market-auction-id_Default | Design | -글자색.02: 본문 텍스트 진회색(foreground), 라벨 텍스트 회색(#868E96) | - |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## AUC-001_market-auction-id_Empty — 경매 상세 · 빈 상태

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-02220 | 경매 상세(결과 없음) | AUC-001_market-auction-id_Empty | Visible | -빈상태.01: 안내 문구 "경매 정보를 찾을 수 없어요."와 링크 "시세 화면으로 돌아가기" | Registry: docs/ds/screen-registry.json<br>Route: /market/auction/$id<br>File: src/routes/market.auction.$id.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-02221 | 경매 상세(결과 없음) | AUC-001_market-auction-id_Empty | Invisible | -조건.01: 경매 상세 레코드를 만들 수 없을 때 이 상태로 진입한다 | Registry: docs/ds/screen-registry.json<br>Route: /market/auction/$id<br>File: src/routes/market.auction.$id.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-02222 | 경매 상세(결과 없음) | AUC-001_market-auction-id_Empty | Invisible | -분기.01: 화면 상태값을 "빈 상태"로 설정한다 | - |
| DS-02223 | 경매 상세(결과 없음) | AUC-001_market-auction-id_Empty | Invisible | -이동.01: "시세 화면으로 돌아가기"를 누르면 시세 조회 메인으로 이동한다 | - |
| DS-02224 | 경매 상세(결과 없음) | AUC-001_market-auction-id_Empty | Design | -배경색.01: 페이지 배경 흰색(#FFFFFF) | Registry: docs/ds/screen-registry.json<br>Route: /market/auction/$id<br>File: src/routes/market.auction.$id.tsx<br>기술근거.01: AppShell(screenState="Empty"), DetailHeader<br>Baseline: 2026-08-05 코드 기준 |
| DS-02225 | 경매 상세(결과 없음) | AUC-001_market-auction-id_Empty | Design | -글자색.01: 빈 상태 안내 문구 회색(#6C757D) | - |
| DS-02226 | 경매 상세(결과 없음) | AUC-001_market-auction-id_Empty | Design | -글자색.02: 링크 텍스트 진초록색(#3A8A3A), 밑줄 표기 | - |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## CMP-001_market-compare_Default — 시장 비교 · 기본 상태

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-02227 | 시장 비교 | CMP-001_market-compare_Default | Visible | -구성.01: 헤더 타이틀 "시장별 가격 비교" | Registry: docs/ds/screen-registry.json<br>Route: /market-compare<br>File: src/routes/market-compare.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-02228 | 시장 비교 | CMP-001_market-compare_Default | Visible | -구성.02: 작물 선택 카드와 조회 날짜 선택 카드(각각 라벨과 값을 표시) | - |
| DS-02229 | 시장 비교 | CMP-001_market-compare_Default | Visible | -문구.01: 안내 문구 "kg당 평균가 · 경매일 기준 · 전체 시장" | - |
| DS-02230 | 시장 비교 | CMP-001_market-compare_Default | Visible | -빈상태.01: 작물 미선택 시 안내 카드 문구 "비교할 작물을 선택하세요" / "위 카드를 눌러 부류·품목·품종을 선택하면 시장별 가격을 비교할 수 있어요." | - |
| DS-02231 | 시장 비교 | CMP-001_market-compare_Default | Visible | -표시.01: 작물 선택 시 "가장 비쌈/가장 저렴" 하이라이트 카드 2종(시장명·지역·가격·전일대비 등락률 표시) | - |
| DS-02232 | 시장 비교 | CMP-001_market-compare_Default | Visible | -목록항목.01: 시장별 순위 리스트(막대그래프 포함), 1위 항목에 "최고가" 배지와 빨간 강조 테두리 적용 | - |
| DS-02233 | 시장 비교 | CMP-001_market-compare_Default | Visible | -버튼.01: "상세 시세 보기" 버튼 | - |
| DS-02234 | 시장 비교 | CMP-001_market-compare_Default | Invisible | -데이터소스.01: 작물 선택값은 작물 선택 저장소의 확정값에서, 시장별 kg당 평균가는 mock 데이터에서 조회한다 | Registry: docs/ds/screen-registry.json<br>Route: /market-compare<br>File: src/routes/market-compare.tsx<br>기술근거.01: src/store/cropSelection.ts, src/lib/catalog-service.ts, src/lib/mock/variety-market-averages.ts<br>Baseline: 2026-08-05 코드 기준 |
| DS-02235 | 시장 비교 | CMP-001_market-compare_Default | Invisible | -조건.01: 품종이 선택돼야 데이터가 계산되며, 선택 전에는 안내 카드만 표시한다 | - |
| DS-02236 | 시장 비교 | CMP-001_market-compare_Default | Invisible | -정렬.01: 시장 순위는 kg당 평균가 높은 순으로 정렬한다 | - |
| DS-02237 | 시장 비교 | CMP-001_market-compare_Default | Invisible | -이동.01: 작물 선택 카드를 누르면 작물 선택 화면으로 이동한다(공통 문서 SEL-001 대상) | - |
| DS-02238 | 시장 비교 | CMP-001_market-compare_Default | Invisible | -이동.02: "상세 시세 보기"를 누르면 통계 품종 상세 화면으로 이동한다 | - |
| DS-02239 | 시장 비교 | CMP-001_market-compare_Default | Invisible | -초기값.01: 조회 날짜 초기값은 "2025-07-05"이며 조회 날짜 선택 시트로 변경할 수 있다 | - |
| DS-02240 | 시장 비교 | CMP-001_market-compare_Default | Design | -배경색.01: 페이지 배경 흰색(#FFFFFF), 카드 배경 흰색(#FFFFFF) | Registry: docs/ds/screen-registry.json<br>Route: /market-compare<br>File: src/routes/market-compare.tsx<br>기술근거.01: AppShell(screenId="MKT-008_시장비교"), FullSelectCard(src/components/common/ConditionSelectCard.tsx), DatePickerSheet<br>Baseline: 2026-08-05 코드 기준 |
| DS-02241 | 시장 비교 | CMP-001_market-compare_Default | Design | -테두리.01: 카드 테두리 1px 옅은 회색(#E9ECEF) | - |
| DS-02242 | 시장 비교 | CMP-001_market-compare_Default | Design | -테두리.02: 1위 항목 강조 테두리 2px 빨간색(#E03131), 배경 연한 빨간색(#FFF5F5) | - |
| DS-02243 | 시장 비교 | CMP-001_market-compare_Default | Design | -배경색.02: 가장 비쌈 카드 배경 연한 빨간색(#FFF5F5)·테두리(#FFC9C9), 가장 저렴 카드 배경 연한 파란색(#F0F6FF)·테두리(#C5DAFB) | - |
| DS-02244 | 시장 비교 | CMP-001_market-compare_Default | Design | -모서리.01: 카드 모서리 반경 12~14px | - |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## CMP-002_compare_Default — 가격 비교 · 기본 상태

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-02245 | 가격 비교 | CMP-002_compare_Default | Visible | -구성.01: 헤더 타이틀 "시장별 가격 비교" | Registry: docs/ds/screen-registry.json<br>Route: /compare<br>File: src/routes/compare.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-02246 | 가격 비교 | CMP-002_compare_Default | Visible | -구성.02: 작물 선택 드롭다운 | - |
| DS-02247 | 가격 비교 | CMP-002_compare_Default | Visible | -표시.01: "가장 저렴/가장 비쌈" 하이라이트 2셀 | - |
| DS-02248 | 가격 비교 | CMP-002_compare_Default | Visible | -문구.01: 소제목 "시장별 순위" | - |
| DS-02249 | 가격 비교 | CMP-002_compare_Default | Visible | -목록항목.01: 시장별 순위 리스트(막대그래프 포함) | - |
| DS-02250 | 가격 비교 | CMP-002_compare_Default | Visible | -문구.02: 하단 링크 "{작물명} 상세 시세 보기 →" | - |
| DS-02251 | 가격 비교 | CMP-002_compare_Default | Invisible | -데이터소스.01: 작물 목록과 도매시장 목록을 mock 데이터에서 조회한다 | Registry: docs/ds/screen-registry.json<br>Route: /compare<br>File: src/routes/compare.tsx<br>기술근거.01: src/lib/mock/crops.ts(CROPS), src/lib/mock/markets.ts(MARKETS)<br>Baseline: 2026-08-05 코드 기준 |
| DS-02252 | 가격 비교 | CMP-002_compare_Default | Invisible | -계산식.01: 시장별 가격은 작물 현재가에 시장 식별자 기반 결정론적 배수를 곱해 산출한다(실거래 연동 아님) | - |
| DS-02253 | 가격 비교 | CMP-002_compare_Default | Invisible | -정렬.01: 시장 순위는 가격 낮은 순으로 정렬하며 최저가·최고가를 하이라이트한다 | - |
| DS-02254 | 가격 비교 | CMP-002_compare_Default | Invisible | -초기값.01: 초기 선택 작물은 작물 목록의 첫 번째 항목이다 | - |
| DS-02255 | 가격 비교 | CMP-002_compare_Default | Invisible | -이동.01: 하단 링크를 누르면 해당 작물의 시세 상세 화면으로 이동한다 | - |
| DS-02256 | 가격 비교 | CMP-002_compare_Default | Design | -배경색.01: 페이지 배경 흰색(#FFFFFF) | Registry: docs/ds/screen-registry.json<br>Route: /compare<br>File: src/routes/compare.tsx<br>기술근거.01: AppShell(screenId="MKT-009_시장별가격비교"), PriceBadge<br>기술근거.02: 색상 토큰 src/styles.css --price-up-bg/--price-up, --price-down-bg/--price-down<br>Baseline: 2026-08-05 코드 기준 |
| DS-02257 | 가격 비교 | CMP-002_compare_Default | Design | -상태색.01: 상승(가장 비쌈) 빨간색 계열, 하락(가장 저렴) 파란색 계열 | - |
| DS-02258 | 가격 비교 | CMP-002_compare_Default | Design | -모서리.01: 카드·목록 모서리 반경 10px | - |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## GRD-001_grades_Default — 등급 정보 · 기본 상태

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-02259 | 등급 정보 | GRD-001_grades_Default | Visible | -구성.01: 헤더 타이틀 "등급별 가격 정보"와 뒤로가기 버튼 | Registry: docs/ds/screen-registry.json<br>Route: /grades<br>File: src/routes/grades.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-02260 | 등급 정보 | GRD-001_grades_Default | Visible | -문구.01: 안내 배너 "KAMIS 기준 상·중·하 3등급 시세입니다. 등급 구분이 가능한 품목만 표시됩니다." | - |
| DS-02261 | 등급 정보 | GRD-001_grades_Default | Visible | -목록항목.01: 등급 보유 작물 리스트, 각 항목에 작물 아이콘·이름·갱신시각과 상/중/하 막대그래프·가격 표시 | - |
| DS-02262 | 등급 정보 | GRD-001_grades_Default | Invisible | -데이터소스.01: 작물 목록을 mock 데이터에서 조회한다 | Registry: docs/ds/screen-registry.json<br>Route: /grades<br>File: src/routes/grades.tsx<br>기술근거.01: src/lib/mock/crops.ts(CROPS)<br>Baseline: 2026-08-05 코드 기준 |
| DS-02263 | 등급 정보 | GRD-001_grades_Default | Invisible | -조건.01: 등급 데이터가 있는 작물만 자동으로 필터링해 표시하며 별도의 필터 조작 UI는 없다 | - |
| DS-02264 | 등급 정보 | GRD-001_grades_Default | Invisible | -계산식.01: 막대 폭은 상·중·하 값 중 최댓값 대비 비율(%)로 계산한다 | - |
| DS-02265 | 등급 정보 | GRD-001_grades_Default | Design | -배경색.01: 페이지 배경 흰색(#FFFFFF) | Registry: docs/ds/screen-registry.json<br>Route: /grades<br>File: src/routes/grades.tsx<br>기술근거.01: AppShell(screenId="MKT-010_등급별가격"), DetailHeader, CropIcon<br>Baseline: 2026-08-05 코드 기준 |
| DS-02266 | 등급 정보 | GRD-001_grades_Default | Design | -배경색.02: 안내 배너 배경 연한 초록색(accent), 작물 카드 배경 옅은 회색(surface) | - |
| DS-02267 | 등급 정보 | GRD-001_grades_Default | Design | -글자색.01: 본문 텍스트 진회색(foreground) | - |
| DS-02268 | 등급 정보 | GRD-001_grades_Default | Design | -모서리.01: 안내 배너·작물 카드 모서리 반경 10px | - |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## PRC-001_price-id_Default — 품종 상세 · 기본 상태

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-02269 | 품종 상세 | PRC-001_price-id_Default | Visible | -구성.01: 헤더 타이틀 "시세 상세"와 뒤로가기 버튼, 우측 즐겨찾기(별)·가격 알림(종) 버튼 | Registry: docs/ds/screen-registry.json<br>Route: /price/$variety<br>File: src/routes/price.$variety.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-02270 | 품종 상세 | PRC-001_price-id_Default | Visible | -표시.01: 이모지+품종명 타이틀, 품목·부류 배지, 예측 지원 품종에 한해 "AI 가격 예측 가능" 배지 | - |
| DS-02271 | 품종 상세 | PRC-001_price-id_Default | Visible | -표시.02: 현재가, 단위, kg당 환산가, 등락률(전일대비) | - |
| DS-02272 | 품종 상세 | PRC-001_price-id_Default | Visible | -표시.03: 예측 지원 품종은 "AI 가격 예측 보기" 버튼이 함께 표시된다 | - |
| DS-02273 | 품종 상세 | PRC-001_price-id_Default | Visible | -구성.02: 탭 6종 "차트/경매내역/시장비교/법인/산지/품종" | - |
| DS-02274 | 품종 상세 | PRC-001_price-id_Default | Visible | -구성.03: 차트 탭 — 기간 필터 5종(오늘/1주/1개월/3개월/1년), 가격추이 차트, 범례, 최고/최저/평균가 3셀, 전일/전주/전년/거래량 4셀 통계, 안내 문구 | - |
| DS-02275 | 품종 상세 | PRC-001_price-id_Default | Visible | -구성.04: 경매내역 탭 — 요약과 경매 테이블(공통 컴포넌트로 구현) | - |
| DS-02276 | 품종 상세 | PRC-001_price-id_Default | Visible | -표시.04: 시장비교 탭 — 시장별 현재가/전일/거래량/점유율 컬럼 | - |
| DS-02277 | 품종 상세 | PRC-001_price-id_Default | Visible | -표시.05: 법인 탭 — 도매법인별 평균가/전일/거래 건수 컬럼 | - |
| DS-02278 | 품종 상세 | PRC-001_price-id_Default | Visible | -표시.06: 산지 탭 — 출하지별 평균가/건수/비중 컬럼 | - |
| DS-02279 | 품종 상세 | PRC-001_price-id_Default | Visible | -표시.07: 품종 탭 — 품종별 현재가(kg당)/전일/거래량 컬럼, 현재 품종에는 "현재" 배지 표시 | - |
| DS-02280 | 품종 상세 | PRC-001_price-id_Default | Invisible | -데이터소스.01: 시세 요약과 가격·거래량 시계열은 mock 시세 분석 데이터에서 가져온다 | Registry: docs/ds/screen-registry.json<br>Route: /price/$variety<br>File: src/routes/price.$variety.tsx<br>기술근거.01: src/lib/mock/market-analysis.ts, src/lib/mock/variety-detail.ts, src/store/market.ts, src/store/alerts.ts, src/components/market-v2/AuctionHistoryTable.tsx, src/components/market-v2/PriceVolumeChart.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-02281 | 품종 상세 | PRC-001_price-id_Default | Invisible | -데이터소스.02: 법인·시장·산지·품종 비교 데이터는 mock 품종 상세 데이터에서 가져온다 | - |
| DS-02282 | 품종 상세 | PRC-001_price-id_Default | Invisible | -조건.01: 조회 조건(시장·단위 등)은 전역 시세 조건 저장소에서, 알림 존재 여부는 알림 저장소에서, 즐겨찾기 여부는 즐겨찾기 저장소에서 읽는다 | - |
| DS-02283 | 품종 상세 | PRC-001_price-id_Default | Invisible | -분기.01: 예측 가능 여부는 품종의 예측 지원 여부와 예측 상태가 "이용 가능"일 때만 참으로 판정한다 | - |
| DS-02284 | 품종 상세 | PRC-001_price-id_Default | Invisible | -이동.01: 알림 버튼을 누르면 기존 규칙이 있으면 해당 알림 설정 화면으로, 없으면 신규 알림 설정 화면(품종·시장 조건 포함)으로 이동한다 | - |
| DS-02285 | 품종 상세 | PRC-001_price-id_Default | Invisible | -이동.02: AI 예측 배지·버튼을 누르면 AI 시세 예측 화면으로 품종과 진입 출처를 포함해 이동한다 | - |
| DS-02286 | 품종 상세 | PRC-001_price-id_Default | Invisible | -성공.01: 즐겨찾기 토글 시 "즐겨찾기에 추가했어요" 또는 "즐겨찾기에서 삭제했어요" 토스트를 표시한다 | - |
| DS-02287 | 품종 상세 | PRC-001_price-id_Default | Invisible | -미구현.01: 모든 시세·비교 데이터가 mock 데이터이며 실제 서버 API와 연동되어 있지 않다 | - |
| DS-02288 | 품종 상세 | PRC-001_price-id_Default | Design | -너비.01: 화면 콘텐츠 최대 너비 430px, 좌우 중앙 정렬 | Registry: docs/ds/screen-registry.json<br>Route: /price/$variety<br>File: src/routes/price.$variety.tsx<br>기술근거.01: AppShell(screenId="MKT-011_품종시세상세"), DetailHeader<br>기술근거.02: 색상 토큰 src/styles.css --background(#ffffff), --foreground(#212529), --border(#e9ecef), --primary(#3a8a3a), --price-up(#e03131), --price-down(#1971c2)<br>Baseline: 2026-08-05 코드 기준 |
| DS-02289 | 품종 상세 | PRC-001_price-id_Default | Design | -배경색.01: 페이지 배경 흰색(#FFFFFF), 카드 배경 흰색(#FFFFFF) | - |
| DS-02290 | 품종 상세 | PRC-001_price-id_Default | Design | -테두리.01: 카드·구분선 테두리 1px 옅은 회색(#E9ECEF) | - |
| DS-02291 | 품종 상세 | PRC-001_price-id_Default | Design | -모서리.01: 카드 모서리 반경 12px | - |
| DS-02292 | 품종 상세 | PRC-001_price-id_Default | Design | -글자색.01: 본문 기본 글자색 진회색(#212529), 보조 설명 회색(#6C757D), 약한 보조 회색(#868E96) | - |
| DS-02293 | 품종 상세 | PRC-001_price-id_Default | Design | -상태색.01: 상승 표기 빨간색(#E03131), 하락 표기 파란색(#1971C2), 보합 표기 회색(#868E96) | - |
| DS-02294 | 품종 상세 | PRC-001_price-id_Default | Design | -상태색.02: 선택된 기간 필터 배경 진초록색(#1F5C1F)·글자 흰색, 비선택 배경 옅은 회색(#F1F3F5)·글자 회색(#6C757D) | - |
| DS-02295 | 품종 상세 | PRC-001_price-id_Default | Design | -글자크기.01: 품종명 19px/900, 현재가 32px/900, 보조 텍스트 12px, 표 본문 12px | - |
| DS-02296 | 품종 상세 | PRC-001_price-id_Default | Design | -아이콘크기.01: 헤더 아이콘 20px × 20px, 색상 회색(#868E96), 알림 켜짐 상태 진초록색(#3A8A3A) | - |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## PRC-002_price-id-alert_Default — 알림 설정 · 기본 상태

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-02297 | 알림 설정 | PRC-002_price-id-alert_Default | Visible | -구성.01: 헤더 타이틀 "가격 알림 설정"과 뒤로가기 버튼 | Registry: docs/ds/screen-registry.json<br>Route: /price/$variety/alert<br>File: src/routes/price.$variety.alert.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-02298 | 알림 설정 | PRC-002_price-id-alert_Default | Visible | -표시.01: 조건 요약 카드(품목·품종, 시장·단위, 현재가) | - |
| DS-02299 | 알림 설정 | PRC-002_price-id-alert_Default | Visible | -구성.02: "목표가 알림" 섹션(목표가 이상/이하 숫자 입력) | - |
| DS-02300 | 알림 설정 | PRC-002_price-id-alert_Default | Visible | -구성.03: "등락률 알림" 섹션(5% 이상 상승/하락 토글) | - |
| DS-02301 | 알림 설정 | PRC-002_price-id-alert_Default | Visible | -구성.04: "거래량 알림" 섹션(전일 대비 거래량 30% 이상 증가 토글) | - |
| DS-02302 | 알림 설정 | PRC-002_price-id-alert_Default | Visible | -입력.01: 숫자 입력 자리표시자 "원 이상이면 알림" / "원 이하이면 알림", 단위 "원" | - |
| DS-02303 | 알림 설정 | PRC-002_price-id-alert_Default | Visible | -버튼.01: 하단 고정 "취소"·"저장" 버튼 | - |
| DS-02304 | 알림 설정 | PRC-002_price-id-alert_Default | Invisible | -데이터소스.01: 조건 요약의 현재가는 mock 시세 데이터에서 조회한다 | Registry: docs/ds/screen-registry.json<br>Route: /price/$variety/alert<br>File: src/routes/price.$variety.alert.tsx<br>기술근거.01: src/store/alerts.ts(useAlerts.getFor/setFor), src/store/market.ts<br>⚠️ 확인 필요.01: 알림 저장소에는 신규 스키마(목표가 이상/이하, 등락률 상승/하락, 거래량 급증을 각각 독립적으로 관리하는 규칙)가 별도로 존재하나 본 화면은 구형 스키마만 사용 중이므로 신규 스키마로 전환할 계획인지 확인 필요<br>Baseline: 2026-08-05 코드 기준 |
| DS-02305 | 알림 설정 | PRC-002_price-id-alert_Default | Invisible | -조건.01: 등락률·거래량 알림 상태는 알림 저장소의 레거시 스키마(목표가/등락률/경매시작 플래그)에서 조회한다 | - |
| DS-02306 | 알림 설정 | PRC-002_price-id-alert_Default | Invisible | -저장.01: 저장 버튼을 누르면 "가격 알림이 설정되었습니다." 토스트가 뜬 뒤 이전 화면으로 돌아간다 | - |
| DS-02307 | 알림 설정 | PRC-002_price-id-alert_Default | Invisible | -미구현.01: 목표가 이상/이하 입력값은 입력해도 상태에 저장되지 않으며 저장 시에도 반영되지 않는다 | - |
| DS-02308 | 알림 설정 | PRC-002_price-id-alert_Default | Invisible | -미구현.02: "5% 이상 상승"과 "5% 이상 하락" 토글이 동일한 값을 공유해 항상 같은 상태로 함께 바뀌며 독립적으로 켜고 끌 수 없다 | - |
| DS-02309 | 알림 설정 | PRC-002_price-id-alert_Default | Invisible | -미구현.03: "거래량 알림" 토글이 명칭과 다르게 목표가 플래그에 연결되어 있어 실제로는 목표가 알림 여부를 저장한다 | - |
| DS-02310 | 알림 설정 | PRC-002_price-id-alert_Default | Design | -너비.01: 콘텐츠 최대 너비 430px, 하단 고정 바는 화면 하단에서 60px 위에 배치 | Registry: docs/ds/screen-registry.json<br>Route: /price/$variety/alert<br>File: src/routes/price.$variety.alert.tsx<br>기술근거.01: AppShell(screenId="MKT-012_품종가격알림"), DetailHeader, Switch<br>Baseline: 2026-08-05 코드 기준 |
| DS-02311 | 알림 설정 | PRC-002_price-id-alert_Default | Design | -배경색.01: 조건 카드·입력 카드 배경 흰색(#FFFFFF), 페이지 배경 흰색(#FFFFFF) | - |
| DS-02312 | 알림 설정 | PRC-002_price-id-alert_Default | Design | -테두리.01: 카드 테두리 1px 옅은 회색(#E9ECEF), 행 구분선 1px 옅은 회색(#F1F3F5) | - |
| DS-02313 | 알림 설정 | PRC-002_price-id-alert_Default | Design | -모서리.01: 카드 모서리 반경 12px, 버튼 모서리 반경 10px | - |
| DS-02314 | 알림 설정 | PRC-002_price-id-alert_Default | Design | -내부여백.01: 카드 내부 여백 16px, 입력 행 내부 여백 상하 14px·좌우 16px | - |
| DS-02315 | 알림 설정 | PRC-002_price-id-alert_Default | Design | -외부여백.01: 카드 좌우 여백 16px, 상단 여백 16~20px | - |
| DS-02316 | 알림 설정 | PRC-002_price-id-alert_Default | Design | -간격.01: 하단 취소·저장 버튼 사이 간격 8px | - |
| DS-02317 | 알림 설정 | PRC-002_price-id-alert_Default | Design | -글자크기.01: 섹션 제목 13.5px/700, 입력 라벨 13px, 입력 값 13.5px, 버튼 14px/700 | - |
| DS-02318 | 알림 설정 | PRC-002_price-id-alert_Default | Design | -글자색.01: 기본 글자색 진회색(#212529), 입력 라벨 회색(#495057), 단위 표기 옅은 회색(#868E96), 입력 자리표시자 옅은 회색(#ADB5BD) | - |
| DS-02319 | 알림 설정 | PRC-002_price-id-alert_Default | Design | -상태색.01: 현재가 강조 글자색 빨간색(#E03131) | - |
| DS-02320 | 알림 설정 | PRC-002_price-id-alert_Default | Design | -상태색.02: 저장 버튼 배경 진초록색(#3A8A3A)·글자 흰색, 눌림 상태 배경 진한 초록색(#2F6F2F) | - |
| DS-02321 | 알림 설정 | PRC-002_price-id-alert_Default | Design | -상태색.03: 취소 버튼 배경 흰색·테두리 1px 진초록색(#3A8A3A)·글자 진초록색, 눌림 상태 배경 연한 초록색(#F0F9F0) | - |
| DS-02322 | 알림 설정 | PRC-002_price-id-alert_Default | Design | -상태색.04: 스위치 켜짐 배경 진초록색(#3A8A3A) | - |

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
- src/components/market/MarketChartView.tsx
- src/components/market/MarketAuctionView.tsx
- src/components/market/MarketCompareView.tsx
- src/components/market/MarketOriginView.tsx
- src/components/market/MarketGradeSpecView.tsx
- src/components/date-picker-sheet.tsx
- src/components/market-v2/MarketSearchBar.tsx
- src/components/market-v2/MarketFilterBar.tsx
- src/components/market-v2/ProPriceHeadlineCard.tsx
- src/components/market-v2/ProAnalysisSection.tsx
- src/components/market-v2/MarketSheet.tsx
- src/components/market-v2/CorporationSheet.tsx
- src/components/market-v2/VarietyRow.tsx
- src/components/market-v2/AuctionHistoryTable.tsx
- src/components/market-v2/PriceVolumeChart.tsx
- src/store/market.ts
- src/store/alerts.ts
- src/store/cropSelection.ts
- src/store/ui.ts
- src/features/favorites/favoriteStore.ts
- src/lib/mock/crops.ts
- src/lib/mock/items.ts
- src/lib/mock/markets.ts
- src/lib/mock/corporations.ts
- src/lib/mock/auctions.ts
- src/lib/mock/market-analysis.ts
- src/lib/mock/variety-detail.ts
- src/lib/mock/variety-market-averages.ts
- src/styles.css

## 미구현·확인필요 요약

- MKT-007~011(차트/경매내역/시장비교/산지/등급·규격 탭 컴포넌트, src/components/market/*)은 어느 라우트에서도 배선되지 않아 실제 화면에 노출되지 않는다. /market/$crop 또는 /price/$variety 화면과의 연결 계획을 기획 확인 필요(DS-0202, DS-0208~DS-0212).
- /market/$crop(DS-0203)에는 품목 없음 처리가 컴포넌트 내부 분기와 라우트 notFoundComponent 두 곳에 중복 구현되어 있어 어느 조건에서 어느 쪽이 노출되는지 확인 필요.
- /market/wholesale(DS-0206)에서 품목 행을 눌러 상세로 이동할 때 선택한 품목 정보가 다음 화면에 전달되지 않아 상세 화면에서 품목이 자동 선택되지 않는 것이 의도된 동작인지 확인 필요.
- /market/wholesale/$market(DS-0207)의 법인별 가격은 실거래가 아닌 결정론적 mock 오프셋으로 산출된다.
- /market, /market/wholesale의 "가장 가까운 도매시장 찾기" 버튼(DS-0201, DS-0213)은 안내 문구만 표시하고 실제 위치 조회 기능이 없다.
- /price/$variety/alert(DS-0222)는 목표가 입력값이 저장되지 않고, 등락률 상승/하락 토글이 값을 공유하며, 거래량 알림 토글이 실제로는 목표가 플래그에 연결되는 등 저장 로직이 화면 문구와 일치하지 않는다. 알림 저장소에 존재하는 신규 스키마로 전환할 계획인지 확인 필요.
- 시세 조회 메인(DS-0201)의 조회 날짜는 세션 저장 대상에서 제외되어 있어 새로고침 시 항상 오늘 날짜로 초기화된다.
