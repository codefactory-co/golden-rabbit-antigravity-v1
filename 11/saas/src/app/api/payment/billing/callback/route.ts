import { NextRequest, NextResponse } from "next/server";
import { StartSubscriptionUseCase } from "@/src/core/application/use-cases/payment/StartSubscriptionUseCase";
import { RegisterBillingKeyUseCase } from "@/src/core/application/use-cases/payment/RegisterBillingKeyUseCase";
import { ExecuteBillingPaymentUseCase } from "@/src/core/application/use-cases/payment/ExecuteBillingPaymentUseCase";
import { SupabasePaymentRepository } from "@/src/infrastructure/repositories/SupabasePaymentRepository";
import { TossPaymentGateway } from "@/src/infrastructure/gateways/TossPaymentGateway";
import { SupabaseSubscriptionRepository } from "@/src/infrastructure/repositories/SupabaseSubscriptionRepository";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const authKey = searchParams.get("authKey");
    const customerKey = searchParams.get("customerKey");
    const code = searchParams.get("code");
    const plan = searchParams.get("plan") as 'Pro' | 'Enterprise' | null; // Default to Free if null?
    const amountStr = searchParams.get("amount");
    const amount = amountStr ? parseInt(amountStr) : 0;
    const message = searchParams.get("message");

    if (code) {
        return NextResponse.redirect(`${request.nextUrl.origin}/payment/fail?code=${code}&message=${message}`);
    }

    if (!authKey || !customerKey) {
        return NextResponse.redirect(`${request.nextUrl.origin}/payment/fail?message=Missing authKey or customerKey`);
    }

    try {
        const gateway = new TossPaymentGateway();
        const subscriptionRepo = new SupabaseSubscriptionRepository();
        const paymentRepo = new SupabasePaymentRepository();

        const registerBillingKeyUseCase = new RegisterBillingKeyUseCase(gateway, subscriptionRepo);
        const executeBillingPaymentUseCase = new ExecuteBillingPaymentUseCase(gateway, subscriptionRepo, paymentRepo);
        const startSubscriptionUseCase = new StartSubscriptionUseCase(registerBillingKeyUseCase, executeBillingPaymentUseCase);

        // Execute Start Subscription Flow (Register + First Payment)
        await startSubscriptionUseCase.execute({
            authKey,
            customerKey,
            plan: plan || 'Free',
            amount
        });

        return NextResponse.redirect(`${request.nextUrl.origin}/dashboard?payment=success`);

    } catch (error: any) {
        console.error("Billing Key Registration Failed:", error);
        return NextResponse.redirect(`${request.nextUrl.origin}/payment/fail?message=${encodeURIComponent(error.message)}`);
    }
}
