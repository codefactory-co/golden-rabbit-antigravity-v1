
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetProductsUseCase } from './GetProductsUseCase';
import { ProductRepository } from '../../interfaces/ProductRepository';
import { Product } from '../../../domain/entities/Product';

describe('GetProductsUseCase', () => {
    let useCase: GetProductsUseCase;
    let mockRepo: ProductRepository;

    beforeEach(() => {
        mockRepo = {
            getProducts: vi.fn(),
            deleteProduct: vi.fn(),
            deleteProducts: vi.fn(),
        };
        useCase = new GetProductsUseCase(mockRepo);
    });

    it('should call repository with correct parameters', async () => {
        const params = { page: 1, limit: 10, search: 'test', categoryId: 1 };

        // Mock return value
        const mockResult = {
            data: [],
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0,
        };
        vi.mocked(mockRepo.getProducts).mockResolvedValue(mockResult);

        const result = await useCase.execute(params);

        expect(mockRepo.getProducts).toHaveBeenCalledWith(params);
        expect(result).toEqual(mockResult);
    });
});
