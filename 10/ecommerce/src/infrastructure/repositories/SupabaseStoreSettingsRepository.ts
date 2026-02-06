import { SupabaseClient } from '@supabase/supabase-js';
import { IStoreSettingsRepository } from '../../core/application/interfaces/IStoreSettingsRepository';
import { StoreSetting } from '../../core/domain/entities/StoreSetting';

export class SupabaseStoreSettingsRepository implements IStoreSettingsRepository {
    constructor(private supabase: SupabaseClient) { }

    async getSettings(): Promise<StoreSetting | null> {
        const { data, error } = await this.supabase
            .from('store_settings')
            .select('*')
            .single();

        if (error || !data) return null;

        return new StoreSetting({
            id: data.id,
            storeName: data.store_name,
            currency: data.currency,
            stockAlertThreshold: data.stock_alert_threshold,
            logoUrl: data.logo_url,
            taxIncluded: data.tax_included,
            notificationsEmail: data.notifications_email,
            notificationsSlack: data.notifications_slack,
        });
    }

    async updateSettings(setting: StoreSetting): Promise<void> {
        const { error } = await this.supabase
            .from('store_settings')
            .update({
                store_name: setting.props.storeName,
                currency: setting.props.currency,
                stock_alert_threshold: setting.props.stockAlertThreshold,
                logo_url: setting.props.logoUrl,
                tax_included: setting.props.taxIncluded,
                notifications_email: setting.props.notificationsEmail,
                notifications_slack: setting.props.notificationsSlack,
            })
            .eq('id', setting.props.id);

        if (error) {
            throw new Error(error.message);
        }
    }
}
