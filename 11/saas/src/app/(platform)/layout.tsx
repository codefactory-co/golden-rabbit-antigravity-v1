import React from "react";
import { Sidebar } from "./_components/Sidebar";
import { Header } from "./_components/Header";
import { createClient } from "@/lib/supabase/server";
import { SupabaseSubscriptionRepository } from "@/src/infrastructure/repositories/SupabaseSubscriptionRepository";

export default async function PlatformLayout({
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
        <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark">
            <Sidebar />
            <div className="flex-1 flex flex-col h-full min-w-0">
                <Header user={user} planName={planName} />
                <main className="flex-1 flex flex-col overflow-hidden relative">
                    {children}
                </main>
            </div>
        </div>
    );
}
