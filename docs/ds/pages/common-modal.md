# 공통 모달·바텀시트 DS

- Menu ID: common-modal
- Registry: docs/ds/screen-registry.json
- Baseline: 2026-08-04 코드 기준

## CMN-001_unit-sheet_Default — 단위 선택 시트

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-1301 | 단위 선택 시트 | CMN-001_unit-sheet_Default | Visible | -제목.01: 시트 타이틀 "단위 선택"<br>-목록항목.01: 단위 목록 "kg 기준", "1kg", "5kg", "8kg 기준", "10kg", "15kg", "20kg" 순서로 표시<br>-상태표시.01: 현재 선택된 단위 행은 배경 강조 및 우측 체크 아이콘으로 표시 | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market<br>File: src/components/market-v2/UnitSheet.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-1301 | 단위 선택 시트 | CMN-001_unit-sheet_Default | Invisible | -데이터소스.01: 단위 목록은 src/lib/mock/market-taxonomy.ts의 UNITS 상수를 사용<br>-초기값.01: 현재 선택값은 전역 스토어 useMarketFilter(unit)에서 가져옴, 기본값 "10kg 기준"<br>-액션.01: 행 클릭 시 setUnit(u) 호출로 스토어 값을 갱신하고 시트를 닫음(onOpenChange(false)) | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market<br>File: src/components/market-v2/UnitSheet.tsx<br>Baseline: 2026-08-04 코드 기준<br>Store: src/store/market.ts(useMarketFilter) |
| DS-1301 | 단위 선택 시트 | CMN-001_unit-sheet_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market<br>File: src/components/market-v2/UnitSheet.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-1301 | 단위 선택 시트 | CMN-001_unit-sheet_Default | Design | -배경색.01: 선택된 행 배경 #F0F9F0<br>-글자색.01: 선택된 행 글자색 #1F5C1F, 굵게<br>-글자색.02: 미선택 행 글자색 #212529(--foreground)<br>-아이콘색상.01: 체크 아이콘 색 #3A8A3A<br>-글자크기.01: 타이틀 16px, 굵게<br>-글자크기.02: 목록 항목 14px<br>-모서리.01: 시트 상단 모서리 반경 16px(rounded-t-2xl)<br>-모서리.02: 행 모서리 반경 10px<br>-내부여백.01: 행 내부 여백 좌우 12px, 상하 12px<br>-아이콘크기.01: 체크 아이콘 16x16px | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market<br>File: src/components/market-v2/UnitSheet.tsx<br>Baseline: 2026-08-04 코드 기준 |

## CMN-002_sort-sheet_Default — 정렬 시트

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-1302 | 정렬 시트 | CMN-002_sort-sheet_Default | Visible | -제목.01: 시트 타이틀 "정렬"<br>-목록항목.01: 정렬 옵션 "거래량순", "등락률순", "가나다순" 순서로 표시(구분선으로 분리)<br>-상태표시.01: 현재 선택된 정렬은 글자색 강조 및 우측 체크 아이콘으로 표시 | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market<br>File: src/components/market-v2/SortSheet.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-1302 | 정렬 시트 | CMN-002_sort-sheet_Default | Invisible | -데이터소스.01: 정렬 키 목록은 컴포넌트 내 opts 배열 ["volume","change","name"], 라벨은 src/store/market.ts의 SORT_LABEL 매핑 사용<br>-초기값.01: 현재 값은 부모로부터 전달받는 value prop(부모가 useMarketStore.sort 등을 관리)<br>-액션.01: 행 클릭 시 onChange(k) 호출 후 onOpenChange(false)로 시트를 닫음 | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market<br>File: src/components/market-v2/SortSheet.tsx<br>Baseline: 2026-08-04 코드 기준<br>Store: src/store/market.ts(SORT_LABEL, useMarketStore) |
| DS-1302 | 정렬 시트 | CMN-002_sort-sheet_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market<br>File: src/components/market-v2/SortSheet.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-1302 | 정렬 시트 | CMN-002_sort-sheet_Default | Design | -글자색.01: 선택된 행 글자색 #3A8A3A, 굵게<br>-글자색.02: 미선택 행 글자색 #212529(--foreground)<br>-테두리색.01: 항목 구분선 색 #F1F3F5<br>-글자크기.01: 타이틀 15px<br>-글자크기.02: 목록 항목 14px<br>-모서리.01: 시트 상단 모서리 반경 16px<br>-내부여백.01: 행 상하 여백 14px(py-3.5)<br>-아이콘크기.01: 체크 아이콘 16x16px | Registry: docs/ds/screen-registry.json<br>Route: Parent=/market<br>File: src/components/market-v2/SortSheet.tsx<br>Baseline: 2026-08-04 코드 기준 |

## CMN-003_rate-prompt-modal_Default — 별점 유도 모달

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-1303 | 별점 유도 모달 | CMN-003_rate-prompt-modal_Default | Visible | -제목.01: 1단계(rate) 타이틀 "앱이 마음에 드시나요?", 부제 "별점을 남겨주시면 큰 힘이 됩니다!"<br>-구성.01: 상단 그라디언트 배지 안에 별 아이콘<br>-버튼.01: 별 5개 선택 버튼(1~5점), 선택/호버 시 채워진 별로 표시<br>-버튼.02: 하단 "나중에" / "다시 보지 않기" 텍스트 버튼<br>-제목.02: 2단계(feedback) 타이틀 "의견을 들려주세요", 부제 "불편하거나 아쉬웠던 점을 알려주시면 개선하겠습니다."<br>-입력.01: 자유입력 textarea, placeholder "개선 의견을 남겨주세요", 최대 200자 카운터 표시<br>-버튼.03: "보내기" 버튼(전송 중 "전송 중..." 표시), 하단 "나중에"/"다시 보지 않기" 텍스트 버튼<br>-모달.01: 화면 중앙 카드형 다이얼로그, role="dialog" aria-modal="true" | Registry: docs/ds/screen-registry.json<br>Route: Parent=/<br>File: src/components/RatePromptModal.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-1303 | 별점 유도 모달 | CMN-003_rate-prompt-modal_Default | Invisible | -진입조건.01: 앱 마운트 시 1회, localStorage 키 agdict:ratePrompt의 hidden 값이 false일 때만 노출(라우트 이동에는 반응하지 않음)<br>-데이터소스.01: localStorage 값이 없거나 파싱 실패 시 노출 상태로 간주<br>-저장.01: 노출 시 { hidden:false, lastShownAt } 저장<br>-분기.01: 별점 4점 이상 선택 시 openStoreReview() 호출 후 hidden=true로 저장하고 닫힘<br>-분기.02: 별점 1~3점 선택 시 feedback 단계로 전환<br>-저장.02: feedback 제출 시 Supabase feedback 테이블에 kind="rating", rating, message(공백이면 "(별점 피드백)") insert<br>-실패.01: insert 실패 시 토스트 "전송에 실패했어요. 잠시 후 다시 시도해 주세요"<br>-성공.01: insert 성공 시 토스트 "소중한 의견 감사합니다! 🙏" 후 hidden=true 저장, 닫힘<br>-액션.01: "나중에" 클릭 시 이번 세션만 닫힘(hidden 값 유지), 200ms 후 내부 상태 초기화<br>-액션.02: "다시 보지 않기" 클릭 시 hidden=true 저장 후 닫힘<br>-입력제한.01: 자유입력 최대 200자로 잘림 | Registry: docs/ds/screen-registry.json<br>Route: Parent=/<br>File: src/components/RatePromptModal.tsx<br>Baseline: 2026-08-04 코드 기준<br>Source: src/lib/store-review.ts(openStoreReview)<br>토큰 참조: localStorage key agdict:ratePrompt |
| DS-1303 | 별점 유도 모달 | CMN-003_rate-prompt-modal_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: Parent=/<br>File: src/components/RatePromptModal.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-1303 | 별점 유도 모달 | CMN-003_rate-prompt-modal_Default | Design | -배경색.01: 딤 배경 rgba(0,0,0,0.5)(bg-black/50)<br>-배경색.02: 카드 배경 #FFFFFF<br>-배경색.03: 배지 그라디언트 135deg, #3A8A3A → #62B347<br>-배경색.04: 자유입력 textarea 배경 #F8F9FA<br>-글자색.01: 타이틀 글자색 #212529(--foreground)<br>-글자색.02: 부제 글자색 #868E96<br>-글자색.03: "나중에" 버튼 글자색 #868E96<br>-글자색.04: "다시 보지 않기" 버튼 글자색 #495057<br>-상태색.01: 선택/호버된 별 색 #F59F00(채움), 미선택 별 색 #DEE2E6(외곽선만)<br>-상태색.02: 제출 버튼 배경 활성 #3A8A3A, 비활성/전송중 #ADB5BD<br>-글자크기.01: 타이틀 17px, 굵게<br>-글자크기.02: 부제 12.5px<br>-글자크기.03: 텍스트 버튼 13px, 굵게<br>-너비.01: 카드 최대 너비 320px<br>-모서리.01: 카드 모서리 반경 20px<br>-모서리.02: 배지 모서리 반경 18px<br>-모서리.03: textarea 모서리 반경 10px<br>-그림자.01: 카드 그림자 shadow-2xl(box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25))<br>-그림자.02: 배지 그림자 shadow-md<br>-내부여백.01: 카드 내부 여백 24px(p-6)<br>-아이콘크기.01: 별 아이콘 32x32px, stroke-width 1.5<br>-아이콘크기.02: 배지 내 별 아이콘 32x32px(h-8 w-8)<br>-높이.01: textarea 높이 110px<br>-레이어.01: z-index 100(fixed inset-0 z-[100]) | Registry: docs/ds/screen-registry.json<br>Route: Parent=/<br>File: src/components/RatePromptModal.tsx<br>Baseline: 2026-08-04 코드 기준 |

## CMN-004_load-more-button_Default — 공통 더보기 버튼

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-1304 | 공통 더보기 버튼 | CMN-004_load-more-button_Default | Visible | -버튼.01: 전체 너비 버튼, 라벨 "더보기" 고정, 우측 chevron-down 아이콘<br>-접근성.01: aria-label 기본값 "더보기"(prop으로 대체 가능) | Registry: docs/ds/screen-registry.json<br>Route: Parent=/live<br>File: src/components/common/LoadMoreButton.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-1304 | 공통 더보기 버튼 | CMN-004_load-more-button_Default | Invisible | -조건.01: 표/리스트가 페이지당 최대 50건(LIST_PAGE_SIZE=50)까지 노출되고 그 이상 데이터가 있을 때만 노출하도록 설계(호출 측에서 조건부 렌더링)<br>-액션.01: 클릭 시 부모로부터 전달받은 onClick 콜백 실행(추가 로드 로직은 각 화면에 위임)<br>-미구현.01: 부가 텍스트(N건 중 M건 등) 표시는 금지되어 있으며 코드에도 라벨 외 텍스트 없음 | Registry: docs/ds/screen-registry.json<br>Route: Parent=/live<br>File: src/components/common/LoadMoreButton.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-1304 | 공통 더보기 버튼 | CMN-004_load-more-button_Default | Tracking | - | Registry: docs/ds/screen-registry.json<br>Route: Parent=/live<br>File: src/components/common/LoadMoreButton.tsx<br>Baseline: 2026-08-04 코드 기준 |
| DS-1304 | 공통 더보기 버튼 | CMN-004_load-more-button_Default | Design | -배경색.01: 기본 배경 #FFFFFF<br>-배경색.02: 활성(active) 배경 #F1F3F5(--secondary)<br>-글자색.01: 라벨 글자색 #495057<br>-테두리.01: 1px solid #E9ECEF<br>-모서리.01: 모서리 반경 10px<br>-높이.01: 버튼 높이 44px(h-11)<br>-외부여백.01: 상단 여백 12px(mt-3)<br>-간격.01: 라벨과 아이콘 사이 4px(gap-1)<br>-글자크기.01: 라벨 13px, 굵게<br>-아이콘크기.01: chevron-down 16x16px(h-4 w-4) | Registry: docs/ds/screen-registry.json<br>Route: Parent=/live<br>File: src/components/common/LoadMoreButton.tsx<br>Baseline: 2026-08-04 코드 기준 |

Confluence 등록 시 같은 Screen ID의 연속 행에 있는 DS No. · Section명 · Screen ID 셀은 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## 분석 파일

- src/components/market-v2/UnitSheet.tsx
- src/components/market-v2/SortSheet.tsx
- src/components/RatePromptModal.tsx
- src/components/common/LoadMoreButton.tsx
- src/components/empty-state.tsx (참고: 이 메뉴의 등록 Screen이 아니므로 상세 사양 미포함)
- src/store/market.ts
- src/lib/store-review.ts
- src/styles.css

## 미구현·확인필요 요약

- 미구현: 0건
- 확인필요: 0건
