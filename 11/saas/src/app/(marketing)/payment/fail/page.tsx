"use client";

import Link from "next/link";
import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { processPaymentFailureAction } from "../actions";

function PaymentFailContent() {
    const searchParams = useSearchParams();
    const code = searchParams.get("code");
    const message = searchParams.get("message");
    const orderId = searchParams.get("orderId");

    const [isProcessed, setIsProcessed] = useState(false);

    useEffect(() => {
        if (!orderId || !message || isProcessed) return;

        const processFailure = async () => {
            try {
                // Update DB status to 'failed'
                await processPaymentFailureAction(orderId, message);
                setIsProcessed(true);
            } catch (error) {
                console.error("Failed to process payment failure:", error);
            }
        };

        processFailure();
    }, [orderId, message, isProcessed]);

    return (
        <div className="bg-background-light dark:bg-background-dark text-text-main font-body min-h-screen flex items-center justify-center">
            <div className="w-full max-w-[480px] bg-white dark:bg-surface-dark rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 text-center">
                <div className="size-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-6 mx-auto">
                    <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-[48px]">
                        error
                    </span>
                </div>
                <h1 className="text-2xl font-bold text-text-main dark:text-white mb-2">결제 실패</h1>
                <p className="text-text-secondary dark:text-gray-400 mb-6">
                    {message || "알 수 없는 오류가 발생했습니다."}
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6 text-sm text-left">
                    <p className="text-gray-500 mb-1">에러 코드</p>
                    <p className="font-mono text-text-main dark:text-gray-200">{code || "UNKNOWN"}</p>
                </div>
                <Link
                    href="/payment"
                    className="inline-flex items-center justify-center h-12 px-6 bg-primary text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors w-full"
                >
                    다시 시도하기
                </Link>
            </div>
        </div>
    );
}

export default function PaymentFailPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PaymentFailContent />
        </Suspense>
    );
}
