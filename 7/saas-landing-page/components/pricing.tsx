"use client";

import { useState } from "react";
import { Container } from "./container";
import { Check } from "lucide-react";
import { useSnackbar } from "./snackbar-provider";

const tiers = [
    {
        name: "무료 (Free)",
        price: { monthly: 0, annual: 0 },
        description: "개인적인 글쓰기를 위한 기본적인 도구",
        features: ["월 5,000자 생성", "기본 문법 교정", "5개 템플릿", "1인 사용"],
        cta: "무료로 시작하기",
        mostPopular: false,
    },
    {
        name: "프로 (Pro)",
        price: { monthly: 19, annual: 15 },
        description: "콘텐츠 크리에이터와 전문가를 위한 플랜",
        features: [
            "월 무제한 생성",
            "고급 문맥 교정",
            "모든 템플릿 (50+)",
            "다국어 번역",
            "우선 지원",
        ],
        cta: "무료 체험 시작",
        mostPopular: true,
    },
    {
        name: "엔터프라이즈 (Enterprise)",
        price: { monthly: 49, annual: 39 },
        description: "팀과 조직을 위한 완벽한 솔루션",
        features: [
            "모든 프로 기능 포함",
            "팀 협업 기능",
            "API 액세스",
            "SSO 로그인",
            "전담 매니저",
        ],
        cta: "문의하기",
        mostPopular: false,
    },
];

export function Pricing() {
    const [isAnnual, setIsAnnual] = useState(false);
    const { showSnackbar } = useSnackbar();

    return (
        <div id="pricing" className="py-24 sm:py-32 bg-gray-50">
            <Container>
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        요금제 선택
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        당신의 니즈에 맞는 최적의 플랜을 선택하세요.
                    </p>

                    <div className="mt-8 flex justify-center">
                        <div className="relative flex items-center rounded-full bg-gray-200 p-1">
                            <button
                                className={`${!isAnnual ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'} relative rounded-full px-4 py-1.5 text-sm font-semibold transition-all`}
                                onClick={() => setIsAnnual(false)}
                            >
                                월간 결제
                            </button>
                            <button
                                className={`${isAnnual ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'} relative rounded-full px-4 py-1.5 text-sm font-semibold transition-all`}
                                onClick={() => setIsAnnual(true)}
                            >
                                연간 결제
                            </button>
                        </div>
                        {isAnnual && (
                            <span className="ml-4 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                20% 할인
                            </span>
                        )}
                    </div>
                </div>

                <div className="mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-3">
                    {tiers.map((tier) => (
                        <div
                            key={tier.name}
                            className={`flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 xl:p-10 ${tier.mostPopular
                                    ? "ring-2 ring-violet-600 shadow-xl scale-105 z-10"
                                    : "ring-gray-200 shadow-sm hover:shadow-md transition-shadow"
                                }`}
                        >
                            <div>
                                <div className="flex items-center justify-between gap-x-4">
                                    <h3
                                        className={`text-lg font-semibold leading-8 ${tier.mostPopular ? "text-violet-600" : "text-gray-900"
                                            }`}
                                    >
                                        {tier.name}
                                    </h3>
                                    {tier.mostPopular && (
                                        <span className="rounded-full bg-violet-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-violet-600">
                                            가장 인기
                                        </span>
                                    )}
                                </div>
                                <p className="mt-4 text-sm leading-6 text-gray-600">
                                    {tier.description}
                                </p>
                                <p className="mt-6 flex items-baseline gap-x-1">
                                    <span className="text-4xl font-bold tracking-tight text-gray-900">
                                        ${isAnnual ? tier.price.annual : tier.price.monthly}
                                    </span>
                                    <span className="text-sm font-semibold leading-6 text-gray-600">
                                        /월
                                    </span>
                                </p>
                                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                                    {tier.features.map((feature) => (
                                        <li key={feature} className="flex gap-x-3">
                                            <Check className="h-6 w-5 flex-none text-violet-600" aria-hidden="true" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <button
                                onClick={() => showSnackbar("없는 페이지입니다")}
                                className={`mt-8 block w-full rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${tier.mostPopular
                                        ? "bg-violet-600 text-white shadow-sm hover:bg-violet-500 focus-visible:outline-violet-600"
                                        : "bg-white text-violet-600 ring-1 ring-inset ring-violet-200 hover:ring-violet-300"
                                    }`}
                            >
                                {tier.cta}
                            </button>
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
}
