export interface ColumnType {
    id: string;
    name: string;
    dataType: string;
    defaultLength?: number;
    defaultPrecision?: number;
    defaultScale?: number;
    allowNull?: boolean;
}

export interface TableColumn {
    id: string;
    name: string;
    comment?: string;
    dataType: string;
    length?: number;
    precision?: number;
    scale?: number;
    allowNull: boolean;
    isPrimaryKey: boolean;
    isAutoIncrement: boolean;
    defaultValue?: string;
    createdAt?: number;
    updatedAt?: number;
}

export interface TableDesign {
    id: string;
    name: string;
    comment?: string;
    projectId: string;
    columns: TableColumn[];
    createdBy?: string;
    createdAt?: number;
    updatedAt?: number;
}

export interface TableDesignFormData {
    name: string;
    comment?: string;
    columns: Omit<TableColumn, 'id' | 'createdAt' | 'updatedAt'>[];
}
