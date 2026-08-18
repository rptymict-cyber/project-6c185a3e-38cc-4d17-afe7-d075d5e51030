# 공통 모달·바텀시트 DS

- Menu ID: common-modal
- Registry: docs/ds/screen-registry.json
- Baseline: 2026-08-05 코드 기준

## 단위 선택 시트 · 기본 상태

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-1301 | 단위 선택 시트 | CMN-001_unit-sheet_Default | Visible | -제목.01: 시트 상단 타이틀 "단위 선택" | Route: Parent=/market<br>File: src/components/market-v2/UnitSheet.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-1302 | 단위 선택 시트 | CMN-001_unit-sheet_Default | Visible | -목록항목.01: 단위 목록을 "kg 기준", "1kg", "5kg", "8kg 기준", "10kg", "15kg", "20kg" 순서로 세로 나열 | - |
| DS-1303 | 단위 선택 시트 | CMN-001_unit-sheet_Default | Visible | -상태표시.01: 현재 선택된 단위 행은 배경 강조와 우측 체크 표시로 구분 | - |
| DS-1304 | 단위 선택 시트 | CMN-001_unit-sheet_Default | Invisible | -데이터.01: 단위 목록은 고정된 상수 목록을 사용 | Route: Parent=/market<br>File: src/components/market-v2/UnitSheet.tsx<br>Baseline: 2026-08-05 코드 기준<br>기술근거.01: 목록 상수 src/lib/mock/market-taxonomy.ts(UNITS)<br>기술근거.02: 상태 연동 src/store/market.ts(useMarketFilter, unit/setUnit) |
| DS-1305 | 단위 선택 시트 | CMN-001_unit-sheet_Default | Invisible | -초기값.01: 현재 선택값은 시세 필터 공통 상태의 단위 값을 그대로 반영, 기본값 "10kg 기준" | - |
| DS-1306 | 단위 선택 시트 | CMN-001_unit-sheet_Default | Invisible | -액션.01: 목록 항목을 누르면 해당 단위로 즉시 변경하고 시트를 닫음 | - |
| DS-1307 | 단위 선택 시트 | CMN-001_unit-sheet_Default | Design | -배경색.01: 선택된 행 배경 연한 초록색(#F0F9F0) | Route: Parent=/market<br>File: src/components/market-v2/UnitSheet.tsx<br>Baseline: 2026-08-05 코드 기준<br>기술근거.01: rounded-t-2xl, rounded-[10px], text-[16px], text-[14px] |
| DS-1308 | 단위 선택 시트 | CMN-001_unit-sheet_Default | Design | -글자색.01: 선택된 행 글자색 진한 초록색(#1F5C1F), 굵게 | - |
| DS-1309 | 단위 선택 시트 | CMN-001_unit-sheet_Default | Design | -글자색.02: 미선택 행 글자색 진회색(#212529) | - |
| DS-1310 | 단위 선택 시트 | CMN-001_unit-sheet_Default | Design | -아이콘색.01: 체크 아이콘 색 초록색(#3A8A3A) | - |
| DS-1311 | 단위 선택 시트 | CMN-001_unit-sheet_Default | Design | -글자크기.01: 타이틀 16px, 굵게 | - |
| DS-1312 | 단위 선택 시트 | CMN-001_unit-sheet_Default | Design | -글자크기.02: 목록 항목 14px | - |
| DS-1313 | 단위 선택 시트 | CMN-001_unit-sheet_Default | Design | -모서리.01: 시트 상단 모서리 반경 16px | - |
| DS-1314 | 단위 선택 시트 | CMN-001_unit-sheet_Default | Design | -모서리.02: 목록 행 모서리 반경 10px | - |
| DS-1315 | 단위 선택 시트 | CMN-001_unit-sheet_Default | Design | -안쪽여백.01: 행 안쪽 여백 좌우 12px, 상하 12px | - |
| DS-1316 | 단위 선택 시트 | CMN-001_unit-sheet_Default | Design | -아이콘크기.01: 체크 아이콘 16x16px | - |

## 정렬 시트 · 기본 상태

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-1317 | 정렬 시트 | CMN-002_sort-sheet_Default | Visible | -제목.01: 시트 상단 타이틀 "정렬" | Route: Parent=/market<br>File: src/components/market-v2/SortSheet.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-1318 | 정렬 시트 | CMN-002_sort-sheet_Default | Visible | -목록항목.01: 정렬 옵션 "거래량순", "등락률순", "가나다순"을 구분선으로 나눠 세로 나열 | - |
| DS-1319 | 정렬 시트 | CMN-002_sort-sheet_Default | Visible | -상태표시.01: 현재 선택된 정렬 항목은 글자색 강조와 우측 체크 표시로 구분 | - |
| DS-1320 | 정렬 시트 | CMN-002_sort-sheet_Default | Invisible | -데이터.01: 정렬 옵션은 "거래량순", "등락률순", "가나다순" 3개로 고정 | Route: Parent=/market<br>File: src/components/market-v2/SortSheet.tsx<br>Baseline: 2026-08-05 코드 기준<br>기술근거.01: 옵션 순서 opts=["volume","change","name"]<br>기술근거.02: 라벨 매핑 src/store/market.ts(SORT_LABEL) |
| DS-1321 | 정렬 시트 | CMN-002_sort-sheet_Default | Invisible | -초기값.01: 현재 선택값은 이 시트를 호출한 상위 화면이 전달한 값을 그대로 사용 | - |
| DS-1322 | 정렬 시트 | CMN-002_sort-sheet_Default | Invisible | -액션.01: 목록 항목을 누르면 해당 정렬로 즉시 변경하고 시트를 닫음 | - |
| DS-1323 | 정렬 시트 | CMN-002_sort-sheet_Default | Design | -글자색.01: 선택된 행 글자색 초록색(#3A8A3A), 굵게 | Route: Parent=/market<br>File: src/components/market-v2/SortSheet.tsx<br>Baseline: 2026-08-05 코드 기준<br>기술근거.01: rounded-t-2xl, divide-[#F1F3F5], py-3.5, text-[15px], text-[14px] |
| DS-1324 | 정렬 시트 | CMN-002_sort-sheet_Default | Design | -글자색.02: 미선택 행 글자색 진회색(#212529) | - |
| DS-1325 | 정렬 시트 | CMN-002_sort-sheet_Default | Design | -테두리색.01: 항목 구분선 색 연회색(#F1F3F5) | - |
| DS-1326 | 정렬 시트 | CMN-002_sort-sheet_Default | Design | -글자크기.01: 타이틀 15px | - |
| DS-1327 | 정렬 시트 | CMN-002_sort-sheet_Default | Design | -글자크기.02: 목록 항목 14px | - |
| DS-1328 | 정렬 시트 | CMN-002_sort-sheet_Default | Design | -모서리.01: 시트 상단 모서리 반경 16px | - |
| DS-1329 | 정렬 시트 | CMN-002_sort-sheet_Default | Design | -안쪽여백.01: 행 상하 여백 14px | - |
| DS-1330 | 정렬 시트 | CMN-002_sort-sheet_Default | Design | -아이콘크기.01: 체크 아이콘 16x16px | - |

## 별점 유도 모달 · 기본 상태

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-1331 | 별점 유도 모달 | CMN-003_rate-prompt-modal_Default | Visible | -구성.01: 화면 중앙에 카드형 팝업이 뜨고 상단에 별 모양 아이콘이 담긴 원형 배지 표시 | Route: Parent=/<br>File: src/components/RatePromptModal.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-1332 | 별점 유도 모달 | CMN-003_rate-prompt-modal_Default | Visible | -문구.01: 1단계 타이틀 "앱이 마음에 드시나요?", 부제 "별점을 남겨주시면 큰 힘이 됩니다!" | - |
| DS-1333 | 별점 유도 모달 | CMN-003_rate-prompt-modal_Default | Visible | -구성.02: 1단계에는 1~5점을 선택할 수 있는 별 5개가 가로로 나열 | - |
| DS-1334 | 별점 유도 모달 | CMN-003_rate-prompt-modal_Default | Visible | -버튼.01: 1단계 하단에 "나중에", "다시 보지 않기" 텍스트 버튼 배치 | - |
| DS-1335 | 별점 유도 모달 | CMN-003_rate-prompt-modal_Default | Visible | -문구.02: 2단계 타이틀 "의견을 들려주세요", 부제 "불편하거나 아쉬웠던 점을 알려주시면 개선하겠습니다." | - |
| DS-1336 | 별점 유도 모달 | CMN-003_rate-prompt-modal_Default | Visible | -입력.01: 2단계에 자유 입력란 표시, 안내 문구 "개선 의견을 남겨주세요", 최대 200자 입력 가능하며 우측 하단에 글자 수 표시 | - |
| DS-1337 | 별점 유도 모달 | CMN-003_rate-prompt-modal_Default | Visible | -버튼.02: 2단계 "보내기" 버튼 표시, 전송 중에는 버튼 문구가 "전송 중..."으로 바뀜 | - |
| DS-1338 | 별점 유도 모달 | CMN-003_rate-prompt-modal_Default | Visible | -버튼.03: 2단계 하단에도 "나중에", "다시 보지 않기" 텍스트 버튼 배치 | - |
| DS-1339 | 별점 유도 모달 | CMN-003_rate-prompt-modal_Default | Invisible | -조건.01: 앱이 열릴 때마다 매번 1회 노출 여부를 판단하며 화면 이동만으로는 다시 나타나지 않음 | Route: Parent=/<br>File: src/components/RatePromptModal.tsx<br>Baseline: 2026-08-05 코드 기준<br>기술근거.01: 노출 이력 저장 키 localStorage "agdict:ratePrompt"(hidden, lastShownAt)<br>기술근거.02: 앱스토어 이동 함수 src/lib/store-review.ts(openStoreReview)<br>기술근거.03: 의견 저장 대상 Supabase feedback 테이블(kind="rating", rating, message) |
| DS-1340 | 별점 유도 모달 | CMN-003_rate-prompt-modal_Default | Invisible | -초기값.01: 저장된 값이 없거나 읽기에 실패하면 노출 대상으로 간주 | - |
| DS-1341 | 별점 유도 모달 | CMN-003_rate-prompt-modal_Default | Invisible | -상태.01: 노출 조건을 만족하면 팝업을 열고 노출 이력을 저장 | - |
| DS-1342 | 별점 유도 모달 | CMN-003_rate-prompt-modal_Default | Invisible | -조건.02: 별점 4점 이상 선택 시 앱스토어 리뷰 화면으로 이동을 시도한 뒤 다시 보지 않음 상태로 저장하고 팝업을 닫음 | - |
| DS-1343 | 별점 유도 모달 | CMN-003_rate-prompt-modal_Default | Invisible | -조건.03: 별점 1~3점 선택 시 의견 입력 단계로 전환 | - |
| DS-1344 | 별점 유도 모달 | CMN-003_rate-prompt-modal_Default | Invisible | -액션.01: 의견 입력 후 보내기를 누르면 의견 데이터를 서버에 저장 요청, 빈 입력이면 "(별점 피드백)"으로 대체 저장 | - |
| DS-1345 | 별점 유도 모달 | CMN-003_rate-prompt-modal_Default | Invisible | -예외.01: 저장에 실패하면 안내 문구 "전송에 실패했어요. 잠시 후 다시 시도해 주세요" 표시 후 재시도 가능한 상태 유지 | - |
| DS-1346 | 별점 유도 모달 | CMN-003_rate-prompt-modal_Default | Invisible | -액션.02: 저장에 성공하면 안내 문구 "소중한 의견 감사합니다! 🙏" 표시 후 다시 보지 않음 상태로 저장하고 팝업을 닫음 | - |
| DS-1347 | 별점 유도 모달 | CMN-003_rate-prompt-modal_Default | Invisible | -액션.03: "나중에" 선택 시 이번 노출만 닫히고 다음 접속 시 다시 노출 | - |
| DS-1348 | 별점 유도 모달 | CMN-003_rate-prompt-modal_Default | Invisible | -액션.04: "다시 보지 않기" 선택 시 이후 다시 노출되지 않도록 저장 | - |
| DS-1349 | 별점 유도 모달 | CMN-003_rate-prompt-modal_Default | Invisible | -검증.01: 자유 입력란은 최대 200자까지만 입력 가능 | - |
| DS-1350 | 별점 유도 모달 | CMN-003_rate-prompt-modal_Default | Design | -배경색.01: 뒷배경 반투명 검정(rgba(0,0,0,0.5)) | Route: Parent=/<br>File: src/components/RatePromptModal.tsx<br>Baseline: 2026-08-05 코드 기준<br>기술근거.01: rounded-[20px], p-6, h-16 w-16, rounded-[18px], shadow-2xl, shadow-md, z-[100] |
| DS-1351 | 별점 유도 모달 | CMN-003_rate-prompt-modal_Default | Design | -배경색.02: 카드 배경 흰색(#FFFFFF) | - |
| DS-1352 | 별점 유도 모달 | CMN-003_rate-prompt-modal_Default | Design | -배경색.03: 상단 배지 대각선 그라디언트 초록색(#3A8A3A)에서 연두색(#62B347) | - |
| DS-1353 | 별점 유도 모달 | CMN-003_rate-prompt-modal_Default | Design | -배경색.04: 자유 입력란 배경 연회색(#F8F9FA) | - |
| DS-1354 | 별점 유도 모달 | CMN-003_rate-prompt-modal_Default | Design | -글자색.01: 타이틀 글자색 진회색(#212529) | - |
| DS-1355 | 별점 유도 모달 | CMN-003_rate-prompt-modal_Default | Design | -글자색.02: 부제 글자색 회색(#868E96) | - |
| DS-1356 | 별점 유도 모달 | CMN-003_rate-prompt-modal_Default | Design | -글자색.03: "나중에" 버튼 글자색 회색(#868E96) | - |
| DS-1357 | 별점 유도 모달 | CMN-003_rate-prompt-modal_Default | Design | -글자색.04: "다시 보지 않기" 버튼 글자색 진회색(#495057) | - |
| DS-1358 | 별점 유도 모달 | CMN-003_rate-prompt-modal_Default | Design | -상태색.01: 선택 또는 커서를 올린 별 색 주황색(#F59F00, 채움), 미선택 별 색 연회색(#DEE2E6, 외곽선만) | - |
| DS-1359 | 별점 유도 모달 | CMN-003_rate-prompt-modal_Default | Design | -상태색.02: 보내기 버튼 배경 활성 시 초록색(#3A8A3A), 전송 중이거나 비활성 시 회색(#ADB5BD) | - |
| DS-1360 | 별점 유도 모달 | CMN-003_rate-prompt-modal_Default | Design | -글자크기.01: 타이틀 17px, 굵게 | - |
| DS-1361 | 별점 유도 모달 | CMN-003_rate-prompt-modal_Default | Design | -글자크기.02: 부제 12.5px | - |
| DS-1362 | 별점 유도 모달 | CMN-003_rate-prompt-modal_Default | Design | -글자크기.03: 텍스트 버튼 13px, 굵게 | - |
| DS-1363 | 별점 유도 모달 | CMN-003_rate-prompt-modal_Default | Design | -너비.01: 카드 최대 너비 320px | - |
| DS-1364 | 별점 유도 모달 | CMN-003_rate-prompt-modal_Default | Design | -모서리.01: 카드 모서리 반경 20px | - |
| DS-1365 | 별점 유도 모달 | CMN-003_rate-prompt-modal_Default | Design | -모서리.02: 상단 배지 모서리 반경 18px | - |
| DS-1366 | 별점 유도 모달 | CMN-003_rate-prompt-modal_Default | Design | -모서리.03: 자유 입력란 모서리 반경 10px | - |
| DS-1367 | 별점 유도 모달 | CMN-003_rate-prompt-modal_Default | Design | -그림자.01: 카드 그림자 큰 그림자(box-shadow 0 25px 50px -12px rgba(0,0,0,0.25)) | - |
| DS-1368 | 별점 유도 모달 | CMN-003_rate-prompt-modal_Default | Design | -그림자.02: 상단 배지 중간 그림자 | - |
| DS-1369 | 별점 유도 모달 | CMN-003_rate-prompt-modal_Default | Design | -안쪽여백.01: 카드 안쪽 여백 24px | - |
| DS-1370 | 별점 유도 모달 | CMN-003_rate-prompt-modal_Default | Design | -아이콘크기.01: 별 선택 아이콘 32x32px, 선 두께 1.5px | - |
| DS-1371 | 별점 유도 모달 | CMN-003_rate-prompt-modal_Default | Design | -아이콘크기.02: 상단 배지 안 별 아이콘 32x32px | - |
| DS-1372 | 별점 유도 모달 | CMN-003_rate-prompt-modal_Default | Design | -높이.01: 자유 입력란 높이 110px | - |
| DS-1373 | 별점 유도 모달 | CMN-003_rate-prompt-modal_Default | Design | -쌓임순서.01: 팝업 레이어 z-index 100 | - |

## 공통 더보기 버튼 · 기본 상태

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-1374 | 공통 더보기 버튼 | CMN-004_load-more-button_Default | Visible | -버튼.01: 화면 너비에 맞춘 버튼, 라벨 "더보기" 고정 표시, 라벨 우측에 아래 방향 화살표 아이콘 배치 | Route: Parent=/live<br>File: src/components/common/LoadMoreButton.tsx<br>Baseline: 2026-08-05 코드 기준 |
| DS-1375 | 공통 더보기 버튼 | CMN-004_load-more-button_Default | Visible | -접근성.01: 스크린리더용 명칭 기본값 "더보기"(호출 화면에서 다른 값으로 대체 가능) | - |
| DS-1376 | 공통 더보기 버튼 | CMN-004_load-more-button_Default | Invisible | -조건.01: 목록·표가 한 화면에 최대 50건까지 표시되고 그보다 데이터가 더 있을 때만 노출하도록 설계되어 있으며, 실제 노출 여부 판단은 이 버튼을 사용하는 화면에서 처리 | Route: Parent=/live<br>File: src/components/common/LoadMoreButton.tsx<br>Baseline: 2026-08-05 코드 기준<br>기술근거.01: 페이지당 최대 건수 상수 LIST_PAGE_SIZE=50 |
| DS-1377 | 공통 더보기 버튼 | CMN-004_load-more-button_Default | Invisible | -액션.01: 버튼을 누르면 호출 화면에서 전달한 추가 목록 불러오기 동작을 실행 | - |
| DS-1378 | 공통 더보기 버튼 | CMN-004_load-more-button_Default | Invisible | -미구현.01: "N건 중 M건"과 같은 부가 안내 문구는 표시하지 않으며 라벨 외 문구 추가는 금지되어 있음 | - |
| DS-1379 | 공통 더보기 버튼 | CMN-004_load-more-button_Default | Design | -배경색.01: 기본 배경 흰색(#FFFFFF) | Route: Parent=/live<br>File: src/components/common/LoadMoreButton.tsx<br>Baseline: 2026-08-05 코드 기준<br>기술근거.01: h-11, rounded-[10px], border-[#E9ECEF], active:bg-secondary, mt-3, gap-1, text-[13px], h-4 w-4 |
| DS-1380 | 공통 더보기 버튼 | CMN-004_load-more-button_Default | Design | -배경색.02: 눌렀을 때 배경 연회색(#F1F3F5) | - |
| DS-1381 | 공통 더보기 버튼 | CMN-004_load-more-button_Default | Design | -글자색.01: 라벨 글자색 진회색(#495057) | - |
| DS-1382 | 공통 더보기 버튼 | CMN-004_load-more-button_Default | Design | -테두리.01: 테두리 1px, 연회색(#E9ECEF) | - |
| DS-1383 | 공통 더보기 버튼 | CMN-004_load-more-button_Default | Design | -모서리.01: 모서리 반경 10px | - |
| DS-1384 | 공통 더보기 버튼 | CMN-004_load-more-button_Default | Design | -높이.01: 버튼 높이 44px | - |
| DS-1385 | 공통 더보기 버튼 | CMN-004_load-more-button_Default | Design | -바깥여백.01: 버튼 위쪽 여백 12px | - |
| DS-1386 | 공통 더보기 버튼 | CMN-004_load-more-button_Default | Design | -요소간격.01: 라벨과 아이콘 사이 간격 4px | - |
| DS-1387 | 공통 더보기 버튼 | CMN-004_load-more-button_Default | Design | -글자크기.01: 라벨 13px, 굵게 | - |
| DS-1388 | 공통 더보기 버튼 | CMN-004_load-more-button_Default | Design | -아이콘크기.01: 아래 방향 화살표 아이콘 16x16px | - |

Confluence 등록 시 같은 Screen ID의 연속 행에 있는 DS No. · Section명 · Screen ID 셀은 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.


## 위치 권한 임시 확인 모달 · 기본 상태
| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-1389 | 위치 권한 임시 확인 모달 | CMN-005_location-permission-modal_Default | Visible | -구성.01: 중앙 정렬 모달로 원형 위치 아이콘, 제목, 설명 문구, 임시 화면 안내 박스, 하단 좌우 2분할 버튼(거부·허용)으로 구성한다 | Registry: docs/ds/screen-registry.json<br>Route: 공통(전역 오버레이)<br>File: src/components/LocationPermissionDevModal.tsx<br>기술근거.01: LocationPermissionDevModal — src/components/LocationPermissionDevModal.tsx<br>Baseline: 2026-08-18 코드 기준<br>⚠️ 확인 필요.01: 실제 사양은 브라우저(OS) 네이티브 위치 권한 팝업이며 이 모달은 미리보기 환경 확인용 임시 화면으로 배포 검증 후 제거 대상이다 |
| DS-1390 | 위치 권한 임시 확인 모달 | CMN-005_location-permission-modal_Default | Visible | -제목.01: 제목 문구 "현재 위치 정보를 사용할까요?" | - |
| DS-1391 | 위치 권한 임시 확인 모달 | CMN-005_location-permission-modal_Default | Visible | -문구.01: 설명 문구 "가까운 도매시장과 현재 위치 날씨를 안내하는 데 사용됩니다." | - |
| DS-1392 | 위치 권한 임시 확인 모달 | CMN-005_location-permission-modal_Default | Visible | -문구.02: 안내 박스 문구 "이것은 임시 확인용 화면이며, 실제 배포 환경에서는 브라우저(OS)의 네이티브 위치 권한 팝업이 대신 표시됩니다." | - |
| DS-1393 | 위치 권한 임시 확인 모달 | CMN-005_location-permission-modal_Default | Visible | -버튼.01: 하단 버튼 라벨 좌측 "거부", 우측 "허용" | - |
| DS-1394 | 위치 권한 임시 확인 모달 | CMN-005_location-permission-modal_Default | Invisible | -진입조건.01: 미리보기(iframe) 환경에서 위치 권한 요청이 발생하면 이 모달을 표시한다 | - |
| DS-1395 | 위치 권한 임시 확인 모달 | CMN-005_location-permission-modal_Default | Invisible | -액션.01: "허용"을 누르면 위치 권한 허용으로 처리하고 기본 좌표를 주입해 위치 기반 화면(날씨 배너·가까운 도매시장)을 갱신한다 | - |
| DS-1396 | 위치 권한 임시 확인 모달 | CMN-005_location-permission-modal_Default | Invisible | -액션.02: "거부"를 누르거나 모달을 닫으면 권한 미허용으로 처리하고 기본 지역 기준 정보를 유지한다 | - |
| DS-1397 | 위치 권한 임시 확인 모달 | CMN-005_location-permission-modal_Default | Invisible | -미구현.01: 실제 위치 권한 팝업 및 좌표 기반 실시간 조회는 아직 연결되지 않았다 | - |
| DS-1398 | 위치 권한 임시 확인 모달 | CMN-005_location-permission-modal_Default | Design | -크기.01: 모달 너비 300px, 모서리 반경 16px | Registry: docs/ds/screen-registry.json<br>Route: 공통(전역 오버레이)<br>File: src/components/LocationPermissionDevModal.tsx<br>기술근거.01: LocationPermissionDevModal — src/components/LocationPermissionDevModal.tsx<br>Baseline: 2026-08-18 코드 기준<br>⚠️ 확인 필요.01: 실제 사양은 브라우저(OS) 네이티브 위치 권한 팝업이며 이 모달은 미리보기 환경 확인용 임시 화면으로 배포 검증 후 제거 대상이다 |
| DS-1399 | 위치 권한 임시 확인 모달 | CMN-005_location-permission-modal_Default | Design | -배경색.01: 아이콘 배경 연한 초록(#3A8A3A 8% 투명도), 아이콘 색 초록색(#3A8A3A), 안내 박스 배경 연한 회색(#F8F9FA)·글자색 회색(#6C757D) | - |
| DS-1400 | 위치 권한 임시 확인 모달 | CMN-005_location-permission-modal_Default | Design | -글자크기.01: 제목 15.5px 굵게, 설명 12.5px, 안내 박스 11.5px, 버튼 14px | - |
| DS-1401 | 위치 권한 임시 확인 모달 | CMN-005_location-permission-modal_Default | Design | -테두리.01: 버튼 영역 상단 및 버튼 사이 구분선 1px solid 연한 회색(#F1F3F5) | - |
| DS-1402 | 위치 권한 임시 확인 모달 | CMN-005_location-permission-modal_Default | Design | -글자색.01: 거부 버튼 회색(#6C757D), 허용 버튼 초록색(#3A8A3A) | - |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## 분석 파일

- src/components/market-v2/UnitSheet.tsx
- src/components/market-v2/SortSheet.tsx
- src/components/RatePromptModal.tsx
- src/components/common/LoadMoreButton.tsx
- src/lib/mock/market-taxonomy.ts
- src/store/market.ts
- src/lib/store-review.ts
- src/styles.css

## 미구현·확인필요 요약

- 미구현: 0건
- 확인필요: 0건
