import { IPostRepository } from "../../core/application/interfaces/IPostRepository";
import { Post } from "../../core/domain/entities/Post";

export class InMemoryPostRepository implements IPostRepository {
    private static instance: InMemoryPostRepository;
    private posts: Map<string, Post> = new Map();

    private constructor() { }

    public static getInstance(): InMemoryPostRepository {
        if (!InMemoryPostRepository.instance) {
            InMemoryPostRepository.instance = new InMemoryPostRepository();
        }
        return InMemoryPostRepository.instance;
    }

    async save(post: Post): Promise<void> {
        this.posts.set(post.id, post);
        return Promise.resolve();
    }

    async findById(id: string): Promise<Post | null> {
        return Promise.resolve(this.posts.get(id) || null);
    }

    async delete(id: string): Promise<void> {
        // In our domain, we use soft delete, so 'save' deals with update usually, 
        // but if hard delete is requested by repo interface, we remove it.
        // However, the interface says 'delete'. 
        // Since useCase calls 'post.delete()' (soft) then 'repo.save()',
        // this method might be unused or reserved for admin hard-delete.
        // For safety, we'll implement hard delete here.
        this.posts.delete(id);
        return Promise.resolve();
    }

    async findByAuthorId(authorId: string): Promise<Post[]> {
        const userPosts = Array.from(this.posts.values()).filter(
            (post) => post.authorId === authorId
        );
        return Promise.resolve(userPosts);
    }

    async findAllPublished(): Promise<Post[]> {
        const published = Array.from(this.posts.values()).filter(
            (post) => post.isPublished
        );
        return Promise.resolve(published);
    }

    async countByAuthorIdAndDate(authorId: string, date: Date): Promise<number> {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const count = Array.from(this.posts.values()).filter((post) => {
            return (
                post.authorId === authorId &&
                post.createdAt >= startOfDay &&
                post.createdAt <= endOfDay
            );
        }).length;

        return Promise.resolve(count);
    }
}
