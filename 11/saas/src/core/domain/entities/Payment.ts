export interface Payment {
    id?: string;
    userId: string;
    subscriptionId?: string;
    amount: number;
    currency: string;
    status: 'pending' | 'succeeded' | 'failed' | 'canceled';
    orderId: string;
    providerPaymentId?: string; // paymentKey from Toss
    approvedAt: Date;
    createdAt?: Date;
}
