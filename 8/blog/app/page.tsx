import Footer from '@/components/Footer';
import CategoryFilter from '@/components/CategoryFilter';
import PostList from '@/components/PostList';
import Pagination from '@/components/Pagination';
import { createClient } from '@/utils/supabase/server';

const POSTS_PER_PAGE = 6;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const supabase = await createClient();
  const resolvedSearchParams = await searchParams;
  const selectedCategory = resolvedSearchParams.category;
  const currentPage = Math.max(1, Number(resolvedSearchParams.page) || 1);

  // Fetch categories
  const { data: categoriesData } = await supabase
    .from('categories')
    .select('id, name')
    .order('name');

  // Fetch posts
  let query = supabase
    .from('posts')
    .select(`
      id,
      title,
      content,
      image_url,
      created_at,
      category:categories(name)
    `)
    .order('created_at', { ascending: false });

  if (selectedCategory) {
    query = query.eq('category_id', selectedCategory);
  }

  const { data: rawPosts } = await query;
  const allPosts = rawPosts?.map((post) => ({
    ...post,
    category: Array.isArray(post.category) ? post.category[0] : post.category,
  })) || [];

  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  const safePage = Math.min(currentPage, Math.max(1, totalPages));
  const posts = allPosts.slice((safePage - 1) * POSTS_PER_PAGE, safePage * POSTS_PER_PAGE);

  const paginationSearchParams: Record<string, string> = {};
  if (selectedCategory) paginationSearchParams.category = selectedCategory;

  return (
    <div className="min-h-screen flex flex-col bg-[#0B1120]">

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-4">
            최신 글
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-gray-400 leading-relaxed">
            소프트웨어 개발에 대한 생각, 튜토리얼, 심층 분석. 모던 웹 기술, 시스템 프로그래밍, 클린 코드에 집중합니다.
          </p>
        </div>

        <CategoryFilter categories={categoriesData || []} />

        <PostList posts={posts} />

        <Pagination currentPage={safePage} totalPages={totalPages} searchParams={paginationSearchParams} />
      </main>

      <Footer />
    </div>
  );
}
