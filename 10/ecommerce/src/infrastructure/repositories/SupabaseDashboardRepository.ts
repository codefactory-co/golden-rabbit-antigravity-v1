
import { SupabaseClient } from '@supabase/supabase-js';
import { IDashboardRepository } from '@/core/application/interfaces/IDashboardRepository';
import { DashboardData } from '@/core/domain/entities/DashboardData';

export class SupabaseDashboardRepository implements IDashboardRepository {
    constructor(private supabase: SupabaseClient) { }

    async getDashboardData(): Promise<DashboardData> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);

        // 1. Fetch data for Metrics & Charts (Parallelize for performance)
        const [
            ordersResponse,
            usersResponse,
            productsResponse,
            recentOrdersResponse,
            categoriesResponse
        ] = await Promise.all([
            // Fetch orders from last 7 days + yesterday (for weekly chart vs metrics)
            this.supabase.from('orders')
                .select('*')
                .gte('created_at', weekAgo.toISOString())
                .order('created_at', { ascending: true }),

            // Fetch new customers (last 2 days for comparison)
            this.supabase.from('users')
                .select('id, created_at')
                .eq('role', 'customer')
                .gte('created_at', yesterday.toISOString()),

            // Fetch low stock items
            this.supabase.from('products')
                .select('id, stock')
                .lt('stock', 10),

            // Fetch recent orders table
            this.supabase.from('orders')
                .select('*, user:users(email), order_items(product:products(name))')
                .order('created_at', { ascending: false })
                .limit(5),

            // Fetch data for category stats (all time or recent? usually all time or monthly)
            // For accurate charts, let's just fetch order_items joined with categories
            this.supabase.from('order_items')
                .select('subtotal, product:products(category:categories(name))')
        ]);

        if (ordersResponse.error) throw new Error(ordersResponse.error?.message);
        if (usersResponse.error) throw new Error(usersResponse.error?.message);
        if (productsResponse.error) throw new Error(productsResponse.error?.message);
        if (recentOrdersResponse.error) throw new Error(recentOrdersResponse.error?.message);
        if (categoriesResponse.error) throw new Error(categoriesResponse.error?.message);

        const orders = ordersResponse.data || [];
        const newUsers = usersResponse.data || [];
        const lowStockProducts = productsResponse.data || [];
        const recentOrdersData = recentOrdersResponse.data || [];
        const categoryItems = categoriesResponse.data || [];

        // --- Calculate Metrics ---
        const todayOrders = orders.filter((o: any) => new Date(o.created_at) >= today);
        const yesterdayOrders = orders.filter((o: any) => {
            const d = new Date(o.created_at);
            return d >= yesterday && d < today;
        });

        const todaySales = todayOrders.reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0);
        const yesterdaySales = yesterdayOrders.reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0);
        const todaySalesChange = yesterdaySales === 0 ? (todaySales > 0 ? 100 : 0) : ((todaySales - yesterdaySales) / yesterdaySales) * 100;

        const newOrdersCount = todayOrders.length;
        const yesterdayOrdersCount = yesterdayOrders.length;
        const newOrdersChange = yesterdayOrdersCount === 0 ? (newOrdersCount > 0 ? 100 : 0) : ((newOrdersCount - yesterdayOrdersCount) / yesterdayOrdersCount) * 100;

        const todayUsers = newUsers.filter((u: any) => new Date(u.created_at) >= today).length;
        const yesterdayUsers = newUsers.filter((u: any) => {
            const d = new Date(u.created_at);
            return d >= yesterday && d < today;
        }).length;
        const newCustomersChange = yesterdayUsers === 0 ? (todayUsers > 0 ? 100 : 0) : ((todayUsers - yesterdayUsers) / yesterdayUsers) * 100;


        // --- Calculate Weekly Sales ---
        const weeklySalesMap = new Map<string, number>();
        // Initialize last 7 days with 0
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const key = d.toISOString().split('T')[0];
            weeklySalesMap.set(key, 0);
        }

        orders.forEach((o: any) => {
            const key = new Date(o.created_at).toISOString().split('T')[0];
            if (weeklySalesMap.has(key)) {
                weeklySalesMap.set(key, (weeklySalesMap.get(key) || 0) + (o.total_amount || 0));
            }
        });

        const weeklySales = Array.from(weeklySalesMap.entries()).map(([date, amount]) => ({
            date,
            amount,
        }));


        // --- Calculate Category Sales ---
        const categoryMap = new Map<string, number>();
        let totalCategorySales = 0;

        categoryItems.forEach((item: any) => {
            // item.product.category.name might be deeply nested
            const categoryName = item.product?.category?.name || 'Unknown';
            const amount = item.subtotal || 0;
            categoryMap.set(categoryName, (categoryMap.get(categoryName) || 0) + amount);
            totalCategorySales += amount;
        });

        const categorySales = Array.from(categoryMap.entries()).map(([categoryName, amount]) => ({
            categoryName,
            percentage: totalCategorySales === 0 ? 0 : Math.round((amount / totalCategorySales) * 100),
        }));


        // --- Format Recent Orders ---
        const recentOrders = recentOrdersData.map((o: any) => {
            const prodName = o.order_items?.[0]?.product?.name || 'Unknown Product';
            const extraItems = o.order_items?.length > 1 ? ` +${o.order_items.length - 1}` : '';

            return {
                id: o.id,
                orderNo: o.id.substring(0, 8).toUpperCase(),
                customerName: o.user?.email || 'Guest',
                productName: prodName + extraItems,
                amount: o.total_amount,
                status: o.status,
                createdAt: new Date(o.created_at),
            };
        });

        return {
            metrics: {
                todaySales,
                todaySalesChange,
                newOrders: newOrdersCount,
                newOrdersChange,
                newCustomers: todayUsers,
                newCustomersChange,
                lowStockItems: lowStockProducts.length,
            },
            weeklySales,
            categorySales,
            recentOrders,
        };
    }
}
