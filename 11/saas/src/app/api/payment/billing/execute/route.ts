import { NextRequest, NextResponse } from "next/server";
import { ExecuteBillingPaymentUseCase } from "@/src/core/application/use-cases/payment/ExecuteBillingPaymentUseCase";
import { TossPaymentGateway } from "@/src/infrastructure/gateways/TossPaymentGateway";
import { SupabaseSubscriptionRepository } from "@/src/infrastructure/repositories/SupabaseSubscriptionRepository";
import { SupabasePaymentRepository } from "@/src/infrastructure/repositories/SupabasePaymentRepository";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId } = body;

        if (!userId) {
            return NextResponse.json({ error: "Missing userId" }, { status: 400 });
        }

        const gateway = new TossPaymentGateway();
        const subRepo = new SupabaseSubscriptionRepository();
        const payRepo = new SupabasePaymentRepository();

        const useCase = new ExecuteBillingPaymentUseCase(gateway, subRepo, payRepo);

        await useCase.execute(userId);

        return NextResponse.json({ success: true, message: "Payment executed successfully" });

    } catch (error: any) {
        console.error("Execute Billing Payment Failed:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
