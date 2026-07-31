# 공통 레이아웃 DS 초안

- Menu ID: common-layout
- Registry: docs/ds/screen-registry.json
- Baseline: 2026-07-31 코드 기준

> SRC-001(검색 결과), SEL-001(부류·품목·품종 선택)은 여러 메뉴(홈/시세/통계/예측 등)가 공용으로 진입하는 화면이라 공통 문서에 귀속한다. LAY-001~LAY-005, NAV-001은 신규 부여 Screen ID(Parent=/ 형태)이다.

## LAY-001 — 루트 셸

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-1101 | 루트 셸 | LAY-001_root-shell_Default | Visible | 구성.01: `Outlet`(라우트 콘텐츠) + `RatePromptModal` + `Toaster`(sonner, position="bottom-center", theme="dark", closeButton=false)<br>정의.01: TanStack Start 루트 라우트(`createRootRouteWithContext`)의 `RootComponent` | - |
| DS-1101 | 루트 셸 | LAY-001_root-shell_Default | Invisible | 진입조건.01: 모든 라우트 최초 진입 시 항상 렌더<br>초기값.01: `QueryClientProvider`로 `queryClient` 컨텍스트 제공<br>자동동작.01: 마운트 시 `import("../store/location")` 후 `useLocation.getState().request()` 호출(세션당 1회, 위치 권한 요청) | - |
| DS-1101 | 루트 셸 | LAY-001_root-shell_Default | Tracking | 함수.01: `reportLovableError`(에러 바운더리 전용, Default 상태에서는 호출되지 않음) | - |
| DS-1101 | 루트 셸 | LAY-001_root-shell_Default | Design | 컴포넌트.01: `RootShell`(html/head/body, `<HeadContent/>`, `<Scripts/>`)<br>컴포넌트.02: `RootComponent` | - |
| DS-1102 | 루트 셸 | LAY-001_root-shell_Empty | Visible | 제목.01: "404"<br>제목.02: "페이지를 찾을 수 없어요"<br>문구.01: "주소가 잘못되었거나 이동된 페이지입니다."<br>버튼.01: "홈으로" → `/` 이동 | - |
| DS-1102 | 루트 셸 | LAY-001_root-shell_Empty | Invisible | 진입조건.01: 매칭되는 라우트가 없을 때 `notFoundComponent`로 렌더 | - |
| DS-1102 | 루트 셸 | LAY-001_root-shell_Empty | Tracking | - | - |
| DS-1102 | 루트 셸 | LAY-001_root-shell_Empty | Design | 컴포넌트.01: `NotFoundComponent` | - |
| DS-1103 | 루트 셸 | LAY-001_root-shell_Error | Visible | 제목.01: "페이지를 불러오지 못했어요"<br>문구.01: "잠시 후 다시 시도해 주세요."<br>버튼.01: "다시 시도"(router.invalidate() + reset())<br>버튼.02: "홈으로"(`<a href="/">`) | - |
| DS-1103 | 루트 셸 | LAY-001_root-shell_Error | Invisible | 진입조건.01: 라우트 렌더 중 예외 발생 시 `errorComponent`로 렌더<br>예외.01: `console.error(error)`로 콘솔 출력<br>자동동작.01: 마운트 시 `reportLovableError(error, { boundary: "tanstack_root_error_component" })` 호출 | - |
| DS-1103 | 루트 셸 | LAY-001_root-shell_Error | Tracking | 함수.01: `reportLovableError`<br>호출조건.01: `ErrorComponent` 마운트(useEffect) 시<br>파라미터.01: `error`, `{ boundary: "tanstack_root_error_component" }` | - |
| DS-1103 | 루트 셸 | LAY-001_root-shell_Error | Design | 컴포넌트.01: `ErrorComponent` | - |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## LAY-002 — 공통 앱 셸

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-1104 | 공통 앱 셸 | LAY-002_app-shell_Default | Visible | 구성.01: `header` 슬롯 + `children`(본문, 하단 60px+세이프에어리어 패딩) + `bottom`(선택, GNB 위 고정 바) + `BottomNav`<br>정의.01: 1차 화면 공통 컨테이너. `AppHeader`/`DetailHeader`와 조합해 사용 | - |
| DS-1104 | 공통 앱 셸 | LAY-002_app-shell_Default | Invisible | 진입조건.01: `screenId` prop 전달 시에만 `data-screen-id`/`data-screen-state` 렌더<br>초기값.01: `screenState` 기본값 "Default" | - |
| DS-1104 | 공통 앱 셸 | LAY-002_app-shell_Default | Tracking | - | - |
| DS-1104 | 공통 앱 셸 | LAY-002_app-shell_Default | Design | 컴포넌트.01: `AppShell`, `TopHeader`<br>클래스.01: `mx-auto min-h-dvh w-full max-w-[430px] bg-background` | - |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## LAY-003 — 공통 상단바(GNB)

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-1105 | 공통 상단바(GNB) | LAY-003_app-header_Default | Visible | 정의.01: 1차 메뉴/GNB 화면용 공통 상단바(좌: 더보기 드로어, 중앙: 타이틀 또는 "AGDICT"+β배지+날짜, 우: 액션 아이콘)<br>구성.01: 좌측 `AppDrawerTrigger`<br>표시.01: `title` 미지정 시 "AGDICT" + "β" 배지, `showDate`(기본 true) 시 `YYYY.MM.DD` 날짜(1분마다 갱신)<br>버튼.01: `showSearch`(기본 false) 시 검색 아이콘 → `/search` 이동<br>버튼.02: `showRefresh`(기본 true) 새로고침 아이콘, 클릭 시 700ms 스핀 애니메이션<br>버튼.03: `showBell`(기본 true) 알림 아이콘 → `/notifications` 이동 | - |
| DS-1105 | 공통 상단바(GNB) | LAY-003_app-header_Default | Invisible | 조건.01: `right` prop 전달 시 기본 아이콘 3종을 완전히 대체<br>액션.01: 새로고침 클릭 시 `setNow(new Date())`로 시각 갱신 후 700ms 뒤 스핀 해제 | - |
| DS-1105 | 공통 상단바(GNB) | LAY-003_app-header_Default | Tracking | - | - |
| DS-1105 | 공통 상단바(GNB) | LAY-003_app-header_Default | Design | 컴포넌트.01: `AppHeader`<br>아이콘.01: `Bell`, `RefreshCw`, `Search`(lucide-react)<br>클래스.01: `h-[52px] border-b border-[#E9ECEF]` | - |

## LAY-004 — 하단 탭바

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-1106 | 하단 탭바 | LAY-004_bottom-nav_Default | Visible | 정의.01: 1차 화면 하단 고정 탭바(5개 탭)<br>구성.01: 홈("/", 아이콘 `Home`, 라벨 "홈")<br>구성.02: 시세("/market", 아이콘 `LineChart`, 라벨 "시세")<br>구성.03: 즐겨찾기("/watchlist", 아이콘 `Star`, 라벨 "즐겨찾기")<br>구성.04: 통계("/statistics", 아이콘 `BarChart3`, 라벨 "통계")<br>구성.05: 설정("/settings", 아이콘 `Settings`, 라벨 "설정")<br>상태표시.01: 현재 라우트와 일치하는 탭은 `data-status=active`로 `text-primary` 색상 적용(홈은 `exact` 매칭) | - |
| DS-1106 | 하단 탭바 | LAY-004_bottom-nav_Default | Invisible | 진입조건.01: 항상 화면 하단 고정(`fixed inset-x-0 bottom-0`) | - |
| DS-1106 | 하단 탭바 | LAY-004_bottom-nav_Default | Tracking | - | - |
| DS-1106 | 하단 탭바 | LAY-004_bottom-nav_Default | Design | 컴포넌트.01: `BottomNav`(`memo`로 래핑)<br>아이콘.01: `Home`, `LineChart`, `Star`, `BarChart3`, `Settings`(lucide-react)<br>클래스.01: `h-[60px]` 고정, `aria-label="주요 메뉴"` | - |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## LAY-005 — 공통 상세 상단바

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-1107 | 공통 상세 상단바 | LAY-005_detail-header_Default | Visible | 정의.01: 하위/선택/상세/설정/안내 화면 공통 상단바(좌: 뒤로가기, 중앙: 타이틀, 우: 액션 슬롯)<br>버튼.01: 좌측 뒤로가기(`ChevronLeft`, `aria-label="뒤로 가기"`), `onBack` prop 호출<br>표시.01: 중앙에 `center`(우선) 또는 `title` 텍스트를 항상 정중앙 정렬로 표시<br>구성.01: 우측 `right` prop 전달 시 액션 버튼 노출, 미전달 시 빈 40px 자리 확보(레이아웃 균형 유지) | - |
| DS-1107 | 공통 상세 상단바 | LAY-005_detail-header_Default | Invisible | 조건.01: `right` 미전달 시 우측에 `aria-hidden` 빈 박스만 렌더(즉석 빨간 점/실시간 표시 등 임의 아이콘 렌더 금지 — 컴포넌트 주석에 명시)<br>진입조건.01: 선택/설정/안내 화면에서는 우측 액션을 넣지 않는 것이 정책(주석 명시, 실제 사용 여부는 호출부에 따름) | - |
| DS-1107 | 공통 상세 상단바 | LAY-005_detail-header_Default | Tracking | - | - |
| DS-1107 | 공통 상세 상단바 | LAY-005_detail-header_Default | Design | 컴포넌트.01: `DetailHeader`<br>아이콘.01: `ChevronLeft`(lucide-react)<br>클래스.01: `h-[52px] border-b border-[#E9ECEF]` | - |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## NAV-001 — 더보기 드로어

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-1108 | 더보기 드로어 | NAV-001_app-drawer_Default | Visible | 정의.01: 좌측에서 열리는 전체 메뉴 드로어(`Sheet side="left"`)<br>제목.01: "더보기"<br>목록항목.01: "AI 시세 예측"(→ `/prediction`, 배지 "Beta")<br>목록항목.02: "실시간 시세"(→ `/live`)<br>목록항목.03: "시세 조회"(→ `/market`)<br>목록항목.04: "도매시장별 조회"(→ `/market/wholesale`)<br>목록항목.05: "품목별 조회"(→ `/market/item`)<br>목록항목.06: "시장별 가격 비교"(→ `/market-compare`)<br>목록항목.07: "즐겨찾기"(→ `/watchlist`)<br>목록항목.08: "통계"(→ `/statistics`)<br>목록항목.09: "농업 뉴스"(→ `/news`)<br>목록항목.10: "날씨"(→ `/weather`)<br>목록항목.11: "설정"(→ `/settings`)<br>목록항목.12: "데이터 기준 안내"(→ `/data-guide`)<br>문구.01: 하단 "데이터 제공: KAMIS 농산물유통정보" | - |
| DS-1108 | 더보기 드로어 | NAV-001_app-drawer_Default | Invisible | 진입조건.01: 상단바 좌측 `AppDrawerTrigger`(햄버거 아이콘) 클릭 시 오픈<br>액션.01: 각 항목 클릭 시 `SheetClose asChild` + `Link to`로 이동 후 드로어 자동 닫힘 | - |
| DS-1108 | 더보기 드로어 | NAV-001_app-drawer_Default | Tracking | - | - |
| DS-1108 | 더보기 드로어 | NAV-001_app-drawer_Default | Design | 컴포넌트.01: `AppDrawerTrigger`(`Sheet`/`SheetTrigger`/`SheetContent`/`SheetHeader`/`SheetTitle`/`SheetClose`)<br>아이콘.01: `Menu`, `ChevronRight`, `Sparkles`, `Activity`, `Store`, `Package`, `LineChart`, `Newspaper`, `Star`, `BarChart3`, `Scale`, `Settings`, `CloudSun`, `Info`(lucide-react)<br>클래스.01: `w-[300px] max-w-[85vw]` | - |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## SRC-001 — 검색 결과

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-1109 | 검색 결과 | SRC-001_search_Default | Visible | 정의.01: 작물/시장 통합 검색 화면(`/search`)<br>입력.01: 입력창 placeholder "작물명, 시장명으로 검색", 진입 시 자동 포커스<br>버튼.01: 좌측 뒤로가기(`ArrowLeft`) → `/` 이동<br>버튼.02: 입력값 존재 시 지우기 버튼("X") 클릭 시 입력값 초기화 후 재포커스<br>목록항목.01: 질의어 있을 때 "작물 (N)" 섹션에 최대 20건, 항목별 이름(하이라이트)+분류배지+현재가+단위+등락배지<br>목록항목.02: "시장 (N)" 섹션에 최대 20건, 항목별 이름(하이라이트)+지역<br>목록항목.03: 질의어 없을 때 "최근 검색어"(최대 10개, localStorage) 섹션, 항목별 삭제 버튼<br>목록항목.04: "전체삭제" 버튼(최근 검색어 전체 제거)<br>목록항목.05: 질의어 없을 때 "지금 많이 찾는 작물"(전일대비 등락률 절댓값 상위 8개) 칩 목록<br>상태표시.01: 등락배지 상승 빨강 "▲ N.N%", 하락 파랑 "▼ N.N%", 0 회색 "0.0%" | - |
| DS-1109 | 검색 결과 | SRC-001_search_Default | Invisible | 진입조건.01: `/search` 라우트 진입<br>데이터소스.01: `CROPS`, `MARKETS`(`@/lib/mock/crops`, `@/lib/mock/markets`)<br>저장.01: 최근 검색어 localStorage 키 `agdict.recentSearches`, 최대 10개, 커밋 시 중복 제거 후 맨 앞에 추가<br>필터조건.01: 질의어(소문자, trim)로 작물명/분류라벨 또는 시장명/지역 포함 검색, 각 최대 20건<br>계산식.01: 등락률 = (currentPrice - prevPrice) / prevPrice × 100<br>계산식.02: 트렌딩 = 전체 작물 중 |등락률| 내림차순 상위 8개<br>액션.01: 작물 클릭 시 검색어 커밋 후 `/market/$crop`(params: crop=c.id) 이동<br>액션.02: 시장 클릭 시 검색어 커밋 후 `/market` 이동<br>액션.03: Enter 키 입력 시 현재 입력값을 최근 검색어에 커밋(이동 없음) | - |
| DS-1109 | 검색 결과 | SRC-001_search_Default | Tracking | - | - |
| DS-1109 | 검색 결과 | SRC-001_search_Default | Design | 컴포넌트.01: `SearchPage`, `Section`, `ChangeBadge`, `CropIcon`<br>아이콘.01: `ArrowLeft`, `Search`, `X`, `TrendingUp`(lucide-react)<br>클래스.01: `data-screen-id="SRCH-001_검색"`, `data-screen-state`는 코드 내 값이 "Empty"/"Default"(레지스트리 SRC-001과 코드 내부 표기 SRCH-001 불일치, 확인필요.01 참고) | - |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-1110 | 검색 결과 | SRC-001_search_Empty | Visible | 빈상태.01: 아이콘 원형 배경 + `Search` 아이콘<br>문구.01: "검색 결과가 없어요"<br>문구.02: "다른 키워드로 검색해보세요" | - |
| DS-1110 | 검색 결과 | SRC-001_search_Empty | Invisible | 진입조건.01: 질의어가 있고 작물/시장 검색 결과가 모두 0건일 때(`noResults`) 렌더 | - |
| DS-1110 | 검색 결과 | SRC-001_search_Empty | Tracking | - | - |
| DS-1110 | 검색 결과 | SRC-001_search_Empty | Design | 컴포넌트.01: `EmptyResults` | - |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## SEL-001 — 부류·품목·품종 선택

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-1111 | 부류·품목·품종 선택 | SEL-001_crop-select_Default | Visible | 정의.01: `/crop-select` 3단계(부류→품목→품종) 선택 화면. `search.from`/`search.return`으로 진입 컨텍스트와 복귀 경로 지정<br>제목.01: "작물을 선택해 주세요"("작물"만 강조색)<br>문구.01: 단계별 부제, 1단계 "먼저 부류를 선택해 주세요", 2단계 "선택한 부류에서 품목을 골라주세요", 3단계 "선택한 품목의 품종을 선택해 주세요"<br>구성.01: 상단 3단계 스텝퍼(원형 번호/체크 + 라벨 "부류 선택"/"품목 선택"/"품종 선택")<br>검색.01: 각 단계 상단 검색창(placeholder 1: "부류를 검색하세요", 2: "품목을 입력하세요", 3: "품종을 검색하세요"), 1단계는 `searchAll`로 통합검색 결과(부류›품목›품종 경로) 표시 후 클릭 시 해당 단계로 즉시 점프<br>목록항목.01: 1단계 부류 2열 그리드(아이콘+이름+하위 품목 개수 배지)<br>목록항목.02: 2단계 품목 리스트(선택 시 체크 아이콘), 상단에 선택된 부류 칩(제거 가능)<br>목록항목.03: 3단계 "전체 품종" 고정행 + 품종 라디오 리스트, 상단에 부류/품목 칩(각각 제거 가능)<br>버튼.01: 좌측 상단 뒤로가기<br>버튼.02: 하단 CTA, 1·2단계 "다음", 3단계는 진입 출처별 라벨(`from`="market"/"statistics"/"statistics-detail" → "확인", "prediction" → "예측 보기", "home"/기본값 → "적용하기")<br>상태표시.01: 하단 바에 현재까지 선택한 부류›품목›품종 경로 표시, 현재 단계 항목은 강조색 | - |
| DS-1111 | 부류·품목·품종 선택 | SEL-001_crop-select_Default | Invisible | 진입조건.01: `/crop-select?from=&return=` 진입 시 `startDraftFromCommitted()`로 draft를 committed 값으로 초기화<br>초기값.01: `committed`에 varietyId/itemId/categoryId가 있으면 초기 단계를 3, categoryId만 있으면 2, 없으면 1로 설정<br>데이터소스.01: `@/lib/catalog-service`(`getCategories`, `getCategoryById`, `getItemById`, `getItemsByCategory`, `searchAll`)<br>상태.01: `useCropSelection` 스토어(draft/committed)<br>조건.01: 2단계에서 선택 품목이 `hasNoVariety` 또는 품종이 0개면 3단계를 건너뛰고 varietyId="ALL"로 즉시 적용<br>액션.01: 뒤로가기/브라우저 popstate 시 단계>1이면 이전 단계로, 단계=1이면 draft 폐기 후 `returnTo`(기본 "/") 이동<br>액션.02: 적용 시 `commitDraft()` 후 `useMarketFilter.getState().setItem(...)`으로 시세 필터 갱신<br>액션.03: `from`이 "statistics"/"statistics-detail"이면 성공 토스트를 생략(`SILENT_APPLY_FROM`)하고 `/statistics/$variety`(params: variety)로 이동<br>액션.04: 그 외 `from`은 토스트 "조건을 적용했어요" 노출 후 `returnTo` 이동<br>저장.01: 히스토리 스택 키 `__cropSelectStep`으로 단계 전진 시 `pushState` | - |
| DS-1111 | 부류·품목·품종 선택 | SEL-001_crop-select_Default | Tracking | - | - |
| DS-1111 | 부류·품목·품종 선택 | SEL-001_crop-select_Default | Design | 컴포넌트.01: `CropSelectPage`, `Stepper`, `Step1Category`, `Step2Item`, `Step3Variety`, `BottomBar`, `SearchInput`, `UpperChip`<br>아이콘.01: `ArrowLeft`, `Check`, `ChevronRight`, `Search`, `X`(lucide-react)<br>클래스.01: `data-screen-id="SEL-001_작물선택"`(레지스트리 SEL-001_crop-select_Default와 코드 내부 표기 불일치, 확인필요.02 참고) | - |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

> 위 SRC-001/SEL-001 두 표의 비고 셀은 공통 표기를 생략했다. 정식 등록 시 각 행 비고에 다음을 동일 적용한다:<br>SRC-001: Registry: docs/ds/screen-registry.json<br>Route: /search<br>File: src/routes/search.tsx<br>Baseline: 2026-07-31 코드 기준<br>SEL-001: Registry: docs/ds/screen-registry.json<br>Route: /crop-select<br>File: src/routes/crop-select.tsx<br>Store: src/store/cropSelection.ts, src/store/market.ts<br>Baseline: 2026-07-31 코드 기준

## 분석 파일

- src/routes/__root.tsx
- src/components/app-shell.tsx
- src/components/app-header.tsx
- src/components/bottom-nav.tsx
- src/components/detail-header.tsx
- src/components/app-drawer.tsx
- src/routes/search.tsx
- src/routes/crop-select.tsx
- src/store/cropSelection.ts
- src/store/market.ts

## 미구현·확인필요 요약

- 확인필요.01: `src/routes/search.tsx`의 `data-screen-id="SRCH-001_검색"`이 레지스트리 Screen ID(`SRC-001_search_*`)와 문자열이 다르다. 코드 수정 없이 문서만 갱신하므로 실제 코드 값을 그대로 기록했다.
- 확인필요.02: `src/routes/crop-select.tsx`의 `data-screen-id="SEL-001_작물선택"`이 레지스트리 Screen ID(`SEL-001_crop-select_Default`)와 문자열이 다르다. 실제 코드 값을 그대로 기록했다.
- 총 2건.
