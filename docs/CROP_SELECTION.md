# 작물 선택 페이지 (`/crop-select`)

프로젝트에서 부류/품목/품종을 선택하는 **유일한 방법**.

## 규칙

작물을 선택하는 어떤 신규 기능을 만들든, 새로운 바텀시트나 모달을
만들지 말고 반드시 `/crop-select` 페이지로 연결한다.

- 새 화면에서 작물 선택이 필요하면 고유한 `from` 값을 부여해서
  `/crop-select?from={new}&return={path}` 로 이동시킨다.
- 필요시 `src/routes/crop-select.tsx` 상단 `CTA_LABEL_BY_FROM` 매핑에
  항목을 추가한다. 매핑이 없으면 기본 라벨 `"적용하기"`.
- 이 규칙은 **품종 단일 레벨 변경**(상세 화면의 "변경 ›" 칩 등 이미
  확정된 예외) 외에는 예외를 두지 않는다.

## 사용 예

```tsx
import { Link } from "@tanstack/react-router";

<Link
  to="/crop-select"
  search={{ from: "market", return: "/market" }}
>
  작물 선택
</Link>;
```

## 현재 연결된 진입점

| 화면 | from | return |
| --- | --- | --- |
| 시세 필터바 (`MarketFilterBar`) | `market` | `/market` |
| 통계 홈 (`/statistics`) 부류/품목/품종 카드 | `statistics` | `/statistics` |
| 통계 상세 (`/statistics/$variety`) breadcrumb 칩 | `statistics-detail` | `/statistics/{variety}` |
| 즐겨찾기 빈 상태 (`/watchlist`) | `watchlist` | `/watchlist` |
| 홈 관심 작물 "추가" 칩 (`InterestChips`) | `home` | `/` |

## 선택 상태 읽기

컴포넌트는 항상 committed 값을 구독한다:

```tsx
import { useCropSelection } from "@/store/cropSelection";
import { getCategoryById, getItemById } from "@/lib/catalog-service";

const committed = useCropSelection((s) => s.committed);
const item = committed.itemId ? getItemById(committed.itemId) : undefined;
```

로컬 state로 부류/품목/품종을 따로 관리하지 말 것.

## 카탈로그 데이터 접근

카탈로그(부류/품목/품종) 데이터는 반드시 `src/lib/catalog-service.ts`
함수를 통해서만 조회한다. 컴포넌트에서 `CATEGORIES` / `ITEMS` 배열을
직접 filter/find 하지 말 것.

## 롤백 대비로 남긴 (사용하지 않는) 파일

아래 파일들은 이전 UI. 어디서도 import 되지 않지만 롤백 대비로 남겨둔다.

- `src/components/add-crop-sheet.tsx`
- `src/components/market-v2/CropSheet.tsx`
- `src/components/market-v2/ItemSheet.tsx`
- `src/components/statistics/VarietyPickerSheet.tsx`
- `src/routes/statistics.select.tsx`
