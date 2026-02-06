import { describe, it, expect, vi, beforeEach } from "vitest";
import { GetSalesDashboardStatsUseCase } from "./GetSalesDashboardStatsUseCase";
import { ISalesRepository, DashboardData } from "../../interfaces/ISalesRepository";
import { SalesStats } from "../../../domain/entities/SalesStats";
import { SalesTrend } from "../../../domain/entities/SalesTrend";
import { ProductSales } from "../../../domain/entities/ProductSales";
import { RegionalSales } from "../../../domain/entities/RegionalSales";

// Mock Repository
const mockSalesRepository: ISalesRepository = {
    getDashboardData: vi.fn(),
};

describe("GetSalesDashboardStatsUseCase", () => {
    let useCase: GetSalesDashboardStatsUseCase;

    beforeEach(() => {
        useCase = new GetSalesDashboardStatsUseCase(mockSalesRepository);
        vi.resetAllMocks();
    });

    it("should return dashboard data for a given period", async () => {
        // Arrange
        const mockData: DashboardData = {
            stats: new SalesStats(1000, 10, 50, 5, 200, 2, 5.0, 0.5),
            trends: [new SalesTrend("2023-01-01", 100)],
            bestSellers: [new ProductSales(1, "Product A", 10)],
            regionalSales: [new RegionalSales("Seoul", 50)],
        };

        (mockSalesRepository.getDashboardData as any).mockResolvedValue(mockData);

        // Act
        const result = await useCase.execute("week");

        // Assert
        expect(mockSalesRepository.getDashboardData).toHaveBeenCalledWith("week");
        expect(result).toEqual(mockData);
    });
});
