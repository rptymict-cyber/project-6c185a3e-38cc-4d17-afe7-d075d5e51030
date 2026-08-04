# 설정 DS

- Menu ID: settings
- Registry: docs/ds/screen-registry.json
- Baseline: 2026-08-04 코드 기준

## SET-001_settings_Default — 설정 목록

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-1001 | 설정 목록 | SET-001_settings_Default | Visible | -제목.01: 헤더 타이틀 "설정"<br>-구성.01: 알림/피드백/정보 3개 섹션, 섹션 라벨과 카드 형태의 행 목록<br>-목록항목.01: "알림 설정" 행 — 아이콘, 제목, 부제 "시세·경매 알림 수신 관리", 우측 화살표<br>-목록항목.02: "의견 보내기" 행 — 아이콘, 제목, 부제 "평가와 개선 의견을 한 번에 남겨주세요", 우측 화살표<br>-목록항목.03: "데이터 기준 안내" 행 — 아이콘, 제목, 부제 "가격 단위·출처·기준일 안내", 우측 화살표<br>-목록항목.04: "버전 정보" 행 — 제목, 부제 "최신 버전을 사용 중입니다", 우측에 버전 문자열 "v0.1.0 Beta"<br>-문구.01: 하단 문구 "AGDICT · 농산물 시세 조회"<br>-모달.01: "의견 보내기" 행 탭 시 하단에서 올라오는 Drawer(FeedbackSheet)가 열림 | Invisible | -이동.01: "알림 설정" 행 클릭 시 /notifications/settings 로 이동<br>-이동.02: "데이터 기준 안내" 행 클릭 시 /data-guide 로 이동<br>-액션.01: "의견 보내기" 행 클릭 시 Drawer(open state)를 true로 전환<br>-초기값.01: 감정 선택 없음(sentiment=null), 칩 선택 없음, 자유입력 빈 문자열<br>-입력제한.01: 자유입력 텍스트는 최대 200자로 잘림(slice)<br>-분기.01: 감정 그룹이 negative(1~2점)/neutral(3점)/positive(4~5점)에 따라 후속 질문 칩 목록과 자유입력 문구가 달라짐<br>-분기.02: 감정 값이 이전 선택과 다른 그룹으로 바뀌면 선택된 칩 목록 초기화<br>-검증.01: 제출 버튼은 sentiment가 선택되고 전송 중이 아닐 때만 활성화(canSubmit)<br>-저장.01: 제출 시 Supabase `feedback` 테이블에 kind="sentiment", rating, message(JSON 문자열: tags/text), tags를 insert<br>-저장.02: 성공 시 로컬 스토어 useFeedback(add)에도 동일 항목을 추가<br>-분기.03: 평점 4점 이상(positive)이면 스토어 리뷰 유도 화면(StoreReviewPrompt)으로 전환, 그 외에는 토스트 "소중한 의견 감사합니다. 빠르게 개선할게요" 후 Drawer 닫힘<br>-실패.01: insert 실패 시 토스트 "전송에 실패했어요. 잠시 후 다시 시도해 주세요" 노출, submitting 해제<br>-자동동작.01: StoreReviewPrompt에서 "스토어에 리뷰 쓰기" 클릭 시 openStoreReview() 호출, 열기 성공하면 토스트 "스토어로 이동합니다" | Tracking | -이벤트.01: 상세 사양 확인 불가(코드 내 별도 트래킹 이벤트 호출 없음) | -미구현.01: 코드에 정의된 트래킹 이벤트/함수 호출이 없음 | Design | -배경색.01: 카드 그룹 배경 #F8F9FA(--surface, bg-surface)<br>-배경색.02: 아이콘 배지 배경 #F0F9F0<br>-글자색.01: 아이콘 배지 아이콘 색 #3A8A3A(--primary)<br>-글자색.02: 행 제목 글자색 #212529(--foreground)<br>-글자색.03: 부제·보조문구 글자색 #6C757D(--muted-foreground)<br>-글자크기.01: 섹션 라벨 12px, 굵게<br>-글자크기.02: 행 제목 14px, 굵게<br>-글자크기.03: 행 부제·버전 문자열 11px<br>-모서리.01: 카드 그룹 모서리 반경 10px<br>-내부여백.01: 행 내부 여백 좌우 16px, 상하 16px(px-4 py-4)<br>-간격.01: 아이콘과 텍스트 사이 12px(gap-3)<br>-아이콘크기.01: 배지 내 아이콘 20x20px(h-5 w-5), 화살표 아이콘 16x16px(h-4 w-4)<br>-외부여백.01: 섹션 간 상단 여백 32px(mt-8) |
| DS-1001 | 설정 목록 | SET-001_settings_Default | - | - | Registry: docs/ds/screen-registry.json<br>Route: /settings<br>File: src/routes/settings.tsx<br>Baseline: 2026-08-04 코드 기준<br>Store: src/store/feedback.ts(useFeedback)<br>Components: FeedbackSheet, StoreReviewPrompt(같은 파일 내부 정의) |

## DTA-001_data-guide_Default — 데이터 안내

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-1002 | 데이터 안내 | DTA-001_data-guide_Default | Visible | -제목.01: 헤더 타이틀 "데이터 기준 안내", 뒤로가기 버튼<br>-문구.01: 상단 안내문 "AGDICT는 KAMIS와 aT의 농산물 유통정보를 기반으로 시세를 제공합니다. 아래 기준을 참고하시면 시세를 더 정확하게 이해하실 수 있어요."<br>-목록항목.01: "데이터 출처" — "KAMIS 및 aT 농산물유통정보에서 제공하는 도매시장 경매 데이터를 기반으로 합니다."<br>-목록항목.02: "기준일 및 업데이트 시간" — "시세는 최근 경매일 기준으로 집계되며, 매일 오후 업데이트됩니다. 휴장일에는 직전 경매일 데이터가 표시됩니다."<br>-목록항목.03: "가격 단위" — "가격은 kg 기준으로 환산해 표시하는 것을 원칙으로 합니다. 다만 품목 특성에 따라 5kg, 8kg, 10kg, 20kg 등 표준 거래 단위가 함께 사용됩니다."<br>-목록항목.04: "경매일 기준 표시" — "차트와 시세 카드의 날짜는 실제 경매가 이루어진 경매일을 기준으로 하며, 조회일과 다를 수 있습니다."<br>-목록항목.05: "일부 데이터 안내" — "현재 일부 화면의 데이터는 데모용 mock 데이터를 사용하고 있으며, 실제 API 연동 시 동일한 구조로 교체될 수 있습니다."<br>-문구.02: 하단 출처 문구 "데이터 제공: KAMIS 농산물유통정보 / aT 한국농수산식품유통공사" | Invisible | -이동.01: 헤더 뒤로가기 클릭 시 router.history.back() 호출<br>-미구현.01: "일부 데이터 안내" 항목이 자체적으로 mock 데이터 사용 사실을 명시하고 있음 | Tracking | - | Design | -배경색.01: 카드 배경 #FFFFFF(bg-white)<br>-배경색.02: 아이콘 배지 배경 #F1F8F1<br>-글자색.01: 아이콘 색 var(--color-primary) #3A8A3A<br>-글자색.02: 항목 제목 색 #212529(--foreground)<br>-글자색.03: 상단 안내문 색 #495057<br>-글자색.04: 항목 본문 색 #6C757D<br>-글자색.05: 하단 출처 문구 색 #868E96<br>-글자크기.01: 상단 안내문 13px<br>-글자크기.02: 항목 제목 14px, 굵게<br>-글자크기.03: 항목 본문 12.5px<br>-글자크기.04: 하단 출처 문구 11px<br>-테두리.01: 카드 테두리 1px solid #E9ECEF<br>-모서리.01: 카드 모서리 반경 16px(rounded-2xl)<br>-간격.01: 카드 사이 간격 10px(gap-2.5)<br>-내부여백.01: 카드 내부 여백 16px(p-4)<br>-아이콘크기.01: 아이콘 배지 36x36px(h-9 w-9), 아이콘 자체 18x18px(h-4.5 w-4.5) |
| DS-1002 | 데이터 안내 | DTA-001_data-guide_Default | - | - | Registry: docs/ds/screen-registry.json<br>Route: /data-guide<br>File: src/routes/data-guide.tsx<br>Baseline: 2026-08-04 코드 기준 |

Confluence 등록 시 같은 Screen ID의 연속 행에 있는 DS No. · Section명 · Screen ID 셀은 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## 분석 파일

- src/routes/settings.tsx
- src/routes/data-guide.tsx
- src/store/feedback.ts
- src/lib/store-review.ts
- src/styles.css

## 미구현·확인필요 요약

- 미구현: 2건(트래킹 이벤트 부재 1건, data-guide 화면 자체가 명시한 mock 데이터 사용 1건)
- 확인필요: 0건
