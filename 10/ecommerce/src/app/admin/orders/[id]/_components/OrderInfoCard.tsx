
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Order } from "@/core/domain/entities/order/Order";
import { Calendar, CreditCard } from "lucide-react";

interface OrderInfoCardProps {
    order: Order;
}

export function OrderInfoCard({ order }: OrderInfoCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">주문 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">주문번호</span>
                    <span className="font-medium">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">주문일시</span>
                    <span className="font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {order.orderedAt.toLocaleString()}
                    </span>
                </div>
                <div className="border-t pt-4 mt-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">결제수단</span>
                        <span className="font-medium flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-gray-400" />
                            {order.paymentMethod || "카드 간편결제"} {/* Fallback just for demo if null */}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
