import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProcessPaymentSuccessUseCase } from "./ProcessPaymentSuccessUseCase";
import { IPaymentGateway } from "../../interfaces/IPaymentGateway";
import { ISubscriptionRepository } from "../../interfaces/ISubscriptionRepository";
import { IPaymentRepository } from "../../interfaces/IPaymentRepository";

describe("ProcessPaymentSuccessUseCase", () => {
    let useCase: ProcessPaymentSuccessUseCase;
    let paymentGateway: IPaymentGateway;
    let subscriptionRepository: ISubscriptionRepository;
    let paymentRepository: IPaymentRepository;

    beforeEach(() => {
        paymentGateway = {
            confirmPayment: vi.fn(),
        } as unknown as IPaymentGateway;

        subscriptionRepository = {
            upsertSubscription: vi.fn(),
        } as unknown as ISubscriptionRepository;

        paymentRepository = {
            savePayment: vi.fn(),
            createPayment: vi.fn(),
            updateStatus: vi.fn(),
            updatePayment: vi.fn(), // New method we expect for success update
        } as unknown as IPaymentRepository;

        useCase = new ProcessPaymentSuccessUseCase(
            paymentGateway,
            subscriptionRepository,
            paymentRepository
        );
    });

    it("should update payment record to 'succeeded' and save details", async () => {
        const userId = "user-123";
        const paymentKey = "pk_test_123";
        const orderId = "order-123";
        const amount = 9900;

        // Mock gateway success
        vi.mocked(paymentGateway.confirmPayment).mockResolvedValue({
            status: "DONE",
            method: "카드",
            amount: amount,
            paymentKey: paymentKey,
            approvedAt: new Date("2024-01-01T00:00:00Z"),
        } as any);

        await useCase.execute(userId, paymentKey, orderId, amount);

        // Expect updatePayment to be called instead of savePayment
        expect(paymentRepository.updatePayment).toHaveBeenCalledWith(expect.objectContaining({
            orderId: orderId,
            status: "succeeded",
            providerPaymentId: paymentKey,
            // approvedAt check
        }));
    });
});
