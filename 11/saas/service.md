# CloudNote Service Context

## 1. 서비스 개요 (Service Overview)
**CloudNote**는 사용자의 아이디어를 클라우드에 안전하게 저장하고, AI 기술을 활용하여 메모를 정리 및 요약해주는 지능형 메모 서비스입니다. 개인 사용자부터 기업 팀까지 다양한 규모의 사용자를 대상으로 하며, 웹과 모바일 등 다양한 환경에서 끊김 없는 사용자 경험을 제공합니다.

## 2. 타겟 사용자 (Target Audience)
- **개인 사용자 (Free)**: 간단한 메모 작성 및 저장이 필요한 일반 사용자.
- **파워 유저 (Pro/Professional)**: 많은 양의 메모를 관리하고, 고급 AI 기능과 대용량 저장공간이 필요한 전문가.
- **기업 및 팀 (Enterprise)**: 팀 단위의 협업, 보안, 그리고 통합 관리가 필요한 조직.

## 3. 주요 기능 (Key Features)

### 3.1 핵심 기능 (Core Features)
- **클라우드 동기화**: 모든 기기(Web, Mobile, Tablet)에서 실시간으로 메모를 동기화합니다.
- **AI 인텔리전스**:
    - **자동 요약**: 긴 메모 내용을 AI가 자동으로 요약해줍니다.
    - **스마트 검색**: 키워드뿐만 아니라 문맥을 이해하는 검색을 지원합니다.
- **체계적인 관리**: 폴더 구조, 태그, 프로젝트 단위의 정리를 지원합니다.

### 3.2 요금제 및 구독 (Pricing & Plans)
| 기능 | Free (무료) | Pro (월 9,900원) | Enterprise (월 29,900원) |
| :--- | :--- | :--- | :--- |
| **메모 수** | 100개 | **무제한** | 무제한 |
| **저장 공간** | 1GB | **10GB** | **무제한** |
| **AI 기능** | 기본 요약 | 고급 요약 및 검색 | 고급 기능 전체 |
| **동기화** | 기기 1대 | **모든 기기 실시간** | 모든 기기 |
| **협업** | - | 팀 공유 기능 | **고급 팀 협업 & SSO** |

## 4. 사용자 경험 흐름 (User Experience Flow)

### 4.1 랜딩 및 온보딩 (Landing & Onboarding)
- **랜딩 페이지**: 서비스의 핵심 가치 제안, 주요 기능 소개, 요금제 비교를 통해 가입을 유도합니다.
- **회원가입/로그인**:
    - 이메일/비밀번호 방식과 소셜 로그인(Google, Kakao)을 모두 지원합니다.
    - 간단한 탭 전환으로 로그인과 회원가입을 오갈 수 있으며, 로그인 상태 유지 기능을 제공합니다.

### 4.2 대시보드 (Dashboard)
사용자가 로그인 후 가장 먼저 접하는 화면으로, 서비스 이용 현황을 한눈에 파악할 수 있습니다.
- **사용자 환영**: 사용자 이름과 현재 플랜(예: Pro Flag)을 표시하여 개인화된 경험 제공.
- **구독 현황 카드**:
    - 현재 플랜 및 상태(활성/비활성).
    - 다음 결제일 및 결제 예정 금액.
    - 등록된 결제 수단 정보 (예: Visa **** 4242).
    - **플랜 변경/구독 취소**: 바로가기 버튼을 통해 구독 관리 접근성 강화.
- **사용량 모니터링 위젯**:
    - 리소스 사용량(메모 개수, 저장 공간, AI 요약 횟수)을 프로그레스 바 형태로 시각화.
    - 한도 대비 사용량을 직관적으로 표시 (예: 32% 사용).
- **최근 활동 피드**:
    - 사용자의 주요 활동(메모 작성, 요약 생성, 폴더 생성, 공유, 로그인 등)을 시간순으로 나열.
    - 각 활동에 맞는 아이콘과 메타데이터(시간, 장소, 대상) 표시.

### 4.3 구독 및 결제 (Subscription & Payment)
- **플랜 선택**: Free, Pro, Enterprise 플랜을 비교하고 선택할 수 있습니다.
- **결제 프로세스**:
    - **주문 요약**: 선택한 플랜, 결제 주기(월간), 총 결제 금액(부과세 포함)을 명확히 제시.
    - **결제 수단 선택**: 신용카드, 카카오페이, 네이버페이, 토스페이 등 다양한 결제 수단 지원.
    - **약관 동의**: 구매 조건 및 개인정보 처리방침 동의 절차.
    - **환불 정책 안내**: 7일 이내 미사용 시 전액 환불 등 안심 문구 제공.
- **결제 완료**:
    - 성공적인 결제 확인 메시지.
    - 영수증 정보(주문 번호, 승인 일시, 결제 금액) 및 다음 결제일 안내.
    - 대시보드로 이동하거나 영수증을 다운로드할 수 있는 옵션 제공.

## 5. 데이터 모델 추론 (Implied Data Models)

디자인을 통해 유추할 수 있는 주요 데이터 엔티티와 필드입니다.

- **User (사용자)**
    - `id`, `name`, `email`, `profileImage`
    - `authProvider` (Google, Kakao, Email)
    - `currentPlanId` (Relation to Plan)

- **Plan (플랜)**
    - `id`, `name` (Free, Pro, Enterprise), `price`, `currency`
    - `limits` (JSON: { storage: 10GB, noteCount: inf, aiSummaries: 100 })

- **Subscription (구독)**
    - `id`, `userId`, `planId`
    - `status` (Active, Canceled, Expired)
    - `startDate`, `nextBillingDate`
    - `paymentMethod` (Card info, Provider)

- **Usage (사용량)**
    - `userId`
    - `storageUsed`, `noteCount`, `aiSummaryCount`
    - `lastUpdated`

- **ActivityLog (활동 로그)**
    - `id`, `userId`, `type` (CREATE_NOTE, USE_AI, SHARE, LOGIN)
    - `description`, `metadata` (Browser info, Target Log ID)
    - `createdAt`

- **Payment (결제 내역)**
    - `id`, `orderNumber`, `userId`, `amount`, `status`
    - `method`, `approvedAt`

## 6. 디자인 시스템 가이드 (Design System)
- **Primary Color**: Blue `#137fec` (신뢰, 클라우드, 인텔리전스 상징)
- **Font Family**:
    - 영문/숫자: `Inter`
    - 국문: `Noto Sans KR`
- **UI 스타일**:
    - **Rounded Corners**: 부드러운 `0.25rem` ~ `0.75rem` 반경 사용.
    - **Glassmorphism**: 헤더 등에 배경 블러 처리(`backdrop-blur`)로 현대적인 느낌.
    - **Dark Mode**: 시스템 설정에 따른 다크 모드 완벽 지원 (`dark:` tailwind 클래스 활용).
