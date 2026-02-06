
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SupabaseOrderRepository } from './SupabaseOrderRepository';
import { SupabaseClient } from '@supabase/supabase-js';
import { OrderStatus } from '../../core/domain/entities/order/OrderStatus';

const mockUpdateBuilder = {
    eq: vi.fn(),
};

// Mock Supabase Client
const mockSupabase = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnValue(mockUpdateBuilder),
    range: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
};

describe('SupabaseOrderRepository', () => {
    let repository: SupabaseOrderRepository;

    beforeEach(() => {
        vi.clearAllMocks();
        repository = new SupabaseOrderRepository(mockSupabase as unknown as SupabaseClient);
    });

    it('should map getOrderById response correctly', async () => {
        const mockResponse = {
            id: '123-456',
            created_at: new Date().toISOString(),
            total_amount: 50000,
            status: 'payment_completed', // matches OrderStatusType
            shipping_name: 'Receiver Name',
            shipping_phone: '010-1234-5678',
            shipping_address: 'Seoul, Korea',
            shipping_message: 'Leave at door',
            tracking_carrier: 'CJ',
            tracking_number: 'TRK123',
            user: {
                name: 'Customer Name',
                email: 'test@example.com',
                phone_number: '010-0000-0000',
                address: 'Home Address'
            },
            items: [
                {
                    quantity: 2,
                    unit_price: 25000,
                    product: {
                        id: 'prod1',
                        name: 'Test Product',
                        price: 25000,
                        images: ['img.jpg']
                    }
                }
            ]
        };

        mockSupabase.single.mockResolvedValue({ data: mockResponse, error: null });

        const order = await repository.getOrderById('123-456');

        expect(order).not.toBeNull();
        expect(order?.id).toBe('123-456');
        expect(order?.customerName).toBe('Customer Name');
        expect(order?.items).toHaveLength(1);
        expect(order?.items[0].productName).toBe('Test Product');
        expect(order?.items[0].unitPrice).toBe(25000);
        expect(order?.items[0].quantity).toBe(2);
        expect(order?.receiver?.name).toBe('Receiver Name');
        expect(order?.tracking?.trackingNumber).toBe('TRK123');
        expect(order?.status).toBe(OrderStatus.PAYMENT_COMPLETED);
    });

    it('should call updateOrderStatus correctly', async () => {
        // mockUpdateBuilder.eq returns a Promise-like result
        mockUpdateBuilder.eq.mockResolvedValue({ error: null });

        await repository.updateOrderStatus('123', OrderStatus.SHIPPING);

        expect(mockSupabase.from).toHaveBeenCalledWith('orders');
        expect(mockSupabase.update).toHaveBeenCalledWith({ status: OrderStatus.SHIPPING });
        expect(mockUpdateBuilder.eq).toHaveBeenCalledWith('id', '123');
    });
});
