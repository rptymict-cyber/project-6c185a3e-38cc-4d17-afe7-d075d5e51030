# 공통 인증(Auth) DS 초안

- Menu ID: common-auth
- Registry: docs/ds/screen-registry.json
- Baseline: 2026-07-31 코드 기준
- **등록 Screen ID 없음** — 로그인/회원가입/계정 등 사용자 대면 인증 UI 화면이 코드에 존재하지 않는다. `docs/ds/.tmp/common-auth.json`도 빈 배열(`[]`)로 유지한다.

## 조사 범위

`rg`로 `src/routes`, `src/components`, `src/store` 전체에서 로그인/가입/인증 관련 키워드(login, signin, signup, auth.)를 검색했으나 라우트·컴포넌트·스토어 어디에도 해당 화면이 없다. Supabase 인증 관련 코드는 서버/클라이언트 인프라 레이어(`src/integrations/supabase/`)에만 존재하며, 사용자가 조작하는 화면(Screen)이 아니다.

## 상세 사양

| DS No. | Section명 | Screen ID | 구분 | 상세 사양 | 비고 |
|---|---|---|---|---|---|
| - | 인증 UI | (없음) | Invisible | 미구현.01: 로그인/회원가입/로그아웃 등 사용자 대면 인증 화면이 `src/routes`에 존재하지 않는다(라우트 없음)<br>미구현.02: 인증 상태를 표시하거나 전환하는 UI 컴포넌트가 `src/components`에 존재하지 않는다<br>미구현.03: 인증 세션을 다루는 전역 상태(zustand store)가 `src/store`, `src/features`에 존재하지 않는다 | - |
| - | 인증 인프라(비-Screen) | (없음) | Invisible | 확인필요.01: `src/integrations/supabase/auth-middleware.ts`(`requireSupabaseAuth`)는 서버 함수 미들웨어로, 요청 헤더의 Bearer 토큰을 검증해 `supabase.auth.getClaims(token)`으로 `userId`/`claims`를 컨텍스트에 주입한다. 그러나 토큰을 어떻게 최초 발급받는지(로그인 UI/플로우)는 코드베이스에 없어 확인이 필요하다<br>확인필화.02: `src/integrations/supabase/auth-attacher.ts`(`attachSupabaseAuth`)는 클라이언트 측 함수 미들웨어로 `supabase.auth.getSession()`의 `access_token`을 매 서버 함수 호출에 `Authorization` 헤더로 첨부한다. 세션을 생성하는 로그인 동작 자체는 UI로 노출되어 있지 않다 | - |

Confluence 등록 시 같은 Screen ID의 연속 행에서 DS No. · Section명 · Screen ID 셀만 세로 병합할 수 있다. 구분 · 상세 사양 · 비고는 병합 대상이 아니다.

비고(공통): Registry: docs/ds/screen-registry.json<br>Route: 없음(화면 미구현)<br>File: src/integrations/supabase/auth-middleware.ts, src/integrations/supabase/auth-attacher.ts<br>Baseline: 2026-07-31 코드 기준

## 분석 파일

- src/integrations/supabase/auth-middleware.ts
- src/integrations/supabase/auth-attacher.ts
- src/start.ts
- (검색 대상) src/routes/*, src/components/*, src/store/*

## 미구현·확인필요 요약

- 미구현.01~03: 로그인/회원가입/인증 상태 UI·컴포넌트·전역 상태 전부 미구현 (3건)
- 확인필요.01~02: 토큰 발급(로그인) 플로우의 실제 구현 위치 및 방식 확인 필요 (2건)
- 총 5건.
