import Link from 'next/link';
import { Note } from '@/src/core/domain/entities/Note';
import { NewNoteModal } from './NewNoteModal';

interface NoteListProps {
    notes: Note[];
}

export function NoteList({ notes }: NoteListProps) {
    return (
        <aside className="w-[30%] min-w-[300px] max-w-[400px] bg-white border-r border-gray-200 flex flex-col h-full z-10">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between shrink-0">
                <h2 className="text-lg font-bold text-slate-800">내 노트</h2>
                <NewNoteModal />
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {notes.map((note) => (
                    <Link
                        key={note.id}
                        href={`/notes/${note.id}`}
                        className="block group cursor-pointer p-3 rounded-lg border border-transparent hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex justify-between items-start mb-1">
                            <h3 className="font-bold text-slate-800 truncate pr-2">{note.title}</h3>
                            <span className="text-xs text-slate-400 shrink-0">
                                {new Date(note.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 truncate">
                            {note.content || '내용 없음'}
                        </p>
                    </Link>
                ))}
            </div>
        </aside>
    );
}
