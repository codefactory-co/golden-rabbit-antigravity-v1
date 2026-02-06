import { OrderRepository, OrderStats } from "../../interfaces/repositories/OrderRepository";

export class GetOrderStatsUseCase {
    constructor(private readonly orderRepository: OrderRepository) { }

    async execute(): Promise<OrderStats> {
        return this.orderRepository.getOrderStats();
    }
}
