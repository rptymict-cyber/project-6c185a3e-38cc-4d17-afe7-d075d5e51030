# 설정 DS

- Menu ID: settings
- Registry: docs/ds/screen-registry.json
- Baseline: 2026-08-05 코드 기준

## SET-001_settings_Default — 설정 목록 · 기본 상태

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-1001 | 설정 목록 | SET-001_settings_Default | Visible | -구성.01: 상단 헤더(타이틀 "설정") + "알림" 섹션(알림 설정 행) + "피드백" 섹션(의견 보내기 행) + "정보" 섹션(데이터 기준 안내 행, 버전 정보 행) + 하단 문구 "AGDICT · 농산물 시세 조회" | Registry: docs/ds/screen-registry.json<br>Route: /settings<br>File: src/routes/settings.tsx<br>기술근거.01: AppShell screenId="SET-001_설정", AppHeader title="설정"<br>기술근거.02: FeedbackSheet, StoreReviewPrompt 컴포넌트(src/routes/settings.tsx 내부)<br>Baseline: 2026-08-05 코드 기준 |
| DS-1002 | 설정 목록 | SET-001_settings_Default | Visible | -표시.01: "알림 설정" 행에 아이콘, 제목 "알림 설정", 부제 "시세·경매 알림 수신 관리" | - |
| DS-1003 | 설정 목록 | SET-001_settings_Default | Visible | -표시.02: "의견 보내기" 행에 아이콘, 제목 "의견 보내기", 부제 "평가와 개선 의견을 한 번에 남겨주세요" | - |
| DS-1004 | 설정 목록 | SET-001_settings_Default | Visible | -표시.03: "데이터 기준 안내" 행에 아이콘, 제목 "데이터 기준 안내", 부제 "가격 단위·출처·기준일 안내" | - |
| DS-1005 | 설정 목록 | SET-001_settings_Default | Visible | -표시.04: "버전 정보" 행에 제목 "버전 정보", 부제 "최신 버전을 사용 중입니다", 우측에 버전 값 "v0.1.0 Beta" | - |
| DS-1006 | 설정 목록 | SET-001_settings_Default | Visible | -모달.01: "의견 보내기" 클릭 시 하단 시트가 열리며 이모지 5단계 평가(😠 매우나쁨/🙁 나쁨/😐 보통/🙂 만족/😍 매우만족) 선택 UI가 표시된다 | - |
| DS-1007 | 설정 목록 | SET-001_settings_Default | Visible | -구성.02: 평가 선택 시 감정 그룹(부정/중립/긍정)에 따라 후속 질문 제목과 선택형 칩 목록이 달라진다(예: 부정 그룹 "어떤 점이 아쉬웠나요?" — "시세가 부정확해요" 등 6개 칩) | - |
| DS-1008 | 설정 목록 | SET-001_settings_Default | Visible | -입력.01: 자유 의견 입력란(최대 200자, 남은 글자수 표시)이 칩 목록 아래에 노출된다 | - |
| DS-1009 | 설정 목록 | SET-001_settings_Default | Visible | -버튼.01: 하단 "제출하기" 버튼(평가 미선택 시 비활성 상태 색상으로 표시, 전송 중에는 "전송 중..." 문구로 변경) | - |
| DS-1010 | 설정 목록 | SET-001_settings_Default | Visible | -문구.01: 평가 5점(매우만족) 또는 4점(만족) 제출 후 "소중한 의견 감사합니다!" 문구와 함께 스토어 리뷰 유도 화면으로 전환되며 "스토어에 리뷰 쓰기", "다음에 할게요" 버튼이 표시된다 | - |
| DS-1011 | 설정 목록 | SET-001_settings_Default | Visible | -문구.02: 평가 1~3점 제출 시 토스트 문구 "소중한 의견 감사합니다. 빠르게 개선할게요"와 함께 시트가 닫힌다 | - |
| DS-1012 | 설정 목록 | SET-001_settings_Default | Invisible | -이동.01: "알림 설정" 행 클릭 시 /notifications/settings로 이동 | Registry: docs/ds/screen-registry.json<br>Route: /settings<br>File: src/routes/settings.tsx<br>기술근거.01: supabase.from("feedback").insert(...) — src/integrations/supabase/client.ts<br>기술근거.02: useFeedback — src/store/feedback.ts<br>기술근거.03: openStoreReview — src/lib/store-review.ts<br>Baseline: 2026-08-05 코드 기준 |
| DS-1013 | 설정 목록 | SET-001_settings_Default | Invisible | -이동.02: "데이터 기준 안내" 행 클릭 시 /data-guide로 이동 | - |
| DS-1014 | 설정 목록 | SET-001_settings_Default | Invisible | -데이터소스.01: 의견 보내기 제출 시 Supabase "feedback" 테이블에 kind="sentiment", rating(1~5), message(JSON 문자열: 선택 칩과 자유입력 텍스트), tags를 저장(src/integrations/supabase/client.ts) | - |
| DS-1015 | 설정 목록 | SET-001_settings_Default | Invisible | -데이터소스.02: 제출 성공 시 로컬 상태 저장소 useFeedback(src/store/feedback.ts, zustand persist)에도 동일 항목을 추가로 기록 | - |
| DS-1016 | 설정 목록 | SET-001_settings_Default | Invisible | -검증.01: 평가(이모지) 선택 전에는 "제출하기" 버튼이 비활성화되어 제출할 수 없다 | - |
| DS-1017 | 설정 목록 | SET-001_settings_Default | Invisible | -예외.01: Supabase 저장 실패 시 토스트 문구 "전송에 실패했어요. 잠시 후 다시 시도해 주세요"를 노출하고 시트를 닫지 않는다 | - |
| DS-1018 | 설정 목록 | SET-001_settings_Default | Invisible | -분기.01: 평가값이 1~2점이면 부정 그룹, 3점이면 중립 그룹, 4~5점이면 긍정 그룹으로 분류되어 후속 질문·칩·문구가 달라진다 | - |
| DS-1019 | 설정 목록 | SET-001_settings_Default | Invisible | -분기.02: 평가값이 4점 이상이면 제출 후 스토어 리뷰 유도 화면(StoreReviewPrompt)으로 전환된다 | - |
| DS-1020 | 설정 목록 | SET-001_settings_Default | Invisible | -액션.01: "스토어에 리뷰 쓰기" 버튼 클릭 시 openStoreReview() 호출로 기기 플랫폼(iOS/Android)을 판별해 해당 스토어 URL을 새 창으로 열고, 성공 시 토스트 "스토어로 이동합니다"를 노출한다 | - |
| DS-1021 | 설정 목록 | SET-001_settings_Default | Invisible | -초기값.01: 시트를 다시 열 때마다 key prop("o"/"c")로 FeedbackSheet가 리마운트되어 평가·칩·입력값이 초기화된다 | - |
| DS-1022 | 설정 목록 | SET-001_settings_Default | Design | -배경색.01: 각 섹션 카드 배경 연한 회색(#F8F9FA, surface 토큰) | Registry: docs/ds/screen-registry.json<br>Route: /settings<br>File: src/routes/settings.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-1023 | 설정 목록 | SET-001_settings_Default | Design | -모서리.01: 섹션 카드 모서리 반경 10px | - |
| DS-1024 | 설정 목록 | SET-001_settings_Default | Design | -안쪽여백.01: 각 행 내부 여백 상하 16px 좌우 16px | - |
| DS-1025 | 설정 목록 | SET-001_settings_Default | Design | -글자크기.01: 섹션 라벨("알림"/"피드백"/"정보") 12px 굵게, 글자색 회색(#6C757D, muted-foreground 토큰) | - |
| DS-1026 | 설정 목록 | SET-001_settings_Default | Design | -배경색.02: 행 좌측 아이콘 배경 연한 초록색(#F0F9F0), 아이콘 색상 초록색(#3A8A3A) | - |
| DS-1027 | 설정 목록 | SET-001_settings_Default | Design | -글자크기.02: 행 제목 14px 굵게, 부제 11px 회색 | - |
| DS-1028 | 설정 목록 | SET-001_settings_Default | Design | -테두리.01: 시트 상단 드래그 손잡이 바 배경 연한 회색(#E9ECEF) | - |
| DS-1029 | 설정 목록 | SET-001_settings_Default | Design | -글자크기.03: 시트 타이틀 "AGDICT 어떠셨나요?" 17px 굵게 | - |
| DS-1030 | 설정 목록 | SET-001_settings_Default | Design | -크기.01: 감정 이모지 글자 크기 30px, 미선택 시 회색조(grayscale) 처리 및 투명도 50% | - |
| DS-1031 | 설정 목록 | SET-001_settings_Default | Design | -배경색.03: 선택된 칩 배경 연한 초록색(#F0F9F0), 테두리 초록색(#3A8A3A), 글자색 진초록(#2E6E2E) | - |
| DS-1032 | 설정 목록 | SET-001_settings_Default | Design | -배경색.04: 자유입력 textarea 배경 연한 회색(#F8F9FA), 높이 110px | - |
| DS-1033 | 설정 목록 | SET-001_settings_Default | Design | -배경색.05: 제출 버튼 활성 시 배경 초록색(#3A8A3A), 비활성 시 회색(#ADB5BD), 글자색 흰색 | - |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## DTA-001_data-guide_Default — 데이터 안내 · 기본 상태

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-1034 | 데이터 안내 | DTA-001_data-guide_Default | Visible | -구성.01: 상단 헤더(뒤로가기, 타이틀 "데이터 기준 안내") + 안내 문구 + 5개 항목 카드 목록 + 하단 출처 문구 | Registry: docs/ds/screen-registry.json<br>Route: /data-guide<br>File: src/routes/data-guide.tsx<br>기술근거.01: AppShell screenId="SET-002_데이터안내"(레지스트리 Screen ID DTA-001과 문자열이 다름)<br>기술근거.02: DetailHeader 컴포넌트(src/components/detail-header.tsx)<br>Baseline: 2026-08-05 코드 기준 |
| DS-1035 | 데이터 안내 | DTA-001_data-guide_Default | Visible | -문구.01: 상단 안내 문구 "AGDICT는 KAMIS와 aT의 농산물 유통정보를 기반으로 시세를 제공합니다. 아래 기준을 참고하시면 시세를 더 정확하게 이해하실 수 있어요." | - |
| DS-1036 | 데이터 안내 | DTA-001_data-guide_Default | Visible | -목록항목.01: "데이터 출처" 카드 — "KAMIS 및 aT 농산물유통정보에서 제공하는 도매시장 경매 데이터를 기반으로 합니다." | - |
| DS-1037 | 데이터 안내 | DTA-001_data-guide_Default | Visible | -목록항목.02: "기준일 및 업데이트 시간" 카드 — "시세는 최근 경매일 기준으로 집계되며, 매일 오후 업데이트됩니다. 휴장일에는 직전 경매일 데이터가 표시됩니다." | - |
| DS-1038 | 데이터 안내 | DTA-001_data-guide_Default | Visible | -목록항목.03: "가격 단위" 카드 — "가격은 kg 기준으로 환산해 표시하는 것을 원칙으로 합니다. 다만 품목 특성에 따라 5kg, 8kg, 10kg, 20kg 등 표준 거래 단위가 함께 사용됩니다." | - |
| DS-1039 | 데이터 안내 | DTA-001_data-guide_Default | Visible | -목록항목.04: "경매일 기준 표시" 카드 — "차트와 시세 카드의 날짜는 실제 경매가 이루어진 경매일을 기준으로 하며, 조회일과 다를 수 있습니다." | - |
| DS-1040 | 데이터 안내 | DTA-001_data-guide_Default | Visible | -목록항목.05: "일부 데이터 안내" 카드 — "현재 일부 화면의 데이터는 데모용 mock 데이터를 사용하고 있으며, 실제 API 연동 시 동일한 구조로 교체될 수 있습니다." | - |
| DS-1041 | 데이터 안내 | DTA-001_data-guide_Default | Visible | -문구.02: 하단 출처 문구 "데이터 제공: KAMIS 농산물유통정보 / aT 한국농수산식품유통공사" | - |
| DS-1042 | 데이터 안내 | DTA-001_data-guide_Default | Invisible | -데이터소스.01: 항목 목록(items 배열)은 코드 내 고정 텍스트로 구성되어 별도 API 호출이 없다 | Registry: docs/ds/screen-registry.json<br>Route: /data-guide<br>File: src/routes/data-guide.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-1043 | 데이터 안내 | DTA-001_data-guide_Default | Invisible | -이동.01: 뒤로가기 버튼 클릭 시 브라우저 히스토리로 이전 화면 이동 | - |
| DS-1044 | 데이터 안내 | DTA-001_data-guide_Default | Invisible | -미구현.01: "일부 데이터 안내" 항목 자체가 화면 내 다른 데이터가 목데이터임을 사용자에게 알리는 고정 안내이며, 실제 API 연동 시점을 판별하는 로직은 없다 | - |
| DS-1045 | 데이터 안내 | DTA-001_data-guide_Default | Design | -배경색.01: 페이지 배경 흰색(#FFFFFF) | Registry: docs/ds/screen-registry.json<br>Route: /data-guide<br>File: src/routes/data-guide.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-1046 | 데이터 안내 | DTA-001_data-guide_Default | Design | -글자색.01: 상단 안내 문구 회색(#495057), 글자 크기 13px | - |
| DS-1047 | 데이터 안내 | DTA-001_data-guide_Default | Design | -배경색.02: 항목 카드 배경 흰색, 테두리 1px solid 연한 회색(#E9ECEF) | - |
| DS-1048 | 데이터 안내 | DTA-001_data-guide_Default | Design | -모서리.01: 항목 카드 모서리 반경 16px | - |
| DS-1049 | 데이터 안내 | DTA-001_data-guide_Default | Design | -안쪽여백.01: 항목 카드 내부 여백 16px | - |
| DS-1050 | 데이터 안내 | DTA-001_data-guide_Default | Design | -요소간격.01: 항목 카드 사이 세로 간격 10px | - |
| DS-1051 | 데이터 안내 | DTA-001_data-guide_Default | Design | -배경색.03: 항목 아이콘 배경 연한 초록색(#F1F8F1), 아이콘 색상 초록색(primary 토큰, #3A8A3A) | - |
| DS-1052 | 데이터 안내 | DTA-001_data-guide_Default | Design | -글자크기.01: 항목 제목 14px 굵게, 항목 본문 12.5px 회색(#6C757D) | - |
| DS-1053 | 데이터 안내 | DTA-001_data-guide_Default | Design | -글자색.02: 하단 출처 문구 색상 회색(#868E96), 글자 크기 11px | - |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## 분석 파일

- src/routes/settings.tsx
- src/routes/data-guide.tsx
- src/store/feedback.ts
- src/lib/store-review.ts
- src/integrations/supabase/client.ts
- src/components/detail-header.tsx
- src/styles.css

## 미구현·확인필요 요약

- ⚠️ 확인 필요.01: 설정 화면과 데이터 안내 화면 모두 코드 내부 AppShell screenId 문자열이 레지스트리(SET-001, DTA-001)와 표기가 달라(SET-001_설정, SET-002_데이터안내) 통일 여부 확인이 필요하다.
- -미구현.01: 데이터 기준 안내 화면의 모든 안내 문구는 고정 텍스트이며, 실제 최신 기준일·API 연동 상태를 동적으로 반영하지 않는다.
