import React from "react";
import { Subscription } from "@/src/core/domain/entities/Subscription";
import { CancelSubscriptionDialog } from "./CancelSubscriptionDialog";

interface SubscriptionCardProps {
    subscription: Subscription | null;
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
    const formatDate = (date: Date) => {
        return date.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("ko-KR", {
            style: "currency",
            currency: "KRW",
        }).format(amount);
    };

    const planName = subscription?.planName || 'Free';
    const status = subscription?.status || 'Active';
    const isPro = planName === 'Pro';
    const isFree = planName === 'Free';

    // Mock fallback data if subscription is null (for free users possibly, or just empty state)
    const nextBillingDate = subscription ? formatDate(subscription.nextBillingDate) : '-';
    const amount = subscription ? formatCurrency(subscription.amount) : formatCurrency(0);
    const cardBrand = subscription?.paymentMethod.brand || '-';
    const cardLast4 = subscription?.paymentMethod.last4 || '----';

    return (
        <div className="bg-white dark:bg-surface-dark rounded-xl border border-[#f0f2f4] dark:border-gray-800 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-[#f0f2f4] dark:border-gray-800 flex justify-between items-center">
                <h3 className="font-bold text-lg">구독 현황</h3>
                <div className="flex gap-2">
                    <span className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300 ring-1 ring-inset ring-blue-700/10">
                        {planName}
                    </span>
                    <span className="inline-flex items-center rounded-md bg-green-50 dark:bg-green-900/30 px-2.5 py-1 text-xs font-semibold text-green-700 dark:text-green-300 ring-1 ring-inset ring-green-600/20">
                        {status === 'Active' ? '활성' : status}
                    </span>
                </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between gap-6">
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-[#617589] dark:text-gray-400">
                            {status === 'Canceled' ? '이용 만료일' : '다음 결제일'}
                        </span>
                        <span className="text-sm font-medium">{nextBillingDate}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-[#617589] dark:text-gray-400">
                            월 결제 금액
                        </span>
                        <span className="text-lg font-bold">{amount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-[#617589] dark:text-gray-400">
                            결제 수단
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px] text-gray-400">
                                credit_card
                            </span>
                            <span className="text-sm font-medium">{cardBrand} •••• {cardLast4}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3 mt-4 pt-4 border-t border-[#f0f2f4] dark:border-gray-800">
                    <button className="flex-1 bg-primary hover:bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-colors shadow-sm shadow-blue-200 dark:shadow-none">
                        플랜 변경
                    </button>
                    {(!isFree && status === 'Active') ? (
                        <CancelSubscriptionDialog />
                    ) : (!isFree && status === 'Canceled') ? (
                        <button disabled className="flex-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-400 font-medium py-2.5 px-4 rounded-lg text-sm cursor-not-allowed">
                            해지 예약됨
                        </button>
                    ) : (
                        <div className="flex-1"></div>
                    )}
                </div>
            </div>
        </div>
    );
}
