import { getCustomerDetailAction } from "../actions";
import { notFound } from "next/navigation";
import { CustomerProfileCard } from "@/components/customers/CustomerProfileCard";
import { CustomerSummaryCard } from "@/components/customers/CustomerSummaryCard";
import { OrderHistoryCard } from "@/components/customers/OrderHistoryCard";
import { CategoryPreferenceChart } from "@/components/customers/CategoryPreferenceChart";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function CustomerDetailPage(props: PageProps) {
    const params = await props.params;
    const customer = await getCustomerDetailAction(params.id);

    if (!customer) {
        notFound();
    }

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/customers">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">고객 상세</h1>
                    <p className="text-muted-foreground">고객 ID: {customer.profile.id}</p>
                </div>
                <div className="ml-auto">
                    {/* Add any page-level actions here if needed */}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Profile & Category Preferences */}
                <div className="lg:col-span-1 space-y-8">
                    <CustomerProfileCard profile={customer.profile} />
                    <CategoryPreferenceChart preferences={customer.categoryPreferences} />
                </div>

                {/* Right Column: Stats & Order History */}
                <div className="lg:col-span-2 space-y-8">
                    <CustomerSummaryCard stats={customer.stats} />
                    <OrderHistoryCard orders={customer.orders} />
                </div>
            </div>
        </div>
    );
}
