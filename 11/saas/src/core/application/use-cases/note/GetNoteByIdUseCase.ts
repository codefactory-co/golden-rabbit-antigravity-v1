import { INoteRepository } from '../../interfaces/INoteRepository';
import { Note } from '../../../domain/entities/Note';
import { ISubscriptionRepository } from '../../interfaces/ISubscriptionRepository';

export class GetNoteByIdUseCase {
    constructor(
        private readonly noteRepository: INoteRepository,
        private readonly subscriptionRepository: ISubscriptionRepository
    ) { }

    async execute(id: string, userId: string): Promise<Note | null> {
        const subscription = await this.subscriptionRepository.getSubscription(userId);
        if (!subscription || subscription.status !== 'Active') {
            throw new Error('Subscription required to view note');
        }
        return this.noteRepository.getNoteById(id);
    }
}
