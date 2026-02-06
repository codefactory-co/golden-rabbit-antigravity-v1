
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdateTrackingInfoUseCase } from './UpdateTrackingInfoUseCase';
import { OrderRepository } from '../../interfaces/repositories/OrderRepository';

describe('UpdateTrackingInfoUseCase', () => {
    let useCase: UpdateTrackingInfoUseCase;
    let mockRepository: OrderRepository;

    beforeEach(() => {
        mockRepository = {
            getOrders: vi.fn(),
            getOrderStats: vi.fn(),
            getOrderById: vi.fn(),
            updateOrderStatus: vi.fn(),
            updateTrackingNumber: vi.fn(),
        };
        useCase = new UpdateTrackingInfoUseCase(mockRepository);
    });

    it('should call repository updateTrackingNumber', async () => {
        await useCase.execute('1', 'CJ Logistics', '123456');
        expect(mockRepository.updateTrackingNumber).toHaveBeenCalledWith('1', 'CJ Logistics', '123456');
    });
});
