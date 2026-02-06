
"use client";

import { useState } from "react";
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { signIn, signUp } from "@/app/actions";

export default function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);

    async function clientAction(formData: FormData) {
        setIsLoading(true);
        setError(null);
        setConfirmationMessage(null);

        try {
            if (isLogin) {
                const result = await signIn(formData);
                if (result?.error) {
                    setError(result.error);
                }
            } else {
                const result = await signUp(formData);
                if (result?.error) {
                    setError(result.error);
                } else if (result?.message) {
                    setConfirmationMessage(result.message);
                }
            }
        } catch (e) {
            setError("알 수 없는 오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full max-w-[400px] bg-[var(--card-bg)] p-8 rounded-2xl shadow-xl border border-slate-700/50">
            {/* Tab Switcher */}
            <div className="flex bg-[#0f172a]/50 p-1 rounded-lg mb-8">
                <button
                    type="button"
                    onClick={() => { setIsLogin(true); setError(null); }}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${isLogin ? 'bg-[var(--card-bg)] text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                >
                    로그인
                </button>
                <button
                    type="button"
                    onClick={() => { setIsLogin(false); setError(null); }}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!isLogin ? 'bg-[var(--card-bg)] text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                >
                    회원가입
                </button>
            </div>

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">
                    {isLogin ? "환영합니다" : "계정 만들기"}
                </h1>
                <p className="text-slate-400 text-sm">
                    {isLogin
                        ? "계정에 로그인하여 계속하세요"
                        : "새 계정을 만들어 보세요"}
                </p>
            </div>

            <form action={clientAction} className="space-y-5">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">이메일</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                        <input
                            name="email"
                            type="email"
                            required
                            placeholder="name@example.com"
                            className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg pl-10 pr-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all border-slate-600"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-slate-300">비밀번호</label>
                        {isLogin && (
                            <button type="button" className="text-xs text-blue-400 hover:text-blue-300">
                                비밀번호를 잊으셨나요?
                            </button>
                        )}
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            required
                            placeholder="••••••••"
                            className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg pl-10 pr-10 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all border-slate-600"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg">
                        {error}
                    </div>
                )}

                {confirmationMessage && (
                    <div className="p-3 text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg">
                        {confirmationMessage}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg shadow-lg shadow-blue-500/20 transition-all flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? "로그인" : "회원가입")}
                </button>
            </form>

            <p className="mt-6 text-xs text-center text-slate-500">
                계속 진행하면 <a href="#" className="underline hover:text-slate-400">이용약관</a> 및 <a href="#" className="underline hover:text-slate-400">개인정보 처리방침</a>에 동의하는 것으로 간주됩니다.
            </p>
        </div>
    );
}

