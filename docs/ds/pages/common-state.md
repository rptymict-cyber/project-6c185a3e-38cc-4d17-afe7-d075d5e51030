# 공통 전역 상태(zustand 스토어) DS 초안

- Menu ID: common-state
- Registry: docs/ds/screen-registry.json
- Baseline: 2026-07-31 코드 기준
- **등록 Screen ID 없음** — 이 문서는 화면(Screen)이 아니라 여러 메뉴가 공유하는 zustand 전역 스토어의 상태·액션·저장 키를 정리한 참고 문서다. `docs/ds/.tmp/common-state.json`도 빈 배열(`[]`)로 유지한다.

## 스토어 목록

| 파일 | 스토어(export) | persist 여부 / 저장 키 | 주요 상태 | 주요 액션 | 비고 |
|---|---|---|---|---|---|
| src/store/alerts.ts | `useAlerts` | Yes / `agdict:alerts` (partialize: rules, byKey) | `rules: PriceAlertRule[]`(가격 알림 규칙 목록), `byKey: Record<string, PriceAlerts>`(레거시 스키마, target/swing/auctionStart) | `getAll`, `getByKey`, `upsert`, `remove`, `setEnabled`, `reorder`, `hasAnyFor`, 레거시 `getFor`/`setFor` | 신규 규칙 API와 레거시 API가 공존(주석: "레거시, 다음 프롬프트에서 마이그레이션 예정") |
| src/store/cropSelection.ts | `useCropSelection` | Yes / `agdict:crop-selection` (localStorage, partialize: committed만) | `committed: CropSelection`(categoryId/itemId/varietyId, 앱 전역 확정 선택), `draft: CropSelection`(편집 중 임시 선택, 저장 안 함) | `startDraftFromCommitted`, `setDraftCategory`, `setDraftItem`, `setDraftVariety`, `clearDraftCategory`, `clearDraftItem`, `clearDraftVariety`, `discardDraft`, `commitDraft` | SEL-001(crop-select 라우트) 및 market/statistics/prediction 등에서 공용 참조 |
| src/store/feedback.ts | `useFeedback` | Yes / `agdict:feedback` | `items: FeedbackItem[]`(id/kind/rating/tags/text/createdAt), 시드 데이터 2건 포함 | `add` | kind는 "sentiment"/"rating"/"message" |
| src/store/homeFixedItems.ts | `useHomeFixed` | Yes / `agdict:homeFixed` (localStorage, version 1) | `markets: string[]`(홈 고정 도매시장 id, 기본 4개), `items: string[]`(홈 고정 품목 id, 기본 6개), 최대 개수 `HOME_FIXED_MAX=6` | `setMarkets`, `addMarket`, `removeMarket`, `setItems`, `addItem`, `removeItem` | 6개 초과 추가는 무시(no-op) |
| src/store/interests.ts | `useInterests` | Yes / `agdict:interests` | `ids: string[]`(관심 작물 id, 기본 ["apple","cabbage","onion"]), `selectedId: string \| null`(기본 "apple") | `add`, `remove`, `toggle`, `select`, `has` | - |
| src/store/location.ts | `useLocation` | No(persist 미적용) | `granted: boolean \| null`(기본 true), `requested: boolean`(기본 true) | `request`(Geolocation API 호출, 미지원 시 granted=false), `setGranted` | 주석: "mock 단계에서는 좌표 미사용, 기본값을 허용 상태로 둠. 실 연동 시 초기값 null로 변경 및 request() 자동 호출 필요"(확인필요 대상) |
| src/store/market.ts | `useMarketStore` | No(persist 미적용) | `segment: "items"\|"markets"`(기본 "items"), `category: string`(기본 "all"), `sort: MarketSortKey`(기본 "volume") | `setSegment`, `setCategory`, `setSort` | 코드 주석: "Legacy state kept for other pages that still import useMarketStore" |
| src/store/market.ts | `useMarketFilter` | Yes / `agdict:marketFilter:v2` (partialize: date/dateLabel 제외) | `date`, `dateLabel`(매 세션 오늘로 재계산, persist 제외), `categoryId/categoryLabel`(기본 "06"/"과실류"), `itemId/itemLabel`(기본 "0601"/"사과"), `varietyId/varietyLabel`(기본 "0601:ALL"/"전체 품종"), `marketId/marketLabel`(기본 "all"/"전체"), `corpId/corpLabel`(기본 "all"/"전체"), `unit`(기본 "10kg 기준"), `simpleMode`(기본 false), `simpleViewMode`(기본 "table"), `proTab`(기본 "chart") | `setDate`, `setItem`, `setMarket`(변경 시 corp 초기화), `setCorp`, `setUnit`, `setSimpleMode`, `toggleSimpleMode`, `setSimpleViewMode`, `setProTab` | market/statistics/prediction 등 다수 메뉴가 공유하는 시세 필터 |
| src/store/notification-events.ts | `useNotificationEvents` | Yes / `agdict:notification-events` (version 1, `migrate`로 미시드 데이터 시 SEED 강제 주입) | `events: NotificationEvent[]`(id/ruleId/kind/title/body/context/createdAt/read), `_seeded: boolean`, 시드 이벤트 3건 | `getAll`(createdAt 내림차순), `add`, `markRead`, `markAllRead`, `remove`, `unreadCount` | 알림 규칙(alerts.ts)과 별개로 발생 시점 스냅샷을 저장 |
| src/store/recent-stats.ts | `useRecentStats` | Yes / `agdict.recent-stats.v1` | `items: RecentStat[]`(varietyId, viewedAt), 최대 10개(`MAX=10`) | `push`(중복 제거 후 최신순 유지), `clear` | - |
| src/store/saved-queries.ts | `useSavedQueries` | Yes / `agdict:saved-queries:v1` | `items: SavedQuery[]`(cropId/emoji/category/varietyName/market/corporation/origin/unitLabel/price/perKg/changePct/lastAuctionAt/updatedAt/hasAlert/aiReady), 시드 4건, `hydrated: boolean` | `remove`, `removeMany`, `reorder`, `replaceAll`, `restore`, `refresh`, `seedIfEmpty` | 부가 함수 `isPredictionAvailable(cropId)`, `timeAgo(ts)`도 이 파일에서 export |
| src/store/statistics.ts | `useStatistics` | No(persist 미적용) | `crop: CropId`(기본 "cabbage"), `markets: string[]`(기본 ["전국"]), `period: PeriodMode`("day"/"month"/"year", 기본 "day") | `setCrop`, `setMarkets`(빈 배열 방지, 기본 ["전국"]), `setPeriod` | - |
| src/store/trend-compare.ts | `useTrendCompare` | Yes / `agdict:trend-compare` (version 2) | `compareIds: string[]`(기본 ["all","seoul-garak","seoul-gangseo"], 최대 5개 `MAX_COMPARE`), `yearMode: boolean`(기본 false) | `addCompare`, `removeCompare`("all"은 제거 불가), `toggleCompare`("added"/"removed"/"limit" 반환), `setYearMode`, `reset` | /statistics/$variety 트렌드 비교 탭 전용 |
| src/store/ui.ts | `useUi` | Yes / `agdict:ui` | `category: "all" \| Category`(기본 "all"), `period: "1w"\|"1m"\|"1y"\|"3y"`(기본 "1m") | `setCategory`, `setPeriod` | - |
| src/store/watchlist.ts | `useWatchlist` | Yes / `agdict:watchlist` | `crops: string[]`(기본 빈 배열), `markets: string[]`(기본 빈 배열) | `toggleCrop`, `toggleMarket`, `removeCrop`, `removeMarket`, `setCropOrder`, `setMarketOrder` | - |
| src/features/favorites/favoriteStore.ts | `useFavoritePriceStore` | Yes / `agdict:favoritePriceItems` | `items: FavoritePriceItem[]`(id는 `favoriteKey()` 생성값, createdAt, order) | `addFavorite`, `removeFavorite`, `toggleFavorite`, `isFavorite`, `getFavorites`, `setOrder`(수동 정렬, 신규 항목은 최소 order-1로 최상단 배치) | id 중복 방지 키 로직은 `src/features/favorites/favoriteKey.ts` |
| src/features/prediction/usePredictionView.ts | `usePredictionView` | Yes / `agdict:aiPricePrediction` (version 4, `migrate`로 버전별 보정, `onRehydrateStorage`로 무결성 보정) | `selectedCropId`(기본 `PREDICTABLE_CROPS[0].id`), `selectedViewpoint`(기본 "farmer"), `selectedRangeDays`(기본 7), `selectedGrade`(기본 "특"), `quantityBoxes`(기본값은 단위별 `QUANTITY_UNIT_DEFAULT`), `quantityUnit`(기본 "kg"), `marketId`(기본 "seoul-garak") | `setSelectedCropId`(예측 불가 crop이면 기본값으로 대체), `setSelectedViewpoint`, `setSelectedRangeDays`, `setSelectedGrade`, `setQuantityBoxes`(clamp), `setQuantity`, `setQuantityUnit`, `setMarketId` | AI 시세 예측(prediction) 메뉴 전용 뷰 상태 |

## 미구현·확인필요 요약

- 확인필요.01: `src/store/location.ts`는 mock 단계라는 이유로 `granted`/`requested` 기본값을 모두 true로 두고 있다. 실 위치 연동 여부와 시점은 코드 주석("실 연동 시 초기값을 null로 되돌리고 request()를 자동 호출")으로만 확인 가능하며, 언제 전환할지는 업무 판단이 필요하다.
- 총 1건.
