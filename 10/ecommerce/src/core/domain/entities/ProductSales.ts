export class ProductSales {
    constructor(
        public readonly rank: number,
        public readonly productName: string,
        public readonly salesCount: number, // or amount, based on requirement "판매 수량"
    ) { }
}
