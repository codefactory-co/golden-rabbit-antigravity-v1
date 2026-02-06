
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Order } from "@/core/domain/entities/order/Order";
import { Mail, Phone, User } from "lucide-react";

interface CustomerInfoCardProps {
    order: Order;
}

export function CustomerInfoCard({ order }: CustomerInfoCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">주문자 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-xs text-gray-500">회원</p>
                    </div>
                </div>

                <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{order.customerPhone || "전화번호 없음"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{order.customerEmail || "이메일 없음"}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
