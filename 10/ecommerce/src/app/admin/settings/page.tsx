import { getStoreSettings } from '@/app/actions/settings.actions';
import { StoreSettingsForm } from './_components/StoreSettingsForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default async function SettingsPage() {
    const settings = await getStoreSettings();

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">설정</h2>
                <p className="text-muted-foreground">스토어의 전반적인 설정을 관리합니다.</p>
            </div>

            <Tabs defaultValue="store" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="store">스토어 정보</TabsTrigger>
                    <TabsTrigger value="notifications">알림 설정</TabsTrigger>
                    <TabsTrigger value="team">팀 관리</TabsTrigger>
                    <TabsTrigger value="billing">결제</TabsTrigger>
                </TabsList>

                <TabsContent value="store" className="space-y-4">
                    <StoreSettingsForm initialSettings={settings} />
                </TabsContent>

                <TabsContent value="notifications">
                    <div className="p-4 border border-gray-200 rounded-lg text-center text-muted-foreground">
                        알림 설정 탭은 준비 중입니다. (스토어 정보 탭에 통합됨)
                    </div>
                </TabsContent>

                <TabsContent value="team">
                    <div className="p-4 border border-gray-200 rounded-lg text-center text-muted-foreground">
                        팀 관리 기능은 준비 중입니다.
                    </div>
                </TabsContent>

                <TabsContent value="billing">
                    <div className="p-4 border border-gray-200 rounded-lg text-center text-muted-foreground">
                        결제 관리 기능은 준비 중입니다.
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
