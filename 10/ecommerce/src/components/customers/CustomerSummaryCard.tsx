import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerStats } from "@/core/domain/entities/CustomerDetail";
import { ShoppingBag, CreditCard, TrendingUp, Star } from "lucide-react";

interface CustomerSummaryCardProps {
    stats: CustomerStats;
}

export function CustomerSummaryCard({ stats }: CustomerSummaryCardProps) {
    const items = [
        {
            label: "총 주문",
            value: `${stats.totalOrders}건`,
            icon: ShoppingBag,
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            label: "총 구매액",
            value: `₩${stats.totalAmount.toLocaleString()}`,
            icon: CreditCard,
            color: "text-green-500",
            bg: "bg-green-500/10"
        },
        {
            label: "평균 주문",
            value: `₩${stats.averageOrderAmount.toLocaleString()}`,
            icon: TrendingUp,
            color: "text-purple-500",
            bg: "bg-purple-500/10"
        },
        {
            label: "등급",
            value: stats.grade,
            icon: Star,
            color: stats.isVip ? "text-yellow-500" : "text-gray-500",
            bg: stats.isVip ? "bg-yellow-500/10" : "bg-gray-500/10"
        }
    ];

    return (
        <div className="grid grid-cols-2 gap-4">
            {items.map((item, index) => (
                <Card key={index}>
                    <CardContent className="p-4 flex flex-col justify-between h-full">
                        <div className="flex justify-between items-start mb-2">
                            <div className={`p-2 rounded-lg ${item.bg}`}>
                                <item.icon className={`h-5 w-5 ${item.color}`} />
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground font-medium mb-1">{item.label}</p>
                            <h3 className="text-xl font-bold">{item.value}</h3>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
