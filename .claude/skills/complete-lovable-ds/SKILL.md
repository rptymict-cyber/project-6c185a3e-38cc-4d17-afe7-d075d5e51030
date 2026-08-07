---
name: complete-lovable-ds
description: Lovable이 생성한 전체 메뉴 DS 초안을 실제 Git 코드와 비교하여 순서대로 검증·수정·완성한다. "complete-lovable-ds 스킬을 사용해줘", "/complete-lovable-ds", "첫 미완료 메뉴부터 DS 작업 끝까지 완료해줘" 요청 시 사용.
---

# complete-lovable-ds

Lovable DS 초안(`docs/ds/pages/*.md`)을 실제 코드와 대조하여 메뉴별로 검증·수정하고,
Confluence용 HTML과 전달 파일을 만드는 무인 실행 스킬이다.

**상세 규칙은 전부 [references/ds-spec.md](references/ds-spec.md)에 있다. 메뉴 하나를 실제로
수정하기 전에 반드시 그 문서를 먼저 읽는다.** 이 SKILL.md는 실행 순서만 담는다.

## 실행 전 확인

- 사용자에게 메뉴명, Menu ID, order, 경로, 다음 진행 여부를 묻지 않는다. 필요한 정보는
  `docs/ds/menu-inventory.json`, `docs/ds/screen-registry.json`, `docs/ds/pages/*.md`,
  `docs/ds/ds-menu-progress.md`에서 직접 읽는다.
- 병렬 에이전트나 여러 메뉴 동시 처리를 쓰지 않는다. 메뉴는 하나씩, `menu-inventory.json`의
  `order` 순서대로 처리한다.
- 애플리케이션 코드(`src/**`)는 절대 수정하지 않는다. 읽기만 한다.
- `git reset`, `git clean`, `git checkout --`, `git stash`를 실행하지 않는다.
- 기존 파일을 삭제하거나 덮어쓰지 않는다(Downloads 전달 시 버전 접미사 규칙은 ds-spec.md 참고).
- 비밀정보, `.env`, 인증 토큰을 읽거나 출력하지 않는다.
- main에 직접 push할지 여부는 실행 컨텍스트에 따른다 — 사용자가 대화형으로 이 스킬을
  호출한 경우 기존 커밋/푸시 정책(사용자 승인 필요)을 따르고, 사전에 승인된 예약 클라우드
  실행(자동화 브랜치 지정된 실행)에서는 지정된 전용 브랜치에만 커밋·푸시한다.

## 실행 순서

1. **재개 지점 파악**: `docs/ds/ds-menu-progress.md`를 읽는다. `상태`가 `대기` 또는
   `재검증 필요`인 첫 메뉴를 order 순서로 찾는다. `완료`로 표시된 메뉴도 아래 3번 검사가
   실패하면 그 자리에서 `재검증 필요`로 바꾸고 그 메뉴부터 다시 처리한다. 모든 메뉴가
   `완료`이면 8번(최종 보고)으로 바로 간다.

2. **해당 메뉴 착수 기록**: 체크포인트에서 해당 메뉴 행의 `상태`를 `진행 중`으로 갱신한다.

3. **현재 상태 검증**:
   ```
   node docs/ds/scripts/validate-ds.mjs <menuId>
   ```
   MD 표 구조, DS No. 중복·누락, Registry `dsNos` 일치, 한 셀 복수 라벨 여부를 즉시 확인한다.

4. **코드 대조**: `docs/ds/menu-inventory.json`에서 해당 메뉴의 `routes`/`screenIds`를 확인하고,
   관련 route/page/component/store/service/API/tracking/style 파일만 연다(다른 메뉴 파일은
   열지 않는다). `references/ds-spec.md`의 검증 기준·구분 기준·표 형식·쉬운 한국어 규칙에
   따라 MD와 Registry를 수정한다.

5. **재검증**: 3번을 다시 돌려 이슈가 0이 될 때까지 반복한다.

6. **HTML 재생성**:
   ```
   node docs/ds/scripts/md-to-confluence.mjs <menuId>
   ```

7. **전달 및 비교**:
   ```
   node docs/ds/scripts/deliver-ds.mjs <menuId> --mode=<local|cloud>
   ```
   로컬 실행 가능 환경이면 `local`, PC 종료 상태를 전제로 한 클라우드 예약 실행이면
   `cloud`를 쓴다. 이 스크립트가 MD·HTML 행 수/DS No. 집합 일치, 전달 파일 무결성을
   검사한다.

8. **체크포인트 갱신**: 해당 메뉴 행에 order, menuId, 한국어 메뉴명, DS 파일, Screen ID 수,
   DS No. 수, 상태(`완료`/`실패`), 마지막 검증 Git 커밋, 완료 시각, 오류, 확인 필요 항목,
   결과 파일 경로를 기록한다. 오류가 발생한 메뉴는 `실패`로 기록하고 원인을 남긴 뒤
   **다음 메뉴로 계속 진행한다**(중단하지 않는다).

9. **커밋**: 변경 파일을 커밋한다. 예약된 클라우드 실행 컨텍스트에서는 실행 시작 시 지정된
   자동화 브랜치에 커밋·푸시한다. 대화형 실행에서는 저장소의 일반 커밋/푸시 승인 절차를
   따른다.

10. **다음 메뉴로 자동 진행**: 1번으로 돌아가 다음 미완료 메뉴를 처리한다.

11. **전체 완료 시 최종 보고**: 모든 메뉴가 `완료` 또는 `실패`로 끝나면:
    ```
    node docs/ds/scripts/validate-ds.mjs --all
    node docs/ds/scripts/deliver-ds.mjs --report --mode=<local|cloud>
    ```
    전체 DS No. 중복·누락, Registry 일치, MD·HTML 일치 결과와 `Confluence_업로드_목록`
    경로를 포함한 최종 보고를 만든다(경로는 `references/ds-spec.md`의 "결과 전달" 절 참고).
