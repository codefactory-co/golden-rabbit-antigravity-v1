import { IPaymentGateway } from "@/src/core/application/interfaces/IPaymentGateway";

export class TossPaymentGateway implements IPaymentGateway {
    private readonly secretKey: string;

    constructor() {
        const key = process.env.TOSS_PAYMENTS_SECRET_KEY;
        if (!key) {
            throw new Error("TOSS_PAYMENTS_SECRET_KEY is not defined in environment variables");
        }
        this.secretKey = key;
    }

    async confirmPayment(paymentKey: string, orderId: string, amount: number): Promise<{
        paymentKey: string;
        orderId: string;
        amount: number;
        status: string;
        method: string;
        billingKey?: string;
        approvedAt: string;
    }> {
        const widgetSecretKey = this.secretKey;
        const encryptedSecretKey = Buffer.from(widgetSecretKey + ":").toString("base64");

        const response = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
            method: "POST",
            headers: {
                Authorization: `Basic ${encryptedSecretKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                orderId,
                amount,
                paymentKey,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Payment confirmation failed");
        }

        return {
            paymentKey: data.paymentKey,
            orderId: data.orderId,
            amount: data.totalAmount,
            status: data.status,
            method: data.method,
            billingKey: data.card ? data.card.billingKey : undefined,
            approvedAt: data.approvedAt,
        };
    }

    async issueBillingKey(authKey: string, customerKey: string): Promise<{
        billingKey: string;
        card: {
            company: string;
            number: string;
        };
        authenticatedAt: string;
    }> {
        const widgetSecretKey = this.secretKey;
        const encryptedSecretKey = Buffer.from(widgetSecretKey + ":").toString("base64");

        const response = await fetch("https://api.tosspayments.com/v1/billing/authorizations/issue", {
            method: "POST",
            headers: {
                Authorization: `Basic ${encryptedSecretKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                authKey,
                customerKey,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to issue billing key");
        }

        return {
            billingKey: data.billingKey,
            card: {
                company: data.card.company,
                number: data.card.number,
            },
            authenticatedAt: data.authenticatedAt,
        };
    }

    async executeBillingPayment(billingKey: string, params: {
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
    }> {
        const widgetSecretKey = this.secretKey;
        const encryptedSecretKey = Buffer.from(widgetSecretKey + ":").toString("base64");

        const response = await fetch(`https://api.tosspayments.com/v1/billing/${billingKey}`, {
            method: "POST",
            headers: {
                Authorization: `Basic ${encryptedSecretKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                customerKey: params.customerKey,
                amount: params.amount,
                orderId: params.orderId,
                orderName: params.orderName,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to execute billing payment");
        }

        return {
            paymentKey: data.paymentKey,
            orderId: data.orderId,
            amount: data.totalAmount,
            status: data.status,
            approvedAt: data.approvedAt,
        };
    }
}
