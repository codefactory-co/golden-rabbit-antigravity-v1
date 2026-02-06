import React from "react";
import Link from "next/link";
import { Button } from "@/src/components/common/Button";

export function HeroSection() {
    return (
        <section className="relative px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24 lg:pb-28">
            <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                <div
                    className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-sky-400 to-sky-200 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                    style={{
                        clipPath:
                            "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                    }}
                />
            </div>
            <div className="mx-auto max-w-7xl text-center">
                <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl">
                    당신의 아이디어를
                    <br className="hidden sm:block" />
                    <span className="text-primary relative whitespace-nowrap">
                        <span className="relative">AI와 함께 실현</span>
                    </span>
                    하세요!!!
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-gray-300 sm:text-xl">
                    CloudNote는 AI 기술을 활용하여 당신의 메모를 분석하고, 요약하며,
                    인사이트를 도출합니다. 복잡한 생각, 이제 CloudNote에 맡기세요.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <Link href="/auth">
                        <Button
                            variant="primary"
                            size="lg"
                            className="min-w-[160px] text-lg hover:scale-105 transition-transform"
                        >
                            무료로 시작하기
                        </Button>
                    </Link>
                    <Link href="/about">
                        <Button
                            variant="secondary"
                            size="lg"
                            className="text-lg"
                        >
                            기능 살펴보기
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
