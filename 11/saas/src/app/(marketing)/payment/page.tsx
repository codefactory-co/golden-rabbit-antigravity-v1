import React from "react";
import PaymentWidget from "./_components/PaymentWidget";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function PaymentPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/auth");
    }

    return (
        <main className="flex flex-1 flex-col items-center py-10 bg-background-light dark:bg-background-dark text-[#111418] dark:text-white">
            <div className="flex w-full max-w-[1200px] flex-col gap-10 px-4 lg:px-8">
                {/* Page Heading */}
                <div className="flex flex-col items-center gap-3 text-center">
                    <h1 className="text-3xl font-black leading-tight tracking-tight text-[#111418] dark:text-white md:text-4xl">
                        구독 플랜 선택
                    </h1>
                    <p className="text-base font-normal text-[#637588] dark:text-gray-400">
                        원하는 플랜을 선택하고 결제를 진행하세요
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
                    {/* Free Card */}
                    <div className="relative flex flex-col gap-6 rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-[#1a2632] lg:p-8">
                        <div className="flex flex-col gap-2">
                            <h3 className="text-lg font-bold text-[#111418] dark:text-white">Free</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black tracking-tight text-[#111418] dark:text-white">
                                    ₩0
                                </span>
                                <span className="text-sm font-medium text-[#637588] dark:text-gray-400">
                                    /월
                                </span>
                            </div>
                            <p className="text-sm text-[#637588] dark:text-gray-400">
                                개인 사용자를 위한 기본 기능
                            </p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3 text-sm text-[#111418] dark:text-gray-200">
                                <span className="material-symbols-outlined text-[20px] text-[#637588] dark:text-gray-500">
                                    check_circle
                                </span>
                                기본 노트 작성 (무제한)
                            </div>
                            <div className="flex items-center gap-3 text-sm text-[#111418] dark:text-gray-200">
                                <span className="material-symbols-outlined text-[20px] text-[#637588] dark:text-gray-500">
                                    check_circle
                                </span>
                                월 100MB 파일 업로드
                            </div>
                            <div className="flex items-center gap-3 text-sm text-[#111418] dark:text-gray-200">
                                <span className="material-symbols-outlined text-[20px] text-[#637588] dark:text-gray-500">
                                    check_circle
                                </span>
                                기기 1대 동기화
                            </div>
                        </div>
                        <div className="mt-auto pt-4">
                            <button
                                className="flex h-12 w-full cursor-not-allowed items-center justify-center rounded-xl bg-[#f3f4f6] text-sm font-bold text-[#9ca3af] dark:bg-gray-800 dark:text-gray-600"
                                disabled
                            >
                                현재 플랜
                            </button>
                        </div>
                    </div>

                    {/* Pro Card (Highlighted) */}
                    <div className="relative flex scale-100 flex-col gap-6 rounded-2xl border-2 border-primary bg-white p-6 shadow-lg ring-4 ring-primary/5 dark:bg-[#1a2632] lg:scale-105 lg:p-8">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white shadow-sm">
                            추천
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className="text-lg font-bold text-primary">Pro</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black tracking-tight text-[#111418] dark:text-white">
                                    ₩9,900
                                </span>
                                <span className="text-sm font-medium text-[#637588] dark:text-gray-400">
                                    /월
                                </span>
                            </div>
                            <p className="text-sm text-[#637588] dark:text-gray-400">
                                전문적인 작업을 위한 모든 기능
                            </p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3 text-sm font-medium text-[#111418] dark:text-white">
                                <span
                                    className="material-symbols-outlined text-[20px] text-primary"
                                    style={{ fontVariationSettings: "'FILL' 1" }}
                                >
                                    check_circle
                                </span>
                                무제한 노트 및 폴더
                            </div>
                            <div className="flex items-center gap-3 text-sm font-medium text-[#111418] dark:text-white">
                                <span
                                    className="material-symbols-outlined text-[20px] text-primary"
                                    style={{ fontVariationSettings: "'FILL' 1" }}
                                >
                                    check_circle
                                </span>
                                월 10GB 대용량 업로드
                            </div>
                            <div className="flex items-center gap-3 text-sm font-medium text-[#111418] dark:text-white">
                                <span
                                    className="material-symbols-outlined text-[20px] text-primary"
                                    style={{ fontVariationSettings: "'FILL' 1" }}
                                >
                                    check_circle
                                </span>
                                모든 기기 실시간 동기화
                            </div>
                            <div className="flex items-center gap-3 text-sm font-medium text-[#111418] dark:text-white">
                                <span
                                    className="material-symbols-outlined text-[20px] text-primary"
                                    style={{ fontVariationSettings: "'FILL' 1" }}
                                >
                                    check_circle
                                </span>
                                오프라인 액세스 지원
                            </div>
                        </div>
                        <div className="mt-auto pt-4">
                            <button className="flex h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-bold text-white shadow-md transition-all hover:bg-primary-dark hover:shadow-lg">
                                이 플랜 선택
                            </button>
                        </div>
                    </div>

                    {/* Enterprise Card */}
                    <div className="relative flex flex-col gap-6 rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-[#1a2632] lg:p-8">
                        <div className="flex flex-col gap-2">
                            <h3 className="text-lg font-bold text-[#111418] dark:text-white">
                                Enterprise
                            </h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black tracking-tight text-[#111418] dark:text-white">
                                    ₩29,900
                                </span>
                                <span className="text-sm font-medium text-[#637588] dark:text-gray-400">
                                    /월
                                </span>
                            </div>
                            <p className="text-sm text-[#637588] dark:text-gray-400">
                                팀 협업과 보안을 위한 솔루션
                            </p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3 text-sm text-[#111418] dark:text-gray-200">
                                <span className="material-symbols-outlined text-[20px] text-[#637588] dark:text-gray-500">
                                    check_circle
                                </span>
                                고급 팀 협업 기능
                            </div>
                            <div className="flex items-center gap-3 text-sm text-[#111418] dark:text-gray-200">
                                <span className="material-symbols-outlined text-[20px] text-[#637588] dark:text-gray-500">
                                    check_circle
                                </span>
                                무제한 업로드 용량
                            </div>
                            <div className="flex items-center gap-3 text-sm text-[#111418] dark:text-gray-200">
                                <span className="material-symbols-outlined text-[20px] text-[#637588] dark:text-gray-500">
                                    check_circle
                                </span>
                                관리자 대시보드
                            </div>
                            <div className="flex items-center gap-3 text-sm text-[#111418] dark:text-gray-200">
                                <span className="material-symbols-outlined text-[20px] text-[#637588] dark:text-gray-500">
                                    check_circle
                                </span>
                                SSO 통합 로그인
                            </div>
                        </div>
                        <div className="mt-auto pt-4">
                            <button className="flex h-12 w-full items-center justify-center rounded-xl border border-[#e5e7eb] bg-white text-sm font-bold text-[#111418] transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-transparent dark:text-white dark:hover:bg-gray-800">
                                이 플랜 선택
                            </button>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="my-6 h-px w-full bg-[#e5e7eb] dark:bg-gray-700"></div>

                {/* Payment Section Container */}
                <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
                    {/* Order Summary */}
                    <div className="flex flex-1 flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <h2 className="text-2xl font-bold tracking-tight text-[#111418] dark:text-white">
                                결제 정보
                            </h2>
                            <p className="text-sm text-[#637588] dark:text-gray-400">
                                선택하신 플랜의 정보를 확인해주세요.
                            </p>
                        </div>
                        <div className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-sm dark:border-gray-700 dark:bg-[#1a2632]">
                            <div className="border-b border-[#f3f4f6] bg-[#f9fafb] px-6 py-4 dark:border-gray-700 dark:bg-gray-800/50">
                                <h3 className="text-base font-bold text-[#111418] dark:text-white">
                                    주문 요약
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-[#637588] dark:text-gray-400">
                                            선택한 플랜
                                        </span>
                                        <span className="text-sm font-bold text-[#111418] dark:text-white">
                                            Pro 플랜
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-[#637588] dark:text-gray-400">
                                            결제 주기
                                        </span>
                                        <span className="text-sm font-medium text-[#111418] dark:text-white">
                                            월간 구독
                                        </span>
                                    </div>
                                    <div className="my-2 h-px w-full border-t border-dashed border-[#e5e7eb] dark:border-gray-600"></div>
                                    <div className="flex items-end justify-between">
                                        <span className="text-sm font-bold text-[#111418] dark:text-white">
                                            총 결제 금액
                                        </span>
                                        <div className="flex flex-col items-end">
                                            <span className="text-2xl font-black text-primary">
                                                ₩9,900
                                            </span>
                                            <span className="text-xs text-[#637588] dark:text-gray-500">
                                                부가세 포함
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Refund Policy Note (Desktop left column) */}
                        <div className="hidden flex-col gap-2 rounded-xl bg-blue-50 p-4 text-xs text-[#1e40af] dark:bg-blue-900/20 dark:text-blue-200 lg:flex">
                            <div className="flex items-start gap-2">
                                <span className="material-symbols-outlined text-sm">info</span>
                                <p className="leading-relaxed">
                                    구독 시작 후 7일 이내에 서비스를 사용하지 않은 경우 전액
                                    환불이 가능합니다. 언제든 계정 설정에서 구독을 취소할 수
                                    있으며, 취소 시 다음 결제일 전까지 서비스를 계속 이용하실 수
                                    있습니다.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="flex flex-1 flex-col gap-6">
                        {/* Payment Widget Integration */}
                        <PaymentWidget
                            clientKey={process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY || ""}
                            customerKey={user.id}
                            initialPrice={9900}
                        />

                        {/* Refund Policy Note (Mobile only) */}
                        <div className="flex flex-col gap-2 rounded-xl bg-blue-50 p-4 text-xs text-[#1e40af] dark:bg-blue-900/20 dark:text-blue-200 lg:hidden">
                            <div className="flex items-start gap-2">
                                <span className="material-symbols-outlined text-sm">info</span>
                                <p className="leading-relaxed">
                                    구독 시작 후 7일 이내에 서비스를 사용하지 않은 경우 전액
                                    환불이 가능합니다. 언제든 계정 설정에서 구독을 취소할 수
                                    있으며, 취소 시 다음 결제일 전까지 서비스를 계속 이용하실 수
                                    있습니다.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
