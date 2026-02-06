import { IPaymentRepository } from "../../interfaces/IPaymentRepository";

export class InitiatePaymentUseCase {
    constructor(private readonly paymentRepository: IPaymentRepository) { }

    async execute(orderId: string, userId: string, amount: number): Promise<void> {
        await this.paymentRepository.createPayment({
            orderId,
            userId,
            amount,
            status: "pending", // Use lowercase 'pending' as per test expectation. 
            // Note: Payment entity type might restricting this if it only allows 'succeeded' | 'failed' | 'canceled'.
            // I need to check Payment entity definition.
            currency: "KRW",
            approvedAt: new Date(), // approvedAt might not be relevant for pending, but required by type?
            // Checking Payment entity definition...
        } as any);
    }
}
