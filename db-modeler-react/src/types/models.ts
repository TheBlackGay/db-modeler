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
  unique: boolean;
  index: boolean;
  unsigned: boolean;
  zerofill: boolean;
}

export interface FieldTemplate extends Omit<Field, 'id' | 'name'> {
  id: string;
  name: string;
  description: string;
  category: string;
  isBuiltin?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FieldTemplateCategory {
  id: string;
  name: string;
  description: string;
  isBuiltin?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Table {
  id: string;
  name: string;
  description?: string;
  comment: string;
  fields: Field[];
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