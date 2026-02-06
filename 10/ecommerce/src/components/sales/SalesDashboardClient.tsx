"use client";

import { DashboardData } from "@/core/application/interfaces/ISalesRepository";
import KPISection from "./KPISection";
import SalesChart from "./SalesChart";
import BestSellerList from "./BestSellerList";
import RegionalSalesChart from "./RegionalSalesChart";
import AIInsightCard from "./AIInsightCard";
import { Download } from "lucide-react";

interface Props {
    data: DashboardData;
    period: string;
    onPeriodChange: (p: string) => void;
}

export default function SalesDashboardClient({ data, period, onPeriodChange }: Props) {
    return (
        <div className="flex flex-col space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">매출 분석</h1>

                <div className="flex items-center gap-3 mt-4 md:mt-0">
                    <select
                        value={period}
                        onChange={(e) => onPeriodChange(e.target.value)}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="week">이번 주</option>
                        <option value="month">이번 달</option>
                        <option value="quarter">이번 분기</option>
                    </select>

                    <button className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-md text-sm hover:bg-gray-50">
                        <Download size={16} className="mr-2" />
                        내보내기
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <KPISection stats={data.stats} />

            {/* Main Chart */}
            <SalesChart trends={data.trends} />

            {/* Grid Layout for Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BestSellerList bestSellers={data.bestSellers} />
                <RegionalSalesChart regionalSales={data.regionalSales} />
            </div>

            {/* AI Insight */}
            <AIInsightCard insights={data.insights} />
        </div>
    );
}
