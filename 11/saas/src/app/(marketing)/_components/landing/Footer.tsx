import React from "react";

export function Footer() {
    return (
        <footer className="border-t border-gray-100 bg-white py-12 dark:border-gray-800 dark:bg-[#0F172A]/50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                    <div className="flex items-center gap-2">
                        <span
                            className="material-symbols-outlined text-primary"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                            cloud
                        </span>
                        <span className="text-lg font-bold text-slate-900 dark:text-white">
                            CloudNote
                        </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-gray-400">
                        © 2024 CloudNote. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <a
                            href="#"
                            className="text-sm text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white"
                        >
                            이용약관
                        </a>
                        <a
                            href="#"
                            className="text-sm text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white"
                        >
                            개인정보처리방침
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
