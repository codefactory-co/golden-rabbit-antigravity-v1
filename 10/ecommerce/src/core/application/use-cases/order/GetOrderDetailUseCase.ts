
import { Order } from "@/core/domain/entities/order/Order";
import { OrderRepository } from "../../interfaces/repositories/OrderRepository";

export class GetOrderDetailUseCase {
    constructor(private readonly orderRepository: OrderRepository) { }

    async execute(id: string): Promise<Order | null> {
        return this.orderRepository.getOrderById(id);
    }
}
