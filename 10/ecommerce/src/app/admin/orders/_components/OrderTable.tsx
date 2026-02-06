'use client';

import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { OrderStatusType } from "@/core/domain/entities/order/OrderStatus";

export interface OrderSummary {
    id: string;
    orderNumber: string;
    customerName: string;
    productSummary: string;
    totalAmount: number;
    status: OrderStatusType;
    orderedAt: string; // Serialized date
}

interface OrderTableProps {
    orders: OrderSummary[];
}

export function OrderTable({ orders }: OrderTableProps) {
    const router = useRouter();

    const getBadgeVariant = (status: OrderStatusType) => {
        switch (status) {
            case 'payment_pending': return 'yellow';
            case 'payment_completed': return 'blue';
            case 'preparing': return 'blue'; // Grouped visually? Or 'blue' as well.
            case 'shipping': return 'purple';
            case 'delivered': return 'green';
            case 'cancelled': return 'destructive';
            default: return 'gray';
        }
    };

    const statusLabels: Record<OrderStatusType, string> = {
        payment_pending: '결제대기',
        payment_completed: '결제완료',
        preparing: '상품준비중',
        shipping: '배송중',
        delivered: '배송완료',
        cancelled: '주문취소'
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[120px]">주문번호</TableHead>
                        <TableHead className="w-[120px]">고객명</TableHead>
                        <TableHead>상품정보</TableHead>
                        <TableHead className="w-[120px] text-right">결제금액</TableHead>
                        <TableHead className="w-[100px] text-center">상태</TableHead>
                        <TableHead className="w-[150px] text-right">주문일시</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                주문 내역이 없습니다.
                            </TableCell>
                        </TableRow>
                    ) : (
                        orders.map((order) => (
                            <TableRow
                                key={order.id}
                                className="cursor-pointer hover:bg-gray-50"
                                onClick={() => router.push(`/admin/orders/${order.id}`)}
                            >
                                <TableCell className="font-medium">
                                    <Link href={`/admin/orders/${order.id}`} className="block w-full h-full">
                                        {order.orderNumber}
                                    </Link>
                                </TableCell>
                                <TableCell>{order.customerName}</TableCell>
                                <TableCell className="truncate max-w-[300px]">{order.productSummary}</TableCell>
                                <TableCell className="text-right">{order.totalAmount.toLocaleString()}원</TableCell>
                                <TableCell className="text-center">
                                    <Badge variant={getBadgeVariant(order.status)}>
                                        {statusLabels[order.status]}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    {new Date(order.orderedAt).toLocaleString('ko-KR', {
                                        year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
                                    })}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
