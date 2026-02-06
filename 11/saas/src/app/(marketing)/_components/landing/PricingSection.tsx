import React from "react";
import { Pricing } from "@/src/components/common/Pricing";

export function PricingSection() {
    return (
        <section className="bg-slate-50 py-24 dark:bg-[#0F172A]/50 sm:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                        합리적인 요금제
                    </h2>
                    <p className="mt-4 text-lg text-slate-600 dark:text-gray-400">
                        당신의 필요에 맞는 최적의 플랜을 선택하세요
                    </p>
                </div>

                <Pricing mode="display" />
            </div>
        </section>
    );
}
