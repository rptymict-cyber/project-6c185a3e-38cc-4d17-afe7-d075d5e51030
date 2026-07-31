# 메뉴별 DS 문서 + 확장 Screen Registry 생성

문서 파일만 생성합니다. UI·기능·라우트 코드는 수정하지 않습니다.

## 생성 파일

1. `docs/ds/screen-registry.json` — 기존 파일을 요청된 필드 스키마로 확장 재작성
2. `docs/ds/pages/{menu-key}.md` — `menu-inventory.json`의 상위 메뉴 1개당 정확히 1개 (총 14개)

```text
docs/ds/pages/
  home.md  market.md  live.md  watchlist.md  statistics.md
  prediction.md  news.md  weather.md  notifications.md  settings.md
  common-layout.md  common-state.md  common-modal.md  common-auth.md
```

## Registry 스키마

각 화면 상태 1건 = 1 레코드. 필드 순서 고정:
`dsNo`, `screenId`, `menuId`, `menuName`, `dsFile`, `sectionId`, `sectionName`, `route`, `state`, `file`, `deprecated`.

- 기존 `screen-registry.json`에 이미 확정된 52개 `screenId`는 그대로 유지하고 신규 필드만 추가합니다.
- 아직 등록되지 않은 화면(`/crop-select`, `/search`, `/compare`, `/grades`, `/price/$variety`, `/live`, `/settings`, 각 메뉴 내부 탭·시트 등)은 기존 기능약어 체계를 이어 신규 ID를 부여합니다.
- 동적 세그먼트는 `id`로 정규화, 상태는 코드에 실제 구현된 분기만 등록(추측 금지).
- `screenId`는 route/file 변경과 무관하게 고정되는 키로 취급하고, route·file은 참조 필드로만 둡니다.

## DS 문서 형식

각 메뉴 문서는 Screen ID 묶음별로 아래 6컬럼 표를 사용합니다.

`DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고`

- 동일 Screen ID에 대해 Visible / Invisible / Tracking / Design 4행을 각각 작성하고, DS No.·Section명·Screen ID를 매 행 반복(마크다운 셀 병합 없음).
- 각 표 아래에 "Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No.·Section명·Screen ID 셀만 세로 병합 가능. 구분·상세 사양·비고는 병합 대상 아님." 안내 문구 삽입.
- 상세 사양은 `라벨.01: 내용` 형식, 지정된 라벨 집합만 사용, 해당 항목이 없는 구분은 `-`.
- 비고에는 `Registry: docs/ds/screen-registry.json`, `Route:`, `File:`, `Baseline:` 을 실제 값으로 기록하고 필요 시 `Source/Store/Components` 추가.
- 같은 Screen ID를 두 문서에 중복 기재하지 않습니다. 공통 화면은 `common-*` 문서에만 둡니다.

## 분석 방법

메뉴별로 라우트 파일과 그 하위 컴포넌트를 직접 읽어 문구·버튼·조건부 렌더링·핸들러·이동·store/storage 접근·Empty 분기·클래스/토큰을 그대로 옮깁니다. mock 데이터(`src/lib/mock/*`), TODO, 미연결 버튼은 `미구현.01` 로, 코드로 판단 불가한 업무 규칙은 `확인필요.01` 로 분리합니다. 작업량이 크므로 메뉴 단위로 병렬 조사한 뒤 문서를 작성합니다.

## 완료 보고

메뉴 수, 생성 DS 파일 수, Screen ID 수, 상태별 수, 분석 파일 수, mock/TODO/미연결 수, 확인 필요 수, DS 없는 메뉴, 공통 화면 검토 후보만 보고합니다.
