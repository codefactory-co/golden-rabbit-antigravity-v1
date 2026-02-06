"use server";

import { createClient } from "@/lib/supabase/server";
import { ProcessPaymentSuccessUseCase } from "@/src/core/application/use-cases/payment/ProcessPaymentSuccessUseCase";
import { InitiatePaymentUseCase } from "@/src/core/application/use-cases/payment/InitiatePaymentUseCase";
import { ProcessPaymentFailureUseCase } from "@/src/core/application/use-cases/payment/ProcessPaymentFailureUseCase";
import { TossPaymentGateway } from "@/src/infrastructure/gateways/TossPaymentGateway";
import { SupabaseSubscriptionRepository } from "@/src/infrastructure/repositories/SupabaseSubscriptionRepository";
import { SupabasePaymentRepository } from "@/src/infrastructure/repositories/SupabasePaymentRepository";

export async function processPaymentSuccessAction(orderId: string, paymentKey: string, amount: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const paymentGateway = new TossPaymentGateway();
    const subscriptionRepository = new SupabaseSubscriptionRepository();
    const paymentRepository = new SupabasePaymentRepository();

    const processPaymentSuccessUseCase = new ProcessPaymentSuccessUseCase(
        paymentGateway,
        subscriptionRepository,
        paymentRepository
    );

    await processPaymentSuccessUseCase.execute(user.id, paymentKey, orderId, amount);
}

export async function initiatePaymentAction(orderId: string, amount: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const paymentRepository = new SupabasePaymentRepository();
    const initiatePaymentUseCase = new InitiatePaymentUseCase(paymentRepository);

    await initiatePaymentUseCase.execute(orderId, user.id, amount);
}

export async function processPaymentFailureAction(orderId: string, message: string) {
    // Failure handling might not require auth strictly if we just update status by orderId
    // But better to check auth if possible. However, fail redirection happens for user.

    const paymentRepository = new SupabasePaymentRepository();
    const processPaymentFailureUseCase = new ProcessPaymentFailureUseCase(paymentRepository);

    await processPaymentFailureUseCase.execute(orderId, message);
}
