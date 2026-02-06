import { Lightbulb } from "lucide-react";

interface Props {
    insights: string[];
}

export default function AIInsightCard({ insights }: Props) {
    return (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-100 mt-6">
            <div className="flex items-center mb-3">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-full mr-3">
                    <Lightbulb size={20} />
                </div>
                <h3 className="text-lg font-bold text-indigo-900">AI 인사이트</h3>
            </div>
            <ul className="space-y-2 ml-2">
                {insights.map((insight, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-700">
                        <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-indigo-400 rounded-full flex-shrink-0"></span>
                        {insight}
                    </li>
                ))}
            </ul>
        </div>
    );
}
