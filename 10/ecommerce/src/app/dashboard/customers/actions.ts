'use server';

import { createClient } from "@/utils/supabase/server";
import { SupabaseCustomerRepository } from "@/infrastructure/repositories/SupabaseCustomerRepository";
import { GetCustomerListUseCase } from "@/core/application/use-cases/customer/GetCustomerListUseCase";
import { GetCustomerStatsUseCase } from "@/core/application/use-cases/customer/GetCustomerStatsUseCase";
import { GetCustomersParams, ICustomerRepository } from "@/core/application/interfaces/ICustomerRepository";
import { GetCustomerDetailUseCase } from "@/core/application/use-cases/customer/GetCustomerDetailUseCase";
import { CustomerDetail } from "@/core/domain/entities/CustomerDetail";

export async function getCustomersAction(params: GetCustomersParams) {
    const supabase = await createClient();
    const repo = new SupabaseCustomerRepository(supabase);
    const useCase = new GetCustomerListUseCase(repo);
    return useCase.execute(params);
}

export async function getCustomerStatsAction() {
    const supabase = await createClient();
    const repo = new SupabaseCustomerRepository(supabase);
    const useCase = new GetCustomerStatsUseCase(repo);
    return useCase.execute();
}

export async function getCustomerDetailAction(id: string): Promise<CustomerDetail | null> {
    const supabase = await createClient();
    const customerRepository = new SupabaseCustomerRepository(supabase);
    const getCustomerDetailUseCase = new GetCustomerDetailUseCase(customerRepository);

    return getCustomerDetailUseCase.execute(id);
}
