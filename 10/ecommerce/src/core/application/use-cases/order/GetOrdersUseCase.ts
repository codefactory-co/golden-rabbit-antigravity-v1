import { OrderRepository, GetOrdersParams, PaginatedOrders } from "../../interfaces/repositories/OrderRepository";

export class GetOrdersUseCase {
    constructor(private readonly orderRepository: OrderRepository) { }

    async execute(params: GetOrdersParams): Promise<PaginatedOrders> {
        return this.orderRepository.getOrders(params);
    }
}
