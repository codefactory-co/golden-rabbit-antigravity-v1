'use server';

import { createClient } from '@/utils/supabase/server';
import { SupabaseStoreSettingsRepository } from '@/infrastructure/repositories/SupabaseStoreSettingsRepository';
import { GetStoreSettingsUseCase } from '@/core/application/use-cases/settings/GetStoreSettingsUseCase';
import { UpdateStoreSettingsUseCase } from '@/core/application/use-cases/settings/UpdateStoreSettingsUseCase';
import { StoreSettingProps } from '@/core/domain/entities/StoreSetting';
import { revalidatePath } from 'next/cache';

// Composition Root
function getDependencies(supabaseClient: any) {
    const repository = new SupabaseStoreSettingsRepository(supabaseClient);
    return {
        getUseCase: new GetStoreSettingsUseCase(repository),
        updateUseCase: new UpdateStoreSettingsUseCase(repository),
    };
}

export async function getStoreSettings() {
    const supabase = await createClient();
    const { getUseCase } = getDependencies(supabase);

    const settings = await getUseCase.execute();
    return settings ? settings.props : null;
}

export async function updateStoreSettings(updates: Partial<Omit<StoreSettingProps, 'id'>>) {
    const supabase = await createClient();
    const { updateUseCase } = getDependencies(supabase);

    try {
        await updateUseCase.execute(updates);
        revalidatePath('/admin/settings');
        return { success: true };
    } catch (error) {
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: 'Unknown error occurred' };
    }
}
