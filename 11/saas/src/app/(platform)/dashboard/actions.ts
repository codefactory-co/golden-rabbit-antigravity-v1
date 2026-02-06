'use server';

import { GetDashboardDataUseCase } from '@/src/core/application/use-cases/GetDashboardDataUseCase';
import { SupabaseSubscriptionRepository } from '@/src/infrastructure/repositories/SupabaseSubscriptionRepository';
import { SupabaseUsageRepository } from '@/src/infrastructure/repositories/SupabaseUsageRepository';
import { SupabaseActivityRepository } from '@/src/infrastructure/repositories/SupabaseActivityRepository';
import { createClient } from '@/lib/supabase/server';

export async function getDashboardData() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    const subscriptionRepo = new SupabaseSubscriptionRepository();
    const usageRepo = new SupabaseUsageRepository();
    const activityRepo = new SupabaseActivityRepository();

    const useCase = new GetDashboardDataUseCase(
        subscriptionRepo,
        usageRepo,
        activityRepo
    );

    const data = await useCase.execute(user.id);

    // Extract name from metadata or use email
    const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';

    return {
        ...data,
        userName,
    };
}

import { CancelSubscriptionUseCase } from "@/src/core/application/use-cases/payment/CancelSubscriptionUseCase";
import { revalidatePath } from "next/cache";

export async function cancelSubscriptionAction() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const subscriptionRepo = new SupabaseSubscriptionRepository();
    const useCase = new CancelSubscriptionUseCase(subscriptionRepo);

    await useCase.execute(user.id);

    revalidatePath('/dashboard');
    revalidatePath('/payment'); // In case they visit payment page
}
