import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProcessPaymentFailureUseCase } from "./ProcessPaymentFailureUseCase";
import { IPaymentRepository } from "../../interfaces/IPaymentRepository";

describe("ProcessPaymentFailureUseCase", () => {
    let useCase: ProcessPaymentFailureUseCase;
    let paymentRepository: IPaymentRepository;

    beforeEach(() => {
        paymentRepository = {
            savePayment: vi.fn(),
            createPayment: vi.fn(),
            updateStatus: vi.fn(), // New method we expect
        } as unknown as IPaymentRepository;

        useCase = new ProcessPaymentFailureUseCase(paymentRepository);
    });

    it("should update payment status to 'failed' with reason", async () => {
        const orderId = "order-fail-123";
        const reason = "Insuficient balance";

        await useCase.execute(orderId, reason);

        expect(paymentRepository.updateStatus).toHaveBeenCalledWith(orderId, "failed", reason);
    });
});
