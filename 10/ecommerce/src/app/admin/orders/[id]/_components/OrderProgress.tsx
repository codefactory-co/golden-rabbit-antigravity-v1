
import { OrderStatus, OrderStatusType } from "@/core/domain/entities/order/OrderStatus";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface OrderProgressProps {
    status: OrderStatusType;
}

const STEPS = [
    { status: OrderStatus.PAYMENT_PENDING, label: "결제대기" },
    { status: OrderStatus.PAYMENT_COMPLETED, label: "결제완료" },
    { status: OrderStatus.PREPARING, label: "상품준비" },
    { status: OrderStatus.SHIPPING, label: "배송중" },
    { status: OrderStatus.DELIVERED, label: "배송완료" },
];

export function OrderProgress({ status }: OrderProgressProps) {
    const currentStepIndex = STEPS.findIndex(step => step.status === status);
    const isCancelled = status === OrderStatus.CANCELLED;

    if (isCancelled) {
        return (
            <div className="w-full bg-red-50 p-4 rounded-lg border border-red-200 text-center text-red-600 font-bold">
                주문 취소됨
            </div>
        );
    }

    return (
        <Card className="w-full">
            <CardContent className="py-6">
                <div className="flex items-center justify-between relative">
                    {/* Progress Bar Background */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-gray-100" />

                    {/* Active Progress Bar */}
                    <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-blue-600 transition-all duration-300"
                        style={{ width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }}
                    />

                    {STEPS.map((step, index) => {
                        const isCompleted = index <= currentStepIndex;
                        const isCurrent = index === currentStepIndex;

                        return (
                            <div key={step.status} className="flex flex-col items-center bg-white z-10 px-2">
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border transition-all duration-200",
                                    isCompleted ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-gray-200 text-gray-400",
                                )}>
                                    {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                                </div>
                                <span className={cn(
                                    "text-xs mt-2 font-medium",
                                    isCurrent ? "text-blue-600 font-bold" : "text-gray-500"
                                )}>
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
