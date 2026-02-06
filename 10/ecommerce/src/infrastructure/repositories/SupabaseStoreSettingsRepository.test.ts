import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SupabaseStoreSettingsRepository } from './SupabaseStoreSettingsRepository';
import { SupabaseClient } from '@supabase/supabase-js';

// Mock Supabase Client
const mockSupabase = {
    from: vi.fn(() => ({
        select: vi.fn(),
        update: vi.fn(),
        eq: vi.fn(),
        single: vi.fn(),
    })),
} as unknown as SupabaseClient;

describe('SupabaseStoreSettingsRepository', () => {
    let repository: SupabaseStoreSettingsRepository;

    beforeEach(() => {
        repository = new SupabaseStoreSettingsRepository(mockSupabase);
        vi.clearAllMocks();
    });

    it('should fetch store settings', async () => {
        // Setup chain mock
        const mockSingle = vi.fn().mockResolvedValue({
            data: {
                id: 1,
                store_name: 'Test Store',
                currency: 'KRW',
                stock_alert_threshold: 10,
                logo_url: 'logo.png',
                tax_included: false,
                notifications_email: true,
                notifications_slack: false,
            },
            error: null,
        });
        const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
        (mockSupabase.from as any).mockReturnValue({ select: mockSelect });

        const settings = await repository.getSettings();

        expect(settings).toBeDefined();
        expect(settings?.props.storeName).toBe('Test Store');
        expect(mockSupabase.from).toHaveBeenCalledWith('store_settings');
    });

    it('should update store settings', async () => {
        // Setup Entity
        const setting = (await repository.getSettings())!; // Reuse mock from above or create new one if needed, but here getSettings is mocked above in scope? No, scope is per test.
        // Re-setup necessary mocks for update flow

        // We need an entity instance to pass to updateSettings
        // Using a fake entity for testing update
        const { StoreSetting } = await import('../../core/domain/entities/StoreSetting');
        const entity = new StoreSetting({
            id: 1,
            storeName: 'Update Test',
            currency: 'USD',
            stockAlertThreshold: 5,
            taxIncluded: true,
            notificationsEmail: false,
            notificationsSlack: true,
            logoUrl: 'new_logo.png'
        });

        const mockUpdate = vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: null })
        });
        (mockSupabase.from as any).mockReturnValue({ update: mockUpdate });

        await repository.updateSettings(entity);

        expect(mockSupabase.from).toHaveBeenCalledWith('store_settings');
        expect(mockUpdate).toHaveBeenCalledWith({
            store_name: 'Update Test',
            // ... verify other fields mappings
            stock_alert_threshold: 5,
            currency: 'USD',
            logo_url: 'new_logo.png',
            tax_included: true,
            notifications_email: false,
            notifications_slack: true,
        });
    });
});
