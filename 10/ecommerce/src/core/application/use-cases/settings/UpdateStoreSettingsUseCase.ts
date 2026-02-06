import { IStoreSettingsRepository } from '../../interfaces/IStoreSettingsRepository';
import { StoreSetting, StoreSettingProps } from '../../../domain/entities/StoreSetting';

export class UpdateStoreSettingsUseCase {
    constructor(private storeSettingsRepository: IStoreSettingsRepository) { }

    async execute(updates: Partial<Omit<StoreSettingProps, 'id'>>): Promise<void> {
        const currentSettings = await this.storeSettingsRepository.getSettings();
        if (!currentSettings) {
            throw new Error('Store settings not found');
        }

        currentSettings.update(updates);
        await this.storeSettingsRepository.updateSettings(currentSettings);
    }
}
