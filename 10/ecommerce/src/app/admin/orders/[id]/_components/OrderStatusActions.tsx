
'use client';

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OrderStatus, OrderStatusType } from "@/core/domain/entities/order/OrderStatus";
import { useState } from "react";
import { updateOrderStatusAction } from "../actions";
import { useRouter } from "next/navigation";

interface OrderStatusActionsProps {
    orderId: string;
    currentStatus: OrderStatusType;
}

export function OrderStatusActions({ orderId, currentStatus }: OrderStatusActionsProps) {
    const [status, setStatus] = useState<OrderStatusType>(currentStatus);
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    const handleSave = async () => {
        if (status === currentStatus) return;

        setIsSaving(true);
        try {
            await updateOrderStatusAction(orderId, status);
            alert("주문 상태가 변경되었습니다.");
        } catch (error) {
            console.error(error);
            alert("상태 변경 실패");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (confirm("정말 주문을 취소하시겠습니까?")) {
            // Call cancel action (reuse updateStatus for now)
            updateOrderStatusAction(orderId, OrderStatus.CANCELLED);
        }
    };

    return (
        <div className="fixed bottom-0 right-0 left-64 bg-white border-t p-4 flex justify-between items-center z-50">
            <Button variant="destructive" onClick={handleCancel}>
                주문 취소
            </Button>

            <div className="flex items-center gap-2">
                <Select value={status} onValueChange={(val) => setStatus(val as OrderStatusType)}>
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="상태 변경" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={OrderStatus.PAYMENT_PENDING}>결제대기</SelectItem>
                        <SelectItem value={OrderStatus.PAYMENT_COMPLETED}>결제완료</SelectItem>
                        <SelectItem value={OrderStatus.PREPARING}>상품준비</SelectItem>
                        <SelectItem value={OrderStatus.SHIPPING}>배송중</SelectItem>
                        <SelectItem value={OrderStatus.DELIVERED}>배송완료</SelectItem>
                    </SelectContent>
                </Select>
                <Button onClick={handleSave} disabled={isSaving || status === currentStatus}>
                    {isSaving ? "저장중..." : "저장"}
                </Button>
            </div>
        </div>
    );
}
