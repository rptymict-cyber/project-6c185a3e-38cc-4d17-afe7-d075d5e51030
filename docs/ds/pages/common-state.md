# 공통 전역 상태 DS

- Menu ID: common-state
- Registry: docs/ds/screen-registry.json
- Baseline: 2026-08-05 코드 기준

## 개요

본 문서가 다루는 대상은 특정 화면 하나에 속하지 않고 앱 여러 화면에서 공통으로 참조하는 전역 상태 모음이다. docs/ds/screen-registry.json에는 menuId가 common-state로 등록된 Screen ID가 존재하지 않으므로, 이 문서는 규격 v3의 Screen ID별 표 구성 대신 전역 상태별 불릿 정리로 대체한다. 각 전역 상태는 브라우저에 설치된 상태 관리 라이브러리(zustand)로 구현되어 있으며, 그중 일부는 지속성 기능(persist)을 통해 브라우저의 localStorage에 값을 저장하고 앱 재실행 시 복원한다.

## 전역 상태 목록

-정의.01: 가격 알림 상태 — 사용자가 설정한 품목별 가격 알림 조건과 알림 활성화 여부를 보관<br>-저장위치.01: localStorage 키 "agdict:alerts"에 저장되어 앱 재실행 후에도 유지<br>-초기값.01: 저장된 값이 없으면 빈 알림 목록으로 시작<br>-미구현.01: 서버를 통한 실제 푸시 알림 발송 연동은 구현되어 있지 않음

-정의.02: 작물 선택 상태 — 화면 곳곳에서 사용하는 확정된 작물 선택값과 선택 화면에서 편집 중인 임시값을 구분해 보관<br>-저장위치.02: localStorage 키 "agdict:crop-selection"에 저장되어 앱 재실행 후에도 유지<br>-초기값.02: 저장된 값이 없으면 선택되지 않은 상태로 시작

-정의.03: 피드백 상태 — 사용자가 남긴 의견 목록을 보관<br>-저장위치.03: localStorage 키 "agdict:feedback"에 저장되어 앱 재실행 후에도 유지<br>-초기값.03: 저장된 값이 없으면 빈 목록으로 시작

-정의.04: 홈 고정 항목 상태 — 홈 화면에 고정 노출할 도매시장과 품목 목록을 보관<br>-저장위치.04: localStorage 키 "agdict:homeFixed"에 저장되어 앱 재실행 후에도 유지<br>-초기값.04: 저장된 값이 없으면 빈 목록으로 시작

-정의.05: 관심 품목 상태 — 사용자가 즐겨찾는 품목 목록과 그중 대표로 지정한 품목을 보관<br>-저장위치.05: localStorage 키 "agdict:interests"에 저장되어 앱 재실행 후에도 유지<br>-초기값.05: 저장된 값이 없으면 빈 목록으로 시작

-정의.06: 위치 권한 상태 — 위치 정보 접근 권한을 요청했는지와 허용되었는지 여부를 보관<br>-저장위치.06: 별도로 저장하지 않으며 앱을 새로 열 때마다 초기화되는 세션 단위 값<br>-초기값.06: 요청 전 상태로 시작<br>-미구현.06: 실제 위도·경도 좌표 저장 및 산지 거리 계산 기능은 구현되어 있지 않음

-정의.07: 시세 조회 필터 상태 — 시세 화면에서 사용하는 부류·품목·시장·간편 보기 여부 등 조회 조건을 보관<br>-저장위치.07: localStorage 키 "agdict:marketFilter:v2"에 저장되어 앱 재실행 후에도 유지<br>-초기값.07: 저장된 값이 없으면 기본 부류·품목·시장 조합으로 시작

-정의.08: 알림 이벤트 상태 — 발생한 알림 이벤트 이력과 읽음 여부를 보관<br>-저장위치.08: localStorage 키 "agdict:notification-events"에 저장되어 앱 재실행 후에도 유지<br>-초기값.08: 최초 진입 시 안내용 기본 이벤트를 한 번 채워 넣은 뒤 유지

-정의.09: 최근 조회 통계 상태 — 사용자가 최근 조회한 품종 통계 이력을 보관<br>-저장위치.09: localStorage 키 "agdict.recent-stats.v1"에 저장되어 앱 재실행 후에도 유지<br>-초기값.09: 저장된 값이 없으면 빈 이력으로 시작

-정의.10: 저장된 조회 조건 상태 — 사용자가 저장한 시세 조회 조건 목록을 보관<br>-저장위치.10: localStorage 키 "agdict:saved-queries:v1"에 저장되어 앱 재실행 후에도 유지<br>-초기값.10: 저장된 값이 없으면 빈 목록으로 시작

-정의.11: 통계 화면 조회 조건 상태 — 통계 화면에서 선택한 작물·비교 시장·조회 기간을 보관<br>-저장위치.11: 별도로 저장하지 않으며 앱을 새로 열 때마다 초기화<br>-초기값.11: 기본 작물과 기본 조회 기간으로 시작

-정의.12: 추세 비교 상태 — 시세 추세 그래프에서 비교 대상으로 지정한 시장 목록과 연간 비교 여부를 보관<br>-저장위치.12: localStorage 키 "agdict:trend-compare"에 저장되어 앱 재실행 후에도 유지<br>-초기값.12: 저장된 값이 없으면 비교 대상 없이 시작

-정의.13: 화면 공통 필터 상태 — 앱 전역에서 참조하는 기본 카테고리와 기본 조회 기간을 보관<br>-저장위치.13: localStorage 키 "agdict:ui"에 저장되어 앱 재실행 후에도 유지<br>-초기값.13: 저장된 값이 없으면 기본 카테고리와 기본 기간으로 시작

-정의.14: 관심 목록 상태 — 관심 품목과 관심 시장 아이디 목록을 보관<br>-저장위치.14: localStorage 키 "agdict:watchlist"에 저장되어 앱 재실행 후에도 유지<br>-초기값.14: 저장된 값이 없으면 빈 목록으로 시작

-정의.15: 즐겨찾기 시세 상태 — 시장·품목·법인 등 조건이 결합된 상세 시세 즐겨찾기 항목을 보관<br>-저장위치.15: localStorage 키 "agdict:favoritePriceItems"에 저장되어 앱 재실행 후에도 유지<br>-초기값.15: 저장된 값이 없으면 빈 목록으로 시작

-정의.16: AI 시세 예측 조회 조건 상태 — 예측 화면에서 선택한 작물, 물량, 등급 등 조회 옵션을 보관<br>-저장위치.16: localStorage 키 "agdict:aiPricePrediction"에 저장되어 앱 재실행 후에도 유지<br>-초기값.16: 저장된 값이 없으면 선택되지 않은 상태로 시작<br>-미구현.16: 실제 AI 예측 서버 연동은 구현되어 있지 않으며 현재는 예시 데이터로 동작

## 비고

- ⚠️ 확인 필요.01: 시세 조회 필터 상태와 별도로 존재하는 구버전 시세 상태(useMarketStore)의 정리·통합 여부 확인이 필요하다.
- ⚠️ 확인 필요.02: localStorage 용량 제한을 고려한 저장 데이터 크기 점검이 필요하다.

## 분석 파일

- src/store/alerts.ts
- src/store/cropSelection.ts
- src/store/feedback.ts
- src/store/homeFixedItems.ts
- src/store/interests.ts
- src/store/location.ts
- src/store/market.ts
- src/store/notification-events.ts
- src/store/recent-stats.ts
- src/store/saved-queries.ts
- src/store/statistics.ts
- src/store/trend-compare.ts
- src/store/ui.ts
- src/store/watchlist.ts
- src/features/favorites/favoriteStore.ts
- src/features/prediction/usePredictionView.ts
