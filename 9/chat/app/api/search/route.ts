// Force rebuild: LCEL Refactor
import { NextResponse } from "next/server";
import { getVectorStore } from "@/lib/pinecone";
import { supabase } from "@/lib/supabase";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";

export async function POST(req: Request) {
    try {
        const { query, chatId } = await req.json();

        if (!query) {
            return NextResponse.json({ error: "Query is required" }, { status: 400 });
        }

        // 1. (Optional) Save User Message
        if (chatId) {
            await supabase.from("messages").insert([{
                chat_id: chatId,
                role: "user",
                content: query,
                type: "text"
            }]);
        }

        // 2. Vector Search & RAG Integration via LCEL
        const vectorStore = await getVectorStore();
        const chat = new ChatOpenAI({
            modelName: "gpt-5-nano",
            openAIApiKey: process.env.OPENAI_API_KEY,
        });

        const retriever = vectorStore.asRetriever({ k: 5 });

        const SYSTEM_TEMPLATE = `당신은 쇼핑 리뷰 분석 전문가입니다. 아래 제공된 리뷰 데이터를 바탕으로 사용자의 질문에 친절하고 정직하게 답변하세요. 
모든 답변은 한국어로 작성하며, 리뷰에 없는 내용을 지어내지 마세요.
분석 결과 요약과 함께 사용자의 궁금증을 해결해 주세요.

<context>
{context}
</context>`;

        const prompt = ChatPromptTemplate.fromMessages([
            ["system", SYSTEM_TEMPLATE],
            ["human", "{input}"],
        ]);

        // LCEL Chain 구성
        const chain = RunnableSequence.from([
            {
                // retriever로부터 문서를 가져오고 원본 문서를 유지함
                context: async (input: string) => {
                    const docs = await retriever.invoke(input);
                    return {
                        docs,
                        formattedContext: docs.map(d => d.pageContent).join("\n\n")
                    };
                },
                input: new RunnablePassthrough(),
            },
            {
                // LLM 답변 생성 및 컨텍스트 문서 반환
                answer: RunnableSequence.from([
                    (input: any) => ({
                        context: input.context.formattedContext,
                        input: input.input,
                    }),
                    prompt,
                    chat,
                    new StringOutputParser(),
                ]),
                docs: (input: any) => input.context.docs,
            },
        ]);

        // 체인 실행
        const response = await chain.invoke(query);

        const aiContent = response.answer || "답변을 생성할 수 없습니다.";
        const retrievedDocs = response.docs || [];
        const foundResults = retrievedDocs.length > 0;

        // 3. Construct AI Response Analysis Data
        let parsedDocs: any[] = [];

        if (foundResults) {
            parsedDocs = retrievedDocs.map((doc: any) => {
                const content = doc.pageContent;
                const lines = content.split('\n');
                const data: any = {};
                lines.forEach((line: string) => {
                    const parts = line.split(': ');
                    if (parts.length > 1) {
                        data[parts[0].trim()] = parts.slice(1).join(': ').trim();
                    }
                });
                return data;
            });
        }

        // UI를 위한 통계 데이터
        let productName = "무선 이어폰";
        if (query.includes("이어폰")) productName = "무선 이어폰";
        else if (query.includes("헤드폰")) productName = "노이즈 캔슬링 헤드폰";

        const ratings = parsedDocs.map(d => parseInt(d.rating)).filter(r => !isNaN(r));
        const avgRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : "0.0";
        const pros = parsedDocs.filter(d => parseInt(d.rating) >= 4).map(d => d.title).slice(0, 3);
        const cons = parsedDocs.filter(d => parseInt(d.rating) <= 3).map(d => d.title).slice(0, 3);

        const analysisData = {
            productName: productName,
            totalReviews: parsedDocs.length,
            averageRating: parseFloat(avgRating),
            sentiment: {
                positive: Math.round((ratings.filter(r => r >= 4).length / (ratings.length || 1)) * 100) || 0,
                negative: Math.round((ratings.filter(r => r <= 2).length / (ratings.length || 1)) * 100) || 0,
                neutral: Math.round((ratings.filter(r => r === 3).length / (ratings.length || 1)) * 100) || 0,
            },
            summary: foundResults
                ? `리뷰 분석 결과: ${aiContent.substring(0, 100)}...`
                : "데이터 없음",
            pros: pros.length > 0 ? pros : ["전반적인 사용성 만족"],
            cons: cons.length > 0 ? cons : ["특별한 불만 사항 없음"],
        };

        // 4. Save Assistant Message
        if (chatId) {
            await supabase.from("messages").insert([{
                chat_id: chatId,
                role: "assistant",
                content: aiContent,
                type: "analysis",
                analysis_data: analysisData
            }]);

            // Update chat timestamp
            await supabase
                .from("chats")
                .update({ updated_at: new Date().toISOString() })
                .eq("id", chatId);
        }

        return NextResponse.json({
            success: true,
            results: retrievedDocs,
            aiResponse: {
                content: aiContent,
                analysisData
            }
        });

    } catch (error: any) {
        console.error("Search error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

