import { Post } from "../../domain/entities/Post";

export interface IPostRepository {
    save(post: Post): Promise<void>;
    findById(id: string): Promise<Post | null>;
    delete(id: string): Promise<void>;
    findByAuthorId(authorId: string): Promise<Post[]>;
    findAllPublished(): Promise<Post[]>;
    countByAuthorIdAndDate(authorId: string, date: Date): Promise<number>;
}
