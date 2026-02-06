import { GetCategoriesUseCase } from '@/core/application/use-cases/product/GetCategoriesUseCase';
import { SupabaseProductRepository } from '@/infrastructure/repositories/SupabaseProductRepository';
import { createClient } from '@/utils/supabase/server';
import ProductForm from '../_components/ProductForm';

export default async function NewProductPage() {
    const supabase = await createClient();
    const productRepository = new SupabaseProductRepository(supabase);
    const getCategoriesUseCase = new GetCategoriesUseCase(productRepository);
    const categories = await getCategoriesUseCase.execute();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">상품 등록</h1>
            </div>

            <ProductForm categories={JSON.parse(JSON.stringify(categories))} />
        </div>
    );
}
