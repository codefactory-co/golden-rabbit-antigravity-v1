import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SupabaseNoteRepository } from './SupabaseNoteRepository';
import { createClient } from '@/lib/supabase/server';

vi.mock('@/lib/supabase/server', () => ({
    createClient: vi.fn(),
}));

describe('SupabaseNoteRepository', () => {
    let repository: SupabaseNoteRepository;
    const userId = 'user-123';

    beforeEach(() => {
        repository = new SupabaseNoteRepository();
        vi.clearAllMocks();
    });

    describe('getNotes', () => {
        it('should return notes when found', async () => {
            const mockData = [
                {
                    id: '1',
                    user_id: userId,
                    title: 'Test Note',
                    content: 'Content',
                    category: 'WORK',
                    summary: 'Summary',
                    is_favorite: false,
                    is_deleted: false,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
            ];

            const mockSupabase = {
                from: vi.fn().mockReturnThis(),
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                order: vi.fn().mockResolvedValue({ data: mockData, error: null }),
            };

            vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

            const result = await repository.getNotes(userId);

            expect(result).toHaveLength(1);
            expect(result[0].title).toBe('Test Note');
            expect(result[0].category).toBe('WORK');
        });
    });

    describe('createNote', () => {
        it('should create and return a note', async () => {
            const newNote = {
                userId,
                title: 'New Note',
                content: 'New Content',
                category: 'IDEA',
                isFavorite: false,
                isDeleted: false,
            };

            const mockReturnData = {
                id: '2',
                user_id: userId,
                title: 'New Note',
                content: 'New Content',
                category: 'IDEA',
                summary: null,
                is_favorite: false,
                is_deleted: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };

            const mockSupabase = {
                from: vi.fn().mockReturnThis(),
                insert: vi.fn().mockReturnThis(),
                select: vi.fn().mockReturnThis(),
                single: vi.fn().mockResolvedValue({ data: mockReturnData, error: null }),
            };

            vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

            const result = await repository.createNote(newNote);

            expect(result.id).toBe('2');
            expect(result.title).toBe('New Note');
        });
    });
});
