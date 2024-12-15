export interface Field {
  id: string;
  name: string;
  type: string;
  length?: number;
  nullable: boolean;
  defaultValue?: string | null;
  comment?: string;
  isFK?: boolean;
  references?: {
    tableId: string;
    fieldId: string;
    onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
    onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
  };
  isPrimaryKey?: boolean;
  isAutoIncrement?: boolean;
}

export interface Table {
  id: string;
  name: string;
  fields: Field[];
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  tables: Table[];
  createdAt: string;
  updatedAt: string;
}

export type ProjectSummary = Omit<Project, 'tables'>;

export interface RootState {
  projects: {
    items: Project[];
    loading: boolean;
    error: string | null;
    currentProject: Project | null;
  };
} 