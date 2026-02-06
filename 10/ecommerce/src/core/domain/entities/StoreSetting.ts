export interface StoreSettingProps {
    id: number;
    storeName: string;
    currency: string;
    stockAlertThreshold: number;
    logoUrl?: string;
    taxIncluded: boolean;
    notificationsEmail: boolean;
    notificationsSlack: boolean;
}

export class StoreSetting {
    constructor(public props: StoreSettingProps) {
        this.validate(props);
    }

    private validate(props: StoreSettingProps) {
        if (!props.storeName || props.storeName.trim() === '') {
            throw new Error('Store name cannot be empty');
        }
        if (props.stockAlertThreshold < 0) {
            throw new Error('Stock alert threshold cannot be negative');
        }
    }

    update(newProps: Partial<Omit<StoreSettingProps, 'id'>>) {
        const updatedProps = { ...this.props, ...newProps };
        this.validate(updatedProps);
        this.props = updatedProps;
    }
}
