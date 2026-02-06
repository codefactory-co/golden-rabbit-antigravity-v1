import { IActivityRepository } from '@/src/core/application/interfaces/IActivityRepository';
import { ActivityLog } from '@/src/core/domain/entities/ActivityLog';
import { createClient } from '@/lib/supabase/server';

export class SupabaseActivityRepository implements IActivityRepository {
    async getRecentActivities(userId: string): Promise<ActivityLog[]> {
        const supabase = await createClient();

        const { data } = await supabase
            .from('activity_logs')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(10); // Limit to recent 10

        if (!data) {
            return [];
        }

        return data.map((log) => ({
            id: log.id,
            type: log.type,
            description: log.description,
            metadata: log.metadata,
            icon: log.icon,
            colorClass: log.color_class,
        }));
    }
}
