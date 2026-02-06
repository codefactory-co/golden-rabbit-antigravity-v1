import { OrderStatusType } from "./OrderStatus";
import { ProductProps } from "../Product";

export interface OrderItem {
    productId: string;
    productName: string;
    productImage?: string;
    unitPrice: number;
    quantity: number;
}

export interface ReceiverInfo {
    name: string;
    phone: string;
    address: string;
    message?: string;
}

export interface TrackingInfo {
    carrier?: string;
    trackingNumber?: string;
}

export interface OrderProps {
    id: string;
    orderNumber: string;
    customerName: string;
    customerEmail?: string;
    customerPhone?: string;
    items: OrderItem[];
    totalAmount: number;
    status: OrderStatusType;
    orderedAt: Date;
    receiver?: ReceiverInfo;
    paymentMethod?: string;
    paymentDate?: Date;
    tracking?: TrackingInfo;
}


export class Order {
    public readonly id: string;
    public readonly orderNumber: string;
    public readonly customerName: string;
    public readonly customerEmail?: string;
    public readonly customerPhone?: string;
    public readonly items: OrderItem[];
    public readonly totalAmount: number;
    public readonly status: OrderStatusType;
    public readonly orderedAt: Date;
    public readonly receiver?: ReceiverInfo;
    public readonly paymentMethod?: string;
    public readonly paymentDate?: Date;
    public readonly tracking?: TrackingInfo;

    constructor(props: OrderProps) {
        this.id = props.id;
        this.orderNumber = props.orderNumber;
        this.customerName = props.customerName;
        this.customerEmail = props.customerEmail;
        this.customerPhone = props.customerPhone;
        this.items = props.items;
        this.totalAmount = props.totalAmount;
        this.status = props.status;
        this.orderedAt = props.orderedAt;
        this.receiver = props.receiver;
        this.paymentMethod = props.paymentMethod;
        this.paymentDate = props.paymentDate;
        this.tracking = props.tracking;
    }

    get productSummary(): string {
        if (this.items.length === 0) return "상품 정보 없음";
        const firstItemName = this.items[0].productName;
        const count = this.items.length;
        return count > 1 ? `${firstItemName} 외 ${count - 1}건` : firstItemName;
    }

    get shippingCost(): number {
        // Simple logic for now, can be extended
        return this.totalAmount >= 50000 ? 0 : 3000;
    }

    get itemTotal(): number {
        return this.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    }
}
