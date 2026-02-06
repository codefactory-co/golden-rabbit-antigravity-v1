import { IPaymentGateway } from "@/src/core/application/interfaces/IPaymentGateway";
import { ISubscriptionRepository } from "@/src/core/application/interfaces/ISubscriptionRepository";
import { IPaymentRepository } from "@/src/core/application/interfaces/IPaymentRepository";

export class ProcessPaymentSuccessUseCase {
    constructor(
        private readonly paymentGateway: IPaymentGateway,
        private readonly subscriptionRepository: ISubscriptionRepository,
        private readonly paymentRepository: IPaymentRepository
    ) { }

    async execute(userId: string, paymentKey: string, orderId: string, amount: number): Promise<void> {
        // 1. Confirm payment with Gateway (Toss Payments)
        const paymentResult = await this.paymentGateway.confirmPayment(paymentKey, orderId, amount);

        if (paymentResult.status !== "DONE") {
            throw new Error(`Payment verification failed: Status is ${paymentResult.status}`);
        }

        // 2. Calculate next billing date (1 month from now)
        const nextBillingDate = new Date();
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

        // 3. Update Subscription
        await this.subscriptionRepository.upsertSubscription(userId, {
            planName: "Pro", // Assuming 'Pro' for this flow
            status: "Active",
            nextBillingDate: nextBillingDate,
            amount: paymentResult.amount,
            paymentMethod: {
                brand: paymentResult.method, // Toss returns "카드", "가상계좌", etc.
                last4: "", // Toss might not return last4 in basic response
            }
        });

        // 4. Update Payment History (Success)
        await this.paymentRepository.updatePayment({
            orderId: orderId, // Use the orderId passed to execute
            amount: paymentResult.amount,
            currency: "KRW",
            status: "succeeded",
            providerPaymentId: paymentResult.paymentKey,
            approvedAt: new Date(paymentResult.approvedAt), // Ensure date format
        });
    }
}
