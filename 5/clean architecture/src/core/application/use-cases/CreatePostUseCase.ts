import { Post } from "../../domain/entities/Post";
import { IPostRepository } from "../interfaces/IPostRepository";

export class CreatePostUseCase {
    constructor(private postRepository: IPostRepository) { }

    async execute(title: string, content: string, authorId: string): Promise<Post> {
        // 1. Check daily limit
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dailyCount = await this.postRepository.countByAuthorIdAndDate(authorId, today);

        if (dailyCount >= 10) {
            throw new Error("하루에 최대 10개의 글만 작성할 수 있습니다.");
        }

        // 2. Create Post entity
        const post = new Post(
            crypto.randomUUID(),
            title,
            content,
            authorId
        );

        // 3. Save
        await this.postRepository.save(post);

        return post;
    }
}
