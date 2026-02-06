import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SupabaseActivityRepository } from './SupabaseActivityRepository';
import { createClient } from '@/lib/supabase/server';

vi.mock('@/lib/supabase/server', () => ({
    createClient: vi.fn(),
}));

describe('SupabaseActivityRepository', () => {
    let repository: SupabaseActivityRepository;
    const userId = 'user-123';

    beforeEach(() => {
        repository = new SupabaseActivityRepository();
        vi.clearAllMocks();
    });

    it('should return activities when found', async () => {
        const mockSupabase = {
            from: vi.fn().mockReturnThis(),
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            limit: vi.fn().mockResolvedValue({
                data: [
                    {
                        id: '1',
                        type: 'CREATE_NOTE',
                        description: 'New Note',
                        metadata: '1 hour ago',
                        icon: 'edit_note',
                        color_class: 'bg-blue-50',
                    },
                ],
                error: null,
            }),
        };

        vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

        const result = await repository.getRecentActivities(userId);

        expect(result).toEqual([
            {
                id: '1',
                type: 'CREATE_NOTE',
                description: 'New Note',
                metadata: '1 hour ago',
                icon: 'edit_note',
                colorClass: 'bg-blue-50',
            },
        ]);
    });

    it('should return empty array when no activities found', async () => {
        const mockSupabase = {
            from: vi.fn().mockReturnThis(),
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            limit: vi.fn().mockResolvedValue({
                data: [],
                error: null,
            }),
        };

        vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

        const result = await repository.getRecentActivities(userId);

        expect(result).toEqual([]);
    });
});
