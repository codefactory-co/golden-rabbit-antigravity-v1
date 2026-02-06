"use server";

import { createClient } from "@/infrastructure/config/supabase/server";
import { SupabaseSalesRepository } from "@/infrastructure/repositories/SupabaseSalesRepository";
import { GetSalesDashboardStatsUseCase } from "@/core/application/use-cases/sales/GetSalesDashboardStatsUseCase";
import { Period } from "@/core/application/interfaces/ISalesRepository";

export async function getSalesDashboardData(period: Period) {
    const supabase = await createClient();
    const salesRepository = new SupabaseSalesRepository(supabase);
    const getSalesDashboardStatsUseCase = new GetSalesDashboardStatsUseCase(salesRepository);

    const result = await getSalesDashboardStatsUseCase.execute(period);
    // Serialize to plain object to satisfy Next.js Client Component props requirement
    return JSON.parse(JSON.stringify(result));
}
