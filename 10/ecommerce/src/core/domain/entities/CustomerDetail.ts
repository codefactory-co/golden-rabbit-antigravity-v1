export interface CustomerProfile {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatarUrl?: string;
    joinedAt: Date;
}

export interface CustomerStats {
    totalOrders: number;
    totalAmount: number;
    averageOrderAmount: number;
    isVip: boolean;
    grade: 'Regular' | 'VIP';
}

export interface CustomerOrderHistoryItem {
    id: string;
    summary: string;
    amount: number;
    status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
    date: Date;
}

export interface CustomerCategoryPreference {
    category: string;
    percentage: number;
}

export interface CustomerDetail {
    profile: CustomerProfile;
    stats: CustomerStats;
    orders: CustomerOrderHistoryItem[];
    categoryPreferences: CustomerCategoryPreference[];
}
