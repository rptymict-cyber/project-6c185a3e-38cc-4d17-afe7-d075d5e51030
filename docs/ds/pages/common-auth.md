# 인증 및 권한 관리

본 문서는 AGDICT 서비스의 사용자 인증 체계 및 보안 구성 현황에 대한 명세입니다. 현재 인증 관련 화면 및 라우트 가드는 구현되지 않은 상태이며, 인프라스트럭처 수준의 기본 코드만 포함하고 있습니다.

## 인증 현황 개요

- **현재 상태**: 인증 기능 미구현 (Unimplemented)
- **인증 방식**: Supabase Auth (계정 및 세션 관리) 기반 설계
- **보안 통제**: TanStack Start 미들웨어를 통한 서버 기능 보호 구조 준비

---

## 인증 관련 인프라 (파일 목록)

현재 프로젝트 내에 존재하는 인증 관련 주요 파일 및 역할은 다음과 같습니다.

1. **src/integrations/supabase/client.ts**
   - 클라이언트 사이드 Supabase 인스턴스 생성.
   - `localStorage`를 이용한 세션 유지 설정.

2. **src/integrations/supabase/client.server.ts**
   - 서버 사이드 관리자용 Supabase 클라이언트 (`service_role_key` 사용).
   - RLS(Row Level Security)를 우회하는 신뢰된 작업 수행용.

3. **src/integrations/supabase/auth-attacher.ts**
   - 클라이언트 미들웨어로, RPC(Server Function) 호출 시 Bearer 토큰을 헤더에 자동 첨부하는 역할.

4. **src/integrations/supabase/auth-middleware.ts**
   - 서버 사이드 미들웨어로, 유효한 JWT 토큰 존재 여부를 검증하고 유저 컨텍스트를 주입하는 역할.

5. **src/integrations/supabase/types.ts**
   - Supabase 데이터베이스 스키마 및 인증 관련 타입 정의.

---

## 라우트 가드 적용 현황

- **Guard 존재 여부**: 미적용
- **상세 내용**: `src/routes/__root.tsx` 및 개별 라우트 파일 내에서 사용자 로그인 상태를 체크하여 접근을 제한하는 로직(예: `beforeLoad`)은 현재 존재하지 않습니다. 모든 서비스 화면은 비로그인 상태에서 접근 가능합니다.

---

## 향후 확인 필요 사항 (비고)

- ⚠️ 확인 필요.01: Supabase 프로젝트의 **Social Login(Kakao, Apple 등)** 연동 범위 및 API Key 설정 상태 확인이 필요합니다.
- ⚠️ 확인 필요.02: 데이터베이스 테이블별 **RLS(Row Level Security)** 정책 수립이 선행되어야 합니다.
- ⚠️ 확인 필요.03: 로그인 화면(Login Page) 및 프로필 관리 화면의 UI 설계 및 구현 일정이 필요합니다.
