# DS 메뉴별 검증 진행 현황

Registry 기준(`docs/ds/screen-registry.json`, `docs/ds/menu-inventory.json`)으로 order
순서대로 자동 검증한다. 병렬 처리 없이 한 메뉴씩 순차 진행한다. 사용하는 스킬은
[complete-lovable-ds](../../.claude/skills/complete-lovable-ds/SKILL.md), 고정 스크립트는
`docs/ds/scripts/{validate-ds,md-to-confluence,deliver-ds}.mjs`.

재개 규칙: 상태가 `대기` 또는 `재검증 필요`인 첫 메뉴(order 순)부터 다시 시작한다.
`완료`로 표시된 메뉴도 검증 스크립트가 실패하면 그 자리에서 `재검증 필요`로 바꾼다.

상태값: 대기 / 진행 중 / 완료 / 실패 / 재검증 필요

| Order | Menu ID | 메뉴명 | DS 파일 | Screen ID 수 | DS No. 수 | 상태 | 마지막 검증 Git 커밋 | 완료 시각 | 오류 | 확인 필요 항목 | 결과 파일 경로 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 01 | home | 홈 | docs/ds/pages/home.md | 2 | 63 | 완료 | 3d30b51 | 미기록(체크포인트 형식 도입 이전 완료) | 없음 | DS-0154(위치 권한 거부 빈 상태, 코드상 도달 불가로 확정 — 기획 참고용) | docs/ds/pages/home.md, docs/ds/pages/home-ds-confluence.html |
| 02 | market | 시세 | docs/ds/pages/market.md | 22 | 323 | 완료 | 3d30b51 | 미기록(체크포인트 형식 도입 이전 완료) | 없음 | DS-0239·02127·02132·02142·02152·02163·02174(탭 미배선 연결계획), DS-0256·0258(품목없음 중복처리), DS-0296·02100(품목 미전달), DS-02113(법인가 mock), DS-0220·02199(위치조회 미구현), DS-02304·02307·02308·02309(알림 저장 로직 전환계획) | docs/ds/pages/market.md, docs/ds/pages/market-ds-confluence.html |
| 03 | live | 실시간 시세 | docs/ds/pages/live.md | 1 | 38 | 완료 | 3d30b51 | 미기록(체크포인트 형식 도입 이전 완료) | 없음 | 없음 | docs/ds/pages/live.md, docs/ds/pages/live-ds-confluence.html |
| 04 | watchlist | 즐겨찾기 | docs/ds/pages/watchlist.md | 3 | 92 | 완료 | 3d30b51 | 미기록(체크포인트 형식 도입 이전 완료) | 없음 | DS-0455·0456(빈 상태·검색결과없음 상태 구분 여부) | docs/ds/pages/watchlist.md, docs/ds/pages/watchlist-ds-confluence.html |
| 05 | statistics | 통계 | docs/ds/pages/statistics.md | 3 | 70 | 대기 | - | - | - | - | - |
| 06 | prediction | AI 시세 예측 | docs/ds/pages/prediction.md | 8 | 246 | 대기 | - | - | - | - | - |
| 07 | news | 농업 뉴스 | docs/ds/pages/news.md | 2 | 48 | 대기 | - | - | - | - | - |
| 08 | weather | 날씨 | docs/ds/pages/weather.md | 1 | 25 | 대기 | - | - | - | - | - |
| 09 | notifications | 알림 | docs/ds/pages/notifications.md | 6 | 175 | 대기 | - | - | - | - | - |
| 10 | settings | 설정 | docs/ds/pages/settings.md | 2 | 53 | 대기 | - | - | - | - | - |
| 11 | common-layout | 공통 레이아웃 | docs/ds/pages/common-layout.md | 11 | 244 | 대기 | - | - | - | - | - |
| 12 | common-state | 공통 전역 상태 | docs/ds/pages/common-state.md | 0(정의 없음) | 0(정의 없음) | 대기 | - | - | - | - | - |
| 13 | common-modal | 공통 모달·바텀시트 | docs/ds/pages/common-modal.md | 4 | 88 | 대기 | - | - | - | - | - |
| 14 | common-auth | 인증 | docs/ds/pages/common-auth.md | 0(미구현 메뉴) | 0(미구현 메뉴) | 대기 | - | - | - | - | - |

05~14의 Screen ID 수·DS No. 수는 아직 코드 대조 전인 Lovable 초안 기준 값이다(실제 검증 시
`node docs/ds/scripts/validate-ds.mjs <menuId>`로 재확인·갱신한다).

`node docs/ds/scripts/validate-ds.mjs --all` 기준 registry 전체 DS No. 1465건, 전역 중복 0건
(2026-08-07 확인, 위 3d30b51 커밋에서 확정).

## 메뉴별 처리 로그

### 01 home (완료)

- Registry 대조: MD 63행 = registry 63건, 중복/누락/Screen ID 오배정 없음.
- 수정 사항:
  - DS-0109: 상세 사양 셀에 이스케이프 없는 `|` 문자가 들어가 표가 깨져 있던 것을 `\|`로 이스케이프하고 원문(단위·출처·업데이트 문구 전체)을 복원.
  - DS-0154~0156(HOM-001_root_Empty): 코드 확인 결과 `src/store/location.ts`의 `requested` 초기값이 `true`로 고정되어 있어 `request()`가 항상 조기 반환되고, `setGranted`를 호출하는 코드가 전무함을 확인. 이에 따라 "위치 거부 빈 상태는 현재 코드에서 도달 불가능"이라는 확정 사실로 상세 사양·비고를 갱신(기존에는 "확인 불가"로만 모호하게 기재되어 있었음).
  - 문서 하단 Confluence 병합 안내 문구를 현재 규칙(Section명·Screen ID만 병합, DS No.는 병합 안 함)에 맞게 수정.
  - 미구현·확인필요 요약을 실제 DS No.로 재작성.
- HTML: docs/ds/pages/home-ds-confluence.html 생성(2 screens, 63 rows), 열 비율 8/13/18/9/37/15 적용, Section명·Screen ID만 rowspan 병합.
- Downloads: `Lovable DS 최종본/01_home_홈/home.md`, `home-ds-confluence.html` 복사 완료, 원본과 byte-diff 일치 확인. 폴더에 2026-08-05자 이전 버전(`home_v2.md`, `home-ds-confluence_v2.html`)이 이미 존재했으나 파일명이 달라 덮어쓰지 않음.
- 확인 필요: DS-0154(위치 권한 거부 빈 상태 — 코드상 도달 불가로 확정했으나 기획 의도 확인은 별개로 남겨둠).

### 02 market (완료)

- Registry 대조: 초기 322행 = registry 322건 일치, 중복/누락/Screen ID 오배정 없음.
- 코드 대조: MKT-001·002·003·004·005·006·012·013·014, AUC-001, CMP-001·002, GRD-001, PRC-001·002 라우트/컴포넌트 약 20개 파일을 직접 열어 문구·조건·이동·색상 대부분을 대조. MKT-007~011 탭 컴포넌트가 실제로 어떤 라우트에서도 import되지 않는다는 "미구현" 주장은 전체 소스에서 grep으로 재확인(정의부 외 참조 0건).
- 수정 사항:
  - 문서 끝 "미구현·확인필요 요약"에 적힌 DS No.가 전부 실제 항목과 맞지 않는 상태였음(예: 탭 미배선 근거로 DS-0202/0208~0212를 인용했으나 실제로는 무관한 행이었음). 6개 항목 전부 올바른 DS No.(DS-0239, DS-02127, DS-02132, DS-02142, DS-02152, DS-02163, DS-02174, DS-0256, DS-0258, DS-0296, DS-02100, DS-02113, DS-0220, DS-02199, DS-02304, DS-02307~09, DS-0212)로 재작성.
  - DS-0109(홈)과 같은 유형의 문제는 market.md에는 없었으나, DS-0209(차트 하단 안내 문구)가 코드의 4가지 분기(예측 표시/오늘 당일/다른날 당일/기타) 중 2가지만 기술하고 있어 나머지 2가지(당일 기간의 안내 문구 변형)를 추가.
  - 시세 상세(MKT-002_market-id_Default)에 등급 배지 색상(상/중/하) 사양이 없어 신규 DS-02323 발급, registry에도 추가.
  - 문서 전체(22개 Screen ID 섹션)의 Confluence 병합 안내 문구를 "Section명·Screen ID만 병합" 규칙으로 일괄 수정.
- HTML: docs/ds/pages/market-ds-confluence.html 생성(22 screens, 323 rows).
- Downloads: `02_market_시세/` 폴더에 2026-08-05자 파일이 이미 있어 `market_v2.md`, `market-ds-confluence_v2.html`로 저장, 원본과 byte-diff 일치 확인.
- 확인 필요(코드로 해소 불가, 기획 확인 필요 — 문서에 비고로 보존): MKT-007~011 탭 연결 계획, /market/$crop 품목없음 중복 처리 정책, /market/wholesale 품목 미전달 의도 여부, /price/$variety/alert 레거시·신규 스키마 전환 계획.

### 03 live (완료)

- Registry 대조: MD 38행 = registry 38건 일치, 중복/누락/Screen ID 오배정 없음.
- 코드 대조: src/routes/live.tsx, LivePriceRow.tsx, live-prices.ts, LoadMoreButton.tsx 전부 확인. LIST_PAGE_SIZE=50, POOL 20건, 정렬·오프셋 로직 등 모든 상세 사양이 코드와 정확히 일치.
- 수정 사항:
  - 문서 하단 "미구현·확인필요 요약"이 두 항목 모두 DS-0301(정의 행)을 근거로 인용하고 있었음(market.md와 동일한 유형의 오류). 실제 해당 내용을 담은 DS-0318, DS-0319로 각각 정정.
  - Confluence 병합 안내 문구를 현재 규칙에 맞게 수정.
- HTML: docs/ds/pages/live-ds-confluence.html 생성(1 screen, 38 rows).
- Downloads: `03_live_실시간 시세/`에 기존 파일이 있어 `live_v2.md`, `live-ds-confluence_v2.html`로 저장, byte-diff 일치 확인.
- 확인 필요: 없음.

### 04 watchlist (완료)

- Registry 대조: MD 92행 = registry 92건 일치, 중복/누락/Screen ID 오배정 없음.
- 코드 대조: src/routes/watchlist.index.tsx, watchlist.add.tsx, favoriteStore.ts를 전문 대조. 문구·조건·색상·수치가 코드와 거의 완전히 일치하는 매우 높은 품질의 초안이었음(즐겨찾기 카드 배지 포맷, 편집모드 헤더 3요소, 8kg 고정 단위, isPredictable 항상 false 저장 등 세부까지 정확).
- 수정 사항:
  - Confluence 병합 안내 문구 정정.
  - 문서 하단 요약에 실제 DS No.를 추가하고, 이미 해소된 "FAV-001 트래킹 로깅 여부" 확인필요 항목은 트래킹 코드가 실제로 없음이 코드로 확정되므로 제거(미구현 항목과 중복이었음).
- HTML: docs/ds/pages/watchlist-ds-confluence.html 생성(3 screens, 92 rows).
- Downloads: `04_watchlist_즐겨찾기/`에 기존 파일이 있어 `watchlist_v2.md`, `watchlist-ds-confluence_v2.html`로 저장, byte-diff 일치 확인.
- 확인 필요: FAV-001 빈 상태와 검색결과 없음 상태 구분 여부(DS-0455, DS-0456) — 기획 확인 필요 항목으로 보존.

### 인프라 준비 로그 (2026-08-07)

- `complete-lovable-ds` Claude Code 스킬 생성(`.claude/skills/complete-lovable-ds/SKILL.md` +
  `references/ds-spec.md`).
- 고정 스크립트를 `docs/ds/`에서 `docs/ds/scripts/`로 이동하고 ROOT 경로 계산을 한 단계 더
  깊은 디렉터리에 맞게 수정: `validate-ds.mjs`, `md-to-confluence.mjs`, 신규 `deliver-ds.mjs`.
- 이동 과정에서 실제 버그 발견·수정: `validate-ds.mjs`가 모듈 최상단에서 무조건 `main()`을
  호출하고 있어, `md-to-confluence.mjs`가 이를 `import`할 때마다 `md-to-confluence`의
  `process.argv`를 `validate-ds`가 가로채 검증만 수행한 뒤 `process.exit()`으로 조기
  종료시키는 문제가 있었음(HTML이 실제로는 재생성되지 않고 있었음). 엔트리포인트 가드를
  추가해 `import` 시에는 `main()`이 실행되지 않도록 수정.
- 수정 후 `node docs/ds/scripts/validate-ds.mjs --all` 전체 14개 메뉴 재실행 결과 이슈 0건,
  registry 전체 DS No. 1465건(전역 중복 0건) 확인.
- home/market/live/watchlist 4개 메뉴 HTML을 재생성해 기존 파일과 byte-diff 동일함(idempotent)
  확인.
- `deliver-ds.mjs`를 cloud 모드(home)와 local 모드(home)로 각각 실행해 정상 동작 확인.
  local 모드 실행 시 `Lovable DS 최종본/01_home_홈/`에 이미 있던 서로 다른 두 버전의
  `home-ds-confluence.html`(기존 파일, `_v2`)을 덮어쓰지 않고 `_v3`로 저장함(버전 충돌 방지
  로직 정상 동작).
