'use client'

import { useTransition } from 'react'
import { login } from './actions'

export default function LoginForm() {
    const [isPending, startTransition] = useTransition()

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            const result = await login(formData)
            if (result?.error) {
                alert(result.error) // Simple alert for now
            }
        })
    }

    return (
        <form action={handleSubmit} className="flex flex-col gap-5 animate-fade-in" >
            {/* Email Input */}
            <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-900 dark:text-white" htmlFor="email">
                    이메일
                </label>
                <div className="relative">
                    <input
                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white h-12 px-4 shadow-sm focus:border-primary focus:ring-primary placeholder:text-gray-400 text-sm transition-all"
                        id="email"
                        name="email"
                        placeholder="example@email.com"
                        type="email"
                        required
                    />
                </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-900 dark:text-white" htmlFor="password">
                    비밀번호
                </label>
                <div className="relative">
                    <input
                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white h-12 pl-4 pr-10 shadow-sm focus:border-primary focus:ring-primary placeholder:text-gray-400 text-sm transition-all"
                        id="password"
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

            {/* Actions Row */}
            <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                        className="rounded border-gray-300 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                        type="checkbox"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
                        로그인 상태 유지
                    </span>
                </label>
                <a
                    className="text-sm font-medium text-primary hover:text-primary-dark hover:underline"
                    href="#"
                >
                    비밀번호를 잊으셨나요?
                </a>
            </div>

            {/* Submit Button */}
            <button
                className="w-full h-12 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={isPending}
            >
                {isPending ? '로그인 중...' : '로그인'}
            </button>
        </form>
    )
}
