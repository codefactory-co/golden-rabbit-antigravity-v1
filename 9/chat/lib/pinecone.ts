import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore, PineconeEmbeddings } from "@langchain/pinecone";

if (!process.env.PINECONE_API_KEY) {
    throw new Error("PINECONE_API_KEY is not set");
}

export const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
});

export const indexName = "review-chatbot";

/**
 * llama-text-embed-v2 모델 사용을 위한 설정
 * @langchain/pinecone의 PineconeEmbeddings를 직접 사용합니다.
 */
export const getEmbeddings = () => {
    return new PineconeEmbeddings({
        model: "llama-text-embed-v2",
        apiKey: process.env.PINECONE_API_KEY,
    });
};

export const getVectorStore = async () => {
    const pineconeIndex = pinecone.Index(indexName);

    return await PineconeStore.fromExistingIndex(getEmbeddings(), {
        pineconeIndex,
    });
};
