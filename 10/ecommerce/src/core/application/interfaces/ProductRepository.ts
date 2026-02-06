
import { Category } from "../../domain/entities/Category";
import { Product, ProductStatus } from "../../domain/entities/Product";

export interface GetProductsParams {
    page: number;
    limit: number;
    search?: string;
    categoryId?: number;
    status?: ProductStatus;
}

export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ProductRepository {
    getProducts(params: GetProductsParams): Promise<PaginatedResult<Product>>;
    deleteProduct(id: string): Promise<void>;
    deleteProducts(ids: string[]): Promise<void>;
    create(product: Product): Promise<void>;
    uploadImage(file: File, path: string): Promise<string>;
    getCategories(): Promise<Category[]>;
}
