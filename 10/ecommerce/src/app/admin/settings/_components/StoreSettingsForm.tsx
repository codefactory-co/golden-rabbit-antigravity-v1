'use client';

import { useState } from 'react';
import { StoreSettingProps } from '@/core/domain/entities/StoreSetting';
import { updateStoreSettings } from '@/app/actions/settings.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

interface StoreSettingsFormProps {
    initialSettings: StoreSettingProps | null;
}

export function StoreSettingsForm({ initialSettings }: StoreSettingsFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<StoreSettingProps>>(
        initialSettings || {
            storeName: '',
            currency: 'KRW',
            stockAlertThreshold: 10,
            logoUrl: '',
            taxIncluded: false,
            notificationsEmail: true,
            notificationsSlack: false,
        }
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await updateStoreSettings(formData);
            alert('설정이 저장되었습니다.');
        } catch (error) {
            alert('설정 저장 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (key: keyof StoreSettingProps, value: any) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>스토어 기본 정보</CardTitle>
                    <CardDescription>스토어의 기본 정보를 관리합니다.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="storeName">스토어명</Label>
                        <Input
                            id="storeName"
                            value={formData.storeName}
                            onChange={(e) => handleChange('storeName', e.target.value)}
                            placeholder="스토어 이름을 입력하세요"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>로고</Label>
                        <div className="flex items-center gap-4">
                            {formData.logoUrl ? (
                                <div className="relative w-16 h-16 rounded-md overflow-hidden border border-gray-200">
                                    <Image src={formData.logoUrl} alt="Store Logo" fill className="object-cover" />
                                </div>
                            ) : (
                                <div className="w-16 h-16 rounded-md bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                                    No Logo
                                </div>
                            )}
                            <Button type="button" variant="outline" size="sm">변경</Button>
                        </div>
                        {/* TODO: Implement Image Upload */}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="currency">통화</Label>
                            <select
                                id="currency"
                                className="flex h-10 w-full rounded-md border border-gray-200 bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                value={formData.currency}
                                onChange={(e) => handleChange('currency', e.target.value)}
                            >
                                <option value="KRW">KRW</option>
                                <option value="USD">USD</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                            <div className="space-y-0.5">
                                <Label className="text-base">세금 포함 가격</Label>
                                <div className="text-sm text-muted-foreground">가격에 세금을 포함하여 표시합니다.</div>
                            </div>
                            <Switch
                                checked={formData.taxIncluded}
                                onCheckedChange={(checked) => handleChange('taxIncluded', checked)}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>재고 알림 설정</CardTitle>
                    <CardDescription>재고 부족 시 알림을 받을 방법을 설정합니다.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="threshold">재고 부족 기준</Label>
                        <Input
                            id="threshold"
                            type="number"
                            value={formData.stockAlertThreshold}
                            onChange={(e) => handleChange('stockAlertThreshold', Number(e.target.value))}
                        />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                        <div className="space-y-0.5">
                            <Label className="text-base">이메일 알림</Label>
                            <div className="text-sm text-muted-foreground">재고 부족 시 관리자 이메일로 알림을 보냅니다.</div>
                        </div>
                        <Switch
                            checked={formData.notificationsEmail}
                            onCheckedChange={(checked) => handleChange('notificationsEmail', checked)}
                        />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                        <div className="space-y-0.5">
                            <Label className="text-base">슬랙 알림</Label>
                            <div className="text-sm text-muted-foreground">재고 부족 시 슬랙 채널로 알림을 보냅니다.</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button type="button" variant="outline" size="sm">연동하기</Button>
                            <Switch
                                checked={formData.notificationsSlack}
                                onCheckedChange={(checked) => handleChange('notificationsSlack', checked)}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    저장
                </Button>
            </div>
        </form>
    );
}
