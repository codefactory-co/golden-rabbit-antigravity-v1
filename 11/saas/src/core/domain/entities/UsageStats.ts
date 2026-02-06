export interface UsageStats {
    noteCount: number;
    maxNoteCount: number; // -1 for unlimited
    storageUsed: number; // in bytes
    storageLimit: number; // in bytes, -1 for unlimited
    aiSummaryCount: number;
    maxAiSummaryCount: number;
}
