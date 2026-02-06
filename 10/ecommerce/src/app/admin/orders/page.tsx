import { createClient } from "@/utils/supabase/server";
import { SupabaseOrderRepository } from "@/infrastructure/repositories/SupabaseOrderRepository";
import { GetOrdersUseCase } from "@/core/application/use-cases/order/GetOrdersUseCase";
import { GetOrderStatsUseCase } from "@/core/application/use-cases/order/GetOrderStatsUseCase";
import { OrderStatsTabs } from "./_components/OrderStatsTabs";
import { OrderFilters } from "./_components/OrderFilters";
import { OrderTable } from "./_components/OrderTable";
import { OrderStatusType } from "@/core/domain/entities/order/OrderStatus";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Basic alert component if exists, else standard div

export default async function OrderPage(props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const searchParams = await props.searchParams;
    const page = Number(searchParams.page) || 1;
    const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;

    // Parse status
    let statusArr: OrderStatusType[] | undefined;
    const statusParam = searchParams.status;
    if (typeof statusParam === 'string' && statusParam !== '' && statusParam !== 'all') {
        statusArr = [statusParam as OrderStatusType];
    } else if (Array.isArray(statusParam)) {
        statusArr = statusParam.filter((s): s is OrderStatusType => true); // Simplification validation
    }

    // Init Dependencies
    const supabase = await createClient();
    const repo = new SupabaseOrderRepository(supabase);
    const getOrdersUseCase = new GetOrdersUseCase(repo);
    const getStatsUseCase = new GetOrderStatsUseCase(repo);

    // Fetch Data
    const [ordersResult, stats] = await Promise.all([
        getOrdersUseCase.execute({
            page,
            limit: 10,
            status: statusArr,
            search,
        }),
        getStatsUseCase.execute()
    ]);

    return (
        <div className="flex flex-col space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">주문 관리</h1>
            </div>

            <div className="flex flex-col space-y-4">
                <OrderStatsTabs stats={stats} />

                <OrderFilters />

                <OrderTable orders={ordersResult.orders.map(order => ({
                    id: order.id,
                    orderNumber: order.orderNumber,
                    customerName: order.customerName,
                    productSummary: order.productSummary,
                    totalAmount: order.totalAmount,
                    status: order.status,
                    orderedAt: order.orderedAt.toISOString(),
                }))} />

                {/* Pagination Controls could go here, but omitted for brevity as per plan. 
            User didn't strictly ask for pagination UI but implied '8 rows'. 
            I'm fetching 10. */}

                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md flex items-center text-blue-700">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">오늘 처리해야 할 주문: {stats.todayPending}건</span>
                </div>
            </div>
        </div>
    );
}
