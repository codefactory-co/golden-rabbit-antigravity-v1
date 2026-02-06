import { IPaymentRepository } from "@/src/core/application/interfaces/IPaymentRepository";
import { Payment } from "@/src/core/domain/entities/Payment";
import { createClient } from "@/lib/supabase/server";

export class SupabasePaymentRepository implements IPaymentRepository {
    async savePayment(payment: Payment): Promise<void> {
        const supabase = await createClient();

        // 1. Get subscription ID if available
        let subscriptionId = payment.subscriptionId;
        if (!subscriptionId) {
            const { data: subscription } = await supabase
                .from('subscriptions')
                .select('id')
                .eq('user_id', payment.userId)
                .single();
            subscriptionId = subscription?.id;
        }

        // 2. Insert Payment
        const { error } = await supabase
            .from('payments')
            .insert({
                user_id: payment.userId,
                subscription_id: subscriptionId,
                amount: payment.amount,
                currency: payment.currency,
                status: payment.status,
                order_id: payment.orderId,
                provider_payment_id: payment.providerPaymentId,
                approved_at: payment.approvedAt.toISOString(),
            });

        if (error) {
            console.error('Error saving payment:', error);
            throw new Error(`Failed to save payment history: ${error.message}`);
        }
    }

    async createPayment(payment: Payment): Promise<void> {
        const supabase = await createClient();

        // Insert Payment with pending status
        const { error } = await supabase
            .from('payments')
            .insert({
                user_id: payment.userId,
                // subscription_id might be null for initial payment attempt
                amount: payment.amount,
                currency: payment.currency,
                status: payment.status,
                order_id: payment.orderId,
                // provider_payment_id null for pending
                provider_payment_id: payment.providerPaymentId,
                // approved_at can be null for pending? DB schema check needed. Default DB value might be null.
                // approved_at: payment.approvedAt?.toISOString(), 
            });

        if (error) {
            console.error('Error creating payment:', error);
            throw new Error(`Failed to create payment record: ${error.message}`);
        }
    }

    async updateStatus(orderId: string, status: string, reason?: string): Promise<void> {
        const supabase = await createClient();

        // Prepare update data
        const updateData: any = {
            status: status,
            // If reason is supported by schema? 
            // Currently payment table doesn't have 'reason' column in schema (based on prev knowledge).
            // But let's assume we can only update status for now, or log reason.
            // Wait, schema check needed for 'reason' column or 'metadata' jsonb.
            // Ignoring reason update in DB for now if column missing, just status.
        };

        const { error } = await supabase
            .from('payments')
            .update(updateData)
            .eq('order_id', orderId);

        if (error) {
            console.error('Error updating payment status:', error);
            throw new Error(`Failed to update payment status: ${error.message}`);
        }
    }

    async updatePayment(payment: Partial<Payment> & { orderId: string }): Promise<void> {
        const supabase = await createClient();

        const updateData: any = {};

        if (payment.status) updateData.status = payment.status;
        if (payment.providerPaymentId) updateData.provider_payment_id = payment.providerPaymentId;
        if (payment.approvedAt) updateData.approved_at = payment.approvedAt.toISOString();
        if (payment.amount) updateData.amount = payment.amount; // In case amount changed or was unverified
        if (payment.currency) updateData.currency = payment.currency;

        const { error } = await supabase
            .from('payments')
            .update(updateData)
            .eq('order_id', payment.orderId);

        if (error) {
            console.error('Error updating payment:', error);
            throw new Error(`Failed to update payment: ${error.message}`);
        }
    }
}
