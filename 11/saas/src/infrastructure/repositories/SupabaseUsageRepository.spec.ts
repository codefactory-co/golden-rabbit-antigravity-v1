import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SupabaseUsageRepository } from './SupabaseUsageRepository';
import { createClient } from '@/lib/supabase/server';

vi.mock('@/lib/supabase/server', () => ({
    createClient: vi.fn(),
}));

describe('SupabaseUsageRepository', () => {
    let repository: SupabaseUsageRepository;
    const userId = 'user-123';

    beforeEach(() => {
        repository = new SupabaseUsageRepository();
        vi.clearAllMocks();
    });

    it('should return usage data when found', async () => {
        const mockSupabase = {
            from: vi.fn().mockReturnThis(),
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
                data: {
                    note_count: 234,
                    max_note_count: -1,
                    storage_used: 3435973836, // 3.2 GB
                    storage_limit: 10737418240, // 10 GB
                    ai_summary_count: 45,
                    max_ai_summary_count: 100,
                },
                error: null,
            }),
        };

        vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

        const result = await repository.getUsageStats(userId);

        expect(result).toEqual({
            noteCount: 234,
            maxNoteCount: -1,
            storageUsed: 3435973836,
            storageLimit: 10737418240,
            aiSummaryCount: 45,
            maxAiSummaryCount: 100,
        });
    });

    it('should return null when no usage data found', async () => {
        const mockSupabase = {
            from: vi.fn().mockReturnThis(),
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
                data: null,
                error: { code: 'PGRST116' },
            }),
        };

        vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

        const result = await repository.getUsageStats(userId);

        expect(result).toBeNull();
    });
});
