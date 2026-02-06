'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { CreateProductUseCase } from '../../../core/application/use-cases/product/CreateProductUseCase';
import { SupabaseProductRepository } from '../../../infrastructure/repositories/SupabaseProductRepository';
import { createClient } from '../../../utils/supabase/server';

export async function createProductAction(formData: FormData) {
    const supabase = await createClient();
    const productRepository = new SupabaseProductRepository(supabase);
    const createProductUseCase = new CreateProductUseCase(productRepository);

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = Number(formData.get('price'));
    const stock = Number(formData.get('stock'));
    const rawCategoryId = formData.get('categoryId');
    const categoryId = rawCategoryId ? Number(rawCategoryId) : null;

    // Handle image uploads
    const images: string[] = [];
    const imageFiles = formData.getAll('images') as File[];

    for (const file of imageFiles) {
        if (file.size > 0) {
            const extension = file.name.split('.').pop();
            const filename = `${crypto.randomUUID()}.${extension}`;
            const path = `products/${filename}`;
            const url = await productRepository.uploadImage(file, path);
            images.push(url);
        }
    }

    try {
        await createProductUseCase.execute({
            name,
            description,
            price,
            stock,
            categoryId,
            images,
        });
    } catch (error: any) {
        return { error: error.message };
    }

    revalidatePath('/admin/products');
    redirect('/admin/products');
}
