import { describe, it, expect, beforeEach, vi } from 'vitest';
import { InitiatePaymentUseCase } from "./InitiatePaymentUseCase";
import { IPaymentRepository } from "../../interfaces/IPaymentRepository";

describe("InitiatePaymentUseCase", () => {
    let useCase: InitiatePaymentUseCase;
    let paymentRepository: IPaymentRepository;

    beforeEach(() => {
        paymentRepository = {
            savePayment: vi.fn(),
            createPayment: vi.fn(),
        } as unknown as IPaymentRepository;

        useCase = new InitiatePaymentUseCase(paymentRepository);
    });

    it("should create a payment record with 'pending' status", async () => {
        const command = {
            orderId: "order-123",
            userId: "user-456",
            amount: 9900,
            currency: "KRW",
        };

        await useCase.execute(command.orderId, command.userId, command.amount);

        expect(paymentRepository.createPayment).toHaveBeenCalledWith(expect.objectContaining({
            orderId: command.orderId,
            userId: command.userId,
            amount: command.amount,
            status: "pending",
            currency: "KRW",
        }));
    });
});

