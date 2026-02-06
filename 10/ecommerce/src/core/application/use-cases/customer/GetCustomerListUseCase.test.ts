import { describe, it, expect, vi } from 'vitest';
import { GetCustomerListUseCase } from './GetCustomerListUseCase';
import { ICustomerRepository, GetCustomersParams, PaginatedResult } from '../../interfaces/ICustomerRepository';
import { Customer } from '@/core/domain/entities/Customer';
import { UserRole } from '@/core/domain/entities/User';

describe('GetCustomerListUseCase', () => {
    it('should call repository with correct parameters', async () => {
        // Arrange
        const mockRepo: ICustomerRepository = {
            getCustomers: vi.fn(),
            getCustomerStats: vi.fn(),
        };
        const useCase = new GetCustomerListUseCase(mockRepo);
        const params: GetCustomersParams = { page: 1, limit: 10, search: 'test' };

        // Act
        await useCase.execute(params);

        // Assert
        expect(mockRepo.getCustomers).toHaveBeenCalledWith(params);
    });

    it('should return paginated results from repository', async () => {
        // Arrange
        const mockCustomers: PaginatedResult<Customer> = {
            data: [
                {
                    id: '1',
                    email: 'test@test.com',
                    name: 'Test',
                    role: 'customer' as UserRole,
                    isVip: true,
                    createdAt: new Date(),
                    orderCount: 5,
                    totalOrderAmount: 100000
                }
            ],
            total: 1,
            page: 1,
            limit: 10,
            totalPages: 1
        };

        const mockRepo: ICustomerRepository = {
            getCustomers: vi.fn().mockResolvedValue(mockCustomers),
            getCustomerStats: vi.fn(),
        };
        const useCase = new GetCustomerListUseCase(mockRepo);

        // Act
        const result = await useCase.execute({ page: 1, limit: 10 });

        // Assert
        expect(result).toEqual(mockCustomers);
    });
});
