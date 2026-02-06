import { IPostRepository } from "../interfaces/IPostRepository";
import { Post } from "../../domain/entities/Post";

export class EditPostUseCase {
    constructor(private postRepository: IPostRepository) { }

    async execute(id: string, title: string, content: string, userId: string): Promise<Post> {
        const post = await this.postRepository.findById(id);
        if (!post) throw new Error("게시글을 찾을 수 없습니다.");

        post.update(title, content, userId);
        await this.postRepository.save(post);
        return post;
    }
}

export class PublishPostUseCase {
    constructor(private postRepository: IPostRepository) { }

    async execute(id: string, userId: string): Promise<Post> {
        const post = await this.postRepository.findById(id);
        if (!post) throw new Error("게시글을 찾을 수 없습니다.");

        post.publish(userId);
        await this.postRepository.save(post);
        return post;
    }
}

export class DeletePostUseCase {
    constructor(private postRepository: IPostRepository) { }

    async execute(id: string, userId: string): Promise<void> {
        const post = await this.postRepository.findById(id);
        if (!post) throw new Error("게시글을 찾을 수 없습니다.");

        post.delete(userId);
        await this.postRepository.save(post); // Soft delete means update
    }
}

export class GetPostUseCase {
    constructor(private postRepository: IPostRepository) { }

    async getById(id: string): Promise<Post | null> {
        const post = await this.postRepository.findById(id);
        if (post && post.isDeleted) return null; // Filter deleted
        return post;
    }

    async getNewsFeed(): Promise<Post[]> {
        const posts = await this.postRepository.findAllPublished();
        // In-memory or Repo should handle filtering, but here to be safe and logic centralized
        return posts.filter(p => !p.isDeleted);
    }

    async getMyPosts(authorId: string): Promise<Post[]> {
        const posts = await this.postRepository.findByAuthorId(authorId);
        return posts.filter(p => !p.isDeleted);
    }
}
