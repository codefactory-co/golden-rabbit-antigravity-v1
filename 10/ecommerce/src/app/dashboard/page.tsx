
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SupabaseDashboardRepository } from "@/infrastructure/repositories/SupabaseDashboardRepository";
import { GetDashboardDataUseCase } from "@/core/application/use-cases/dashboard/GetDashboardDataUseCase";
import { MetricsCard } from "@/components/dashboard/MetricsCard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { CategoryPieChart } from "@/components/dashboard/CategoryPieChart";
import { RecentOrdersTable } from "@/components/dashboard/RecentOrdersTable";

export default async function DashboardPage() {
    const cookieStore = await cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    // Server Actions or Middleware usually handle actual setting
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    );

    const repository = new SupabaseDashboardRepository(supabase);
    const useCase = new GetDashboardDataUseCase(repository);

    // Fetch Data
    const data = await useCase.execute();

    return (
        <div className="flex flex-col space-y-6">
            {/* 1. Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricsCard
                    title="오늘 매출"
                    value={`₩${data.metrics.todaySales.toLocaleString()}`}
                    change={data.metrics.todaySalesChange}
                />
                <MetricsCard
                    title="신규 주문"
                    value={`${data.metrics.newOrders}건`}
                    change={data.metrics.newOrdersChange}
                />
                <MetricsCard
                    title="신규 고객"
                    value={`${data.metrics.newCustomers}명`}
                    change={data.metrics.newCustomersChange}
                />
                <MetricsCard
                    title="재고 부족 상품"
                    value={`${data.metrics.lowStockItems}개`}
                    isWarning={data.metrics.lowStockItems > 0}
                />
            </div>

            {/* 2. Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <SalesChart data={data.weeklySales} />
                </div>
                <div>
                    <CategoryPieChart data={data.categorySales} />
                </div>
            </div>

            {/* 3. Recent Orders Table */}
            <RecentOrdersTable orders={data.recentOrders} />
        </div>
    );
}
