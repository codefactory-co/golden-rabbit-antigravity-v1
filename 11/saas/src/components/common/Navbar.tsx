"use client";

import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { Icon } from "./Icon";
import { Button } from "./Button";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface NavbarProps {
    user?: User | null;
    planName?: string | null;
}

export function Navbar({ user, planName }: NavbarProps) {
    const router = useRouter();
    const supabase = createClient();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    const handleLogout = async () => {
        setIsDropdownOpen(false);
        await supabase.auth.signOut();
        // Force full page reload to clear server state and client caches
        window.location.href = "/";
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur dark:bg-background-dark/95 dark:border-gray-800">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="text-primary flex items-center justify-center">
                        <Icon
                            name="cloud"
                            size={32}
                            fill
                            className="leading-none group-hover:scale-105 transition-transform"
                        />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                        CloudNote
                    </h2>
                </Link>
                {user ? (
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard">
                            <Button variant="primary">
                                대시보드
                            </Button>
                        </Link>
                        {/* User Profile - Dropdown Menu */}
                        <div className="relative flex items-center gap-3 border-l border-gray-200 dark:border-gray-700 pl-4" ref={dropdownRef}>
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-[#111418] dark:text-white">
                                    {user.email}
                                </p>
                                <p className="text-xs text-[#617589] dark:text-gray-400">
                                    {planName === 'Pro' ? 'Pro 회원' : planName === 'Enterprise' ? 'Enterprise 회원' : '무료 회원'}
                                </p>
                            </div>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2 rounded-full pl-1 pr-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                <div
                                    className="size-8 rounded-full bg-cover bg-center border border-gray-200 dark:border-gray-700 bg-gray-200"
                                    data-alt="사용자 프로필 이미지"
                                ></div>
                                <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 text-[20px]">
                                    {isDropdownOpen ? 'expand_less' : 'expand_more'}
                                </span>
                            </button>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden z-50">
                                    <ul className="py-2">
                                        <li>
                                            <Link
                                                href="/dashboard"
                                                onClick={() => setIsDropdownOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#111418] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-[20px] text-gray-500">
                                                    dashboard
                                                </span>
                                                <span>대시보드</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href="/dashboard"
                                                onClick={() => setIsDropdownOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#111418] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-[20px] text-gray-500">
                                                    person
                                                </span>
                                                <span>프로필 설정</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href="/payment"
                                                onClick={() => setIsDropdownOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#111418] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-[20px] text-gray-500">
                                                    credit_card
                                                </span>
                                                <span>구독 관리</span>
                                            </Link>
                                        </li>
                                        <li className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors w-full text-left"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">
                                                    logout
                                                </span>
                                                <span>로그아웃</span>
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <Link href="/auth">
                        <Button variant="secondary">
                            로그인
                        </Button>
                    </Link>
                )}
            </div>
        </header>
    );
}
