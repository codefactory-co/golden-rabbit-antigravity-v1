import { INoteRepository } from '../../interfaces/INoteRepository';
import { ISubscriptionRepository } from '../../interfaces/ISubscriptionRepository';

export class DeleteNoteUseCase {
    constructor(
        private readonly noteRepository: INoteRepository,
        private readonly subscriptionRepository: ISubscriptionRepository
    ) { }

    async execute(id: string, userId: string): Promise<void> {
        const subscription = await this.subscriptionRepository.getSubscription(userId);
        if (!subscription || subscription.status !== 'Active') {
            throw new Error('Subscription required to delete notes');
        }
        return this.noteRepository.deleteNote(id);
    }
}
