import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetCustomerDetailUseCase } from './GetCustomerDetailUseCase';
import { ICustomerRepository } from '../../interfaces/ICustomerRepository';
import { CustomerDetail } from '@/core/domain/entities/CustomerDetail';

describe('GetCustomerDetailUseCase', () => {
    let useCase: GetCustomerDetailUseCase;
    let mockRepository: ICustomerRepository;

    const mockCustomerDetail: CustomerDetail = {
        profile: {
            id: '123',
            name: '김철수',
            email: 'test@example.com',
            phone: '010-1234-5678',
            joinedAt: new Date('2024-01-01'),
        },
        stats: {
            totalOrders: 15,
            totalAmount: 4500000,
            averageOrderAmount: 300000,
            isVip: true,
            grade: 'VIP',
        },
        orders: [
            {
                id: 'ord_001',
                summary: '게이밍 노트북',
                amount: 1500000,
                status: 'delivered',
                date: new Date('2024-12-01'),
            }
        ],
        categoryPreferences: [
            { category: '전자기기', percentage: 80 },
            { category: '의류', percentage: 15 },
            { category: '기타', percentage: 5 },
        ]
    };

    beforeEach(() => {
        mockRepository = {
            getCustomers: vi.fn(),
            getCustomerStats: vi.fn(),
            getCustomerDetail: vi.fn(),
        };
        useCase = new GetCustomerDetailUseCase(mockRepository);
    });

    it('should return customer detail when found', async () => {
        vi.mocked(mockRepository.getCustomerDetail).mockResolvedValue(mockCustomerDetail);

        const result = await useCase.execute('123');

        expect(mockRepository.getCustomerDetail).toHaveBeenCalledWith('123');
        expect(result).toEqual(mockCustomerDetail);
    });

    it('should return null when customer is not found', async () => {
        vi.mocked(mockRepository.getCustomerDetail).mockResolvedValue(null);

        const result = await useCase.execute('999');

        expect(mockRepository.getCustomerDetail).toHaveBeenCalledWith('999');
        expect(result).toBeNull();
    });

    it('should throw an error if repository fails', async () => {
        vi.mocked(mockRepository.getCustomerDetail).mockRejectedValue(new Error('DB Error'));

        await expect(useCase.execute('123')).rejects.toThrow('DB Error');
    });
});
