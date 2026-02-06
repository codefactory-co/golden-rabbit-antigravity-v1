import { Container } from "./container";
import { Wand2, CheckCircle2, Sliders, Globe2, LayoutTemplate, Users } from "lucide-react";

const features = [
    {
        name: "AI 작성 어시스턴트",
        description: "키워드만 입력하면 몇 초 만에 고품질의 초안을 작성해줍니다.",
        icon: Wand2,
    },
    {
        name: "문맥 및 맞춤법 검사",
        description: "단순한 오타 교정을 넘어 문맥에 맞는 자연스러운 표현을 제안합니다.",
        icon: CheckCircle2,
    },
    {
        name: "톤 앤 매너 조정",
        description: "전문적인 톤부터 친근한 톤까지, 상황에 맞게 글의 분위기를 조절하세요.",
        icon: Sliders,
    },
    {
        name: "다국어 번역 지원",
        description: "30개국 이상의 언어로 콘텐츠를 즉시 번역하고 최적화합니다.",
        icon: Globe2,
    },
    {
        name: "맞춤형 템플릿",
        description: "블로그, 이메일, 광고 카피 등 다양한 목적에 맞는 50+ 템플릿을 제공합니다.",
        icon: LayoutTemplate,
    },
    {
        name: "실시간 협업",
        description: "팀원들과 함께 문서를 편집하고 피드백을 실시간으로 주고받으세요.",
        icon: Users,
    },
];

export function Features() {
    return (
        <div id="features" className="py-24 sm:py-32">
            <Container>
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        강력한 AI 글쓰기 기능
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        WriteFlow는 단순한 글쓰기 도구가 아닙니다. 당신의 창의력을 극대화하는 파트너입니다.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-7xl sm:mt-20">
                    <div className="grid grid-cols-1 gap-y-10 gap-x-8 lg:grid-cols-3 lg:gap-x-12">
                        {features.map((feature) => (
                            <div key={feature.name} className="flex flex-col items-start">
                                <div className="rounded-lg bg-violet-100 p-3 ring-1 ring-violet-200">
                                    <feature.icon className="h-6 w-6 text-violet-600" aria-hidden="true" />
                                </div>
                                <div className="mt-4 text-lg font-semibold leading-7 text-gray-900">
                                    {feature.name}
                                </div>
                                <div className="mt-2 text-base leading-7 text-gray-600">
                                    {feature.description}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </div>
    );
}
