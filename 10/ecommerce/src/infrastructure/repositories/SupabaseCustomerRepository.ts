import { SupabaseClient } from "@supabase/supabase-js";
import { ICustomerRepository, GetCustomersParams, PaginatedResult, CustomerStats } from "@/core/application/interfaces/ICustomerRepository";
import { CustomerDetail } from "@/core/domain/entities/CustomerDetail";
import { Customer } from "@/core/domain/entities/Customer";

export class SupabaseCustomerRepository implements ICustomerRepository {
    constructor(private supabase: SupabaseClient) { }

    async getCustomers(params: GetCustomersParams): Promise<PaginatedResult<Customer>> {
        const { page, limit, search, sortBy, sortOrder } = params;
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        let query = this.supabase
            .from('customers_with_stats')
            .select('*', { count: 'exact' });

        if (search) {
            query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
        }

        if (sortBy) {
            // Map sortBy to column names
            const columnMap: Record<string, string> = {
                'joinedAt': 'created_at',
                'totalAmount': 'total_order_amount'
            };
            const column = columnMap[sortBy] || 'created_at';
            query = query.order(column, { ascending: sortOrder === 'asc' });
        } else {
            query = query.order('created_at', { ascending: false });
        }

        query = query.range(from, to);

        const { data, count, error } = await query;

        if (error) {
            throw new Error(error.message);
        }

        const customers: Customer[] = data.map((row: any) => ({
            id: row.id,
            email: row.email,
            name: row.name || row.email,
            role: row.role,
            isVip: row.is_vip,
            createdAt: new Date(row.created_at),
            orderCount: row.order_count,
            totalOrderAmount: row.total_order_amount
        }));

        return {
            data: customers,
            total: count || 0,
            page,
            limit,
            totalPages: Math.ceil((count || 0) / limit)
        };
    }

    async getCustomerStats(): Promise<CustomerStats> {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

        const [totalRes, newRes, vipRes] = await Promise.all([
            this.supabase.from('users').select('*', { count: 'exact', head: true }),
            this.supabase.from('users').select('*', { count: 'exact', head: true }).gte('created_at', startOfMonth),
            this.supabase.from('users').select('*', { count: 'exact', head: true }).eq('is_vip', true)
        ]);

        if (totalRes.error) throw new Error(totalRes.error.message);
        if (newRes.error) throw new Error(newRes.error.message);
        if (vipRes.error) throw new Error(vipRes.error.message);

        return {
            totalUsers: totalRes.count || 0,
            newUsersThisMonth: newRes.count || 0,
            vipUsers: vipRes.count || 0
        };
    }
    async getCustomerDetail(id: string): Promise<CustomerDetail | null> {
        // 1. Fetch User Profile
        const { data: userData, error: userError } = await this.supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single();

        if (userError || !userData) {
            return null;
        }

        // 2. Fetch Orders for History & Stats
        // Fetch all orders for stats, but we might want to limit if too many.
        // For now, let's fetch last 100 to calculate stats roughly or use customers_with_stats view for stats
        // and fetch recent 5 for history.
        // Let's use customers_with_stats for accurate pre-calculated stats if possible?
        // Actually, the view 'customers_with_stats' exists (used in getCustomers).
        // Let's use that for the base stats if simple enough.

        const { data: customerStatsView, error: viewError } = await this.supabase
            .from('customers_with_stats')
            .select('*')
            .eq('id', id)
            .single();

        // If view result exists, we use it for some stats. 
        // But we still need orders for history and categories.

        const { data: ordersData, error: ordersError } = await this.supabase
            .from('orders')
            .select('*, order_items(*, product:products(name, price, category:categories(name)))')
            .eq('user_id', id)
            .order('created_at', { ascending: false });

        if (ordersError) throw new Error(ordersError.message);

        const orders = ordersData || [];

        // Calculate Stats
        const totalOrders = orders.length;
        const totalAmount = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
        const averageOrderAmount = totalOrders > 0 ? Math.round(totalAmount / totalOrders) : 0;
        const isVip = userData.is_vip || false;

        // Category Preferences
        const categoryMap = new Map<string, number>();
        let totalItems = 0;

        orders.forEach(order => {
            if (order.order_items) {
                order.order_items.forEach((item: any) => {
                    // product.category is now an object { name: string } due to the join
                    const category = item.product?.category?.name || 'Unknown';
                    const quantity = item.quantity || 1;
                    categoryMap.set(category, (categoryMap.get(category) || 0) + quantity);
                    totalItems += quantity;
                });
            }
        });

        const categoryPreferences = Array.from(categoryMap.entries())
            .map(([category, count]) => ({
                category,
                percentage: totalItems > 0 ? Math.round((count / totalItems) * 100) : 0
            }))
            .sort((a, b) => b.percentage - a.percentage);

        // Map Orders to History Items
        const historyItems = orders.slice(0, 5).map(o => {
            // Summary: "First Product Name + N others"
            const firstItemName = o.order_items?.[0]?.product?.name || '상품';
            const otherCount = (o.order_items?.length || 0) - 1;
            const summary = otherCount > 0 ? `${firstItemName} 외 ${otherCount}건` : firstItemName;

            return {
                id: o.id,
                summary,
                amount: o.total_amount,
                status: o.status,
                date: new Date(o.created_at)
            };
        });

        return {
            profile: {
                id: userData.id,
                name: userData.name || userData.email.split('@')[0],
                email: userData.email,
                phone: userData.phone || '010-0000-0000', // Mock if missing
                joinedAt: new Date(userData.created_at),
                avatarUrl: userData.avatar_url
            },
            stats: {
                totalOrders,
                totalAmount,
                averageOrderAmount,
                isVip,
                grade: isVip ? 'VIP' : 'Regular'
            },
            orders: historyItems,
            categoryPreferences
        };
    }
}
