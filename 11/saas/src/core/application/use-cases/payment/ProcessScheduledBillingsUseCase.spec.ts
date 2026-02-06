import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProcessScheduledBillingsUseCase } from './ProcessScheduledBillingsUseCase';
import { ISubscriptionRepository } from '../../interfaces/ISubscriptionRepository';
import { ExecuteBillingPaymentUseCase } from './ExecuteBillingPaymentUseCase';
import { Subscription } from '@/src/core/domain/entities/Subscription';

describe('ProcessScheduledBillingsUseCase', () => {
    let useCase: ProcessScheduledBillingsUseCase;
    let mockSubscriptionRepository: ISubscriptionRepository;
    let mockExecuteBillingPaymentUseCase: ExecuteBillingPaymentUseCase;

    beforeEach(() => {
        mockSubscriptionRepository = {
            findDueSubscriptions: vi.fn(),
            getSubscription: vi.fn(),
            upsertSubscription: vi.fn(),
        } as unknown as ISubscriptionRepository;

        mockExecuteBillingPaymentUseCase = {
            execute: vi.fn(),
        } as unknown as ExecuteBillingPaymentUseCase;

        useCase = new ProcessScheduledBillingsUseCase(
            mockSubscriptionRepository,
            mockExecuteBillingPaymentUseCase
        );
    });

    it('should find due subscriptions and execute payment for each', async () => {
        // Arrange
        const dueSubscriptions: Subscription[] = [
            {
                userId: 'user1',
                planName: 'Pro',
                status: 'Active',
                nextBillingDate: new Date('2023-01-01'), // Past date
                amount: 9900,
                billingKey: 'billingKey1',
                paymentMethod: { brand: 'Visa', last4: '1234' }
            },
            {
                userId: 'user2',
                planName: 'Enterprise',
                status: 'Active',
                nextBillingDate: new Date('2023-01-02'), // Past date
                amount: 29900,
                billingKey: 'billingKey2',
                paymentMethod: { brand: 'Master', last4: '5678' }
            }
        ];

        vi.spyOn(mockSubscriptionRepository, 'findDueSubscriptions').mockResolvedValue(dueSubscriptions);

        // Act
        await useCase.execute();

        // Assert
        expect(mockSubscriptionRepository.findDueSubscriptions).toHaveBeenCalled();
        expect(mockExecuteBillingPaymentUseCase.execute).toHaveBeenCalledTimes(2);
        expect(mockExecuteBillingPaymentUseCase.execute).toHaveBeenCalledWith('user1');
        expect(mockExecuteBillingPaymentUseCase.execute).toHaveBeenCalledWith('user2');
    });

    it('should handle errors for individual payments gracefully', async () => {
        // Arrange
        const dueSubscriptions: Subscription[] = [
            {
                userId: 'user1',
                planName: 'Pro',
                status: 'Active',
                nextBillingDate: new Date('2023-01-01'),
                amount: 9900,
                billingKey: 'billingKey1',
                paymentMethod: { brand: 'Visa', last4: '1234' }
            },
            {
                userId: 'user2',
                planName: 'Pro',
                status: 'Active',
                nextBillingDate: new Date('2023-01-01'),
                amount: 9900,
                billingKey: 'billingKey2',
                paymentMethod: { brand: 'Visa', last4: '5678' }
            }
        ];

        vi.spyOn(mockSubscriptionRepository, 'findDueSubscriptions').mockResolvedValue(dueSubscriptions);

        // Mock first payment failure
        vi.spyOn(mockExecuteBillingPaymentUseCase, 'execute').mockImplementationOnce(() => Promise.reject(new Error('Payment Failed')));
        // Mock second payment success
        vi.spyOn(mockExecuteBillingPaymentUseCase, 'execute').mockImplementationOnce(() => Promise.resolve());

        // Act
        const results = await useCase.execute();

        // Assert
        expect(mockExecuteBillingPaymentUseCase.execute).toHaveBeenCalledTimes(2);
        expect(results.successCount).toBe(1);
        expect(results.failureCount).toBe(1);
    });
});
