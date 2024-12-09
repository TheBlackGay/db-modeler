export interface NodePosition {
    id: string;
    x: number;
    y: number;
}

export interface GraphLayout {
    id: string;
    projectId: string;
    positions: NodePosition[];
    createdAt?: number;
    updatedAt?: number;
}
