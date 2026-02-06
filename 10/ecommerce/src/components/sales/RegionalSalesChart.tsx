"use client";

import { RegionalSales } from "@/core/domain/entities/RegionalSales";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface Props {
    regionalSales: RegionalSales[];
}

const COLORS = ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'];

export default function RegionalSalesChart({ regionalSales }: Props) {
    return (
        <div className="bg-white p-6 rounded-lg shadow h-full">
            <h3 className="text-lg font-bold mb-4">지역별 판매</h3>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={regionalSales} margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="region" type="category" width={50} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                        <Tooltip cursor={{ fill: 'transparent' }} formatter={(val: any) => `${val}%`} />
                        <Bar dataKey="percentage" barSize={20} radius={[0, 4, 4, 0]}>
                            {regionalSales.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
