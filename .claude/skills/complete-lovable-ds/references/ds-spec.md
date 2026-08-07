# DS 상세 사양 규칙

`complete-lovable-ds` 스킬이 메뉴를 실제로 검증·수정할 때 따르는 상세 규칙이다.
[SKILL.md](../SKILL.md)의 실행 순서에서 참조한다.

## 1. 메뉴별 코드 검증

- 현재 처리 중인 메뉴와 직접 관련된 파일만 읽는다: route, page, component, store,
  service, API, tracking, style. 다른 메뉴 파일은 열지 않는다.
- DS No.를 기본키로 쓴다. Screen ID와 구분(Visible/Invisible/Tracking/Design)은 보조키다.
- 상세 사양 항목 하나마다 고유 DS No. 하나를 발급한다.
- 상세 사양 항목 하나를 표 한 행으로 작성한다.
- 하나의 Screen ID에 여러 DS No.가 연결되는 것은 정상이다.
- Screen ID마다 Visible/Invisible/Tracking/Design 네 행을 강제로 만들지 않는다 —
  실제 코드에 존재하는 사양만 쓴다.
- Registry의 `dsNos` 배열과 메뉴 MD의 DS No. 집합을 정확히 일치시킨다.
- 중복 DS No.는 수정하고, 누락 DS No.는 추가한다.
- 한 셀에 여러 라벨이 들어간 행은 분리한다.
- 잘못 연결된 Screen ID는 수정한다.
- 코드와 다른 사양은 코드에 맞게 수정한다.
- 코드에는 있으나 문서에 빠진 사양은 기존 형식에 맞는 **신규** DS No.를 발급해서 추가한다.
- 기존 번호는 임의로 변경하지 않는다. 삭제된 번호는 재사용하지 않는다.
- 코드에 없는 내용은 추측하지 않는다 — 불확실하면 §2의 규칙대로 비고에 남긴다.

## 2. 쉬운 한국어

- 기획자·운영자가 코드를 몰라도 바로 이해할 수 있는 자연스러운 한국어로 쓴다.
- 컴포넌트명, 함수명, 변수명, props, JSX, Tailwind 클래스를 본문 설명의 주어로 쓰지 않는다.
- 화면 원문, 함수명, 이벤트명, API, route, 파일 경로, 토큰, HEX처럼 정확성이 필요한 값만
  영어/원문 그대로 유지한다.
- 기술 식별자(함수명, 변수명, 파일 경로 등 근거)는 비고의 `기술근거.NN:`에 기록한다.
- 불확실한 내용은 상세 사양에 넣지 않는다. 비고의 `⚠️ 확인 필요.NN:`에 기록한다.

## 3. 표 형식

열 순서: `DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고`

상세 사양 셀 형식: `-라벨.NN: 내용`

규칙:
- 한 셀에는 상세 사양 항목 하나만 쓴다.
- 하이픈(`-`) 앞에 공백을 넣지 않는다.
- 여러 항목을 `<br>`로 합치지 않는다(항목당 별도 행).
- 빈 줄을 넣지 않는다.
- 정의가 없으면 빈 구분 행을 만들지 않는다.
- DS No., 구분, 상세 사양, 비고는 병합하지 않는다.
- 같은 Screen ID의 연속 행에서는 Section명과 Screen ID만 세로 병합한다(Confluence HTML
  기준. MD 표 자체는 매 행에 값을 채워 쓰고, `md-to-confluence.mjs`가 HTML 변환 시
  rowspan으로 병합한다).

## 4. Screen ID와 Registry

- 기존 확정 Screen ID는 변경하지 않는다.
- 신규 Screen ID 형식: `기능영역약어-일련번호_라우트키_상태값`
- 허용 상태값: `Default`, `Loading`, `Empty`, `Error`
- 화면 제목(MD의 `## Screen ID — 한국어 화면명 · 한국어 상태명`) 형식을 지킨다.
- Registry `schemaVersion`은 `4.0`을 유지한다.
- Screen 엔트리는 단일 `dsNo`가 아니라 전체 DS No.를 담은 `dsNos` 배열을 쓴다.
- Registry의 `dsNos`와 메뉴 MD의 DS No. 집합을 정확히 일치시킨다.

## 5. 구분 기준

- **Visible**: 실제 화면에 표시되는 정의, 구성, 제목, 문구, 버튼, 입력, 목록, 표, 배지, 안내.
- **Invisible**: 진입 조건, 초기값, 데이터 출처, API, 검증, 계산, 분기, 상태 전환, 액션,
  이동, 미구현.
- **Tracking**: 실제 추적 코드가 존재하는 이벤트와 호출 조건만 기록한다(코드에 없으면
  Tracking 행을 만들지 않는다).
- **Design**: 실제 색상 코드, 크기, 간격, 글꼴, 굵기, 행간, 자간, 테두리, 모서리, 그림자,
  반응형 값만 기록한다. 컴포넌트 구성 설명은 Design에 넣지 않는다.
- Tailwind 클래스와 CSS 변수는 최종 적용값으로 해석해서 쓰고, 원문 클래스명·토큰명은
  비고의 `기술근거.NN:`에 보존한다.

## 6. 메뉴별 결과 파일

- 최종 MD: `docs/ds/pages/{menu-key}.md`
- Confluence HTML: `docs/ds/pages/{menu-key}-ds-confluence.html`

HTML 규칙(`md-to-confluence.mjs`가 자동 적용):
- 최종 MD에서 직접 생성한다. 요약·재작성 금지.
- 열 순서 유지, 같은 Screen ID 연속 행에서 Section명·Screen ID만 세로 병합.
- DS No., 구분, 상세 사양, 비고는 병합하지 않는다.
- 전체 폭 사용, 열 비율 8% | 13% | 18% | 9% | 37% | 15%.
- 문서 끝 "미구현·확인필요 요약"을 최신 검증 결과로 갱신한다(MD의 `## 미구현·확인필요 요약`
  섹션을 그대로 옮긴다 — 실제 DS No.를 인용하고 있는지 반드시 재확인한다).

## 7. 결과 전달

로컬 실행 가능한 경우 결과 폴더:
`C:\Users\chlgk\Downloads\Lovable DS 최종본\두자리order_menuId_한국어메뉴명\`

규칙:
- 프로젝트 원본을 이동·삭제하지 않는다.
- 메뉴별 MD·HTML을 복사한다. 같은 파일이 있으면 덮어쓰지 않고 `_v2`, `_v3` 또는
  타임스탬프를 붙인다.
- 복사 후 존재 여부·파일 크기(>0)·원본과 내용 일치를 확인한다.
- MD와 HTML의 DS No. 집합, 행 수, 상세 사양을 비교한다.

PC 종료 상태를 전제로 한 클라우드 실행에서는 로컬 Downloads에 접근할 수 없으므로:
- GitHub 원격 저장소의 최신 main을 기준으로 작업하고, main에는 직접 쓰지 않는다.
- 전용 브랜치(`automation/complete-lovable-ds-20260807-2100`)에 최종 MD, HTML, 진행
  현황, 검증 결과, 업로드 목록을 저장한다.
- 완료 파일은 `docs/ds/output/Confluence_업로드_목록.md`에 만든다(로컬 실행 시에는
  `C:\Users\chlgk\Downloads\Lovable DS 최종본\Confluence_업로드_목록.md`).
- 로컬 Downloads 복사가 불가능한 경우 이를 성공한 것처럼 보고하지 않는다. 저장소 내부
  결과 경로와 다운로드 방법(브랜치명, 커밋)을 보고한다.

## 8. 체크포인트 형식

`docs/ds/ds-menu-progress.md` 표 열: `Order | Menu ID | 메뉴명 | DS 파일 | Screen ID 수 |
DS No. 수 | 상태 | 마지막 검증 Git 커밋 | 완료 시각 | 오류 | 확인 필요 항목 | 결과 파일 경로`

상태값: `대기` / `진행 중` / `완료` / `실패` / `재검증 필요`

- 완료로 표시된 메뉴도 MD·HTML·Registry·전달 파일 검사가 실패하면 `재검증 필요`로 바꾼다.
- 실행이 중단되었다가 재개되면 이 파일을 읽고 첫 `대기` 또는 `재검증 필요` 메뉴부터
  자동 재개한다.
