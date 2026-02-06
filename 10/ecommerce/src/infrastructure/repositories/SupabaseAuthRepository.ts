import { SupabaseClient } from '@supabase/supabase-js';
import { IAuthRepository } from '@/core/application/interfaces/IAuthRepository';
import { LoginDTO } from '@/core/application/dtos/LoginDTO';
import { User } from '@/core/domain/entities/User';
import { AuthError } from '@/core/domain/errors/AuthError';

export class SupabaseAuthRepository implements IAuthRepository {
    constructor(private supabase: SupabaseClient) { }

    async login(dto: LoginDTO): Promise<User> {
        try {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email: dto.email,
                password: dto.password!,
            });

            if (error) {
                throw new AuthError(error.message);
            }

            if (!data.user || !data.user.email) {
                throw new AuthError('User data not found');
            }

            return new User(
                data.user.id,
                data.user.email,
                data.user.user_metadata?.name || data.user.email,
                'customer', // Default role for now, or fetch from DB if needed
                false, // Default isVip
                new Date(data.user.created_at)
            );
        } catch (error: any) {
            if (error instanceof AuthError) {
                throw error;
            }
            throw new AuthError(error.message || 'Authentication failed');
        }
    }
}
