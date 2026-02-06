import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerCategoryPreference } from "@/core/domain/entities/CustomerDetail";

interface CategoryPreferenceChartProps {
    preferences: CustomerCategoryPreference[];
}

export function CategoryPreferenceChart({ preferences }: CategoryPreferenceChartProps) {
    // Basic colors for bars
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-red-500'];

    return (
        <Card>
            <CardHeader>
                <CardTitle>선호 카테고리</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {preferences.map((pref, index) => (
                        <div key={pref.category}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium">{pref.category}</span>
                                <span className="text-muted-foreground">{pref.percentage}%</span>
                            </div>
                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${colors[index % colors.length]}`}
                                    style={{ width: `${pref.percentage}%` }}
                                />
                            </div>
                        </div>
                    ))}
                    {preferences.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">데이터가 없습니다.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
