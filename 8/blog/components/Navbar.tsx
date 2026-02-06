'use client';

import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import { Search } from 'lucide-react';
import { signOut } from '@/app/actions';

export default function Navbar({ user }: { user: User | null }) {
    return (
        <nav className="bg-[#0B1120] border-b border-gray-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between items-center gap-4">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <span className="text-xl font-bold text-white font-mono">
                                {`{ DevBlog }`}
                            </span>
                        </Link>

                        {/* Search Bar - Hidden on mobile, visible on medium+ */}
                        <div className="hidden md:flex relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-500" />
                            </div>
                            <input
                                type="text"
                                placeholder="게시글, 태그, 작성자 검색..."
                                className="bg-[#1E293B] text-sm text-gray-300 rounded-md py-1.5 pl-10 pr-4 w-64 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-[#253248] placeholder-gray-500 border border-transparent focus:border-blue-500/50 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-300 hidden sm:block">
                                    {user.email?.split('@')[0]}
                                </span>
                                <Link
                                    href="/write"
                                    className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                                >
                                    글쓰기
                                </Link>
                                <button
                                    onClick={() => signOut()}
                                    className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                                >
                                    로그아웃
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/auth"
                                    className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                                >
                                    로그인
                                </Link>
                                <Link
                                    href="/auth?view=signup"
                                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                                >
                                    회원가입
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
