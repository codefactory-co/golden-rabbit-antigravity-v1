import { getDashboardData } from "./actions";
import { WelcomeSection } from "./_components/WelcomeSection";
import { SubscriptionCard } from "./_components/SubscriptionCard";
import { UsageCard } from "./_components/UsageCard";
import { ActivityFeed } from "./_components/ActivityFeed";

export default async function DashboardPage() {
    const data = await getDashboardData();
    const { userName, subscription, usage, activities } = data;

    return (
        <>
            <WelcomeSection userName={userName} subscription={subscription} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SubscriptionCard subscription={subscription} />
                <UsageCard usage={usage} />
                <ActivityFeed activities={activities} />
            </div>

            <div className="h-8"></div>
        </>
    );
}
