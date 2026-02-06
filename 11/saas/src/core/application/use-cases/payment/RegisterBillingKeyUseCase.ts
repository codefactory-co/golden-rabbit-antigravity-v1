import { IPaymentGateway } from "../../interfaces/IPaymentGateway";
import { ISubscriptionRepository } from "../../interfaces/ISubscriptionRepository";
import { Subscription } from "@/src/core/domain/entities/Subscription";

export class RegisterBillingKeyUseCase {
    constructor(
        private paymentGateway: IPaymentGateway,
        private subscriptionRepository: ISubscriptionRepository
    ) { }

    async execute(params: {
        authKey: string;
        customerKey: string;
        plan?: string;
        amount?: number;
    }): Promise<void> {
        // 1. Issue Billing Key
        const result = await this.paymentGateway.issueBillingKey(params.authKey, params.customerKey);

        // 2. Get existing subscription or create default
        let subscription = await this.subscriptionRepository.getSubscription(params.customerKey);

        if (!subscription) {
            subscription = {
                planName: (params.plan as 'Free' | 'Pro' | 'Enterprise') || 'Free',
                status: 'Active',
                nextBillingDate: new Date(),
                amount: params.amount ?? 0,
                paymentMethod: {
                    brand: '',
                    last4: '',
                }
            };
        }

        // 3. Update with new billing info AND plan info
        const planName = (params.plan as 'Free' | 'Pro' | 'Enterprise') || subscription.planName;
        const amount = params.amount ?? subscription.amount;

        const updatedSubscription: Subscription = {
            ...subscription,
            planName,
            amount,
            billingKey: result.billingKey,
            paymentMethod: {
                brand: result.card.company,
                last4: result.card.number,
            }
        };

        // 4. Save
        await this.subscriptionRepository.upsertSubscription(params.customerKey, updatedSubscription);
    }
}
