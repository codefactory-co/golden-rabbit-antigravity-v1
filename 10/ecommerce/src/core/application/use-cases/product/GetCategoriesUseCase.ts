
import { ProductRepository } from "../../interfaces/ProductRepository";
import { Category } from "../../domain/entities/Category";

export class GetCategoriesUseCase {
    constructor(private productRepository: ProductRepository) { }

    async execute(): Promise<Category[]> {
        return this.productRepository.getCategories();
    }
}
