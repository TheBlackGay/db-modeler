import type { UploadFile } from 'antd/es/upload/interface';

export type FieldCategory = 'basic' | 'user' | 'time' | 'status' | 'address' | 'system' | 'custom';

export interface Field {
  id: string;
  name: string;
  type: string;
  length?: number;
  nullable: boolean;
  defaultValue?: string;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  referencedTable?: string;
  referencedField?: string;
  description?: string;
}

export interface FieldTemplate extends Omit<Field, 'id' | 'name'> {
  id: string;
  name: string;
  description: string;
  category?: FieldCategory;
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

export interface Column {
  id: string;
  name: string;
  type: string;
  description?: string;
  isNullable: boolean;
  defaultValue?: string;
}

export interface Relation {
  id: string;
  sourceTable: string;
  targetTable: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-one' | 'many-to-many';
  sourceColumn: string;
  targetColumn: string;
}

export interface Table {
  id: string;
  name: string;
  description?: string;
  fields: Field[];
  columns?: Column[];
  relations?: Relation[];
  indexes?: {
    id: string;
    name: string;
    columns: string[];
    type: 'btree' | 'hash' | 'gist' | 'gin';
  }[];
  constraints?: {
    id: string;
    name: string;
    type: 'primary' | 'unique' | 'foreign' | 'check';
    definition: string;
  }[];
  triggers?: {
    id: string;
    name: string;
    timing: 'before' | 'after';
    event: 'insert' | 'update' | 'delete';
    function: string;
  }[];
  procedures?: {
    id: string;
    name: string;
    parameters: string[];
    returnType: string;
    definition: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface TestRecord {
  id: string;
  timestamp: string;
  status: 'success' | 'failure';
  responseTime: number;
  serverInfo?: {
    version: string;
    platform: string;
    charset: string;
  };
  error?: string;
}

export interface Connection {
  id: string;
  name: string;
  type: 'mysql' | 'postgresql' | 'oracle' | 'sqlserver';
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  testHistory: TestRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  tables: Table[];
  createdAt: string;
  updatedAt: string;
  isFavorite?: boolean;
}

export type ProjectSummary = Omit<Project, 'tables'>;

export interface RootState {
  projects: ProjectState;
}

export interface ProjectState {
  items: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;
}

export interface Environment {
  id: string;
  name: string;
  variables: { [key: string]: string };
  createdAt: string;
  updatedAt: string;
}

export type BodyType = 'none' | 'form-data' | 'x-www-form-urlencoded' | 'raw';
export type RawType = 'json' | 'xml' | 'text';
export type FormDataParamType = 'text' | 'file';

export interface RequestHistory {
  id: string;
  timestamp: number;
  method: string;
  url: string;
  params: UrlParam[];
  headers: HeaderParam[];
  bodyType: BodyType;
  rawType?: RawType;
  rawContent?: string;
  formDataParams?: FormDataParam[];
  urlEncodedParams?: UrlParam[];
  response: ResponseData;
}

export interface UrlParam {
  key: string;
  value: string;
  description?: string;
  enabled: boolean;
}

export interface HeaderParam {
  key: string;
  value: string;
  description?: string;
  enabled: boolean;
}

export interface FormDataParam extends UrlParam {
  type: FormDataParamType;
  file?: UploadFile | File;
}

export interface ResponseData {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  contentType: string;
  data: any;
  rawData: string;
  responseTime: number;
  duration: number;
  size: number;
}

export interface RequestOptions {
  method: string;
  url: string;
  params: UrlParam[];
  headers: Record<string, string>;
  bodyType: BodyType;
  rawType: RawType;
  rawContent: string;
  formDataParams: Array<Omit<FormDataParam, 'file'> & { file?: File }>;
  urlEncodedParams: UrlParam[];
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

export interface ConnectionFormData {
  name: string;
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  type: Connection['type'];
}

export interface TestResult {
  status: TestRecord['status'];
  responseTime?: number;
  serverInfo?: TestRecord['serverInfo'];
  error?: string;
}

export interface ChartData {
  timestamp: Date;
  responseTime: number;
  status: TestRecord['status'];
}

export interface ChartPoint {
  x: number;
  y: number;
}

export interface ExportData {
  connections: Array<Omit<Connection, 'password'>>;
  exportTime: string;
}

export interface TestHistoryExportData {
  testHistory: Array<{
    connectionName: string;
    history: TestRecord[];
  }>;
  exportTime: string;
}

export interface Api {
  id: string;
  name: string;
  description?: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  requestParameters?: {
    query?: Array<{
      name: string;
      type: string;
      required: boolean;
      description?: string;
    }>;
    body?: {
      type: string;
      properties: Record<string, {
        type: string;
        description?: string;
        required?: boolean;
      }>;
    };
  };
  responseParameters?: {
    type: string;
    properties: Record<string, {
      type: string;
      description?: string;
    }>;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Parameter {
  id: string;
  name: string;
  type: string;
  required: boolean;
  description?: string;
}

export interface Index {
  id: string;
  name: string;
  type: 'PRIMARY' | 'UNIQUE' | 'INDEX' | 'FULLTEXT';
  fields: string[];
  comment?: string;
}

export interface ForeignKey {
  id: string;
  tableId: string;
  tableName: string;
  fieldId: string;
  fieldName: string;
  onDelete?: string;
  onUpdate?: string;
}

export interface DatabaseConnection {
  id: string;
  name: string;
  type: 'mysql' | 'postgresql' | 'mongodb';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description?: string;
  requestBody?: string;
  responseBody?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiParam {
  id: string;
  name: string;
  type: string;
  required: boolean;
  description?: string;
  example?: string;
  default_value?: string;
}

export interface ApiResponse {
  id: string;
  status_code: number;
  description?: string;
  schema: Record<string, any>;
  example?: Record<string, any>;
} 