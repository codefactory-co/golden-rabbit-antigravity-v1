import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetOrdersUseCase } from './GetOrdersUseCase';
import { OrderRepository } from '../../interfaces/repositories/OrderRepository';
import { Order } from '@/core/domain/entities/order/Order';
import { OrderStatus } from '@/core/domain/entities/order/OrderStatus';

describe('GetOrdersUseCase', () => {
    let useCase: GetOrdersUseCase;
    let mockRepository: OrderRepository;

    const mockOrders: Order[] = [
        new Order({
            id: '1',
            orderNumber: 'ORD-001',
            customerName: 'John Doe',
            items: [{
                productId: 'p1',
                productName: 'Product A',
                unitPrice: 10000,
                quantity: 1
            }],
            totalAmount: 10000,
            status: OrderStatus.PAYMENT_COMPLETED,
            orderedAt: new Date()
        }),
    ];

    beforeEach(() => {
        mockRepository = {
            getOrders: vi.fn().mockResolvedValue({ orders: mockOrders, total: 1 }),
            getOrderStats: vi.fn(),
            getOrderById: vi.fn(),
            updateOrderStatus: vi.fn(),
            updateTrackingNumber: vi.fn(),
        };
        useCase = new GetOrdersUseCase(mockRepository);
    });

    it('should call repository with correct params', async () => {
        const params = { page: 1, limit: 10, search: 'John' };

        const result = await useCase.execute(params);

        expect(mockRepository.getOrders).toHaveBeenCalledWith(params);
        expect(result.orders).toHaveLength(1);
        expect(result.total).toBe(1);
    });
});
