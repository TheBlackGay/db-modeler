// HTTP方法类型
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// API状态
export type ApiStatus = 'developing' | 'completed' | 'deprecated';

// 参数类型
export type ParamType = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'null';

// 参数位置
export type ParamIn = 'query' | 'path' | 'header' | 'body';

// 参数验证规则
export interface ParamRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  minimum?: number;
  maximum?: number;
  enum?: string[];
  description?: string;
}

// API接口定义
export interface Api {
  id: string;
  group_id: string;
  name: string;
  description?: string;
  method: HttpMethod;
  path: string;
  url: string;
  status: ApiStatus;
  version: string;
  tags: string[];
  params?: ApiParam[];
  responses?: ApiResponse[];
  mockConfigs?: MockConfig[];
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}

// API分组定义
export interface ApiGroup {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
  order?: number;
  created_at: string;
  updated_at: string;
}

// API参数定义
export interface ApiParam {
  id: string;
  name: string;
  type: string;
  required: boolean;
  description?: string;
}

// API响应定义
export interface ApiResponse {
  id: string;
  status_code: number;
  content_type: string;
  description?: string;
  body?: string;
}

// Mock配置定义
export interface MockConfig {
  id: string;
  api_id: string;
  enabled: boolean;
  delay: number;
  status_code: number;
  headers?: Record<string, string>;
  response_body?: string;
  rules?: MockRule[];
}

// Mock规则定义
export interface MockRule {
  id: string;
  config_id: string;
  field: string;
  type: string;
  rule: string;
  description?: string;
  order: number;
}

// Mock响应定义
export interface MockResponse {
  status: number;
  headers: Record<string, string>;
  body: any;
}

// API表单属性
export interface ApiFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: Omit<Api, 'id' | 'created_at' | 'updated_at'>) => void;
  groups: ApiGroup[];
  initialValues?: Partial<Api>;
}

// API分组表单属性
export interface ApiGroupFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: Omit<ApiGroup, 'id' | 'created_at' | 'updated_at'>) => void;
  initialValues?: Partial<ApiGroup>;
}

// 参数表单属性
export interface ApiParamFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: Omit<ApiParam, 'id' | 'created_at' | 'updated_at'>) => void;
  initialValues?: Partial<ApiParam>;
  parentParams?: ApiParam[];
}

// 参数列表属性
export interface ApiParamListProps {
  params: ApiParam[];
  onAdd: () => void;
  onEdit: (param: ApiParam) => void;
  onDelete: (paramId: string) => void;
}

// 响应数据类型
export type ResponseType = 'json' | 'xml' | 'text' | 'html' | 'binary';

// 响应状态码类型
export type ResponseStatus = '200' | '201' | '204' | '400' | '401' | '403' | '404' | '500' | '502' | '503' | '504';

// 响应表单属性
export interface ApiResponseFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: Omit<ApiResponse, 'id' | 'created_at' | 'updated_at'>) => void;
  initialValues?: Partial<ApiResponse>;
}

// 响应列表属性
export interface ApiResponseListProps {
  responses: ApiResponse[];
  onAdd: () => void;
  onEdit: (response: ApiResponse) => void;
  onDelete: (responseId: string) => void;
}

// Mock配置表单属性
export interface MockConfigFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: Omit<MockConfig, 'id' | 'created_at' | 'updated_at'>) => void;
  initialValues?: Partial<MockConfig>;
}

// Mock规则表单属性
export interface MockRuleFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: Omit<MockRule, 'id'>) => void;
  initialValues?: Partial<MockRule>;
}

// Mock配置列表属性
export interface MockConfigListProps {
  configs: MockConfig[];
  onAdd: () => void;
  onEdit: (config: MockConfig) => void;
  onDelete: (configId: string) => void;
  onToggle: (configId: string, enabled: boolean) => void;
}

// Mock规则列表属性
export interface MockRuleListProps {
  rules: MockRule[];
  onAdd: () => void;
  onEdit: (rule: MockRule) => void;
  onDelete: (ruleId: string) => void;
  onReorder: (ruleIds: string[]) => void;
} 