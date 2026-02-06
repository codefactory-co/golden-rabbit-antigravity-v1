import { describe, it, expect, vi } from 'vitest';
import { GetNoteByIdUseCase } from './GetNoteByIdUseCase';
import { INoteRepository } from '../../interfaces/INoteRepository';
import { ISubscriptionRepository } from '../../interfaces/ISubscriptionRepository';
import { Note } from '../../../domain/entities/Note';

describe('GetNoteByIdUseCase', () => {
    it('should return note from repository', async () => {
        const mockRepo = {
            getNoteById: vi.fn(),
        } as unknown as INoteRepository;

        const mockSubscriptionRepo = {
            getSubscription: vi.fn(),
        } as unknown as ISubscriptionRepository;

        const id = '123';
        const userId = 'user-1';
        const expectedNote = { id, title: 'Test' } as Note;

        vi.mocked(mockRepo.getNoteById).mockResolvedValue(expectedNote);

        // Setup successful active subscription
        vi.mocked(mockSubscriptionRepo.getSubscription).mockResolvedValue({
            userId: userId,
            planName: 'Pro',
            status: 'Active',
            nextBillingDate: new Date(),
            amount: 1000,
            billingKey: undefined,
            paymentMethod: {
                brand: 'test',
                last4: '1234'
            }
        });

        const useCase = new GetNoteByIdUseCase(mockRepo, mockSubscriptionRepo);
        const result = await useCase.execute(id, userId);

        expect(result).toBe(expectedNote);
        expect(mockRepo.getNoteById).toHaveBeenCalledWith(id);
    });
});
