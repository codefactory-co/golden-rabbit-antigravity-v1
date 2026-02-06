import { ISubscriptionRepository } from '@/src/core/application/interfaces/ISubscriptionRepository';
import { Subscription } from '@/src/core/domain/entities/Subscription';
import { createClient } from '@/lib/supabase/server';

export class SupabaseSubscriptionRepository implements ISubscriptionRepository {
    async getSubscription(userId: string): Promise<Subscription | null> {
        const supabase = await createClient();

        const { data } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (!data) {
            return null;
        }

        return {
            planName: data.plan_name,
            status: data.status.charAt(0).toUpperCase() + data.status.slice(1).toLowerCase() as 'Active' | 'Inactive' | 'Canceled',
            nextBillingDate: new Date(data.next_billing_date),
            amount: data.amount,
            paymentMethod: {
                brand: data.payment_method_brand,
                last4: data.payment_method_last4,
            },
            billingKey: data.billing_key,
        };
    }

    async upsertSubscription(userId: string, subscription: Subscription): Promise<void> {
        const supabase = await createClient();

        const { error } = await supabase
            .from('subscriptions')
            .upsert({
                user_id: userId,
                plan_name: subscription.planName,
                status: subscription.status.toUpperCase(),
                next_billing_date: subscription.nextBillingDate.toISOString(),
                amount: subscription.amount,
                payment_method_brand: subscription.paymentMethod?.brand,
                payment_method_last4: subscription.paymentMethod?.last4,
                billing_key: subscription.billingKey ?? null,
                updated_at: new Date().toISOString(),
            }, {
                onConflict: 'user_id'
            });

        if (error) {
            console.error('Error upserting subscription:', error);
            throw error;
        }
    }

    async findDueSubscriptions(): Promise<Subscription[]> {
        const supabase = await createClient();

        // KST is UTC+9
        const KST_OFFSET = 9 * 60 * 60 * 1000;
        const now = new Date();
        const nowKst = new Date(now.getTime() + KST_OFFSET);

        // Find Start of Tomorrow in KST
        const targetKst = new Date(nowKst);
        targetKst.setDate(targetKst.getDate() + 1);
        targetKst.setHours(0, 0, 0, 0);

        // Convert back to UTC for Database Query
        const comparisonDateUtc = new Date(targetKst.getTime() - KST_OFFSET).toISOString();

        const { data, error } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('status', 'ACTIVE')
            .lte('next_billing_date', comparisonDateUtc);

        if (error) {
            console.error('Error finding due subscriptions:', error);
            throw error;
        }

        if (!data) {
            return [];
        }

        return data.map(sub => ({
            userId: sub.user_id,
            planName: sub.plan_name,
            status: sub.status.charAt(0).toUpperCase() + sub.status.slice(1).toLowerCase() as 'Active' | 'Inactive' | 'Canceled',
            nextBillingDate: new Date(sub.next_billing_date),
            amount: sub.amount,
            paymentMethod: {
                brand: sub.payment_method_brand,
                last4: sub.payment_method_last4,
            },
            billingKey: sub.billing_key,
        }));
    }
}
