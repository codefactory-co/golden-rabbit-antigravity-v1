---
description: 기능 구현 검증을 위한 종합 워크플로우 (테스트, 아키텍처, 메타데이터 검증)
---

이 워크플로우는 새로운 기능을 구현한 뒤, 코드의 품질과 안정성을 종합적으로 검증하기 위해 사용합니다. 다음 3가지 스킬을 순차적으로 실행하고 결과를 종합합니다.

1.  **테스트 검증 (verify_tests)**
    *   `.agent/skills/verify_tests/SKILL.md`를 읽고 지침을 따릅니다.
    *   `vitest`를 실행하여 기능 동작과 회귀 테스트 통과 여부를 확인합니다.

2.  **아키텍처 및 보안 분석 (analyze_nextjs_architecture)**
    *   `.agent/skills/analyze_nextjs_architecture/SKILL.md`를 읽고 지침을 따릅니다.
    *   `use client` 사용의 적절성, Clean Architecture 의존성 규칙 준수, 보안 취약점(XSS, 입력 검증)을 점검합니다.

3.  **OG 메타데이터 검증 (check_og_metadata)**
    *   `.agent/skills/check_og_metadata/SKILL.md`를 읽고 지침을 따릅니다.
    *   전역 메타데이터 설정과 신규 페이지의 독립적 메타데이터(OG 태그) 구현 여부를 확인합니다.

4.  **최종 리포트 생성**
    *   위 3단계의 결과를 종합하여 `feature_validation_report.md`라는 아티팩트를 생성합니다.
    *   각 항목별로 ✅(통과), ⚠️(경고), ❌(실패) 상태를 표시하고, 수정이 필요한 사항을 요약합니다.
