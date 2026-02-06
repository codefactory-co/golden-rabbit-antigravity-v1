
import { ArrowUpRight, ArrowDownRight, AlertTriangle } from "lucide-react";

interface MetricsCardProps {
    title: string;
    value: string | number;
    change?: number; // percentage
    isWarning?: boolean;
}

export function MetricsCard({ title, value, change, isWarning }: MetricsCardProps) {
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <h3 className="text-2xl font-bold mt-2 text-gray-900">{value}</h3>
                </div>
                {isWarning ? (
                    <div className="p-2 bg-red-50 rounded-lg">
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                    </div>
                ) : (
                    change !== undefined && (
                        <div className={`flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${change >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                            {change >= 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                            {Math.abs(change)}%
                        </div>
                    )
                )}
            </div>
            {isWarning && (
                <p className="text-xs text-red-500 mt-2 font-medium">재고 확인 필요</p>
            )}
            {!isWarning && change !== undefined && (
                <p className="text-xs text-gray-400 mt-2">전일 대비</p>
            )}
        </div>
    );
}
