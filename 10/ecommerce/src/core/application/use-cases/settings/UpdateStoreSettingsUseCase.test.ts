import { describe, it, expect, vi } from 'vitest';
import { UpdateStoreSettingsUseCase } from './UpdateStoreSettingsUseCase';
import { IStoreSettingsRepository } from '../../interfaces/IStoreSettingsRepository';
import { StoreSetting } from '../../../domain/entities/StoreSetting';

describe('UpdateStoreSettingsUseCase', () => {
    it('should update store settings', async () => {
        const mockRepo: IStoreSettingsRepository = {
            getSettings: vi.fn(),
            updateSettings: vi.fn(),
        };

        const useCase = new UpdateStoreSettingsUseCase(mockRepo);

        const settingToUpdate = new StoreSetting({
            id: 1,
            storeName: 'Original Name',
            currency: 'KRW',
            stockAlertThreshold: 10,
            taxIncluded: false,
            notificationsEmail: true,
            notificationsSlack: false,
        });

        const newProps = { storeName: 'New Name' };

        // Test logic: UseCase should call repo.updateSettings with updated entity
        // However, UseCase typically receives DTO or basic types, retrieves entity, updates it, and saves.
        // For simplicity, let's assume we pass the updated StoreSetting object or the ID and updates.
        // Let's refine the Use Case signature: execute(setting: StoreSetting) or execute(id: number, updates: Partial<Props>)

        // In this clean architecture approach:
        // 1. Controller calls UseCase with InputDTO
        // 2. UseCase retrieves Entity
        // 3. UseCase updates Entity
        // 4. UseCase saves Entity

        // Let's assume the use case takes the full updated props or partial props. 
        // Ideally: execute(params: UpdateStoreSettingsDTO)

        // Creating a mock behavior for getSettings to simulate retrieval
        mockRepo.getSettings = vi.fn().mockResolvedValue(settingToUpdate);

        await useCase.execute({
            storeName: 'New Name',
            stockAlertThreshold: 5
        });

        expect(mockRepo.getSettings).toHaveBeenCalled();
        expect(mockRepo.updateSettings).toHaveBeenCalled();

        // Check if the entity passed to updateSettings has the new values
        const updatedEntity = (mockRepo.updateSettings as any).mock.calls[0][0] as StoreSetting;
        expect(updatedEntity.props.storeName).toBe('New Name');
        expect(updatedEntity.props.stockAlertThreshold).toBe(5);
    });
});
