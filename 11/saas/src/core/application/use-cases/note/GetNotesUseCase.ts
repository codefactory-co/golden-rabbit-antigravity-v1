import { INoteRepository } from '../../interfaces/INoteRepository';
import { Note } from '../../../domain/entities/Note';
import { ISubscriptionRepository } from '../../interfaces/ISubscriptionRepository';

export class GetNotesUseCase {
    constructor(
        private readonly noteRepository: INoteRepository,
        private readonly subscriptionRepository: ISubscriptionRepository
    ) { }

    async execute(userId: string): Promise<Note[]> {
        // Free plan allows access to notes, so we don't block based on subscription status.
        return this.noteRepository.getNotes(userId);
    }
}
