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
  api_groups?: EolinkerApiGroup[];
  apis?: EolinkerApi[];
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

// API方法类型
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// API状态
export type ApiStatus = 'developing' | 'completed' | 'deprecated';

// API接口定义
export interface EolinkerApi {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  url: string;
  method: HttpMethod;
  group_id: string;
  tags: string[];
  status: ApiStatus;
  version: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}

// API分组定义
export interface EolinkerApiGroup {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  parent_id?: string;
  order: number;
  created_at: string;
  updated_at: string;
} 