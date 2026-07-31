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
