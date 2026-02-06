import Link from "next/link";
import React from "react";
import { Icon } from "./Icon";

export function Footer() {
    return (
        <footer className="border-t border-slate-100 bg-white py-12 dark:bg-background-dark dark:border-gray-800">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 text-center sm:px-6 lg:flex-row lg:px-8 lg:text-left">
                <div className="flex items-center gap-2">
                    <Icon name="cloud" size={24} className="text-slate-400" />
                    <span className="text-sm text-slate-500 dark:text-gray-400">© CloudNote</span>
                </div>
                <div className="flex flex-wrap justify-center gap-8">
                    <Link
                        href="#"
                        className="text-sm font-medium text-slate-500 hover:text-primary transition-colors dark:text-gray-400"
                    >
                        이용약관
                    </Link>
                    <Link
                        href="#"
                        className="text-sm font-medium text-slate-500 hover:text-primary transition-colors dark:text-gray-400"
                    >
                        개인정보처리방침
                    </Link>
                </div>
            </div>
        </footer>
    );
}
