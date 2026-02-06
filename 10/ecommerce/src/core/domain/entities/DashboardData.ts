
export interface DashboardMetrics {
    todaySales: number;
    todaySalesChange: number; // percentage
    newOrders: number;
    newOrdersChange: number; // percentage
    newCustomers: number;
    newCustomersChange: number; // percentage
    lowStockItems: number;
}

export interface WeeklySalesData {
    date: string; // YYYY-MM-DD
    amount: number;
}

export interface CategorySalesData {
    categoryName: string;
    percentage: number;
}

export interface RecentOrder {
    id: string;
    orderNo: string;
    customerName: string;
    productName: string;
    amount: number;
    status: 'payment_completed' | 'preparing' | 'shipping' | 'delivered';
    createdAt: Date;
}

export interface DashboardData {
    metrics: DashboardMetrics;
    weeklySales: WeeklySalesData[];
    categorySales: CategorySalesData[];
    recentOrders: RecentOrder[];
}
