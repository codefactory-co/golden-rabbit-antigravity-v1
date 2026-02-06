'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { createPost } from '@/app/actions';
import {
    ArrowLeft,
    Send,
    Bold,
    Italic,
    Heading1,
    Link as LinkIcon,
    Quote,
    Code,
    Image as ImageIcon,
    Eye,
    EyeOff,
    Loader2
} from 'lucide-react';

export default function WritePage() {
    const router = useRouter();

    // State
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isPreview, setIsPreview] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);

    // Toolbar handlers
    const insertText = (before: string, after: string = '') => {
        const textarea = document.getElementById('editor-textarea') as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = content.substring(start, end);

        const newText = content.substring(0, start) + before + selectedText + after + content.substring(end);
        setContent(newText);

        // Restore focus and selection
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + before.length, end + before.length);
        }, 0);
    };

    const handlePublish = async () => {
        if (!title.trim() || !content.trim()) {
            alert('제목과 내용을 모두 입력해주세요.');
            return;
        }

        setIsPublishing(true);

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);

            const result = await createPost(formData);

            if (result?.error) {
                if (result.error === '로그인이 필요합니다.') {
                    alert('로그인이 필요합니다.');
                    router.push('/auth');
                } else {
                    throw new Error(result.error);
                }
            } else {
                alert('성공적으로 발행되었습니다!');
                router.push('/');
            }
        } catch (error) {
            console.error('Error publishing post:', error);
            alert('발행 중 오류가 발생했습니다.');
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0B1120] text-gray-300 flex flex-col">
            {/* Header */}
            <header className="border-b border-gray-800 bg-[#0B1120]/50 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-4 max-w-5xl h-16 flex items-center justify-between">
                    <div className="flex items-center">
                        <Link
                            href="/"
                            className="flex items-center text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            목록으로 돌아가기
                        </Link>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 mr-2">임시 저장됨</span>
                        <button className="px-4 py-2 rounded-lg bg-[#1E293B] text-sm font-medium hover:bg-[#2D3B4F] transition-colors">
                            임시 저장
                        </button>
                        <button
                            onClick={handlePublish}
                            disabled={isPublishing}
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPublishing ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    발행 중...
                                </>
                            ) : (
                                <>
                                    발행하기
                                    <Send className="w-4 h-4 ml-2" />
                                </>
                            )}
                        </button>
                        <div className="w-px h-6 bg-gray-800 mx-2" />
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 ring-2 ring-gray-800" />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl flex flex-col">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목을 입력하세요..."
                    className="w-full bg-transparent text-4xl sm:text-5xl font-bold text-white placeholder-gray-700 border-none outline-none mb-8"
                />

                {/* Editor Container */}
                <div className="flex-grow flex flex-col border border-gray-800 rounded-lg overflow-hidden bg-[#0F172A]/50">
                    {/* Toolbar */}
                    <div className="flex items-center gap-1 p-2 border-b border-gray-800 bg-[#1E293B]/50 overflow-x-auto">
                        <ToolbarButton onClick={() => insertText('**', '**')} icon={<Bold className="w-4 h-4" />} label="굵게" />
                        <ToolbarButton onClick={() => insertText('*', '*')} icon={<Italic className="w-4 h-4" />} label="기울임" />
                        <ToolbarButton onClick={() => insertText('# ')} icon={<Heading1 className="w-4 h-4" />} label="제목" />
                        <div className="w-px h-4 bg-gray-700/50 mx-2" />
                        <ToolbarButton onClick={() => insertText('`', '`')} icon={<Code className="w-4 h-4" />} label="코드" />
                        <ToolbarButton onClick={() => insertText('> ')} icon={<Quote className="w-4 h-4" />} label="인용" />
                        <ToolbarButton onClick={() => insertText('[', '](url)')} icon={<LinkIcon className="w-4 h-4" />} label="링크" />
                        <ToolbarButton onClick={() => insertText('![alt](', ')')} icon={<ImageIcon className="w-4 h-4" />} label="이미지" />

                        <div className="flex-grow" />

                        <button
                            onClick={() => setIsPreview(!isPreview)}
                            className={`p-2 rounded hover:bg-gray-700/50 transition-colors ${isPreview ? 'text-blue-400 bg-gray-700/50' : 'text-gray-400'}`}
                            title={isPreview ? "편집 모드" : "미리보기"}
                        >
                            {isPreview ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                    </div>

                    {/* Editor / Preview Area */}
                    <div className="flex-grow relative min-h-[500px]">
                        {isPreview ? (
                            <div className="absolute inset-0 p-6 overflow-y-auto prose prose-invert max-w-none">
                                <ReactMarkdown>{content || '*미리볼 내용이 없습니다*'}</ReactMarkdown>
                            </div>
                        ) : (
                            <textarea
                                id="editor-textarea"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="내용을 작성하세요..."
                                className="absolute inset-0 w-full h-full bg-transparent p-6 text-gray-300 resize-none outline-none font-mono leading-relaxed"
                            />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

function ToolbarButton({ onClick, icon, label }: { onClick: () => void; icon: React.ReactNode; label: string }) {
    return (
        <button
            onClick={onClick}
            className="p-2 rounded text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
            title={label}
        >
            {icon}
        </button>
    );
}
