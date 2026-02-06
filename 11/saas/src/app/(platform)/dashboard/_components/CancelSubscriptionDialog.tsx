'use client';

import { useState } from "react";
import { cancelSubscriptionAction } from "../actions";

export function CancelSubscriptionDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);



    const onConfirm = async () => {
        setIsLoading(true);
        try {
            await cancelSubscriptionAction();
            setIsOpen(false);
            // Optionally toast success
            alert("구독이 취소되었습니다. 다음 결제일까지 이용 가능합니다.");
        } catch (error) {
            console.error(error);
            alert("취소 중 오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex-1 bg-white dark:bg-surface-dark border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium py-2.5 px-4 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
                구독 취소
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
                <h3 className="text-lg font-bold text-gray-900 mb-2">구독을 취소하시겠습니까?</h3>
                <p className="text-gray-600 mb-6 text-sm">
                    구독을 취소하더라도 <strong>다음 결제일 전까지는 서비스를 계속 이용하실 수 있습니다.</strong><br />
                    이후에는 자동 결제가 진행되지 않으며 서비스 이용이 제한됩니다.
                </p>

                <div className="flex justify-end gap-3 hover:bg-black/50">
                    <button
                        onClick={() => setIsOpen(false)}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                        돌아가기
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? '취소 처리 중...' : '네, 구독 취소합니다'}
                    </button>
                </div>
            </div>
        </div>
    );
}
