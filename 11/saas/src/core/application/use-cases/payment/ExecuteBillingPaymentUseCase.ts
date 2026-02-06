import { IPaymentGateway } from "../../interfaces/IPaymentGateway";
import { ISubscriptionRepository } from "../../interfaces/ISubscriptionRepository";
import { IPaymentRepository } from "../../interfaces/IPaymentRepository";
import { Payment } from "@/src/core/domain/entities/Payment";
import { nanoid } from "nanoid";

export class ExecuteBillingPaymentUseCase {
    constructor(
        private paymentGateway: IPaymentGateway,
        private subscriptionRepository: ISubscriptionRepository,
        private paymentRepository: IPaymentRepository
    ) { }

    async execute(userId: string): Promise<void> {
        const subscription = await this.subscriptionRepository.getSubscription(userId);

        if (!subscription || !subscription.billingKey) {
            throw new Error("No billing key found for user");
        }

        const orderId = nanoid();
        const orderName = `Subscription Payment - ${subscription.planName}`;

        // Execute Payment
        const result = await this.paymentGateway.executeBillingPayment(subscription.billingKey, {
            amount: subscription.amount,
            orderId,
            orderName,
            customerKey: userId
        });

        // Calculate next date (1 month later)
        const nextDate = new Date();
        nextDate.setMonth(nextDate.getMonth() + 1);

        // Update Subscription
        await this.subscriptionRepository.upsertSubscription(userId, {
            ...subscription,
            status: 'Active',
            nextBillingDate: nextDate
        });

        // Save Payment
        const payment: Payment = {
            userId,
            amount: result.amount,
            currency: 'KRW',
            status: 'succeeded',
            orderId: result.orderId,
            providerPaymentId: result.paymentKey,
            approvedAt: new Date(result.approvedAt)
        };
        await this.paymentRepository.savePayment(payment);
    }
}
