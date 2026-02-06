import { ISubscriptionRepository } from '../interfaces/ISubscriptionRepository';
import { IUsageRepository } from '../interfaces/IUsageRepository';
import { IActivityRepository } from '../interfaces/IActivityRepository';
import { Subscription } from '../../domain/entities/Subscription';
import { UsageStats } from '../../domain/entities/UsageStats';
import { ActivityLog } from '../../domain/entities/ActivityLog';

export interface DashboardData {
    subscription: Subscription | null;
    usage: UsageStats | null;
    activities: ActivityLog[];
}

export class GetDashboardDataUseCase {
    constructor(
        private subscriptionRepo: ISubscriptionRepository,
        private usageRepo: IUsageRepository,
        private activityRepo: IActivityRepository
    ) { }

    async execute(userId: string): Promise<DashboardData> {
        const [subscription, usage, activities] = await Promise.all([
            this.subscriptionRepo.getSubscription(userId),
            this.usageRepo.getUsageStats(userId),
            this.activityRepo.getRecentActivities(userId),
        ]);

        return {
            subscription,
            usage,
            activities,
        };
    }
}
