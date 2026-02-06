
import Link from 'next/link';

export default function Header() {
    return (
        <header className="absolute top-0 w-full p-6 flex justify-between items-center z-10">
            <div className="text-xl font-bold flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg">D</span>
                </div>
                <span>DevBlog</span>
            </div>
            <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
                메인으로 돌아가기
            </Link>
        </header>
    );
}
