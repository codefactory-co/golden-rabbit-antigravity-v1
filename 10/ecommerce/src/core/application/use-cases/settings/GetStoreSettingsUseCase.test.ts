import { describe, it, expect, vi } from 'vitest';
import { GetStoreSettingsUseCase } from './GetStoreSettingsUseCase';
import { IStoreSettingsRepository } from '../../interfaces/IStoreSettingsRepository';
import { StoreSetting } from '../../../domain/entities/StoreSetting';

describe('GetStoreSettingsUseCase', () => {
    it('should return store settings', async () => {
        const mockSetting = new StoreSetting({
            id: 1,
            storeName: 'Test Store',
            currency: 'KRW',
            stockAlertThreshold: 10,
            taxIncluded: false,
            notificationsEmail: true,
            notificationsSlack: false,
        });

        const mockRepo: IStoreSettingsRepository = {
            getSettings: vi.fn().mockResolvedValue(mockSetting),
            updateSettings: vi.fn(),
        };

        const useCase = new GetStoreSettingsUseCase(mockRepo);
        const result = await useCase.execute();

        expect(result).toBe(mockSetting);
        expect(mockRepo.getSettings).toHaveBeenCalled();
    });
});
