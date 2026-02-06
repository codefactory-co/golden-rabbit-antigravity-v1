import { ExecuteBillingPaymentUseCase } from './ExecuteBillingPaymentUseCase';
import { IPaymentGateway } from '@/src/core/application/interfaces/IPaymentGateway';
import { ISubscriptionRepository } from '@/src/core/application/interfaces/ISubscriptionRepository';
import { IPaymentRepository } from '@/src/core/application/interfaces/IPaymentRepository';
import { describe, it, expect, beforeEach, vi, Mocked } from 'vitest';

describe('ExecuteBillingPaymentUseCase', () => {
    let useCase: ExecuteBillingPaymentUseCase;
    let paymentGateway: Mocked<IPaymentGateway>;
    let subscriptionRepository: Mocked<ISubscriptionRepository>;
    let paymentRepository: Mocked<IPaymentRepository>;

    beforeEach(() => {
        paymentGateway = {
            confirmPayment: vi.fn(),
            issueBillingKey: vi.fn(),
            executeBillingPayment: vi.fn(),
        } as unknown as Mocked<IPaymentGateway>;

        subscriptionRepository = {
            getSubscription: vi.fn(),
            upsertSubscription: vi.fn(),
        } as unknown as Mocked<ISubscriptionRepository>;

        paymentRepository = {
            savePayment: vi.fn(),
            createPayment: vi.fn(),
            updateStatus: vi.fn(),
            updatePayment: vi.fn(),
        } as unknown as Mocked<IPaymentRepository>;

        useCase = new ExecuteBillingPaymentUseCase(paymentGateway, subscriptionRepository, paymentRepository);
    });

    it('should charge the user and update billing date', async () => {
        // Arrange
        const userId = 'user_123';
        const billingKey = 'billing_key_abc';
        const subscription = {
            planName: 'Pro',
            status: 'Active',
            amount: 9900,
            billingKey: billingKey,
            nextBillingDate: new Date('2024-01-01'),
            paymentMethod: { brand: 'Toss', last4: '1234' }
        };

        subscriptionRepository.getSubscription.mockResolvedValue(subscription as any);
        paymentGateway.executeBillingPayment.mockResolvedValue({
            paymentKey: 'pay_123',
            orderId: 'order_123',
            amount: 9900,
            status: 'DONE',
            approvedAt: new Date().toISOString()
        });

        // Act
        await useCase.execute(userId);

        // Assert
        expect(paymentGateway.executeBillingPayment).toHaveBeenCalledWith(billingKey, expect.objectContaining({
            amount: 9900,
            customerKey: userId
        }));

        expect(subscriptionRepository.upsertSubscription).toHaveBeenCalledWith(
            userId,
            expect.objectContaining({
                nextBillingDate: expect.any(Date)
            })
        );

        expect(paymentRepository.savePayment).toHaveBeenCalled();
    });
});
