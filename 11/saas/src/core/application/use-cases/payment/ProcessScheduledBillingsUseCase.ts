import { ISubscriptionRepository } from "@/src/core/application/interfaces/ISubscriptionRepository";
import { ExecuteBillingPaymentUseCase } from "./ExecuteBillingPaymentUseCase";

export class ProcessScheduledBillingsUseCase {
    constructor(
        private subscriptionRepository: ISubscriptionRepository,
        private executeBillingPaymentUseCase: ExecuteBillingPaymentUseCase
    ) { }

    async execute(): Promise<{ successCount: number; failureCount: number }> {
        // 1. Find all subscriptions due for payment (nextBillingDate <= now)
        const dueSubscriptions = await this.subscriptionRepository.findDueSubscriptions();

        let successCount = 0;
        let failureCount = 0;

        // 2. Execute payment for each subscription
        for (const sub of dueSubscriptions) {
            if (!sub.userId) {
                console.warn(`Skipping subscription without userId`, sub);
                continue;
            }

            try {
                // ExecuteBillingPaymentUseCase handles payment + nextBillingDate update
                await this.executeBillingPaymentUseCase.execute(sub.userId);
                successCount++;
            } catch (error) {
                console.error(`Failed to process billing for user ${sub.userId}:`, error);
                failureCount++;
                // Check retry logic or failure handling? 
                // Currently ExecuteBillingPaymentUseCase throws on error.
                // We catch here to ensure other payments continue.
            }
        }

        return { successCount, failureCount };
    }
}
