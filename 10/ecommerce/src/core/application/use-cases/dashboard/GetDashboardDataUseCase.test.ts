
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetDashboardDataUseCase } from './GetDashboardDataUseCase';
import { IDashboardRepository } from '../interfaces/IDashboardRepository';
import { DashboardData } from '../../domain/entities/DashboardData';

describe('GetDashboardDataUseCase', () => {
    let useCase: GetDashboardDataUseCase;
    let mockRepository: IDashboardRepository;

    const mockData: DashboardData = {
        metrics: {
            todaySales: 1000000,
            todaySalesChange: 10,
            newOrders: 50,
            newOrdersChange: 5,
            newCustomers: 20,
            newCustomersChange: 2,
            lowStockItems: 3,
        },
        weeklySales: [
            { date: '2023-10-01', amount: 100000 },
            { date: '2023-10-02', amount: 150000 },
        ],
        categorySales: [
            { categoryName: 'Electronics', percentage: 40 },
            { categoryName: 'Clothing', percentage: 60 },
        ],
        recentOrders: [
            {
                id: '1',
                orderNo: 'ORD-001',
                customerName: 'John Doe',
                productName: 'Widget',
                amount: 50000,
                status: 'payment_completed',
                createdAt: new Date(),
            },
        ],
    };

    beforeEach(() => {
        mockRepository = {
            getDashboardData: vi.fn(),
        };
        useCase = new GetDashboardDataUseCase(mockRepository);
    });

    it('should return dashboard data from the repository', async () => {
        // Arrange
        vi.mocked(mockRepository.getDashboardData).mockResolvedValue(mockData);

        // Act
        const result = await useCase.execute();

        // Assert
        expect(mockRepository.getDashboardData).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockData);
    });
});
