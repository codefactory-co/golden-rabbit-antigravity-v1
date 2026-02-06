
import { OrderRepository } from "../../interfaces/repositories/OrderRepository";

export class UpdateTrackingInfoUseCase {
    constructor(private readonly orderRepository: OrderRepository) { }

    async execute(id: string, carrier: string, trackingNumber: string): Promise<void> {
        return this.orderRepository.updateTrackingNumber(id, carrier, trackingNumber);
    }
}
