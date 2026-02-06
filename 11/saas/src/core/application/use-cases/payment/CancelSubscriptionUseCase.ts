import { ISubscriptionRepository } from "@/src/core/application/interfaces/ISubscriptionRepository";

export class CancelSubscriptionUseCase {
    constructor(
        private readonly subscriptionRepository: ISubscriptionRepository
    ) { }

    async execute(userId: string): Promise<void> {
        const subscription = await this.subscriptionRepository.getSubscription(userId);

        if (!subscription) {
            throw new Error("Subscription not found");
        }

        // Keep nextBillingDate as is.
        // Set status to Canceled.
        // Remove billingKey to prevent future charges.

        await this.subscriptionRepository.upsertSubscription(userId, {
            ...subscription,
            status: 'Canceled',
            billingKey: undefined
        });
    }
}
