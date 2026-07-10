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
