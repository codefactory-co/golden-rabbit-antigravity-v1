import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CustomerOrderHistoryItem } from "@/core/domain/entities/CustomerDetail";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface OrderHistoryCardProps {
    orders: CustomerOrderHistoryItem[];
}

export function OrderHistoryCard({ orders }: OrderHistoryCardProps) {
    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'delivered': return 'default'; // Using 'default' as standard badge (usually dark)
            case 'shipped': return 'secondary';
            case 'paid': return 'outline';
            case 'cancelled': return 'destructive';
            default: return 'secondary';
        }
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            'pending': '결제대기',
            'paid': '결제완료',
            'shipped': '배송중',
            'delivered': '배송완료',
            'cancelled': '취소됨',
            'refunded': '환불됨'
        };
        return labels[status] || status;
    };

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>주문 히스토리</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>주문번호</TableHead>
                            <TableHead>상품요약</TableHead>
                            <TableHead className="text-right">금액</TableHead>
                            <TableHead>상태</TableHead>
                            <TableHead className="text-right">날짜</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-medium text-xs text-muted-foreground">{order.id.slice(0, 8)}...</TableCell>
                                <TableCell>{order.summary}</TableCell>
                                <TableCell className="text-right">₩{order.amount.toLocaleString()}</TableCell>
                                <TableCell>
                                    <Badge variant={getStatusVariant(order.status) as any}>
                                        {getStatusLabel(order.status)}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right text-muted-foreground">
                                    {format(new Date(order.date), 'yyyy-MM-dd', { locale: ko })}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
