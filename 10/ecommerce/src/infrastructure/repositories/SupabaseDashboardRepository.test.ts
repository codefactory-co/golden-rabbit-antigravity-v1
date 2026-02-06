
import { describe, it, expect, vi } from 'vitest';
import { SupabaseDashboardRepository } from './SupabaseDashboardRepository';
import { SupabaseClient } from '@supabase/supabase-js';

const createMockSupabase = () => {
    return {
        from: vi.fn(),
    } as unknown as SupabaseClient;
};

describe('SupabaseDashboardRepository', () => {
    it('should fetch and aggregate dashboard data correctly', async () => {
        const mockSupabase = createMockSupabase();

        // We mock the 'from' method to return specific structures based on the table argument
        (mockSupabase.from as any).mockImplementation((table: string) => {
            // Base builder with all used methods mocked
            const builder: any = {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                gte: vi.fn().mockReturnThis(),
                lt: vi.fn().mockReturnThis(),
                order: vi.fn().mockReturnThis(),
                limit: vi.fn().mockReturnThis(),
                then: null // Will be set per table
            };

            if (table === 'orders') {
                // For orders, we return data that simulates today sales, yesterday sales, etc.
                // Let's mock a simple scenario:
                // 1 order today: 1000
                // 1 order yesterday: 500 (so +100% growth)
                // 1 recent order logic will select the same or different. 
                // The code calls 'orders' twice. 
                // 1. last 7 days. 2. recent orders (limit 5).

                // To differentiate, we can check the 'limit' call or just return a superset.
                // But 'limit' is only called for recent orders.
                // Let's rely on the fact the code works as long as data fields exist.

                const today = new Date();
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);

                builder.then = (resolve: any) => resolve({
                    data: [
                        { id: 'today1', total_amount: 1000, created_at: today.toISOString(), status: 'payment_completed' },
                        { id: 'yest1', total_amount: 500, created_at: yesterday.toISOString(), status: 'payment_completed' }
                    ],
                    error: null
                });
                // BUT wait, recent orders expects 'user' and 'order_items'.
                // The first query uses select('*').
                // The second uses select('*, user:users...').
                // We need to support both roughly.

                // If we just include all fields in both, it shouldn't hurt.
                builder.then = (resolve: any) => resolve({
                    data: [
                        {
                            id: 'today1',
                            total_amount: 1000,
                            created_at: today.toISOString(),
                            status: 'payment_completed',
                            user: { email: 'today@test.com' },
                            order_items: [{ product: { name: 'P1' } }]
                        },
                        {
                            id: 'yest1',
                            total_amount: 500,
                            created_at: yesterday.toISOString(),
                            status: 'payment_completed',
                            user: { email: 'yest@test.com' },
                            order_items: [{ product: { name: 'P2' } }]
                        }
                    ],
                    error: null
                });

            } else if (table === 'users') {
                const today = new Date();
                builder.then = (resolve: any) => resolve({
                    data: [
                        { id: 'u1', created_at: today.toISOString(), role: 'customer' }
                    ],
                    error: null
                });
            } else if (table === 'products') {
                builder.then = (resolve: any) => resolve({
                    data: [
                        { id: 'p1', stock: 5 }
                    ],
                    error: null
                });
            } else if (table === 'order_items') {
                builder.then = (resolve: any) => resolve({
                    data: [
                        { subtotal: 100, product: { category: { name: 'Electronics' } } },
                        { subtotal: 100, product: { category: { name: 'Clothing' } } }
                    ],
                    error: null
                });
            } else {
                builder.then = (resolve: any) => resolve({ data: [], error: null });
            }
            return builder;
        });

        const repo = new SupabaseDashboardRepository(mockSupabase);

        const result = await repo.getDashboardData();

        expect(result).toBeDefined();

        // Verify Metrics
        // Today 1000. Yesterday 500. Growth (1000-500)/500 = 1 = 100%
        // Note: The mock date might be slightly off due to 'new Date()' timing, but roughly correct.
        expect(result.metrics.todaySales).toBe(1000);
        expect(result.metrics.todaySalesChange).toBe(100);

        expect(result.metrics.newOrders).toBe(1);
        expect(result.metrics.newOrdersChange).toBe(0); // 1 today vs 1 yesterday => 0% change

        expect(result.metrics.newCustomers).toBe(1); // 1 mock user today

        expect(result.metrics.lowStockItems).toBe(1);

        // Verify Collections
        expect(result.weeklySales).toBeDefined();
        expect(result.categorySales).toHaveLength(2); // Elec, Clothing
        expect(result.recentOrders).toHaveLength(2); // We returned 2 orders
    });
});
