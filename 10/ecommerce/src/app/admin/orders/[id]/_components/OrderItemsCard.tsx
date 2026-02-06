
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Order } from "@/core/domain/entities/order/Order";
import Image from "next/image";

interface OrderItemsCardProps {
    order: Order;
}

export function OrderItemsCard({ order }: OrderItemsCardProps) {
    const itemTotal = order.itemTotal;
    const shippingCost = order.shippingCost;
    const grandTotal = itemTotal + shippingCost;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">주문 상품</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {order.items.map((item, idx) => (
                        <div key={idx} className="flex gap-4 items-center border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                            <div className="w-16 h-16 bg-gray-50 rounded-md overflow-hidden relative border border-gray-100 flex-shrink-0">
                                {item.productImage ? (
                                    <Image
                                        src={item.productImage}
                                        alt={item.productName}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                                        No Img
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-sm">{item.productName}</p>
                                <div className="text-sm text-gray-500 mt-1">
                                    {item.unitPrice.toLocaleString()}원 × {item.quantity}개
                                </div>
                            </div>
                            <div className="text-right font-medium">
                                {(item.unitPrice * item.quantity).toLocaleString()}원
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 space-y-2 bg-gray-50/50 -mx-6 -mb-6 p-6">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">상품합계</span>
                        <span>{itemTotal.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">배송비</span>
                        <span>{shippingCost.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 mt-2">
                        <span>총 결제금액</span>
                        <span className="text-blue-600">{grandTotal.toLocaleString()}원</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
