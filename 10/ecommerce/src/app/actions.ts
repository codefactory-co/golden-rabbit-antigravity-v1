'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/infrastructure/config/supabase/server'
import { SupabaseAuthRepository } from '@/infrastructure/repositories/SupabaseAuthRepository'
import { LoginUseCase } from '@/core/application/use-cases/LoginUseCase'
import { LoginDTO } from '@/core/application/dtos/LoginDTO'
import { AuthError } from '@/core/domain/errors/AuthError'

export async function loginAction(prevState: any, formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // Simple validation
    if (!email || !password) {
        return { error: '이메일과 비밀번호를 입력해주세요' }
    }

    const dto: LoginDTO = { email, password }
    const supabase = await createClient()
    const authRepository = new SupabaseAuthRepository(supabase)
    const loginUseCase = new LoginUseCase(authRepository)

    try {
        await loginUseCase.execute(dto)
    } catch (error) {
        if (error instanceof AuthError) {
            // Map specific error messages
            // "이메일 또는 비밀번호가 올바르지 않습니다"
            // "서버에 연결할 수 없습니다. 다시 시도해주세요"
            const lowerMsg = error.message.toLowerCase();
            if (lowerMsg.includes('invalid login credentials') || lowerMsg.includes('invalid credentials')) {
                return { error: '이메일 또는 비밀번호가 올바르지 않습니다' }
            }
            if (lowerMsg.includes('network') || lowerMsg.includes('fetch') || lowerMsg.includes('connection')) {
                return { error: '서버에 연결할 수 없습니다. 다시 시도해주세요' }
            }
            // Default fallback
            return { error: '이메일 또는 비밀번호가 올바르지 않습니다' }
        }
        return { error: '서버 에러가 발생했습니다.' }
    }

    redirect('/dashboard')
}
