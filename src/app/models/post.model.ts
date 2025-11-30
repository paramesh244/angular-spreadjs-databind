export interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
}

export interface ColumnDefinition {
    name: string;
    displayName: string;
    visible: boolean;
}

export interface SavePayload {
    selectedColumns: string[];
    rows: Record<string, any>[];
}

export interface SaveAllPayload {
    rows: Post[];
}

export interface SaveResponse {
    success: boolean;
    savedCount: number;
}
