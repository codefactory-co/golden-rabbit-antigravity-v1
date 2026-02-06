
import { getOrderDetailAction } from "./actions";
import { OrderProgress } from "./_components/OrderProgress";
import { OrderInfoCard } from "./_components/OrderInfoCard";
import { CustomerInfoCard } from "./_components/CustomerInfoCard";
import { OrderItemsCard } from "./_components/OrderItemsCard";
import { ShippingCard } from "./_components/ShippingCard";
import { OrderStatusActions } from "./_components/OrderStatusActions";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// Define PageProps explicitly
interface PageProps {
    params: Promise<{ id: string }>;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function OrderDetailPage(props: PageProps) {
    // Await params as required in Next.js 15
    const params = await props.params;
    const { id } = params;

    const orderData = await getOrderDetailAction(id);

    if (!orderData) {
        notFound();
    }

    // Convert to plain object and explicitly generic getters to properties
    // because Next.js cannot pass Class Instances to Client Components
    const order = {
        ...orderData,
        itemTotal: orderData.itemTotal,
        shippingCost: orderData.shippingCost,
        productSummary: orderData.productSummary,
    };

    return (
        <div className="pb-24"> {/* Padding bottom for fixed footer */}
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/orders">
                        <Button variant="ghost" size="icon">
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">주문 #{order.orderNumber}</h1>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" disabled>이전</Button>
                    <Link href="/admin/orders">
                        <Button variant="outline">목록</Button>
                    </Link>
                    <Button variant="outline" disabled>다음</Button>
                </div>
            </div>

            {/* Progress Bar */}
            <OrderProgress status={order.status} />

            <div className="grid grid-cols-12 gap-6 mt-6">
                {/* Left Column (8/12) */}
                <div className="col-span-8 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <OrderInfoCard order={order} />
                        <CustomerInfoCard order={order} />
                    </div>
                    <OrderItemsCard order={order} />
                </div>

                {/* Right Column (4/12) */}
                <div className="col-span-4 space-y-6">
                    <ShippingCard order={order} />
                    {/* Additional cards like Payment Details or Memo could go here */}
                </div>
            </div>

            {/* Fixed Footer Actions */}
            <OrderStatusActions orderId={order.id} currentStatus={order.status} />
        </div>
    );
}
