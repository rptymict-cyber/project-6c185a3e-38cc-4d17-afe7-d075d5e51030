# 공통 상태 관리

본 문서는 AGDICT 서비스 전체에서 사용되는 공통 상태(Store) 명세입니다. 해당 스토어들은 특정 화면에 종속되지 않고 앱 전역에서 참조되거나 여러 화면에 걸쳐 사용되므로 별도의 **등록 Screen ID**를 부여하지 않습니다.

## 상태 관리 개요

- **라이브러리**: `zustand`
- **영속성**: `persist` 미들웨어를 사용하여 `localStorage`에 상태를 저장하고 복원합니다.
- **포맷**: 모든 항목은 `-라벨.01: 내용` 형식을 준수합니다.

---

## 스토어 명세

### 1. 가격 알림 스토어 (useAlerts)
- 목적.01: 사용자가 설정한 농산물 가격 알림 규칙 및 관련 상태 관리
- 상태값.01: `rules` (알림 규칙 목록), `byKey` (레거시 식별자 기반 알림 설정)
- 주요 액션.01: `upsert` (규칙 추가/수정), `remove` (규칙 삭제), `setEnabled` (활성화 토글)
- persist storage key.01: `agdict:alerts`
- 미구현 항목.01: 서버 푸시 알림(FCM 등) 발송 인프라와의 실시간 연동

### 2. 작물 선택 스토어 (useCropSelection)
- 목적.01: 앱 전역에서 사용하는 확정된 작물 선택 상태 및 편집용 임시 상태 관리
- 상태값.01: `committed` (확정된 선택), `draft` (편집 중인 상태)
- 주요 액션.01: `commitDraft` (편집본 확정), `setDraftCategory` (부류 선택), `clearDraft` (초기화)
- persist storage key.01: `agdict:crop-selection`
- 미구현 항목.01: 선택 기록 기반의 추천 작물 로직

### 3. 피드백 스토어 (useFeedback)
- 목적.01: 사용자 만족도 및 개선 의견 데이터 관리
- 상태값.01: `items` (피드백 목록)
- 주요 액션.01: `add` (신규 피드백 등록)
- persist storage key.01: `agdict:feedback`
- 미구현 항목.01: 관리자 대시보드로의 피드백 데이터 자동 전송 API

### 4. 홈 고정 항목 스토어 (useHomeFixed)
- 목적.01: 홈 화면에 노출할 도매시장 및 품목의 사용자 정의 목록 관리
- 상태값.01: `markets` (시장 ID 목록), `items` (품목 ID 목록)
- 주요 액션.01: `addMarket` (시장 추가), `removeMarket` (시장 삭제), `setItems` (순서 변경)
- persist storage key.01: `agdict:homeFixed`
- 미구현 항목.01: 드래그 앤 드롭을 이용한 직관적인 순서 변경 UI

### 5. 관심 작물 스토어 (useInterests)
- 목적.01: 사용자가 즐겨찾는 주요 관심 품목 관리
- 상태값.01: `ids` (관심 품목 ID 목록), `selectedId` (현재 선택된 대표 품목)
- 주요 액션.01: `add` (추가), `remove` (삭제), `select` (대표 설정)
- persist storage key.01: `agdict:interests`
- 미구현 항목.01: 없음

### 6. 위치 권한 스토어 (useLocation)
- 목적.01: 브라우저/기기의 GPS 위치 권한 획득 상태 관리
- 상태값.01: `granted` (권한 허용 여부), `requested` (요청 수행 여부)
- 주요 액션.01: `request` (권한 요청 실행)
- persist storage key.01: 없음 (세션 단위 관리)
- 미구현 항목.01: 실제 위경도 좌표값 저장 및 산지 거리 계산 로직

### 7. 시장 필터 스토어 (useMarketFilter)
- 목적.01: 도매 시세 조회 시 사용하는 날짜, 품목, 시장 등 상세 필터링 조건 관리
- 상태값.01: `categoryId`, `itemId`, `marketId`, `simpleMode` (간편 보기 여부)
- 주요 액션.01: `setItem` (품목 변경), `setMarket` (시장 변경), `toggleSimpleMode` (보기 모드 전환)
- persist storage key.01: `agdict:marketFilter:v2`
- 미구현 항목.01: `useMarketStore` (Legacy) 코드의 완전한 제거 및 통합

### 8. 알림 이벤트 스토어 (useNotificationEvents)
- 목적.01: 발생한 알림 이벤트(피드)의 이력 및 읽음 상태 관리
- 상태값.01: `events` (이벤트 목록), `_seeded` (초기 데이터 주입 여부)
- 주요 액션.01: `markRead` (읽음 처리), `add` (이벤트 수신), `markAllRead` (전체 읽음)
- persist storage key.01: `agdict:notification-events`
- 미구현 항목.01: 서버 DB와의 알림 동기화 로직

### 9. 최근 본 통계 스토어 (useRecentStats)
- 목적.01: 사용자가 최근에 조회한 품종 통계 이력 관리
- 상태값.01: `items` (최근 조회 이력 목록)
- 주요 액션.01: `push` (조회 이력 추가), `clear` (전체 삭제)
- persist storage key.01: `agdict.recent-stats.v1`
- 미구현 항목.01: 없음

### 10. 저장된 쿼리 스토어 (useSavedQueries)
- 목적.01: 사용자가 저장한 시세 조회 조건(마이 리스트) 관리
- 상태값.01: `items` (저장된 쿼리 목록)
- 주요 액션.01: `remove` (삭제), `reorder` (순서 변경), `refresh` (최신화 시점 갱신)
- persist storage key.01: `agdict:saved-queries:v1`
- 미구현 항목.01: 개별 쿼리별 메모 작성 기능

### 11. 통계 설정 스토어 (useStatistics)
- 목적.01: 통계 페이지의 시각화 조건 관리
- 상태값.01: `crop` (대상 작물), `markets` (비교 시장 목록), `period` (조회 기간)
- 주요 액션.01: `setCrop` (작물 변경), `setMarkets` (시장 선택)
- persist storage key.01: 없음
- 미구현 항목.01: 사용자 정의 차트 설정 저장 기능

### 12. 추세 비교 스토어 (useTrendCompare)
- 목적.01: 시세 추세 그래프에서 비교군으로 설정된 시장 목록 관리
- 상태값.01: `compareIds` (비교 대상 ID 목록), `yearMode` (연간 비교 여부)
- 주요 액션.01: `toggleCompare` (비교군 추가/제거), `reset` (초기화)
- persist storage key.01: `agdict:trend-compare`
- 미구현 항목.01: 비교 대상별 색상 커스텀 기능

### 13. UI 스토어 (useUi)
- 목적.01: 앱 전역 UI 관련 기본 필터링 상태 관리
- 상태값.01: `category` (활성 카테고리), `period` (기본 조회 기간)
- 주요 액션.01: `setCategory`, `setPeriod`
- persist storage key.01: `agdict:ui`
- 미구현 항목.01: 다크/라이트 모드 설정값 통합

### 14. 관심 목록 스토어 (useWatchlist)
- 목적.01: 관심 작물 및 시장의 단순 리스팅 관리
- 상태값.01: `crops` (품목 ID 목록), `markets` (시장 ID 목록)
- 주요 액션.01: `toggleCrop`, `toggleMarket`
- persist storage key.01: `agdict:watchlist`
- 미구현 항목.01: 없음

### 15. 즐겨찾기 시세 스토어 (useFavoritePriceStore)
- 목적.01: 특정 조건(시장/품목/법인 등)이 결합된 상세 시세 즐겨찾기 관리
- 상태값.01: `items` (즐겨찾기 항목 목록)
- 주요 액션.01: `addFavorite`, `removeFavorite`, `setOrder`
- persist storage key.01: `agdict:favoritePriceItems`
- 미구현 항목.01: 없음

### 16. AI 예측 설정 스토어 (usePredictionView)
- 목적.01: AI 가격 예측 화면의 조회 옵션 및 사용자 설정값 관리
- 상태값.01: `selectedCropId`, `quantityBoxes` (물량), `selectedGrade` (등급)
- 주요 액션.01: `setSelectedCropId`, `setQuantity`
- persist storage key.01: `agdict:aiPricePrediction`
- 미구현 항목.01: 실제 AI 예측 API 연동 (현재 Mock 데이터 사용 중)

## 비고
- ⚠️ 확인 필요.01: `useMarketStore`와 `useMarketFilter`의 역할이 중복되므로 추후 통합 및 리팩토링이 필요합니다.
- ⚠️ 확인 필요.02: 로컬 스토리지 용량 제한(약 5MB)을 고려하여 영속성 데이터의 크기를 모니터링해야 합니다.
