
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SupabaseProductRepository } from './SupabaseProductRepository';
import { Product } from '../../core/domain/entities/Product';
import { SupabaseClient } from '@supabase/supabase-js';

// Mock Supabase Client
const mockSupabase = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    storage: {
        from: vi.fn().mockReturnThis(),
    },
};

describe('SupabaseProductRepository', () => {
    let repository: SupabaseProductRepository;

    beforeEach(() => {
        vi.clearAllMocks();
        repository = new SupabaseProductRepository(mockSupabase as unknown as SupabaseClient);
    });

    it('should fetch products with correct query parameters', async () => {
        // Mock successful response
        const mockData = [
            {
                id: '1',
                name: 'Test Product',
                price: 100,
                stock: 10,
                status: 'active',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                images: [],
                category_id: 1,
            },
        ];
        mockSupabase.range.mockResolvedValue({ data: mockData, count: 1, error: null });

        const result = await repository.getProducts({ page: 1, limit: 10 });

        expect(mockSupabase.from).toHaveBeenCalledWith('products');
        expect(mockSupabase.select).toHaveBeenCalledWith('*', { count: 'exact' });
        expect(mockSupabase.range).toHaveBeenCalledWith(0, 9);
        expect(result.data).toHaveLength(1);
        expect(result.data[0].id).toBe('1');
        expect(result.total).toBe(1);
    });

    it('should apply filters correctly', async () => {
        mockSupabase.range.mockResolvedValue({ data: [], count: 0, error: null });

        await repository.getProducts({
            page: 1,
            limit: 10,
            search: 'phone',
            categoryId: 2,
            status: 'active'
        });

        expect(mockSupabase.ilike).toHaveBeenCalledWith('name', '%phone%');
        expect(mockSupabase.eq).toHaveBeenCalledWith('category_id', 2);
        expect(mockSupabase.eq).toHaveBeenCalledWith('status', 'active');
    });
    it('should create a product', async () => {
        mockSupabase.insert.mockResolvedValue({ error: null });

        const product = new Product({
            id: '123',
            name: 'New Product',
            price: 1000,
            stock: 10,
            status: 'active',
            categoryId: 1,
            images: ['img1.jpg'],
        });

        await repository.create(product);

        expect(mockSupabase.from).toHaveBeenCalledWith('products');
        expect(mockSupabase.insert).toHaveBeenCalledWith(expect.objectContaining({
            id: '123',
            name: 'New Product',
            price: 1000,
            stock: 10,
            status: 'active',
            category_id: 1,
            images: ['img1.jpg'],
        }));
    });

    it('should upload an image', async () => {
        const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
        const mockPath = 'products/test.jpg';
        const mockPublicUrl = 'https://example.com/storage/v1/object/public/product-images/products/test.jpg';

        // Mock Storage API
        mockSupabase.storage.from.mockReturnValue({
            upload: vi.fn().mockResolvedValue({ data: { path: mockPath }, error: null }),
            getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: mockPublicUrl } }),
        });

        const result = await repository.uploadImage(mockFile, mockPath);

        expect(mockSupabase.storage.from).toHaveBeenCalledWith('product-images');
        expect(result).toBe(mockPublicUrl);
    });
});
