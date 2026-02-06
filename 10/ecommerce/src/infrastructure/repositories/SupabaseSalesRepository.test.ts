import { describe, it, expect, vi, beforeEach } from "vitest";
import { SupabaseSalesRepository } from "./SupabaseSalesRepository";

// Mock Supabase Client
const mockSupabase = {
    from: vi.fn(),
} as any;

describe("SupabaseSalesRepository", () => {
    let repository: SupabaseSalesRepository;

    beforeEach(() => {
        repository = new SupabaseSalesRepository(mockSupabase);
        vi.resetAllMocks();
    });

    it("should fetch and transform data correctly", async () => {
        // Arrange
        const period = "month";

        // Mock Data
        const mockOrders = [
            { id: "1", total_amount: 1000, created_at: "2023-10-01T10:00:00Z", shipping_address: "Seoul, Gangnam", user_id: "u1" }, // Seoul
            { id: "2", total_amount: 2000, created_at: "2023-10-01T12:00:00Z", shipping_address: "Busan, Haeundae", user_id: "u2" }, // Busan
            { id: "3", total_amount: 3000, created_at: "2023-10-02T10:00:00Z", shipping_address: "Seoul, Jongno", user_id: "u1" },   // Seoul
        ];

        const mockOrderItems = [
            { product: { name: "Product A" }, quantity: 2, subtotal: 2000 }, // From Order 2 (simplifying association for mock)
            { product: { name: "Product B" }, quantity: 1, subtotal: 1000 },
            { product: { name: "Product A" }, quantity: 1, subtotal: 3000 },
        ];

        // Mock Chain for Orders
        const mockSelectOrders = vi.fn().mockReturnValue({
            gte: vi.fn().mockReturnThis(),
            lte: vi.fn().mockReturnThis(),
            data: mockOrders,
            error: null
        });

        // Mock Chain for Order Items (Best Sellers)
        const mockSelectOrderItems = vi.fn().mockReturnValue({
            gte: vi.fn().mockReturnThis(),
            lte: vi.fn().mockReturnThis(),
            in: vi.fn().mockReturnThis(),
            data: mockOrderItems,
            error: null
        });

        mockSupabase.from.mockImplementation((table: string) => {
            if (table === 'orders') return { select: mockSelectOrders };
            if (table === 'order_items') return { select: mockSelectOrderItems };
            return { select: vi.fn().mockReturnThis() };
        });

        // Act
        const result = await repository.getDashboardData(period as any);

        // Assert
        // Total Sales: 1000 + 2000 + 3000 = 6000
        expect(result.stats.totalSales).toBe(6000);
        // Order Count: 3
        expect(result.stats.orderCount).toBe(3);
        // Best Seller: Product A (Quantity 3)
        expect(result.bestSellers[0].productName).toBe("Product A");
        expect(result.bestSellers[0].salesCount).toBe(3);
        // Regional: Seoul 2, Busan 1 -> Seoul 66%, Busan 33%
        // (Exact sorting/rounding might differ, checking presence)
        const seoul = result.regionalSales.find(r => r.region.includes("Seoul"));
        expect(seoul).toBeDefined();
        expect(seoul?.percentage).toBeGreaterThan(60);
    });
});
