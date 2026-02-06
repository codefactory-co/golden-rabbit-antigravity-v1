
import { createClient } from '@/utils/supabase/server';
import { ProductListClient } from './_components/ProductListClient';
import { SupabaseProductRepository } from '@/infrastructure/repositories/SupabaseProductRepository';
import { GetProductsUseCase } from '@/core/application/use-cases/product/GetProductsUseCase';

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: { page?: string; search?: string; category?: string; status?: string };
}) {
    const supabase = await createClient();
    const repository = new SupabaseProductRepository(supabase);
    const useCase = new GetProductsUseCase(repository);

    const page = Number(searchParams.page) || 1;
    const limit = 10;

    // Need to parse category ID properly from string if it exists
    const categoryId = searchParams.category && searchParams.category !== 'all'
        ? Number(searchParams.category)
        : undefined;

    const results = await useCase.execute({
        page,
        limit,
        search: searchParams.search,
        categoryId,
        status: searchParams.status as any, // Type cast for now
    });

    const serializedData = {
        ...results,
        data: results.data.map((product) => ({
            ...product,
            isLowStock: product.isLowStock(),
        })),
    };

    return <ProductListClient initialData={serializedData} />;
}
