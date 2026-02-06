import { Product } from '../../../domain/entities/Product';
import { ProductRepository } from '../../interfaces/ProductRepository';

export interface CreateProductDTO {
    name: string;
    description?: string;
    price: number;
    stock: number;
    categoryId?: number;
    images?: string[];
}

export class CreateProductUseCase {
    constructor(private productRepository: ProductRepository) { }

    async execute(dto: CreateProductDTO): Promise<void> {
        const product = new Product({
            id: crypto.randomUUID(), // Generates a random UUID
            name: dto.name,
            description: dto.description,
            price: dto.price,
            stock: dto.stock,
            categoryId: dto.categoryId,
            status: 'active', // Default status for new products
            images: dto.images,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await this.productRepository.create(product);
    }
}
