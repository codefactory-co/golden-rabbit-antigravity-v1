'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface Category {
    id: string;
    name: string;
}

export default function CategoryFilter({ categories }: { categories: Category[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get('category');

    const handleCategoryClick = (categoryId: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (categoryId) {
            params.set('category', categoryId);
        } else {
            params.delete('category');
        }
        router.push(`/?${params.toString()}`);
    };

    return (
        <div className="flex flex-wrap gap-2 mb-10 justify-start">
            <button
                onClick={() => handleCategoryClick(null)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${!currentCategory
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#1E293B] text-gray-400 hover:text-gray-200 hover:bg-[#2D3B4F]'
                    }`}
            >
                전체
            </button>
            {categories.map((category) => (
                <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${currentCategory === category.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-[#1E293B] text-gray-400 hover:text-gray-200 hover:bg-[#2D3B4F]'
                        }`}
                >
                    {category.name}
                </button>
            ))}
        </div>
    );
}
