import { INoteRepository } from '../../interfaces/INoteRepository';
import { Note } from '../../../domain/entities/Note';
import { ISubscriptionRepository } from '../../interfaces/ISubscriptionRepository';

export class CreateNoteUseCase {
    constructor(
        private readonly noteRepository: INoteRepository,
        private readonly subscriptionRepository: ISubscriptionRepository
    ) { }

    async execute(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> {
        // Free plan allows creation of notes (Unlimited), so we don't block.
        return this.noteRepository.createNote(note);
    }
}
