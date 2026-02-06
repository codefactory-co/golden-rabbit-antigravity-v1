import { StoreSetting } from '../../domain/entities/StoreSetting';

export interface IStoreSettingsRepository {
    getSettings(): Promise<StoreSetting | null>;
    updateSettings(setting: StoreSetting): Promise<void>;
}
