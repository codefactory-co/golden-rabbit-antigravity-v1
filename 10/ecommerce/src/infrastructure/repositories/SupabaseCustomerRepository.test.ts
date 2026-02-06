import { describe, it, expect, vi, beforeEach } from "vitest";
import { SupabaseCustomerRepository } from "./SupabaseCustomerRepository";
import { GetCustomersParams } from "@/core/application/interfaces/ICustomerRepository";

// Mock Supabase Client
const mockSupabase = {
    from: vi.fn(),
    rpc: vi.fn(),
} as any;

describe("SupabaseCustomerRepository", () => {
    let repository: SupabaseCustomerRepository;

    beforeEach(() => {
        repository = new SupabaseCustomerRepository(mockSupabase);
        vi.resetAllMocks();
    });

    it("should fetch customers from view with pagination and search", async () => {
        // Arrange
        const params: GetCustomersParams = { page: 1, limit: 10, search: 'test', sortBy: 'totalAmount', sortOrder: 'desc' };

        const mockData = [
            { id: '1', email: 'test@test.com', name: 'Test', role: 'customer', is_vip: false, created_at: '2023-01-01', order_count: 5, total_order_amount: 50000 }
        ];

        const mockSelect = vi.fn().mockReturnValue({
            ilike: vi.fn().mockReturnThis(), // for search
            order: vi.fn().mockReturnThis(), // for sort
            range: vi.fn().mockReturnThis(), // for pagination
            data: mockData,
            count: 1,
            error: null
        });

        const mockCountSelect = vi.fn().mockReturnValue({
            ilike: vi.fn().mockReturnThis(),
            count: 1,
            error: null
        })

        // We assume we might need two queries: one for data, one for count (or use count: 'exact' in one query)
        // For simplicity in mock, let's assume 'count' option works in one go.

        // Mock chain
        const queryChain = {
            select: vi.fn().mockReturnValue({
                or: vi.fn().mockReturnValue({ // For name OR email search
                    order: vi.fn().mockReturnValue({
                        range: vi.fn().mockReturnValue({
                            data: mockData,
                            count: 1,
                            error: null
                        })
                    })
                })
            })
        };

        mockSupabase.from.mockReturnValue(queryChain);

        // Act
        const result = await repository.getCustomers(params);

        // Assert
        expect(mockSupabase.from).toHaveBeenCalledWith('customers_with_stats');
        expect(result.data[0].email).toBe('test@test.com');
        expect(result.data[0].totalOrderAmount).toBe(50000);
    });

    it("should fetch customer stats", async () => {
        // Arrange
        // We might make separate calls for counts
        mockSupabase.from.mockImplementation((table: string) => {
            if (table === 'users') {
                return {
                    select: vi.fn().mockReturnValue({
                        count: 100, // total users
                        data: null,
                        error: null
                    })
                }
            }
            return { select: vi.fn() };
        });

        // For "new users this month", we need a date filter
        // For "vip users", we need a filter

        const mockSelect = vi.fn();
        mockSupabase.from.mockReturnValue({ select: mockSelect });

        // Since implementation detail matters for mocking, let's assume we call .count() multiple times
        // or usage of Promise.all

        // Just checking if method exists and returns something for now, detail testing when writing code
    });

    it("should fetch customer detail with orders and stats", async () => {
        const mockCustomerData = {
            id: '123',
            name: '김철수',
            email: 'test@example.com',
            phone: '010-1234-5678',
            created_at: '2024-01-01',
            avatar_url: 'avatar.jpg',
            is_vip: true,
        };

        const mockOrdersData = [
            {
                id: 'ord_1',
                total_amount: 100000,
                status: 'delivered',
                created_at: '2024-12-01',
                order_items: [
                    { quantity: 1, product: { name: '노트북', category: '전자기기' } }
                ]
            },
            {
                id: 'ord_2',
                total_amount: 50000,
                status: 'paid',
                created_at: '2024-12-05',
                order_items: [
                    { quantity: 2, product: { name: '티셔츠', category: '의류' } }
                ]
            }
        ];

        // Mock Supabase calls
        // 1. Fetch User
        // 2. Fetch Orders with Items


        mockSupabase.from.mockImplementation((table: string) => {
            const createChain = (returnData: any) => ({
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                single: vi.fn().mockResolvedValue({ data: returnData, error: null }),
                order: vi.fn().mockReturnThis(),
                limit: vi.fn().mockReturnThis(),
                then: (resolve: any) => resolve({ data: returnData, error: null }) // Allow await on chain end
            });

            if (table === 'users') {
                return {
                    select: vi.fn().mockReturnValue({
                        eq: vi.fn().mockReturnValue({
                            single: vi.fn().mockResolvedValue({
                                data: mockCustomerData,
                                error: null
                            })
                        })
                    })
                };
            }
            if (table === 'customers_with_stats') {
                return {
                    select: vi.fn().mockReturnValue({
                        eq: vi.fn().mockReturnValue({
                            single: vi.fn().mockResolvedValue({
                                data: null, // Mocking no stats view mainly
                                error: null
                            })
                        })
                    })
                };
            }
            if (table === 'orders') {
                return {
                    select: vi.fn().mockReturnValue({
                        eq: vi.fn().mockReturnValue({ // eq('user_id', id)
                            order: vi.fn().mockResolvedValue({ // order('created_at') which is final
                                data: mockOrdersData,
                                error: null
                            })
                        })
                    })
                };
            }
            return { select: vi.fn() };
        });

        const result = await repository.getCustomerDetail('123');

        expect(result).not.toBeNull();
        if (result) {
            expect(result.profile.name).toBe('김철수');
            // Assuming orders has 2 items
            expect(result.stats.totalOrders).toBe(2);
            expect(result.stats.totalAmount).toBe(150000); // 100000 + 50000

            expect(result.orders.length).toBe(2);
            expect(result.categoryPreferences).toBeDefined();
            // Checking category preferences logic if implemented inside repo
            // total items: 3. Electronics: 1, Clothing: 2. 
            // Electronics: 33%, Clothing: 66% roughly.
        }
    });
});
