"use client";

import React from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface HeaderProps {
    user?: User | null;
    planName?: string | null;
}

export function Header({ user, planName }: HeaderProps) {
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        // Force full page reload to clear server state and client caches
        window.location.href = "/";
    };

    return (
        <header className="flex items-center justify-between h-16 px-6 bg-white dark:bg-surface-dark border-b border-[#f0f2f4] dark:border-gray-800 sticky top-0 z-10">
            {/* Mobile Menu Button (Hidden on desktop) */}
            <button className="md:hidden p-2 -ml-2 text-gray-600 dark:text-gray-300">
                <span className="material-symbols-outlined">menu</span>
            </button>
            {/* Spacer for desktop layout balance */}
            <div className="hidden md:block"></div>
            {/* User Profile */}
            <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-[#111418] dark:text-white">
                        {user?.email || "사용자"}
                    </p>
                    <p className="text-xs text-[#617589] dark:text-gray-400">
                        {planName === 'Pro' ? 'Pro 회원' : planName === 'Enterprise' ? 'Enterprise 회원' : '무료 회원'}
                    </p>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-full pl-1 pr-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                    <div
                        className="size-8 rounded-full bg-cover bg-center border border-gray-200 dark:border-gray-700 bg-gray-200"
                        data-alt="사용자 프로필 이미지"
                    ></div>
                    <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 text-[20px]">
                        logout
                    </span>
                </button>
            </div>
        </header>
    );
}
