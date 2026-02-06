'use client'

import { useTransition } from 'react'
import { signup } from './actions'

export default function SignupForm() {
    const [isPending, startTransition] = useTransition()

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            const result = await signup(formData)
            if (result?.error) {
                alert(result.error)
            } else if (result?.success) {
                alert(result.success)
            }
        })
    }

    return (
        <form action={handleSubmit} className="flex flex-col gap-5 animate-fade-in">
            {/* Name Input (Optional for MVP but good to have) */}
            <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-900 dark:text-white" htmlFor="name">
                    이름 (선택)
                </label>
                <div className="relative">
                    <input
                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white h-12 px-4 shadow-sm focus:border-primary focus:ring-primary placeholder:text-gray-400 text-sm transition-all"
                        id="name"
                        name="name"
                        placeholder="홍길동"
                        type="text"
                    />
                </div>
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-900 dark:text-white" htmlFor="signup-email">
                    이메일
                </label>
                <div className="relative">
                    <input
                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white h-12 px-4 shadow-sm focus:border-primary focus:ring-primary placeholder:text-gray-400 text-sm transition-all"
                        id="signup-email"
                        name="email"
                        placeholder="example@email.com"
                        type="email"
                        required
                    />
                </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-900 dark:text-white" htmlFor="signup-password">
                    비밀번호
                </label>
                <div className="relative">
                    <input
                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white h-12 pl-4 pr-10 shadow-sm focus:border-primary focus:ring-primary placeholder:text-gray-400 text-sm transition-all"
                        id="signup-password"
                        name="password"
                        placeholder="비밀번호를 입력하세요"
                        type="password"
                        required
                    />
                    <button
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                        type="button"
                    >
                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                    </button>
                </div>
            </div>

            {/* Submit Button */}
            <button
                className="w-full h-12 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                disabled={isPending}
            >
                {isPending ? '가입 중...' : '회원가입'}
            </button>
        </form>
    )
}
