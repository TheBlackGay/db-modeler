export interface ApiGroup {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
  order?: number;
  created_at: string;
  updated_at: string;
}

export interface Api {
  id: string;
  group_id: string;
  name: string;
  description?: string;
  method: string;
  path: string;
  status: string;
  order?: number;
  created_at: string;
  updated_at: string;
}

export interface ApiParam {
  id: string;
  api_id: string;
  name: string;
  type: string;
  param_in: string;
  required: boolean;
  description?: string;
  example?: string;
  default_value?: string;
  order?: number;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse {
  id: string;
  api_id: string;
  status: string;
  type: string;
  description?: string;
  example?: string;
  schema?: string;
  created_at: string;
  updated_at: string;
}

export interface MockConfig {
  id: string;
  api_id: string;
  enabled: boolean;
  delay?: number;
  status_code: number;
  headers?: Record<string, string>;
  response_body?: string;
  created_at: string;
  updated_at: string;
}

export interface MockRule {
  id: string;
  config_id: string;
  field: string;
  type: string;
  rule: string;
  description?: string;
  order?: number;
  created_at: string;
  updated_at: string;
}

export interface MockResponse {
  status: number;
  headers: Record<string, string>;
  body: any;
} 