import { createClient } from '@/lib/supabase/server';
import { SupabaseNoteRepository } from '@/src/infrastructure/repositories/SupabaseNoteRepository';
import { SupabaseSubscriptionRepository } from '@/src/infrastructure/repositories/SupabaseSubscriptionRepository';
import { GetNoteByIdUseCase } from '@/src/core/application/use-cases/note/GetNoteByIdUseCase';
import { notFound, redirect } from 'next/navigation';
import { deleteNoteAction } from '@/src/app/actions/note.actions';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function NoteDetailPage({ params }: PageProps) {
    const { id } = await params;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/');

    const noteRepository = new SupabaseNoteRepository();
    const subscriptionRepository = new SupabaseSubscriptionRepository();
    const getNoteByIdUseCase = new GetNoteByIdUseCase(noteRepository, subscriptionRepository);
    const note = await getNoteByIdUseCase.execute(id, user.id);

    if (!note) {
        notFound();
    }

    const deleteActionWithId = deleteNoteAction.bind(null, note.id);

    return (
        <section className="flex-1 bg-[#f3f4f6] overflow-y-auto h-full p-4 md:p-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-full p-8 relative max-w-4xl mx-auto">
                <div className="border-b border-gray-100 pb-6 mb-8">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        {note.category && (
                            <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide">
                                {note.category}
                            </span>
                        )}
                        <span className="text-sm text-slate-400 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">schedule</span>
                            {new Date(note.createdAt).toLocaleString()}
                        </span>
                        <div className="ml-auto">
                            <form action={deleteActionWithId}>
                                <button type="submit" className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50" title="삭제">
                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                </button>
                            </form>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 leading-tight">{note.title}</h1>
                </div>
                <div className="prose max-w-none text-slate-700 space-y-6 leading-relaxed whitespace-pre-wrap">
                    {note.content}
                </div>
            </div>
        </section>
    );
}
