import { describe, it, expect, vi } from 'vitest';
import { GetNotesUseCase } from './GetNotesUseCase';
import { INoteRepository } from '../../interfaces/INoteRepository';
import { Note } from '../../../domain/entities/Note';
import { ISubscriptionRepository } from '../../interfaces/ISubscriptionRepository';
import { Subscription } from '../../../domain/entities/Subscription';

describe('GetNotesUseCase', () => {
    it('should return notes even if subscription is not active (Free tier access)', async () => {
        const mockRepo = {
            getNotes: vi.fn(),
        } as unknown as INoteRepository;

        const mockSubscriptionRepo = {
            getSubscription: vi.fn(),
        } as unknown as ISubscriptionRepository;

        const userId = 'user-1';
        const expectedNotes: Note[] = [{ id: '1', title: 'Test' } as Note];

        // Mock inactive subscription
        vi.mocked(mockSubscriptionRepo.getSubscription).mockResolvedValue({
            status: 'Inactive',
        } as Subscription);

        vi.mocked(mockRepo.getNotes).mockResolvedValue(expectedNotes);

        const useCase = new GetNotesUseCase(mockRepo, mockSubscriptionRepo);
        const result = await useCase.execute(userId);

        expect(result).toBe(expectedNotes);
        expect(mockRepo.getNotes).toHaveBeenCalledWith(userId);
    });
});
