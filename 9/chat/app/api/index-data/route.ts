import { NextResponse } from "next/server";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { PineconeStore } from "@langchain/pinecone";
import { getEmbeddings, pinecone, indexName } from "@/lib/pinecone";
import { supabase } from "@/lib/supabase";
import path from "path";

export async function POST() {
    try {
        // 1. CSV 데이터 로드
        const csvPath = path.resolve(process.cwd(), "samples/review.csv");
        const loader = new CSVLoader(csvPath);
        const docs = await loader.load();

        // 2. 텍스트 분할 (이미 작은 데이터일 수 있지만, RAG 관행에 따라 분할 설정 가능)
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 500,
            chunkOverlap: 50,
        });
        const splitDocs = await splitter.splitDocuments(docs);

        // 3. Pinecone에 배치 업로드 (batch size limit 96)
        const BATCH_SIZE = 50;
        const pineconeIndex = pinecone.Index(indexName);

        for (let i = 0; i < splitDocs.length; i += BATCH_SIZE) {
            const batch = splitDocs.slice(i, i + BATCH_SIZE);
            await PineconeStore.fromDocuments(batch, getEmbeddings(), {
                pineconeIndex,
            });
            console.log(`Indexed batch ${i / BATCH_SIZE + 1} to Pinecone.`);
        }

        // 4. Supabase 연동 (데이터 동기화)
        const supabaseData = docs.map((doc) => {
            const content = doc.pageContent;
            const lines = content.split('\n');
            const data: any = {};
            lines.forEach(line => {
                const parts = line.split(': ');
                if (parts.length > 1) {
                    data[parts[0].trim()] = parts.slice(1).join(': ').trim();
                }
            });

            return {
                id: data.id || undefined,
                product_name: data.title || "알 수 없는 상품",
                review_text: data.content || content,
                rating: data.rating ? parseInt(data.rating) : 0,
            };
        });

        const { error: supaError } = await supabase
            .from("reviews")
            .upsert(supabaseData, { onConflict: 'id' });

        if (supaError) {
            console.error("Supabase sync error:", supaError);
            throw supaError;
        }

        console.log(`Successfully indexed ${splitDocs.length} chunks to Pinecone and synced to Supabase.`);

        return NextResponse.json({
            success: true,
            message: `${splitDocs.length}개의 데이터 조각이 Pinecone에 저장되고 Supabase에 동기화되었습니다.`
        });
    } catch (error: any) {
        console.error("Indexing error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
