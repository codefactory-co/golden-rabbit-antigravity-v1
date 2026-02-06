export interface ActivityLog {
    id: string;
    type: 'CREATE_NOTE' | 'USE_AI' | 'CREATE_FOLDER' | 'SHARE_NOTE' | 'LOGIN';
    description: string;
    metadata: string; // Additional info like "3 hours ago • via Web"
    icon: string; // Material symbol name
    colorClass: string; // e.g., "bg-blue-50 text-blue-600"
}
