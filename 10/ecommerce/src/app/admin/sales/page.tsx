"use client";

import { useEffect, useState } from "react";
import SalesDashboardClient from "@/components/sales/SalesDashboardClient";
import { getSalesDashboardData } from "@/app/actions/sales.actions";
import { DashboardData } from "@/core/application/interfaces/ISalesRepository";

export default function SalesPage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [period, setPeriod] = useState("week");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                const result = await getSalesDashboardData(period as any);
                setData(result);
            } catch (error) {
                console.error("Failed to load sales data", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [period]);

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (!data) {
        return <div className="flex items-center justify-center min-h-screen">Failed to load data</div>;
    }

    return (
        <SalesDashboardClient
            data={data}
            period={period}
            onPeriodChange={setPeriod}
        />
    );
}
