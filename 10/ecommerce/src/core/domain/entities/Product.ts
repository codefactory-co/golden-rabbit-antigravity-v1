
export type ProductStatus = 'active' | 'out_of_stock' | 'draft';

export interface ProductProps {
    id: string;
    name: string;
    description?: string;
    categoryId?: number;
    price: number;
    stock: number;
    status: ProductStatus;
    images?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

export class Product {
    public readonly id: string;
    public readonly name: string;
    public readonly description?: string;
    public readonly categoryId?: number;
    public readonly price: number;
    public readonly stock: number;
    public readonly status: ProductStatus;
    public readonly images: string[];
    public readonly createdAt: Date;
    public readonly updatedAt: Date;

    constructor(props: ProductProps) {
        if (!props.name || props.name.trim() === '') {
            throw new Error('Product name is required');
        }
        if (props.price < 0) {
            throw new Error('Price must be greater than or equal to 0');
        }
        if (props.stock < 0) {
            throw new Error('Stock must be greater than or equal to 0');
        }

        this.id = props.id;
        this.name = props.name;
        this.description = props.description;
        this.categoryId = props.categoryId;
        this.price = props.price;
        this.stock = props.stock;
        this.status = props.status;
        this.images = props.images || [];
        this.createdAt = props.createdAt || new Date();
        this.updatedAt = props.updatedAt || new Date();
    }

    isLowStock(threshold: number = 10): boolean {
        return this.stock < threshold;
    }

    isOutOfStock(): boolean {
        return this.stock === 0 || this.status === 'out_of_stock';
    }
}
