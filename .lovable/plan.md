# AGDICT MVP 구현 계획

로그인 없이 바로 쓰는 농산물 시세 조회 모바일 웹앱. max-width 430px 모바일 우선, TanStack Start + Tailwind v4 + shadcn/ui + Recharts + Zustand.

## 범위 (MVP)

- 인증/온보딩 없음 — 홈 즉시 진입
- 5개 라우트: 홈 / 시세조회 / AI예측 / 즐겨찾기 / 고객의소리
- 데이터: KAMIS 스키마 형태의 시드 모의 데이터 (실 API 연동은 이후 단계)
- 즐겨찾기 & 마지막 본 분류: `localStorage` (Zustand persist)
- AI예측: "베타 준비 중" 안내 화면만 (v2 보류)
- 고객의소리: 로컬 저장 (백엔드 없이). 백엔드 필요 시 별도 요청

## 정보 구조

```text
/               홈 - 분류탭 + 대표작물 카드 (미니 스파크라인)
/market         시세조회 - 3서브탭: 품목별 / 도매시장별 / 주산지별
/market/$crop   품목 상세 - 이중 그래프 + 시세 테이블
/prediction     AI예측 - 준비 중 안내
/watchlist      즐겨찾기 - 2탭: 품목/시장
/feedback       고객의소리 - 리뷰 목록 + 작성
```

## 디자인 시스템 (styles.css `@theme`)

- 배경 `#FFFFFF`, 브랜드 그린 `#3A8A3A` (primary), hover `#2E7A2E`
- 상승 `#E03131` / 하락 `#1971C2` / 보합 gray-600
- 카드 배경 `#F8F9FA`, radius 10px, divider `#E9ECEF`
- 차트 토큰: `--color-chart-price/volume/predict/grid`
- 폰트: Pretendard (root `__root.tsx`에 `<link>` 로드)
- 모든 값은 semantic token → shadcn 컴포넌트에서 사용. 하드코딩 색상 금지

## 레이아웃 셸

- `AppShell` 컴포넌트: `max-w-[430px] mx-auto min-h-dvh` + 상단 헤더 슬롯 + 하단 고정 GNB(60px) + 콘텐츠 pt/pb 여유
- `BottomNav`: 5개 탭, active 상태 브랜드 그린 아이콘/라벨. `Link activeProps` 사용

## 홈 (`/`)

- 헤더: 로고 좌 / 검색 아이콘 우 (52px 고정)
- 분류 탭 가로 스크롤: 전체/과실류/채소류/양념채소/근채류/버섯류, active 하단 2px 그린 인디케이터
- 대표 작물 카드 리스트:
  - 이모지 + 작물명 + 분류 배지 + ★ 토글
  - 현재가(원/kg) 큰 숫자, 등락률 배지 (상승 빨강 배경 tint, 하락 파랑)
  - Recharts `<Sparkline>` (7일, 축 없음, height ~44px)
  - 거래량 + 업데이트 시각
- 카드 탭 → `/market/$crop`, ★ → Zustand watchlist 토글 + sonner 토스트

## 시세조회 (`/market`)

- 3 서브탭: 품목별 / 도매시장별 / 주산지별 (URL search param `tab`)
- **품목별**: 대분류 → 중분류 아코디언/리스트 → 탭 시 `/market/$crop`
- **도매시장별**: 지역 헤더 그룹핑 시장 리스트, 시장 탭 → 시장별 평균가 테이블 (전체 평균 행 하늘색 강조), 행 탭 시 법인별 아코디언
- **주산지별**: 품목 선택 + 월 드롭다운 → 지역별 거래량/가격 리스트

## 품목 상세 (`/market/$crop`)

- 헤더: 뒤로가기 / 작물명 / ★ + 공유
- 기간 필터 칩: 1주 / 1개월 / 1년 / 3년
- 이중 그래프 (Recharts `ComposedChart`, 240px): 가격 라인(그린) + 거래량 막대(회색), 툴팁에 날짜/가격/거래량
- 핵심 지표 요약 행: 현재가 / 전일대비 / 등락률 / 거래량
- 시세 테이블: 날짜/가격/등락률/거래량/등급, 상승·하락 색상
- 하단 고정 요약바: 총 거래량 · kg당 평균

## AI예측 (`/prediction`)

- 중앙 정렬 안내 카드: "AI 예측 베타 준비 중"
- 예측 가능 작물 배지 목록
- "시세조회로 이동" CTA 버튼

## 즐겨찾기 (`/watchlist`)

- 2탭: 품목 / 시장
- 저장 항목 카드 리스트, 빈 상태 UI 포함
- 탭 시 상세 이동, swipe/버튼으로 삭제 (MVP: 우측 삭제 버튼)

## 고객의소리 (`/feedback`)

- 상단: 최근 의견 리스트 (로컬 저장)
- "의견 작성" → 별점(1~5) + 텍스트 + 제출
- 제출 완료: 확인 메시지 + 닫기 (앱스토어 CTA는 문구만)

## 상태 · 데이터

- `src/lib/mock/crops.ts` — 분류/작물/7일·30일·1년 시계열 시드 데이터 (KAMIS 필드 근사)
- `src/lib/mock/markets.ts` — 지역/시장/법인 시드
- `src/store/watchlist.ts` — Zustand + `persist` (품목/시장 두 배열)
- `src/store/ui.ts` — 마지막 선택 분류·기간
- 서버 함수/DB 사용하지 않음 (MVP는 순수 클라이언트)

## 기술 세부

- `bun add zustand recharts` (shadcn/lucide/sonner는 이미 존재 가정, 없으면 추가)
- Pretendard: `__root.tsx` head `<link>` + `@theme --font-body`
- 각 라우트 `head()`에 한국어 title/description/og 세팅 (홈 제외 리프에 og:image 없음)
- `preview_ui--set_preview_device_viewport('mobile')` 호출

## 파일 구조 (신규)

```text
src/
  routes/
    __root.tsx                (Pretendard link, meta 업데이트)
    index.tsx                 (홈 재작성)
    market.tsx                (레이아웃 + 3탭)
    market.index.tsx          (탭 컨텐츠)
    market.$crop.tsx          (품목 상세)
    prediction.tsx
    watchlist.tsx
    feedback.tsx
  components/
    app-shell.tsx, bottom-nav.tsx, category-tabs.tsx,
    crop-card.tsx, sparkline.tsx, price-badge.tsx,
    period-chips.tsx, price-volume-chart.tsx,
    market-table.tsx, empty-state.tsx, star-toggle.tsx
  store/ watchlist.ts, ui.ts
  lib/mock/ crops.ts, markets.ts, series.ts
```

## 확인 필요 (진행 전)

1. **고객의소리 저장 방식**: MVP는 로컬 저장으로 시작할까요, 아니면 지금 Lovable Cloud를 켜서 실제로 서버에 저장할까요? (마스터플랜에는 Supabase 저장이 언급되어 있습니다)
2. **AI예측**: "준비 중" 안내만 표시하는 것으로 확정할까요? (v2 보류 확인)

