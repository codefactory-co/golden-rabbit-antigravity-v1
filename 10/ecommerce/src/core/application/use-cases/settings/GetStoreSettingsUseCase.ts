import { IStoreSettingsRepository } from '../../interfaces/IStoreSettingsRepository';
import { StoreSetting } from '../../../domain/entities/StoreSetting';

export class GetStoreSettingsUseCase {
    constructor(private storeSettingsRepository: IStoreSettingsRepository) { }

    async execute(): Promise<StoreSetting | null> {
        return this.storeSettingsRepository.getSettings();
    }
}
