import { SupabaseClient } from "@supabase/supabase-js";
import { ISalesRepository, DashboardData, Period } from "../../core/application/interfaces/ISalesRepository";
import { SalesStats } from "../../core/domain/entities/SalesStats";
import { SalesTrend } from "../../core/domain/entities/SalesTrend";
import { ProductSales } from "../../core/domain/entities/ProductSales";
import { RegionalSales } from "../../core/domain/entities/RegionalSales";

export class SupabaseSalesRepository implements ISalesRepository {
    constructor(private supabase: SupabaseClient) { }

    async getDashboardData(period: Period): Promise<DashboardData> {
        const { start, end } = this.getDateRange(period);
        const { start: prevStart, end: prevEnd } = this.getPreviousDateRange(period, start);

        // Fetch Current Period Data
        const currentOrders = await this.fetchOrders(start, end);
        const orderIds = currentOrders.map((o: any) => o.id);
        const currentItems = orderIds.length > 0 ? await this.fetchOrderItems(orderIds) : [];

        // Fetch Previous Period Data (for Stats Change)
        const prevOrders = await this.fetchOrders(prevStart, prevEnd);

        // 1. Calculate Stats
        const stats = this.calculateStats(currentOrders, prevOrders);

        // 2. Calculate Trends
        const trends = this.calculateTrends(currentOrders, start, end);

        // 3. Calculate Best Sellers
        const bestSellers = this.calculateBestSellers(currentItems);

        // 4. Calculate Regional Sales
        const regionalSales = this.calculateRegionalSales(currentOrders);

        // 5. Generate Insights (Mock for now)
        const insights = [
            "전자기기 매출이 전월 대비 23% 상승했습니다.",
            "주말 매출이 평일 대비 15% 높습니다.",
            "서울 지역 판매량이 전체의 45%를 차지합니다.",
        ];

        return {
            stats,
            trends,
            bestSellers,
            regionalSales,
            insights,
        };
    }

    private async fetchOrders(start: Date, end: Date) {
        const { data, error } = await this.supabase
            .from("orders")
            .select("*")
            .gte("created_at", start.toISOString())
            .lte("created_at", end.toISOString());

        if (error) throw new Error(error.message);
        return data || [];
    }

    private async fetchOrderItems(orderIds: string[]) {
        if (orderIds.length === 0) return [];

        const { data, error } = await this.supabase
            .from("order_items")
            .select("*, product:products(name)")
            .in("order_id", orderIds);

        if (error) throw new Error(error.message);
        return data || [];
    }

    private calculateStats(currentOrders: any[], prevOrders: any[]): SalesStats {
        const totalSales = currentOrders.reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0);
        const orderCount = currentOrders.length;
        const avgOrderValue = orderCount > 0 ? totalSales / orderCount : 0;

        // Simple Conversion Rate (Orders / Unique Users or constant baseline)
        // Since we don't have visitor data, we can use (Unique Users in Orders / Total Users) or just mockup.
        // Let's use Unique Users count as a proxy for "conversion quality" or just raw Orders count change.
        // The requirement asks for "Conversion Rate". Without "Sessions" data, this is impossible to calculate accurately.
        // I will mock it as (Orders / 100) * 100 for now or just 2.5% fixed if valid.
        // Or calculate it based on some heuristic.
        // Let's just return 0 for now or use `orderCount / 100`.
        const conversionRate = 2.5; // Dummy

        const prevTotalSales = prevOrders.reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0);
        const prevOrderCount = prevOrders.length;
        const prevAvgOrderValue = prevOrderCount > 0 ? prevTotalSales / prevOrderCount : 0;

        const totalSalesChange = this.calculatePercentageChange(totalSales, prevTotalSales);
        const orderCountChange = this.calculatePercentageChange(orderCount, prevOrderCount);
        const averageOrderValueChange = this.calculatePercentageChange(avgOrderValue, prevAvgOrderValue);
        // const conversionRateChange = ...

        return new SalesStats(
            totalSales,
            totalSalesChange,
            orderCount,
            orderCountChange,
            avgOrderValue,
            this.calculatePercentageChange(avgOrderValue, prevAvgOrderValue),
            conversionRate,
            0 // Change
        );
    }

    private calculateTrends(orders: any[], start: Date, end: Date): SalesTrend[] {
        // Group by Date
        const map = new Map<string, number>();

        // Initialize all days in range with 0
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            map.set(d.toISOString().split('T')[0], 0);
        }

        orders.forEach(o => {
            const date = o.created_at.split('T')[0];
            if (map.has(date)) {
                map.set(date, map.get(date)! + (o.total_amount || 0));
            }
        });

        return Array.from(map.entries()).map(([date, amount]) => new SalesTrend(date, amount));
    }

    private calculateBestSellers(items: any[]): ProductSales[] {
        const map = new Map<string, number>();

        items.forEach(item => {
            const name = item.product?.name || "Unknown";
            map.set(name, (map.get(name) || 0) + item.quantity);
        });

        return Array.from(map.entries())
            .map(([name, count], index) => new ProductSales(index + 1, name, count))
            .sort((a, b) => b.salesCount - a.salesCount)
            .slice(0, 5) // Top 5
            .map((item, index) => ({ ...item, rank: index + 1 } as ProductSales));
    }

    private calculateRegionalSales(orders: any[]): RegionalSales[] {
        const map = new Map<string, number>();
        const total = orders.length;

        orders.forEach(o => {
            const address = o.shipping_address || "";
            // Heuristic: First word is Region (e.g. "Seoul", "Gyeonggi")
            const region = address.split(' ')[0] || "Unknown";
            map.set(region, (map.get(region) || 0) + 1);
        });

        return Array.from(map.entries())
            .map(([region, count]) => new RegionalSales(region, total > 0 ? Math.round((count / total) * 100) : 0))
            .sort((a, b) => b.percentage - a.percentage);
    }

    private getDateRange(period: Period) {
        const end = new Date();
        const start = new Date();

        // To ensure consistency, set end to end of today? Or just now.
        // Usually dashboards show "up to now" or "yesterday".
        // Let's use "now".

        if (period === 'week') {
            start.setDate(end.getDate() - 7);
        } else if (period === 'month') {
            start.setMonth(end.getMonth() - 1);
        } else if (period === 'quarter') {
            start.setMonth(end.getMonth() - 3);
        }
        return { start, end };
    }

    private getPreviousDateRange(period: Period, currentStart: Date) {
        const end = new Date(currentStart);
        const start = new Date(currentStart);

        if (period === 'week') {
            start.setDate(end.getDate() - 7);
        } else if (period === 'month') {
            start.setMonth(end.getMonth() - 1);
        } else if (period === 'quarter') {
            start.setMonth(end.getMonth() - 3);
        }
        return { start, end };
    }

    private calculatePercentageChange(current: number, previous: number): number {
        if (previous === 0) return current === 0 ? 0 : 100;
        return Math.round(((current - previous) / previous) * 100);
    }
}
