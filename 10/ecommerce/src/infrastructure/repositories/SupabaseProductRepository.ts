
import { SupabaseClient } from '@supabase/supabase-js';
import { GetProductsParams, PaginatedResult, ProductRepository } from '../../core/application/interfaces/ProductRepository';
import { Category } from '../../core/domain/entities/Category';
import { Product, ProductStatus } from '../../core/domain/entities/Product';

export class SupabaseProductRepository implements ProductRepository {
    constructor(private supabase: SupabaseClient) { }

    async getProducts(params: GetProductsParams): Promise<PaginatedResult<Product>> {
        const { page, limit, search, categoryId, status } = params;

        let query = this.supabase
            .from('products')
            .select('*', { count: 'exact' });

        if (search) {
            query = query.ilike('name', `%${search}%`);
        }

        if (categoryId) {
            query = query.eq('category_id', categoryId);
        }

        if (status) {
            query = query.eq('status', status);
        }

        const from = (page - 1) * limit;
        const to = from + limit - 1;

        const { data, count, error } = await query
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) {
            throw new Error(error.message);
        }

        const products = (data || []).map(this.mapToEntity);
        const total = count || 0;

        return {
            data: products,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async deleteProduct(id: string): Promise<void> {
        const { error } = await this.supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) {
            throw new Error(error.message);
        }
    }

    async deleteProducts(ids: string[]): Promise<void> {
        const { error } = await this.supabase
            .from('products')
            .delete()
            .in('id', ids);

        if (error) {
            throw new Error(error.message);
        }
    }

    async create(product: Product): Promise<void> {
        const { error } = await this.supabase
            .from('products')
            .insert({
                id: product.id,
                name: product.name,
                description: product.description,
                category_id: product.categoryId,
                price: product.price,
                stock: product.stock,
                status: product.status,
                images: product.images,
            });

        if (error) {
            throw new Error(error.message);
        }
    }

    async uploadImage(file: File, path: string): Promise<string> {
        const { data, error } = await this.supabase.storage
            .from('product-images')
            .upload(path, file);

        if (error) {
            throw new Error(error.message);
        }

        const { data: publicUrlData } = this.supabase.storage
            .from('product-images')
            .getPublicUrl(data.path);

        return publicUrlData.publicUrl;
    }

    async getCategories(): Promise<Category[]> {
        const { data, error } = await this.supabase
            .from('categories')
            .select('*')
            .order('id');

        if (error) {
            throw new Error(error.message);
        }

        return (data || []).map((item) => new Category(item.id, item.name));
    }

    private mapToEntity(data: any): Product {
        return new Product({
            id: data.id,
            name: data.name,
            description: data.description,
            categoryId: data.category_id,
            price: data.price,
            stock: data.stock,
            status: data.status as ProductStatus,
            images: data.images,
            createdAt: new Date(data.created_at),
            updatedAt: new Date(data.updated_at),
        });
    }
}
