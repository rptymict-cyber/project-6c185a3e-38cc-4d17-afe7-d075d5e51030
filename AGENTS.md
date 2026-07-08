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
