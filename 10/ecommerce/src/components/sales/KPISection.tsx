import { SalesStats } from "@/core/domain/entities/SalesStats";
import { ArrowUp, ArrowDown } from "lucide-react";

interface Props {
    stats: SalesStats;
}

export default function KPISection({ stats }: Props) {
    const formatCurrency = (val: number) => val.toLocaleString() + "원";
    const formatNumber = (val: number) => val.toLocaleString();
    const formatPercent = (val: number) => val.toFixed(1) + "%";

    const cards = [
        { label: "총 매출", value: formatCurrency(stats.totalSales), change: stats.totalSalesChange },
        { label: "주문 수", value: formatNumber(stats.orderCount), change: stats.orderCountChange },
        { label: "객단가", value: formatCurrency(stats.averageOrderValue), change: stats.averageOrderValueChange },
        { label: "전환율", value: formatPercent(stats.conversionRate), change: stats.conversionRateChange },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {cards.map((card, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-500">{card.label}</p>
                    <div className="flex items-end justify-between mt-2">
                        <h3 className="text-2xl font-bold">{card.value}</h3>
                        <div className={`flex items-center text-sm ${card.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                            {card.change >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                            <span className="ml-1">{Math.abs(card.change)}%</span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">전월 대비</p>
                </div>
            ))}
        </div>
    );
}
