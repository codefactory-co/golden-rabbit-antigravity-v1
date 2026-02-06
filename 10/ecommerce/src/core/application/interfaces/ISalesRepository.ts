import { SalesStats } from "../../domain/entities/SalesStats";
import { SalesTrend } from "../../domain/entities/SalesTrend";
import { ProductSales } from "../../domain/entities/ProductSales";
import { RegionalSales } from "../../domain/entities/RegionalSales";

export type Period = "week" | "month" | "quarter";

export interface DashboardData {
    stats: SalesStats;
    trends: SalesTrend[];
    bestSellers: ProductSales[];
    regionalSales: RegionalSales[];
    insights: string[];
}

export interface ISalesRepository {
    getDashboardData(period: Period): Promise<DashboardData>;
}
