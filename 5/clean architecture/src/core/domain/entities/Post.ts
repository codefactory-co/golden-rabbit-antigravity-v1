export class Post {
    constructor(
        public readonly id: string,
        public title: string,
        public content: string,
        public readonly authorId: string,
        public isPublished: boolean = false,
        public readonly createdAt: Date = new Date(),
        public updatedAt: Date = new Date(),
        public isDeleted: boolean = false
    ) {
        this.validate();
    }

    // Business Rules
    private validate() {
        if (this.title.length < 5 || this.title.length > 100) {
            throw new Error("제목은 5자 이상 100자 이하여야 합니다.");
        }
        if (this.content.length < 10 || this.content.length > 10000) {
            throw new Error("본문은 10자 이상 10,000자 이하여야 합니다.");
        }
    }

    // Domain Behaviors
    public update(title: string, content: string, userId: string) {
        if (this.isDeleted) {
            throw new Error("삭제된 게시글은 수정할 수 없습니다.");
        }
        if (this.authorId !== userId) {
            throw new Error("작성자만 수정할 수 있습니다.");
        }
        if (this.isPublished) {
            throw new Error("비공개 상태인 게시글만 수정할 수 있습니다.");
        }

        this.title = title;
        this.content = content;
        this.updatedAt = new Date();
        this.validate();
    }

    public publish(userId: string) {
        if (this.isDeleted) {
            throw new Error("삭제된 게시글은 발행할 수 없습니다.");
        }
        if (this.authorId !== userId) {
            throw new Error("작성자만 발행할 수 있습니다.");
        }
        this.isPublished = true;
        this.updatedAt = new Date();
    }

    public delete(userId: string) {
        if (this.authorId !== userId) {
            throw new Error("작성자만 삭제할 수 있습니다.");
        }
        this.isDeleted = true;
        this.updatedAt = new Date();
    }
}
