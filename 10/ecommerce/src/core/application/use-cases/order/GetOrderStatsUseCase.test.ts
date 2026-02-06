import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetOrderStatsUseCase } from './GetOrderStatsUseCase';
import { OrderRepository } from '../../interfaces/repositories/OrderRepository';

describe('GetOrderStatsUseCase', () => {
    let useCase: GetOrderStatsUseCase;
    let mockRepository: OrderRepository;

    beforeEach(() => {
        mockRepository = {
            getOrders: vi.fn(),
            getOrderStats: vi.fn().mockResolvedValue({
                total: 100,
                paymentPending: 10,
                paymentCompleted: 20,
                shipping: 30,
                delivered: 40,
                todayPending: 5,
            }),
        };
        useCase = new GetOrderStatsUseCase(mockRepository);
    });

    it('should return stats from repository', async () => {
        const result = await useCase.execute();

        expect(mockRepository.getOrderStats).toHaveBeenCalled();
        expect(result).toEqual({
            total: 100,
            paymentPending: 10,
            paymentCompleted: 20,
            shipping: 30,
            delivered: 40,
            todayPending: 5,
        });
    });
});
