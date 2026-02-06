"use client";

import { useState } from "react";
import { Container } from "./container";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
    {
        question: "무료 체험 기간은 얼마인가요?",
        answer: "WriteFlow의 모든 기능을 14일 동안 무료로 체험해보실 수 있습니다. 신용카드 정보는 필요하지 않습니다.",
    },
    {
        question: "언제든지 구독을 취소할 수 있나요?",
        answer: "네, 계정 설정에서 언제든지 구독을 취소하거나 변경할 수 있습니다. 추가 약정이나 위약금은 없습니다.",
    },
    {
        question: "팀원들과 공유할 수 있나요?",
        answer: "네, 엔터프라이즈 플랜을 사용하시면 팀원을 초대하고 문서를 공유하며 실시간으로 협업할 수 있습니다.",
    },
    {
        question: "어떤 언어를 지원하나요?",
        answer: "현재 한국어, 영어를 포함하여 30개 이상의 주요 언어를 지원하며, 지속적으로 추가되고 있습니다.",
    },
];

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <div id="faq" className="py-24 sm:py-32">
            <Container>
                <div className="mx-auto max-w-4xl divide-y divide-gray-900/10">
                    <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">
                        자주 묻는 질문
                    </h2>
                    <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
                        {faqs.map((faq, index) => (
                            <div key={faq.question} className="pt-6">
                                <dt>
                                    <button
                                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                        className="flex w-full items-start justify-between text-left text-gray-900"
                                    >
                                        <span className="text-base font-semibold leading-7">
                                            {faq.question}
                                        </span>
                                        <span className="ml-6 flex h-7 items-center">
                                            {openIndex === index ? (
                                                <ChevronUp className="h-6 w-6" aria-hidden="true" />
                                            ) : (
                                                <ChevronDown className="h-6 w-6" aria-hidden="true" />
                                            )}
                                        </span>
                                    </button>
                                </dt>
                                {openIndex === index && (
                                    <dd className="mt-2 pr-12">
                                        <p className="text-base leading-7 text-gray-600">{faq.answer}</p>
                                    </dd>
                                )}
                            </div>
                        ))}
                    </dl>
                </div>
            </Container>
        </div>
    );
}
