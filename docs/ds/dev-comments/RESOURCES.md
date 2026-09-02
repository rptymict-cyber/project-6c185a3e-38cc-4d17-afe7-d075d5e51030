# AGDICT 연결 리소스 — 고정 대상

이 문서는 AGDICT 개발자 DS 댓글 대응에서 매번 다시 묻지 않고 조회할 고정
리소스를 기록한다. 실행 절차와 판정 기준은 [`WORKFLOW.md`](WORKFLOW.md)를
따른다.

## Lovable

- 프로젝트명: `MVP_농산물 시세 예측 서비스`
- Project ID: `6c185a3e-38cc-4d17-afe7-d075d5e51030`
- Project URL: `https://lovable.dev/projects/6c185a3e-38cc-4d17-afe7-d075d5e51030`

확인 원칙:

- 링크를 다시 사용자에게 요구하지 않고 가능한 도구로 프로젝트 상태, 최신
  edit/commit SHA, 관련 파일 원문을 직접 조회한다.
- 필요하면 프리뷰 정보나 스크린샷을 별도로 확인한다.
- Lovable 파일을 읽은 것과 프리뷰 화면을 직접 본 것을 구분한다.
- GitHub와 Lovable이 같다고 가정하지 않는다.

## GitHub

- Repository: `rptymict-cyber/project-6c185a3e-38cc-4d17-afe7-d075d5e51030`
- 기본 브랜치: `main`
- URL: `https://github.com/rptymict-cyber/project-6c185a3e-38cc-4d17-afe7-d075d5e51030`

확인 원칙:

- 현재 `main` HEAD SHA와 실제 파일을 기준으로 한다.
- DS 비고의 Route/File 및 개발자가 제시한 gap/drift/helper 문서 존재 여부를
  확인한다.
- 보조 문서가 없어도 실제 코드로 검증할 수 있으면 검토를 계속한다.

## Confluence 상세 사양서

- Site: `https://tymict1.atlassian.net`
- Space Key: `AAI`
- Space Name: `농산물 AI 시세 예측 서비스`
- 상세 사양서 Parent Page ID: `2344059073`
- Parent Page: `상세 사양서`
- Parent URL: `https://tymict1.atlassian.net/wiki/spaces/AAI/pages/2344059073`

확인 원칙:

- 현재 DS 원문이 필요하면 Parent 아래 해당 하위 페이지의 최신 내용을 조회한다.
- 댓글 링크, 페이지 링크 또는 메뉴명만 받아도 위 Parent와 Space를 기준으로 필요한
  페이지를 찾는다.

## 사용자에게 다시 묻지 않을 값

- Lovable Project ID
- GitHub Repository와 기본 브랜치
- Confluence Site와 Space Key
- 상세 사양서 Parent Page ID

## 접근 실패 처리

- 접근 성공: 실제 조회 결과를 사용한다.
- 인증 만료: 인증 만료라고 명시한다.
- 권한 없음: 권한 없음이라고 명시한다.
- Connector 미지원: 확인 불가라고 명시한다.
- 일부 소스만 가능: 확인된 소스와 미확인 소스를 분리한다.

## 보안

PAT, Atlassian API Token, Lovable 인증 토큰, 비밀번호, 세션 쿠키, `.env` 비밀값,
기타 secret/key는 이 문서나 작업 결과에 저장·출력하지 않는다.


