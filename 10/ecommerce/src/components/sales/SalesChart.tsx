"use client";

import { SalesTrend } from "@/core/domain/entities/SalesTrend";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
    trends: SalesTrend[];
}

export default function SalesChart({ trends }: Props) {
    return (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-bold mb-4">일별 매출 추이</h3>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trends}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(val) => val.slice(5)} // Show MM-DD
                        />
                        <YAxis
                            tick={{ fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(val) => `${val / 10000}만`}
                        />
                        <Tooltip
                            formatter={(val: any) => (val?.toLocaleString() || "0") + "원"}
                        />
                        <Line
                            type="monotone"
                            dataKey="amount"
                            stroke="#2563EB"
                            strokeWidth={3}
                            dot={false}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
