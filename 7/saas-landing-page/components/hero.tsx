import { Container } from "./container";
import { ArrowRight, Play } from "lucide-react";
import { SnackbarLink } from "./snackbar-link";

export function Hero() {
    return (
        <div className="relative overflow-hidden bg-white">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-indigo-900" />

            <Container className="relative pt-20 pb-32 sm:pt-32 sm:pb-40">
                <div className="flex flex-col items-center text-center">
                    {/* Badge */}
                    <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
                        <span className="flex h-2 w-2 rounded-full bg-violet-400"></span>
                        새로운 소식 확인 출시
                        <ArrowRight className="h-4 w-4 text-white/70" />
                    </div>

                    {/* Headlines */}
                    <h1 className="mb-6 max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-6xl">
                        AI와 함께 더 빠르고, <br className="hidden sm:block" />
                        더 잘 쓰세요
                    </h1>
                    <p className="mb-10 max-w-2xl text-lg text-violet-100 sm:text-xl">
                        아이디어를 몇 초 만에 완성된 콘텐츠로 바꿔보세요. 블로그, 이메일, 소셜 미디어 게시물까지 WriteFlow가 도와드립니다.
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                        <SnackbarLink
                            className="rounded-full bg-white px-8 py-3.5 text-base font-semibold text-violet-600 shadow-sm hover:bg-violet-50 transition-colors"
                        >
                            무료 체험 시작
                        </SnackbarLink>
                        <button
                            className="flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/20 transition-colors"
                        >
                            <Play className="h-4 w-4 fill-current" />
                            데모 보기
                        </button>
                    </div>

                    {/* Dashboard Placeholder / Mockup */}
                    <div className="mt-20 w-full max-w-5xl rounded-xl bg-white/10 p-2 backdrop-blur-sm ring-1 ring-white/20">
                        <div className="rounded-lg bg-white shadow-2xl overflow-hidden aspect-[16/9] relative flex flex-col">
                            {/* Mockup Header */}
                            <div className="border-b border-gray-100 bg-gray-50 px-4 py-3 flex items-center gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                </div>
                                <div className="ml-4 h-6 w-64 rounded bg-white border border-gray-200"></div>
                            </div>
                            {/* Mockup Body */}
                            <div className="flex-1 p-8 flex gap-8">
                                <div className="w-64 hidden sm:block">
                                    <div className="h-8 w-32 bg-gray-100 rounded mb-4"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 w-full bg-gray-50 rounded"></div>
                                        <div className="h-4 w-full bg-gray-50 rounded"></div>
                                        <div className="h-4 w-3/4 bg-gray-50 rounded"></div>
                                    </div>
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div className="h-10 w-3/4 bg-gray-100 rounded"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 w-full bg-gray-50 rounded"></div>
                                        <div className="h-4 w-full bg-gray-50 rounded"></div>
                                        <div className="h-4 w-full bg-gray-50 rounded"></div>
                                        <div className="h-4 w-5/6 bg-gray-50 rounded"></div>
                                    </div>

                                    {/* AI Suggestion Box */}
                                    <div className="mt-6 rounded-lg border border-violet-100 bg-violet-50/50 p-4">
                                        <div className="flex items-center gap-2 mb-2 text-violet-600 font-medium text-sm">
                                            <span className="w-2 h-2 rounded-full bg-violet-600 animate-pulse"></span>
                                            WriteFlow AI 제안
                                        </div>
                                        <div className="h-4 w-full bg-violet-100/50 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
