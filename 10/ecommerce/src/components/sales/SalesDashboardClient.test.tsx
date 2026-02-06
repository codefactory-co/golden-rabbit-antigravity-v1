import { render, screen } from "@testing-library/react";
import SalesDashboardClient from "./SalesDashboardClient";
import { DashboardData } from "@/core/application/interfaces/ISalesRepository";
import { describe, it, expect, vi } from "vitest";

const mockData: DashboardData = {
    stats: {
        totalSales: 1000000,
        totalSalesChange: 10,
        orderCount: 50,
        orderCountChange: 5,
        averageOrderValue: 20000,
        averageOrderValueChange: 2,
        conversionRate: 3.5,
        conversionRateChange: 0.5
    },
    trends: [
        { date: "2023-01-01", amout: 100 },
        { date: "2023-01-02", amout: 200 }
    ],
    bestSellers: [
        { rank: 1, productName: "Top Product", salesCount: 100 }
    ],
    regionalSales: [
        { region: "Seoul", percentage: 50 },
        { region: "Busan", percentage: 30 }
    ],
    insights: ["Insight 1", "Insight 2", "Insight 3"]
};

describe("SalesDashboardClient", () => {
    it("renders all sections correctly", () => {
        render(<SalesDashboardClient data={mockData} period="week" onPeriodChange={vi.fn()} />);

        // Header
        expect(screen.getByText("매출 분석")).toBeDefined();

        // KPIs
        expect(screen.getByText("총 매출")).toBeDefined();
        expect(screen.getByText("1,000,000원")).toBeDefined(); // Formatted

        // Sections
        expect(screen.getByText("일별 매출 추이")).toBeDefined();
        expect(screen.getByText("베스트셀러")).toBeDefined();
        expect(screen.getByText("지역별 판매")).toBeDefined();
        expect(screen.getByText("AI 인사이트")).toBeDefined();
    });
});
