'use client';

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { OrderStats } from "@/core/application/interfaces/repositories/OrderRepository";

interface OrderStatsTabsProps {
    stats: OrderStats;
}

export function OrderStatsTabs({ stats }: OrderStatsTabsProps) {
    const searchParams = useSearchParams();
    const currentStatus = searchParams.get('status') || 'all';

    const tabs = [
        { id: 'all', label: '전체', count: stats.total },
        { id: 'payment_pending', label: '결제대기', count: stats.paymentPending },
        { id: 'payment_completed', label: '결제완료', count: stats.paymentCompleted },
        { id: 'shipping', label: '배송중', count: stats.shipping },
        { id: 'delivered', label: '배송완료', count: stats.delivered },
    ];

    return (
        <div className="flex border-b w-full">
            {tabs.map((tab) => {
                const isActive = currentStatus === tab.id || (currentStatus === '' && tab.id === 'all');
                return (
                    <Link
                        key={tab.id}
                        href={`/admin/orders?status=${tab.id === 'all' ? '' : tab.id}`}
                        className={cn(
                            "px-6 py-3 text-sm font-medium border-b-2 transition-colors",
                            isActive
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        )}
                    >
                        {tab.label} <span className="ml-1 text-xs bg-gray-100 px-2 py-0.5 rounded-full">{tab.count}</span>
                    </Link>
                );
            })}
        </div>
    );
}
