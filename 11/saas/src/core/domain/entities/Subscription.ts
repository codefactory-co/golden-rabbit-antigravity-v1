export interface Subscription {
    userId?: string;
    planName: 'Free' | 'Pro' | 'Enterprise';
    status: 'Active' | 'Inactive' | 'Canceled';
    nextBillingDate: Date;
    amount: number;
    billingKey?: string;
    paymentMethod: {
        brand: string;
        last4: string;
    };
}
