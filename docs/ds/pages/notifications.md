# 알림 DS 초안

- Menu ID: notifications
- Registry: docs/ds/screen-registry.json
- Baseline: 2026-07-31 코드 기준

## NTF-001_notifications_Default — 알림 목록

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0901 | 알림 목록 | NTF-001_notifications_Default | Visible | 정의.01: 발생한 알림 이벤트를 날짜별로 그룹핑해 보여주는 피드 화면.<br>제목.01: "알림"(DetailHeader title).<br>구성.01: DetailHeader(뒤로가기 + 우측 알림설정 아이콘 Settings 링크 "/notifications/settings") + 날짜 그룹 섹션 목록.<br>목록항목.01: 각 항목은 읽음여부 표시 점(미읽음 시 좌측 상단 빨간 점 bg-[#E03131]), 종류별 아이콘 배지, 제목(n.title), 상대시간(formatRelative), 본문(n.body)으로 구성.<br>상태표시.01: 그룹 라벨은 "오늘"/"어제"/"이전" 3종(startOfDay 비교, groupByDay 함수). 항목이 없는 그룹은 표시 안 함.<br>상태표시.02: 종류(kind)별 아이콘/색상 — target·swingUp·volumeSurge: TrendingUp 아이콘 bg-[#FFF5F5] text-[#E03131] / swingDown: TrendingDown bg-[#EDF2FF] text-[#1971C2] / auctionStart: Bell bg-[#F0F9F0] text-[#3A8A3A] / system(기본): Info bg-[#F1F3F5] text-[#6C757D].<br>접근성.01: 알림설정 아이콘 링크에 aria-label="알림 설정". | Registry: docs/ds/screen-registry.json<br>Route: /notifications<br>File: src/routes/notifications.index.tsx<br>Baseline: 2026-07-31 코드 기준 |
| DS-0901 | 알림 목록 | NTF-001_notifications_Default | Invisible | 진입조건.01: /notifications 접근 시 항상 렌더.<br>데이터소스.01: useNotificationEvents(s => s.events) — zustand persist 스토어(저장 키 "agdict:notification-events").<br>초기값.01: 최초 로드시 SEED_EVENTS 3건(양파 급등, 배추 급락, 시스템 업데이트 알림) 시드. migrate 함수가 _seeded 플래그 없으면 SEED_EVENTS로 재시딩.<br>정렬.01: createdAt 내림차순 정렬 후 groupByDay로 오늘/어제/이전 그룹화.<br>액션.01: 항목 클릭 시 handleClick(e) 실행 — 1) markRead(e.id)로 읽음 처리, 2) e.context 없으면(system 등) 이동 없이 종료.<br>이동.01: context가 있으면 useMarketFilter의 setItem/setMarket/setCorp/setUnit을 알림 컨텍스트 값으로 순서대로 동기화한 뒤 navigate({ to: "/price/$variety", params: { variety: c.varietyId } })로 이동.<br>액션.02: 우측 상단 Settings 아이콘 클릭 시 "/notifications/settings"로 이동(Link). | 위와 동일 |
| DS-0901 | 알림 목록 | NTF-001_notifications_Default | Tracking | - | 위와 동일 |
| DS-0901 | 알림 목록 | NTF-001_notifications_Default | Design | 컴포넌트.01: AppShell(screenId, screenState), DetailHeader.<br>클래스.01: 목록 카드 "divide-y divide-border bg-white", 항목 버튼 "active:bg-[#F8F9FA]".<br>토큰.01: 미읽음 점 색상 #E03131.<br>아이콘.01: lucide-react Bell, Info, Settings, TrendingDown, TrendingUp. | 위와 동일 |

## NTF-001_notifications_Empty — 알림 목록

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0902 | 알림 목록 | NTF-001_notifications_Empty | Visible | 빈상태.01: 아이콘 원형 배지(bg-[#F1F3F5], Bell 아이콘 text-[#ADB5BD]).<br>문구.01: "새 알림이 없어요".<br>문구.02: "관심 작물을 등록하면 가격 변동 알림을 받을 수 있어요". | Registry: docs/ds/screen-registry.json<br>Route: /notifications<br>File: src/routes/notifications.index.tsx<br>Baseline: 2026-07-31 코드 기준 |
| DS-0902 | 알림 목록 | NTF-001_notifications_Empty | Invisible | 조건.01: sorted.length === 0 일 때 screenState="Empty"로 AppShell에 전달되고 빈 상태 UI 렌더. | 위와 동일 |
| DS-0902 | 알림 목록 | NTF-001_notifications_Empty | Tracking | - | 위와 동일 |
| DS-0902 | 알림 목록 | NTF-001_notifications_Empty | Design | 컴포넌트.01: AppShell(screenState="Empty").<br>클래스.01: "flex flex-col items-center justify-center px-6 py-24 text-center". | 위와 동일 |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## NTF-002_notifications-settings_Default — 알림 규칙 목록

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0903 | 알림 규칙 목록 | NTF-002_notifications-settings_Default | Visible | 정의.01: 일반 알림 설정 섹션(GeneralNotiSettings)과 품종·시장별 알림 규칙 목록(SwipeReorderList)을 함께 보여주는 화면.<br>제목.01: "알림 설정"(DetailHeader title).<br>구성.01: DetailHeader(뒤로가기) + GeneralNotiSettings + (규칙 있을 때) SwipeReorderList.<br>구성.02: GeneralNotiSettings 하위 구성 — "전체 알림" 마스터 토글(master), "시세 알림" 그룹(급등락 알림 toggle+슬라이더 swingThreshold 5~30% step1, 즐겨찾기 시세 요약 toggle, 경매 마감 알림 toggle), "앱 알림" 그룹(공지·업데이트 toggle).<br>문구.01: "전체 알림 / 모든 알림을 한 번에 켜고 끕니다".<br>문구.02: "급등락 알림 / 설정 변동폭 이상일 때 알려드려요".<br>문구.03: 슬라이더 값 표시 "±{swingThreshold}%".<br>문구.04: "즐겨찾기 시세 요약 / 관심 품목의 일일 시세 요약".<br>문구.05: "경매 마감 알림 / 관심 시장의 경매 마감 알림".<br>문구.06: "공지·업데이트 / 새로운 기능과 공지사항".<br>문구.07: 하단 안내 "알림은 즐겨찾기에 등록한 품목·시장 기준으로 발송됩니다. 기기 OS 알림 권한이 꺼져 있으면 표시되지 않을 수 있어요.".<br>목록항목.01: 규칙 행(RuleRow) — 품종명(rule.varietyLabel) + 품목명(rule.itemLabel), 하위 텍스트(시장명·법인명(전체가 아니면)·단위(" 기준" 제거)), 조건 배지(activeBadges: 목표가/등락 n%/거래량 n%/경매시작), 우측 Switch(rule.enabled), ChevronRight로 상세 진입.<br>상태표시.01: 규칙이 enabled=false면 행 전체 opacity-50 처리.<br>버튼.01: 각 행 스와이프 시 삭제 버튼 노출(SwipeReorderList, Trash2 아이콘), 드래그 핸들로 순서 변경 가능.<br>도움말.01: GeneralNotiSettings 하단 안내 문구(문구.07)로 발송 기준 설명. | Registry: docs/ds/screen-registry.json<br>Route: /notifications/settings<br>File: src/routes/notifications.settings.index.tsx<br>Store: src/store/alerts.ts<br>Components: src/components/notifications/GeneralNotiSettings.tsx, src/components/swipe-reorder-list.tsx<br>Baseline: 2026-07-31 코드 기준 |
| DS-0903 | 알림 규칙 목록 | NTF-002_notifications-settings_Default | Invisible | 진입조건.01: /notifications/settings 접근 시 항상 렌더.<br>데이터소스.01: useAlerts(s => s.rules) — zustand persist 스토어(저장 키 "agdict:alerts"). order 오름차순 정렬.<br>데이터소스.02: GeneralNotiSettings는 별도 localStorage 키 "agdict:notiSettings" 사용(useAlerts 스토어와 무관). 초기 마운트 시 loadSettings()로 값 로드 후 hydrated=true 시점부터 변경분을 setItem으로 저장.<br>초기값.01: GeneralNotiSettings DEFAULTS = { master:true, priceSwing:true, swingThreshold:10, favoriteSummary:true, auctionClose:false, noticeUpdate:true }.<br>초기값.02: alerts 스토어 rules 초기값은 빈 배열([]) — 규칙은 NTF-003/004 폼에서 upsert로 추가됨.<br>조건.01: GeneralNotiSettings에서 master=false이면 시세 알림/앱 알림 그룹 전체가 pointer-events-none opacity-50으로 비활성화(값 자체는 변경되지 않음).<br>조건.02: priceSwing 그룹 내 슬라이더 영역은 priceSwing=false면 pointer-events-none opacity-50.<br>액션.01: 규칙 행 Switch 토글 → setEnabled(rule.id, v)로 즉시 반영.<br>액션.02: 규칙 스와이프 삭제 → remove(id) 호출 후 toast.success("알림을 삭제했어요").<br>액션.03: 드래그로 순서 변경 → onReorder가 reorder(ids) 호출, order 필드 갱신.<br>이동.01: 규칙 행(ChevronRight 영역) 클릭 → navigate({ to: "/notifications/settings/$ruleId", params: { ruleId: rule.id } }).<br>미구현.01: GeneralNotiSettings의 각 토글(master, priceSwing, swingThreshold, favoriteSummary, auctionClose, noticeUpdate)은 localStorage에만 저장되며 실제 알림 발송 로직/서버와 연동되지 않음(주석: "MVP 단계"에 준하는 로컬 저장 UI만 존재). | 위와 동일 |
| DS-0903 | 알림 규칙 목록 | NTF-002_notifications-settings_Default | Tracking | - | 위와 동일 |
| DS-0903 | 알림 규칙 목록 | NTF-002_notifications-settings_Default | Design | 컴포넌트.01: AppShell(screenId, screenState), DetailHeader, Switch, Slider, SwipeReorderList.<br>클래스.01: 규칙 목록 wrapper "pb-24".<br>토큰.01: 활성 토글 색상 bg-[#3A8A3A].<br>아이콘.01: lucide-react ChevronRight, GripVertical, Trash2. | 위와 동일 |

## NTF-002_notifications-settings_Empty — 알림 규칙 목록

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0904 | 알림 규칙 목록 | NTF-002_notifications-settings_Empty | Visible | 정의.01: 등록된 알림 규칙이 없을 때 GeneralNotiSettings만 표시되고 규칙 목록(SwipeReorderList)이 렌더되지 않는 상태.<br>빈상태.01: 별도의 빈상태 안내 문구/아이콘은 없음 — SwipeReorderList 영역 자체가 조건부로 렌더되지 않음(`{sorted.length > 0 && (...)}`). | Registry: docs/ds/screen-registry.json<br>Route: /notifications/settings<br>File: src/routes/notifications.settings.index.tsx<br>Baseline: 2026-07-31 코드 기준 |
| DS-0904 | 알림 규칙 목록 | NTF-002_notifications-settings_Empty | Invisible | 조건.01: sorted.length === 0 일 때 AppShell screenState="Empty"로 전달. | 위와 동일 |
| DS-0904 | 알림 규칙 목록 | NTF-002_notifications-settings_Empty | Tracking | - | 위와 동일 |
| DS-0904 | 알림 규칙 목록 | NTF-002_notifications-settings_Empty | Design | 컴포넌트.01: AppShell(screenState="Empty") — 하위에는 GeneralNotiSettings만 렌더. | 위와 동일 |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## NTF-003_notifications-settings-new_Default — 규칙 폼

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0905 | 규칙 폼 | NTF-003_notifications-settings-new_Default | Visible | 정의.01: 새 품종·시장 조건에 대한 가격 알림 규칙을 생성하는 폼(RuleForm 공용 컴포넌트, isEdit=false).<br>제목.01: "알림 추가"(DetailHeader title).<br>구성.01: 조건 요약 카드(품종명·품목명, 시장명·법인명·단위, 현재가) + "목표가 알림"/"등락률 알림"/"거래량 알림"/"경매 알림" 4개 섹션 + 하단 고정 액션바.<br>표시.01: 조건 요약 카드에 현재가(quote.price, 천단위 콤마 + "원"), getMarketQuote 결과 사용.<br>입력.01: 목표가 이상(targetAbove) — 숫자만 입력 가능한 텍스트필드, placeholder "원 이상이면 알림", 단위 "원".<br>입력.02: 목표가 이하(targetBelow) — 숫자만 입력 가능한 텍스트필드, placeholder "원 이하이면 알림", 단위 "원".<br>입력.03: "{swingThreshold}% 이상 상승"(swingUp) 토글.<br>입력.04: "{swingThreshold}% 이상 하락"(swingDown) 토글.<br>입력.05: "전일 대비 {volumeThreshold}% 이상 증가"(volumeSurge) 토글.<br>입력.06: "경매 시작 알림"(auctionStart) 토글, 설명 "{marketLabel} {varietyLabel} 첫 경매 체결 시 하루 한 번 알림".<br>버튼.01: 하단 "알림 추가" 버튼(신규 생성 모드에서는 삭제 버튼 없음). | Registry: docs/ds/screen-registry.json<br>Route: /notifications/settings/new<br>File: src/routes/notifications.settings.new.tsx<br>Components: src/components/notifications/RuleForm.tsx<br>Store: src/store/alerts.ts, src/store/cropSelection.ts, src/store/market.ts<br>Baseline: 2026-07-31 코드 기준 |
| DS-0905 | 규칙 폼 | NTF-003_notifications-settings-new_Default | Invisible | 진입조건.01: /notifications/settings/new 접근 시 렌더. search 파라미터 varietyId, marketId를 optional string으로 파싱(validateSearch).<br>초기값.01: seed 계산 우선순위 — 1) URL search(qVariety/qMarket), 2) useCropSelection의 committed(categoryId/itemId/varietyId), 3) useMarketFilter 값. varietyId = qVariety ?? committed.varietyId ?? filter.varietyId, marketId = qMarket ?? filter.marketId.<br>초기값.02: 라벨 해석 — committed.categoryId/itemId/varietyId가 있으면 getCategoryById/getItemById/getVarietyById(catalog-service)로 조회한 name을 우선 사용, 실패 시 filter의 라벨 사용. qVariety가 filter.varietyId와 같으면 filter의 라벨 세트를 그대로 사용.<br>초기값.03: 같은 varietyId+marketId 조합의 기존 규칙이 있으면(existingByKey) targetAbove/targetBelow/swingUp/swingDown/swingThreshold/volumeSurge/volumeThreshold/auctionStart를 그 값으로 시딩(없으면 targetAbove/targetBelow=null, swingUp/swingDown/volumeSurge/auctionStart=false, swingThreshold=5, volumeThreshold=30).<br>초기값.04: enabled 초기값은 항상 true.<br>표시.01: 현재가는 getMarketQuote({ itemId: seed.varietyId, varietyId: seed.varietyId, marketId, unit, date: 오늘(YYYY-MM-DD) })로 조회(mock 데이터 기반).<br>입력제한.01: targetAbove/targetBelow 입력값은 onChange 시 정규식으로 숫자 이외 문자 제거(`replace(/[^0-9]/g, "")`).<br>검증.01: 저장 시 targetAbove/targetBelow는 trim 후 값이 있으면 Number() 변환, Number.isFinite 통과 시에만 값 저장, 아니면 null. 그 외 필수값 검증(예: 조건 최소 1개 선택)은 코드에 없음.<br>활성조건.01: 저장(handleSave) 버튼은 항상 클릭 가능(비활성화 조건 없음) — 어떤 조건도 켜지 않은 상태로 저장 가능.<br>액션.01: 저장 버튼 클릭 시 handleSave 실행 — upsert({ ...seed, targetAbove, targetBelow, swingUp, swingDown, swingThreshold, volumeSurge, volumeThreshold, auctionStart, enabled: seed.enabled ?? true })를 useAlerts 스토어에 반영(신규이므로 id 미부여 → genId 자동 생성, order는 기존 최대값+1, createdAt은 현재 시각).<br>저장.01: 저장 대상 스토어 키 "agdict:alerts"(zustand persist).<br>성공.01: 저장 성공 시 toast.success("알림을 저장했어요") 표시 후 navigate({ to: "/notifications/settings" })로 이동.<br>실패.01: upsert 실패(예외) 처리 로직은 코드에 없음(동기 함수, 실패 케이스 미정의).<br>미구현.01: void itemId 처리 주석 — "itemId는 seed에 필드 없음(스토어 스키마에 없음)"으로, 계산된 itemId 값은 seed에 반영되지 않고 버려짐(itemLabel만 별도로 유지). | 위와 동일 |
| DS-0905 | 규칙 폼 | NTF-003_notifications-settings-new_Default | Tracking | - | 위와 동일 |
| DS-0905 | 규칙 폼 | NTF-003_notifications-settings-new_Default | Design | 컴포넌트.01: AppShell(screenId), DetailHeader, Switch.<br>클래스.01: 하단 고정 액션바 "fixed inset-x-0 bottom-0 z-30 ... border-t border-[#E9ECEF]".<br>토큰.01: 저장 버튼 배경 bg-[#3A8A3A], 현재가 텍스트 text-[#E03131]. | 위와 동일 |

## NTF-004_notifications-settings-id_Default — 규칙 폼

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| DS-0906 | 규칙 폼 | NTF-004_notifications-settings-id_Default | Visible | 정의.01: 기존 알림 규칙을 수정하는 폼(RuleForm 공용 컴포넌트, isEdit=true). UI 구성은 NTF-003과 동일(RuleForm 공유)하되 제목과 버튼 구성이 다름.<br>제목.01: "알림 수정"(DetailHeader title).<br>구성.01: 조건 요약 카드 + 4개 섹션(목표가/등락률/거래량/경매 알림) — NTF-003과 동일 필드.<br>버튼.01: 하단 액션바에 "삭제" 버튼(테두리 red, 텍스트 "삭제")과 "저장" 버튼(주 텍스트 "저장") 2개 노출. | Registry: docs/ds/screen-registry.json<br>Route: /notifications/settings/$ruleId<br>File: src/routes/notifications.settings.$ruleId.tsx<br>Components: src/components/notifications/RuleForm.tsx<br>Store: src/store/alerts.ts<br>Baseline: 2026-07-31 코드 기준 |
| DS-0906 | 규칙 폼 | NTF-004_notifications-settings-id_Default | Invisible | 진입조건.01: /notifications/settings/$ruleId 접근 시 ruleId로 useAlerts(s => s.rules.find(r => r.id === ruleId))에서 규칙을 조회.<br>예외.01: rule을 찾지 못하면(useEffect) navigate({ to: "/notifications/settings" })로 즉시 이동하며, 그 사이 컴포넌트는 null을 반환(화면에 아무것도 렌더하지 않음). 이는 별도 Error/Empty 화면 UI가 아니라 즉시 리다이렉트이므로 상태 screenId로 등록하지 않음.<br>초기값.01: seed는 조회된 rule의 모든 필드(varietyId, varietyLabel, itemLabel, categoryId, categoryLabel, marketId, marketLabel, corpId, corpLabel, unit, targetAbove, targetBelow, swingUp, swingDown, swingThreshold, volumeSurge, volumeThreshold, auctionStart, enabled)를 그대로 사용.<br>검증.01: NTF-003과 동일 — targetAbove/targetBelow 숫자만 입력, 저장 시 Number 변환 후 유효성 검사.<br>활성조건.01: 저장 버튼은 항상 활성화. 삭제 버튼은 isEdit=true(ruleId 존재)일 때만 노출.<br>액션.01: 저장 클릭 시 upsert({ id: ruleId, ...seed, ...수정된 필드 })로 기존 항목을 병합 업데이트(같은 id 유지).<br>액션.02: 삭제 클릭 시 handleDelete → remove(ruleId) 호출.<br>저장.01: 저장 대상 스토어 키 "agdict:alerts".<br>성공.01: 저장 성공 시 toast.success("알림을 저장했어요") 후 navigate({ to: "/notifications/settings" }).<br>성공.02: 삭제 성공 시 toast.success("알림을 삭제했어요") 후 navigate({ to: "/notifications/settings" }).<br>실패.01: 저장/삭제 실패(예외) 처리 로직은 코드에 없음. | 위와 동일 |
| DS-0906 | 규칙 폼 | NTF-004_notifications-settings-id_Default | Tracking | - | 위와 동일 |
| DS-0906 | 규칙 폼 | NTF-004_notifications-settings-id_Default | Design | 컴포넌트.01: AppShell(screenId), DetailHeader, Switch.<br>토큰.01: 삭제 버튼 텍스트/테두리 색상 #E03131, 저장 버튼 배경 #3A8A3A. | 위와 동일 |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

## 분석 파일
- src/routes/notifications.tsx
- src/routes/notifications.index.tsx
- src/routes/notifications.settings.tsx
- src/routes/notifications.settings.index.tsx
- src/routes/notifications.settings.new.tsx
- src/routes/notifications.settings.$ruleId.tsx
- src/components/notifications/RuleForm.tsx
- src/components/notifications/GeneralNotiSettings.tsx
- src/components/swipe-reorder-list.tsx
- src/components/app-shell.tsx
- src/store/alerts.ts
- src/store/notification-events.ts
- src/store/market.ts (useMarketFilter 참조 확인)
- src/store/cropSelection.ts (참조 확인)
- src/lib/catalog-service.ts (참조 확인)
- src/lib/mock/market-analysis.ts (getMarketQuote 참조 확인)

## 미구현·확인필요 요약
총 2건
1. 미구현.01 (NTF-002_notifications-settings_Default): GeneralNotiSettings의 전체 알림/급등락 알림/변동폭 임계값/즐겨찾기 시세 요약/경매 마감 알림/공지·업데이트 토글은 localStorage("agdict:notiSettings")에만 저장되고 실제 알림 발송 로직·서버와 연동되지 않음.
2. 미구현.01 (NTF-003_notifications-settings-new_Default): NewRulePage에서 계산된 itemId는 useAlerts 스토어 스키마에 필드가 없어 저장되지 않고 버려짐(코드 주석으로 명시).
