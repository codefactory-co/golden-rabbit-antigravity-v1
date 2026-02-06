import { Order } from "@/core/domain/entities/order/Order";
import { OrderStatusType } from "@/core/domain/entities/order/OrderStatus";

export interface GetOrdersParams {
    page: number;
    limit: number;
    status?: OrderStatusType[]; // Support multiple statuses for one tab (e.g. shipping + preparing)
    search?: string;
    startDate?: Date;
    endDate?: Date;
}

export interface PaginatedOrders {
    orders: Order[];
    total: number;
}

export interface OrderStats {
    total: number;
    paymentPending: number;
    paymentCompleted: number;
    shipping: number; // Includes preparing + shipping
    delivered: number;
    todayPending: number; // "오늘 처리해야 할 주문"
}

export interface OrderRepository {
    getOrders(params: GetOrdersParams): Promise<PaginatedOrders>;
    getOrderStats(): Promise<OrderStats>;
    getOrderById(id: string): Promise<Order | null>;
    updateOrderStatus(id: string, status: OrderStatusType): Promise<void>;
    updateTrackingNumber(id: string, carrier: string, trackingNumber: string): Promise<void>;
}
