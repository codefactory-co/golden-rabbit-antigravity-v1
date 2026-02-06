import React from "react";
import { UsageStats } from "@/src/core/domain/entities/UsageStats";

interface UsageCardProps {
    usage: UsageStats | null;
}

export function UsageCard({ usage }: UsageCardProps) {
    // Mock defaults
    const noteCount = usage?.noteCount || 0;
    const maxNoteCount = usage?.maxNoteCount === -1 ? "무제한" : usage?.maxNoteCount || 100;

    // Storage
    const storageUsedBytes = usage?.storageUsed || 0;
    const storageLimitBytes = usage?.storageLimit || 0;

    const bytesToGB = (bytes: number) => (bytes / (1024 * 1024 * 1024)).toFixed(1);
    const storageUsedGB = bytesToGB(storageUsedBytes);
    const storageLimitGB = usage?.storageLimit === -1 ? "무제한" : bytesToGB(storageLimitBytes);
    const storagePercent = usage?.storageLimit && usage.storageLimit > 0
        ? Math.round((storageUsedBytes / usage.storageLimit) * 100)
        : 0;

    // AI Summary
    const aiCount = usage?.aiSummaryCount || 0;
    const maxAiCount = usage?.maxAiSummaryCount || 0;
    const aiPercent = maxAiCount > 0 ? Math.round((aiCount / maxAiCount) * 100) : 0;

    // Note Percent (if not unlimited)
    const notePercent = typeof maxNoteCount === 'number' && maxNoteCount > 0
        ? Math.round((noteCount / maxNoteCount) * 100)
        : 15; // Just a visual filler for unlimited

    return (
        <div className="bg-white dark:bg-surface-dark rounded-xl border border-[#f0f2f4] dark:border-gray-800 shadow-sm flex flex-col h-full">
            <div className="p-6 border-b border-[#f0f2f4] dark:border-gray-800">
                <h3 className="font-bold text-lg">이번 달 사용량</h3>
            </div>
            <div className="p-6 flex flex-col justify-center flex-1 gap-8">
                {/* Usage Item 1: Note Count */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-gray-400 text-[18px]">
                                description
                            </span>
                            <span className="font-medium text-[#111418] dark:text-gray-200">
                                메모 개수
                            </span>
                        </div>
                        <span className="text-[#617589] dark:text-gray-400">
                            {noteCount} / {maxNoteCount}
                        </span>
                    </div>
                    <div className="h-2.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${notePercent}%` }}
                        ></div>
                    </div>
                </div>
                {/* Usage Item 2: Storage */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-gray-400 text-[18px]">
                                cloud_queue
                            </span>
                            <span className="font-medium text-[#111418] dark:text-gray-200">
                                저장공간
                            </span>
                        </div>
                        <span className="text-[#617589] dark:text-gray-400">
                            {storageUsedGB}GB / {storageLimitGB}GB ({storagePercent}%)
                        </span>
                    </div>
                    <div className="h-2.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${storagePercent}%` }}
                        ></div>
                    </div>
                </div>
                {/* Usage Item 3: AI Summary */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-gray-400 text-[18px]">
                                auto_awesome
                            </span>
                            <span className="font-medium text-[#111418] dark:text-gray-200">
                                AI 요약
                            </span>
                        </div>
                        <span className="text-[#617589] dark:text-gray-400">
                            {aiCount}회 / {maxAiCount}회 ({aiPercent}%)
                        </span>
                    </div>
                    <div className="h-2.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${aiPercent}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
