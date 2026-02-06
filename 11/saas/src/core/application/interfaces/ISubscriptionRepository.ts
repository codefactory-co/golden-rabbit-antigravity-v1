import { Subscription } from '@/src/core/domain/entities/Subscription';

export interface ISubscriptionRepository {
    getSubscription(userId: string): Promise<Subscription | null>;
    upsertSubscription(userId: string, subscription: Subscription): Promise<void>;
    findDueSubscriptions(): Promise<Subscription[]>;
}
