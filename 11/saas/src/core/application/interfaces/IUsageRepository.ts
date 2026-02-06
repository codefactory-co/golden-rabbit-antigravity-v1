import { UsageStats } from '@/src/core/domain/entities/UsageStats';

export interface IUsageRepository {
    getUsageStats(userId: string): Promise<UsageStats | null>;
}
