import { Note } from '../../domain/entities/Note';

export interface INoteRepository {
    getNotes(userId: string): Promise<Note[]>;
    getNoteById(id: string): Promise<Note | null>;
    createNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note>;
    deleteNote(id: string): Promise<void>;
}
