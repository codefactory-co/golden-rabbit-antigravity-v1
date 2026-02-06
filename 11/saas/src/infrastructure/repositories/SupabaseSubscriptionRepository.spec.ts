import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SupabaseSubscriptionRepository } from './SupabaseSubscriptionRepository';
import { createClient } from '@/lib/supabase/server';

vi.mock('@/lib/supabase/server', () => ({
    createClient: vi.fn(),
}));

describe('SupabaseSubscriptionRepository', () => {
    let repository: SupabaseSubscriptionRepository;
    const userId = 'user-123';

    beforeEach(() => {
        repository = new SupabaseSubscriptionRepository();
        vi.clearAllMocks();
    });

    it('should return subscription data when found', async () => {
        const mockSupabase = {
            from: vi.fn().mockReturnThis(),
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
                data: {
                    plan_name: 'Pro',
                    status: 'active',
                    next_billing_date: '2025-02-15T00:00:00Z',
                    amount: 9900,
                    payment_method_brand: 'Visa',
                    payment_method_last4: '4242',
                },
                error: null,
            }),
        };

        vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

        const result = await repository.getSubscription(userId);

        expect(createClient).toHaveBeenCalled();
        expect(mockSupabase.from).toHaveBeenCalledWith('subscriptions');
        expect(mockSupabase.select).toHaveBeenCalled();
        expect(mockSupabase.eq).toHaveBeenCalledWith('user_id', userId);

        expect(result).toEqual({
            planName: 'Pro',
            status: 'Active',
            nextBillingDate: new Date('2025-02-15T00:00:00Z'),
            amount: 9900,
            paymentMethod: {
                brand: 'Visa',
                last4: '4242',
            },
        });
    });

    it('should return null when no subscription found', async () => {
        const mockSupabase = {
            from: vi.fn().mockReturnThis(),
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
                data: null,
                error: { code: 'PGRST116', details: 'The result contains 0 rows' },
            }),
        };

        vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

        const result = await repository.getSubscription(userId);

        expect(result).toBeNull();
    });
});
