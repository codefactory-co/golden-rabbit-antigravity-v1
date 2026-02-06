import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CancelSubscriptionUseCase } from './CancelSubscriptionUseCase';
import { ISubscriptionRepository } from '../../interfaces/ISubscriptionRepository';
import { Subscription } from '@/src/core/domain/entities/Subscription';

describe('CancelSubscriptionUseCase', () => {
    let useCase: CancelSubscriptionUseCase;
    let mockSubscriptionRepository: ISubscriptionRepository;

    beforeEach(() => {
        mockSubscriptionRepository = {
            getSubscription: vi.fn(),
            upsertSubscription: vi.fn(),
            findDueSubscriptions: vi.fn(),
        } as unknown as ISubscriptionRepository;

        useCase = new CancelSubscriptionUseCase(mockSubscriptionRepository);
    });

    it('should cancel active subscription by removing billing key and updating status', async () => {
        // Arrange
        const userId = 'user-123';
        const nextBillingDate = new Date('2025-01-01');
        const activeSubscription: Subscription = {
            userId,
            planName: 'Pro',
            status: 'Active',
            nextBillingDate,
            amount: 9900,
            billingKey: 'billing-key-123',
            paymentMethod: { brand: 'Visa', last4: '1234' }
        };

        vi.spyOn(mockSubscriptionRepository, 'getSubscription').mockResolvedValue(activeSubscription);

        // Act
        await useCase.execute(userId);

        // Assert
        expect(mockSubscriptionRepository.getSubscription).toHaveBeenCalledWith(userId);
        expect(mockSubscriptionRepository.upsertSubscription).toHaveBeenCalledWith(userId, {
            ...activeSubscription,
            status: 'Canceled',
            billingKey: undefined, // Or null? The Upsert usually handles undefined as removing?
            // Wait, standard upsert usually replaces fields. If I pass undefined, it might be undefined in the object passed to DB.
            // But we need to CLEAR the billing key in DB (set to NULL).
            // Subscription entity has `billingKey?: string`.
            // Implementation detail: UseCase sets it to undefined (or empty string/null).
            // Let's assume undefined equates to NULL mapping in Repo.
        });

        // Verify nextBillingDate is unchanged
        const upsertCall = vi.mocked(mockSubscriptionRepository.upsertSubscription).mock.calls[0];
        const passedSubscription = upsertCall[1];
        expect(passedSubscription.nextBillingDate).toEqual(nextBillingDate);
        expect(passedSubscription.status).toBe('Canceled');
        expect(passedSubscription.billingKey).toBeUndefined();
    });

    it('should throw error if subscription not found', async () => {
        // Arrange
        vi.spyOn(mockSubscriptionRepository, 'getSubscription').mockResolvedValue(null);

        // Act & Assert
        await expect(useCase.execute('user-not-found')).rejects.toThrow('Subscription not found');
    });
});
