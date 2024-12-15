export interface Field {
  id: string;
  name: string;
  type: string;
  length?: number;
  nullable: boolean;
  defaultValue?: string;
  comment?: string;
  isPrimaryKey: boolean;
  isAutoIncrement: boolean;
}

export interface Index {
  id: string;
  name: string;
  fields: string[];
  type: 'UNIQUE' | 'INDEX';
}

export interface Table {
  id: string;
  name: string;
  comment?: string;
  fields: Field[];
  indexes: Index[];
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  tables: Table[];
  createdAt: string;
  updatedAt: string;
} 