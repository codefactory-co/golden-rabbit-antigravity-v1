# Technology Stack Rules

이 문서는 본 프로젝트에서 사용하는 주요 기술 스택과 관련된 규칙 및 개발 가이드라인을 정의합니다.

## 1. Supabase (Backend & Database)

### 1.1 타입 안전성 (Type Safety)
- **Supabase CLI**를 사용하여 데이터베이스 타입을 자동으로 생성합니다.
- 생성된 타입(`Database`)을 사용하여 클라이언트 생성 시 제네릭으로 전달, **완전한 타입 추론**이 가능하도록 합니다.
- `any` 타입 사용을 지양하고, DB 스키마 변경 시 반드시 타입을 재생성합니다.

### 1.2 인증 및 세션 (Authentication & Session)
- Next.js 환경에 최적화된 **`@supabase/ssr`** 패키지를 사용합니다.
- 쿠키 기반의 세션 관리를 위해 서버 사이드(Middleware, Server Actions, Server Components)에서 클라이언트를 생성하는 유틸리티를 활용합니다.
- **보안**: 클라이언트 사이드에서 `supabase-js`를 직접 사용하여 민감한 작업을 수행하지 않습니다.

### 1.3 보안 (Security - RLS)
- 모든 테이블에 대해 **Row Level Security (RLS)**를 활성화합니다.
- 서비스 키(Service Key) 사용은 관리자 작업 등 꼭 필요한 경우로 제한하며, 일반적인 비즈니스 로직은 사용자 인증 컨텍스트 하에서 실행되어야 합니다.

---

## 2. Tailwind CSS (Styling)

### 2.1 Utility-First 접근 (Utility-First Approach)
- 가능한 한 Tailwind 유틸리티 클래스를 사용하여 스타일링합니다.
- 복잡한 스타일은 `clsx` 또는 `tailwind-merge`를 사용하여 조건부 스타일링을 깔끔하게 처리합니다.

### 2.2 CSS Variables & Theme (Tailwind v4)
- 색상, 여백 등의 디자인 토큰은 CSS 변수로 관리하며, Tailwind 설정에서 이를 참조하도록 구성합니다.
- **`@apply` 지양**: CSS 파일에서 `@apply`를 과도하게 사용하는 것을 피하고, 컴포넌트화를 통해 스타일을 재사용합니다.

---

## 3. TypeScript (Language)

### 3.1 Strict Mode & Explicit Types
- `strict: true` 옵션을 유지합니다.
- **Explicit Return Types**: 유틸리티 함수나 주요 비즈니스 로직 함수는 반환 타입을 명시적으로 선언하여 의도를 명확히 합니다.
- `any` 대신 `unknown`을 사용하고, 타입 가드(Type Guard)를 통해 안전하게 타입을 좁혀서 사용합니다.

### 3.2 Interface vs Type
- 객체 형태 정의 시 확장이 필요한 경우 `interface`를, 유니온 타입이나 튜플 등은 `type`을 사용하는 일관된 규칙을 따릅니다.

---

## 4. Package Manager

### 4.1 NPM 사용
- 본 프로젝트는 `npm`을 패키지 매니저로 사용합니다.
- `package-lock.json` 파일은 반드시 버전 관리 시스템(Git)에 포함되어야 하며, 팀원 간 동일한 의존성 버전을 보장해야 합니다.
