export enum OrderStatus {
    PAYMENT_PENDING = 'payment_pending',
    PAYMENT_COMPLETED = 'payment_completed',
    PREPARING = 'preparing',
    SHIPPING = 'shipping',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
}

export type OrderStatusType = `${OrderStatus}`;
