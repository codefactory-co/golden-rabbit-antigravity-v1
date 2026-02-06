import { IPaymentRepository } from "../../interfaces/IPaymentRepository";

export class ProcessPaymentFailureUseCase {
    constructor(private readonly paymentRepository: IPaymentRepository) { }

    async execute(orderId: string, reason?: string): Promise<void> {
        await this.paymentRepository.updateStatus(orderId, "failed", reason);
    }
}
