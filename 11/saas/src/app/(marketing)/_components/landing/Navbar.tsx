import Link from "next/link";
import React from "react";

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur dark:bg-background-dark/95 dark:border-gray-800">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2">
                    <div className="text-primary flex items-center justify-center">
                        <span
                            className="material-symbols-outlined text-[32px] leading-none"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                            cloud
                        </span>
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                        CloudNote
                    </h2>
                </div>
                <Link
                    href="/auth"
                    className="rounded-lg bg-slate-100 px-5 py-2 text-sm font-bold text-slate-900 hover:bg-slate-200 transition-colors dark:bg-surface-dark dark:text-white dark:hover:bg-gray-800"
                >
                    로그인
                </Link>
            </div>
        </header>
    );
}
