# 전체 사용자 메뉴 인벤토리 생성

`docs/ds/menu-inventory.json` 한 개 파일만 생성합니다. UI·기능·라우트 코드는 수정하지 않습니다.

## 분석 근거 (이미 확인한 코드)

- 하단 GNB: `src/components/bottom-nav.tsx` — 홈 / 시세 / 즐겨찾기 / 통계 / 설정
- 더보기 드로어: `src/components/app-drawer.tsx` — AI 시세 예측, 실시간 시세, 시세 조회, 도매시장별, 품목별, 시장별 가격 비교, 즐겨찾기, 통계, 농업 뉴스, 날씨, 설정, 데이터 기준 안내
- 공통 레이아웃/헤더: `src/components/app-shell.tsx`, `src/components/app-header.tsx`
- 라우트 전체: `src/routes/*` (파일 기반 라우팅)
- 기존 화면 원장: `docs/ds/screen-registry.json`

## 상위 메뉴 판정 규칙 적용

- 내비게이션(하단 GNB·드로어)에서 독립 진입하는 기능만 상위 메뉴로 승격
- 메뉴 내부의 목록/상세/탭/시트/모달은 해당 상위 메뉴의 `routes`에 흡수
- 내비게이션에 노출되지 않는 route(예: `/crop-select`, `/search`, `/compare`, `/grades`, `/price/$variety`, `/notifications*`)는 귀속되는 상위 메뉴 아래로 포함
- 귀속이 애매한 항목은 `"commonReview": true`로 표시

## 예정 상위 메뉴 (10개)

home, market(시세: /market·/market/item·/market/wholesale·/market/$crop·/market/auction/$id·/compare·/market-compare·/grades·/price/$variety), live, watchlist, statistics, prediction, news, weather, notifications, settings(+/data-guide)

## 공통 메뉴 그룹 (3개)

- `common-layout` — AppShell, AppHeader, BottomNav, AppDrawer
- `common-state` — zustand 스토어(`src/store/*`), 즐겨찾기/작물선택 등 전역 상태
- `common-modal` — DatePickerSheet, MarketSheet, CorporationSheet 등 공용 시트
- 인증 그룹은 현재 코드에 로그인 화면이 없으므로 `common-auth`를 `status: "not-implemented"`로만 기록

## JSON 필드

각 항목: `order`, `menuId`, `menuName`, `routes[]`, `dsFile`(`docs/ds/pages/{menu-key}.md`), `screenIds: []`, `common`(boolean), 필요 시 `commonReview`.

`screen-registry.json`과 메뉴별 DS 파일은 이번 단계에서 만들지 않습니다.

## 완료 보고

순서 | Menu ID | 메뉴명 | Route | 포함 화면 후보 | DS 파일 | 공통 여부 표 하나만 보고합니다.
