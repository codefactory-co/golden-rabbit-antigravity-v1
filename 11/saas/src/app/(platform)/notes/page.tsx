import { Icon } from '@/src/components/common/Icon';

export default function NotesPage() {
    return (
        <section className="flex-1 bg-[#f3f4f6] overflow-y-auto h-full p-4 md:p-8 dark:bg-gray-900">
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <Icon name="description" size={64} className="mb-4 text-slate-300 dark:text-gray-600" />
                <p className="text-lg">노트를 선택해주세요</p>
            </div>
        </section>
    );
}
