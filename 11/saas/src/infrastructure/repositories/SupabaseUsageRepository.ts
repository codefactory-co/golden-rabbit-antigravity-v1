import { IUsageRepository } from '@/src/core/application/interfaces/IUsageRepository';
import { UsageStats } from '@/src/core/domain/entities/UsageStats';
import { createClient } from '@/lib/supabase/server';

export class SupabaseUsageRepository implements IUsageRepository {
    async getUsageStats(userId: string): Promise<UsageStats | null> {
        const supabase = await createClient();

        const { data } = await supabase
            .from('usage_stats')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (!data) {
            return null;
        }

        return {
            noteCount: data.note_count,
            maxNoteCount: data.max_note_count,
            storageUsed: data.storage_used,
            storageLimit: data.storage_limit,
            aiSummaryCount: data.ai_summary_count,
            maxAiSummaryCount: data.max_ai_summary_count,
        };
    }
}
