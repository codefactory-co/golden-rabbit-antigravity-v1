
import Link from "next/link";
import { RecentOrder } from "@/core/domain/entities/DashboardData";

interface RecentOrdersTableProps {
    orders: RecentOrder[];
}

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'payment_completed':
                return <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">결제완료</span>;
            case 'preparing':
                return <span className="px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">준비중</span>;
            case 'shipping':
                return <span className="px-2 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full">배송중</span>;
            case 'delivered':
                return <span className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded-full">배송완료</span>;
            default:
                return <span className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 rounded-full">{status}</span>;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 flex justify-between items-center border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-800">최근 주문 목록</h3>
                <Link href="/dashboard/orders" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                    전체 보기
                </Link>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
                            <th className="px-6 py-4 font-medium">주문번호</th>
                            <th className="px-6 py-4 font-medium">고객명</th>
                            <th className="px-6 py-4 font-medium">상품</th>
                            <th className="px-6 py-4 font-medium">금액</th>
                            <th className="px-6 py-4 font-medium">상태</th>
                            <th className="px-6 py-4 font-medium">시간</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.orderNo}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{order.customerName}</td>
                                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{order.productName}</td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">₩{order.amount.toLocaleString()}</td>
                                <td className="px-6 py-4 text-sm">{getStatusBadge(order.status)}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
