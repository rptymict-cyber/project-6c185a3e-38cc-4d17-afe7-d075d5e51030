# AGDICT — 프로젝트 컨벤션

이 문서는 이후 세션에서도 반드시 참조된다. 새 기능/화면을 만들기 전에 먼저 읽는다.

## 작물(부류/품목/품종) 선택 규칙 — **예외 없음**

작물(부류/품목/품종)을 선택하는 **어떤 신규 기능**을 만들든, 새로운
바텀시트나 모달을 만들지 말고 **반드시 `/crop-select` 페이지로 연결**한다.

- 새 화면에서 작물 선택이 필요하면 고유한 `from` 값을 부여해서
  `/crop-select?from={new}&return={path}` 로 이동시킨다.
- 필요시 `src/routes/crop-select.tsx` 상단 `CTA_LABEL_BY_FROM` 매핑에
  항목을 추가한다. 매핑이 없으면 기본 라벨 `"적용하기"`로 자동 fallback.
- 화면은 항상 `useCropSelection((s) => s.committed)` 값을 구독하고,
  라벨은 `src/lib/catalog-service.ts`의 `getCategoryById` / `getItemById`
  등으로 유도한다. 로컬 state로 부류/품목/품종을 따로 들고 있지 말 것.
- 카탈로그 데이터를 컴포넌트에서 직접 하드코딩 금지.
  반드시 `src/lib/catalog-service.ts`를 통해서만 접근한다.

### 유일한 예외

- **상세 화면의 "변경 ›" 인라인 칩** 중 **품종 단일 레벨만** 바꾸는 경우.
  현재 프로젝트에서는 이 예외에 해당하는 UI가 없다
  (`statistics.$variety.tsx`의 breadcrumb는 부류+품목까지 바꾸므로
  예외가 아니며 `/crop-select`로 이동함).
- **간편 모드의 출하지/규격 칩**: 작물 선택이 아니라 조회 결과 내
  2차 필터이므로 이 규칙과 무관.

이 두 가지 외에는 어떤 경우에도 새 작물 선택 UI를 만들지 않는다.

### 롤백 대비로 남겨둔 (사용하지 않는) 파일

아래 파일들은 `/crop-select` 도입 이전 UI. 어디서도 import 하지 않는 상태로
남겨두었다. 새 코드는 여기에 의존하지 말 것.

- `src/components/add-crop-sheet.tsx`
- `src/components/market-v2/CropSheet.tsx`
- `src/components/market-v2/ItemSheet.tsx`
- `src/components/statistics/VarietyPickerSheet.tsx`
- `src/routes/statistics.select.tsx`

### 관련 파일

- `src/routes/crop-select.tsx` — 유일한 작물 선택 페이지
- `src/store/cropSelection.ts` — `committed` / `draft` 분리 zustand 스토어
- `src/lib/mock/catalog.ts` — 카탈로그 SSOT
- `src/lib/catalog-service.ts` — 카탈로그 조회 서비스

## 그 외 규칙 요약

- 상단 대표 시세 카드는 간편/일반 모드에서 **동일한 정보 구조** 유지.
- 시세 조회 날짜와 예측 날짜는 별개 개념 — 같은 DatePicker 로직으로
  묶지 말 것.
- `수익` 표현은 비용이 반영된 경우에만 사용. 그 외에는 `예상 시세`.
- 모바일 기본 리스트는 카드형. 테이블은 전문가 보기/상세에서만.
