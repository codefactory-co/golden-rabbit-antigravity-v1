export interface IPaymentGateway {
    confirmPayment(paymentKey: string, orderId: string, amount: number): Promise<{
        paymentKey: string;
        orderId: string;
        amount: number;
        status: string;
        method: string;
        billingKey?: string;
        approvedAt: string;
    }>;

    issueBillingKey(authKey: string, customerKey: string): Promise<{
        billingKey: string;
        card: {
            company: string;
            number: string;
        };
        authenticatedAt: string;
    }>;

    executeBillingPayment(billingKey: string, params: {
        amount: number;
        orderId: string;
        orderName: string;
        customerKey: string;
    }): Promise<{
        paymentKey: string;
        orderId: string;
        amount: number;
        status: string;
        approvedAt: string;
    }>;
}
