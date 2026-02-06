"use client";

import { useEffect, useRef, useState } from "react";
import { loadTossPayments, TossPaymentsWidgets } from "@tosspayments/tosspayments-sdk";
import { nanoid } from "nanoid";
import { initiatePaymentAction } from "../actions";

interface PaymentWidgetProps {
    clientKey: string;
    customerKey: string;
    initialPrice: number;
}

export default function PaymentWidget({ clientKey, customerKey, initialPrice }: PaymentWidgetProps) {
    // Note: 'widgets' logic is removed because Billing Auth via SDK V2 uses 'API Key',
    // while 'PaymentWidget' UI requires 'Widget Key'. We cannot mix them easily.
    // For Billing (Recurring), we just need a button to trigger the auth window.

    const handlePayment = async () => {
        try {
            const tossPayments = await loadTossPayments(clientKey);
            const payment = tossPayments.payment({ customerKey });

            await payment.requestBillingAuth({
                method: "CARD",
                customerName: "Customer Name", // Optional
                customerEmail: "customer@example.com",
                successUrl: `${window.location.origin}/api/payment/billing/callback?plan=Pro&amount=${initialPrice}`,
                failUrl: `${window.location.origin}/payment/fail`,
            });
        } catch (error) {
            console.error("Payment failed:", error);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold tracking-tight text-[#111418] dark:text-white">
                    정기 결제 수단 등록
                </h2>
                <p className="text-sm text-[#637588] dark:text-gray-400">
                    안전한 결제를 위해 토스페이먼츠 보안 창이 열립니다.
                </p>
            </div>

            {/* Widgets removed to avoid Key Conflict */}
            <div className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center text-sm text-gray-500">
                카드 정보를 등록하여 정기 결제를 시작합니다.
            </div>

            <button
                onClick={handlePayment}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary text-base font-bold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/40 active:scale-[0.98]"
            >
                <span className="material-symbols-outlined">credit_card</span>
                카드 등록하고 구독 시작하기
            </button>
        </div>
    );
}
