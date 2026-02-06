import Link from 'next/link';
import { Github, Twitter, Rss } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t border-gray-800 bg-[#0B1120] mt-auto">
            <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-500 font-mono">
                            {`</>`}
                        </span>
                        <p className="text-sm text-gray-500">
                            © 2024 DevBlog 플랫폼. 오픈 소스 콘텐츠.
                        </p>
                    </div>


                    <div className="flex space-x-6">
                        <Link href="#" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-sm font-medium">
                            RSS
                        </Link>
                        <Link href="#" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-sm font-medium">
                            Twitter
                        </Link>
                        <Link href="#" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-sm font-medium">
                            GitHub
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
