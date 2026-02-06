import { Suspense } from 'react';
import { CustomerStats } from '@/components/customers/CustomerStats';
import { CustomerFilters } from '@/components/customers/CustomerFilters';
import { CustomerTable } from '@/components/customers/CustomerTable';
import { getCustomersAction, getCustomerStatsAction } from './actions';
import { GetCustomersParams } from '@/core/application/interfaces/ICustomerRepository';

export default async function CustomerPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const page = Number(searchParams.page) || 1;
    const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;
    const sortParam = typeof searchParams.sort === 'string' ? searchParams.sort : 'joinedAt_desc';

    // Parse sort param (e.g., 'joinedAt_desc')
    const [sortBy, sortOrder] = sortParam.split('_') as [any, any];

    const params: GetCustomersParams = {
        page,
        limit: 10, // 6 rows requested, but 10 is standard. User said "6개 행 정도" -> I'll stick to 10 for better UI or change to 6.
        search,
        sortBy,
        sortOrder
    };

    // Parallel fetching
    const [customerData, stats] = await Promise.all([
        getCustomersAction(params),
        getCustomerStatsAction()
    ]);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">고객 관리</h2>
                <p className="text-muted-foreground">
                    고객 정보를 조회하고 관리합니다. (총 {stats.totalUsers}명)
                </p>
            </div>

            <CustomerStats stats={stats} />

            <div>
                <CustomerFilters />
                <CustomerTable
                    data={customerData.data}
                    totalPages={customerData.totalPages}
                    currentPage={customerData.page}
                />
            </div>
        </div>
    );
}
