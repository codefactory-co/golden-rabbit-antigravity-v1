import { describe, it, expect } from 'vitest';
import { StoreSetting } from './StoreSetting';

describe('StoreSetting Entity', () => {
    const validProps = {
        id: 1,
        storeName: 'Test Store',
        currency: 'KRW',
        stockAlertThreshold: 10,
        logoUrl: 'https://example.com/logo.png',
        taxIncluded: false,
        notificationsEmail: true,
        notificationsSlack: false,
    };

    it('should be created with valid properties', () => {
        const setting = new StoreSetting(validProps);
        expect(setting.props).toEqual(validProps);
    });

    it('should throw error if store name is empty', () => {
        expect(() => {
            new StoreSetting({ ...validProps, storeName: '' });
        }).toThrow('Store name cannot be empty');
    });

    it('should throw error if stock alert threshold is negative', () => {
        expect(() => {
            new StoreSetting({ ...validProps, stockAlertThreshold: -1 });
        }).toThrow('Stock alert threshold cannot be negative');
    });

    it('should update properties correctly', () => {
        const setting = new StoreSetting(validProps);
        setting.update({
            storeName: 'Updated Store',
            stockAlertThreshold: 5,
        });
        expect(setting.props.storeName).toBe('Updated Store');
        expect(setting.props.stockAlertThreshold).toBe(5);
    });
});
