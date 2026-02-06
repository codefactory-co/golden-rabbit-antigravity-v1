import { INoteRepository } from '@/src/core/application/interfaces/INoteRepository';
import { Note } from '@/src/core/domain/entities/Note';
import { createClient } from '@/lib/supabase/server';

export class SupabaseNoteRepository implements INoteRepository {
    async getNotes(userId: string): Promise<Note[]> {
        const supabase = await createClient();

        const { data } = await supabase
            .from('notes')
            .select('*')
            .eq('user_id', userId)
            .eq('is_deleted', false)
            .order('created_at', { ascending: false });

        if (!data) return [];

        return data.map(this.mapToEntity);
    }

    async getNoteById(id: string): Promise<Note | null> {
        const supabase = await createClient();

        const { data } = await supabase
            .from('notes')
            .select('*')
            .eq('id', id)
            .single();

        if (!data) return null;

        return this.mapToEntity(data);
    }

    async createNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('notes')
            .insert({
                user_id: note.userId,
                title: note.title,
                content: note.content,
                category: note.category,
                summary: note.summary,
                is_favorite: note.isFavorite,
                is_deleted: note.isDeleted,
            })
            .select('*')
            .single();

        if (error) throw error;
        if (!data) throw new Error('Failed to create note');

        return this.mapToEntity(data);
    }

    async deleteNote(id: string): Promise<void> {
        const supabase = await createClient();

        const { error } = await supabase
            .from('notes')
            .update({ is_deleted: true })
            .eq('id', id);

        if (error) throw error;
    }

    private mapToEntity(row: any): Note {
        return {
            id: row.id,
            userId: row.user_id,
            folderId: row.folder_id,
            title: row.title,
            content: row.content,
            category: row.category,
            summary: row.summary,
            isFavorite: row.is_favorite,
            isDeleted: row.is_deleted,
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at),
        };
    }
}
