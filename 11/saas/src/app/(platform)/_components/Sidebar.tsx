"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

export function Sidebar() {
    const pathname = usePathname();

    const getLinkClass = (href: string) => {
        const isActive = pathname === href;
        const baseClass = "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors";
        const activeClass = "bg-primary/10 text-primary font-medium";
        const inactiveClass = "text-[#617589] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[#111418] dark:hover:text-white";

        return `${baseClass} ${isActive ? activeClass : inactiveClass}`;
    };

    return (
        <aside className="hidden md:flex w-64 flex-col bg-white dark:bg-surface-dark border-r border-[#f0f2f4] dark:border-gray-800 h-full">
            <div className="flex items-center gap-3 px-6 h-16 border-b border-[#f0f2f4] dark:border-gray-800">
                <div className="size-8 text-primary flex items-center justify-center bg-primary/10 rounded-lg">
                    <span className="material-symbols-outlined text-[24px]">cloud</span>
                </div>
                <h1 className="text-xl font-bold tracking-tight text-[#111418] dark:text-white">
                    CloudNote
                </h1>
            </div>
            <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
                <Link
                    className={getLinkClass("/dashboard")}
                    href="/dashboard"
                >
                    <span className="material-symbols-outlined text-[22px]">home</span>
                    <span className="text-sm font-medium">홈</span>
                </Link>
                <Link
                    className={getLinkClass("/notes")}
                    href="/notes"
                >
                    <span className="material-symbols-outlined text-[22px]">
                        description
                    </span>
                    <span className="text-sm font-medium">내 메모</span>
                </Link>
                <Link
                    className={getLinkClass("/settings")}
                    href="#"
                >
                    <span className="material-symbols-outlined text-[22px]">
                        settings
                    </span>
                    <span className="text-sm font-medium">설정</span>
                </Link>
                <div className="my-2 border-t border-[#f0f2f4] dark:border-gray-800 mx-3"></div>
                <Link
                    className={getLinkClass("/subscription")}
                    href="#"
                >
                    <span className="material-symbols-outlined text-[22px] fill-1">
                        credit_card
                    </span>
                    <span className="text-sm font-medium">구독 관리</span>
                </Link>
            </nav>
            <div className="p-4 border-t border-[#f0f2f4] dark:border-gray-800">
                <Link
                    className="flex items-center gap-2 text-sm text-[#617589] dark:text-gray-400 hover:text-primary transition-colors justify-center"
                    href="#"
                >
                    <span className="material-symbols-outlined text-[18px]">
                        headset_mic
                    </span>
                    <span>고객센터 문의</span>
                </Link>
            </div>
        </aside>
    );
}
