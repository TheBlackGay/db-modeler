export enum RelationType {
    ONE_TO_ONE = 'ONE_TO_ONE',
    ONE_TO_MANY = 'ONE_TO_MANY',
    MANY_TO_ONE = 'MANY_TO_ONE',
    MANY_TO_MANY = 'MANY_TO_MANY'
}

export enum MappingType {
    PRIMARY_KEY = 'PRIMARY_KEY',
    FOREIGN_KEY = 'FOREIGN_KEY',
    REFERENCE = 'REFERENCE'
}

export interface ColumnMapping {
    sourceColumnName: string;
    targetColumnName: string;
    mappingType: MappingType;
}

export interface TableRelation {
    id?: string;
    projectId: string;
    sourceTableId: string;
    targetTableId: string;
    relationType: RelationType;
    columnMappings: ColumnMapping[];
    description?: string;
    createdBy?: string;
    createdAt?: number;
    updatedAt?: number;
}

export interface TableRelationFormData {
    sourceTableId: string;
    targetTableId: string;
    relationType: RelationType;
    columnMappings: ColumnMapping[];
    description?: string;
}
