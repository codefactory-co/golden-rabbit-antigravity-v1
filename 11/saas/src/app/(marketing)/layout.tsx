import React from "react";
import { Navbar } from "@/src/components/common/Navbar";
import { Footer } from "@/src/components/common/Footer";
import { createClient } from "@/lib/supabase/server";
import { SupabaseSubscriptionRepository } from "@/src/infrastructure/repositories/SupabaseSubscriptionRepository";

export default async function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let planName = 'Free';
    if (user) {
        const subscriptionRepository = new SupabaseSubscriptionRepository();
        const subscription = await subscriptionRepository.getSubscription(user.id);
        if (subscription && subscription.status === 'Active') {
            planName = subscription.planName;
        }
    }

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
            <Navbar user={user} planName={planName} />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    );
}
