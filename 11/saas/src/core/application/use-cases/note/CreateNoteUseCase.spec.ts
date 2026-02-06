import { describe, it, expect, vi } from 'vitest';
import { CreateNoteUseCase } from './CreateNoteUseCase';
import { INoteRepository } from '../../interfaces/INoteRepository';
import { ISubscriptionRepository } from '../../interfaces/ISubscriptionRepository';
import { Subscription } from '../../../domain/entities/Subscription';

describe('CreateNoteUseCase', () => {
    it('should create note even if subscription is not active (Free tier access)', async () => {
        const mockRepo = {
            createNote: vi.fn(),
        } as unknown as INoteRepository;

        const mockSubscriptionRepo = {
            getSubscription: vi.fn(),
        } as unknown as ISubscriptionRepository;

        const input = { userId: '1', title: 'New', content: '', isFavorite: false, isDeleted: false };
        const expectedResult = { ...input, id: '123' } as any;

        vi.mocked(mockSubscriptionRepo.getSubscription).mockResolvedValue({
            status: 'Inactive',
        } as Subscription);

        vi.mocked(mockRepo.createNote).mockResolvedValue(expectedResult);

        const useCase = new CreateNoteUseCase(mockRepo, mockSubscriptionRepo);
        const result = await useCase.execute(input);

        expect(result).toBe(expectedResult);
        expect(mockRepo.createNote).toHaveBeenCalledWith(input);
    });
});
