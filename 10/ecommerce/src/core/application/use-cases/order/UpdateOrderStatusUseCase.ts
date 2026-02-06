
import { OrderStatusType } from "@/core/domain/entities/order/OrderStatus";
import { OrderRepository } from "../../interfaces/repositories/OrderRepository";

export class UpdateOrderStatusUseCase {
    constructor(private readonly orderRepository: OrderRepository) { }

    async execute(id: string, status: OrderStatusType): Promise<void> {
        return this.orderRepository.updateOrderStatus(id, status);
    }
}
