import React from "react";
import { Subscription } from "@/src/core/domain/entities/Subscription";

interface WelcomeSectionProps {
    userName: string;
    subscription: Subscription | null;
}

export function WelcomeSection({ userName, subscription }: WelcomeSectionProps) {
    const planName = subscription?.planName || 'Free';

    return (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-[#111418] dark:text-white mb-2">
                    안녕하세요, {userName}님!
                </h2>
                <p className="text-[#617589] dark:text-gray-400">
                    현재 <span className="font-semibold text-primary">{planName} 플랜</span>을 이용 중입니다
                </p>
            </div>
        </div>
    );
}
