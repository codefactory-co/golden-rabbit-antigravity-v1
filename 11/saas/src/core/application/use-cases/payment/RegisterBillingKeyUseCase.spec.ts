import { RegisterBillingKeyUseCase } from './RegisterBillingKeyUseCase';
import { IPaymentGateway } from '@/src/core/application/interfaces/IPaymentGateway';
import { ISubscriptionRepository } from '@/src/core/application/interfaces/ISubscriptionRepository';
import { Subscription } from '@/src/core/domain/entities/Subscription';
import { describe, it, expect, beforeEach, vi, Mocked } from 'vitest';

describe('RegisterBillingKeyUseCase', () => {
    let useCase: RegisterBillingKeyUseCase;
    let paymentGateway: Mocked<IPaymentGateway>;
    let subscriptionRepository: Mocked<ISubscriptionRepository>;

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

        useCase = new RegisterBillingKeyUseCase(paymentGateway, subscriptionRepository);
    });

    it('should issue a billing key and save it to the subscription', async () => {
        // Arrange
        const authKey = 'auth_key_123';
        const customerKey = 'user_123';
        const billingKey = 'billing_key_abc';
        const cardInfo = { company: 'Toss Card', number: '1234' };

        paymentGateway.issueBillingKey.mockResolvedValue({
            billingKey,
            card: cardInfo,
            authenticatedAt: new Date().toISOString(),
        });

        // Act
        await useCase.execute({ authKey, customerKey });

        // Assert
        expect(paymentGateway.issueBillingKey).toHaveBeenCalledWith(authKey, customerKey);
        expect(subscriptionRepository.upsertSubscription).toHaveBeenCalledWith(
            customerKey,
            expect.objectContaining({
                billingKey: billingKey,
                paymentMethod: {
                    brand: cardInfo.company,
                    last4: cardInfo.number,
                }
            })
        );
    });
});
