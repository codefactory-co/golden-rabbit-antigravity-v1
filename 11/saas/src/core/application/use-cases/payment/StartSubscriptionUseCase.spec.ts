import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StartSubscriptionUseCase } from './StartSubscriptionUseCase';
import { RegisterBillingKeyUseCase } from './RegisterBillingKeyUseCase';
import { ExecuteBillingPaymentUseCase } from './ExecuteBillingPaymentUseCase';

describe('StartSubscriptionUseCase', () => {
    let startSubscriptionUseCase: StartSubscriptionUseCase;
    let mockRegisterBillingKeyUseCase: RegisterBillingKeyUseCase;
    let mockExecuteBillingPaymentUseCase: ExecuteBillingPaymentUseCase;

    beforeEach(() => {
        // Mock dependencies
        mockRegisterBillingKeyUseCase = {
            execute: vi.fn(),
        } as unknown as RegisterBillingKeyUseCase;

        mockExecuteBillingPaymentUseCase = {
            execute: vi.fn(),
        } as unknown as ExecuteBillingPaymentUseCase;

        startSubscriptionUseCase = new StartSubscriptionUseCase(
            mockRegisterBillingKeyUseCase,
            mockExecuteBillingPaymentUseCase
        );
    });

    it('should register billing key and then execute payment', async () => {
        // Arrange
        const params = {
            authKey: 'test_auth_key',
            customerKey: 'test_customer_key',
        };

        // Act
        await startSubscriptionUseCase.execute(params);

        // Assert
        expect(mockRegisterBillingKeyUseCase.execute).toHaveBeenCalledWith({
            authKey: params.authKey,
            customerKey: params.customerKey,
        });

        // Ensure executeBillingPayment is called AFTER registerBillingKey
        expect(mockExecuteBillingPaymentUseCase.execute).toHaveBeenCalledWith(params.customerKey);

        expect(mockRegisterBillingKeyUseCase.execute).toHaveBeenCalledBefore(
            mockExecuteBillingPaymentUseCase.execute as any
        );
    });
});
