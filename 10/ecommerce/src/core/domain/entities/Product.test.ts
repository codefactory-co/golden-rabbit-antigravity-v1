
import { describe, it, expect } from 'vitest';
import { Product } from './Product';

describe('Product Entity', () => {
    it('should create a valid product', () => {
        const product = new Product({
            id: '123',
            name: 'Test Product',
            price: 1000,
            stock: 10,
            status: 'active',
            images: ['img.jpg'],
            categoryId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        expect(product.id).toBe('123');
        expect(product.name).toBe('Test Product');
        expect(product.price).toBe(1000);
    });

    describe('Stock Status Logic', () => {
        it('should be low stock if stock is less than threshold (10)', () => {
            const product = new Product({
                id: '1',
                name: 'Low Stock Item',
                price: 100,
                stock: 5,
                status: 'active',
            });
            // Assuming default threshold is 10
            expect(product.isLowStock()).toBe(true);
        });

        it('should NOT be low stock if stock is equal to threshold', () => {
            const product = new Product({
                id: '1',
                name: 'Normal Item',
                price: 100,
                stock: 10,
                status: 'active',
            });
            expect(product.isLowStock()).toBe(false);
        });

        it('should be out of stock if stock is 0', () => {
            const product = new Product({
                id: '1',
                name: 'Empty Item',
                price: 100,
                stock: 0,
                status: 'out_of_stock',
            });
            expect(product.isOutOfStock()).toBe(true);
        });
    });

    describe('Validation', () => {
        it('should throw error if name is empty', () => {
            expect(() => {
                new Product({
                    id: '123',
                    name: '',
                    price: 1000,
                    stock: 10,
                    status: 'active',
                });
            }).toThrow('Product name is required');
        });

        it('should throw error if price is negative', () => {
            expect(() => {
                new Product({
                    id: '123',
                    name: 'Product',
                    price: -100,
                    stock: 10,
                    status: 'active',
                });
            }).toThrow('Price must be greater than or equal to 0');
        });

        it('should throw error if stock is negative', () => {
            expect(() => {
                new Product({
                    id: '123',
                    name: 'Product',
                    price: 100,
                    stock: -5,
                    status: 'active',
                });
            }).toThrow('Stock must be greater than or equal to 0');
        });
    });
});
