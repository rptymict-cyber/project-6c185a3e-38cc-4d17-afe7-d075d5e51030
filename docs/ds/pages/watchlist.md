# 즐겨찾기 DS

- Menu ID: watchlist
- Registry: docs/ds/screen-registry.json
- Baseline: 2026-08-04 코드 기준

## FAV-001_watchlist_Default — 즐겨찾기 목록

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0401 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Visible | -정의.01: 사용자가 저장한 시세 조회 조건(작물·품종·시장·법인·산지·등급·단위)을 카드 목록으로 보여준다<br>-구성.01: 상단 AppHeader "즐겨찾기" + 저장 항목이 있을 때만 노출되는 우측 "편집" 버튼<br>-제목.01: 본문 상단 "즐겨찾기" 타이틀과 "총 N개의 저장한 시세 조건" 안내문<br>-검색.01: "품목, 품종, 시장명으로 검색하세요" placeholder의 검색 입력창, 입력 시 X 지우기 버튼 노출<br>-목록항목.01: 카드마다 작물 아이콘·작물명/품종명, 시장명/법인명/산지명/등급, kg 환산가·단위가, 등락률 배지(▲/▼/—), 갱신일 표시<br>-목록항목.02: 검색 중이 아니고 목록이 2개 이상이면 "⋮⋮를 드래그해 순서를 바꿀 수 있어요" 안내문<br>-상태표시.01: 등락률 배지는 상승(빨강)·하락(파랑)·보합(회색, 절대값 0.05% 미만)으로 구분 표시<br>-빈상태.01: 저장된 항목이 하나도 없으면 EmptyState 컴포넌트로 전환(FAV-001_watchlist_Empty 참고)<br>-빈상태.02: 검색 결과가 0건이면 "조건에 맞는 저장된 시세가 없어요" 안내문만 표시<br>-버튼.01: 우측 하단 플로팅 액션 버튼(+ 아이콘)으로 즐겨찾기 추가 화면 이동 | Registry: docs/ds/screen-registry.json<br>Route: /watchlist<br>File: src/routes/watchlist.index.tsx<br>Baseline: 2026-08-04 코드 기준<br>Components: SwipeReorderList, CropIcon, AppHeader |
| DS-0401 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Invisible | -데이터소스.01: useFavoritePriceStore(items)에서 즐겨찾기 항목 목록을 읽는다<br>-데이터소스.02: 로컬 스토리지 storage key agdict:favoritePriceItems 에 영속 저장(zustand persist)<br>-정렬.01: order 값이 있으면 오름차순, 둘 다 없으면 createdAt 내림차순(sortFavorites)<br>-검색조건.01: 입력어를 소문자 변환 후 cropName·varietyName·marketName·corporationName·originName·unit 문자열에 포함되는지로 필터링<br>-자동동작.01: 목록이 0개가 되면 편집 모드를 자동 종료(useEffect)<br>-액션.01: 드래그 정렬 완료 시 setOrder(ids) 호출로 order 필드 갱신, 검색 중에는 순서 변경 비활성화<br>-액션.02: 카드 클릭 시 useMarketFilter 스토어에 품목/시장/법인/단위 조건을 세팅 후 /price/$variety 로 이동<br>-이동.01: 카드 클릭 → /price/$variety(품종 상세)<br>-이동.02: FAB 클릭 → /watchlist/add | Registry: docs/ds/screen-registry.json<br>Route: /watchlist<br>File: src/routes/watchlist.index.tsx<br>Baseline: 2026-08-04 코드 기준<br>Store: src/features/favorites/favoriteStore.ts |
| DS-0401 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Tracking | -이벤트.01: 검색어 입력 시 query 상태 변경, 별도 외부 로깅 없음<br>-미구현.01: 페이지뷰·검색·정렬·이동 등에 대한 애널리틱스 이벤트 전송 코드는 코드베이스에서 확인되지 않음 | Registry: docs/ds/screen-registry.json<br>Route: /watchlist<br>File: src/routes/watchlist.index.tsx<br>Baseline: 2026-08-04 코드 기준<br>⚠️ 확인 필요: 트래킹 이벤트 정의가 없어 실제 로깅 여부 확인 필요 |
| DS-0401 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Design | -배경색.01: 페이지 배경 #FFFFFF(--background)<br>-배경색.02: 검색 입력창 배경 secondary/50 반투명(#F1F3F5 50% 불투명도)<br>-글자색.01: 타이틀 텍스트 #212529(--foreground)<br>-글자색.02: 보조 안내문 텍스트 #6C757D(--muted-foreground)<br>-글자색.03: 상승 배지 텍스트 #E03131(--price-up), 하락 배지 텍스트 #1971C2(--price-down)<br>-글자크기.01: 타이틀 22px/font-black<br>-글자크기.02: 안내문 13px, 검색 입력 13.5px<br>-테두리.01: 검색 입력창 테두리 1px solid #E9ECEF(--input), 모서리 반경 12px(rounded-xl)<br>-테두리.02: 카드 리스트 컨테이너 테두리 1px solid #E9ECEF(--border), 모서리 반경 16px(rounded-2xl)<br>-모서리.01: FAB 버튼 원형(rounded-full)<br>-너비.01: FAB 버튼 56px×56px(h-14 w-14)<br>-외부여백.01: FAB 위치 하단 96px, 우측 20px(bottom-24 right-5)<br>-아이콘크기.01: FAB 내부 아이콘 24px×24px(h-6 w-6)<br>-그림자.01: FAB 박스섀도 shadow-lg 기본값<br>-내부여백.01: 본문 좌우 패딩 16px(px-4)<br>-간격.01: 카드 리스트 항목 간격 10px(gap-2.5, 편집모드 기준) | Registry: docs/ds/screen-registry.json<br>Route: /watchlist<br>File: src/routes/watchlist.index.tsx<br>Baseline: 2026-08-04 코드 기준<br>토큰 참조: --background, --foreground, --muted-foreground, --price-up, --price-down, --border, --input |

## FAV-001_watchlist_Empty — 즐겨찾기 목록

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0402 | 즐겨찾기 목록 | FAV-001_watchlist_Empty | Visible | -빈상태.01: 저장한 즐겨찾기가 0건일 때 EmptyState 컴포넌트로 전체 화면 전환<br>-구성.01: 편집 버튼은 items.length가 0이면 헤더에서 숨김 처리<br>-버튼.01: 빈 상태에서도 FAB(+)는 계속 노출되어 즐겨찾기 추가로 유도 | Registry: docs/ds/screen-registry.json<br>Route: /watchlist<br>File: src/routes/watchlist.index.tsx<br>Baseline: 2026-08-04 코드 기준<br>⚠️ 확인 필요: EmptyState 컴포넌트 본문(문구/일러스트) 상세 마크업이 발췌 범위 밖이라 세부 문구 미확인 |
| DS-0402 | 즐겨찾기 목록 | FAV-001_watchlist_Empty | Invisible | -진입조건.01: useFavoritePriceStore(items).length === 0 일 때<br>-분기.01: AppShell의 screenState가 Empty로 전달됨(items.length === 0 \ | \<br>Baseline: 2026-08-04 코드 기준 | filtered.length === 0)<br>-미구현.01: 위 분기는 "검색 결과 없음" 상태도 동일하게 Empty로 표시하여 완전한 빈 스토어 상태와 구분되지 않음 | Registry: docs/ds/screen-registry.json<br>Route: /watchlist<br>File: src/routes/watchlist.index.tsx<br>Baseline: 2026-08-04 코드 기준<br>⚠️ 확인 필요: Empty 상태가 "저장 항목 0건"과 "검색 결과 0건" 두 경우를 모두 포함하는지 기획 의도 확인 필요 |
| DS-0402 | 즐겨찾기 목록 | FAV-001_watchlist_Empty | Tracking | -미구현.01: 빈 상태 진입에 대한 별도 트래킹 이벤트 없음 | Registry: docs/ds/screen-registry.json<br>Route: /watchlist<br>File: src/routes/watchlist.index.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0402 | 즐겨찾기 목록 | FAV-001_watchlist_Empty | Design | -배경색.01: 페이지 배경 #FFFFFF(--background) | Registry: docs/ds/screen-registry.json<br>Route: /watchlist<br>File: src/routes/watchlist.index.tsx<br>Baseline: 2026-08-04 코드 기준<br>⚠️ 확인 필요: EmptyState 내부 아이콘·문구·버튼의 색상/크기 값은 해당 컴포넌트 소스 미열람으로 확인 필요 |

## FAV-002_watchlist-add_Default — 즐겨찾기 추가

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0403 | 즐겨찾기 추가 | FAV-002_watchlist-add_Default | Visible | -정의.01: 작물과 도매시장을 선택해 현재가를 미리 확인하고 즐겨찾기에 저장하는 화면<br>-구성.01: DetailHeader(뒤로가기 + "즐겨찾기 추가" 타이틀), 작물 선택 카드, 도매시장 선택 카드, 현재가 미리보기 카드, 하단 저장 버튼<br>-버튼.01: "작물" 카드 클릭 시 /crop-select 화면으로 이동해 카테고리·품목·품종 선택<br>-버튼.02: "도매시장" 카드 클릭 시 하단 시트(MarketPickerSheet) 오픈, 기본값은 "전체 시장"<br>-표시.01: 품목 미선택 시 "품목을 선택하세요" 문구, 선택 시 "카테고리 · 품목 · 품종" 형식 라벨 표시<br>-표시.02: 도매시장 미리보기 안내문 "전체 시장을 선택해도 즐겨찾기로 저장할 수 있어요"<br>-목록항목.01: 품목 선택 시 "현재가 미리보기(8kg 기준)" 카드에 8kg 단위 가격, 등락률 배지(▲/▼/—), 기준일·거래량 표시<br>-버튼.03: 하단 고정 "즐겨찾기 추가" 버튼, 품목 미선택 시 비활성화(회색) | Registry: docs/ds/screen-registry.json<br>Route: /watchlist/add<br>File: src/routes/watchlist.add.tsx<br>Baseline: 2026-08-04 코드 기준<br>Components: DetailHeader, CropIcon, Sheet |
| DS-0403 | 즐겨찾기 추가 | FAV-002_watchlist-add_Default | Invisible | -데이터소스.01: useCropSelection(committed)에서 공용 카테고리·품목·품종 선택 상태를 읽는다<br>-데이터소스.02: getCategoryById/getItemById/getVarietyById(catalog-service)로 선택 항목의 표시명을 조회<br>-초기값.01: 도매시장 초기값은 marketId="all"(ALL_MARKET_ID), marketName="전체 시장"<br>-초기값.02: 단위는 "8kg" 고정값(unit 변수), 조회일은 오늘 날짜(todayStr)<br>-계산식.01: 미리보기 시세는 getMarketQuote({itemId, varietyId, marketId: 전체시장이면 seoul-garak으로 대체, unit, date})로 산출<br>-검증.01: 저장 시 품목 미선택(!item) 또는 시세 조회 실패(!quote)면 "먼저 품목을 선택해 주세요" 토스트 후 중단<br>-액션.01: 저장 시 fromMarketQuote(favoriteMappers)로 즐겨찾기 데이터 조립 후 addFavorite 호출<br>-저장.01: addFavorite은 favoriteKey(작물+품종+시장+법인+산지+등급+단위 조합)를 id로 사용해 upsert<br>-성공.01: 저장 성공 시 "즐겨찾기에 추가되었어요" 토스트 후 /watchlist로 이동<br>-미구현.01: isPredictable 값이 항상 false로 고정 전달되어 실제 예측 가능 여부를 반영하지 않음 | Registry: docs/ds/screen-registry.json<br>Route: /watchlist/add<br>File: src/routes/watchlist.add.tsx<br>Baseline: 2026-08-04 코드 기준<br>Store: src/features/favorites/favoriteStore.ts, src/store/cropSelection.ts<br>Source: src/lib/mock/market-analysis.ts(getMarketQuote) |
| DS-0403 | 즐겨찾기 추가 | FAV-002_watchlist-add_Default | Tracking | -미구현.01: 화면 진입, 품목/시장 선택, 저장 완료에 대한 별도 트래킹 이벤트 코드는 확인되지 않음 | Registry: docs/ds/screen-registry.json<br>Route: /watchlist/add<br>File: src/routes/watchlist.add.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-0403 | 즐겨찾기 추가 | FAV-002_watchlist-add_Default | Design | -배경색.01: 페이지/카드 배경 #FFFFFF(--background, --card)<br>-테두리.01: 카드 테두리 1px solid #E9ECEF(--border), 모서리 반경 16px(rounded-2xl)<br>-테두리.02: 선택 버튼 내부 테두리 1px solid #E9ECEF(--input), 모서리 반경 12px(rounded-xl)<br>-글자색.01: 카드 라벨 텍스트 #6C757D(--muted-foreground), 12px/font-semibold<br>-글자색.02: 값 텍스트 #212529(--foreground), 15px/font-bold<br>-글자색.03: 상승 배지 배경 #FFE3E3·텍스트 #E03131, 하락 배지 배경 #DBE4FF·텍스트 #1971C2, 보합 배경 muted·텍스트 muted-foreground<br>-글자크기.01: 미리보기 가격 24px/font-bold, 단위 텍스트 12px<br>-내부여백.01: 카드 내부 패딩 16px(p-4)<br>-높이.01: 하단 저장 버튼 높이 48px(h-12)<br>-모서리.01: 하단 버튼 모서리 반경 12px(rounded-xl)<br>-아이콘크기.01: 작물/시장 아이콘 24px×24px, 아이콘 배경 40px×40px 원형 배경 아님(rounded-lg) 회색 #F8F9FA(--muted) | Registry: docs/ds/screen-registry.json<br>Route: /watchlist/add<br>File: src/routes/watchlist.add.tsx<br>Baseline: 2026-08-04 코드 기준<br>토큰 참조: --background, --border, --muted-foreground, --price-up, --price-down |

Confluence 등록 시 같은 Screen ID의 연속 행에 있는 DS No. · Section명 · Screen ID 셀은 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## 분석 파일
- src/routes/watchlist.index.tsx
- src/routes/watchlist.add.tsx
- src/features/favorites/favoriteStore.ts
- src/features/favorites/favoriteMappers.ts
- src/features/favorites/favoriteKey.ts
- src/features/favorites/types.ts
- src/store/market.ts (useMarketFilter, 카드 클릭 시 사용)
- src/store/cropSelection.ts
- src/lib/mock/market-analysis.ts
- src/styles.css

## 미구현·확인필요 요약
- 미구현: 3건 (FAV-001 트래킹 부재, FAV-001 Empty 상태 구분 미흡, FAV-002 isPredictable 미반영)
- ⚠️ 확인 필요: 3건 (FAV-001 트래킹 로깅 여부, FAV-001 Empty 컴포넌트 상세, FAV-001 Empty 상태 정의)
