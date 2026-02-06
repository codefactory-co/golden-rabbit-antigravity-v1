import React from "react";
import { ActivityLog } from "@/src/core/domain/entities/ActivityLog";

interface ActivityFeedProps {
    activities: ActivityLog[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
    return (
        <div className="lg:col-span-2 bg-white dark:bg-surface-dark rounded-xl border border-[#f0f2f4] dark:border-gray-800 shadow-sm">
            <div className="p-6 border-b border-[#f0f2f4] dark:border-gray-800 flex justify-between items-center">
                <h3 className="font-bold text-lg">최근 활동</h3>
                <button className="text-primary text-sm font-medium hover:underline">
                    전체 보기
                </button>
            </div>
            <div className="divide-y divide-[#f0f2f4] dark:divide-gray-800">
                {activities.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">최근 활동이 없습니다.</div>
                ) : (
                    activities.map((activity) => (
                        <div
                            key={activity.id}
                            className="p-4 flex items-start gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                            <div
                                className={`p-2 rounded-lg ${activity.colorClass}`}
                            >
                                <span className="material-symbols-outlined text-[20px]">
                                    {activity.icon}
                                </span>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-[#111418] dark:text-white">
                                    {activity.type === 'CREATE_NOTE' && `새 메모 작성: ${activity.description}`}
                                    {activity.type === 'USE_AI' && `AI 요약 생성`}
                                    {activity.type === 'CREATE_FOLDER' && `폴더 생성: ${activity.description}`}
                                    {activity.type === 'SHARE_NOTE' && `메모 공유: ${activity.description}`}
                                    {activity.type === 'LOGIN' && `로그인`}
                                </p>
                                <p className="text-xs text-[#617589] dark:text-gray-500 mt-0.5">
                                    {activity.metadata}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
