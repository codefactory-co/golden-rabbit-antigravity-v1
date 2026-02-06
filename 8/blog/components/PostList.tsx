import Image from 'next/image';
import Link from 'next/link';

interface Post {
    id: string;
    title: string;
    content: string;
    image_url: string | null;
    created_at: string;
    category: {
        name: string;
    } | null;
}

export default function PostList({ posts }: { posts: Post[] }) {
    if (posts.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-gray-500 text-lg">게시글이 없습니다.</p>
            </div>
        )
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
                <Link
                    href={`/blog/${post.id}`}
                    key={post.id}
                    className="group flex flex-col h-full bg-[#1E293B] rounded-xl overflow-hidden hover:ring-2 hover:ring-blue-500/50 transition-all duration-300"
                >
                    {/* Image Section */}
                    <div className="relative h-48 w-full overflow-hidden bg-gray-800">
                        {post.image_url ? (
                            <Image
                                src={post.image_url}
                                alt={post.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600">
                                이미지 없음
                            </div>
                        )}

                        {/* Category Badge - Overlay on image */}
                        {post.category && (
                            <div className="absolute top-4 left-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-gray-900/80 text-blue-400 backdrop-blur-sm border border-gray-700/50">
                                    {post.category.name}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Content Section */}
                    <div className="p-5 flex flex-col flex-grow">
                        {/* Meta Info */}
                        <div className="flex items-center text-xs text-gray-500 mb-2 space-x-2">
                            <span>{new Date(post.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            <span>•</span>
                            <span>{(post.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 10) + 3}분 소요</span>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors">
                            {post.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
                            {post.content}
                        </p>

                        {/* Author Section (Mocked) */}
                        <div className="mt-auto pt-4 flex items-center gap-3 border-t border-gray-700/50">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex-shrink-0"></div>
                            <span className="text-xs font-medium text-gray-300">
                                {['김지훈', '이서연', '박민수', '정하은'][(post.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 4)]}
                            </span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
