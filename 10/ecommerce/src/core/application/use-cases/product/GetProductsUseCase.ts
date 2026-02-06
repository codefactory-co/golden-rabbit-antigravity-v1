
import { Product } from "../../../domain/entities/Product";
import { GetProductsParams, PaginatedResult, ProductRepository } from "../../interfaces/ProductRepository";

export class GetProductsUseCase {
    constructor(private productRepository: ProductRepository) { }

    async execute(params: GetProductsParams): Promise<PaginatedResult<Product>> {
        return this.productRepository.getProducts(params);
    }
}
