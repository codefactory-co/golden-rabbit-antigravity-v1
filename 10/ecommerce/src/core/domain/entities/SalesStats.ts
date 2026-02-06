export class SalesStats {
    constructor(
        public readonly totalSales: number,
        public readonly totalSalesChange: number, // percentage change
        public readonly orderCount: number,
        public readonly orderCountChange: number,
        public readonly averageOrderValue: number,
        public readonly averageOrderValueChange: number,
        public readonly conversionRate: number,
        public readonly conversionRateChange: number,
    ) { }
}
