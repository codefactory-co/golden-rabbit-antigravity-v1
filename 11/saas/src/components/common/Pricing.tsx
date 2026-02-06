"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "./Icon";
import { Button } from "./Button";

interface Feature {
    text: string;
}

interface Plan {
    id: string;
    name: string;
    price: string;
    period: string;
    description: string;
    features: Feature[];
    popular?: boolean;
    buttonText: string;
    href?: string;
}

const PLANS: Plan[] = [
    {
        id: "free",
        name: "Free",
        price: "₩0",
        period: "/월",
        description: "개인 사용자를 위한 기본적인 메모 기능",
        buttonText: "시작하기",
        href: "/auth?plan=free",
        features: [
            { text: "메모 100개" },
            { text: "저장공간 1GB" },
            { text: "기본 AI 요약" },
        ],
    },
    {
        id: "pro",
        name: "Pro",
        price: "₩9,900",
        period: "/월",
        description: "전문가와 파워 유저를 위한 향상된 기능",
        popular: true,
        buttonText: "Pro 시작하기",
        href: "/auth?plan=pro",
        features: [
            { text: "무제한 메모" },
            { text: "저장공간 10GB" },
            { text: "고급 AI 분석 및 검색" },
            { text: "모든 기기 실시간 동기화" },
        ],
    },
    {
        id: "enterprise",
        name: "Enterprise",
        price: "₩29,900",
        period: "/월",
        description: "팀과 조직을 위한 보안 및 협업 기능",
        buttonText: "문의하기",
        href: "/contact",
        features: [
            { text: "모든 Pro 기능 포함" },
            { text: "무제한 저장공간" },
            { text: "팀 협업 및 공유" },
            { text: "SSO 및 고급 보안" },
        ],
    },
];

interface PricingProps {
    mode?: "display" | "select";
    selectedPlanId?: string;
    onSelectPlan?: (planId: string) => void;
}

export function Pricing({ mode = "display", selectedPlanId, onSelectPlan }: PricingProps) {
    return (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {PLANS.map((plan) => {
                const isSelected = selectedPlanId === plan.id;
                const isPopular = plan.popular;

                return (
                    <div
                        key={plan.id}
                        onClick={() => mode === "select" && onSelectPlan?.(plan.id)}
                        className={`relative rounded-2xl border bg-white p-8 shadow-sm transition-all dark:bg-surface-dark 
                            ${mode === "select" ? "cursor-pointer" : ""}
                            ${isSelected || isPopular
                                ? "border-primary ring-1 ring-primary shadow-lg scale-105 z-10"
                                : "border-gray-200 dark:border-gray-800 hover:shadow-md"
                            }
                        `}
                    >
                        {isPopular && (
                            <div className="absolute -top-4 right-8 inline-block rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                                Popular
                            </div>
                        )}

                        <div className="mb-4">
                            <h3 className={`text-xl font-semibold ${isPopular ? "text-primary" : "text-slate-900 dark:text-white"}`}>
                                {plan.name}
                            </h3>
                            <div className="mt-4 flex items-baseline">
                                <span className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {plan.price}
                                </span>
                                <span className="ml-1 text-xl font-semibold text-gray-500 dark:text-gray-400">
                                    {plan.period}
                                </span>
                            </div>
                            <p className="mt-6 text-base text-slate-600 dark:text-gray-300">
                                {plan.description}
                            </p>
                        </div>

                        <ul role="list" className="mt-6 space-y-4 mb-8">
                            {plan.features.map((feature, idx) => (
                                <li key={idx} className="flex">
                                    <Icon name="check" className="text-primary mr-3 text-xl" fill />
                                    <span className="text-slate-600 dark:text-gray-300">
                                        {feature.text}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        {mode === "display" ? (
                            <Link href={plan.href || "#"} className="w-full block">
                                <Button
                                    variant={isPopular ? "primary" : "secondary"}
                                    className="w-full"
                                >
                                    {plan.buttonText}
                                </Button>
                            </Link>
                        ) : (
                            <Button
                                variant={isSelected ? "primary" : "outline"}
                                className="w-full"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectPlan?.(plan.id);
                                }}
                            >
                                {isSelected ? "선택됨" : "선택하기"}
                            </Button>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
