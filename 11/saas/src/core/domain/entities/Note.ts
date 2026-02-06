export interface Note {
    id: string;
    userId: string;
    folderId?: string;
    title: string;
    content: string | null;
    category?: string;
    summary?: string;
    isFavorite: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}
