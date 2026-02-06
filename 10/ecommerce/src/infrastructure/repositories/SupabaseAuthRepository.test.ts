import { describe, it, expect, vi } from 'vitest';
import { SupabaseAuthRepository } from './SupabaseAuthRepository';
import { SupabaseClient } from '@supabase/supabase-js';
import { AuthError } from '@/core/domain/errors/AuthError';

// Mock Supabase Client
const mockSupabase = {
    auth: {
        signInWithPassword: vi.fn(),
    },
} as unknown as SupabaseClient;

describe('SupabaseAuthRepository', () => {
    it('should return User on successful login', async () => {
        // Arrange
        const repo = new SupabaseAuthRepository(mockSupabase);
        const dto = { email: 'test@example.com', password: 'password' };

        // Mock successful response
        const mockResponse = {
            data: {
                user: {
                    id: 'user-123',
                    email: 'test@example.com',
                },
            },
            error: null,
        };
        (mockSupabase.auth.signInWithPassword as any).mockResolvedValue(mockResponse);

        // Act
        const result = await repo.login(dto);

        // Assert
        expect(result.id).toBe('user-123');
        expect(result.email).toBe('test@example.com');
    });

    it('should throw AuthError on login failure', async () => {
        // Arrange
        const repo = new SupabaseAuthRepository(mockSupabase);
        const dto = { email: 'test@example.com', password: 'wrong' };

        // Mock error response
        const mockResponse = {
            data: { user: null },
            error: { message: 'Invalid login credentials' },
        };
        (mockSupabase.auth.signInWithPassword as any).mockResolvedValue(mockResponse);

        // Act & Assert
        await expect(repo.login(dto)).rejects.toThrow(AuthError);
    });

    it('should throw AuthError on network error (null data/error or exception)', async () => {
        // Arrange
        const repo = new SupabaseAuthRepository(mockSupabase);
        const dto = { email: 'test@example.com', password: 'password' };

        // Mock network exception or weird state
        (mockSupabase.auth.signInWithPassword as any).mockRejectedValue(new Error('Network Error'));

        // Act & Assert
        await expect(repo.login(dto)).rejects.toThrow(AuthError);
    });
});
