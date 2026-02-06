import { describe, it, expect, vi } from 'vitest';
import { GetCustomerStatsUseCase } from './GetCustomerStatsUseCase';
import { ICustomerRepository, CustomerStats } from '../../interfaces/ICustomerRepository';

describe('GetCustomerStatsUseCase', () => {
    it('should return stats from repository', async () => {
        // Arrange
        const mockStats: CustomerStats = {
            totalUsers: 100,
            newUsersThisMonth: 10,
            vipUsers: 5
        };

        const mockRepo: ICustomerRepository = {
            getCustomers: vi.fn(),
            getCustomerStats: vi.fn().mockResolvedValue(mockStats),
        };
        const useCase = new GetCustomerStatsUseCase(mockRepo);

        // Act
        const result = await useCase.execute();

        // Assert
        expect(result).toEqual(mockStats);
        expect(mockRepo.getCustomerStats).toHaveBeenCalled();
    });
});
