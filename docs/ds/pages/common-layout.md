# 공통 레이아웃 DS

- Menu ID: common-layout
- Registry: docs/ds/screen-registry.json
- Baseline: 2026-08-04 코드 기준

## LAY-001 — 루트 셸

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-1101 | 루트 셸 | LAY-001_root-shell_Default | Visible | 정의.01: 앱 전체 최상위 루트 라우트 컴포넌트. 모든 화면이 이 셸 위에서 렌더된다<br>구성.01: 라우트 콘텐츠(Outlet)<br>구성.02: 별점 유도 모달(RatePromptModal)<br>구성.03: 하단 토스트(Toaster, 위치 하단 중앙, 다크 테마, 닫기 버튼 없음, 오프셋 68px) | Registry: docs/ds/screen-registry.json<br>Route: Parent=/<br>File: src/routes/__root.tsx<br>Baseline: 2026-08-04 코드 기준<br>기술 참조: RootComponent |
| DS-1101 | 루트 셸 | LAY-001_root-shell_Default | Invisible | 진입조건.01: 사용자가 앱의 어떤 경로로 진입하더라도 최초 1회 이 루트 컴포넌트가 항상 실행된다<br>초기값.01: React Query 클라이언트 컨텍스트를 하위 전체 라우트에 제공한다<br>자동동작.01: 화면 진입 시 위치정보 스토어를 불러와 OS 위치 권한 요청을 실행한다(세션당 1회)<br>액션.01: 문서 head에 페이지 제목·설명·OG 메타·Pretendard 폰트 스타일시트를 등록한다 | Registry: docs/ds/screen-registry.json<br>Route: Parent=/<br>File: src/routes/__root.tsx<br>Store: src/store/location.ts<br>Baseline: 2026-08-04 코드 기준 |
| DS-1101 | 루트 셸 | LAY-001_root-shell_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: Parent=/<br>File: src/routes/__root.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-1101 | 루트 셸 | LAY-001_root-shell_Default | Design | -배경색.01: 본문 배경 #FFFFFF (--background)<br>-글자색.01: 기본 글자색 #212529 (--foreground)<br>-글꼴.01: Pretendard, Noto Sans KR, 시스템 기본 sans-serif (--font-sans)<br>-레이어.01: 토스트 z-index 최상위(라이브러리 기본값, sonner 내부 처리) | Registry: docs/ds/screen-registry.json<br>Route: Parent=/<br>File: src/routes/__root.tsx<br>Baseline: 2026-08-04 코드 기준<br>기술 참조: RootShell, Toaster(sonner)<br>토큰 참조: --background, --foreground, --font-sans |
| DS-1102 | 루트 셸 | LAY-001_root-shell_Empty | Visible | 제목.01: "404"<br>제목.02: "페이지를 찾을 수 없어요"<br>문구.01: "주소가 잘못되었거나 이동된 페이지입니다."<br>버튼.01: "홈으로" | Registry: docs/ds/screen-registry.json<br>Route: Parent=/<br>File: src/routes/__root.tsx<br>Baseline: 2026-08-04 코드 기준<br>기술 참조: NotFoundComponent |
| DS-1102 | 루트 셸 | LAY-001_root-shell_Empty | Invisible | 진입조건.01: 요청 경로에 일치하는 라우트가 없을 때 표시된다<br>이동.01: "홈으로" 버튼 클릭 시 루트 경로(/)로 이동한다 | Registry: docs/ds/screen-registry.json<br>Route: Parent=/<br>File: src/routes/__root.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-1102 | 루트 셸 | LAY-001_root-shell_Empty | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: Parent=/<br>File: src/routes/__root.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-1102 | 루트 셸 | LAY-001_root-shell_Empty | Design | -배경색.01: 컨테이너 배경 #FFFFFF (--background)<br>-너비.01: 컨테이너 최대너비 430px, 좌우 중앙정렬<br>-글자크기.01: "404" 60px(3.75rem, text-6xl), 굵기 700<br>-글자크기.02: 안내 제목 18px(1.125rem, text-lg), 굵기 600<br>-글자색.01: 본문 설명 #6C757D (--muted-foreground)<br>-배경색.02: 버튼 배경 #3A8A3A (--primary)<br>-글자색.02: 버튼 글자 #FFFFFF (--primary-foreground)<br>-모서리.01: 버튼 border-radius 8px(rounded-lg)<br>-내부여백.01: 버튼 padding 상하 8px 좌우 16px | Registry: docs/ds/screen-registry.json<br>Route: Parent=/<br>File: src/routes/__root.tsx<br>Baseline: 2026-08-04 코드 기준<br>기술 참조: NotFoundComponent<br>토큰 참조: --background, --primary, --primary-foreground, --muted-foreground |
| DS-1103 | 루트 셸 | LAY-001_root-shell_Error | Visible | 제목.01: "페이지를 불러오지 못했어요"<br>문구.01: "잠시 후 다시 시도해 주세요."<br>버튼.01: "다시 시도"<br>버튼.02: "홈으로" | Registry: docs/ds/screen-registry.json<br>Route: Parent=/<br>File: src/routes/__root.tsx<br>Baseline: 2026-08-04 코드 기준<br>기술 참조: ErrorComponent |
| DS-1103 | 루트 셸 | LAY-001_root-shell_Error | Invisible | 진입조건.01: 라우트 렌더 도중 예외가 발생하면 표시된다<br>예외.01: 발생한 에러를 콘솔에 출력한다<br>자동동작.01: 화면 표시 시 에러 리포팅 서비스에 에러 내용과 발생 위치("tanstack_root_error_component")를 전송한다<br>액션.01: "다시 시도" 클릭 시 라우터를 무효화하고 에러 상태를 초기화한다<br>이동.01: "홈으로" 클릭 시 루트 경로(/)로 이동한다 | Registry: docs/ds/screen-registry.json<br>Route: Parent=/<br>File: src/routes/__root.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-1103 | 루트 셸 | LAY-001_root-shell_Error | Tracking | 함수.01: reportLovableError<br>호출조건.01: ErrorComponent가 화면에 표시된 시점(마운트)<br>파라미터.01: 발생한 error 객체, boundary="tanstack_root_error_component" | Registry: docs/ds/screen-registry.json<br>Route: Parent=/<br>File: src/routes/__root.tsx<br>Baseline: 2026-08-04 코드 기준<br>기술 참조: reportLovableError(src/lib/lovable-error-reporting) |
| DS-1103 | 루트 셸 | LAY-001_root-shell_Error | Design | -배경색.01: 컨테이너 배경 #FFFFFF (--background)<br>-너비.01: 컨테이너 최대너비 430px<br>-글자크기.01: 안내 제목 18px(1.125rem, text-lg), 굵기 600<br>-글자색.01: 본문 설명 #6C757D (--muted-foreground)<br>-배경색.02: "다시 시도" 버튼 배경 #3A8A3A (--primary), 글자 #FFFFFF<br>-테두리.01: "홈으로" 버튼 테두리 1px solid #E9ECEF (--input)<br>-모서리.01: 버튼 border-radius 8px(rounded-lg) | Registry: docs/ds/screen-registry.json<br>Route: Parent=/<br>File: src/routes/__root.tsx<br>Baseline: 2026-08-04 코드 기준<br>기술 참조: ErrorComponent<br>토큰 참조: --background, --primary, --input, --muted-foreground |

Confluence 등록 시 같은 Screen ID의 연속 행에 있는 DS No. · Section명 · Screen ID 셀은 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## LAY-002 — 공통 앱 셸

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-1104 | 공통 앱 셸 | LAY-002_app-shell_Default | Visible | 정의.01: 1차 메뉴 화면(홈/시세/즐겨찾기/통계/설정 등)이 공통으로 사용하는 화면 컨테이너<br>구성.01: 상단바 슬롯(header)<br>구성.02: 본문 영역(children)<br>구성.03: 하단 고정 보조바 슬롯(bottom, 선택적)<br>구성.04: 하단 탭바(공통) | Registry: docs/ds/screen-registry.json<br>Route: Parent=/<br>File: src/components/app-shell.tsx<br>Baseline: 2026-08-04 코드 기준<br>기술 참조: AppShell |
| DS-1104 | 공통 앱 셸 | LAY-002_app-shell_Default | Invisible | 진입조건.01: 화면 식별자(screenId)가 전달된 경우에만 화면 최상위 요소에 화면 식별 속성을 부여한다<br>초기값.01: 화면 상태값(screenState)의 기본값은 "Default"이며 Empty·Loading·Error로 전환될 수 있다<br>계산식.01: 본문 하단 여백은 하단 탭바 높이 60px에 기기 세이프에어리어(하단)를 더한 값으로 계산된다 | Registry: docs/ds/screen-registry.json<br>Route: Parent=/<br>File: src/components/app-shell.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-1104 | 공통 앱 셸 | LAY-002_app-shell_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: Parent=/<br>File: src/components/app-shell.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-1104 | 공통 앱 셸 | LAY-002_app-shell_Default | Design | -배경색.01: 컨테이너 배경 #FFFFFF (--background)<br>-너비.01: 컨테이너 최대너비 430px, 좌우 중앙정렬(mx-auto)<br>-높이.01: 최소 높이 100dvh(min-h-dvh)<br>-외부여백.01: 본문 하단 padding 60px + env(safe-area-inset-bottom) | Registry: docs/ds/screen-registry.json<br>Route: Parent=/<br>File: src/components/app-shell.tsx<br>Baseline: 2026-08-04 코드 기준<br>기술 참조: AppShell, TopHeader<br>토큰 참조: --background |

Confluence 등록 시 같은 Screen ID의 연속 행에 있는 DS No. · Section명 · Screen ID 셀은 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## LAY-003 — 공통 상단바(GNB)

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-1105 | 공통 상단바(GNB) | LAY-003_app-header_Default | Visible | 정의.01: 1차 메뉴/GNB 화면에서 공통으로 쓰는 상단바. 좌측 더보기, 중앙 화면명 또는 브랜드 표기, 우측 액션 아이콘으로 구성된다<br>구성.01: 좌측 더보기(햄버거) 버튼 — 더보기 드로어를 연다<br>제목.01: title 미지정 시 중앙에 "AGDICT" 브랜드명과 "β" 배지를 함께 표시한다<br>표시.01: 날짜 표시(showDate, 기본 노출)가 켜져 있으면 "YYYY.MM.DD" 형식의 오늘 날짜를 브랜드명 아래에 표시하며 1분마다 갱신된다<br>버튼.01: 검색 버튼(showSearch, 기본 미노출) — 노출 시 검색 화면으로 이동한다<br>버튼.02: 새로고침 버튼(showRefresh, 기본 노출) — 클릭 시 아이콘이 회전하며 최신 시세 업데이트 안내 토스트를 띄운다<br>버튼.03: 알림 버튼(showBell, 기본 노출) — 알림 화면으로 이동한다 | Registry: docs/ds/screen-registry.json<br>Route: Parent=/<br>File: src/components/app-header.tsx<br>Baseline: 2026-08-04 코드 기준<br>기술 참조: AppHeader |
| DS-1105 | 공통 상단바(GNB) | LAY-003_app-header_Default | Invisible | 조건.01: right가 전달되면 기본 아이콘 3종(검색/새로고침/알림)을 전달된 내용으로 완전히 대체한다<br>자동동작.01: 1분마다 현재 시각을 갱신해 날짜 표시를 최신 상태로 유지한다<br>액션.01: 새로고침 버튼 클릭 시 현재 시각을 갱신하고 700ms 동안 회전 애니메이션을 재생한 뒤 정지한다<br>성공.01: 새로고침 클릭 시 "최신 시세로 업데이트했어요" 토스트를 표시한다 | Registry: docs/ds/screen-registry.json<br>Route: Parent=/<br>File: src/components/app-header.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-1105 | 공통 상단바(GNB) | LAY-003_app-header_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: Parent=/<br>File: src/components/app-header.tsx<br>Baseline: 2026-08-04 코드 기준<br>⚠️ 확인 필요: 새로고침·검색·알림 버튼에 대한 별도 분석 이벤트 로깅 코드는 확인되지 않음 |
| DS-1105 | 공통 상단바(GNB) | LAY-003_app-header_Default | Design | -배경색.01: 헤더 배경 #FFFFFF (--background)<br>-높이.01: 헤더 높이 52px<br>-테두리.01: 하단 테두리 1px solid #E9ECEF<br>-내부여백.01: 좌우 padding 8px(px-2)<br>-글자크기.01: 지정 타이틀 15px(0.9375rem), 굵기 900(font-black)<br>-글자크기.02: 기본 브랜드명 "AGDICT" 16px(1rem), 굵기 900<br>-배경색.02: β 배지 배경 #F0F9F0<br>-글자색.01: β 배지 글자 #3A8A3A, 크기 10px, 굵기 700<br>-글자크기.03: 날짜 표시 10px, 굵기 500, 글자색 #6C757D (--muted-foreground)<br>-너비.01: 아이콘 버튼(원형) 36px×36px(h-9 w-9)<br>-아이콘크기.01: 검색/새로고침/알림 아이콘 20px×20px(h-5 w-5), lucide 기본 획두께<br>-모서리.01: 아이콘 버튼 모서리 완전 원형(rounded-full)<br>-상태색.01: 아이콘 버튼 hover 배경 #F1F3F5 (--secondary)<br>-레이어.01: 헤더 z-index 30, sticky top-0 고정 | Registry: docs/ds/screen-registry.json<br>Route: Parent=/<br>File: src/components/app-header.tsx<br>Baseline: 2026-08-04 코드 기준<br>기술 참조: AppHeader, AppDrawerTrigger<br>클래스 참조: h-[52px] border-b border-[#E9ECEF]<br>토큰 참조: --background, --secondary, --muted-foreground |

Confluence 등록 시 같은 Screen ID의 연속 행에 있는 DS No. · Section명 · Screen ID 셀은 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## LAY-004 — 하단 탭바

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-1106 | 하단 탭바 | LAY-004_bottom-nav_Default | Visible | 정의.01: 1차 화면 전반에서 항상 하단에 고정 노출되는 5개 탭 내비게이션<br>목록항목.01: 홈(경로 /, 라벨 "홈")<br>목록항목.02: 시세(경로 /market, 라벨 "시세")<br>목록항목.03: 즐겨찾기(경로 /watchlist, 라벨 "즐겨찾기")<br>목록항목.04: 통계(경로 /statistics, 라벨 "통계")<br>목록항목.05: 설정(경로 /settings, 라벨 "설정")<br>상태표시.01: 현재 라우트와 일치하는 탭은 활성 색상으로 강조 표시된다(홈 탭은 정확히 "/" 일치할 때만 활성) | Registry: docs/ds/screen-registry.json<br>Route: Parent=/<br>File: src/components/bottom-nav.tsx<br>Baseline: 2026-08-04 코드 기준<br>기술 참조: BottomNav |
| DS-1106 | 하단 탭바 | LAY-004_bottom-nav_Default | Invisible | 진입조건.01: 화면 최하단에 항상 고정 노출된다(fixed)<br>이동.01: 각 탭 클릭 시 해당 경로로 라우트를 전환한다 | Registry: docs/ds/screen-registry.json<br>Route: Parent=/<br>File: src/components/bottom-nav.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-1106 | 하단 탭바 | LAY-004_bottom-nav_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: Parent=/<br>File: src/components/bottom-nav.tsx<br>Baseline: 2026-08-04 코드 기준<br>⚠️ 확인 필요: 탭 클릭에 대한 별도 분석 이벤트 로깅 코드는 확인되지 않음 |
| DS-1106 | 하단 탭바 | LAY-004_bottom-nav_Default | Design | -배경색.01: 탭바 배경 #FFFFFF<br>-높이.01: 탭바 높이 60px<br>-너비.01: 컨테이너 최대너비 430px, 좌우 중앙정렬<br>-테두리.01: 상단 테두리 1px solid #E8EEE8<br>-글자크기.01: 탭 라벨 10px, 굵기 500(font-medium)<br>-글자색.01: 비활성 탭 색상 #9CA3AF<br>-상태색.01: 활성 탭 색상 #3A8A3A (text-primary, --primary)<br>-아이콘크기.01: 탭 아이콘 20px×20px(h-5 w-5)<br>-간격.01: 아이콘-라벨 간격 4px(gap-1)<br>-최소크기.01: 탭 터치 영역 최소 높이 44px(min-h-11)<br>-레이어.01: 탭바 z-index 40, 화면 하단 고정(fixed inset-x-0 bottom-0) | Registry: docs/ds/screen-registry.json<br>Route: Parent=/<br>File: src/components/bottom-nav.tsx<br>Baseline: 2026-08-04 코드 기준<br>기술 참조: BottomNav(memo)<br>클래스 참조: border-t border-[#E8EEE8]<br>토큰 참조: --primary |

Confluence 등록 시 같은 Screen ID의 연속 행에 있는 DS No. · Section명 · Screen ID 셀은 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## LAY-005 — 공통 상세 상단바

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-1107 | 공통 상세 상단바 | LAY-005_detail-header_Default | Visible | 정의.01: 하위/선택/상세/설정/안내 화면 공통 상단바<br>구성.01: 좌측 뒤로가기 버튼<br>제목.01: 중앙 타이틀은 항상 화면 정중앙에 정렬 표시된다(center 슬롯이 있으면 title 대신 우선 사용)<br>버튼.01: 우측 액션은 화면별로 필요할 때만 명시적으로 전달되며 기본값은 없음(빈 자리만 유지) | Registry: docs/ds/screen-registry.json<br>Route: Parent=/<br>File: src/components/detail-header.tsx<br>Baseline: 2026-08-04 코드 기준<br>기술 참조: DetailHeader |
| DS-1107 | 공통 상세 상단바 | LAY-005_detail-header_Default | Invisible | 이동.01: 뒤로가기 버튼 클릭 시 호출부에서 전달한 onBack 함수를 실행한다<br>조건.01: 선택/설정/안내류 화면(작물 선택, 날짜 선택, 도매시장 선택, 알림 설정, 데이터 기준 안내 등)에서는 우측 액션을 넣지 않는 것이 원칙이다<br>미구현.01: 임시 빨간 점/실시간 표시 등 의미 없는 상태 아이콘은 이 컴포넌트에서 렌더링하지 않도록 설계돼 있다(정책상 비표시) | Registry: docs/ds/screen-registry.json<br>Route: Parent=/<br>File: src/components/detail-header.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-1107 | 공통 상세 상단바 | LAY-005_detail-header_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: Parent=/<br>File: src/components/detail-header.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-1107 | 공통 상세 상단바 | LAY-005_detail-header_Default | Design | -배경색.01: 헤더 배경 #FFFFFF (--background)<br>-높이.01: 헤더 높이 52px<br>-테두리.01: 하단 테두리 1px solid #E9ECEF<br>-내부여백.01: 좌우 padding 8px(px-2)<br>-너비.01: 뒤로가기 버튼(원형) 40px×40px(h-10 w-10)<br>-아이콘크기.01: 뒤로가기 아이콘 20px×20px(h-5 w-5)<br>-모서리.01: 뒤로가기 버튼 모서리 완전 원형<br>-상태색.01: 뒤로가기 버튼 hover 배경 #F1F3F5, active 배경 #F3F4F6(gray-100)<br>-글자크기.01: 타이틀 15px, 굵기 900(font-black)<br>-정렬.01: 타이틀 영역은 좌우 56px(inset-x-14) 안쪽에서 가운데 정렬<br>-레이어.01: 헤더 z-index 30, sticky top-0 고정 | Registry: docs/ds/screen-registry.json<br>Route: Parent=/<br>File: src/components/detail-header.tsx<br>Baseline: 2026-08-04 코드 기준<br>기술 참조: DetailHeader<br>클래스 참조: border-b border-[#E9ECEF]<br>토큰 참조: --background |

Confluence 등록 시 같은 Screen ID의 연속 행에 있는 DS No. · Section명 · Screen ID 셀은 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## NAV-001 — 더보기 드로어

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-1108 | 더보기 드로어 | NAV-001_app-drawer_Default | Visible | 정의.01: 좌측에서 슬라이드로 열리는 전체 메뉴 목록 시트<br>제목.01: 시트 상단 "더보기"<br>목록항목.01: AI 시세 예측(/prediction, "Beta" 배지)<br>목록항목.02: 실시간 시세(/live)<br>목록항목.03: 시세 조회(/market)<br>목록항목.04: 도매시장별 조회(/market/wholesale)<br>목록항목.05: 품목별 조회(/market/item)<br>목록항목.06: 시장별 가격 비교(/market-compare)<br>목록항목.07: 즐겨찾기(/watchlist)<br>목록항목.08: 통계(/statistics)<br>목록항목.09: 농업 뉴스(/news)<br>목록항목.10: 날씨(/weather)<br>목록항목.11: 설정(/settings)<br>목록항목.12: 데이터 기준 안내(/data-guide)<br>문구.01: 시트 하단 "데이터 제공: KAMIS 농산물유통정보" | Registry: docs/ds/screen-registry.json<br>Route: Parent=/<br>File: src/components/app-drawer.tsx<br>Baseline: 2026-08-04 코드 기준<br>기술 참조: AppDrawerTrigger |
| DS-1108 | 더보기 드로어 | NAV-001_app-drawer_Default | Invisible | 진입조건.01: 공통 상단바(GNB)의 좌측 더보기(햄버거) 버튼 클릭 시 열린다<br>이동.01: 목록 항목 클릭 시 해당 경로로 이동하며 시트가 자동으로 닫힌다 | Registry: docs/ds/screen-registry.json<br>Route: Parent=/<br>File: src/components/app-drawer.tsx<br>Baseline: 2026-08-04 코드 기준<br>Components: Sheet(src/components/ui/sheet.tsx) |
| DS-1108 | 더보기 드로어 | NAV-001_app-drawer_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: Parent=/<br>File: src/components/app-drawer.tsx<br>Baseline: 2026-08-04 코드 기준<br>⚠️ 확인 필요: 메뉴 항목 클릭에 대한 별도 분석 이벤트 로깅 코드는 확인되지 않음 |
| DS-1108 | 더보기 드로어 | NAV-001_app-drawer_Default | Design | -배경색.01: 시트 배경 #FFFFFF (--background)<br>-너비.01: 시트 너비 300px, 최대 85vw<br>-테두리.01: 헤더/푸터 하단·상단 테두리 1px solid #E9ECEF (--border)<br>-내부여백.01: 헤더 좌우 padding 16px, 상하 padding 12px<br>-글자크기.01: 시트 제목 15px, 굵기 900<br>-내부여백.02: 목록 항목 좌우 16px, 상하 12px<br>-너비.02: 항목 아이콘 배지(원형) 32px×32px<br>-배경색.02: 항목 아이콘 배지 배경 #F1F3F5, 아이콘 색상 #495057<br>-아이콘크기.01: 항목 아이콘 16px×16px(h-4 w-4)<br>-글자크기.02: 항목 라벨 14px, 굵기 600<br>-배경색.03: "Beta" 배지 배경 primary 10% 투명도(bg-primary/10)<br>-글자색.01: "Beta" 배지 글자 #3A8A3A (--primary), 크기 10px, 굵기 700<br>-아이콘크기.02: 항목 우측 화살표 16px×16px, 색상 #ADB5BD<br>-글자크기.03: 하단 안내 문구 11px, 색상 #6C757D (--muted-foreground) | Registry: docs/ds/screen-registry.json<br>Route: Parent=/<br>File: src/components/app-drawer.tsx<br>Baseline: 2026-08-04 코드 기준<br>기술 참조: AppDrawerTrigger, Sheet<br>토큰 참조: --background, --border, --primary, --muted-foreground |

Confluence 등록 시 같은 Screen ID의 연속 행에 있는 DS No. · Section명 · Screen ID 셀은 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## SRC-001 — 검색 결과

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-1109 | 검색 결과 | SRC-001_search_Default | Visible | 정의.01: 홈/공통 상단바의 검색 진입점에서 이동하는 통합 검색 화면<br>구성.01: 상단 검색 헤더(뒤로가기 + 검색 입력창 + 지우기 버튼)<br>입력.01: 플레이스홀더 "작물명, 시장명으로 검색"<br>목록항목.01: 입력값이 없을 때 "최근 검색어" 목록(최대 10건), 각 항목에 삭제 버튼 제공, "전체삭제" 버튼 제공<br>목록항목.02: 입력값이 없을 때 "지금 많이 찾는 작물" 칩 목록(당일 등락폭 절대값 상위 8개)<br>검색.01: 입력값이 있을 때 작물명 또는 부류명에 일치하는 작물 결과를 최대 20건 표시(제목 "작물 (N)")<br>검색.02: 입력값이 있을 때 시장명 또는 지역명에 일치하는 시장 결과를 최대 20건 표시(제목 "시장 (N)")<br>목록항목.03: 작물 결과 행에 아이콘, 이름(검색어 하이라이트), 부류 배지, 현재가, 단위, 등락률 배지를 표시<br>목록항목.04: 시장 결과 행에 아이콘, 시장명(검색어 하이라이트), 지역명을 표시 | Registry: docs/ds/screen-registry.json<br>Route: /search<br>File: src/routes/search.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-1109 | 검색 결과 | SRC-001_search_Default | Invisible | 진입조건.01: 화면 진입 시 검색 입력창에 자동 포커스되고 localStorage(agdict.recentSearches)의 최근 검색어를 불러온다<br>데이터소스.01: 작물 목록은 src/lib/mock/crops의 CROPS, 시장 목록은 src/lib/mock/markets의 MARKETS<br>검증.01: 검색어는 소문자로 변환 후 부분일치로 필터링한다<br>저장.01: 작물 행 클릭 또는 Enter 입력 시 검색어를 최근 검색어 목록 최상단에 추가하고 localStorage에 저장한다(최대 10건 유지)<br>액션.01: 최근 검색어 개별 삭제 시 해당 항목만 제거 후 재저장<br>액션.02: "전체삭제" 클릭 시 최근 검색어 전체를 비우고 저장한다<br>이동.01: 작물 결과 클릭 시 해당 작물의 시세 상세 화면(/market/$crop)으로 이동<br>이동.02: 시장 결과 클릭 시 시세 조회 화면(/market)으로 이동<br>계산식.01: "지금 많이 찾는 작물"은 (현재가-전일가)/전일가 등락률의 절대값 기준 내림차순 정렬 후 상위 8개 추출 | Registry: docs/ds/screen-registry.json<br>Route: /search<br>File: src/routes/search.tsx<br>Baseline: 2026-08-04 코드 기준<br>Source: src/lib/mock/crops.ts, src/lib/mock/markets.ts<br>⚠️ 확인 필요: CROPS/MARKETS가 목데이터로, 실제 API 연동 여부 확인 필요 |
| DS-1109 | 검색 결과 | SRC-001_search_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: /search<br>File: src/routes/search.tsx<br>Baseline: 2026-08-04 코드 기준<br>⚠️ 확인 필요: 검색/결과 클릭에 대한 별도 분석 이벤트 로깅 코드는 확인되지 않음 |
| DS-1109 | 검색 결과 | SRC-001_search_Default | Design | -배경색.01: 화면 배경 #FFFFFF (--background)<br>-높이.01: 검색 헤더 높이 52px, 하단 테두리 1px solid #E9ECEF<br>-배경색.02: 검색 입력창 배경 #F1F3F5, 모서리 완전 원형(rounded-full)<br>-높이.02: 입력창 내부 높이 36px(h-9)<br>-글자크기.01: 입력 텍스트 14px<br>-너비.01: 지우기 버튼(원형) 24px×24px, 배경 #ADB5BD, 글자 흰색<br>-글자크기.02: 섹션 제목 12px, 굵기 700, 색상 #6C757D (--muted-foreground)<br>-글자크기.03: 결과 행 이름 14px, 굵기 600<br>-배경색.03: 부류 배지 배경 #F0F9F0, 글자색 #3A8A3A, 크기 10px 굵기 700<br>-배경색.04: 등락 상승 배지 배경 #FFF5F5, 글자색 #E03131 (--price-up)<br>-배경색.05: 등락 하락 배지 배경 #EDF2FF, 글자색 #1971C2 (--price-down)<br>-배경색.06: 등락 보합 배지 배경 #F1F3F5, 글자색 #6C757D<br>-너비.02: 결과 행 아이콘 박스 36px×36px, 모서리 8px(rounded-lg), 배경 #F8F9FA (--surface)<br>-테두리.01: 결과 목록 항목 사이 구분선 1px solid #E9ECEF (divide-border)<br>-글자색.01: 하이라이트 텍스트 색상 #3A8A3A, 굵기 700, 배경 투명 | Registry: docs/ds/screen-registry.json<br>Route: /search<br>File: src/routes/search.tsx<br>Baseline: 2026-08-04 코드 기준<br>토큰 참조: --background, --muted-foreground, --surface, --price-up, --price-down |
| DS-1110 | 검색 결과 | SRC-001_search_Empty | Visible | 문구.01: "검색 결과가 없어요"<br>문구.02: "다른 키워드로 검색해보세요" | Registry: docs/ds/screen-registry.json<br>Route: /search<br>File: src/routes/search.tsx<br>Baseline: 2026-08-04 코드 기준<br>기술 참조: EmptyResults |
| DS-1110 | 검색 결과 | SRC-001_search_Empty | Invisible | 진입조건.01: 검색어가 입력됐지만 작물·시장 결과가 모두 0건일 때 표시된다 | Registry: docs/ds/screen-registry.json<br>Route: /search<br>File: src/routes/search.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-1110 | 검색 결과 | SRC-001_search_Empty | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: /search<br>File: src/routes/search.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-1110 | 검색 결과 | SRC-001_search_Empty | Design | -너비.01: 안내 아이콘 원형 배경 64px×64px, 배경 #F1F3F5<br>-아이콘크기.01: 검색 아이콘 28px×28px, 색상 #ADB5BD<br>-글자크기.01: 안내 문구1 15px, 굵기 700<br>-글자크기.02: 안내 문구2 12px, 색상 #6C757D (--muted-foreground)<br>-내부여백.01: 컨테이너 상하 padding 80px, 좌우 24px<br>-외부여백.01: 아이콘-문구1 간격 16px(mt-4), 문구1-문구2 간격 4px(mt-1) | Registry: docs/ds/screen-registry.json<br>Route: /search<br>File: src/routes/search.tsx<br>Baseline: 2026-08-04 코드 기준<br>기술 참조: EmptyResults<br>토큰 참조: --muted-foreground |

Confluence 등록 시 같은 Screen ID의 연속 행에 있는 DS No. · Section명 · Screen ID 셀은 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## SEL-001 — 부류·품목·품종 선택

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-1111 | 부류·품목·품종 선택 | SEL-001_crop-select_Default | Visible | 정의.01: 홈/시세/통계/예측 등 여러 화면에서 공용으로 진입하는 부류→품목→품종 3단계 선택 화면<br>구성.01: 상단 뒤로가기 버튼<br>구성.02: 3단계 스텝 인디케이터("부류 선택"/"품목 선택"/"품종 선택", 완료 단계는 체크 표시)<br>제목.01: "작물을 선택해 주세요"("작물" 강조색)<br>문구.01: 단계별 부제(1단계 "먼저 부류를 선택해 주세요", 2단계 "선택한 부류에서 품목을 골라주세요", 3단계 "선택한 품목의 품종을 선택해 주세요")<br>검색.01: 각 단계 상단에 검색 입력창(플레이스홀더는 단계별 상이: "부류를 검색하세요"/"품목을 입력하세요"/"품종을 검색하세요")<br>목록항목.01: 1단계에 검색어가 없을 때 부류 카드 2열 그리드(부류 아이콘, 이름, 하위 품목 개수 배지)<br>목록항목.02: 1단계에 검색어가 있을 때 부류/품목/품종 통합 검색 결과 목록(상위 경로를 "부류 › 품목 › 품종" 형식으로 표시)<br>목록항목.03: 2단계에 상위 선택 칩(부류명, 제거 버튼 포함)과 품목 목록(선택 시 체크 아이콘)<br>목록항목.04: 3단계에 상위 선택 칩(부류·품목명)과 "전체 품종" 포함 품종 목록(라디오 형태)<br>버튼.01: 하단 고정 CTA — 1·2단계는 "다음", 3단계는 진입 경로(from)별 라벨("확인"/"예측 보기"/"적용하기")<br>상태표시.01: 하단 고정 영역에 현재까지 선택한 부류›품목›품종 요약을 표시하며 현재 단계의 항목을 강조색으로 표시 | Registry: docs/ds/screen-registry.json<br>Route: /crop-select<br>File: src/routes/crop-select.tsx<br>Baseline: 2026-08-04 코드 기준<br>기술 참조: CropSelectPage, Stepper, Step1Category, Step2Item, Step3Variety, BottomBar |
| DS-1111 | 부류·품목·품종 선택 | SEL-001_crop-select_Default | Invisible | 진입조건.01: 쿼리 파라미터 from(진입 화면명)과 return(복귀 경로)을 받아 동작을 분기한다<br>초기값.01: 진입 시 committed(확정 선택) 값을 draft(임시 선택)로 복사해 편집을 시작한다<br>초기값.02: committed에 품종·품목·부류가 있으면 각각 3·3·2단계로 시작 단계를 결정하고, 없으면 1단계로 시작한다<br>데이터소스.01: 부류·품목·품종 데이터는 src/lib/catalog-service의 getCategories/getItemsByCategory/getItemById/searchAll을 통해서만 조회한다(원본 배열 직접 조작 금지)<br>검증.01: 부류를 다른 값으로 바꾸면 하위 품목·품종 선택은 초기화되고, 같은 부류를 다시 선택하면 하위 선택은 유지된다<br>검증.02: 품목을 다른 값으로 바꾸면 품종 선택은 초기화되고, 같은 품목을 다시 선택하면 품종은 유지된다<br>분기.01: 품목에 품종이 없거나(hasNoVariety) 품종 목록이 비어 있으면 품종을 자동으로 "전체 품종(ALL)"으로 지정하고 바로 적용 처리한다<br>분기.02: 검색 결과에서 항목을 선택하면(handleSearchJump) 부류·품목·품종을 한 번에 지정하고, 품종이 없는 품목이면 2단계로, 있으면 3단계로 이동한다<br>액션.01: 뒤로가기(헤더 버튼 또는 브라우저 뒤로가기)는 2·3단계에서는 이전 단계로 이동하고, 1단계에서는 draft를 버리고 return 경로로 이동한다<br>자동동작.01: 단계 전환 시 브라우저 히스토리에 상태를 push하여 뒤로가기 동작과 단계 전환을 동기화한다<br>저장.01: 최종 확정(handleApply) 시 draft를 committed로 저장하고, 선택한 부류·품목·품종 정보를 시세 필터 스토어(useMarketFilter)에 반영한다<br>성공.01: from이 통계/통계상세가 아닌 경우 "조건을 적용했어요" 토스트를 표시한다(통계 계열은 무음 처리)<br>이동.01: from이 statistics 또는 statistics-detail이면 확정 후 해당 품목/품종의 통계 상세 화면(/statistics/$variety)으로 이동한다<br>이동.02: 그 외의 경우 확정 후 return 경로(기본값 "/")로 이동한다<br>조건.01: return 값이 "/"로 시작하지 않으면 기본 경로 "/"를 사용한다 | Registry: docs/ds/screen-registry.json<br>Route: /crop-select<br>File: src/routes/crop-select.tsx<br>Baseline: 2026-08-04 코드 기준<br>Store: src/store/cropSelection.ts, src/store/market.ts(useMarketFilter)<br>Source: src/lib/catalog-service.ts, src/lib/mock/catalog.ts |
| DS-1111 | 부류·품목·품종 선택 | SEL-001_crop-select_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: /crop-select<br>File: src/routes/crop-select.tsx<br>Baseline: 2026-08-04 코드 기준<br>⚠️ 확인 필요: 단계 전환/선택/적용 완료에 대한 별도 분석 이벤트 로깅 코드는 확인되지 않음 |
| DS-1111 | 부류·품목·품종 선택 | SEL-001_crop-select_Default | Design | -배경색.01: 화면 배경 #F7F8FA<br>-너비.01: 컨테이너 최대너비 430px<br>-너비.02: 뒤로가기 버튼(원형) 40px×40px<br>-아이콘크기.01: 뒤로가기 아이콘 24px×24px(h-6 w-6)<br>-너비.03: 스텝 원(활성/완료/비활성) 32px×32px, 모서리 완전 원형<br>-배경색.02: 활성 스텝 배경 #2E9E6B, 글자 흰색<br>-테두리.01: 완료 스텝 테두리 2px solid #2E9E6B, 배경 흰색, 글자 #2E9E6B<br>-배경색.03: 비활성 스텝 배경 #E5E7EB(gray-200), 글자 #9CA3AF(gray-400)<br>-높이.01: 스텝 연결선 두께 2px, 완료 시 배경 #2E9E6B, 미완료 시 #E5E7EB<br>-글자크기.01: 스텝 라벨 11px, 활성/완료 시 색상 #2E9E6B<br>-글자크기.02: 화면 제목 26px(1.625rem), 굵기 800(font-extrabold)<br>-글자색.01: 제목 강조색("작물") #2E9E6B<br>-글자크기.03: 부제 14px, 색상 #6B7280(gray-500)<br>-높이.02: 검색 입력창 높이 48px(h-12), 테두리 1px solid #E5E7EB(gray-200), 모서리 완전 원형<br>-아이콘크기.02: 검색 아이콘 16px×16px, 색상 #9CA3AF<br>-내부여백.01: 카드(부류/품목/품종 목록) 내부 padding 16px, 배경 흰색, 테두리 1px solid #E5E7EB, 모서리 16px(rounded-2xl)<br>-최소크기.01: 부류 카드 최소 높이 56px, 선택 시 테두리 #2E9E6B·배경 #F0FAF4, 비선택 시 테두리 #E5E7EB<br>-최소크기.02: 품목/품종 행 최소 높이 52px, 모서리 12px(rounded-xl)<br>-너비.04: 선택 체크 아이콘(원형) 20px×20px, 배경 #2E9E6B<br>-너비.05: 상위 선택 칩(UpperChip) 높이 32px, 배경 #EAF6EF, 글자 #2E9E6B, 크기 13px 굵기 600, 모서리 완전 원형<br>-외부여백.01: 하단 고정 CTA 영역 상하 padding 12px, 좌우 24px, 하단 env(safe-area-inset-bottom)+12px 추가, 배경 #F7F8FA<br>-배경색.04: CTA 버튼 배경 #2E9E6B, 비활성 시 배경 #E5E7EB·글자 #9CA3AF<br>-반응형.01: 헤더/CTA는 뷰포트 폭과 무관하게 최대 430px 컨테이너 기준으로 고정 | Registry: docs/ds/screen-registry.json<br>Route: /crop-select<br>File: src/routes/crop-select.tsx<br>Baseline: 2026-08-04 코드 기준<br>기술 참조: Stepper, Step1Category, Step2Item, Step3Variety, BottomBar, UpperChip, SearchInput |

Confluence 등록 시 같은 Screen ID의 연속 행에 있는 DS No. · Section명 · Screen ID 셀은 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## 분석 파일

- src/routes/__root.tsx
- src/components/app-shell.tsx
- src/components/app-header.tsx
- src/components/bottom-nav.tsx
- src/components/app-drawer.tsx
- src/components/detail-header.tsx
- src/routes/search.tsx
- src/routes/crop-select.tsx
- src/store/cropSelection.ts
- src/lib/catalog-service.ts
- src/styles.css

## 미구현·확인필요 요약

- 미구현(Invisible -미구현): 0건
- ⚠️ 확인 필요: 5건 (LAY-003 Tracking 1건, LAY-004 Tracking 1건, NAV-001 Tracking 1건, SRC-001 Default Invisible 1건, SEL-001 Tracking 1건)
