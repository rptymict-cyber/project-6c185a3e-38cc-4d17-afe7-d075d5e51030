# 즐겨찾기 DS

- Menu ID: watchlist
- Registry: docs/ds/screen-registry.json
- Baseline: 2026-08-05 코드 기준

## FAV-001_watchlist_Default — 즐겨찾기 목록 · 기본 상태

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0401 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Visible | -정의.01: 사용자가 저장한 시세 조회 조건(작물·품종·시장·법인·산지·등급·단위)을 카드 목록으로 보여준다 | Registry: docs/ds/screen-registry.json<br>Route: /watchlist<br>File: src/routes/watchlist.index.tsx<br>Baseline: 2026-08-05 코드 기준<br>기술근거.01: 컴포넌트 SwipeReorderList, FavoriteCardBody, CropIcon, AppHeader, TopHeader, AlertDialog 사용 |
| DS-0402 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Visible | -구성.01: 상단 헤더 "즐겨찾기" 타이틀과 저장 항목이 1개 이상일 때만 노출되는 우측 "편집" 버튼 | - |
| DS-0403 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Visible | -구성.02: 본문 상단 "즐겨찾기" 큰 제목과 "총 N개의 저장한 시세 조건" 안내문(저장 항목이 있을 때만 표시) | - |
| DS-0404 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Visible | -검색.01: "품목, 품종, 시장명으로 검색하세요" placeholder의 검색 입력창, 입력값이 있을 때만 지우기(X) 버튼 노출 | - |
| DS-0405 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Visible | -안내문.01: 검색 중이 아니고 목록이 2개 이상이면 "⋮⋮를 드래그해 순서를 바꿀 수 있어요" 안내문 표시 | - |
| DS-0406 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Visible | -목록항목.01: 카드마다 작물 아이콘, 작물명·품종명, 노란 별 아이콘, 시장명·법인명, 산지명·단위·등급, kg 환산가(굵은 큰 글씨)와 "원/kg" 단위, 실제 조회 단위 기준가, 거래량(있는 경우), 등락률 배지, "전일 대비" 문구를 표시 | - |
| DS-0407 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Visible | -상태표시.01: 등락률 배지는 상승 시 "▲ +N.N%"(빨강), 하락 시 "▼ N.N%"(파랑), 절대값 0.05% 미만이면 "— 0.0%"(회색)로 표시 | - |
| DS-0408 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Visible | -빈검색.01: 검색 결과가 0건이면 "조건에 맞는 저장된 시세가 없어요" 문구만 표시 | - |
| DS-0409 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Visible | -버튼.01: 화면 우측 하단 원형 플로팅 버튼(+ 아이콘)을 눌러 즐겨찾기 추가 화면으로 이동 | - |
| DS-0410 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Visible | -편집모드.01: "편집" 버튼을 누르면 헤더가 "취소"·"즐겨찾기 삭제"·"전체 선택/전체 해제"로 바뀌고 카드마다 우측 상단에 원형 선택 표시가 나타난다 | - |
| DS-0411 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Visible | -편집모드.02: 편집 모드 하단에 "취소" 버튼과 "삭제" 버튼이 2열로 고정 노출되며, 선택 항목이 없으면 "삭제" 버튼이 비활성화된다 | - |
| DS-0412 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Visible | -확인창.01: 삭제 버튼을 누르면 선택 개수에 따라 "즐겨찾기를 삭제할까요?" 또는 "선택한 즐겨찾기를 삭제할까요?" 제목과 삭제 대상 개수를 안내하는 확인 팝업이 뜬다 | - |
| DS-0413 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Invisible | -데이터.01: useFavoritePriceStore(items)에서 즐겨찾기 항목 목록을 읽어 화면에 반영한다 | Registry: docs/ds/screen-registry.json<br>Route: /watchlist<br>File: src/routes/watchlist.index.tsx<br>Baseline: 2026-08-05 코드 기준<br>기술근거.01: useFavoritePriceStore(favoriteStore.ts, zustand persist, storage key agdict:favoritePriceItems)<br>기술근거.02: 카드 클릭 시 useMarketFilter(setItem/setMarket/setCorp/setUnit) 갱신 후 navigate({to:"/price/$variety"})<br>기술근거.03: 삭제는 removeFavorite(id) 순차 호출, 재정렬은 setOrder(ids) 호출 |
| DS-0414 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Invisible | -데이터.02: 즐겨찾기 목록은 브라우저 로컬 저장소에 영속 저장되어 새로고침 후에도 유지된다 | - |
| DS-0415 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Invisible | -정렬.01: 순서값(order)이 있는 항목은 오름차순, 순서값이 없으면 등록일 내림차순으로 정렬한다(sortFavorites) | - |
| DS-0416 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Invisible | -검색조건.01: 입력한 검색어를 소문자로 변환한 뒤 작물명·품종명·시장명·법인명·산지명·단위 문자열에 포함되는지로 필터링한다 | - |
| DS-0417 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Invisible | -자동동작.01: 저장 항목이 0개가 되면 편집 모드를 자동으로 종료한다 | - |
| DS-0418 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Invisible | -액션.01: 카드를 드래그해 순서를 바꾸면 새 순서를 즉시 저장한다(검색 중에는 순서 변경 불가) | - |
| DS-0419 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Invisible | -액션.02: 카드를 누르면 해당 조건(품목·시장·법인·단위)을 공용 시세 필터 상태에 반영한 뒤 품종 상세 화면으로 이동한다 | - |
| DS-0420 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Invisible | -액션.03: 편집 모드에서 카드를 누르면 이동하지 않고 선택 상태만 토글한다 | - |
| DS-0421 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Invisible | -액션.04: 삭제 확인 팝업에서 "삭제"를 누르면 선택된 항목을 즐겨찾기에서 순차 제거하고 "즐겨찾기에서 삭제되었습니다." 안내를 띄운 뒤 편집 모드를 종료한다 | - |
| DS-0422 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Invisible | -예외.01: 삭제 처리 중 오류가 발생하면 "삭제하지 못했습니다. 다시 시도해주세요." 안내를 띄운다 | - |
| DS-0423 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Invisible | -이동.01: 카드 클릭 시 품종 상세 화면으로 이동한다 | - |
| DS-0424 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Invisible | -이동.02: 플로팅 버튼 클릭 시 즐겨찾기 추가 화면으로 이동한다 | - |
| DS-0425 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Invisible | -빈상태.01: 저장 항목이 하나도 없으면 즐겨찾기 목록 대신 안내 화면(FAV-001_watchlist_Empty)으로 전환된다 | - |
| DS-0426 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Invisible | -미구현.01: 검색·정렬·이동 등 화면 조작에 대한 별도 통계 수집(트래킹) 코드는 확인되지 않는다 | - |
| DS-0427 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Design | -배경색.01: 페이지 배경 흰색(#FFFFFF) | Registry: docs/ds/screen-registry.json<br>Route: /watchlist<br>File: src/routes/watchlist.index.tsx<br>Baseline: 2026-08-05 코드 기준<br>기술근거.01: 색상값은 --background, --foreground, --muted-foreground, --border, --input(src/styles.css), 상승/하락 하드코딩 #E03131·#1971C2 사용<br>기술근거.02: rounded-xl=12px, rounded-2xl=16px, h-14 w-14=56px, bottom-24 right-5=96px/20px |
| DS-0428 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Design | -배경색.02: 검색 입력창 배경 연한 회색 반투명(#F1F3F5, 불투명도 50%) | - |
| DS-0429 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Design | -배경색.03: 카드 목록 컨테이너 배경 흰색(#FFFFFF) | - |
| DS-0430 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Design | -글자색.01: 큰 제목 텍스트 진회색(#212529) | - |
| DS-0431 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Design | -글자색.02: 보조 안내문 텍스트 회색(#6C757D) | - |
| DS-0432 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Design | -글자색.03: 편집 헤더 "전체 선택" 버튼과 삭제 버튼 텍스트 빨간색(#E03131) | - |
| DS-0433 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Design | -글자색.04: 상승 등락률 텍스트 빨간색(#E03131), 하락 등락률 텍스트 파란색(#1971C2), 보합 텍스트 회색(#6C757D) | - |
| DS-0434 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Design | -글자색.05: 카드 내 가격 숫자 텍스트 진회색(#212529) | - |
| DS-0435 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Design | -별아이콘색.01: 즐겨찾기 별 아이콘 노란색(#F5B301) | - |
| DS-0436 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Design | -글자크기.01: 큰 제목 22px 굵게 | - |
| DS-0437 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Design | -글자크기.02: 카드 내 작물명 15px 굵게, 가격 숫자 26px 매우 굵게, 등락률 배지 15px 굵게 | - |
| DS-0438 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Design | -글자크기.03: 보조 안내문 13px, 검색 입력 13.5px | - |
| DS-0439 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Design | -테두리.01: 검색 입력창 테두리 1px 실선 연회색(#E9ECEF), 모서리 둥글기 12px | - |
| DS-0440 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Design | -테두리.02: 카드 목록 컨테이너 테두리 1px 실선 연회색(#E9ECEF), 모서리 둥글기 16px | - |
| DS-0441 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Design | -테두리.03: 편집 모드에서 선택된 카드 테두리 빨간색(#E03131), 미선택 카드 테두리 연회색(#E9ECEF) | - |
| DS-0442 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Design | -구분선.01: 카드 내부 상단 정보와 가격 정보 사이 구분선 연회색(#F1F3F5) | - |
| DS-0443 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Design | -너비높이.01: 플로팅 버튼 지름 56px 원형 | - |
| DS-0444 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Design | -바깥여백.01: 플로팅 버튼 위치 화면 하단에서 96px, 우측에서 20px 떨어짐 | - |
| DS-0445 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Design | -그림자.01: 플로팅 버튼에 큰 그림자 효과 적용 | - |
| DS-0446 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Design | -안쪽여백.01: 본문 좌우 안쪽 여백 16px | - |
| DS-0447 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Design | -안쪽여백.02: 카드 내부 안쪽 여백 16px | - |
| DS-0448 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Design | -요소간격.01: 편집 모드 카드 목록 항목 간 간격 10px | - |
| DS-0449 | 즐겨찾기 목록 | FAV-001_watchlist_Default | Design | -높이.01: 편집 모드 하단 버튼 높이 48px, 모서리 둥글기 12px | - |

## FAV-001_watchlist_Empty — 즐겨찾기 목록 · 빈 상태

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0450 | 즐겨찾기 목록 | FAV-001_watchlist_Empty | Visible | -정의.01: 저장한 즐겨찾기가 하나도 없을 때 목록 대신 안내 화면을 표시한다 | Registry: docs/ds/screen-registry.json<br>Route: /watchlist<br>File: src/routes/watchlist.index.tsx<br>Baseline: 2026-08-05 코드 기준<br>기술근거.01: EmptyState 컴포넌트가 같은 파일 내에 정의되어 있다 |
| DS-0451 | 즐겨찾기 목록 | FAV-001_watchlist_Empty | Visible | -구성.01: 헤더는 "즐겨찾기" 타이틀만 표시되고 저장 항목이 없어 "편집" 버튼은 노출되지 않는다 | - |
| DS-0452 | 즐겨찾기 목록 | FAV-001_watchlist_Empty | Visible | -문구.01: 회색 별 아이콘과 함께 "저장한 시세 조건이 아직 없어요" 제목 표시 | - |
| DS-0453 | 즐겨찾기 목록 | FAV-001_watchlist_Empty | Visible | -문구.02: 안내문 "아래 + 버튼으로 관심 있는 품목과 시장을 추가해 보세요."(2줄로 표시) | - |
| DS-0454 | 즐겨찾기 목록 | FAV-001_watchlist_Empty | Visible | -버튼.01: 빈 상태에서도 화면 우측 하단 플로팅 버튼(+)은 계속 노출되어 즐겨찾기 추가로 유도한다 | - |
| DS-0455 | 즐겨찾기 목록 | FAV-001_watchlist_Empty | Invisible | -조건.01: 즐겨찾기 저장 항목 수가 0건일 때 안내 화면으로 전환된다 | Registry: docs/ds/screen-registry.json<br>Route: /watchlist<br>File: src/routes/watchlist.index.tsx<br>Baseline: 2026-08-05 코드 기준<br>⚠️ 확인 필요.01: 화면 상태값이 "저장 항목 0건"과 "검색 결과 0건"을 함께 Empty로 취급하는지, 두 경우를 구분해야 하는지 기획 의도 확인 필요 |
| DS-0456 | 즐겨찾기 목록 | FAV-001_watchlist_Empty | Invisible | -조건.02: 검색 결과가 0건인 경우는 이 안내 화면이 아니라 "조건에 맞는 저장된 시세가 없어요" 문구만 표시되는 별도 화면 상태로 처리된다(내부적으로는 같은 화면 상태값을 공유) | - |
| DS-0457 | 즐겨찾기 목록 | FAV-001_watchlist_Empty | Invisible | -미구현.01: 빈 상태 진입에 대한 별도 통계 수집(트래킹) 코드는 확인되지 않는다 | - |
| DS-0458 | 즐겨찾기 목록 | FAV-001_watchlist_Empty | Design | -배경색.01: 페이지 배경 흰색(#FFFFFF) | Registry: docs/ds/screen-registry.json<br>Route: /watchlist<br>File: src/routes/watchlist.index.tsx<br>Baseline: 2026-08-05 코드 기준<br>기술근거.01: min-h 계산식 calc(100dvh - 52px - 60px - 세이프에어리어) |
| DS-0459 | 즐겨찾기 목록 | FAV-001_watchlist_Empty | Design | -아이콘색.01: 별 아이콘 연한 초록색(#B2DFB2), 크기 48px | - |
| DS-0460 | 즐겨찾기 목록 | FAV-001_watchlist_Empty | Design | -글자색.01: 제목 텍스트 진회색(#212529), 16px 굵게 | - |
| DS-0461 | 즐겨찾기 목록 | FAV-001_watchlist_Empty | Design | -글자색.02: 안내문 텍스트 회색(#6C757D), 13px, 줄간격 여유 있게 | - |
| DS-0462 | 즐겨찾기 목록 | FAV-001_watchlist_Empty | Design | -배치.01: 안내 화면은 화면 세로 가운데 정렬, 좌우 안쪽 여백 24px | - |

## FAV-002_watchlist-add_Default — 즐겨찾기 추가 · 기본 상태

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0463 | 즐겨찾기 추가 | FAV-002_watchlist-add_Default | Visible | -정의.01: 작물과 도매시장을 선택해 현재가를 미리 확인한 뒤 즐겨찾기에 저장하는 화면 | Registry: docs/ds/screen-registry.json<br>Route: /watchlist/add<br>File: src/routes/watchlist.add.tsx<br>Baseline: 2026-08-05 코드 기준<br>기술근거.01: DetailHeader, CropIcon, Sheet, MarketPickerSheet(동일 파일 내 정의) 사용 |
| DS-0464 | 즐겨찾기 추가 | FAV-002_watchlist-add_Default | Visible | -구성.01: 상단 뒤로가기와 "즐겨찾기 추가" 타이틀, "작물" 선택 카드, "도매시장" 선택 카드, 조건 선택 시 노출되는 "현재가 미리보기" 카드, 하단 고정 "즐겨찾기 추가" 버튼 | - |
| DS-0465 | 즐겨찾기 추가 | FAV-002_watchlist-add_Default | Visible | -표시.01: 작물 미선택 시 "품목을 선택하세요" 문구, 선택 시 "카테고리 · 품목 · 품종" 형식으로 표시 | - |
| DS-0466 | 즐겨찾기 추가 | FAV-002_watchlist-add_Default | Visible | -표시.02: 도매시장 카드 기본값은 "전체 시장"이며 안내문 "전체 시장을 선택해도 즐겨찾기로 저장할 수 있어요."가 함께 표시된다 | - |
| DS-0467 | 즐겨찾기 추가 | FAV-002_watchlist-add_Default | Visible | -버튼.01: "작물" 카드를 누르면 작물 선택 화면으로 이동한다 | - |
| DS-0468 | 즐겨찾기 추가 | FAV-002_watchlist-add_Default | Visible | -버튼.02: "도매시장" 카드를 누르면 하단 시트가 열려 "전체 시장"과 개별 도매시장 중 하나를 선택할 수 있다 | - |
| DS-0469 | 즐겨찾기 추가 | FAV-002_watchlist-add_Default | Visible | -목록항목.01: 작물을 선택하면 "현재가 미리보기(8kg 기준)" 카드에 8kg 단위 가격, 등락률 배지, 조회 기준일, 거래량이 표시된다 | - |
| DS-0470 | 즐겨찾기 추가 | FAV-002_watchlist-add_Default | Visible | -버튼.03: 하단 "즐겨찾기 추가" 버튼은 작물을 선택하기 전에는 회색으로 비활성화된다 | - |
| DS-0471 | 즐겨찾기 추가 | FAV-002_watchlist-add_Default | Visible | -문구.01: 작물을 선택하지 않고 저장을 시도하면 "먼저 품목을 선택해 주세요" 안내가 뜬다 | - |
| DS-0472 | 즐겨찾기 추가 | FAV-002_watchlist-add_Default | Visible | -문구.02: 저장에 성공하면 "즐겨찾기에 추가되었어요" 안내가 뜬 뒤 즐겨찾기 목록으로 이동한다 | - |
| DS-0473 | 즐겨찾기 추가 | FAV-002_watchlist-add_Default | Visible | -시트.01: 도매시장 선택 시트 상단에 "도매시장 선택" 제목, "전체 시장" 항목과 개별 시장 목록(시장명·지역명)이 표시되고 선택된 항목에는 체크 표시가 나타난다 | - |
| DS-0474 | 즐겨찾기 추가 | FAV-002_watchlist-add_Default | Invisible | -데이터.01: 공용 작물 선택 상태(useCropSelection의 committed)에서 현재 선택된 카테고리·품목·품종을 읽어 화면에 반영한다 | Registry: docs/ds/screen-registry.json<br>Route: /watchlist/add<br>File: src/routes/watchlist.add.tsx<br>Baseline: 2026-08-05 코드 기준<br>기술근거.01: getMarketQuote(market-analysis.ts)로 시세 산출, fromMarketQuote(favoriteMappers.ts)로 저장 데이터 조립, addFavorite(favoriteStore.ts)으로 upsert |
| DS-0475 | 즐겨찾기 추가 | FAV-002_watchlist-add_Default | Invisible | -초기값.01: 도매시장 초기값은 "전체 시장", 단위는 "8kg" 고정, 조회일은 오늘 날짜로 설정된다 | - |
| DS-0476 | 즐겨찾기 추가 | FAV-002_watchlist-add_Default | Invisible | -계산.01: 미리보기 가격은 선택된 작물·품종·시장·단위·날짜 조건으로 시세를 조회해 산출하며, "전체 시장" 선택 시 서울가락 시장 기준값으로 대체 계산한다 | - |
| DS-0477 | 즐겨찾기 추가 | FAV-002_watchlist-add_Default | Invisible | -검증.01: 저장 시점에 작물이 선택되지 않았거나 시세 조회 결과가 없으면 저장을 중단하고 안내 문구를 띄운다 | - |
| DS-0478 | 즐겨찾기 추가 | FAV-002_watchlist-add_Default | Invisible | -액션.01: 저장 버튼을 누르면 선택한 조건을 즐겨찾기 데이터로 조합해 저장하고, 동일 조건이 이미 있으면 갱신(덮어쓰기)한다 | - |
| DS-0479 | 즐겨찾기 추가 | FAV-002_watchlist-add_Default | Invisible | -이동.01: "작물" 카드 클릭 시 작물 선택 화면(/crop-select)으로 이동 후 돌아오면 이 화면이 다시 표시된다 | - |
| DS-0480 | 즐겨찾기 추가 | FAV-002_watchlist-add_Default | Invisible | -이동.02: 저장 완료 시 즐겨찾기 목록 화면으로 이동한다 | - |
| DS-0481 | 즐겨찾기 추가 | FAV-002_watchlist-add_Default | Invisible | -미구현.01: 예측 가능 여부(isPredictable) 값이 항상 false로 저장되어 실제 예측 가능 여부를 반영하지 않는다 | - |
| DS-0482 | 즐겨찾기 추가 | FAV-002_watchlist-add_Default | Invisible | -미구현.02: 화면 진입, 작물·시장 선택, 저장 완료 등 주요 행동에 대한 별도 통계 수집(트래킹) 코드는 확인되지 않는다 | - |
| DS-0483 | 즐겨찾기 추가 | FAV-002_watchlist-add_Default | Design | -배경색.01: 페이지 및 카드 배경 흰색(#FFFFFF) | Registry: docs/ds/screen-registry.json<br>Route: /watchlist/add<br>File: src/routes/watchlist.add.tsx<br>Baseline: 2026-08-05 코드 기준<br>기술근거.01: 색상값은 --background, --border, --muted-foreground(src/styles.css), 배지색은 하드코딩 #FFE3E3/#E03131/#DBE4FF/#1971C2 |
| DS-0484 | 즐겨찾기 추가 | FAV-002_watchlist-add_Default | Design | -테두리.01: 카드 테두리 1px 실선 연회색(#E9ECEF), 모서리 둥글기 16px | - |
| DS-0485 | 즐겨찾기 추가 | FAV-002_watchlist-add_Default | Design | -테두리.02: 선택 버튼 내부 테두리 1px 실선 연회색(#E9ECEF), 모서리 둥글기 12px | - |
| DS-0486 | 즐겨찾기 추가 | FAV-002_watchlist-add_Default | Design | -글자색.01: 카드 라벨 텍스트 회색(#6C757D), 12px 반굵게 | - |
| DS-0487 | 즐겨찾기 추가 | FAV-002_watchlist-add_Default | Design | -글자색.02: 값 텍스트 진회색(#212529), 15px 굵게 | - |
| DS-0488 | 즐겨찾기 추가 | FAV-002_watchlist-add_Default | Design | -글자색.03: 상승 배지 배경 연분홍(#FFE3E3)·글자 빨간색(#E03131), 하락 배지 배경 연파랑(#DBE4FF)·글자 파란색(#1971C2), 보합 배지 배경 회색·글자 회색 | - |
| DS-0489 | 즐겨찾기 추가 | FAV-002_watchlist-add_Default | Design | -글자크기.01: 미리보기 가격 24px 굵게, 단위 텍스트 12px | - |
| DS-0490 | 즐겨찾기 추가 | FAV-002_watchlist-add_Default | Design | -안쪽여백.01: 카드 내부 안쪽 여백 16px | - |
| DS-0491 | 즐겨찾기 추가 | FAV-002_watchlist-add_Default | Design | -높이.01: 하단 저장 버튼 높이 48px, 모서리 둥글기 12px | - |
| DS-0492 | 즐겨찾기 추가 | FAV-002_watchlist-add_Default | Design | -너비높이.02: 작물·시장 아이콘 24px, 아이콘 배경 40px 사각형(모서리 둥글기 있음, 원형 아님) 배경색 연회색(#F8F9FA) | - |

Confluence 등록 시 같은 Screen ID의 연속 행에 있는 DS No. · Section명 · Screen ID 셀은 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## 분석 파일
- src/routes/watchlist.index.tsx
- src/routes/watchlist.add.tsx
- src/features/favorites/favoriteStore.ts
- src/features/favorites/favoriteMappers.ts
- src/features/favorites/favoriteKey.ts
- src/features/favorites/types.ts
- src/store/market.ts
- src/store/cropSelection.ts
- src/lib/mock/market-analysis.ts
- src/styles.css

## 미구현·확인필요 요약
- 미구현: 3건 (FAV-001 트래킹 부재, FAV-002 예측 가능 여부 미반영, FAV-002 트래킹 부재)
- ⚠️ 확인 필요: 2건 (FAV-001 트래킹 로깅 여부, FAV-001 빈 상태와 검색결과 없음 상태 구분 여부)
