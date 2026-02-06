import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, Star } from "lucide-react";

interface CustomerStatsProps {
    stats: {
        totalUsers: number;
        newUsersThisMonth: number;
        vipUsers: number;
    }
}

export function CustomerStats({ stats }: CustomerStatsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">총 고객</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}명</div>
                    <p className="text-xs text-muted-foreground">
                        전체 가입 고객
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">신규 고객 (이번달)</CardTitle>
                    <UserPlus className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.newUsersThisMonth.toLocaleString()}명</div>
                    <p className="text-xs text-muted-foreground">
                        이번 달 새로 가입한 고객
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">VIP 고객</CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.vipUsers.toLocaleString()}명</div>
                    <p className="text-xs text-muted-foreground">
                        VIP 등급 고객
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
