"use client";

import Link from "next/link";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { processPaymentSuccessAction } from "../actions";
import { useEffect, useState } from "react";

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");
    const paymentKey = searchParams.get("paymentKey");

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        if (!orderId || !amount || !paymentKey) {
            setStatus("error");
            setErrorMessage("잘못된 접근입니다. 결제 정보가 누락되었습니다.");
            return;
        }

        const verifyPayment = async () => {
            try {
                await processPaymentSuccessAction(orderId, paymentKey, Number(amount));
                setStatus("success");
            } catch (error) {
                console.error("Payment verification failed:", error);
                setStatus("error");
                setErrorMessage(error instanceof Error ? error.message : "결제 확인 중 오류가 발생했습니다.");
            }
        };

        verifyPayment();
    }, [orderId, amount, paymentKey]);

    // Format amount with commas
    const formattedAmount = amount ? Number(amount).toLocaleString() : "0";

    // Get current date formatted
    const today = new Date();
    const formattedDate = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일 ${today.getHours()}:${today.getMinutes().toString().padStart(2, '0')}`;

    // Get next month date
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const formattedNextDate = `${nextMonth.getFullYear()}년 ${nextMonth.getMonth() + 1}월 ${nextMonth.getDate()}일`;

    if (status === "loading") {
        return (
            <div className="bg-background-light dark:bg-background-dark text-text-main font-body min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="size-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                    <p className="text-lg font-medium text-text-secondary dark:text-gray-400">결제 확인 중...</p>
                </div>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="bg-background-light dark:bg-background-dark text-text-main font-body min-h-screen flex items-center justify-center">
                <div className="w-full max-w-[480px] bg-white dark:bg-surface-dark rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 text-center">
                    <div className="size-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-6 mx-auto">
                        <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-[48px]">
                            error
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold text-text-main dark:text-white mb-2">결제 확인 실패</h1>
                    <p className="text-text-secondary dark:text-gray-400 mb-6">{errorMessage}</p>
                    <Link
                        href="/payment"
                        className="inline-flex items-center justify-center h-12 px-6 bg-primary text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors"
                    >
                        다시 시도하기
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background-light dark:bg-background-dark text-text-main font-body min-h-screen flex flex-col">


            {/* Main Content Area */}
            <main className="flex-grow flex items-center justify-center p-4 sm:p-6">
                {/* Central Card */}
                <div className="w-full max-w-[480px] bg-surface-light bg-white dark:bg-surface-dark rounded-2xl shadow-xl dark:shadow-black/40 overflow-hidden border border-gray-100 dark:border-gray-800">
                    {/* Success Header Section */}
                    <div className="flex flex-col items-center pt-10 pb-6 px-8 text-center">
                        <div className="size-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-[48px]">
                                check
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-text-main dark:text-white mb-2">
                            결제가 완료되었습니다!
                        </h1>
                        <p className="text-text-secondary dark:text-gray-400 text-base sm:text-lg">
                            Pro 플랜이 활성화되었습니다
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="px-8">
                        <div className="h-px w-full bg-gray-100 dark:bg-gray-800"></div>
                    </div>

                    {/* Payment Details List */}
                    <div className="px-8 py-6 space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-text-secondary dark:text-gray-400">
                                주문번호
                            </span>
                            <span className="font-medium text-text-main dark:text-gray-200">
                                {orderId || "ORD-UNKNOWN"}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-text-secondary dark:text-gray-400">
                                결제 금액
                            </span>
                            <span className="font-bold text-lg text-primary">₩{formattedAmount}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-text-secondary dark:text-gray-400">
                                결제 수단
                            </span>
                            <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[16px] text-text-secondary dark:text-gray-500">
                                    credit_card
                                </span>
                                <span className="font-medium text-text-main dark:text-gray-200">
                                    신용카드
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-text-secondary dark:text-gray-400">
                                결제 일시
                            </span>
                            <span className="font-medium text-text-main dark:text-gray-200">
                                {formattedDate}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-text-secondary dark:text-gray-400">
                                다음 결제일
                            </span>
                            <span className="font-medium text-text-main dark:text-gray-200">
                                {formattedNextDate}
                            </span>
                        </div>
                        {/* Payment Key (Debug/Hidden) */}
                        <div className="hidden">
                            {paymentKey}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="px-8">
                        <div className="h-px w-full bg-gray-100 dark:bg-gray-800"></div>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-8 flex flex-col gap-4">
                        <Link
                            href="/dashboard"
                            className="w-full h-12 bg-primary hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 group"
                        >
                            <span>대시보드로 이동</span>
                            <span className="material-symbols-outlined text-[20px] group-hover:translate-x-0.5 transition-transform">
                                arrow_forward
                            </span>
                        </Link>
                        <a
                            className="flex items-center justify-center gap-2 text-primary hover:text-blue-700 text-sm font-medium transition-colors py-2"
                            href="#"
                        >
                            <span className="material-symbols-outlined text-[18px]">
                                download
                            </span>
                            영수증 다운로드
                        </a>
                    </div>

                    {/* Footer Note */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 px-8 py-4 text-center border-t border-gray-100 dark:border-gray-800">
                        <p className="text-xs text-text-secondary dark:text-gray-500 leading-relaxed">
                            결제 확인 이메일을 발송했습니다.
                            <br />
                            문의사항이 있으시면{" "}
                            <Link
                                className="underline hover:text-text-main dark:hover:text-gray-300"
                                href="#"
                            >
                                고객센터
                            </Link>
                            로 연락해주세요.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PaymentSuccessContent />
        </Suspense>
    );
}
