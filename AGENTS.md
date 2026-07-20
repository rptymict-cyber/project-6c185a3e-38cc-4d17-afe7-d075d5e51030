<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Date picker convention

날짜를 선택하는 어떤 신규 기능을 만들든, 새로운 캘린더나 날짜 그리드를 직접
구현하지 말고 반드시 `src/components/date-picker-sheet.tsx`
(`DatePickerSheet`)를 재사용한다. 필요한 옵션(퀵 버튼 유무, 데이터 유무
표시 함수 `hasDataFor` 등)은 props로 확장하고, 새 캘린더 구현을 만들지 않는다.

롤백 대비로 남겨둔 (사용하지 않는) 파일:
- `src/components/market-v2/DateSheet.tsx`
- `src/components/date-sheet-lite.tsx`

## 표/리스트 페이지네이션 공통 규칙 (앱 전역, 영구)

이 규칙은 이번 한 번이 아니라 앞으로 추가/수정하는 모든 화면에 자동 적용된다.

1. 앱의 모든 표(table)와 긴 목록(list)은 한 번에 최대 **50개**까지만 렌더링한다.
   - 항목이 50개를 초과하면 하단에 "더보기" 버튼을 노출하고,
     누르면 다음 50개를 이어서 로드/표시한다.
     (서버 페이지네이션이면 `offset += 50`, 클라이언트면 slice 확장.)
   - 더 이상 불러올 항목이 없으면 버튼을 숨긴다.
   - 데이터가 50개 이하이면 버튼을 표시하지 않는다.
2. 버튼 라벨은 항상 **"더보기"**로 통일한다.
   - 기존 "더 불러오기" 문구는 모두 "더보기"로 교체.
   - 부가 텍스트(예: "(N건 중 M건 표시)", "(1/3 페이지)")는 붙이지 않는다.
3. 버튼은 **텍스트 "더보기" + 우측 chevron-down** 형태로 통일하고,
   `src/components/common/LoadMoreButton.tsx`의 `LoadMoreButton` 공통
   컴포넌트만 사용한다. 개별 화면에서 별도 스타일의 더보기/더 불러오기
   버튼을 만들지 않는다. 페이지 크기는 `LIST_PAGE_SIZE`(=50)를 사용한다.
4. 서비스/조회 함수는 `limit`/`offset`(또는 page)을 받아 페이지 단위로
   응답하도록 감싼다. 프론트에서 전체를 받아 자르는 방식은 지양한다.

적용 대상 예시(이에 국한되지 않음): 경매내역, 시세 목록, 시장/법인/산지/
품종 비교 표, 통계 표, 검색 결과, 즐겨찾기 목록 등 행이 많아질 수 있는 모든 곳.

## 화면 Route 컨벤션 (앱 전역, 영구)

앞으로 사양서에서 별도 화면으로 관리하는 모든 화면은 Lovable 상단
'Find page or enter path'에서 검색·직접 접근 가능하도록 반드시 고유
TanStack Router Route로 만든다.

규칙:

1. 모든 독립 화면에 의미 있는 영문 kebab-case 경로를 부여한다.
   (예: `/price-alert`, `/watchlist/add`, `/market-compare`)
2. 경로는 화면명을 보고 예상할 수 있게 작성한다. 축약·암호화 금지.
3. 서로 다른 주요 화면을 같은 경로에서 컴포넌트만 교체해 보여주지 않는다.
   상태 토글로 상세 뷰를 대체하지 말고 별도 Route로 분리한다.
4. 상세 화면은 `/{상위기능}/{하위화면}` 계층 구조를 사용한다.
   (예: `/market/$crop`, `/notifications/settings/$ruleId`)
5. 사양서에서 독립 화면으로 관리하는 주요 바텀시트와 모달도 별도 Route로
   만들고, 해당 Route로 직접 접속하면 부모 화면 위에 시트/모달이 열린
   상태로 표시된다.
   - 권장 경로 형태: `/{parent}/sheet/{name}` 또는 `/{parent}/dialog/{name}`
   - 시트/모달 오픈 상태는 URL로 표현하고, `?return=` 등으로 복귀 경로를
     명시할 수 있다.
6. 바텀시트·모달을 닫으면 상위 화면 경로(부모 Route)로 돌아간다.
   (`router.history.back()` 또는 `navigate({ to: parent })`)
7. Tooltip, Toast, 단순 Popover/펼치기(아코디언)는 Route로 만들지 않는다.
8. 화면(또는 오버레이) Route를 추가할 때는 화면명 · 경로 · 전체 링크(URL)를
   `src/config/screen-catalog.ts`(존재 시)와 관련 사양서 표에 함께 기록한다.
9. 중복 경로를 만들지 않는다. 신규 Route 추가 전 `src/routes/` 및 카탈로그를
   먼저 확인한다.
10. 이 규칙은 앞으로 생성하는 모든 화면에 자동 적용한다. 위반하는 기존
    화면(상태 토글로만 존재하는 상세 뷰 등)은 발견 시 Route로 승격한다.

관련 파일 명명 규칙(TanStack file-based routing):
- Page: `src/routes/{path}.tsx`
- 하위 페이지: `src/routes/{parent}.{child}.tsx` 또는 폴더 중첩
- 시트/모달 Route: `src/routes/{parent}.sheet.{name}.tsx` 형태를 기본으로 하고,
  부모 Route에서 `<Outlet />`을 렌더하거나, 시트 Route 컴포넌트가 부모
  화면을 함께 렌더하도록 구성한다.

