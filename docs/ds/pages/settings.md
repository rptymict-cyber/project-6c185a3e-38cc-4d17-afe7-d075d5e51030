# 설정 DS 초안

- Menu ID: settings
- Registry: docs/ds/screen-registry.json
- Baseline: 2026-07-31 코드 기준

## SET-001_settings_Default — 설정 목록

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-1001 | 설정 목록 | SET-001_settings_Default | Visible | 정의.01: 알림 설정 진입, 피드백 제출, 앱 정보 확인을 제공하는 설정 메인 화면.<br>제목.01: "설정"(AppHeader title).<br>구성.01: "알림" 섹션(알림 설정 이동 행), "피드백" 섹션(의견 보내기 행), "정보" 섹션(데이터 기준 안내 이동 행 + 버전 정보 행).<br>목록항목.01: "알림 설정" 행 — 아이콘 Bell, 제목 "알림 설정", 부제 "시세·경매 알림 수신 관리", ChevronRight.<br>목록항목.02: "의견 보내기" 행 — 아이콘 MessageSquare, 제목 "의견 보내기", 부제 "평가와 개선 의견을 한 번에 남겨주세요", ChevronRight.<br>목록항목.03: "데이터 기준 안내" 행 — 아이콘 Info, 제목 "데이터 기준 안내", 부제 "가격 단위·출처·기준일 안내", ChevronRight.<br>목록항목.04: "버전 정보" 행 — 제목 "버전 정보", 부제 "최신 버전을 사용 중입니다", 우측 값 "v0.1.0 Beta"(하드코딩).<br>문구.01: 하단 카피 "AGDICT · 농산물 시세 조회".<br>모달.01: "의견 보내기" 클릭 시 하단 Drawer(FeedbackSheet) 오픈.<br>모달.02: 감정 선택 UI — 5단계 이모지(😠 매우나쁨, 🙁 나쁨, 😐 보통, 🙂 만족, 😍 매우만족).<br>모달.03: 감정 그룹별 후속 질문 칩 — negative: "어떤 점이 아쉬웠나요?"(시세가 부정확해요/예측이 안 맞아요/원하는 품목이 없어요/화면이 복잡해요/자주 느려요/기타), neutral: "가장 개선이 필요한 곳은 어디인가요?"(시세 정확도/예측 정확도/품목 종류/화면 사용성/속도·안정성/기타), positive: "어떤 점이 좋았나요?"(시세가 정확해요/예측이 도움돼요/화면이 보기 편해요/원하는 품목이 많아요/빠르고 가벼워요/기타).<br>모달.04: 자유입력 영역 제목 — positive: "더 하고 싶은 말이 있나요?"(부제 "자유롭게 남겨주세요 (선택)"), negative: "자세히 알려주시겠어요?"(부제 "불편한 점을 남겨주시면 빠르게 개선할게요 (선택)"), neutral: "자세히 알려주시겠어요?"(부제 "자유롭게 남겨주세요 (선택)").<br>모달.05: textarea placeholder — positive "예: 시세를 매일 아침 확인하는데 정말 편해요", negative "예: 특정 품목에서 가격이 다르게 표시됐어요", neutral "자유롭게 의견을 남겨주세요". 최대 200자, 글자수 카운터 "{len}/200" 표시.<br>입력.01: 감정 선택 버튼 5개(단일 선택, aria-pressed).<br>입력.02: 후속 질문 칩 다중 선택 토글(aria-pressed).<br>입력.03: 자유입력 textarea(maxLength 200).<br>버튼.01: 제출 버튼 — 텍스트 "제출하기"(전송 중일 때 "전송 중...").<br>표시.01: 제출 성공 후 sentiment>=4(만족/매우만족)이면 StoreReviewPrompt로 화면 전환, 그 외에는 Drawer 닫힘.<br>모달.06: StoreReviewPrompt — 이모지(rating===5면 😍, 아니면 🙂), 제목 "소중한 의견 감사합니다!", 문구 "스토어에도 한 줄 남겨주시면<br>다른 농업인들에게 큰 힘이 됩니다.", 버튼 "스토어에 리뷰 쓰기" / "다음에 할게요". | Registry: docs/ds/screen-registry.json<br>Route: /settings<br>File: src/routes/settings.tsx<br>Store: src/store/feedback.ts<br>Baseline: 2026-07-31 코드 기준 |
| DS-1001 | 설정 목록 | SET-001_settings_Default | Invisible | 진입조건.01: /settings 접근 시 항상 렌더.<br>이동.01: "알림 설정" 행 클릭 → Link to="/notifications/settings".<br>이동.02: "데이터 기준 안내" 행 클릭 → Link to="/data-guide".<br>초기값.01: 감정 선택(sentiment)=null, 칩 선택(chips)=[], 자유입력(text)="", submitting=false, thanks=null.<br>조건.01: 감정 그룹(negative/neutral/positive)이 이전 선택과 달라지면(prevGroup !== nextGroup) chips를 [] 로 초기화. groupOf: 1~2점 negative, 3점 neutral, 4~5점 positive.<br>검증.01: canSubmit = sentiment !== null && !submitting — 감정을 선택해야 제출 가능. 칩/자유입력은 선택 사항.<br>액션.01: 제출 버튼 클릭 시 submit() 실행 — trimmed = text.trim(), message = JSON.stringify({ tags: chips, text: trimmed }).<br>API.01: supabase.from("feedback").insert({ kind: "sentiment", rating: sentiment, message, tags: chips }) 호출(src/integrations/supabase/client).<br>실패.01: insert 결과 error가 있으면 submitting=false 처리 후 toast("전송에 실패했어요. 잠시 후 다시 시도해 주세요") 표시, 로컬 저장/화면 전환 없이 종료.<br>성공.01: error 없으면 addLocal({ kind: "sentiment", rating: sentiment, tags: chips, text: trimmed })로 useFeedback 스토어(저장 키 "agdict:feedback")에도 동일 항목 추가.<br>분기.01: 성공 후 sentiment >= 4(positive)이면 thanks 상태를 세팅해 StoreReviewPrompt로 전환. 그 외(1~3점)에는 toast("소중한 의견 감사합니다. 빠르게 개선할게요") 표시 후 onClose()로 Drawer 닫음.<br>액션.02: StoreReviewPrompt의 "스토어에 리뷰 쓰기" 클릭 시 openStoreReview()(src/lib/store-review.ts) 호출 — 플랫폼(iOS/Android) 감지 후 STORE_URLS의 해당 URL로 새 창 오픈 시도.<br>미구현.01: STORE_URLS.ios, STORE_URLS.android 값이 모두 빈 문자열("")로 정의되어 있어 openStoreReview()는 url이 없어 항상 false를 반환하며 실제로 스토어로 이동하지 않음(주석: "MVP 단계에서는 웹앱이므로 스토어 링크가 아직 없을 수 있다").<br>분기.02: openStoreReview() 반환값이 true이면 toast("스토어로 이동합니다") 표시, false이면 아무 토스트 없이 onClose()만 실행(현재 코드 기준 항상 false 경로).<br>액션.03: "다음에 할게요" 클릭 시 onClose()로 Drawer 닫음.<br>미구현.02: "버전 정보" 값 "v0.1.0 Beta"는 하드코딩 텍스트이며 실제 앱 버전 조회 로직 없음. | 위와 동일 |
| DS-1001 | 설정 목록 | SET-001_settings_Default | Tracking | - | 위와 동일 |
| DS-1001 | 설정 목록 | SET-001_settings_Default | Design | 컴포넌트.01: AppShell(screenId), AppHeader, Drawer/DrawerContent/DrawerTrigger.<br>클래스.01: 섹션 카드 "overflow-hidden rounded-[10px] bg-surface".<br>토큰.01: 아이콘 배지 bg-[#F0F9F0] text-[#3A8A3A], 감정 칩 활성 색상 border-[#3A8A3A] bg-[#F0F9F0].<br>아이콘.01: lucide-react MessageSquare, ChevronRight, Bell, Info, Check. | 위와 동일 |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## DTA-001_data-guide_Default — 데이터 안내

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-1002 | 데이터 안내 | DTA-001_data-guide_Default | Visible | 정의.01: AGDICT 시세 데이터의 출처·기준일·단위·경매일 표시 기준을 안내하는 정적 정보 화면.<br>제목.01: "데이터 기준 안내"(DetailHeader title).<br>문구.01: 상단 안내문 "AGDICT는 KAMIS와 aT의 농산물 유통정보를 기반으로 시세를 제공합니다. 아래 기준을 참고하시면 시세를 더 정확하게 이해하실 수 있어요.".<br>목록항목.01: "데이터 출처" — "KAMIS 및 aT 농산물유통정보에서 제공하는 도매시장 경매 데이터를 기반으로 합니다."(아이콘 Database).<br>목록항목.02: "기준일 및 업데이트 시간" — "시세는 최근 경매일 기준으로 집계되며, 매일 오후 업데이트됩니다. 휴장일에는 직전 경매일 데이터가 표시됩니다."(아이콘 Clock).<br>목록항목.03: "가격 단위" — "가격은 kg 기준으로 환산해 표시하는 것을 원칙으로 합니다. 다만 품목 특성에 따라 5kg, 8kg, 10kg, 20kg 등 표준 거래 단위가 함께 사용됩니다."(아이콘 Scale).<br>목록항목.04: "경매일 기준 표시" — "차트와 시세 카드의 날짜는 실제 경매가 이루어진 경매일을 기준으로 하며, 조회일과 다를 수 있습니다."(아이콘 Gavel).<br>목록항목.05: "일부 데이터 안내" — "현재 일부 화면의 데이터는 데모용 mock 데이터를 사용하고 있으며, 실제 API 연동 시 동일한 구조로 교체될 수 있습니다."(아이콘 Info).<br>문구.02: 하단 출처 표기 "데이터 제공: KAMIS 농산물유통정보 / aT 한국농수산식품유통공사". | Registry: docs/ds/screen-registry.json<br>Route: /data-guide<br>File: src/routes/data-guide.tsx<br>Baseline: 2026-07-31 코드 기준 |
| DS-1002 | 데이터 안내 | DTA-001_data-guide_Default | Invisible | 진입조건.01: /data-guide 접근 시 항상 렌더(별도 조건·데이터 요청 없음, 화면 내 items 배열은 컴포넌트 파일에 정적으로 정의됨).<br>이동.01: 헤더 뒤로가기 버튼 클릭 시 router.history.back(). | 위와 동일 |
| DS-1002 | 데이터 안내 | DTA-001_data-guide_Default | Tracking | - | 위와 동일 |
| DS-1002 | 데이터 안내 | DTA-001_data-guide_Default | Design | 컴포넌트.01: AppShell(screenId), DetailHeader.<br>클래스.01: 안내 카드 "rounded-2xl border border-[#E9ECEF] bg-white p-4".<br>토큰.01: 아이콘 배지 bg-[#F1F8F1] text-primary.<br>아이콘.01: lucide-react Database, Clock, Scale, Gavel, Info. | 위와 동일 |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## 분석 파일
- src/routes/settings.tsx
- src/routes/data-guide.tsx
- src/lib/store-review.ts
- src/store/feedback.ts
- src/components/app-shell.tsx
- src/integrations/supabase/client.ts (참조 확인)

## 미구현·확인필요 요약
총 2건
1. 미구현.01 (SET-001_settings_Default): openStoreReview()가 참조하는 STORE_URLS.ios/android 값이 모두 빈 문자열로 정의되어 있어, 리뷰 유도 버튼 클릭 시 실제 스토어 페이지로 이동하지 않음.
2. 미구현.02 (SET-001_settings_Default): "버전 정보" 표시값 "v0.1.0 Beta"는 하드코딩 텍스트이며 실제 빌드 버전 조회 로직이 연결되어 있지 않음.
