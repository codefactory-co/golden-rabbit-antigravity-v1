"use server";

import { CreatePostUseCase } from "../core/application/use-cases/CreatePostUseCase";
import { GetPostUseCase, DeletePostUseCase, PublishPostUseCase, EditPostUseCase } from "../core/application/use-cases/PostUseCases";
import { InMemoryPostRepository } from "../infrastructure/repositories/InMemoryPostRepository";
import { revalidatePath } from "next/cache";

// Dependency Injection Composition Root (Manual DI for now)
const postRepository = InMemoryPostRepository.getInstance();
const createPostUseCase = new CreatePostUseCase(postRepository);
const getPostUseCase = new GetPostUseCase(postRepository);
const deletePostUseCase = new DeletePostUseCase(postRepository);
const publishPostUseCase = new PublishPostUseCase(postRepository);
const editPostUseCase = new EditPostUseCase(postRepository);

// Mock User Session
const MOCK_USER_ID = "demo-user-123";

export async function createPostAction(prevState: any, formData: FormData) {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    try {
        await createPostUseCase.execute(title, content, MOCK_USER_ID);
        revalidatePath("/");
        return { message: "게시글이 작성되었습니다.", success: true };
    } catch (e: any) {
        return { message: e.message, success: false };
    }
}

export async function getPostsAction() {
    const posts = await getPostUseCase.getNewsFeed();
    // Serialize for Client Component
    return posts.map(p => ({
        ...p,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
    }));
}

export async function getMyPostsAction() {
    const posts = await getPostUseCase.getMyPosts(MOCK_USER_ID);
    return posts.map(p => ({
        ...p,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
    }));
}

export async function deletePostAction(id: string) {
    try {
        await deletePostUseCase.execute(id, MOCK_USER_ID);
        revalidatePath("/");
        return { success: true };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
}

export async function publishPostAction(id: string) {
    try {
        await publishPostUseCase.execute(id, MOCK_USER_ID);
        revalidatePath("/");
        return { success: true };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
}
