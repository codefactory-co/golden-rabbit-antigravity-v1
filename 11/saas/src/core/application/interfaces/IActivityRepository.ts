import { ActivityLog } from '@/src/core/domain/entities/ActivityLog';

export interface IActivityRepository {
    getRecentActivities(userId: string): Promise<ActivityLog[]>;
}
