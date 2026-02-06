import { createClient } from '@/lib/supabase/server';
import { SupabaseNoteRepository } from '@/src/infrastructure/repositories/SupabaseNoteRepository';
import { SupabaseSubscriptionRepository } from '@/src/infrastructure/repositories/SupabaseSubscriptionRepository';
import { GetNotesUseCase } from '@/src/core/application/use-cases/note/GetNotesUseCase';
import { NoteList } from '@/src/components/features/note/NoteList';

import { redirect } from 'next/navigation';

export default async function NotesLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Middleware guarantees user existence, but we check here for Type Safety
    if (!user) {
        redirect('/auth');
    }



    const noteRepository = new SupabaseNoteRepository();
    const subscriptionRepository = new SupabaseSubscriptionRepository();

    // Check subscription status
    const subscription = await subscriptionRepository.getSubscription(user.id);
    const now = new Date();
    const isSubscriptionValid = subscription && (
        subscription.status === 'Active' ||
        (subscription.status === 'Canceled' && subscription.nextBillingDate > now)
    );

    if (!isSubscriptionValid) {
        redirect('/payment');
    }

    const getNotesUseCase = new GetNotesUseCase(noteRepository, subscriptionRepository);
    const notes = await getNotesUseCase.execute(user.id);

    return (
        <div className="flex h-full w-full">
            <NoteList notes={notes} />
            {children}
        </div>
    );
}
