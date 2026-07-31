# 즐겨찾기 DS 초안

- Menu ID: watchlist
- Registry: docs/ds/screen-registry.json
- Baseline: 2026-07-31 코드 기준

## FAV-001_watchlist_Default — 즐겨찾기 목록

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0401 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Visible | 정의.01: 저장된 시세 조건(즐겨찾기)을 카드 형태로 보여주는 목록 화면<br>구성.01: AppHeader(제목 "즐겨찾기", 우측 "편집" 버튼) + 총 개수 안내 + 검색 입력 + 정렬 안내 문구 + SwipeReorderList(카드 목록) + FabAdd(+ 버튼)<br>제목.01: 즐겨찾기<br>문구.01: 총 {개수}개의 저장한 시세 조건<br>문구.02: 품목, 품종, 시장명으로 검색하세요 (검색 input placeholder)<br>문구.03: ⋮⋮를 드래그해 순서를 바꿀 수 있어요 (검색 중이 아니고 필터 결과가 2개 이상일 때)<br>문구.04: 조건에 맞는 저장된 시세가 없어요 (검색 결과 0건일 때)<br>입력.01: 검색어 입력(query state), X 버튼으로 지우기<br>버튼.01: 편집 버튼(items.length>0일 때만 노출) → editMode 진입<br>버튼.02: FabAdd — "/watchlist/add"로 이동하는 + 버튼<br>검색.01: 품목명·품종명·시장명·법인명·산지명·단위 문자열을 소문자 부분일치로 필터링<br>정렬.01: order 필드 오름차순, order 없으면 createdAt 내림차순(sortFavorites)<br>목록항목.01: CropIcon, 작물명·품종명, 별 아이콘(고정 노란색 #F5B301), 시장명·법인명, 산지명·단위·등급, kg당 가격, 단위가격, 거래량, 전일대비 등락률(▲/▼/—)<br>상태표시.01: 등락률 rising(#E03131,▲), falling(#1971C2,▼), flat(회색,— 0.0%, \|changeRate\|<0.05)<br>접근성.01: FabAdd에 aria-label="즐겨찾기 추가" | Registry: docs/ds/screen-registry.json<br>Route: /watchlist<br>File: src/routes/watchlist.index.tsx<br>Baseline: 2026-07-31 코드 기준 |
| DS-0401 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Invisible | 진입조건.01: /watchlist 라우트 접근 시 useFavoritePriceStore.items.length>0<br>데이터소스.01: zustand persist 스토어 useFavoritePriceStore(localStorage key "agdict:favoritePriceItems")<br>API.01: 없음(로컬 스토어만 사용, 서버 API 미연동)<br>초기값.01: query="" editMode=false selectedIds=Set() confirmOpen=false isDeleting=false<br>분기.01: items.length===0 \|\| filtered.length===0 이면 AppShell screenState="Empty"로 전달되나, items.length===0일 때는 EmptyState 컴포넌트가, filtered.length===0(검색결과 0건)일 때는 "조건에 맞는 저장된 시세가 없어요" 문구만 노출<br>액션.01: FavoriteCardBody 클릭(handleOpen) → useMarketFilter의 setItem/setMarket/setCorp/setUnit 호출 후 "/price/$variety"로 이동<br>액션.02: 편집 버튼 클릭 → editMode=true<br>액션.03: 편집모드에서 카드 선택/해제(toggleSelect), 전체선택/해제(toggleSelectAllVisible)<br>액션.04: 삭제 확인 다이얼로그(AlertDialog) 오픈(confirmOpen) → performDelete 실행 시 선택된 id들을 순차적으로 removeFavorite 호출<br>액션.05: 드래그로 순서 변경(SwipeReorderList onReorder→handleReorder) → 검색 중(isSearching)이면 무시, 아니면 setOrder(ids) 호출<br>자동동작.01: items.length===0이 되면 editMode·selectedIds 자동 초기화(useEffect)<br>성공.01: toast("즐겨찾기에서 삭제되었습니다.")<br>실패.01: toast("삭제하지 못했습니다. 다시 시도해주세요.") — removeFavorite은 동기 함수라 실제 발생하지 않는 방어 코드<br>미구현.01: performDelete 주석에 "기존 단건 삭제 API를 안전하게 순차 호출"이라 되어 있으나 실제로는 서버 API 없이 로컬 removeFavorite만 순차 호출함<br>확인필요.01: 즐겨찾기 저장 개수 제한 등 업무 규칙이 코드에 없음 | Registry: docs/ds/screen-registry.json<br>Route: /watchlist<br>File: src/routes/watchlist.index.tsx<br>Store: src/features/favorites/favoriteStore.ts (localStorage key agdict:favoritePriceItems)<br>Baseline: 2026-07-31 코드 기준 |
| DS-0401 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: /watchlist<br>File: src/routes/watchlist.index.tsx<br>Baseline: 2026-07-31 코드 기준 |
| DS-0401 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Design | 컴포넌트.01: AppShell, TopHeader, AppHeader, SwipeReorderList, CropIcon, AlertDialog<br>클래스.01: 편집모드 전체선택 버튼 text-[#E03131], 삭제 버튼 bg-[#E03131]<br>아이콘.01: Star(fill #F5B301), Search, X, Check, Plus<br>상태스타일.01: 선택된 카드 border-[#E03131], 미선택 border-border<br>반응형.01: 없음(모바일 전용 고정 레이아웃) | Registry: docs/ds/screen-registry.json<br>Route: /watchlist<br>File: src/routes/watchlist.index.tsx<br>Components: src/components/swipe-reorder-list.tsx, src/components/crop-icon.tsx<br>Baseline: 2026-07-31 코드 기준 |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## FAV-001_watchlist_Empty — 즐겨찾기 목록

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0402 | 즐겨찾기 목록 | FAV-001_watchlist_Empty | Visible | 정의.01: 즐겨찾기에 저장된 항목이 하나도 없을 때(items.length===0) 노출되는 빈 상태 화면<br>구성.01: AppHeader(우측 편집 버튼 없음) + EmptyState 컴포넌트(중앙 정렬) + FabAdd<br>표시.01: EmptyState 아이콘(Star, color #B2DFB2, size 48)<br>문구.01: 저장한 시세 조건이 아직 없어요<br>문구.02: 아래 + 버튼으로 관심 있는 품목과 시장을<br>추가해 보세요.<br>빈상태.01: EmptyState 컴포넌트(items.length===0일 때만 렌더), 검색바·정렬안내·목록 미노출<br>버튼.01: FabAdd → "/watchlist/add" 이동 | Registry: docs/ds/screen-registry.json<br>Route: /watchlist<br>File: src/routes/watchlist.index.tsx<br>Baseline: 2026-07-31 코드 기준 |
| DS-0402 | 즐겨찾기 목록 | FAV-001_watchlist_Empty | Invisible | 진입조건.01: useFavoritePriceStore.items.length===0<br>데이터소스.01: useFavoritePriceStore(localStorage key "agdict:favoritePriceItems")<br>분기.01: AppShell screenState="Empty" (items.length===0 조건)<br>자동동작.01: 항목이 0개가 되면 editMode·selectedIds 자동 초기화(useEffect)<br>액션.01: FabAdd 클릭 → "/watchlist/add"로 이동 | Registry: docs/ds/screen-registry.json<br>Route: /watchlist<br>File: src/routes/watchlist.index.tsx<br>Store: src/features/favorites/favoriteStore.ts<br>Baseline: 2026-07-31 코드 기준 |
| DS-0402 | 즐겨찾기 목록 | FAV-001_watchlist_Empty | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: /watchlist<br>File: src/routes/watchlist.index.tsx<br>Baseline: 2026-07-31 코드 기준 |
| DS-0402 | 즐겨찾기 목록 | FAV-001_watchlist_Empty | Design | 컴포넌트.01: AppShell, AppHeader, EmptyState(watchlist.index.tsx 내부 정의)<br>아이콘.01: Star(strokeWidth 1.5, size 48, color #B2DFB2)<br>상태스타일.01: 편집 버튼 미노출(items.length>0 조건부 렌더) | Registry: docs/ds/screen-registry.json<br>Route: /watchlist<br>File: src/routes/watchlist.index.tsx<br>Baseline: 2026-07-31 코드 기준 |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## FAV-002_watchlist-add_Default — 즐겨찾기 추가

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0403 | 즐겨찾기 추가 | FAV-002_watchlist-add_Default | Visible | 정의.01: 새 즐겨찾기(관심 품목·시장 조합)를 추가하는 화면<br>구성.01: DetailHeader(제목 "즐겨찾기 추가", 뒤로가기) + 작물 선택 섹션 + 도매시장 선택 섹션 + 현재가 미리보기 섹션(조건부) + 하단 고정 저장 버튼 + MarketPickerSheet(바텀시트)<br>제목.01: 즐겨찾기 추가<br>문구.01: 작물<br>문구.02: 품목을 선택하세요 (미선택 시)<br>문구.03: 도매시장<br>문구.04: 전체 시장을 선택해도 즐겨찾기로 저장할 수 있어요.<br>문구.05: 현재가 미리보기 ({unit} 기준)<br>문구.06: 도매시장 선택 (MarketPickerSheet 타이틀)<br>문구.07: 전체 시장<br>버튼.01: 작물 선택 버튼 → handlePickCrop 통해 /crop-select로 이동<br>버튼.02: 도매시장 선택 버튼 → sheetOpen=true<br>버튼.03: 즐겨찾기 추가(저장) 버튼, cropSelected=false면 disabled·회색 스타일<br>목록항목.01: MarketPickerSheet 내 "전체 시장" + MARKETS 배열의 각 시장(이름, 지역), 선택 시 Check 아이콘<br>상태표시.01: 등락률 텍스트 색상(rising #E03131/bg #FFE3E3, falling #1971C2/bg #DBE4FF, flat 회색)<br>모달.01: MarketPickerSheet(하단 시트, side="bottom") | Registry: docs/ds/screen-registry.json<br>Route: /watchlist/add<br>File: src/routes/watchlist.add.tsx<br>Baseline: 2026-07-31 코드 기준 |
| DS-0403 | 즐겨찾기 추가 | FAV-002_watchlist-add_Default | Invisible | 진입조건.01: /watchlist/add 라우트 접근<br>데이터소스.01: useCropSelection().committed(선택된 카테고리/품목/품종), MARKETS(src/lib/mock/markets.ts), getMarketQuote(src/lib/mock/market-analysis.ts) mock 데이터<br>API.01: 없음(getMarketQuote는 mock 함수)<br>초기값.01: marketId="all" marketName="전체 시장" sheetOpen=false unit="8kg"(하드코딩) date=오늘 날짜(todayStr())<br>입력제한.01: unit은 "8kg"으로 고정(선택 UI 없음)<br>조건.01: cropSelected = Boolean(item) (committed.itemId 존재 여부)<br>계산식.01: quote = getMarketQuote({itemId, varietyId, marketId: marketId==="all" ? "seoul-garak" : marketId, unit, date}) — 전체 시장 선택 시 미리보기는 서울가락 시세로 대체 계산<br>액션.01: handlePickCrop → navigate({to:"/crop-select", search:{from:"watchlist", return:"/watchlist/add"}})<br>액션.02: MarketPickerSheet onSelect → marketId/marketName 갱신 후 시트 닫기<br>액션.03: handleSave 클릭 → fromMarketQuote로 payload 생성 후 addFavorite(useFavoritePriceStore) 호출<br>저장.01: addFavorite(payload) 호출 시 favoriteKey(cropId:varietyId:marketId:corporationId:originId:grade:unit)로 localStorage "agdict:favoritePriceItems"에 upsert(기존 키 존재 시 order·createdAt 유지하며 갱신, 없으면 신규 추가)<br>성공.01: toast.success("즐겨찾기에 추가되었어요") 후 navigate({to:"/watchlist"})<br>실패.01: item 또는 quote가 없으면 toast("먼저 품목을 선택해 주세요") 후 저장 중단<br>미구현.01: 법인/산지/등급 선택 UI 없음(undefined로 저장), unit 선택 UI 없음("8kg" 하드코딩)<br>확인필요.01: "전체 시장" 즐겨찾기 저장 시 실제 시세 조회 화면 이동 후 표시 기준이 무엇인지 업무 규칙 불명확(추가 화면 미리보기만 서울가락으로 대체 계산) | Registry: docs/ds/screen-registry.json<br>Route: /watchlist/add<br>File: src/routes/watchlist.add.tsx<br>Store: src/features/favorites/favoriteStore.ts, src/store/cropSelection.ts, src/store/market.ts<br>Source: src/lib/mock/markets.ts, src/lib/mock/market-analysis.ts<br>Baseline: 2026-07-31 코드 기준 |
| DS-0403 | 즐겨찾기 추가 | FAV-002_watchlist-add_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: /watchlist/add<br>File: src/routes/watchlist.add.tsx<br>Baseline: 2026-07-31 코드 기준 |
| DS-0403 | 즐겨찾기 추가 | FAV-002_watchlist-add_Default | Design | 컴포넌트.01: AppShell, DetailHeader, CropIcon, Sheet/SheetContent/SheetHeader/SheetTitle<br>아이콘.01: ChevronRight, Store, Check<br>상태스타일.01: 저장 버튼 disabled 시 bg-muted text-muted-foreground, 활성 시 bg-primary text-primary-foreground<br>반응형.01: 없음 | Registry: docs/ds/screen-registry.json<br>Route: /watchlist/add<br>File: src/routes/watchlist.add.tsx<br>Baseline: 2026-07-31 코드 기준 |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## 분석 파일

- src/routes/watchlist.index.tsx
- src/routes/watchlist.add.tsx
- src/store/watchlist.ts
- src/features/favorites/favoriteStore.ts
- src/features/favorites/favoriteMappers.ts
- src/features/favorites/favoriteKey.ts
- src/components/swipe-reorder-list.tsx
- src/components/common/ConditionSelectCard.tsx
- src/components/app-shell.tsx

## 미구현·확인필요 요약

총 5건 (미구현 3건, 확인필요 2건)

- 미구현.01 (FAV-001_watchlist_Default): performDelete가 로컬 스토어만 사용하며 서버 삭제 API가 연동되어 있지 않음
- 미구현.01 (FAV-002_watchlist-add_Default): 법인/산지/등급/단위 선택 UI가 없고 unit="8kg"으로 하드코딩됨
- 확인필요.01 (FAV-001_watchlist_Default): 즐겨찾기 저장 개수 제한 등 업무 규칙이 코드에 정의되어 있지 않음
- 확인필요.01 (FAV-002_watchlist-add_Default): "전체 시장" 즐겨찾기 저장 시 실제 표시 기준(어느 시장 데이터를 사용할지)이 코드상 서울가락 대체 계산으로만 처리되어 업무 규칙 확인 필요
- 참고: src/store/watchlist.ts(useWatchlist, localStorage key "agdict:watchlist")는 프로젝트 전체에서 다른 파일에서 import되어 사용되는 곳이 없는 미사용 스토어로 확인됨(즐겨찾기 화면은 useFavoritePriceStore를 사용)
