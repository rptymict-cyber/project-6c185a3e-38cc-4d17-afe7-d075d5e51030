# 공통 모달·바텀시트 DS 초안

- Menu ID: common-modal
- Registry: docs/ds/screen-registry.json
- Baseline: 2026-07-31 코드 기준

> date-picker-sheet, MarketSheet, CorporationSheet, StatsMarketSheet는 시세(market)/통계(statistics) 메뉴에서 진입하는 시트로 해당 메뉴 문서에서 다룬다. 이 문서는 CMN-001~CMN-004(공통 UI 부품)만 다룬다.

## CMN-001 — 단위 선택 시트

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-1301 | 단위 선택 시트 | CMN-001_unit-sheet_Default | Visible | 정의.01: 시세 화면 등에서 단위(unit)를 선택하는 하단 시트<br>제목.01: "단위 선택"<br>목록항목.01: `UNITS`(`@/lib/mock/market-taxonomy`) 배열 전체를 목록으로 표시, 현재 선택된 단위는 배경 강조 + 우측 체크 아이콘 | - |
| DS-1301 | 단위 선택 시트 | CMN-001_unit-sheet_Default | Invisible | 진입조건.01: 상위 화면에서 `open` prop을 true로 전달할 때 표시(자체 트리거 없음)<br>상태.01: `useMarketFilter`의 `unit`/`setUnit` 사용<br>액션.01: 항목 클릭 시 `setUnit(u)` 호출 후 `onOpenChange(false)`로 시트 닫힘 | - |
| DS-1301 | 단위 선택 시트 | CMN-001_unit-sheet_Default | Tracking | - | - |
| DS-1301 | 단위 선택 시트 | CMN-001_unit-sheet_Default | Design | 컴포넌트.01: `UnitSheet`(`Sheet` side="bottom", `rounded-t-2xl`)<br>아이콘.01: `Check`(lucide-react) | - |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## CMN-002 — 정렬 시트

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-1302 | 정렬 시트 | CMN-002_sort-sheet_Default | Visible | 정의.01: 시세 목록 정렬 기준을 선택하는 하단 시트<br>제목.01: "정렬"<br>목록항목.01: 정렬 옵션 3종 — `SORT_LABEL`(`@/store/market`) 기준 "volume"(거래량순), "change"(등락률순), "name"(가나다순), 현재 값은 강조색+체크 아이콘 | - |
| DS-1302 | 정렬 시트 | CMN-002_sort-sheet_Default | Invisible | 진입조건.01: 상위 화면에서 `open` prop을 true로 전달할 때 표시(자체 트리거 없음)<br>액션.01: 항목 클릭 시 `onChange(k)` 호출 후 `onOpenChange(false)`로 시트 닫힘(정렬 상태는 호출부(부모)가 소유) | - |
| DS-1302 | 정렬 시트 | CMN-002_sort-sheet_Default | Tracking | - | - |
| DS-1302 | 정렬 시트 | CMN-002_sort-sheet_Default | Design | 컴포넌트.01: `SortSheet`(`Sheet` side="bottom", `rounded-t-2xl`)<br>아이콘.01: `Check`(lucide-react) | - |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## CMN-003 — 별점 유도 모달

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-1303 | 별점 유도 모달 | CMN-003_rate-prompt-modal_Default | Visible | 정의.01: 앱 진입(루트 마운트)마다 노출되는 별점/피드백 유도 모달(`role="dialog"`)<br>제목.01(1단계 "rate"): "앱이 마음에 드시나요?"<br>문구.01: "별점을 남겨주시면 큰 힘이 됩니다!"<br>입력.01: 별 1~5개 클릭(호버 시 미리보기 강조)<br>버튼.01: "나중에"(이번 세션만 닫힘)<br>버튼.02: "다시 보지 않기"(영구 숨김)<br>제목.02(2단계 "feedback", 별점 1~3점 시): "의견을 들려주세요"<br>문구.02: "불편하거나 아쉬웠던 점을 알려주시면 개선하겠습니다."<br>입력.02: 텍스트영역(placeholder "개선 의견을 남겨주세요", 최대 200자, 하단 "N/200" 카운터)<br>버튼.03: "보내기"(전송 중 "전송 중..."으로 라벨 변경, 비활성 스타일)<br>버튼.04/05: "나중에"/"다시 보지 않기"(feedback 단계에도 동일 제공) | - |
| DS-1303 | 별점 유도 모달 | CMN-003_rate-prompt-modal_Default | Invisible | 진입조건.01: 컴포넌트 마운트 시 `useEffect`로 `localStorage["agdict:ratePrompt"]`의 `hidden` 값을 확인, hidden이 아니면 `open=true`로 노출(라우트 이동에는 반응하지 않음)<br>저장.01: localStorage 키 `agdict:ratePrompt`, 값 `{hidden: boolean, lastShownAt: string}`<br>분기.01: 별점 4~5점 선택 시 `openStoreReview()`(`@/lib/store-review`) 호출 후 성공 시 토스트 "스토어로 이동합니다", 이어서 `closeForever()`(hidden=true 저장)<br>분기.02: 별점 1~3점 선택 시 `step`을 "feedback"으로 전환(모달 유지)<br>액션.01: "나중에"/딤 클릭 → `open=false`(hidden 값 변경 없음), 200ms 후 내부 상태 초기화<br>액션.02: "다시 보지 않기" → hidden=true 저장 후 닫힘<br>API.01: `submitFeedback`에서 `supabase.from("feedback").insert({kind:"rating", rating, message})` 호출<br>성공.01: 저장 성공 시 토스트 "소중한 의견 감사합니다! 🙏" 후 `closeForever()`<br>실패.01: 저장 실패(`error`) 시 토스트 "전송에 실패했어요. 잠시 후 다시 시도해 주세요", 모달은 유지 | - |
| DS-1303 | 별점 유도 모달 | CMN-003_rate-prompt-modal_Default | Tracking | - | - |
| DS-1303 | 별점 유도 모달 | CMN-003_rate-prompt-modal_Default | Design | 컴포넌트.01: `RatePromptModal`(루트 `AppShell` 외부, `__root.tsx`에서 항상 마운트)<br>아이콘.01: `Star`(lucide-react)<br>클래스.01: `fixed inset-0 z-[100]`, 카드 `max-w-[320px] rounded-[20px]` | - |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## CMN-004 — 공통 더보기 버튼

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-1304 | 공통 더보기 버튼 | CMN-004_load-more-button_Default | Visible | 정의.01: 표/리스트가 페이지 크기(`LIST_PAGE_SIZE`=50)를 초과할 때만 노출하는 공통 "더보기" 버튼<br>버튼.01: 라벨 "더보기" + 우측 `ChevronDown` 아이콘 고정(부가 텍스트 없음, 컴포넌트 주석에 "N건 중 M건" 등 표기 금지 명시) | - |
| DS-1304 | 공통 더보기 버튼 | CMN-004_load-more-button_Default | Invisible | 진입조건.01: 호출부가 리스트 길이 > `LIST_PAGE_SIZE`(50)일 때만 렌더(컴포넌트 자체는 항상 렌더되며 노출 여부는 호출부 책임)<br>액션.01: 클릭 시 `onClick` prop 호출(페이지당 항목 수 증가 등은 호출부 로직) | - |
| DS-1304 | 공통 더보기 버튼 | CMN-004_load-more-button_Default | Tracking | - | - |
| DS-1304 | 공통 더보기 버튼 | CMN-004_load-more-button_Default | Design | 컴포넌트.01: `LoadMoreButton`<br>상수.01: `LIST_PAGE_SIZE = 50`<br>아이콘.01: `ChevronDown`(lucide-react)<br>클래스.01: `h-11 w-full rounded-[10px] border border-[#E9ECEF]` | - |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

> 각 Screen ID 비고: CMN-001 → Registry: docs/ds/screen-registry.json<br>Route: Parent=/market<br>File: src/components/market-v2/UnitSheet.tsx<br>Store: src/store/market.ts<br>Baseline: 2026-07-31 코드 기준
> CMN-002 → Registry: docs/ds/screen-registry.json<br>Route: Parent=/market<br>File: src/components/market-v2/SortSheet.tsx<br>Store: src/store/market.ts<br>Baseline: 2026-07-31 코드 기준
> CMN-003 → Registry: docs/ds/screen-registry.json<br>Route: Parent=/<br>File: src/components/RatePromptModal.tsx<br>Source: src/lib/store-review.ts, src/integrations/supabase/client.ts<br>Baseline: 2026-07-31 코드 기준
> CMN-004 → Registry: docs/ds/screen-registry.json<br>Route: Parent=/live<br>File: src/components/common/LoadMoreButton.tsx<br>Baseline: 2026-07-31 코드 기준

## 분석 파일

- src/components/market-v2/UnitSheet.tsx
- src/components/market-v2/SortSheet.tsx
- src/components/RatePromptModal.tsx
- src/components/common/LoadMoreButton.tsx
- src/store/market.ts
- src/lib/mock/market-taxonomy.ts

## 미구현·확인필요 요약

- 없음(해당 4개 컴포넌트에서 mock/TODO/미연결 코드 발견되지 않음).
