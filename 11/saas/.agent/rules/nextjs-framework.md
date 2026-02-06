---
trigger: always_on
---

# Next.js Framework Guidelines

이 문서는 본 프로젝트에서 Next.js를 사용할 때 준수해야 할 프레임워크 관련 규칙과 모범 사례를 정의합니다. 모든 개발자는 이 가이드라인을 따라야 합니다.

## 1. 렌더링 전략 (Rendering Strategy)

### 1.1 Server Component 우선 원칙 (Prefer Server Components)
- **기본적으로 모든 컴포넌트는 Server Component로 작성합니다.**
- Client Component(`'use client'`)는 **상호작용(onClick, onChange 등)**이나 **브라우저 API(window, localStorage 등)**, **React Hook(useState, useEffect 등)**이 꼭 필요한 경우에만 사용합니다.
- 가능한 한 Client Component를 트리의 **말단(Leaf Node)**으로 밀어내어, Server Component가 최대한 많은 부분을 렌더링하도록 합니다.

### 1.2 Client Component 격리 (Isolate Client Components)
- 전체 페이지를 `'use client'`로 감싸지 않습니다.
- 상호작용이 필요한 부분만 별도의 컴포넌트로 분리하여 `'use client'`를 적용합니다.
- **예시**: 전체 `Navbar`가 아니라, 로그인이 필요한 `LoginButton`만 Client Component로 만듭니다.

---

## 2. 코드 품질 및 스타일 (Code Quality & Style)

### 2.1 가독성 및 간결성 (Readability & Conciseness)
- 코드는 **읽기 쉽고 직관적**이어야 합니다. 복잡한 로직은 명확한 변수명과 함수명으로 의도를 드러냅니다.
- 불필요한 추상화나 과도한 기교를 피하고, **명시적인 코드**를 선호합니다.
- `early return` 패턴을 사용하여 들여쓰기 깊이를 줄입니다.

### 2.2 단일 책임 원칙 및 파일 분리 (Single Responsibility & File Splitting)
- **하나의 파일이 너무 커지면(예: 300라인 이상), 반드시 여러 파일로 분리합니다.**
- 컴포넌트 내부에서 정의된 서브 컴포넌트는 별도 파일로 추출합니다.
- 비즈니스 로직(Hook, Utils)과 UI 컴포넌트를 분리합니다.
- **규칙**: 하나의 파일에는 하나의 주요 컴포넌트(Component)나 모듈만 존재해야 합니다.

---

## 3. 데이터 패칭 및 상태 관리 (Data Fetching & State Management)

### 3.1 Server Actions 활용 (Use Server Actions)
- 데이터 변경(Mutation) 작업(POST, PUT, DELETE 등)은 API Routes 대신 **Server Actions**를 사용합니다.
- Server Actions는 `src/app/actions.ts` 또는 관련 도메인 폴더에 위치시킵니다.
- 폼 핸들링 시 `action` prop을 적극 활용합니다.

### 3.2 데이터 패칭은 서버에서 (Fetch on Server)
- 가능한 한 **Server Component에서 데이터를 가져옵니다.**
- 불필요한 클라이언트 사이드 패칭(`useEffect` + `fetch`)을 지양하고, 초기 데이터는 서버에서 주입합니다.

---

## 4. 성능 최적화 (Performance Optimization)

### 4.1 Next.js 최적화 컴포넌트 사용 (Use Built-in Optimization)
- **이미지**: 일반 `<img>` 태그 대신 `next/image`를 사용하여 이미지 최적화(Lazy Loading, Resizing)를 수행합니다.
- **폰트**: `next/font`를 사용하여 폰트 로딩 시 Layout Shift(CLS)를 방지합니다.
- **스크립트**: 외부 스크립트는 `next/script`를 사용하여 로딩 우선순위를 제어합니다.

---

## 5. SEO 및 메타데이터 (SEO & Metadata)

### 5.1 Metadata API 사용 (Use Metadata API)
- `<head>` 태그를 직접 수정하지 않고, Next.js의 **Metadata API**(`export const metadata`)를 사용합니다.
- 동적 페이지(`[id]/page.tsx`)에서는 `generateMetadata` 함수를 사용하여 메타데이터를 동적으로 생성합니다.
