import { describe, it, expect, vi } from 'vitest';
import { DeleteNoteUseCase } from './DeleteNoteUseCase';
import { INoteRepository } from '../../interfaces/INoteRepository';
import { ISubscriptionRepository } from '../../interfaces/ISubscriptionRepository';

describe('DeleteNoteUseCase', () => {
    it('should delete note via repository', async () => {
        const mockRepo = {
            deleteNote: vi.fn(),
        } as unknown as INoteRepository;

        const mockSubscriptionRepo = {
            getSubscription: vi.fn(),
        } as unknown as ISubscriptionRepository;

        const id = '123';
        const userId = 'user-1';

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

        const useCase = new DeleteNoteUseCase(mockRepo, mockSubscriptionRepo);
        await useCase.execute(id, userId);

        expect(mockRepo.deleteNote).toHaveBeenCalledWith(id);
    });
});
