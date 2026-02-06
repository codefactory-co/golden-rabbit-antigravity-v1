import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';
import ShareButton from '@/components/share-button';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function BlogPost({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: post, error } = await supabase
        .from('posts')
        .select(`
            id,
            title,
            content,
            image_url,
            created_at,
            category:categories(name)
        `)
        .eq('id', id)
        .single();

    if (error || !post) {
        notFound();
    }

    // Mock Author Data (consistent with PostList mock style)
    const authorIndex = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 4;
    const readTime = (id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 10) + 3;

    const author = {
        name: ['김지훈', '이서연', '박민수', '정하은'][authorIndex],
        avatarColor: 'bg-gradient-to-br from-blue-500 to-purple-500',
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#0B1120]">

            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Content Container */}
                <article className="max-w-4xl mx-auto">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm text-gray-400 hover:text-blue-400 transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        목록으로 돌아가기
                    </Link>
                    {/* Header */}
                    <header className="mb-8">
                        {post.category && (
                            <span className="inline-flex items-center px-3 py-1 rounded text-xs font-semibold bg-gray-800 text-blue-400 border border-gray-700/50 mb-6">
                                {Array.isArray(post.category) ? post.category[0]?.name : (post.category as any).name}
                            </span>
                        )}

                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            {post.title}
                        </h1>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-800 pb-8">
                            {/* Author & Meta */}
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full ${author.avatarColor} ring-2 ring-gray-800`}></div>
                                <div>
                                    <div className="text-sm font-medium text-white">
                                        {author.name}
                                    </div>
                                    <div className="flex items-center text-xs text-gray-400 gap-3 mt-1">
                                        <span className="flex items-center">
                                            <Calendar className="w-3 h-3 mr-1" />
                                            {new Date(post.created_at).toLocaleDateString('ko-KR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </span>
                                        <span className="flex items-center">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {readTime}분 소요
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Share Button */}
                            <ShareButton />
                        </div>
                    </header>

                    {/* Thumbnail */}
                    {post.image_url && (
                        <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-12 bg-gray-800 border border-gray-800">
                            <Image
                                src={post.image_url}
                                alt={post.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div className="prose prose-lg prose-invert max-w-none">
                        {post.content.split('\n').map((paragraph: string, index: number) => (
                            paragraph ? <p key={index} className="mb-4 text-gray-300 leading-relaxed font-light">{paragraph}</p> : <br key={index} />
                        ))}
                    </div>
                </article>
            </main>

            <Footer />
        </div>
    );
}
