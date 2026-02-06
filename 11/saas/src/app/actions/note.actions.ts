'use server';

import { createClient } from '@/lib/supabase/server';
import { CreateNoteUseCase } from '@/src/core/application/use-cases/note/CreateNoteUseCase';
import { DeleteNoteUseCase } from '@/src/core/application/use-cases/note/DeleteNoteUseCase';
import { SupabaseNoteRepository } from '@/src/infrastructure/repositories/SupabaseNoteRepository';
import { SupabaseSubscriptionRepository } from '@/src/infrastructure/repositories/SupabaseSubscriptionRepository';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const noteRepository = new SupabaseNoteRepository();
const subscriptionRepository = new SupabaseSubscriptionRepository();
const createNoteUseCase = new CreateNoteUseCase(noteRepository, subscriptionRepository);
const deleteNoteUseCase = new DeleteNoteUseCase(noteRepository, subscriptionRepository);

export async function createNoteAction(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const category = formData.get('category') as string;

    await createNoteUseCase.execute({
        userId: user.id,
        title,
        content: content || '',
        category: category === '선택 안함' ? undefined : category,
        isFavorite: false,
        isDeleted: false,
    });

    revalidatePath('/notes');
}

export async function deleteNoteAction(id: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    await deleteNoteUseCase.execute(id, user.id);
    revalidatePath('/notes');
    redirect('/notes');
}
