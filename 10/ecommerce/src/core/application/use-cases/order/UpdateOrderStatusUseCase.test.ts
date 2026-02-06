
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdateOrderStatusUseCase } from './UpdateOrderStatusUseCase';
import { OrderRepository } from '../../interfaces/repositories/OrderRepository';
import { OrderStatus } from '@/core/domain/entities/order/OrderStatus';

describe('UpdateOrderStatusUseCase', () => {
    let useCase: UpdateOrderStatusUseCase;
    let mockRepository: OrderRepository;

    beforeEach(() => {
        mockRepository = {
            getOrders: vi.fn(),
            getOrderStats: vi.fn(),
            getOrderById: vi.fn(),
            updateOrderStatus: vi.fn(),
            updateTrackingNumber: vi.fn(),
        };
        useCase = new UpdateOrderStatusUseCase(mockRepository);
    });

    it('should call repository updateOrderStatus', async () => {
        await useCase.execute('1', OrderStatus.SHIPPING);
        expect(mockRepository.updateOrderStatus).toHaveBeenCalledWith('1', OrderStatus.SHIPPING);
    });
});
