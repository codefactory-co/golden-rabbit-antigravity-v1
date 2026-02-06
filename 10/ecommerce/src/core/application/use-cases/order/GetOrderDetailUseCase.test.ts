
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetOrderDetailUseCase } from './GetOrderDetailUseCase';
import { OrderRepository } from '../../interfaces/repositories/OrderRepository';
import { Order } from '@/core/domain/entities/order/Order';
import { OrderStatus } from '@/core/domain/entities/order/OrderStatus';

describe('GetOrderDetailUseCase', () => {
    let useCase: GetOrderDetailUseCase;
    let mockRepository: OrderRepository;

    const mockOrder = new Order({
        id: '1',
        orderNumber: 'ORD-001',
        customerName: 'John Doe',
        items: [{
            productId: 'p1',
            productName: 'iphone 13',
            unitPrice: 1000000,
            quantity: 1
        }],
        totalAmount: 1000000,
        status: OrderStatus.PAYMENT_COMPLETED,
        orderedAt: new Date()
    });

    beforeEach(() => {
        mockRepository = {
            getOrders: vi.fn(),
            getOrderStats: vi.fn(),
            getOrderById: vi.fn(),
            updateOrderStatus: vi.fn(),
            updateTrackingNumber: vi.fn(),
        };
        useCase = new GetOrderDetailUseCase(mockRepository);
    });

    it('should return order detail when order exists', async () => {
        vi.mocked(mockRepository.getOrderById).mockResolvedValue(mockOrder);

        const result = await useCase.execute('1');

        expect(mockRepository.getOrderById).toHaveBeenCalledWith('1');
        expect(result).toEqual(mockOrder);
    });

    it('should return null when order does not exist', async () => {
        vi.mocked(mockRepository.getOrderById).mockResolvedValue(null);

        const result = await useCase.execute('non-existent');

        expect(mockRepository.getOrderById).toHaveBeenCalledWith('non-existent');
        expect(result).toBeNull();
    });
});
