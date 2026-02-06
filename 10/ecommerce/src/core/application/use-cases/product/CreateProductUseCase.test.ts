
import { describe, it, expect, vi } from 'vitest';
import { CreateProductUseCase } from './CreateProductUseCase';
import { ProductRepository } from '../../interfaces/ProductRepository';

describe('CreateProductUseCase', () => {
    let useCase: CreateProductUseCase;
    let mockRepository: ProductRepository;

    beforeEach(() => {
        mockRepository = {
            getProducts: vi.fn(),
            deleteProduct: vi.fn(),
            deleteProducts: vi.fn(),
            create: vi.fn(),
            uploadImage: vi.fn(),
        } as unknown as ProductRepository;

        useCase = new CreateProductUseCase(mockRepository);
    });

    it('should create a product successfully', async () => {
        const input = {
            name: 'New Product',
            price: 1000,
            stock: 10,
            categoryId: 1,
            description: 'Description',
            images: ['image1.jpg'],
        };

        await useCase.execute(input);

        expect(mockRepository.create).toHaveBeenCalledTimes(1);
        expect(mockRepository.create).toHaveBeenCalledWith(expect.objectContaining({
            name: input.name,
            price: input.price,
            stock: input.stock,
            status: 'active', // Default status
        }));
    });

    it('should throw error if validation fails', async () => {
        const input = {
            name: '', // Invalid
            price: 1000,
            stock: 10,
        };

        await expect(useCase.execute(input)).rejects.toThrow('Product name is required');
    });
});
