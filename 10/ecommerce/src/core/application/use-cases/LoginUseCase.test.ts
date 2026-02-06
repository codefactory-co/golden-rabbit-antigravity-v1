import { describe, it, expect, vi } from 'vitest';
import { LoginUseCase } from './LoginUseCase';
import { IAuthRepository } from '../interfaces/IAuthRepository';
import { User } from '@/core/domain/entities/User';
import { AuthError } from '@/core/domain/errors/AuthError';

describe('LoginUseCase', () => {
    it('should return a User when login is successful', async () => {
        // Arrange
        const mockRepo: IAuthRepository = {
            login: vi.fn().mockResolvedValue(new User('1', 'test@example.com', 'Test User', 'customer', false, new Date())),
        };
        const useCase = new LoginUseCase(mockRepo);
        const dto = { email: 'test@example.com', password: 'password123' };

        // Act
        const result = await useCase.execute(dto);

        // Assert
        expect(result).toBeInstanceOf(User);
        expect(result.id).toBe('1');
        expect(result.email).toBe('test@example.com');
    });

    it('should throw AuthError when login fails', async () => {
        // Arrange
        const mockRepo: IAuthRepository = {
            login: vi.fn().mockRejectedValue(new AuthError('Invalid credentials')),
        };
        const useCase = new LoginUseCase(mockRepo);
        const dto = { email: 'wrong@example.com', password: 'wrong' };

        // Act & Assert
        await expect(useCase.execute(dto)).rejects.toThrow(AuthError);
    });
});
